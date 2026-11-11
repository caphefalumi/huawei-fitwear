import { describe, expect, it } from "bun:test"

import { isDateKey, isValidBirthDate, shiftDateKey, toDateKey } from "../../src/lib/date"
import {
  ageFromBirthDate,
  basalMetabolicRate,
  deriveDailyTargets,
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
  })
  it("uses Mifflin-St Jeor consistently and changes targets with profile goal", () => {
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
    const maintenance = deriveDailyTargets(profile, now)
    const gain = deriveDailyTargets({ ...profile, fitnessGoal: "muscle_gain" }, now)
    const loss = deriveDailyTargets({ ...profile, fitnessGoal: "weight_loss" }, now)
    expect(maintenance.calorieTargetKcal).toBe(2556)
    expect(maintenance.proteinTargetG).toBe(112)
    expect(gain.calorieTargetKcal).toBeGreaterThan(maintenance.calorieTargetKcal)
    expect(loss.calorieTargetKcal).toBeLessThan(maintenance.calorieTargetKcal)
    expect(loss.proteinTargetG).toBe(140)
    expect(maintenance.carbsTargetG).toBeGreaterThan(0)
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
