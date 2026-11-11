import { create } from "zustand"

import { useHealth, type Sex } from "@/features/health"

import type { CatalogExercise, MuscleGroup } from "../utils/catalog"
import type { Experience } from "../utils/routines"
import { usePlanPreferences } from "./plan-preferences.store"

export type StrengthLevel = "Light" | "Moderate" | "Strong"

/** One short line per level, all on the same scale (time spent lifting), so users can place themselves quickly. */
export const STRENGTH_LEVELS: readonly { level: StrengthLevel; note: string; factor: number }[] = [
  { level: "Light", note: "New, or back after a break", factor: 0.6 },
  { level: "Moderate", note: "Lifting 6+ months", factor: 1 },
  { level: "Strong", note: "Lifting 2+ years", factor: 1.4 },
]

/**
 * Share of body weight a "Moderate" man would use for 10 to 12 good reps.
 * Exercises missing here are done with body weight only.
 */
const LOAD_RATIO: Record<string, number> = {
  "bench-press": 0.6,
  "incline-dumbbell-press": 0.16,
  "dumbbell-press": 0.18,
  "machine-chest-press": 0.55,
  "seated-incline-press": 0.45,
  "cable-chest-fly": 0.12,
  "high-to-low-cable-fly": 0.12,
  "pec-deck": 0.4,
  "lat-pulldown": 0.55,
  "seated-cable-row": 0.55,
  "one-arm-dumbbell-row": 0.25,
  "machine-row": 0.5,
  "face-pull": 0.2,
  "chest-supported-row": 0.18,
  "barbell-squat": 0.8,
  "romanian-deadlift": 0.7,
  "leg-press": 1.4,
  "hip-thrust": 0.35,
  "seated-leg-curl": 0.4,
  "leg-extension": 0.45,
  "goblet-squat": 0.25,
  "bulgarian-split-squat": 0.12,
  "walking-lunge": 0.12,
  "cable-glute-kickback": 0.1,
  "hip-abduction-machine": 0.5,
  "shoulder-press": 0.14,
  "machine-shoulder-press": 0.4,
  "lateral-raise": 0.07,
  "rear-delt-fly": 0.06,
  "cable-curl": 0.2,
  "hammer-curl": 0.12,
  "triceps-pushdown": 0.25,
  "overhead-rope-extension": 0.2,
  "incline-dumbbell-curl": 0.1,
  "cable-crunch": 0.4,
  "pallof-press": 0.15,
}

/** Women's starting loads relative to men's, by muscle group. */
const FEMALE_FACTOR: Record<MuscleGroup, number> = {
  Chest: 0.55,
  Back: 0.6,
  Shoulders: 0.55,
  Arms: 0.55,
  Legs: 0.85,
  Core: 0.75,
}

/** Used until the user logs a body weight. */
const FALLBACK_BODY_WEIGHT = { Female: 60, Male: 70 }

export const defaultLevel = (experience: Experience): StrengthLevel =>
  experience === "Beginner" ? "Light" : "Moderate"

export const loadStep = (exercise: CatalogExercise) => (exercise.equipment === "dumbbell" ? 1 : 2.5)
export const loadUnit = (exercise: CatalogExercise) =>
  exercise.equipment === "dumbbell" ? "kg/hand" : "kg"
export const formatLoad = (kg: number) => (Number.isInteger(kg) ? String(kg) : kg.toFixed(1))

type LoadInput = { bodyWeightKg: number; sex: Sex | null; level: StrengthLevel }

/** Suggested starting load in kg, or null when the exercise uses body weight only. */
export function suggestedLoad(exercise: CatalogExercise, input: LoadInput): number | null {
  const ratio = LOAD_RATIO[exercise.key]
  if (ratio === undefined) return null
  const level = STRENGTH_LEVELS.find((item) => item.level === input.level)?.factor ?? 1
  const sex = input.sex === "Female" ? FEMALE_FACTOR[exercise.group] : 1
  const step = loadStep(exercise)
  return Math.max(step, Math.round((input.bodyWeightKg * ratio * level * sex) / step) * step)
}

type Snapshot = { level: StrengthLevel | null; custom: Record<string, number> }
type TrainingWeightsState = Snapshot & {
  setLevel: (level: StrengthLevel) => void
  /** Saves a custom load, or goes back to the suggestion with null. */
  setLoad: (key: string, kg: number | null) => void
  /** Back to the defaults; returns the old values so the reset can be undone. */
  reset: () => Snapshot
  restore: (snapshot: Snapshot) => void
}

/** Session-scoped mock until training weights are stored on the server. */
export const useTrainingWeights = create<TrainingWeightsState>((set, get) => ({
  level: null,
  custom: {},
  setLevel: (level) => set({ level }),
  setLoad: (key, kg) =>
    set((state) => {
      const custom = { ...state.custom }
      if (kg === null) delete custom[key]
      else custom[key] = kg
      return { custom }
    }),
  reset: () => {
    const { level, custom } = get()
    set({ level: null, custom: {} })
    return { level, custom }
  },
  restore: (snapshot) => set(snapshot),
}))

export type ExerciseLoad = { kg: number; suggested: number; custom: boolean }

/** The user's level and a lookup for each exercise's load. Profile is the only place loads change. */
export function useLoads() {
  const { weightKg, sex } = useHealth()
  const experience = usePlanPreferences((state) => state.experience)
  const { level: chosen, custom } = useTrainingWeights()
  const level = chosen ?? defaultLevel(experience)
  const measured = weightKg !== null
  const bodyWeightKg = weightKg ?? FALLBACK_BODY_WEIGHT[sex === "Female" ? "Female" : "Male"]

  function loadFor(exercise: CatalogExercise): ExerciseLoad | null {
    const suggested = suggestedLoad(exercise, { bodyWeightKg, sex, level })
    if (suggested === null) return null
    const saved = custom[exercise.key]
    return { kg: saved ?? suggested, suggested, custom: saved !== undefined }
  }

  return {
    level,
    bodyWeightKg,
    measured,
    changed: chosen !== null || Object.keys(custom).length > 0,
    loadFor,
  }
}
