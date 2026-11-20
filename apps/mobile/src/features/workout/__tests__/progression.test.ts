import { nextLoad, type ExerciseProgression } from "../utils/progression"

const history: ExerciseProgression = {
  exerciseId: "bench-press",
  latestSessionId: "session-1",
  completedAt: "2026-01-01T00:00:00Z",
  maxWeightKg: 40,
  sets: [1, 2, 3].map((setIndex) => ({
    setIndex,
    weightKg: 40,
    targetReps: 10,
    userConfirmedReps: 10,
  })),
}

test("increases load only when every planned set meets its target", () => {
  expect(nextLoad(history, 3, 2.5)).toBe(42.5)
  expect(nextLoad({ ...history, sets: history.sets.slice(0, 2) }, 3, 2.5)).toBe(40)
  expect(
    nextLoad(
      {
        ...history,
        sets: history.sets.map((set, i) => (i === 1 ? { ...set, userConfirmedReps: 9 } : set)),
      },
      3,
      2.5,
    ),
  ).toBe(40)
})
