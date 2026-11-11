import { fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { DeveloperOptionsScreen } from "@/features/profile/screens/developer-options-screen"
import { useDeveloperMode } from "@/features/profile/store/developer-mode.store"
import { useDemoClock } from "@/lib/time/demo-clock"

jest.mock("expo-router", () => ({ router: { back: jest.fn() } }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

beforeEach(() => {
  jest.clearAllMocks()
  useDeveloperMode.setState({ enabled: false, features: { testError: false, bleTest: false } })
})

test("toggles a developer feature and returns to Profile", async () => {
  const screen = await render(<DeveloperOptionsScreen />)

  await fireEvent(screen.getByRole("switch", { name: "BLE test" }), "valueChange", true)
  expect(useDeveloperMode.getState().features.bleTest).toBe(true)

  await fireEvent.press(screen.getByRole("button", { name: "Back to Profile" }))
  expect(router.back).toHaveBeenCalledTimes(1)
})

test("moves the planner demo date and back to today", async () => {
  useDemoClock.setState({ offsetDays: 0 })
  const screen = await render(<DeveloperOptionsScreen />)
  await fireEvent.press(screen.getByRole("button", { name: "Next day" }))
  await fireEvent.press(screen.getByRole("button", { name: "Next day" }))
  expect(useDemoClock.getState().offsetDays).toBe(2)
  await fireEvent.press(screen.getByText("Back to today"))
  expect(useDemoClock.getState().offsetDays).toBe(0)
})
