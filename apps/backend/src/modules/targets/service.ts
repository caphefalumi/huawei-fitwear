import { and, eq } from "drizzle-orm"
import { status } from "elysia"

import { getDb, dailyTargets as dailyTargetsTable, user as userTable } from "../../db"
import { isDateKey, toDateKey } from "../../lib/date"
import {
  deriveDailyTargets,
  missingProfileFields,
  nextCalorieBasis,
  type MacroTargets,
  type ProfileField,
} from "../../lib/nutrition"
import type { TargetUpsertBody } from "./index"

/**
 * Targets for a date. `targets` is null while the profile is incomplete, and
 * `missingFields` lists what the user still has to fill in.
 */
export type ResolvedTargets = {
  targetDate: string
  profileComplete: boolean
  missingFields: ProfileField[]
  /** The target weight was reached, so the kcal target follows the maintenance goal. */
  targetReached: boolean
  targets: MacroTargets | null
}

export type StoredTargets = MacroTargets & { targetDate: string; source: "stored" }

export abstract class Targets {
  /** Always derived from the profile. Stored per-day overrides are not read here. */
  static async resolve(userId: string, date?: string, d1?: D1Database): Promise<ResolvedTargets> {
    const db = getDb(d1)
    const targetDate = date ?? toDateKey()
    if (!isDateKey(targetDate))
      throw status(400, { success: false, message: "date must be a valid calendar date" })

    const profile = await db
      .select({
        gender: userTable.gender,
        birthDate: userTable.birthDate,
        heightCm: userTable.heightCm,
        currentWeightKg: userTable.currentWeightKg,
        activityLevel: userTable.activityLevel,
        fitnessGoal: userTable.fitnessGoal,
        targetWeightKg: userTable.targetWeightKg,
        calorieWeightKg: userTable.calorieWeightKg,
        targetReached: userTable.targetReached,
      })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .get()

    if (!profile) {
      throw status(404, { success: false, message: "User not found" })
    }

    const missingFields = missingProfileFields(profile)
    if (missingFields.length > 0) {
      return {
        targetDate,
        profileComplete: false,
        missingFields,
        targetReached: false,
        targets: null,
      }
    }

    // Kcal is calculated from a basis weight that only moves in steps (or on reaching the
    // target weight), not from today's scale reading. Save the basis when it moves.
    const stored =
      profile.calorieWeightKg === null
        ? null
        : { weightKg: profile.calorieWeightKg, targetReached: profile.targetReached }
    const basis = nextCalorieBasis({
      basis: stored,
      currentWeightKg: profile.currentWeightKg,
      targetWeightKg: profile.targetWeightKg,
      goal: profile.fitnessGoal,
    })
    if (
      basis &&
      (basis.weightKg !== stored?.weightKg || basis.targetReached !== stored?.targetReached)
    ) {
      await db
        .update(userTable)
        .set({ calorieWeightKg: basis.weightKg, targetReached: basis.targetReached })
        .where(eq(userTable.id, userId))
        .run()
    }

    return {
      targetDate,
      profileComplete: true,
      missingFields,
      targetReached: basis?.targetReached ?? false,
      targets: deriveDailyTargets(profile, new Date(), basis),
    }
  }

  static async upsert(
    userId: string,
    body: TargetUpsertBody,
    d1?: D1Database,
  ): Promise<StoredTargets> {
    const db = getDb(d1)
    const targetDate = body.date ?? toDateKey()
    if (!isDateKey(targetDate))
      throw status(400, { success: false, message: "date must be a valid calendar date" })
    const now = new Date()

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
      .run()

    return {
      targetDate,
      source: "stored",
      calorieTargetKcal: body.calorieTargetKcal,
      proteinTargetG: body.proteinTargetG,
      carbsTargetG: body.carbsTargetG,
      fatTargetG: body.fatTargetG,
    }
  }

  static async remove(userId: string, date: string, d1?: D1Database) {
    if (!isDateKey(date))
      throw status(400, { success: false, message: "date must be a valid calendar date" })
    const db = getDb(d1)
    await db
      .delete(dailyTargetsTable)
      .where(and(eq(dailyTargetsTable.userId, userId), eq(dailyTargetsTable.targetDate, date)))
      .run()
    return { success: true, message: "Stored daily target deleted" }
  }
}
