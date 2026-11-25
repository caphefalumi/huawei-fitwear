import { act, fireEvent, render } from "@testing-library/react-native"
import { router } from "expo-router"

import { useAuth } from "@/features/auth"
import { useHealth } from "@/features/health"
import { ProfileScreen } from "@/features/profile/screens/profile-screen"
import { useDeveloperMode } from "@/features/profile/store/developer-mode.store"
import { PERIOD_AREA, useInjuries } from "@/features/recovery"
import {
  clearExerciseLoopCache,
  exerciseLoopCacheBytes,
  subscribeToExerciseLoopCache,
} from "@/features/workout/utils/exercise-loop-cache"
import { clearOfflineCache } from "@/lib/query/offline-cache"
import { clearMealPhotoCache, mealPhotoCacheBytes } from "@/lib/storage/meal-photo-cache"

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
  ...jest.requireActual("@/features/profile/components/sheets"),
  ActivitySheet: () => null,
  BirthdateSheet: () => {
    const { Text } = require("react-native")
    return <Text>Birthdate sheet</Text>
  },
  EmphasisSheet: () => null,
  ExperienceSheet: () => null,
  FrequencySheet: () => null,
  HeightSheet: () => null,
  SessionLengthSheet: () => null,
  SexSheet: () => null,
  TargetWeightSheet: () => null,
  WeightSheet: () => null,
}))
jest.mock("expo-router", () => ({ router: { push: jest.fn(), back: jest.fn() } }))
jest.mock("@/features/workout/utils/exercise-loop-cache", () => ({
  clearExerciseLoopCache: jest.fn(),
  exerciseLoopCacheBytes: jest.fn(() => 0),
  subscribeToExerciseLoopCache: jest.fn(() => () => {}),
}))
jest.mock("@/lib/query/offline-cache", () => ({ clearOfflineCache: jest.fn() }))
jest.mock("@/lib/storage/meal-photo-cache", () => ({
  clearMealPhotoCache: jest.fn().mockResolvedValue(undefined),
  mealPhotoCacheBytes: jest.fn(() => 0),
  subscribeToMealPhotoCache: jest.fn(() => () => {}),
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

const mockUseAuth = jest.mocked(useAuth)
const mockUseHealth = jest.mocked(useHealth)
const refresh = jest.fn()
const signOut = jest.fn()
const updateUser = jest.fn()
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
    updateUser,
  } as never)
  mockUseHealth.mockReturnValue(health as never)
})

test("keeps identity visible and distinguishes loading from an unset weight", async () => {
  mockUseHealth.mockReturnValue({ ...health, weightKg: null, loading: true, error: null } as never)
  const screen = await render(<ProfileScreen />)
  expect(screen.getByRole("header", { name: "Profile" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "Weight, Loading" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "Height, 175 cm" })).toBeTruthy()
  expect(screen.getByText("Member")).toBeTruthy()
})

