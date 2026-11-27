import type { StatsSession } from "@/features/workout/api/workout-api"
import type { WorkoutSet } from "@/features/workout/hooks/workout-hooks"
import {
  blockLine,
  compareWithPrevious,
  exerciseBlocks,
  formatDuration,
  setsByMuscleGroup,
  summarizeSets,
  summaryLine,
  targetResult,
  totalsByWeek,
  trainedDays,
  weekSections,
  weekStreak,
  weekTitle,
  weekStart,
  weeklyVolume,
} from "@/features/workout/utils/history"

// The health barrel pulls in native storage; only the local date key is needed here.
jest.mock("@/features/health", () => ({
  dateKey: (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
}))

// Thursday, Nov 26 2026, local time.
const now = new Date(2026, 10, 26, 18, 0)
const at = (month: number, day: number, hour = 9) => new Date(2026, month, day, hour).toISOString()

const stat = (startedAt: string, volume: number, groups: Record<string, number> = {}) =>
  ({
    id: startedAt,
    sessionTitle: "Push",
    workoutSplit: "Push",
    startedAt,
    completedAt: startedAt,
    totalSets: 0,
    totalReps: 0,
    totalVolumeKg: volume,
    muscleGroups: Object.entries(groups).map(([muscleGroup, sets]) => ({ muscleGroup, sets })),
  }) satisfies StatsSession

const set = (overrides: Partial<WorkoutSet> & { exerciseId: string }): WorkoutSet =>
  ({
    id: `${overrides.exerciseId}-${overrides.setIndex}`,
    setIndex: 1,
    weightKg: 0,
    targetReps: 10,
    userConfirmedReps: 10,
    detectedReps: null,
    restDurationSeconds: null,
    avgHrBpm: null,
    exercise: {
      id: overrides.exerciseId,
      name: overrides.exerciseId,
      muscleGroup: "Chest",
      repetitionUnit: "reps",
    },
    ...overrides,
  }) as WorkoutSet

test("weeks start on Monday and are titled relative to now", () => {
  expect(weekStart(now)).toEqual(new Date(2026, 10, 23))
  expect(weekStart(new Date(2026, 10, 23, 0, 5))).toEqual(new Date(2026, 10, 23))
  expect(weekStart(new Date(2026, 10, 29, 23, 59))).toEqual(new Date(2026, 10, 23))
  expect(weekTitle(new Date(2026, 10, 23), now)).toBe("This week")
  expect(weekTitle(new Date(2026, 10, 16), now)).toBe("Last week")
  expect(weekTitle(new Date(2026, 10, 9), now)).toBe("Nov 9 - 15")
  expect(weekTitle(new Date(2026, 9, 26), now)).toBe("Oct 26 - Nov 1")
  expect(weekTitle(new Date(2025, 11, 1), now)).toBe("Dec 1 - 7, 2025")
})

test("groups sessions into weeks and totals completed ones", () => {
  const sessions = [
    { id: "a", startedAt: at(10, 25), completedAt: at(10, 25, 10), totalVolumeKg: 1000 },
    { id: "b", startedAt: at(10, 23), completedAt: at(10, 23, 10), totalVolumeKg: 500 },
    { id: "c", startedAt: at(10, 20), completedAt: null },
    { id: "d", startedAt: at(10, 17), completedAt: at(10, 17, 10), totalVolumeKg: 800 },
  ]
  const sections = weekSections(sessions, now)
  expect(sections.map(({ title, data }) => [title, data.map(({ id }) => id)])).toEqual([
    ["This week", ["a", "b"]],
    ["Last week", ["c", "d"]],
  ])
  const totals = totalsByWeek(sessions)
  expect(totals.get("2026-11-23")).toEqual({ sessions: 2, volumeKg: 1500 })
  expect(totals.get("2026-11-16")).toEqual({ sessions: 1, volumeKg: 800 })
})

test("builds this week's days, eight weeks of volume, and sets per muscle group", () => {
  const sessions = [
    stat(at(10, 24), 1000, { Chest: 6, Arms: 2 }),
    stat(at(10, 26), 600, { Legs: 8 }),
    stat(at(10, 18), 2000, { Chest: 9 }),
    stat(at(9, 1), 999),
  ]
  expect(trainedDays(sessions, now)).toEqual([false, true, false, true, false, false, false])
  const weeks = weeklyVolume(sessions, now)
  expect(weeks).toHaveLength(8)
  expect(weeks[7]).toEqual({ start: new Date(2026, 10, 23), volumeKg: 1600 })
  expect(weeks[6]!.volumeKg).toBe(2000)
  expect(weeks[0]!.start).toEqual(new Date(2026, 9, 5))
  expect(setsByMuscleGroup(sessions, now, ["Chest", "Back", "Legs", "Arms"])).toEqual([
    { group: "Chest", sets: 6 },
    { group: "Back", sets: 0 },
    { group: "Legs", sets: 8 },
    { group: "Arms", sets: 2 },
  ])
})

test("streak counts weeks that met the target and never breaks on an unfinished week", () => {
  const weekOf = (day: number, month = 10) => [stat(at(month, day), 1), stat(at(month, day + 1), 1)]
  const history = [...weekOf(17), ...weekOf(10), ...weekOf(3)]
  expect(weekStreak(history, now, 2)).toBe(3)
  expect(weekStreak([...history, ...weekOf(24)], now, 2)).toBe(4)
  expect(weekStreak([...weekOf(24), ...weekOf(10)], now, 2)).toBe(1)
  expect(weekStreak(history, now, 3)).toBe(0)
})

test("summaries leave warm-ups out and count volume for rep sets only", () => {
  const sets = [
    set({ exerciseId: "bench", setIndex: 1, weightKg: 20, isWarmup: true }),
    set({ exerciseId: "bench", setIndex: 2, weightKg: 60, userConfirmedReps: 8 }),
    set({
      exerciseId: "plank",
      setIndex: 3,
      userConfirmedReps: 45,
      exercise: { id: "plank", name: "Plank", muscleGroup: "Core", repetitionUnit: "seconds" },
    } as Partial<WorkoutSet> & { exerciseId: string }),
  ]
  expect(summarizeSets(sets)).toEqual({
    totalSets: 2,
    totalReps: 8,
    totalVolumeKg: 480,
    muscleGroups: [
      { muscleGroup: "Chest", sets: 1 },
      { muscleGroup: "Core", sets: 1 },
    ],
  })
  expect(exerciseBlocks(sets).map(({ exerciseId, sets: s }) => [exerciseId, s.length])).toEqual([
    ["bench", 2],
    ["plank", 1],
  ])
})

test("summary line and durations use plain separators", () => {
  expect(formatDuration(52 * 60)).toBe("52 min")
  expect(formatDuration(65 * 60)).toBe("1 h 05 min")
  expect(
    summaryLine({
      id: "a",
      userId: "u",
      sessionTitle: "Push",
      workoutSplit: "Push",
      startedAt: "2026-11-25T10:00:00.000Z",
      completedAt: "2026-11-25T10:52:00.000Z",
      avgHeartRateBpm: null,
      maxHeartRateBpm: null,
      totalSets: 18,
      totalVolumeKg: 6240,
    }),
  ).toBe("52 min - 18 sets - 6,240 kg")
})

test("compares the top working set with the last time", () => {
  const block = exerciseBlocks([
    set({ exerciseId: "bench", setIndex: 1, weightKg: 100, isWarmup: true }),
    set({ exerciseId: "bench", setIndex: 2, weightKg: 62.5, userConfirmedReps: 8 }),
  ])[0]!
  const previous = (weightKg: number, userConfirmedReps = 8) => ({
    exerciseId: "bench",
    latestSessionId: "old",
    completedAt: "2026-11-18T12:00:00.000Z",
    maxWeightKg: weightKg,
    sets: [{ setIndex: 1, weightKg, targetReps: 8, userConfirmedReps }],
  })
  expect(compareWithPrevious(block, undefined)).toEqual({ tone: "flat", label: "First time" })
  expect(compareWithPrevious(block, previous(60))).toEqual({
    tone: "up",
    label: "+2.5 kg vs Nov 18",
  })
  expect(compareWithPrevious(block, previous(62.5))).toEqual({
    tone: "flat",
    label: "Same as Nov 18",
  })
  expect(compareWithPrevious(block, previous(70))).toEqual({
    tone: "flat",
    label: "-7.5 kg vs Nov 18",
  })
  const pushUps = exerciseBlocks([set({ exerciseId: "push-up", userConfirmedReps: 15 })])[0]!
  expect(compareWithPrevious(pushUps, { ...previous(0, 12), exerciseId: "push-up" })).toEqual({
    tone: "up",
    label: "+3 reps vs Nov 18",
  })
})

test("collapsed exercise line shows sets and volume, or reps and time without load", () => {
  const bench = exerciseBlocks([
    set({ exerciseId: "bench", setIndex: 1, weightKg: 20, isWarmup: true }),
    set({ exerciseId: "bench", setIndex: 2, weightKg: 60, userConfirmedReps: 8 }),
    set({ exerciseId: "bench", setIndex: 3, weightKg: 60, userConfirmedReps: 9 }),
  ])[0]!
  expect(blockLine(bench)).toBe("2 sets - 1,020 kg + 1 warm-up")
  const pushUps = exerciseBlocks([set({ exerciseId: "push-up", userConfirmedReps: 15 })])[0]!
  expect(blockLine(pushUps)).toBe("1 set - 15 reps")
  const plank = { ...pushUps, unit: "seconds" }
  expect(blockLine(plank)).toBe("1 set - 15 s")
})

test("marks each set against its target", () => {
  const result = (userConfirmedReps: number, targetReps = 10, isWarmup = false) =>
    targetResult({ userConfirmedReps, targetReps, isWarmup })?.mark ?? null
  expect(result(10)).toBe("✓")
  expect(result(12)).toBe("+2")
  expect(result(8)).toBe("-2")
  expect(result(0)).toBe("-10")
  expect(result(10, 10, true)).toBeNull()
  expect(result(10, 0)).toBeNull()
  expect(targetResult({ userConfirmedReps: 9, targetReps: 10 })?.met).toBe(false)
})
