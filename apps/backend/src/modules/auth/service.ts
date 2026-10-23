import { eq } from 'drizzle-orm';
import { Elysia, status } from 'elysia';
import { getDb, user as userTable, session as sessionTable } from '../../db';
import { hashPassword, verifyPassword } from '../../lib/password';
import { generateId, generateToken } from '../../lib/id';

import type { SignUpBody, SignInBody, UpdateUserBody } from './model';

export abstract class Auth {
  static async signUp(data: SignUpBody, d1?: D1Database) {
    const db = getDb(d1);
    const email = data.email.toLowerCase();

    const existing = await db
      .select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.email, email))
      .get();

    if (existing) {
      throw status(400, { success: false, message: 'A user with this email address already exists' });
    }

    const hashedPassword = await hashPassword(data.password);
    const userId = generateId();
    const sessionId = generateId();
    const token = generateToken();
    const now = new Date();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const newUser = {
      id: userId,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      name: data.name ?? null,
      emailVerified: false,
      gender: data.gender ?? null,
      birthDate: data.birthDate ?? null,
      heightCm: data.heightCm ?? null,
      currentWeightKg: data.currentWeightKg ?? null,
      targetWeightKg: data.targetWeightKg ?? null,
      activityLevel: data.activityLevel ?? 'moderately_active',
      fitnessGoal: data.fitnessGoal ?? 'muscle_gain',
      createdAt: now,
      updatedAt: now,
    };

    const newSession = {
      id: sessionId,
      token,
      userId,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    };

    await db.batch([
      db.insert(userTable).values(newUser),
      db.insert(sessionTable).values(newSession),
    ]);

    const { password: _, ...safeUser } = newUser;

    return {
      user: safeUser,
      session: {
        id: newSession.id,
        token: newSession.token,
        expiresAt: newSession.expiresAt.toISOString(),
        userId: newSession.userId,
      },
    };
  }

  static async signIn(data: SignInBody, d1?: D1Database) {
    const db = getDb(d1);
    const email = data.email.toLowerCase();

    const foundUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .get();

    if (!foundUser) {
      throw status(401, { success: false, message: 'Invalid email or password' });
    }

    const isValid = await verifyPassword(data.password, foundUser.password);
    if (!isValid) {
      throw status(401, { success: false, message: 'Invalid email or password' });
    }

    const sessionId = generateId();
    const token = generateToken();
    const now = new Date();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const newSession = {
      id: sessionId,
      token,
      userId: foundUser.id,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(sessionTable).values(newSession).run();

    const { password: _, ...safeUser } = foundUser;

    return {
      user: safeUser,
      session: {
        id: newSession.id,
        token: newSession.token,
        expiresAt: newSession.expiresAt.toISOString(),
        userId: newSession.userId,
      },
    };
  }

  static async validateSession(token: string, d1?: D1Database) {
    const db = getDb(d1);

    const record = await db
      .select({
        user: {
          id: userTable.id,
          email: userTable.email,
          name: userTable.name,
          emailVerified: userTable.emailVerified,
          image: userTable.image,
          gender: userTable.gender,
          birthDate: userTable.birthDate,
          heightCm: userTable.heightCm,
          currentWeightKg: userTable.currentWeightKg,
          targetWeightKg: userTable.targetWeightKg,
          activityLevel: userTable.activityLevel,
          fitnessGoal: userTable.fitnessGoal,
          createdAt: userTable.createdAt,
          updatedAt: userTable.updatedAt,
        },
        session: sessionTable,
      })
      .from(sessionTable)
      .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
      .where(eq(sessionTable.token, token))
      .get();

    if (!record) return null;

    if (new Date(record.session.expiresAt).getTime() <= Date.now()) {
      await db.delete(sessionTable).where(eq(sessionTable.id, record.session.id)).run();
      return null;
    }

    return {
      user: record.user,
      session: record.session,
    };
  }

  static async signOut(token: string, d1?: D1Database) {
    const db = getDb(d1);
    await db.delete(sessionTable).where(eq(sessionTable.token, token)).run();
    return { success: true, message: 'Signed out successfully' };
  }

  static async updateUser(userId: string, data: UpdateUserBody, d1?: D1Database) {
    const db = getDb(d1);

    await db
      .update(userTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, userId))
      .run();

    const updatedUser = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
        emailVerified: userTable.emailVerified,
        image: userTable.image,
        gender: userTable.gender,
        birthDate: userTable.birthDate,
        heightCm: userTable.heightCm,
        currentWeightKg: userTable.currentWeightKg,
        targetWeightKg: userTable.targetWeightKg,
        activityLevel: userTable.activityLevel,
        fitnessGoal: userTable.fitnessGoal,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
      })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .get();

    if (!updatedUser) {
      throw status(404, { success: false, message: 'User not found' });
    }

    return updatedUser;
  }
}

export const authGuard = new Elysia({ name: 'authGuard' })
  .macro({
    auth: (enabled: boolean) => {
      if (!enabled) return {};
      return {
        detail: {
          security: [{ bearerAuth: [] }],
        },
        async resolve({ request, cookie: { session_token }, status: setStatus }) {
          let token: string | null = null;
          const authHeader = request.headers.get('authorization');
          if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7).trim();
          } else if (session_token?.value) {
            token = session_token.value as string;
          }

          if (!token) {
            throw setStatus(401, { success: false, message: 'Unauthorized: missing authentication token' });
          }

          const authData = await Auth.validateSession(token);
          if (!authData) {
            throw setStatus(401, { success: false, message: 'Unauthorized: invalid or expired session' });
          }

          return {
            user: authData.user,
            session: authData.session,
            token,
          };
        },
      };
    },
  });
