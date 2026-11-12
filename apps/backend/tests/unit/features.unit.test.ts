import { describe, expect, it } from "bun:test"

import { isDateKey, isValidBirthDate, shiftDateKey, toDateKey } from "../../src/lib/date"
import {
  ageFromBirthDate,
  basalMetabolicRate,
  deriveDailyTargets,
  missingProfileFields,
  nextCalorieBasis,
  scalePer100,
  sumNutrition,
} from "../../src/lib/nutrition"

describe("Calendar date keys", () => {
  it("rejects normalized impossible dates and accepts leap days only in leap years", () => {
    expect(isDateKey("2026-02-30")).toBe(false)
    expect(isDateKey("2025-02-29")).toBe(false)
    expect(isDateKey("2024-02-29")).toBe(true)
    expect(isDateKey("2026-13-01")).toBe(false)
    expect(isDateKey("2026-1-01")).toBe(false)
    expect(isDateKey("not-a-date")).toBe(false)
  })
  it("uses UTC and crosses calendar boundaries without local daylight-saving drift", () => {
    expect(toDateKey("2026-01-01T23:00:00-05:00")).toBe("2026-01-02")
    expect(shiftDateKey("2024-02-28", 1)).toBe("2024-02-29")
    expect(shiftDateKey("2026-12-31", 1)).toBe("2027-01-01")
    expect(shiftDateKey("2026-01-01", -1)).toBe("2025-12-31")
  })
})

describe("Birth date validation", () => {
  const now = new Date("2026-11-11T12:00:00Z")
  it("accepts real past dates and today, with no minimum age", () => {
    expect(isValidBirthDate("1994-04-12", now)).toBe(true)
    expect(isValidBirthDate("2000-02-29", now)).toBe(true)
    expect(isValidBirthDate("2026-11-11", now)).toBe(true)
    expect(isValidBirthDate("2026-11-10", now)).toBe(true)
  })
  it("rejects future, impossible, malformed and empty values", () => {
    expect(isValidBirthDate("2026-11-12", now)).toBe(false)
    expect(isValidBirthDate("2026-02-31", now)).toBe(false)
    expect(isValidBirthDate("1999-02-29", now)).toBe(false)
    expect(isValidBirthDate("1994-4-12", now)).toBe(false)
    expect(isValidBirthDate("12/04/1994", now)).toBe(false)
    expect(isValidBirthDate("", now)).toBe(false)
  })
})

