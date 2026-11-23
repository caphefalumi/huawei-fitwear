import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, fireEvent, render } from "@testing-library/react-native"
import { router, useLocalSearchParams } from "expo-router"
import { usePreventRemove } from "expo-router/react-navigation"

import { useAuth } from "@/features/auth"
import { dateKey, useHealth } from "@/features/health"
import { useInjuries } from "@/features/recovery"
import { usePlanPreferences, useTrainingWeights } from "@/features/workout"
import { writeWorkout } from "@/features/workout/api/workout-api"
import { RoutineScreen } from "@/features/workout/screens/routine-screen"
import { SessionScreen } from "@/features/workout/screens/session-screen"
import {
  clearSessionDraft,
  readSessionDraft,
  writeSessionDraft,
} from "@/features/workout/store/session-draft.store"
import { useWorkoutLog } from "@/features/workout/store/workout-log.store"
import { repTargetKey, routineOn, type PlanInput } from "@/features/workout/utils/routines"
import { planNow, useDemoClock } from "@/lib/time/demo-clock"

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
  useLocalSearchParams: jest.fn(),
}))
jest.mock("expo-router/react-navigation", () => ({ usePreventRemove: jest.fn(() => jest.fn()) }))
jest.mock("@/features/auth", () => ({
  ...jest.requireActual("@/features/auth"),
  useAuth: jest.fn(),
}))
jest.mock("@/features/workout/api/workout-api", () => ({ writeWorkout: jest.fn() }))
jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  apiRequest: jest.fn().mockResolvedValue({ exercises: [] }),
}))
jest.mock("@/features/health", () => ({
  ...jest.requireActual("@/features/health"),
  useHealth: jest.fn(),
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))
jest.mock("@/features/workout/store/session-draft.store", () => ({
  readSessionDraft: jest.fn().mockResolvedValue(null),
  writeSessionDraft: jest.fn().mockResolvedValue(undefined),
  clearSessionDraft: jest.fn().mockResolvedValue(undefined),
}))

const input: PlanInput = {
  sessions: 3,
  minutes: 45,
  goal: "Maintain",
  injuries: [],
  likes: [],
  dislikes: [],
  emphasis: "Balanced",
  experience: "Regular",
}
const shift = (date: Date, days: number) => {
  const shifted = new Date(date)
  shifted.setDate(date.getDate() + days)
  return shifted
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useAuth).mockReturnValue({ user: { id: "user-1" } } as never)
  jest.mocked(writeWorkout).mockResolvedValue({} as never)
  jest.mocked(useHealth).mockReturnValue({
    sex: "Male",
    weightKg: 70,
    plan: { goal: "Maintain", sessions: 3, activity: "Moderate", targetWeightKg: null },
  } as never)
  useInjuries.setState({ injuries: [] })
  usePlanPreferences.setState({
    minutes: 45,
    likes: [],
    dislikes: [],
    emphasis: null,
    experience: "Regular",
    repTargets: {},
    routineOwner: null,
    customRoutines: {},
    routineStorageError: null,
  })
  useTrainingWeights.setState({ level: null, custom: {} })
  useWorkoutLog.setState({ finished: [] })
  // The coming Monday: Full Body on Monday, Wednesday and Friday.
  useDemoClock.setState({ offsetDays: (8 - new Date().getDay()) % 7 })
  jest.mocked(useLocalSearchParams).mockReturnValue({ date: dateKey(planNow()) })
  // No saved draft by default.
  jest.mocked(readSessionDraft).mockResolvedValue(null)
})

afterEach(() => jest.useRealTimers())

test("native removal prompts before discarding logged sets", async () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await fireEvent.press(await screen.findByText("Done set"))
  const [blocked, onRemove] = jest.mocked(usePreventRemove).mock.lastCall!
  expect(blocked).toBe(true)
  const repeat = jest.fn()
  await act(async () => onRemove?.({ repeat, data: { action: { type: "GO_BACK" } } }))
  expect(screen.getByText("Leave workout?")).toBeTruthy()
  await fireEvent.press(screen.getByText("Keep going"))
  expect(repeat).not.toHaveBeenCalled()
  await act(async () => onRemove?.({ repeat, data: { action: { type: "GO_BACK" } } }))
  await fireEvent.press(screen.getAllByText("Leave").at(-1)!)
  expect(repeat).toHaveBeenCalledTimes(1)
})

