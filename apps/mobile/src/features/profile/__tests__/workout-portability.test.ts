import {
  fetchWorkoutHistory,
  fetchWorkoutSession,
  writeWorkout,
} from "@/features/workout/api/workout-api"

import {
  exportWorkoutArchive,
  importWorkoutArchive,
  parseWorkoutArchive,
} from "../workout-portability"

jest.mock("@/features/workout/api/workout-api", () => ({
  fetchWorkoutHistory: jest.fn(),
  fetchWorkoutSession: jest.fn(),
  writeWorkout: jest.fn(),
}))

const workout = {
  id: "session-1",
  userId: "owner",
  sessionTitle: "Strength",
  workoutSplit: "Full body",
  startedAt: "2026-01-01T10:00:00.000Z",
  completedAt: "2026-01-01T11:00:00.000Z",
  avgHeartRateBpm: 120,
  maxHeartRateBpm: 160,
  sets: [
    {
      id: "set-1",
      exerciseId: "squat",
      setIndex: 1,
      weightKg: 50,
      targetReps: 10,
      detectedReps: null,
      userConfirmedReps: 8,
      restDurationSeconds: 60,
      avgHrBpm: 110,
      isWarmup: true,
      exercise: {},
    },
  ],
}
const archive = () =>
  JSON.stringify({
    format: "voochealth-workout-history",
    version: 1,
    sourceUserId: "owner",
    workouts: [
      {
        ...workout,
        sets: workout.sets.map(
          ({
            exerciseId,
            setIndex,
            weightKg,
            targetReps,
            detectedReps,
            userConfirmedReps,
            restDurationSeconds,
            avgHrBpm,
            isWarmup,
          }) => ({
            exerciseId,
            setIndex,
            weightKg,
            targetReps,
            detectedReps,
            userConfirmedReps,
            restDurationSeconds,
            avgHrBpm,
            isWarmup,
          }),
        ),
      },
    ],
  })

beforeEach(() => jest.resetAllMocks())

test("exports all pages with completed workout sets and dates, reporting unfinished sessions", async () => {
  jest
    .mocked(fetchWorkoutHistory)
    .mockResolvedValueOnce({ sessions: [workout as never], count: 2 })
    .mockResolvedValueOnce({
      sessions: [{ ...workout, id: "active", completedAt: null } as never],
      count: 2,
    })
  jest.mocked(fetchWorkoutSession).mockResolvedValue(workout as never)
  const result = await exportWorkoutArchive("owner")
  expect(result.unfinished).toBe(1)
  expect(result.completed).toBe(1)
  const saved = parseWorkoutArchive(result.text).workouts[0]
  expect(saved.startedAt).toBe(workout.startedAt)
  expect(saved.completedAt).toBe(workout.completedAt)
  expect(saved.sets[0]).toMatchObject({
    exerciseId: "squat",
    weightKg: 50,
    restDurationSeconds: 60,
    isWarmup: true,
  })
  expect(fetchWorkoutHistory).toHaveBeenNthCalledWith(2, 1)
})

test("rejects malformed archives before any writes", async () => {
  const bad = JSON.parse(archive())
  bad.workouts[0].sets.push(bad.workouts[0].sets[0])
  await expect(importWorkoutArchive(JSON.stringify(bad), "other")).rejects.toThrow("invalid set")
  expect(writeWorkout).not.toHaveBeenCalled()
})

test("preserves timed set values through 999 and rejects larger values", async () => {
  const timed = JSON.parse(archive())
  timed.workouts[0].sets[0].targetReps = 999
  timed.workouts[0].sets[0].userConfirmedReps = 999
  jest.mocked(writeWorkout).mockResolvedValue({
    ...workout,
    id: "import:other:session-1",
    sets: [{ ...workout.sets[0], targetReps: 999, userConfirmedReps: 999 }],
  })
  await expect(importWorkoutArchive(JSON.stringify(timed), "other")).resolves.toBe(1)
  expect(jest.mocked(writeWorkout).mock.calls[0][0]).toMatchObject({
    body: { sets: [{ targetReps: 999, userConfirmedReps: 999, isWarmup: true }] },
  })
  timed.workouts[0].sets[0].targetReps = 1000
  await expect(importWorkoutArchive(JSON.stringify(timed), "other")).rejects.toThrow("invalid set")
})

test("imports with deterministic IDs and all metrics and can retry after uncertain failure", async () => {
  jest
    .mocked(writeWorkout)
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({ ...workout, id: "import:other:session-1" })
  await expect(importWorkoutArchive(archive(), "other")).rejects.toThrow(
    "retry the same file safely",
  )
  await expect(importWorkoutArchive(archive(), "other")).resolves.toBe(1)
  expect(writeWorkout).toHaveBeenCalledTimes(2)
  expect(jest.mocked(writeWorkout).mock.calls[1][0]).toMatchObject({
    path: "/workouts/completed",
    method: "POST",
    body: {
      id: "import:other:session-1",
      startedAt: workout.startedAt,
      completedAt: workout.completedAt,
      avgHeartRateBpm: 120,
      maxHeartRateBpm: 160,
      sets: [
        {
          exerciseId: "squat",
          setIndex: 1,
          weightKg: 50,
          targetReps: 10,
          userConfirmedReps: 8,
          restDurationSeconds: 60,
          avgHrBpm: 110,
          isWarmup: true,
        },
      ],
    },
  })
})

test("does not claim success when an existing id has different data", async () => {
  jest.mocked(writeWorkout).mockResolvedValue({ ...workout, sessionTitle: "Different" })
  await expect(importWorkoutArchive(archive(), "owner")).rejects.toThrow(
    "differs from this archive",
  )
})

test("fails export if pagination becomes incomplete", async () => {
  jest.mocked(fetchWorkoutHistory).mockResolvedValue({ sessions: [], count: 1 })
  await expect(exportWorkoutArchive("owner")).rejects.toThrow("Could not load all")
})
