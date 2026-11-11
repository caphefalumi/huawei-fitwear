import { act, fireEvent, render } from "@testing-library/react-native"
import { router, useLocalSearchParams } from "expo-router"

import { dateKey, useHealth } from "@/features/health"
import { useInjuries } from "@/features/recovery"
import { usePlanPreferences, useTrainingWeights } from "@/features/workout"
import { RoutineScreen } from "@/features/workout/screens/routine-screen"
import { SessionScreen } from "@/features/workout/screens/session-screen"
import { useWorkoutLog } from "@/features/workout/store/workout-log.store"
import { repTargetKey, routineOn, type PlanInput } from "@/features/workout/utils/routines"
import { planNow, useDemoClock } from "@/lib/time/demo-clock"

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn(), dismissTo: jest.fn() },
  useLocalSearchParams: jest.fn(),
}))
jest.mock("@/features/health", () => ({
  ...jest.requireActual("@/features/health"),
  useHealth: jest.fn(),
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
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
  })
  useTrainingWeights.setState({ level: null, custom: {} })
  useWorkoutLog.setState({ finished: [] })
  // The coming Monday: Full Body on Monday, Wednesday and Friday.
  useDemoClock.setState({ offsetDays: (8 - new Date().getDay()) % 7 })
  jest.mocked(useLocalSearchParams).mockReturnValue({ date: dateKey(planNow()) })
})

afterEach(() => jest.useRealTimers())

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
  const screen = await render(<SessionScreen />)

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

  await fireEvent.press(screen.getByText("Done"))
  expect(usePlanPreferences.getState().repTargets).toEqual({
    [repTargetKey(routine.name, first.key)]: first.reps + 1,
  })
  expect(useWorkoutLog.getState().finished).toEqual([
    { date: dateKey(planNow()), routine: routine.name },
  ])
  expect(router.dismissTo).toHaveBeenCalledWith("/workout")
})
