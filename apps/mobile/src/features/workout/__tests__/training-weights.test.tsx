import { fireEvent, render } from "@testing-library/react-native"
import { router, useLocalSearchParams } from "expo-router"
import { useIsFocused } from "expo-router/react-navigation"
import { AccessibilityInfo } from "react-native"

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
import { loadExerciseLoop } from "@/features/workout/utils/exercise-loop-cache"
import { exerciseLoops } from "@/features/workout/utils/exercise-loops"

jest.mock("@/features/health", () => ({
  ...jest.requireActual("@/features/health"),
  useHealth: jest.fn(),
}))
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn(), replace: jest.fn() },
  useLocalSearchParams: jest.fn(),
}))
jest.mock("expo-router/react-navigation", () => ({ useIsFocused: jest.fn() }))
jest.mock("@/features/workout/utils/exercise-loop-cache", () => ({ loadExerciseLoop: jest.fn() }))
jest.mock("expo-image", () => {
  const React = require("react")
  const { View } = require("react-native")
  return {
    Image: React.forwardRef((props: object, ref: React.Ref<unknown>) => {
      React.useImperativeHandle(ref, () => ({
        startAnimating: jest.fn(),
        stopAnimating: jest.fn(),
      }))
      return <View {...props} />
    }),
  }
})
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

const bench = findExercise("bench-press")!

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useHealth).mockReturnValue({ sex: "Male", weightKg: 70 } as never)
  jest.mocked(useLocalSearchParams).mockReturnValue({})
  jest.mocked(useIsFocused).mockReturnValue(true)
  jest.mocked(loadExerciseLoop).mockResolvedValue("file:///cache/v1-0025.gif")
  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false)
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
  jest.mocked(useLocalSearchParams).mockReturnValue({ name: "bench-press" })
  const screen = await render(<ExerciseGuideScreen />)
  expect(screen.getByText("Chest")).toBeTruthy()
  expect(screen.queryByText("Joints under load")).toBeNull()

  await fireEvent.press(screen.getByText("Show all"))
  expect(screen.getByText("Front delt, Triceps")).toBeTruthy()
  expect(screen.getByText("Shoulder, Elbow, Wrist")).toBeTruthy()

  await fireEvent.press(screen.getByLabelText(/^Your weight 42\.5 kg/))
  expect(router.push).toHaveBeenCalledWith("/training-weights?edit=bench-press")
})

test("autoplays the inline technique animation and honors pause and route focus", async () => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ name: "bench-press" })
  const screen = await render(<ExerciseGuideScreen />)
  const demonstration = () => screen.getByLabelText("Bench press demonstration")
  const play = () => screen.getByRole("button", { name: "Play Bench press animation" })
  const pause = () => screen.getByRole("button", { name: "Pause Bench press animation" })

  expect(loadExerciseLoop).toHaveBeenCalledWith("0025")
  expect(demonstration()).toHaveProp("source", { uri: "file:///cache/v1-0025.gif" })
  expect(demonstration()).toHaveProp("autoplay", true)
  await fireEvent.press(pause())
  expect(demonstration()).toHaveProp("autoplay", false)
  await fireEvent.press(play())
  expect(demonstration()).toHaveProp("autoplay", true)

  jest.mocked(useIsFocused).mockReturnValue(false)
  await screen.rerender(<ExerciseGuideScreen />)
  expect(demonstration()).toHaveProp("autoplay", false)
  jest.mocked(useIsFocused).mockReturnValue(true)
  await screen.rerender(<ExerciseGuideScreen />)
  expect(demonstration()).toHaveProp("autoplay", true)
})

test("keeps the technique still under reduced motion until the user presses play", async () => {
  jest.mocked(AccessibilityInfo.isReduceMotionEnabled).mockResolvedValue(true)
  const screen = await render(<ExerciseGuideScreen />)
  const demonstration = () => screen.getByLabelText("Bench press demonstration")

  expect(demonstration()).toHaveProp("autoplay", false)
  await fireEvent.press(screen.getByRole("button", { name: "Play Bench press animation" }))
  expect(demonstration()).toHaveProp("autoplay", true)
})

test("shows the bundled technique still if the GIF is unavailable", async () => {
  jest.mocked(loadExerciseLoop).mockRejectedValueOnce(new Error("offline"))
  const screen = await render(<ExerciseGuideScreen />)

  expect(screen.getByLabelText("Bench press demonstration")).toHaveProp(
    "source",
    exerciseLoops["bench-press"]?.[1],
  )
  expect(screen.getByText("Animation unavailable")).toBeTruthy()
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