test("keeps identity visible and retries after a health load error", async () => {
  mockUseHealth.mockReturnValue({ ...health, loading: false, error: "offline" } as never)
  const screen = await render(<ProfileScreen />)
  expect(screen.getByText("Could not load your health data.")).toBeTruthy()
  expect(screen.getByText("Member")).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Try again" }))
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

test("groups settings and opens watch management without claiming a connection", async () => {
  const screen = await render(<ProfileScreen />)
  for (const name of [
    "Health & goals",
    "Training & recovery",
    "Connected devices",
    "Account & privacy",
  ]) {
    expect(screen.getByRole("header", { name })).toBeTruthy()
  }
  expect(screen.queryByRole("button", { name: "Developer options" })).toBeNull()
  await fireEvent.press(screen.getByRole("button", { name: "VoocHealth watch, Not set up" }))
  expect(router.push).toHaveBeenCalledWith("/watch")
})

test("a failed name edit keeps the draft and can be saved on retry", async () => {
  updateUser.mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce(undefined)
  const screen = await render(<ProfileScreen />)
  await fireEvent.press(screen.getByRole("button", { name: "Edit name" }))
  await fireEvent.changeText(screen.getByLabelText("Name"), "New name")
  await fireEvent.press(screen.getByRole("button", { name: "Save" }))
  expect(await screen.findByRole("alert")).toBeTruthy()
  expect(screen.getByLabelText("Name").props.value).toBe("New name")
  await fireEvent.press(screen.getByRole("button", { name: "Save" }))
  expect(await screen.findByText("Profile updated.")).toBeTruthy()
  expect(updateUser).toHaveBeenNthCalledWith(2, { name: "New name" })
})

test("locks goal options during save and retains the failed choice for retry", async () => {
  const pending = Promise.withResolvers<void>()
  const savePlan = jest.fn().mockReturnValueOnce(pending.promise).mockResolvedValueOnce(undefined)
  mockUseHealth.mockReturnValue({ ...health, savePlan } as never)
  const screen = await render(<ProfileScreen />)
  await fireEvent.press(screen.getByRole("button", { name: "Goal, Build muscle" }))
  await fireEvent.press(screen.getByRole("radio", { name: "Lose fat" }))
  await fireEvent.press(screen.getByRole("radio", { name: "Maintain", disabled: true }))
  expect(savePlan).toHaveBeenCalledTimes(1)
  await act(async () => pending.reject(new Error("Offline")))
  expect(await screen.findByRole("alert")).toBeTruthy()
  await fireEvent.press(screen.getByRole("radio", { name: "Lose fat", checked: true }))
  expect(await screen.findByText("Profile updated.")).toBeTruthy()
  expect(savePlan).toHaveBeenNthCalledWith(2, { ...health.plan, goal: "Lose fat" })
})

test("shows combined media usage and clears all managed cache files", async () => {
  let onCacheChanged: (() => void) | undefined
  jest.mocked(exerciseLoopCacheBytes).mockReturnValue(260_000)
  jest.mocked(mealPhotoCacheBytes).mockReturnValue(140_000)
  jest.mocked(subscribeToExerciseLoopCache).mockImplementationOnce((listener) => {
    onCacheChanged = listener
    return () => {
      onCacheChanged = undefined
    }
  })
  jest.mocked(clearExerciseLoopCache).mockImplementationOnce(() => {
    jest.mocked(exerciseLoopCacheBytes).mockReturnValue(0)
    jest.mocked(mealPhotoCacheBytes).mockReturnValue(0)
    onCacheChanged?.()
  })
  const screen = await render(<ProfileScreen />)
  expect(screen.getByText("0.40 MB of media cached")).toBeTruthy()
  await fireEvent.press(screen.getByRole("button", { name: "Clear cache" }))
  expect(await screen.findByText("0.00 MB of media cached")).toBeTruthy()
  expect(clearMealPhotoCache).toHaveBeenCalledTimes(1)
  expect(clearExerciseLoopCache).toHaveBeenCalledTimes(1)
  expect(clearOfflineCache).toHaveBeenCalledTimes(1)
})

test("shows unset height and restores account actions", async () => {
  mockUseHealth.mockReturnValue({ ...health, heightCm: null } as never)
  const screen = await render(<ProfileScreen />)

  expect(screen.getByRole("button", { name: "Height, Not set" })).toBeTruthy()
  expect(screen.queryByText("null cm")).toBeNull()

  await fireEvent.press(screen.getByRole("button", { name: "Account data" }))
  await fireEvent(screen.getByRole("switch", { name: "Developer mode" }), "valueChange", true)
  await fireEvent.press(screen.getByRole("button", { name: "Developer options" }))
  await act(async () => useDeveloperMode.getState().toggleFeature("bleTest"))
  await fireEvent.press(screen.getByRole("button", { name: "BLE test" }))
  await fireEvent.press(screen.getByRole("button", { name: "Sign out" }))

  expect(router.push).toHaveBeenNthCalledWith(1, "/account-data")
  expect(router.push).toHaveBeenNthCalledWith(2, "/developer-options")
  expect(router.push).toHaveBeenNthCalledWith(3, "/ble-sync")
  expect(signOut).toHaveBeenCalledTimes(1)
})

test("shows the saved birthdate instead of a hard-coded one", async () => {
  mockUseAuth.mockReturnValue({
    user: { name: "Member", email: "member@example.com", birthDate: "1994-04-12" },
    signOut,
  } as never)
  const screen = await render(<ProfileScreen />)
  expect(screen.getByRole("button", { name: "Birthdate, 12-04-1994" })).toBeTruthy()
  expect(screen.queryByText("14 Jun 1998")).toBeNull()
})

test("shows an unset birthdate and opens the editor", async () => {
  const screen = await render(<ProfileScreen />)
  expect(screen.queryByText("14 Jun 1998")).toBeNull()
  await fireEvent.press(screen.getByRole("button", { name: "Birthdate, Not set" }))
  expect(screen.getByText("Birthdate sheet")).toBeTruthy()
})
