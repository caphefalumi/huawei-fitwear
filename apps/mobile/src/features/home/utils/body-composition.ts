import type { Sex } from "@/features/health"

/** Body fat and lean mass estimated from the profile, as ranges when sex is not given. */
export type BodyComposition =
  | {
      status: "ready"
      /** Whole percent; `low === high` unless sex is not given. */
      bodyFat: { low: number; high: number }
      /** Whole kilograms, same order as `bodyFat`: the higher fat gives the lower lean mass. */
      leanKg: { low: number; high: number }
    }
  /** Profile fields still to fill in, named as on the Profile screen. */
  | { status: "incomplete"; missing: string[] }
  /** The formula only covers adults within a normal BMI range. */
  | { status: "unavailable"; reason: string }

const MIN_AGE = 18
const MAX_AGE = 80
const MIN_BMI = 16
const MAX_BMI = 50

/** Whole years on `now` for a `YYYY-MM-DD` birth date, or null when it cannot be read. */
export function ageOn(birthDate: string | null | undefined, now = new Date()) {
  const match = birthDate ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate) : null
  if (!match) return null
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]
  let age = now.getFullYear() - year
  if (now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day)) age--
  return age >= 0 ? age : null
}

/**
 * CUN-BAE body fat percentage (Gómez-Ambrosi et al., Diabetes Care 2012).
 * `female` is 0 for men and 1 for women.
 */
export function cunBae(bmi: number, age: number, female: 0 | 1) {
  return (
    -44.988 +
    0.503 * age +
    10.689 * female +
    3.172 * bmi -
    0.026 * bmi ** 2 +
    0.181 * bmi * female -
    0.02 * bmi * age -
    0.005 * bmi ** 2 * female +
    0.00021 * bmi ** 2 * age
  )
}

/**
 * Estimate from weight, height, sex and age. BMI-based formulas cannot tell muscle from fat,
 * so the screen rounds to whole numbers and shows no change over time.
 */
export function bodyComposition(
  profile: {
    weightKg: number | null
    heightCm: number | null
    sex: Sex | null
    birthDate: string | null | undefined
  },
  now = new Date(),
): BodyComposition {
  const age = ageOn(profile.birthDate, now)
  const missing = [
    profile.sex === null ? "Sex / gender" : null,
    age === null ? "Birthdate" : null,
    profile.heightCm === null ? "Height" : null,
    profile.weightKg === null ? "Weight" : null,
  ].filter((field): field is string => field !== null)
  if (missing.length) return { status: "incomplete", missing }

  const weight = profile.weightKg!
  const meters = profile.heightCm! / 100
  const bmi = weight / meters ** 2
  if (age! < MIN_AGE || age! > MAX_AGE)
    return { status: "unavailable", reason: "Body fat estimates are for adults aged 18 to 80." }
  if (bmi < MIN_BMI || bmi > MAX_BMI)
    return { status: "unavailable", reason: "This estimate does not cover your height and weight." }

  const sexes: (0 | 1)[] = profile.sex === "Male" ? [0] : profile.sex === "Female" ? [1] : [0, 1]
  const fats = sexes.map((female) => Math.min(60, Math.max(3, cunBae(bmi, age!, female))))
  const low = Math.round(Math.min(...fats))
  const high = Math.round(Math.max(...fats))
  return {
    status: "ready",
    bodyFat: { low, high },
    leanKg: {
      low: Math.round(weight * (1 - Math.max(...fats) / 100)),
      high: Math.round(weight * (1 - Math.min(...fats) / 100)),
    },
  }
}

/** `~19%`, or `~19-30%` when the estimate is a range. */
export const approx = ({ low, high }: { low: number; high: number }, unit: string) =>
  low === high ? `~${low}${unit}` : `~${low}-${high}${unit}`
