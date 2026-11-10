import { act, fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { useAuth } from "@/features/auth"
import { useHealth } from "@/features/health"
import { ProfileScreen } from "@/features/profile/screens/profile-screen"
import { useDeveloperMode } from "@/features/profile/store/developer-mode.store"
import { PERIOD_AREA, useInjuries } from "@/features/recovery"

jest.mock("@/features/auth/hooks/auth-hooks", () => ({ useAuth: jest.fn() }))
jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  apiRequest: jest.fn(),
}))
jest.mock("@/features/health", () => ({
  ...jest.requireActual("@/features/health"),
  useHealth: jest.fn(),
}))
jest.mock("react-native-keyboard-controller", () => {
  const { View } = require("react-native")
  return { KeyboardAvoidingView: View }
})
jest.mock("@/features/profile/components/sheets", () => ({
  ActivitySheet: () => null,
  EmphasisSheet: () => null,
  ExperienceSheet: () => null,
  FrequencySheet: () => null,
  GoalSheet: () => null,
  HeightSheet: () => null,
  SessionLengthSheet: () => null,
  SexSheet: () => null,
  TargetWeightSheet: () => null,
  WeightSheet: () => null,
}))
jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

const mockUseAuth = jest.mocked(useAuth)
const mockUseHealth = jest.mocked(useHealth)
const refresh = jest.fn()
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
  loading: false,
  error: null,
  refresh,
}

beforeEach(() => {
  jest.clearAllMocks()
  useInjuries.setState({ injuries: [] })
  useDeveloperMode.setState({ enabled: false, features: { testError: false, bleTest: false } })
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

test("asks how the user feels before turning on period recovery", async () => {
  const screen = await render(<ProfileScreen />)
  expect(screen.getByRole("button", { name: "Period recovery, Off" })).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Period recovery, Off" }))

  expect(screen.getByText("How are you feeling?")).toBeTruthy()
  expect(useInjuries.getState().injuries).toEqual([])
  await fireEvent.press(screen.getByRole("radio", { name: /Rough/ }))
  await fireEvent.press(screen.getByText("Add"))
  expect(useInjuries.getState().injuries).toEqual([
    expect.objectContaining({ area: PERIOD_AREA, excludeDays: 2, lightDays: 3 }),
  ])
  expect(screen.getByRole("button", { name: "Period recovery, On" })).toBeTruthy()
})

test("shows emphasis and experience, defaulting women to lower body", async () => {
  const screen = await render(<ProfileScreen />)
  expect(screen.getByRole("button", { name: "Emphasis, Lower body" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "Experience, Regular" })).toBeTruthy()
})
test("opens exercise preferences and injuries from the plan section", async () => {
  const screen = await render(<ProfileScreen />)
  expect(screen.getByRole("button", { name: "Session length, 45 min" })).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Exercise preferences, None" }))
  await fireEvent.press(screen.getByRole("button", { name: "Injuries, None" }))
  expect(router.push).toHaveBeenNthCalledWith(1, "/exercise-preferences")
  expect(router.push).toHaveBeenNthCalledWith(2, "/injuries")
})

test("shows unset height and restores account actions", async () => {
  mockUseHealth.mockReturnValue({ ...health, heightCm: null } as never)
  const screen = await render(<ProfileScreen />)

  expect(screen.getByRole("button", { name: "Height, Not set" })).toBeTruthy()
  expect(screen.queryByText("null cm")).toBeNull()

  await fireEvent.press(screen.getByRole("button", { name: "Account data" }))
  await fireEvent.press(screen.getByRole("button", { name: "Developer mode, off" }))
  await fireEvent.press(screen.getByRole("button", { name: "Developer options" }))
  await act(async () => useDeveloperMode.getState().toggleFeature("bleTest"))
  await fireEvent.press(screen.getByRole("button", { name: "BLE test" }))
  await fireEvent.press(screen.getByRole("button", { name: "Sign out" }))

  expect(router.push).toHaveBeenNthCalledWith(1, "/account-data")
  expect(router.push).toHaveBeenNthCalledWith(2, "/developer-options")
  expect(router.push).toHaveBeenNthCalledWith(3, "/ble-sync")
  expect(signOut).toHaveBeenCalledTimes(1)
})
