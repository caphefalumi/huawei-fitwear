import { and, eq } from 'drizzle-orm';
import { status } from 'elysia';
import { getDb, dailyTargets as dailyTargetsTable, user as userTable } from '../../db';
import { isDateKey, toDateKey } from '../../lib/date';
import { deriveDailyTargets, type MacroTargets } from '../../lib/nutrition';
import type { TargetUpsertBody } from './index';

export type ResolvedTargets = MacroTargets & {
  targetDate: string;
  source: 'stored' | 'derived';
};

export abstract class Targets {
  static async resolve(userId: string, date?: string, d1?: D1Database): Promise<ResolvedTargets> {
    const db = getDb(d1);
    const targetDate = date ?? toDateKey();
    if (!isDateKey(targetDate)) throw status(400, { success: false, message: 'date must be a valid calendar date' });

    const stored = await db
      .select()
      .from(dailyTargetsTable)
      .where(and(eq(dailyTargetsTable.userId, userId), eq(dailyTargetsTable.targetDate, targetDate)))
      .get();

    if (stored) {
      return {
        targetDate,
        source: 'stored',
        calorieTargetKcal: stored.calorieTargetKcal,
        proteinTargetG: stored.proteinTargetG,
        carbsTargetG: stored.carbsTargetG,
        fatTargetG: stored.fatTargetG,
      };
    }

    const profile = await db
      .select({
        gender: userTable.gender,
        birthDate: userTable.birthDate,
        heightCm: userTable.heightCm,
        currentWeightKg: userTable.currentWeightKg,
        activityLevel: userTable.activityLevel,
        fitnessGoal: userTable.fitnessGoal,
      })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .get();

    if (!profile) {
      throw status(404, { success: false, message: 'User not found' });
    }

    return { targetDate, source: 'derived', ...deriveDailyTargets(profile) };
  }

  static async upsert(userId: string, body: TargetUpsertBody, d1?: D1Database): Promise<ResolvedTargets> {
    const db = getDb(d1);
    const targetDate = body.date ?? toDateKey();
    if (!isDateKey(targetDate)) throw status(400, { success: false, message: 'date must be a valid calendar date' });
    const now = new Date();

    await db
      .insert(dailyTargetsTable)
      .values({
        userId,
        targetDate,
        calorieTargetKcal: body.calorieTargetKcal,
        proteinTargetG: body.proteinTargetG,
        carbsTargetG: body.carbsTargetG,
        fatTargetG: body.fatTargetG,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [dailyTargetsTable.userId, dailyTargetsTable.targetDate],
        set: {
          calorieTargetKcal: body.calorieTargetKcal,
          proteinTargetG: body.proteinTargetG,
          carbsTargetG: body.carbsTargetG,
          fatTargetG: body.fatTargetG,
          updatedAt: now,
        },
      })
      .run();

    return {
      targetDate,
      source: 'stored',
      calorieTargetKcal: body.calorieTargetKcal,
      proteinTargetG: body.proteinTargetG,
      carbsTargetG: body.carbsTargetG,
      fatTargetG: body.fatTargetG,
    };
  }

  static async remove(userId: string, date: string, d1?: D1Database) {
    if (!isDateKey(date)) throw status(400, { success: false, message: 'date must be a valid calendar date' });
    const db = getDb(d1);
    await db
      .delete(dailyTargetsTable)
      .where(and(eq(dailyTargetsTable.userId, userId), eq(dailyTargetsTable.targetDate, date)))
      .run();
    return { success: true, message: 'Daily target reset to profile-derived values' };
  }
}
