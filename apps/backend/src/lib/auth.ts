import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer } from 'better-auth/plugins';
import { getDb } from '../db';
import * as schema from '../db/schema';

let authInstance: ReturnType<typeof initAuth> | null = null;

function initAuth(d1?: D1Database) {
  const db = getDb(d1);
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      requireEmailVerification: false,
    },
    // Bearer token support for mobile (Expo / React Native)
    plugins: [
      bearer(),
    ],
    // Disable unused paths for lean email/password prototype
    disabledPaths: [
      '/forget-password',
      '/reset-password',
      '/change-email',
      '/change-password',
      '/send-verification-email',
      '/verify-email',
      '/delete-user',
    ],
    // Extended user fields: Biometrics & Mifflin-St Jeor targets
    user: {
      additionalFields: {
        gender: { type: 'string', required: false, input: true },
        birthDate: { type: 'string', required: false, input: true },
        heightCm: { type: 'number', required: false, input: true },
        currentWeightKg: { type: 'number', required: false, input: true },
        targetWeightKg: { type: 'number', required: false, input: true },
        activityLevel: { type: 'string', required: false, defaultValue: 'moderately_active', input: true },
        fitnessGoal: { type: 'string', required: false, defaultValue: 'muscle_gain', input: true },
        bmrKcal: { type: 'number', required: false, input: false },
        tdeeKcal: { type: 'number', required: false, input: false },
        proteinTargetG: { type: 'number', required: false, input: false },
      },
    },
    // Mobile session lifecycle (30-day persistence)
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24,       // Refresh every 24 hours
    },
    // Rate limiting
    rateLimit: {
      window: 60,
      max: 20,
    },
    // Single-trip SQL joins
    advanced: {
      database: {
        joins: true,
      },
    },
  });
}

export function getAuth(d1?: D1Database) {
  if (d1) {
    return initAuth(d1);
  }
  if (!authInstance) {
    authInstance = initAuth();
  }
  return authInstance;
}

export type Auth = ReturnType<typeof initAuth>;
