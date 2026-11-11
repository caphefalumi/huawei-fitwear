import { act, fireEvent, render } from "@testing-library/react-native"
import { router, useLocalSearchParams } from "expo-router"

import { useHealth } from "@/features/health"
import { useInjuries } from "@/features/recovery"
import {
  findExercise,
  suggestedLoad,
  usePlanPreferences,
  useTrainingWeights,
} from "@/features/workout"
import { ExerciseGuideScreen } from "@/features/workout/screens/exercise-guide-screen"
import { GroupPlanScreen } from "@/features/workout/screens/group-plan-screen"
import { TrainingWeightsScreen } from "@/features/workout/screens/training-weights-screen"

jest.mock("@/features/health", () => ({
  ...jest.requireActual("@/features/health"),
  useHealth: jest.fn(),
}))
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn(), replace: jest.fn() },
  useLocalSearchParams: jest.fn(),
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

const bench = findExercise("bench-press")!

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useHealth).mockReturnValue({ sex: "Male", weightKg: 70 } as never)
  jest.mocked(useLocalSearchParams).mockReturnValue({})
  useInjuries.setState({ injuries: [] })
  usePlanPreferences.setState({ experience: "Regular" })
  useTrainingWeights.setState({ level: null, custom: {} })
})

afterEach(() => {
  jest.useRealTimers()
})

test("suggests loads from body weight, sex and level", () => {
  expect(suggestedLoad(bench, { bodyWeightKg: 70, sex: "Male", level: "Moderate" })).toBe(42.5)
  expect(suggestedLoad(bench, { bodyWeightKg: 70, sex: "Male", level: "Light" })).toBe(25)
  expect(suggestedLoad(bench, { bodyWeightKg: 70, sex: "Female", level: "Moderate" })).toBe(22.5)
  expect(
    suggestedLoad(findExercise("plank")!, { bodyWeightKg: 70, sex: "Male", level: "Strong" }),
  ).toBeNull()
})

test("lists a group's exercises without prescriptions and opens a guide", async () => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ group: "legs" })
  const screen = await render(<GroupPlanScreen />)
  expect(screen.getByText("Goblet squat")).toBeTruthy()
  expect(screen.queryByText(/x8/)).toBeNull()
  expect(screen.queryByText("Start workout")).toBeNull()
  await fireEvent.press(screen.getByLabelText("Hip thrust"))
  expect(router.push).toHaveBeenCalledWith("/exercise-guide?name=hip-thrust")
})

test("guide shows the main muscle first, the rest on Show all, and links weight to Profile", async () => {
  jest.useFakeTimers()
  jest.mocked(useLocalSearchParams).mockReturnValue({ name: "bench-press" })
  const screen = await render(<ExerciseGuideScreen />)
  expect(screen.getByText("Chest")).toBeTruthy()
  expect(screen.queryByText("Joints under load")).toBeNull()

  await fireEvent.press(screen.getByText("Show all"))
  expect(screen.getByText("Front delt, Triceps")).toBeTruthy()
  expect(screen.getByText("Shoulder, Elbow, Wrist")).toBeTruthy()

  await fireEvent.press(screen.getByLabelText("Play Bench press video"))
  expect(screen.getByLabelText("Close video")).toBeTruthy()
  await act(async () => {
    jest.advanceTimersByTime(100)
  })
  await fireEvent.press(screen.getByLabelText("Close video"))

  await fireEvent.press(screen.getByLabelText(/^Your weight 42\.5 kg/))
  expect(router.push).toHaveBeenCalledWith("/training-weights?edit=bench-press")
})

test("edits one load, follows the level for the rest, and resets to default with undo", async () => {
  const screen = await render(<TrainingWeightsScreen />)
  expect(screen.getByLabelText("Bench press, 42.5 kg, suggested")).toBeTruthy()
  expect(screen.queryByText("↺ Reset to default")).toBeNull()

  await fireEvent.press(screen.getByLabelText("Bench press, 42.5 kg, suggested"))
  await fireEvent.press(screen.getByLabelText("More weight"))
  await fireEvent.press(screen.getByLabelText("More weight"))
  await fireEvent.press(screen.getByText("Save"))
  expect(useTrainingWeights.getState().custom).toEqual({ "bench-press": 47.5 })

  await fireEvent.press(screen.getByRole("radio", { name: "Strong" }))
  expect(screen.getByLabelText("Bench press, 47.5 kg, custom")).toBeTruthy()
  expect(screen.getByLabelText("Cable fly, 12.5 kg, suggested")).toBeTruthy()

  await fireEvent.press(screen.getByText("↺ Reset to default"))
  expect(useTrainingWeights.getState()).toMatchObject({ level: null, custom: {} })
  await fireEvent.press(screen.getByText("UNDO"))
  expect(useTrainingWeights.getState()).toMatchObject({
    level: "Strong",
    custom: { "bench-press": 47.5 },
  })
})

test("opened from a guide, saving goes straight back", async () => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ edit: "bench-press" })
  const screen = await render(<TrainingWeightsScreen />)
  await fireEvent.press(screen.getByLabelText("Less weight"))
  await fireEvent.press(screen.getByText("Save"))
  expect(useTrainingWeights.getState().custom).toEqual({ "bench-press": 40 })
  expect(router.back).toHaveBeenCalledTimes(1)
})