describe("Nutrition arithmetic", () => {
  it("computes age around the UTC birthday", () => {
    expect(ageFromBirthDate("1996-11-02", new Date("2026-11-01T12:00:00Z"))).toBe(29)
    expect(ageFromBirthDate("1996-11-01", new Date("2026-11-01T12:00:00Z"))).toBe(30)
    expect(ageFromBirthDate(null)).toBeNull()
    expect(ageFromBirthDate("garbage")).toBeNull()
    expect(ageFromBirthDate("2099-01-01", new Date("2026-11-01T12:00:00Z"))).toBeNull()
  })
  it("uses Mifflin-St Jeor with fixed goal offsets rounded to 10 kcal", () => {
    expect(basalMetabolicRate({ weightKg: 70, heightCm: 175, ageYears: 30, gender: "male" })).toBe(
      1648.75,
    )
    const profile = {
      currentWeightKg: 70,
      heightCm: 175,
      birthDate: "1996-01-01",
      gender: "male",
      activityLevel: "moderately_active",
      fitnessGoal: "maintenance",
    }
    const now = new Date("2026-11-01T12:00:00Z")
    // TDEE = 1648.75 x 1.55 = 2555.56
    const maintenance = deriveDailyTargets(profile, now)!
    const gain = deriveDailyTargets({ ...profile, fitnessGoal: "muscle_gain" }, now)!
    const loss = deriveDailyTargets({ ...profile, fitnessGoal: "weight_loss" }, now)!
    expect(maintenance.calorieTargetKcal).toBe(2560)
    expect(gain.calorieTargetKcal).toBe(2860)
    expect(loss.calorieTargetKcal).toBe(2160)
    expect(maintenance.proteinTargetG).toBe(112)
    expect(gain.proteinTargetG).toBe(126)
    expect(loss.proteinTargetG).toBe(140)
    for (const target of [maintenance, gain, loss]) {
      expect(target.calorieTargetKcal % 10).toBe(0)
      expect(target.carbsTargetG).toBeGreaterThan(0)
    }
  })
  it("derives fat and carbs from the rounded kcal so macros add up", () => {
    const loss = deriveDailyTargets(
      {
        currentWeightKg: 70,
        heightCm: 175,
        birthDate: "2001-01-01",
        gender: "male",
        activityLevel: "moderately_active",
        fitnessGoal: "weight_loss",
      },
      new Date("2026-01-01T12:00:00Z"),
    )!
    // 25 years: BMR 1673.75, TDEE 2594.31, minus 400 = 2194.31 -> 2190 kcal
    expect(loss.calorieTargetKcal).toBe(2190)
    expect(loss.proteinTargetG).toBe(140)
    // 25% of 2190 kcal from fat = 60.8 g -> 61 g; the rest is carbs: 270.25 g -> 270 g
    expect(loss.fatTargetG).toBe(61)
    expect(loss.carbsTargetG).toBe(270)
    const kcalFromMacros = loss.proteinTargetG * 4 + loss.carbsTargetG * 4 + loss.fatTargetG * 9
    expect(Math.abs(kcalFromMacros - loss.calorieTargetKcal)).toBeLessThan(10)
  })
  it("gives whole-gram macros and the agreed fat share per goal (25 / 30 / 20 percent)", () => {
    const profile = {
      currentWeightKg: 70,
      heightCm: 175,
      birthDate: "1996-01-01",
      gender: "male",
      activityLevel: "moderately_active",
      fitnessGoal: "maintenance",
    }
    const now = new Date("2026-11-01T12:00:00Z")
    const byGoal = {
      weight_loss: 0.25,
      maintenance: 0.3,
      muscle_gain: 0.2,
    } as const
    for (const [goal, share] of Object.entries(byGoal)) {
      const t = deriveDailyTargets({ ...profile, fitnessGoal: goal }, now)!
      expect(Number.isInteger(t.proteinTargetG)).toBe(true)
      expect(Number.isInteger(t.carbsTargetG)).toBe(true)
      expect(Number.isInteger(t.fatTargetG)).toBe(true)
      expect(t.fatTargetG).toBe(Math.round((t.calorieTargetKcal * share) / 9))
    }
  })
  it("calculates from the basis weight and treats a reached target as maintenance", () => {
    const profile = {
      currentWeightKg: 76,
      heightCm: 175,
      birthDate: "1996-01-01",
      gender: "male",
      activityLevel: "moderately_active",
      fitnessGoal: "weight_loss",
    }
    const now = new Date("2026-11-01T12:00:00Z")
    // Basis 80 kg: BMR 1748.75, TDEE 2710.56, minus 400 -> 2310 kcal, whatever the scale says today.
    expect(
      deriveDailyTargets(profile, now, { weightKg: 80, targetReached: false })!.calorieTargetKcal,
    ).toBe(2310)
    // Reached at 70 kg: BMR 1648.75, TDEE 2555.56, offset 0 -> 2560 kcal.
    expect(
      deriveDailyTargets(profile, now, { weightKg: 70, targetReached: true })!.calorieTargetKcal,
    ).toBe(2560)
  })
  it("never goes below the minimum daily kcal for the sex on the profile", () => {
    const small = {
      currentWeightKg: 45,
      heightCm: 150,
      birthDate: "1966-01-01",
      activityLevel: "sedentary",
      fitnessGoal: "weight_loss",
    }
    const now = new Date("2026-11-01T12:00:00Z")
    expect(deriveDailyTargets({ ...small, gender: "female" }, now)!.calorieTargetKcal).toBe(1200)
    expect(deriveDailyTargets({ ...small, gender: "male" }, now)!.calorieTargetKcal).toBe(1500)
    expect(deriveDailyTargets({ ...small, gender: "other" }, now)!.calorieTargetKcal).toBe(1350)
  })
  it("reports missing profile fields instead of guessing defaults", () => {
    const empty = {
      gender: null,
      birthDate: null,
      heightCm: null,
      currentWeightKg: null,
      activityLevel: null,
      fitnessGoal: null,
    }
    expect(missingProfileFields(empty)).toEqual([
      "gender",
      "birthDate",
      "heightCm",
      "currentWeightKg",
      "activityLevel",
      "fitnessGoal",
    ])
    expect(deriveDailyTargets(empty)).toBeNull()

    const complete = {
      gender: "female",
      birthDate: "1990-05-05",
      heightCm: 165,
      currentWeightKg: 60,
      activityLevel: "lightly_active",
      fitnessGoal: "maintenance",
    }
    expect(missingProfileFields(complete)).toEqual([])
    expect(missingProfileFields({ ...complete, heightCm: 0, currentWeightKg: -1 })).toEqual([
      "heightCm",
      "currentWeightKg",
    ])
    expect(
      missingProfileFields({
        ...complete,
        gender: "unknown",
        birthDate: "not-a-date",
        activityLevel: "couch",
        fitnessGoal: "bulk",
      }),
    ).toEqual(["gender", "birthDate", "activityLevel", "fitnessGoal"])
    expect(deriveDailyTargets({ ...complete, fitnessGoal: null })).toBeNull()
  })
  it("moves the calorie basis only on 5 kg steps or on reaching the target weight", () => {
    const base = { targetWeightKg: 70, goal: "weight_loss" }
    const start = nextCalorieBasis({ ...base, basis: null, currentWeightKg: 80 })
    expect(start).toEqual({ weightKg: 80, targetReached: false })
    // Daily scale noise does not move it.
    expect(nextCalorieBasis({ ...base, basis: start, currentWeightKg: 77.1 })).toBe(start)
    expect(nextCalorieBasis({ ...base, basis: start, currentWeightKg: 81.9 })).toBe(start)
    // 5 kg away: a new basis.
    expect(nextCalorieBasis({ ...base, basis: start, currentWeightKg: 75 })).toEqual({
      weightKg: 75,
      targetReached: false,
    })
    // Reaching the target ends the loss goal, even when it is less than 5 kg from the basis.
    const near = { weightKg: 72, targetReached: false }
    expect(nextCalorieBasis({ ...base, basis: near, currentWeightKg: 69.8 })).toEqual({
      weightKg: 69.8,
      targetReached: true,
    })
    // Once reached it stays reached until the goal or target changes.
    const reached = { weightKg: 70, targetReached: true }
    expect(nextCalorieBasis({ ...base, basis: reached, currentWeightKg: 74 })).toBe(reached)
    // Gain works the other way round.
    expect(
      nextCalorieBasis({
        basis: { weightKg: 68, targetReached: false },
        currentWeightKg: 70.5,
        targetWeightKg: 70,
        goal: "muscle_gain",
      }),
    ).toEqual({ weightKg: 70.5, targetReached: true })
    // No target weight: only the 5 kg step applies. Maintenance never "reaches" anything.
    expect(
      nextCalorieBasis({
        basis: { weightKg: 80, targetReached: false },
        currentWeightKg: 74,
        targetWeightKg: null,
        goal: "weight_loss",
      }),
    ).toEqual({ weightKg: 74, targetReached: false })
    expect(
      nextCalorieBasis({
        basis: null,
        currentWeightKg: 70,
        targetWeightKg: 60,
        goal: "maintenance",
      }),
    ).toEqual({ weightKg: 70, targetReached: false })
    // Without a usable weight the basis is left alone.
    expect(nextCalorieBasis({ ...base, basis: start, currentWeightKg: null })).toBe(start)
  })
  it("scales catalogue portions and sums fractional nutrients without mutating empty totals", () => {
    const portion = scalePer100(
      { caloriesPer100: 130, proteinPer100G: 2.7, carbsPer100G: 28, fatPer100G: 0.4 },
      150,
    )
    expect(portion).toEqual({ caloriesKcal: 195, proteinG: 4.1, carbsG: 42, fatG: 0.6 })
    expect(sumNutrition([portion, portion])).toEqual({
      caloriesKcal: 390,
      proteinG: 8.2,
      carbsG: 84,
      fatG: 1.2,
    })
    expect(sumNutrition([])).toEqual({ caloriesKcal: 0, proteinG: 0, carbsG: 0, fatG: 0 })
  })
})