test("superset members alternate without rest until the round ends", async () => {
  const original = routineOn(planNow(), input)
  const [first, second] = original.exercises
  const routine = {
    ...original,
    exercises: [
      { ...first!, sets: 2, superset: "pair" },
      { ...second!, sets: 2, superset: "pair" },
    ],
  }
  usePlanPreferences.setState({
    routineOwner: "user-1",
    routineStorageError: null,
    customRoutines: { [routine.name]: routine },
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await screen.findByRole("header", { name: first!.name })
  await fireEvent.press(screen.getByText("Done set"))
  expect(screen.getByRole("header", { name: second!.name })).toBeTruthy()
  expect(screen.queryByText("Skip rest")).toBeNull()
  await fireEvent.press(screen.getByText("Done set"))
  expect(screen.getByText("Skip rest")).toBeTruthy()
  await fireEvent.press(screen.getByText("Skip rest"))
  expect(screen.getByRole("header", { name: first!.name })).toBeTruthy()
  await screen.unmount()
  queryClient.clear()
})

test("routines carry sets, rest by goal and kept rep targets", () => {
  const monday = planNow()
  const routine = routineOn(monday, input)
  const first = routine.exercises[0]!
  expect(first.rest).toBe(105)
  expect(first.prescription).toBe(`${first.sets}x8–12`)

  const kept = routineOn(monday, {
    ...input,
    repTargets: { [repTargetKey(routine.name, first.key)]: 11 },
  })
  expect(kept.exercises[0]).toMatchObject({ reps: 11, prescription: `${first.sets}x11` })
})

test("routine detail lists the exercises and starts the workout", async () => {
  const routine = routineOn(planNow(), input)
  const screen = await render(<RoutineScreen />)
  expect(screen.getByText(routine.name)).toBeTruthy()
  expect(screen.getByText(routine.exercises[0]!.name)).toBeTruthy()

  await fireEvent.press(screen.getByText("Start workout"))
  expect(router.push).toHaveBeenCalledWith(`/session?date=${dateKey(planNow())}`)
})

test("warns before full body on two days in a row", async () => {
  useWorkoutLog.setState({
    finished: [{ date: dateKey(shift(planNow(), -1)), routine: "Full Body B" }],
  })
  const screen = await render(<RoutineScreen />)
  await fireEvent.press(screen.getByText("Start workout"))
  expect(screen.getByText("Full body two days in a row?")).toBeTruthy()
  expect(router.push).not.toHaveBeenCalled()

  await fireEvent.press(screen.getByText("Start anyway"))
  expect(router.push).toHaveBeenCalledWith(`/session?date=${dateKey(planNow())}`)
})

test("runs set by set with rest, then sums up and keeps the new reps", async () => {
  jest.useFakeTimers()
  const routine = routineOn(planNow(), input)
  const first = routine.exercises[0]!
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await screen.findByRole("header", { name: first.name })

  expect(screen.getByRole("header", { name: first.name })).toBeTruthy()
  expect(screen.getByText(new RegExp(`^Set 1 of ${first.sets}`))).toBeTruthy()
  await fireEvent.press(screen.getByLabelText("More reps"))
  await fireEvent.press(screen.getByText("Done set"))

  expect(screen.getByLabelText("Rest, 1:45 left")).toBeTruthy()
  await fireEvent.press(screen.getByLabelText("Add 15 seconds"))
  expect(screen.getByLabelText("Rest, 2:00 left")).toBeTruthy()
  await act(async () => {
    jest.advanceTimersByTime(121_000)
  })
  expect(screen.getByText(new RegExp(`^Set 2 of ${first.sets}`))).toBeTruthy()
  expect(screen.getByLabelText(`${first.reps + 1} reps`)).toBeTruthy()

  // Log every remaining set as suggested.
  for (let guard = 0; guard < 40 && !screen.queryByText("Great work!"); guard++) {
    if (screen.queryByText("Skip rest")) await fireEvent.press(screen.getByText("Skip rest"))
    else await fireEvent.press(screen.getByText("Done set"))
  }

  expect(screen.getByText("Great work!")).toBeTruthy()
  expect(screen.getByText(String(routine.exercises.length))).toBeTruthy()
  expect(screen.getByText(String(routine.sets))).toBeTruthy()
  expect(screen.getByText("Use these reps next time")).toBeTruthy()
  jest.mocked(writeWorkout).mockRejectedValueOnce(new Error("Network unavailable"))
  await fireEvent.press(screen.getByText("Save workout"))
  expect(screen.getByRole("alert")).toBeTruthy()
  expect(router.dismissTo).not.toHaveBeenCalled()
  const firstAttempt = jest.mocked(writeWorkout).mock.calls[0]![0]

  await fireEvent.press(screen.getByText("Save workout"))
  expect(jest.mocked(writeWorkout).mock.calls[1]![0]).toEqual(firstAttempt)
  expect(writeWorkout).toHaveBeenCalledWith(
    expect.objectContaining({
      path: "/workouts/completed",
      body: expect.objectContaining({
        sets: expect.arrayContaining([
          expect.objectContaining({
            exerciseId: first.key,
            userConfirmedReps: first.reps + 1,
            weightKg: expect.any(Number),
          }),
        ]),
      }),
    }),
  )
  expect(usePlanPreferences.getState().repTargets).toEqual({
    [repTargetKey(routine.name, first.key)]: first.reps + 1,
  })
  expect(useWorkoutLog.getState().finished).toEqual([
    { date: dateKey(planNow()), routine: routine.name },
  ])
  expect(router.dismissTo).toHaveBeenCalledWith("/workout")
})

test("autosaves progress after each set without leaving", async () => {
  const routine = routineOn(planNow(), input)
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await screen.findByRole("header", { name: routine.exercises[0]!.name })
  expect(writeSessionDraft).toHaveBeenLastCalledWith(expect.objectContaining({ position: 0 }))

  await fireEvent.press(screen.getByText("Done set"))
  expect(writeSessionDraft).toHaveBeenLastCalledWith(
    expect.objectContaining({
      position: 1,
      logged: expect.arrayContaining([
        expect.arrayContaining([expect.objectContaining({ reps: expect.any(Number) })]),
      ]),
    }),
  )
  await screen.unmount()
  queryClient.clear()
})

test("prompts to resume a draft left on a previous day", async () => {
  const routine = routineOn(planNow(), input)
  jest.mocked(readSessionDraft).mockResolvedValue({
    userId: "user-1",
    date: dateKey(shift(planNow(), -14)),
    routineName: routine.name,
    position: 1,
    weights: routine.exercises.map(() => 50),
    logged: routine.exercises.map((ex) => Array.from({ length: ex.sets }, () => undefined)),
    startedAt: Date.now() - 86_400_000,
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await screen.findByText("Resume previous session?")
  await fireEvent.press(screen.getByText("Continue"))
  expect(screen.getByText(new RegExp(`^Set 2 of ${routine.exercises[0]!.sets}`))).toBeTruthy()
  await screen.unmount()
  queryClient.clear()
})

test("restores the in-progress set after an exit", async () => {
  const routine = routineOn(planNow(), input)
  const first = routine.exercises[0]!
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await screen.findByRole("header", { name: first.name })
  await fireEvent.press(screen.getByLabelText("More reps"))
  await fireEvent.press(screen.getByText("Done set"))
  // Whatever the last autosave wrote is what a relaunch would read back.
  const saved = jest.mocked(writeSessionDraft).mock.calls.at(-1)![0]
  await screen.unmount()

  jest.mocked(readSessionDraft).mockResolvedValue(saved)
  const relaunched = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await relaunched.findByText("Resume previous session?")
  await fireEvent.press(relaunched.getByText("Continue"))
  expect(relaunched.getByText(new RegExp(`^Set 2 of ${first.sets}`))).toBeTruthy()
  expect(relaunched.getByLabelText(`${first.reps + 1} reps`)).toBeTruthy()
  await relaunched.unmount()
  queryClient.clear()
})

test("offers a draft from another routine and restores its exercises", async () => {
  const routine = routineOn(planNow(), input)
  const snapshot = { ...routine.exercises[0]!, name: "Snapshot Squat" }
  jest.mocked(readSessionDraft).mockResolvedValue({
    userId: "user-1",
    date: dateKey(shift(planNow(), -1)),
    routineName: "Leg Day",
    position: 1,
    weights: [60],
    logged: [Array.from({ length: snapshot.sets }, () => undefined)],
    reps: 9,
    skipped: [],
    exercises: [snapshot],
    startedAt: Date.now() - 86_400_000,
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await screen.findByText(/You left "Leg Day"/)
  await fireEvent.press(screen.getByText("Continue"))
  expect(screen.getByRole("header", { name: "Snapshot Squat" })).toBeTruthy()
  expect(screen.getByText(new RegExp(`^Set 2 of ${snapshot.sets}`))).toBeTruthy()
  expect(jest.mocked(writeSessionDraft).mock.calls.at(-1)![0]).toMatchObject({
    routineName: "Leg Day",
    position: 1,
    reps: 9,
  })
  await screen.unmount()
  queryClient.clear()
})

test("prompts to resume when a matching draft exists", async () => {
  const routine = routineOn(planNow(), input)
  jest.mocked(readSessionDraft).mockResolvedValue({
    userId: "user-1",
    date: dateKey(planNow()),
    routineName: routine.name,
    position: 1,
    weights: routine.exercises.map(() => 50),
    logged: routine.exercises.map((ex) => Array.from({ length: ex.sets }, () => undefined)),
    startedAt: Date.now() - 60_000,
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await screen.findByText("Resume previous session?")
  expect(screen.getByText("Continue")).toBeTruthy()
  expect(screen.getByText("Start fresh")).toBeTruthy()
  await screen.unmount()
  queryClient.clear()
})

test("continues from draft position on resume", async () => {
  const routine = routineOn(planNow(), input)
  jest.mocked(readSessionDraft).mockResolvedValue({
    userId: "user-1",
    date: dateKey(planNow()),
    routineName: routine.name,
    position: 1,
    weights: routine.exercises.map(() => 50),
    logged: routine.exercises.map((ex) => Array.from({ length: ex.sets }, () => undefined)),
    startedAt: Date.now() - 60_000,
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await screen.findByText("Resume previous session?")
  await fireEvent.press(screen.getByText("Continue"))
  // After dismissing the prompt, the session is running (not reset to position 0)
  expect(screen.queryByText("Resume previous session?")).toBeNull()
  expect(clearSessionDraft).not.toHaveBeenCalled()
  await screen.unmount()
  queryClient.clear()
})

test("starts fresh and clears draft when user chooses start fresh", async () => {
  const routine = routineOn(planNow(), input)
  jest.mocked(readSessionDraft).mockResolvedValue({
    userId: "user-1",
    date: dateKey(planNow()),
    routineName: routine.name,
    position: 1,
    weights: routine.exercises.map(() => 50),
    logged: routine.exercises.map((ex) => Array.from({ length: ex.sets }, () => undefined)),
    startedAt: Date.now() - 60_000,
  })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await screen.findByText("Resume previous session?")
  await fireEvent.press(screen.getByText("Start fresh"))
  expect(clearSessionDraft).toHaveBeenCalledWith("user-1")
  expect(screen.queryByText("Resume previous session?")).toBeNull()
  await screen.unmount()
  queryClient.clear()
})

test("clears draft when workout is saved and completed", async () => {
  jest.useFakeTimers()
  const routine = routineOn(planNow(), input)
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <SessionScreen />
    </QueryClientProvider>,
  )
  await screen.findByRole("header", { name: routine.exercises[0]!.name })

  // Complete all sets quickly
  for (let guard = 0; guard < 40 && !screen.queryByText("Great work!"); guard++) {
    if (screen.queryByText("Skip rest")) await fireEvent.press(screen.getByText("Skip rest"))
    else await fireEvent.press(screen.getByText("Done set"))
  }
  expect(screen.getByText("Great work!")).toBeTruthy()
  await act(async () => {
    await fireEvent.press(screen.getByText("Save workout"))
  })
  expect(clearSessionDraft).toHaveBeenCalledWith("user-1")
  await screen.unmount()
  queryClient.clear()
})
