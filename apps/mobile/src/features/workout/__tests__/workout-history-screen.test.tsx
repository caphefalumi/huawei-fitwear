import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { router, useLocalSearchParams } from "expo-router"

import { useWorkouts } from "@/features/workout/hooks/workout-hooks"
import {
  WorkoutHistoryDetailScreen,
  WorkoutHistoryScreen,
} from "@/features/workout/screens/workout-history-screen"

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useLocalSearchParams: jest.fn(),
}))
jest.mock("@/features/workout/hooks/workout-hooks", () => ({ useWorkouts: jest.fn() }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

const refresh = jest.fn()
const loadMore = jest.fn()
const loadSession = jest.fn()
const session = {
  id: "workout-1",
  sessionTitle: "Strength day",
  startedAt: "2026-11-20T12:00:00.000Z",
  completedAt: "2026-11-20T13:00:00.000Z",
  sets: [
    {
      id: "set-1",
      setIndex: 1,
      userConfirmedReps: 8,
      weightKg: 42.5,
      exercise: { name: "Squat", repetitionUnit: "reps" },
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

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: "workout-1" })
  refresh.mockResolvedValue(undefined)
  loadMore.mockResolvedValue(undefined)
  loadSession.mockResolvedValue(session)
  mockWorkouts()
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

test("opens a saved workout and retries pagination without hiding existing entries", async () => {
  mockWorkouts({ sessions: [session], hasMore: true })
  loadMore.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(undefined)
  const screen = await render(<WorkoutHistoryScreen />)
  await fireEvent.press(screen.getByText("Strength day"))
  expect(router.push).toHaveBeenCalledWith({
    pathname: "/workout-history/[id]",
    params: { id: "workout-1" },
  })
  await fireEvent.press(screen.getByText("Load more"))
  expect(await screen.findByText("Could not load more workouts. Please try again.")).toBeTruthy()
  expect(screen.getByText("Strength day")).toBeTruthy()
  await fireEvent.press(screen.getByText("Retry loading more"))
  expect(loadMore).toHaveBeenCalledTimes(2)
})

test("loads saved set details, and retries a failed detail request", async () => {
  loadSession.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(session)
  const screen = await render(<WorkoutHistoryDetailScreen />)
  expect(await screen.findByText("Could not load this workout. Please try again.")).toBeTruthy()
  await fireEvent.press(screen.getByText("Retry"))
  expect(await screen.findByText("Squat")).toBeTruthy()
  expect(screen.getByText("Set 1 · 8 reps · 42.5 kg")).toBeTruthy()
  expect(screen.getByText(/^Completed /)).toBeTruthy()
  expect(loadSession).toHaveBeenCalledWith("workout-1")
})

test("shows a detail empty state when a workout has no saved sets", async () => {
  loadSession.mockResolvedValue({ ...session, sets: [] })
  const screen = await render(<WorkoutHistoryDetailScreen />)
  await waitFor(() => expect(screen.getByText("No sets saved for this workout.")).toBeTruthy())
})
