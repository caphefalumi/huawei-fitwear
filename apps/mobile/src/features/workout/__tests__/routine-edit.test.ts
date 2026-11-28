import { CATALOG } from "@/features/workout/utils/catalog"
import {
  addExercises,
  canMove,
  changed,
  exerciseLine,
  moveExercise,
  restLabel,
  restoreExercise,
  setWarmUp,
  updateExercise,
} from "@/features/workout/utils/routine-edit"
import type { RoutineExercise } from "@/features/workout/utils/routines"

// The health barrel pulls in native storage; routines only need the local date key.
jest.mock("@/features/health", () => ({
  dateKey: (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
}))

const item = (key: string, warmUp = false): RoutineExercise => ({
  key,
  name: key,
  sets: 3,
  reps: 10,
  unit: "reps",
  rest: 90,
  prescription: "3x10",
  ...(warmUp ? { warmUp: true } : {}),
})
const keys = (items: RoutineExercise[]) => items.map((entry) => entry.key)
const routine = [item("band", true), item("bench"), item("row"), item("curl")]

test("labels rest and the one-line summary without middle dots", () => {
  expect(restLabel(45)).toBe("45s")
  expect(restLabel(90)).toBe("90s")
  expect(restLabel(120)).toBe("2 min")
  expect(restLabel(150)).toBe("2:30")
  expect(exerciseLine(item("bench"))).toBe("3 × 10 - 90s rest")
  expect(exerciseLine({ sets: 2, reps: 30, unit: "seconds", rest: 0 })).toBe("2 × 30s - no rest")
})

test("updating numbers keeps the prescription in step", () => {
  const [, bench] = updateExercise(routine, "bench", { sets: 4, reps: 8 })
  expect(bench).toMatchObject({ sets: 4, reps: 8, prescription: "4x8" })
})

test("a warm-up joins the end of the warm-up, and leaves to the start of the workout", () => {
  const warmed = setWarmUp(routine, "row", true)
  expect(keys(warmed)).toEqual(["band", "row", "bench", "curl"])
  expect(warmed[1]!.warmUp).toBe(true)
  const back = setWarmUp(warmed, "band", false)
  expect(keys(back)).toEqual(["row", "band", "bench", "curl"])
  expect(back[1]!.warmUp).toBeUndefined()
  expect(setWarmUp(routine, "bench", false)).toBe(routine)
})

test("moving stays inside its section", () => {
  expect(keys(moveExercise(routine, "row", -1))).toEqual(["band", "row", "bench", "curl"])
  expect(keys(moveExercise(routine, "row", 1))).toEqual(["band", "bench", "curl", "row"])
  expect(keys(moveExercise(routine, "bench", -1))).toEqual(keys(routine))
  expect(canMove(routine, "bench", -1)).toBe(false)
  expect(canMove(routine, "bench", 1)).toBe(true)
  expect(canMove(routine, "curl", 1)).toBe(false)
  expect(canMove(routine, "band", 1)).toBe(false)
})

test("picked exercises join the chosen section with defaults, skipping ones already there", () => {
  const [first, second] = CATALOG.filter((exercise) => !["bench-press"].includes(exercise.key))
  const workout = addExercises(routine, [first!, second!], false, "Maintain")
  expect(keys(workout)).toEqual([...keys(routine), first!.key, second!.key])
  expect(workout.at(-1)).toMatchObject({ sets: 3, reps: second!.reps, unit: second!.unit })
  expect(workout.at(-1)!.warmUp).toBeUndefined()

  const warm = addExercises(routine, [first!], true, "Maintain")
  expect(keys(warm)).toEqual(["band", first!.key, "bench", "row", "curl"])
  expect(warm[1]).toMatchObject({ warmUp: true, sets: 2, rest: 30 })

  const again = addExercises(workout, [first!], false, "Maintain")
  expect(again).toHaveLength(workout.length)
})

test("undo puts a removed exercise back where it was", () => {
  const removed = routine[2]!
  const without = routine.filter((entry) => entry.key !== removed.key)
  expect(keys(restoreExercise(without, removed, 2))).toEqual(keys(routine))
  expect(restoreExercise(routine, removed, 2)).toBe(routine)
})

test("the draft counts as changed for content and order, not for copies", () => {
  expect(
    changed(
      routine,
      routine.map((entry) => ({ ...entry })),
    ),
  ).toBe(false)
  expect(changed(routine, updateExercise(routine, "row", { rest: 60 }))).toBe(true)
  expect(changed(routine, moveExercise(routine, "row", 1))).toBe(true)
  expect(changed(routine, routine.slice(1))).toBe(true)
})
