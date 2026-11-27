import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { router, useLocalSearchParams } from "expo-router"

import { fetchPreviousProgression } from "@/features/workout/api/workout-api"
import { useWorkoutProgress, useWorkouts } from "@/features/workout/hooks/workout-hooks"
import {
  WorkoutHistoryDetailScreen,
  WorkoutHistoryScreen,
} from "@/features/workout/screens/workout-history-screen"
import { readSessionDraft } from "@/features/workout/store/session-draft.store"
import { createQueryWrapper } from "@/test-utils/query-wrapper"

jest.mock("expo-router", () => {
  const { useEffect } = jest.requireActual("react")
  return {
    router: { push: jest.fn(), back: jest.fn() },
    useLocalSearchParams: jest.fn(),
    useFocusEffect: (effect: () => void | (() => void)) => useEffect(effect, [effect]),
  }
})
jest.mock("@/features/workout/hooks/workout-hooks", () => ({
  useWorkouts: jest.fn(),
  useWorkoutProgress: jest.fn(),
  workoutQueryKeys: { all: (userId: string) => ["workouts", userId] },
}))
jest.mock("@/features/workout/api/workout-api", () => ({ fetchPreviousProgression: jest.fn() }))
jest.mock("@/features/workout/store/session-draft.store", () => ({ readSessionDraft: jest.fn() }))
jest.mock("@/features/workout/store/plan-preferences.store", () => ({
  usePlanInput: () => ({
    sessions: 3,
    goal: "Maintain",
    minutes: 45,
    injuries: [],
    likes: [],
    dislikes: [],
    emphasis: "Balanced",
    experience: "Regular",
  }),
}))
jest.mock("@/features/auth", () => ({ useAuth: () => ({ user: { id: "user-1" } }) }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

const refresh = jest.fn()
const loadMore = jest.fn()
const loadSession = jest.fn()
const refetchStats = jest.fn()
const exercise = (id: string, name: string, muscleGroup: string, repetitionUnit = "reps") => ({
  id,
  name,
  muscleGroup,
  repetitionUnit,
})
const startedAt = new Date()
startedAt.setHours(startedAt.getHours() - 2)
const completedAt = new Date(startedAt.getTime() + 52 * 60_000)
const session = {
  id: "workout-1",
  sessionTitle: "Strength day",
  startedAt: startedAt.toISOString(),
  completedAt: completedAt.toISOString(),
  avgHeartRateBpm: 128,
  totalSets: 3,
  totalReps: 24,
  totalVolumeKg: 1020,
  muscleGroups: [{ muscleGroup: "Legs", sets: 3 }],
  sets: [
    {
      id: "set-w",
      exerciseId: "barbell-squat",
      setIndex: 1,
      userConfirmedReps: 10,
      targetReps: 8,
      weightKg: 20,
      isWarmup: true,
      exercise: exercise("barbell-squat", "Squat", "Legs"),
    },
    {
      id: "set-1",
      exerciseId: "barbell-squat",
      setIndex: 2,
      userConfirmedReps: 8,
      targetReps: 10,
      detectedReps: 7,
      weightKg: 42.5,
      exercise: exercise("barbell-squat", "Squat", "Legs"),
    },
    {
      id: "set-2",
      exerciseId: "plank",
      setIndex: 3,
      userConfirmedReps: 45,
      targetReps: 45,
      weightKg: 0,
      exercise: exercise("plank", "Plank", "Core", "seconds"),
    },
  ],
}

function mockWorkouts(overrides: Record<string, unknown> = {}) {
  jest.mocked(useWorkouts).mockReturnValue({
    sessions: [],
    loading: false,
    historyMessage: null,
    error: null,
    refreshing: false,
    hasMore: false,
    refresh,
    loadMore,
    loadSession,
    ...overrides,
  } as never)
}

function mockStats(data: unknown, isError = false) {
  jest.mocked(useWorkoutProgress).mockReturnValue({ data, isError, refetch: refetchStats } as never)
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: "workout-1" })
  jest.mocked(readSessionDraft).mockResolvedValue(null)
  refresh.mockResolvedValue(undefined)
  refetchStats.mockResolvedValue(undefined)
  loadMore.mockResolvedValue(undefined)
  loadSession.mockResolvedValue(session)
  jest.mocked(fetchPreviousProgression).mockResolvedValue({ exercises: [] })
  mockWorkouts()
  mockStats(undefined)
})

test("distinguishes loading, empty, and failed history with retry", async () => {
  mockWorkouts({ loading: true, historyMessage: "Loading workouts…" })
  const screen = await render(<WorkoutHistoryScreen />)
  expect(screen.getByLabelText("Loading workout history")).toBeTruthy()
  expect(screen.queryByText("No workouts yet")).toBeNull()

  mockWorkouts()
  await screen.rerender(<WorkoutHistoryScreen />)
  expect(screen.getByText("No workouts yet")).toBeTruthy()

  mockWorkouts({ historyMessage: "Could not load history" })
  await screen.rerender(<WorkoutHistoryScreen />)
  expect(screen.getByText("Could not load history")).toBeTruthy()
  await fireEvent.press(screen.getByText("Retry"))
  expect(refresh).toHaveBeenCalledTimes(1)
})

