import { act, fireEvent, render } from "@testing-library/react-native"
import { Alert } from "react-native"
import { router } from "expo-router"

import { useAuth } from "@/features/auth"
import { useHealth } from "@/features/health"
import { ProfileScreen } from "@/features/profile/profile-screen"

jest.mock("@/features/auth/auth-store", () => ({ useAuth: jest.fn() }))
jest.mock("@/features/health", () => ({
  PERIOD_AREA: "In period",
  useHealth: jest.fn(),
}))
jest.mock("@/features/profile/sheets", () => ({
  ActivitySheet: () => null,
  FrequencySheet: () => null,
  GoalSheet: () => null,
  HeightSheet: () => null,
  SexSheet: () => null,
  TargetWeightSheet: () => null,
  WeightSheet: () => null,
}))
jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))
jest.mock("@/features/recovery", () => {
  const React = require("react")
  const { Text } = require("react-native")
  return {
    RecoverySheet: ({ visible }: { visible: boolean }) =>
      visible ? React.createElement(Text, null, "Period recovery setup") : null,
  }
})

const mockUseAuth = jest.mocked(useAuth)
const mockUseHealth = jest.mocked(useHealth)
const refresh = jest.fn()
const saveRecovery = jest.fn()
const signOut = jest.fn()
const health = {
  weightKg: 68,
  heightCm: 175,
  sex: "Female",
  plan: {
    goal: "Build muscle",
    sessions: 4,
    activity: "Moderate",
    targetWeightKg: 72,
  },
  recovery: null,
  saveRecovery,
  loading: false,
  error: null,
  refresh,
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUseAuth.mockReturnValue({
    user: { name: "Member", email: "member@example.com", birthDate: null },
    signOut,
  } as never)
  mockUseHealth.mockReturnValue(health as never)
})

test("keeps identity visible and shows health skeletons while loading", async () => {
  mockUseHealth.mockReturnValue({ ...health, loading: true, error: null } as never)
  const screen = await render(<ProfileScreen />)
  expect(screen.getByRole("header", { name: "Profile" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "Height, loading" })).toBeTruthy()
  expect(screen.getByText("Member")).toBeTruthy()
})

test("keeps identity visible and retries after a health load error", async () => {
  mockUseHealth.mockReturnValue({ ...health, loading: false, error: "offline" } as never)
  const screen = await render(<ProfileScreen />)
  expect(screen.getByText("Could not load your health data.")).toBeTruthy()
  expect(screen.getByText("Member")).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Retry loading health data" }))
  expect(refresh).toHaveBeenCalledTimes(1)
})

test("requires explicit consent before opening period recovery setup", async () => {
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {})
  const screen = await render(<ProfileScreen />)
  expect(screen.getByRole("button", { name: "Period recovery, Off" })).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Period recovery, Off" }))

  const buttons = alert.mock.calls[0]?.[2]
  expect(buttons?.map((button) => button.text)).toEqual(["Not now", "Turn on"])
  expect(saveRecovery).not.toHaveBeenCalled()
  await act(async () => buttons?.[1]?.onPress?.())
  expect(screen.getByText("Period recovery setup")).toBeTruthy()
  alert.mockRestore()
})
test("shows unset height and restores account actions", async () => {
  mockUseHealth.mockReturnValue({ ...health, heightCm: null } as never)
  const screen = await render(<ProfileScreen />)

  expect(screen.getByRole("button", { name: "Height, Not set" })).toBeTruthy()
  expect(screen.queryByText("null cm")).toBeNull()

  await fireEvent.press(screen.getByRole("button", { name: "Account data" }))
  await fireEvent.press(screen.getByRole("button", { name: "BLE test" }))
  await fireEvent.press(screen.getByRole("button", { name: "Sign out" }))

  expect(router.push).toHaveBeenNthCalledWith(1, "/account-data")
  expect(router.push).toHaveBeenNthCalledWith(2, "/ble-sync")
  expect(signOut).toHaveBeenCalledTimes(1)
})
