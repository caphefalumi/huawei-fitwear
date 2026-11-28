import { CATALOG } from "@/features/workout/utils/catalog"
import {
  addExercises,
  canMove,
  changed,
  exerciseLine,
  moveExercise,
  restLabel,
  restoreExercise,
  updateExercise,
} from "@/features/workout/utils/routine-edit"
import { routineMinutes, type RoutineExercise } from "@/features/workout/utils/routines"
import {
  allSets,
  sessionSlots,
  slotLabel,
  slotRest,
  slotTarget,
  warmUpCount,
  warmUpLoad,
  warmUpPreview,
} from "@/features/workout/utils/warm-up"

// The health barrel pulls in native storage; routines only need the local date key.
jest.mock("@/features/health", () => ({
  dateKey: (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
}))

const item = (key: string, extra: Partial<RoutineExercise> = {}): RoutineExercise => ({
  key,
  name: key,
  sets: 3,
  reps: 10,
  unit: "reps",
  rest: 90,
  prescription: "3x10",
  ...extra,
})
const keys = (items: RoutineExercise[]) => items.map((entry) => entry.key)
const routine = [item("bench", { warmUpSets: 2 }), item("row"), item("curl")]

describe("routine editing", () => {
  test("labels rest and the one-line summary, with warm-up sets first", () => {
    expect(restLabel(45)).toBe("45s")
    expect(restLabel(90)).toBe("90s")
    expect(restLabel(120)).toBe("2 min")
    expect(restLabel(150)).toBe("2:30")
    expect(exerciseLine(item("row"))).toBe("3 × 10 - 90s rest")
    expect(exerciseLine(routine[0]!)).toBe("2 warm-up + 3 × 10 - 90s rest")
    expect(exerciseLine({ sets: 2, reps: 30, unit: "seconds", rest: 0 })).toBe("2 × 30s - no rest")
  })

  test("updating numbers keeps the prescription in step, and None clears warm-up sets", () => {
    const [bench] = updateExercise(routine, "bench", { sets: 4, reps: 8 })
    expect(bench).toMatchObject({ sets: 4, reps: 8, prescription: "4x8", warmUpSets: 2 })
    const [cleared] = updateExercise(routine, "bench", { warmUpSets: 0 })
    expect(cleared).not.toHaveProperty("warmUpSets")
  })

  test("moving swaps neighbours and stops at either end", () => {
    expect(keys(moveExercise(routine, "row", -1))).toEqual(["row", "bench", "curl"])
    expect(keys(moveExercise(routine, "row", 1))).toEqual(["bench", "curl", "row"])
    expect(moveExercise(routine, "bench", -1)).toBe(routine)
    expect(canMove(routine, "bench", -1)).toBe(false)
    expect(canMove(routine, "bench", 1)).toBe(true)
    expect(canMove(routine, "curl", 1)).toBe(false)
  })

  test("picked exercises go to the end with the plan's defaults, skipping ones already there", () => {
    const [first, second] = CATALOG.filter((exercise) => exercise.key !== "bench")
    const added = addExercises(routine, [first!, second!], "Maintain")
    expect(keys(added)).toEqual([...keys(routine), first!.key, second!.key])
    expect(added.at(-1)).toMatchObject({ sets: 3, reps: second!.reps, unit: second!.unit })
    expect(added.at(-1)).not.toHaveProperty("warmUpSets")
    expect(addExercises(added, [first!], "Maintain")).toHaveLength(added.length)
  })

  test("undo puts a removed exercise back where it was", () => {
    const removed = routine[1]!
    const without = routine.filter((entry) => entry.key !== removed.key)
    expect(keys(restoreExercise(without, removed, 1))).toEqual(keys(routine))
    expect(restoreExercise(routine, removed, 1)).toBe(routine)
  })

  test("the draft counts as changed for content, warm-up sets and order, not for copies", () => {
    expect(
      changed(
        routine,
        routine.map((entry) => ({ ...entry })),
      ),
    ).toBe(false)
    expect(changed(routine, updateExercise(routine, "row", { rest: 60 }))).toBe(true)
    expect(changed(routine, updateExercise(routine, "row", { warmUpSets: 1 }))).toBe(true)
    expect(changed(routine, moveExercise(routine, "row", 1))).toBe(true)
    expect(changed(routine, routine.slice(1))).toBe(true)
  })
})

describe("warm-up sets", () => {
  test("only rep-counted exercises get them, capped at three", () => {
    expect(warmUpCount(item("bench", { warmUpSets: 2 }))).toBe(2)
    expect(warmUpCount(item("bench", { warmUpSets: 9 }))).toBe(3)
    expect(warmUpCount(item("plank", { unit: "seconds", warmUpSets: 2 }))).toBe(0)
    expect(allSets(item("bench", { warmUpSets: 2 }))).toBe(5)
  })

  test("a session runs an exercise's warm-ups before its working sets", () => {
    const slots = sessionSlots([
      item("bench", { warmUpSets: 2, sets: 2 }),
      item("row", { sets: 1 }),
    ])
    expect(slots.map(slotLabel)).toEqual([
      "Warm-up 1 of 2",
      "Warm-up 2 of 2",
      "Set 1 of 2",
      "Set 2 of 2",
      "Set 1 of 1",
    ])
    expect(slots.map((slot) => [slot.index, slot.set])).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 0],
    ])
    const bench = item("bench", { reps: 6, rest: 150 })
    expect(slots.slice(0, 3).map((slot) => slotTarget(bench, slot))).toEqual([8, 5, 6])
    expect(slots.slice(0, 3).map((slot) => slotRest(bench, slot))).toEqual([45, 45, 150])
  })

  test("loads ramp toward the working weight, rounded down to the equipment step", () => {
    expect(warmUpLoad(60, 0.5, 2.5)).toBe(30)
    expect(warmUpLoad(62.5, 0.75, 2.5)).toBe(45)
    expect(warmUpPreview(2, 60, 2.5, "kg")).toBe("30 kg × 8, then 45 kg × 5")
    expect(warmUpPreview(3, 100, 5, "kg")).toBe("40 kg × 8, then 60 kg × 5, then 80 kg × 3")
  })

  test("routine time counts warm-up sets with their shorter rest", () => {
    // 3 working sets of 40 s + 90 s rest, 1 min setup, then 2 warm-ups of 40 s + 45 s rest.
    expect(routineMinutes([item("bench")])).toBe(Math.round((3 * 130) / 60 + 1))
    expect(routineMinutes([item("bench", { warmUpSets: 2 })])).toBe(
      Math.round((3 * 130 + 2 * 85) / 60 + 1),
    )
  })
})
