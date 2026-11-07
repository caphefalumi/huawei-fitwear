import { fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { useDeveloperMode } from "@/features/profile/developer-mode.store"
import { DeveloperOptionsScreen } from "@/features/profile/developer-options-screen"

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
