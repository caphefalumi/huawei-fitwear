import { fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { dateKey, useHealth } from "@/features/health"
import { useInjuries } from "@/features/recovery"
import { InjuriesScreen } from "@/features/recovery/injuries-screen"
import { usePlanPreferences } from "@/features/workout"
import { ExercisePreferencesScreen } from "@/features/workout/exercise-preferences-screen"

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

test("adds an injury, switches it to exclude and saves", async () => {
  const screen = await render(<InjuriesScreen />)
  expect(screen.getByText("No injuries")).toBeTruthy()

  await fireEvent.press(screen.getByText("+ Add injury"))
  await fireEvent.press(screen.getByLabelText("Knee"))
  expect(screen.getByText("Knee exercises: 3 → 2 sets")).toBeTruthy()
  expect(screen.getByText(/Until .* \((7 days)\)/)).toBeTruthy()

  await fireEvent.press(screen.getByRole("radio", { name: "Exclude" }))
  expect(screen.getByText("Knee exercises are removed from your plan")).toBeTruthy()

  await fireEvent.press(screen.getByText("Save"))
  expect(useInjuries.getState().injuries).toEqual([
    expect.objectContaining({ area: "Knee", mode: "exclude", startDate: dateKey() }),
  ])
  expect(router.back).toHaveBeenCalled()
})

test("makes an injury permanent from the calendar sheet", async () => {
  useInjuries.setState({
    injuries: [{ area: "Shoulder", mode: "light", startDate: dateKey(), endDate: null }],
  })
  const screen = await render(<InjuriesScreen />)
  expect(screen.getByText("Permanent")).toBeTruthy()
  await fireEvent.press(screen.getByText("Change"))
  expect(screen.getByText("Stays in your plan until you remove it.")).toBeTruthy()
  await fireEvent(screen.getByLabelText("Permanent"), "valueChange", false)
  expect(screen.getByText(/7 days\. Back to normal on/)).toBeTruthy()
  await fireEvent.press(screen.getByText("OK"))
  expect(screen.getByText(/Until .* \(7 days\)/)).toBeTruthy()
})
