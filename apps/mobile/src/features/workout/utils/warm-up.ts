import type { RoutineExercise } from "./routines"

/** Most warm-up sets one exercise can have. */
export const MAX_WARM_UP_SETS = 3
/** Rest after a warm-up set, in seconds: enough to reset, not enough to cool down. */
export const WARM_UP_REST = 45

/**
 * Ramp toward the working weight: share of it and reps for each warm-up set, by how many there
 * are. Fewer reps as the load climbs, so the warm-up does not tire the working sets.
 */
const RAMPS: Record<number, { share: number; reps: number }[]> = {
  1: [{ share: 0.6, reps: 5 }],
  2: [
    { share: 0.5, reps: 8 },
    { share: 0.75, reps: 5 },
  ],
  3: [
    { share: 0.4, reps: 8 },
    { share: 0.6, reps: 5 },
    { share: 0.8, reps: 3 },
  ],
}

type Sets = Pick<RoutineExercise, "sets" | "unit" | "warmUpSets">

/** Warm-up sets this exercise runs; timed holds have none. */
export const warmUpCount = (item: Pick<RoutineExercise, "unit" | "warmUpSets">) =>
  item.unit === "reps" ? Math.min(MAX_WARM_UP_SETS, Math.max(0, item.warmUpSets ?? 0)) : 0

/** Warm-up and working sets together. */
export const allSets = (item: Sets) => item.sets + warmUpCount(item)

/** The `n`th (0-based) of `count` warm-up sets. */
export const warmUpStep = (count: number, n: number) => RAMPS[count]?.[n] ?? { share: 0.5, reps: 5 }

/** Warm-up load, rounded down to what the equipment can be set to. */
export const warmUpLoad = (workingKg: number, share: number, step: number) =>
  step > 0 ? Math.max(0, Math.floor((workingKg * share) / step) * step) : workingKg * share

/** A set in the order it is done. `set` indexes the exercise's warm-up then working sets. */
export type Slot = {
  index: number
  set: number
  warmUp: boolean
  /** Position among the exercise's warm-up sets, or among its working sets (0-based). */
  n: number
  /** How many sets of that kind the exercise has. */
  of: number
}

/** Every set of one exercise, warm-ups first, then the next exercise. */
export const sessionSlots = (exercises: Sets[]): Slot[] =>
  exercises.flatMap((exercise, index) => {
    const warm = warmUpCount(exercise)
    return Array.from({ length: warm + exercise.sets }, (_, set) =>
      set < warm
        ? { index, set, warmUp: true, n: set, of: warm }
        : { index, set, warmUp: false, n: set - warm, of: exercise.sets },
    )
  })

/** Reps (or seconds) to aim for in this set. */
export const slotTarget = (exercise: Pick<RoutineExercise, "reps">, slot: Slot) =>
  slot.warmUp ? warmUpStep(slot.of, slot.n).reps : exercise.reps

/** Rest after this set. */
export const slotRest = (exercise: Pick<RoutineExercise, "rest">, slot: Slot) =>
  slot.warmUp ? WARM_UP_REST : exercise.rest

/** `Warm-up 1 of 2` or `Set 2 of 3`. */
export const slotLabel = (slot: Slot) =>
  `${slot.warmUp ? "Warm-up" : "Set"} ${slot.n + 1} of ${slot.of}`

/** `30 kg × 8, then 45 kg × 5`, for the editor's preview. */
export function warmUpPreview(count: number, workingKg: number, step: number, unit: string) {
  return Array.from({ length: count }, (_, n) => {
    const { share, reps } = warmUpStep(count, n)
    const load = warmUpLoad(workingKg, share, step)
    return `${Number.isInteger(load) ? load : load.toFixed(1)} ${unit} × ${reps}`
  }).join(", then ")
}
