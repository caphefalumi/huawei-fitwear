import { fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { dateKey, useHealth } from "@/features/health"
import { useInjuries } from "@/features/recovery"
import { InjuriesScreen } from "@/features/recovery/screens/injuries-screen"
import { usePlanPreferences } from "@/features/workout"
import { ExercisePreferencesScreen } from "@/features/workout/screens/exercise-preferences-screen"

jest.mock("@/features/health", () => ({
  ...jest.requireActual("@/features/health"),
  useHealth: jest.fn(),
}))
jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }))
jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  SwipeDirection: { LEFT: "left", RIGHT: "right" },
}))
jest.mock("react-native-keyboard-controller", () => {
  const { View } = require("react-native")
  return { KeyboardAvoidingView: View }
})
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

beforeEach(() => {
  jest.mocked(useHealth).mockReturnValue({ sex: "Female" } as never)
  useInjuries.setState({ injuries: [] })
  usePlanPreferences.setState({ likes: [], dislikes: [], hintDismissed: false })
})

test("likes, dislikes and resets exercises with undo", async () => {
  const screen = await render(<ExercisePreferencesScreen />)
  expect(screen.getByText("Swipe right to like, left to dislike")).toBeTruthy()

  await fireEvent.press(screen.getAllByRole("button", { name: "Like" })[0])
  const row = screen.getByLabelText("Incline dumbbell")
  await fireEvent(row, "accessibilityAction", { nativeEvent: { actionName: "dislike" } })
  expect(usePlanPreferences.getState().likes).toEqual(["bench-press"])
  expect(usePlanPreferences.getState().dislikes).toEqual(["incline-dumbbell-press"])
  expect(screen.getByText("Not in your plan")).toBeTruthy()
  expect(screen.getByLabelText("Chest, 1 liked, 1 disliked")).toBeTruthy()

  await fireEvent.press(screen.getByText("↺ Reset"))
  expect(usePlanPreferences.getState().likes).toEqual([])
  await fireEvent.press(screen.getByText("UNDO"))
  expect(usePlanPreferences.getState().likes).toEqual(["bench-press"])

  await fireEvent.press(screen.getByLabelText("Bench press, Liked"))
  expect(router.push).toHaveBeenCalledWith("/exercise-guide?name=bench-press")
})

test("adds a moderate knee injury and saves only after a change", async () => {
  const screen = await render(<InjuriesScreen />)
  expect(screen.getByText("Got a sore spot? Add it and we'll go easier on that area.")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Save" })).toBeDisabled()

  await fireEvent.press(screen.getByText("+ Add injury"))
  expect(screen.getByText("NOT AN INJURY")).toBeTruthy()
  await fireEvent.press(screen.getByLabelText("Knee"))
  await fireEvent.press(screen.getByRole("radio", { name: /Moderate/ }))
  await fireEvent.press(screen.getByText("Add"))
  expect(
    screen.getByText(/^Knee exercises are removed from your plan until .*, then 3 → 2 sets/),
  ).toBeTruthy()
  expect(screen.getByLabelText(/^Exclude, Until/)).toBeTruthy()

  await fireEvent.press(screen.getByRole("button", { name: "Save" }))
  expect(useInjuries.getState().injuries).toEqual([
    expect.objectContaining({ area: "Knee", excludeDays: 3, lightDays: 7, startDate: dateKey() }),
  ])
  expect(router.back).toHaveBeenCalled()
})

test("adds period from how the user feels, with rest days and no permanent option", async () => {
  const screen = await render(<InjuriesScreen />)
  await fireEvent.press(screen.getByText("+ Add injury"))
  await fireEvent.press(screen.getByLabelText("In period"))
  expect(screen.getByText("How are you feeling?")).toBeTruthy()
  await fireEvent.press(screen.getByText("Add"))
  expect(screen.getByText(/^Rest today, then all exercises 3 → 2 sets until/)).toBeTruthy()

  await fireEvent.press(screen.getByLabelText(/^Rest, Until/))
  expect(screen.getByText("Rest until when?")).toBeTruthy()
  expect(screen.queryByLabelText("Permanent")).toBeNull()
  await fireEvent.press(screen.getByText("Cancel"))

  await fireEvent.press(screen.getByLabelText(/^Start, /))
  expect(screen.getByText("Started when?")).toBeTruthy()
})

test("skips the exclude phase and makes light permanent", async () => {
  useInjuries.setState({
    injuries: [
      { area: "Shoulder", startDate: dateKey(), excludeDays: 3, lightDays: 7, permanent: null },
    ],
  })
  const screen = await render(<InjuriesScreen />)
  await fireEvent.press(screen.getByLabelText(/^Exclude, Until/))
  await fireEvent(screen.getByLabelText("Skip this phase"), "valueChange", true)
  expect(screen.getByText("This phase is skipped.")).toBeTruthy()
  await fireEvent.press(screen.getByText("OK"))
  expect(screen.getByText(/^Shoulder exercises: 3 → 2 sets until/)).toBeTruthy()

  await fireEvent.press(screen.getByLabelText(/^Light, Until/))
  await fireEvent(screen.getByLabelText("Permanent"), "valueChange", true)
  await fireEvent.press(screen.getByText("OK"))
  expect(screen.getByText("Shoulder exercises: 3 → 2 sets")).toBeTruthy()
  expect(screen.getByLabelText("Light, Permanent")).toBeTruthy()
})
