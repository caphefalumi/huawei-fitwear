export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active"

export type FitnessGoal = "weight_loss" | "maintenance" | "muscle_gain"

export type Gender = "male" | "female" | "other"

export type MacroTargets = {
  calorieTargetKcal: number
  proteinTargetG: number
  carbsTargetG: number
  fatTargetG: number
}

export type BiometricProfile = {
  gender: string | null
  birthDate: string | null
  heightCm: number | null
  currentWeightKg: number | null
  activityLevel: string | null
  fitnessGoal: string | null
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
}

const GOAL_CALORIE_FACTORS: Record<FitnessGoal, number> = {
  weight_loss: 0.8,
  maintenance: 1,
  muscle_gain: 1.1,
}

const GOAL_PROTEIN_PER_KG: Record<FitnessGoal, number> = {
  weight_loss: 2,
  maintenance: 1.6,
  muscle_gain: 1.8,
}

const GOAL_FAT_CALORIE_SHARE: Record<FitnessGoal, number> = {
  weight_loss: 0.25,
  maintenance: 0.3,
  muscle_gain: 0.25,
}

export const FALLBACK_HEIGHT_CM = 170
export const FALLBACK_WEIGHT_KG = 70
export const FALLBACK_AGE_YEARS = 30

const round1 = (value: number): number => Math.round(value * 10) / 10

export function ageFromBirthDate(birthDate: string | null, now = new Date()): number {
  if (!birthDate) return FALLBACK_AGE_YEARS
  const parsed = new Date(birthDate)
  if (Number.isNaN(parsed.getTime())) return FALLBACK_AGE_YEARS

  let age = now.getUTCFullYear() - parsed.getUTCFullYear()
  const monthDelta = now.getUTCMonth() - parsed.getUTCMonth()
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < parsed.getUTCDate())) {
    age -= 1
  }
  return age >= 0 && age <= 120 ? age : FALLBACK_AGE_YEARS
}

export function basalMetabolicRate(input: {
  weightKg: number
  heightCm: number
  ageYears: number
  gender: Gender
}): number {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.ageYears
  if (input.gender === "male") return base + 5
  if (input.gender === "female") return base - 161
  return base - 78
}

export function activityMultiplier(activityLevel: string | null): number {
  return (
    ACTIVITY_MULTIPLIERS[(activityLevel ?? "") as ActivityLevel] ??
    ACTIVITY_MULTIPLIERS.moderately_active
  )
}

export function deriveDailyTargets(profile: BiometricProfile, now = new Date()): MacroTargets {
  const weightKg =
    profile.currentWeightKg && profile.currentWeightKg > 0
      ? profile.currentWeightKg
      : FALLBACK_WEIGHT_KG
  const heightCm = profile.heightCm && profile.heightCm > 0 ? profile.heightCm : FALLBACK_HEIGHT_CM
  const gender = (profile.gender ?? "other") as Gender
  const goal = (
    GOAL_CALORIE_FACTORS[(profile.fitnessGoal ?? "") as FitnessGoal] !== undefined
      ? profile.fitnessGoal
      : "maintenance"
  ) as FitnessGoal

  const bmr = basalMetabolicRate({
    weightKg,
    heightCm,
    ageYears: ageFromBirthDate(profile.birthDate, now),
    gender,
  })

  const calorieTargetKcal = Math.round(
    bmr * activityMultiplier(profile.activityLevel) * GOAL_CALORIE_FACTORS[goal],
  )
  const proteinTargetG = round1(weightKg * GOAL_PROTEIN_PER_KG[goal])
  const fatTargetG = round1((calorieTargetKcal * GOAL_FAT_CALORIE_SHARE[goal]) / 9)
  const carbsKcal = calorieTargetKcal - proteinTargetG * 4 - fatTargetG * 9
  const carbsTargetG = round1(Math.max(carbsKcal, 0) / 4)

  return { calorieTargetKcal, proteinTargetG, carbsTargetG, fatTargetG }
}

export type NutritionTotals = {
  caloriesKcal: number
  proteinG: number
  carbsG: number
  fatG: number
}

export const EMPTY_TOTALS: NutritionTotals = { caloriesKcal: 0, proteinG: 0, carbsG: 0, fatG: 0 }

export function sumNutrition(items: NutritionTotals[]): NutritionTotals {
  return items.reduce<NutritionTotals>(
    (acc, item) => ({
      caloriesKcal: round1(acc.caloriesKcal + item.caloriesKcal),
      proteinG: round1(acc.proteinG + item.proteinG),
      carbsG: round1(acc.carbsG + item.carbsG),
      fatG: round1(acc.fatG + item.fatG),
    }),
    EMPTY_TOTALS,
  )
}

export function scalePer100(
  per100: {
    caloriesPer100: number
    proteinPer100G: number
    carbsPer100G: number
    fatPer100G: number
  },
  weightG: number,
): NutritionTotals {
  const factor = weightG / 100
  return {
    caloriesKcal: Math.round(per100.caloriesPer100 * factor),
    proteinG: round1(per100.proteinPer100G * factor),
    carbsG: round1(per100.carbsPer100G * factor),
    fatG: round1(per100.fatPer100G * factor),
  }
}
