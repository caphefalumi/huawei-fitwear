import type { CatalogExercise } from "./catalog"
import { restSeconds, type RoutineExercise } from "./routines"

export const LIMITS = {
  sets: { min: 1, max: 20, step: 1 },
  reps: { min: 1, max: 999, step: 1 },
  seconds: { min: 5, max: 600, step: 5 },
  rest: { min: 0, max: 600, step: 15 },
} as const

/** Quick picks for rest, in seconds. */
export const REST_PRESETS = [45, 60, 90, 120, 180] as const

const WARM_UP_SETS = 2
const WARM_UP_REST = 30
const WORKING_SETS = 3

export const prescriptionOf = (item: Pick<RoutineExercise, "sets" | "reps" | "unit">) =>
  `${item.sets}x${item.reps}${item.unit === "seconds" ? "s" : ""}`

/** `45s`, `90s`, `2 min`, `2:30`. */
export function restLabel(seconds: number) {
  if (seconds < 60 || (seconds < 120 && seconds % 60)) return `${seconds}s`
  return seconds % 60
    ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
    : `${seconds / 60} min`
}

/** `3 × 10 - 90s rest`, `2 × 30s - no rest`. */
export function exerciseLine(item: Pick<RoutineExercise, "sets" | "reps" | "unit" | "rest">) {
  const target = item.unit === "seconds" ? `${item.reps}s` : String(item.reps)
  return `${item.sets} × ${target} - ${item.rest ? `${restLabel(item.rest)} rest` : "no rest"}`
}

/** Warm-ups first, in their order, then the workout, in its order. */
const ordered = (items: RoutineExercise[]) => [
  ...items.filter((item) => item.warmUp),
  ...items.filter((item) => !item.warmUp),
]

/** Change one exercise's numbers, keeping its prescription in step. */
export function updateExercise(
  items: RoutineExercise[],
  key: string,
  patch: Partial<Pick<RoutineExercise, "sets" | "reps" | "rest">>,
) {
  return items.map((item) => {
    if (item.key !== key) return item
    const next = { ...item, ...patch }
    return { ...next, prescription: prescriptionOf(next) }
  })
}

/**
 * Move an exercise into or out of the warm-up. It joins the end of the warm-up, or the start of
 * the workout, so it lands next to where it was.
 */
export function setWarmUp(items: RoutineExercise[], key: string, warmUp: boolean) {
  const target = items.find((item) => item.key === key)
  if (!target || Boolean(target.warmUp) === warmUp) return items
  const rest = items.filter((item) => item.key !== key)
  const moved = { ...target, warmUp: warmUp || undefined }
  // Between the two sections either way: last warm-up, or first in the workout.
  return [...rest.filter((item) => item.warmUp), moved, ...rest.filter((item) => !item.warmUp)]
}

/** Swap an exercise with its neighbour inside its own section; no-op at the section's edge. */
export function moveExercise(items: RoutineExercise[], key: string, direction: -1 | 1) {
  const list = ordered(items)
  const index = list.findIndex((item) => item.key === key)
  const other = index + direction
  if (index < 0 || other < 0 || other >= list.length) return list
  if (Boolean(list[index]!.warmUp) !== Boolean(list[other]!.warmUp)) return list
  const next = [...list]
  ;[next[index], next[other]] = [next[other]!, next[index]!]
  return next
}

/** Whether `moveExercise` would do anything in that direction. */
export function canMove(items: RoutineExercise[], key: string, direction: -1 | 1) {
  const list = ordered(items)
  const index = list.findIndex((item) => item.key === key)
  const other = list[index + direction]
  return index >= 0 && other !== undefined && Boolean(other.warmUp) === Boolean(list[index]!.warmUp)
}

/** Add picked exercises to the end of the warm-up or the workout, with sensible defaults. */
export function addExercises(
  items: RoutineExercise[],
  picked: CatalogExercise[],
  warmUp: boolean,
  goal: string,
) {
  const added = picked
    .filter((exercise) => !items.some((item) => item.key === exercise.key))
    .map((exercise): RoutineExercise => {
      const sets = warmUp ? WARM_UP_SETS : WORKING_SETS
      const item = {
        key: exercise.key,
        name: exercise.name,
        sets,
        reps: exercise.reps,
        unit: exercise.unit,
        rest: warmUp ? WARM_UP_REST : restSeconds(exercise, goal),
        ...(warmUp ? { warmUp: true } : {}),
      }
      return { ...item, prescription: prescriptionOf(item) }
    })
  return warmUp
    ? [...items.filter((item) => item.warmUp), ...added, ...items.filter((item) => !item.warmUp)]
    : [...ordered(items), ...added]
}

/** Put an exercise back where it was before it was removed. */
export function restoreExercise(items: RoutineExercise[], removed: RoutineExercise, index: number) {
  if (items.some((item) => item.key === removed.key)) return items
  const next = [...items]
  next.splice(Math.min(index, next.length), 0, removed)
  return ordered(next)
}

const fields = (item: RoutineExercise) =>
  [item.key, item.sets, item.reps, item.rest, Boolean(item.warmUp)].join("|")

/** True when the draft differs from what was saved, in content or order. */
export const changed = (saved: RoutineExercise[], draft: RoutineExercise[]) =>
  saved.length !== draft.length ||
  saved.some((item, index) => fields(item) !== fields(draft[index]!))
