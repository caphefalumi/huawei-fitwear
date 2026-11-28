import type { CatalogExercise } from "./catalog"
import { restSeconds, type RoutineExercise } from "./routines"
import { warmUpCount } from "./warm-up"

export const LIMITS = {
  sets: { min: 1, max: 20, step: 1 },
  reps: { min: 1, max: 999, step: 1 },
  seconds: { min: 5, max: 600, step: 5 },
  rest: { min: 0, max: 600, step: 15 },
} as const

/** Quick picks for rest, in seconds. */
export const REST_PRESETS = [45, 60, 90, 120, 180] as const

const WORKING_SETS = 3

type Edit = Partial<Pick<RoutineExercise, "sets" | "reps" | "rest" | "warmUpSets">>

export const prescriptionOf = (item: Pick<RoutineExercise, "sets" | "reps" | "unit">) =>
  `${item.sets}x${item.reps}${item.unit === "seconds" ? "s" : ""}`

/** `45s`, `90s`, `2 min`, `2:30`. */
export function restLabel(seconds: number) {
  if (seconds < 60 || (seconds < 120 && seconds % 60)) return `${seconds}s`
  return seconds % 60
    ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
    : `${seconds / 60} min`
}

/** `3 × 10 - 90s rest`, `2 warm-up + 3 × 8 - 2 min rest`, `2 × 30s - no rest`. */
export function exerciseLine(
  item: Pick<RoutineExercise, "sets" | "reps" | "unit" | "rest" | "warmUpSets">,
) {
  const target = item.unit === "seconds" ? `${item.reps}s` : String(item.reps)
  const warm = warmUpCount(item)
  const rest = item.rest ? `${restLabel(item.rest)} rest` : "no rest"
  return `${warm ? `${warm} warm-up + ` : ""}${item.sets} × ${target} - ${rest}`
}

/** Change one exercise's numbers, keeping its prescription in step. */
export function updateExercise(items: RoutineExercise[], key: string, patch: Edit) {
  return items.map((item) => {
    if (item.key !== key) return item
    const next = { ...item, ...patch }
    if (!next.warmUpSets) delete next.warmUpSets
    return { ...next, prescription: prescriptionOf(next) }
  })
}

/** Swap an exercise with its neighbour; no-op at either end. */
export function moveExercise(items: RoutineExercise[], key: string, direction: -1 | 1) {
  const index = items.findIndex((item) => item.key === key)
  const other = index + direction
  if (index < 0 || other < 0 || other >= items.length) return items
  const next = [...items]
  ;[next[index], next[other]] = [next[other]!, next[index]!]
  return next
}

/** Whether `moveExercise` would do anything in that direction. */
export function canMove(items: RoutineExercise[], key: string, direction: -1 | 1) {
  const index = items.findIndex((item) => item.key === key)
  return index >= 0 && items[index + direction] !== undefined
}

/** Add picked exercises to the end, with sets and rest from the plan. */
export function addExercises(items: RoutineExercise[], picked: CatalogExercise[], goal: string) {
  const added = picked
    .filter((exercise) => !items.some((item) => item.key === exercise.key))
    .map((exercise): RoutineExercise => {
      const item = {
        key: exercise.key,
        name: exercise.name,
        sets: WORKING_SETS,
        reps: exercise.reps,
        unit: exercise.unit,
        rest: restSeconds(exercise, goal),
      }
      return { ...item, prescription: prescriptionOf(item) }
    })
  return [...items, ...added]
}

/** Put an exercise back where it was before it was removed. */
export function restoreExercise(items: RoutineExercise[], removed: RoutineExercise, index: number) {
  if (items.some((item) => item.key === removed.key)) return items
  const next = [...items]
  next.splice(Math.min(index, next.length), 0, removed)
  return next
}

const fields = (item: RoutineExercise) =>
  [item.key, item.sets, item.reps, item.rest, warmUpCount(item)].join("|")

/** True when the draft differs from what was saved, in content or order. */
export const changed = (saved: RoutineExercise[], draft: RoutineExercise[]) =>
  saved.length !== draft.length ||
  saved.some((item, index) => fields(item) !== fields(draft[index]!))