test("groups workouts by week with a summary line and opens one", async () => {
  mockWorkouts({ sessions: [session] })
  mockStats({ byDate: [], sessions: [session] })
  const screen = await render(<WorkoutHistoryScreen />)
  expect(screen.getAllByText("This week").length).toBeGreaterThan(0)
  expect(screen.getByText("52 min - 3 sets - 1,020 kg")).toBeTruthy()
  // The card chip and the muscle group row of the overview.
  expect(screen.getAllByText("Legs")).toHaveLength(2)
  expect(screen.getByText("1 session - 1,020 kg")).toBeTruthy()
  expect(screen.getByLabelText("1 of 3 planned sessions")).toBeTruthy()
  expect(screen.getByText("Weekly volume")).toBeTruthy()
  await fireEvent.press(screen.getByText("Strength day"))
  expect(router.push).toHaveBeenCalledWith("/workout-history/workout-1")
})

test("offers to resume a workout left on this device", async () => {
  jest.mocked(readSessionDraft).mockResolvedValue({
    userId: "user-1",
    date: "2026-11-25",
    routineName: "Pull Day",
    position: 2,
    weights: [],
    logged: [[{ reps: 8, weightKg: 40 }, undefined], [{ reps: 10, weightKg: 20 }]],
    startedAt: Date.now(),
  })
  const screen = await render(<WorkoutHistoryScreen />)
  expect(await screen.findByText("Pull Day - 2 sets logged")).toBeTruthy()
  await fireEvent.press(screen.getByText("Resume workout"))
  expect(router.push).toHaveBeenCalledWith("/session?date=2026-11-25")
})

test("loads more at the end of the list and retries a failed page", async () => {
  mockWorkouts({ sessions: [session], hasMore: true })
  loadMore.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(undefined)
  const screen = await render(<WorkoutHistoryScreen />)
  await fireEvent(screen.getByTestId("workout-history-list"), "onEndReached")
  expect(await screen.findByText("Could not load more workouts. Please try again.")).toBeTruthy()
  expect(screen.getByText("Strength day")).toBeTruthy()
  await fireEvent.press(screen.getByText("Retry loading more"))
  expect(loadMore).toHaveBeenCalledTimes(2)
})

test("shows sets grouped by exercise with totals and the change since last time", async () => {
  jest.mocked(fetchPreviousProgression).mockResolvedValue({
    exercises: [
      {
        exerciseId: "barbell-squat",
        latestSessionId: "older",
        completedAt: "2026-11-18T10:00:00.000Z",
        maxWeightKg: 40,
        sets: [{ setIndex: 1, weightKg: 40, targetReps: 8, userConfirmedReps: 8 }],
      },
    ],
  })
  loadSession.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(session)
  const screen = await render(<WorkoutHistoryDetailScreen />, { wrapper: createQueryWrapper() })
  expect(await screen.findByText("Could not load this workout. Please try again.")).toBeTruthy()
  await fireEvent.press(screen.getByText("Retry"))
  expect(await screen.findByText("Squat")).toBeTruthy()
  expect(screen.getByLabelText("Time: 52 min")).toBeTruthy()
  expect(screen.getByLabelText("Sets: 2")).toBeTruthy()
  expect(screen.getByLabelText("Volume kg: 340")).toBeTruthy()
  expect(screen.getByLabelText("Avg HR: 128")).toBeTruthy()
  // Exercises start collapsed with a summary line.
  expect(screen.getByText("1 set - 340 kg + 1 warm-up")).toBeTruthy()
  expect(screen.getByText("1 set - 45 s")).toBeTruthy()
  expect(screen.queryByLabelText("Warm-up set, 20 kg, 10 reps")).toBeNull()
  await fireEvent.press(screen.getByText("Expand all"))
  expect(screen.getAllByText("Goal", { includeHiddenElements: true })).toHaveLength(2)
  expect(screen.getByText("-2")).toBeTruthy()
  expect(screen.getByText("✓")).toBeTruthy()
  expect(screen.getByText("Collapse all")).toBeTruthy()
  expect(screen.getByLabelText("Warm-up set, 20 kg, 10 reps")).toBeTruthy()
  expect(
    screen.getByLabelText("Set 1, 42.5 kg, 8 reps, 2 short of goal of 10, Watch counted 7"),
  ).toBeTruthy()
  expect(screen.getByLabelText("Set 1, body weight, 45 seconds, goal of 45 met")).toBeTruthy()
  expect(await screen.findByText("+2.5 kg vs Nov 18")).toBeTruthy()
  expect(screen.getByText("First time")).toBeTruthy()
  await fireEvent.press(screen.getByText("Plank"))
  expect(screen.queryByLabelText("Set 1, body weight, 45 seconds, goal of 45 met")).toBeNull()
  expect(screen.getByText("Expand all")).toBeTruthy()
  expect(fetchPreviousProgression).toHaveBeenCalledWith(
    expect.objectContaining({ id: "workout-1", startedAt: session.startedAt }),
    expect.anything(),
  )
})

test("shows a detail empty state when a workout has no saved sets", async () => {
  loadSession.mockResolvedValue({ ...session, sets: [] })
  const screen = await render(<WorkoutHistoryDetailScreen />, { wrapper: createQueryWrapper() })
  await waitFor(() => expect(screen.getByText("No sets saved for this workout.")).toBeTruthy())
})
