import { eq } from 'drizzle-orm';
import { status } from 'elysia';
import { getDb, user as userTable } from '../../db';

export abstract class User {
  static async getById(userId: string, d1?: D1Database) {
    const db = getDb(d1);
    const foundUser = await db
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

    if (!foundUser) {
      throw status(404, { success: false, message: 'User not found' });
    }

    return foundUser;
  }
}
