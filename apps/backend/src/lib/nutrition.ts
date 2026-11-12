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

/** Daily energy adjustment applied on top of TDEE, in kcal. */
const GOAL_CALORIE_OFFSETS: Record<FitnessGoal, number> = {
  weight_loss: -400,
  maintenance: 0,
  muscle_gain: 300,
}

/** Lowest daily target we will ever suggest, regardless of goal. */
const MIN_DAILY_KCAL: Record<Gender, number> = {
  male: 1500,
  female: 1200,
  other: 1350,
}

const KCAL_ROUNDING_STEP = 10

const GOAL_PROTEIN_PER_KG: Record<FitnessGoal, number> = {
  weight_loss: 2,
  maintenance: 1.6,
  muscle_gain: 1.8,
}

const GOAL_FAT_CALORIE_SHARE: Record<FitnessGoal, number> = {
  weight_loss: 0.25,
  maintenance: 0.3,
  muscle_gain: 0.2,
}

/** Weight change, in kg, that triggers a fresh kcal calculation. */
export const WEIGHT_STEP_KG = 5

const round1 = (value: number): number => Math.round(value * 10) / 10

/** Age in whole years, or null when the birthdate is missing, malformed or implausible. */
export function ageFromBirthDate(birthDate: string | null, now = new Date()): number | null {
  if (!birthDate) return null
  const parsed = new Date(birthDate)
  if (Number.isNaN(parsed.getTime())) return null

  let age = now.getUTCFullYear() - parsed.getUTCFullYear()
  const monthDelta = now.getUTCMonth() - parsed.getUTCMonth()
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < parsed.getUTCDate())) {
    age -= 1
  }
  return age >= 0 && age <= 120 ? age : null
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

export function activityMultiplier(activityLevel: string | null): number | null {
  return ACTIVITY_MULTIPLIERS[(activityLevel ?? "") as ActivityLevel] ?? null
}

/** Profile fields a daily target cannot be calculated without. */
export type ProfileField =
  | "gender"
  | "birthDate"
  | "heightCm"
  | "currentWeightKg"
  | "activityLevel"
  | "fitnessGoal"

const isGender = (value: string | null): value is Gender =>
  value === "male" || value === "female" || value === "other"
const isGoal = (value: string | null): value is FitnessGoal =>
  value !== null && Object.hasOwn(GOAL_CALORIE_OFFSETS, value)
const isPositive = (value: number | null): value is number => value !== null && value > 0

/** Lists the profile fields that are missing or invalid, in a stable order. */
export function missingProfileFields(profile: BiometricProfile, now = new Date()): ProfileField[] {
  const missing: ProfileField[] = []
  if (!isGender(profile.gender)) missing.push("gender")
  if (ageFromBirthDate(profile.birthDate, now) === null) missing.push("birthDate")
  if (!isPositive(profile.heightCm)) missing.push("heightCm")
  if (!isPositive(profile.currentWeightKg)) missing.push("currentWeightKg")
  if (activityMultiplier(profile.activityLevel) === null) missing.push("activityLevel")
  if (!isGoal(profile.fitnessGoal)) missing.push("fitnessGoal")
  return missing
}

/**
 * The weight the kcal target is calculated from. It stays put while the user logs daily
 * weights and only moves in steps, so the target does not jitter with scale noise.
 */
export type CalorieBasis = {
  weightKg: number
  /** The target weight was reached: the goal is treated as maintenance from here on. */
  targetReached: boolean
}

const hasReachedTarget = (
  goal: string | null,
  weightKg: number,
  targetWeightKg: number | null,
): boolean => {
  if (!isPositive(targetWeightKg)) return false
  if (goal === "weight_loss") return weightKg <= targetWeightKg
  if (goal === "muscle_gain") return weightKg >= targetWeightKg
  return false
}

/**
 * Moves the calorie basis forward. It changes when the target weight is reached, or when the
 * current weight is WEIGHT_STEP_KG or more away from the basis. Otherwise it is returned as is.
 * Changing the goal or the target weight clears the stored basis, so it restarts from the
 * current weight.
 */
export function nextCalorieBasis(input: {
  basis: CalorieBasis | null
  currentWeightKg: number | null
  targetWeightKg: number | null
  goal: string | null
}): CalorieBasis | null {
  const { basis, currentWeightKg, targetWeightKg, goal } = input
  if (!isPositive(currentWeightKg)) return basis
  const reached = hasReachedTarget(goal, currentWeightKg, targetWeightKg)
  if (!basis) return { weightKg: currentWeightKg, targetReached: reached }
  if (basis.targetReached) return basis
  if (reached) return { weightKg: currentWeightKg, targetReached: true }
  if (Math.abs(currentWeightKg - basis.weightKg) >= WEIGHT_STEP_KG) {
    return { weightKg: currentWeightKg, targetReached: false }
  }
  return basis
}

/**
 * Daily kcal and macro targets from the profile, or null when the profile is incomplete.
 * kcal = (BMR x activity factor) + goal offset, floored by sex and rounded to 10 kcal.
 * Macros are derived from the rounded kcal and rounded to whole grams.
 * With a `basis`, its weight is used instead of the current weight, and a reached target
 * counts as the maintenance goal.
 */
export function deriveDailyTargets(
  profile: BiometricProfile,
  now = new Date(),
  basis: CalorieBasis | null = null,
): MacroTargets | null {
  if (missingProfileFields(profile, now).length > 0) return null
  const weightKg = basis?.weightKg ?? (profile.currentWeightKg as number)
  const heightCm = profile.heightCm as number
  const gender = profile.gender as Gender
  const goal: FitnessGoal = basis?.targetReached
    ? "maintenance"
    : (profile.fitnessGoal as FitnessGoal)

  const bmr = basalMetabolicRate({
    weightKg,
    heightCm,
    ageYears: ageFromBirthDate(profile.birthDate, now) as number,
    gender,
  })
  const tdee = bmr * (activityMultiplier(profile.activityLevel) as number)
  const adjusted = Math.max(tdee + GOAL_CALORIE_OFFSETS[goal], MIN_DAILY_KCAL[gender])
  const calorieTargetKcal = Math.round(adjusted / KCAL_ROUNDING_STEP) * KCAL_ROUNDING_STEP

  const proteinTargetG = Math.round(weightKg * GOAL_PROTEIN_PER_KG[goal])
  const fatTargetG = Math.round((calorieTargetKcal * GOAL_FAT_CALORIE_SHARE[goal]) / 9)
  const carbsKcal = calorieTargetKcal - proteinTargetG * 4 - fatTargetG * 9
  const carbsTargetG = Math.round(Math.max(carbsKcal, 0) / 4)

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
