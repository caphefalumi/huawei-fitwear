import { fireEvent, render, waitFor } from "@testing-library/react-native"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"

import { connectDeviceHealth, isDeviceHealthAvailable } from "../api/device-health"
import { HealthPrompt } from "../components/health-prompt"

jest.mock("expo", () => ({ ...jest.requireActual("expo"), isRunningInExpoGo: () => false }))
jest.mock("expo-secure-store", () => ({ getItemAsync: jest.fn(), setItemAsync: jest.fn() }))
jest.mock("../api/device-health", () => ({
  connectDeviceHealth: jest.fn(),
  isDeviceHealthAvailable: jest.fn(),
}))
jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAvoidingView: require("react-native").View,
}))
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

const originalPlatform = Platform.OS

beforeEach(() => {
  jest.clearAllMocks()
  Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" })
  jest.mocked(isDeviceHealthAvailable).mockResolvedValue(true)
  jest.mocked(SecureStore.setItemAsync).mockResolvedValue(undefined)
})

afterAll(() => {
  Object.defineProperty(Platform, "OS", { configurable: true, value: originalPlatform })
})

test("connects on request and remembers not to ask again", async () => {
  jest.mocked(SecureStore.getItemAsync).mockResolvedValue(null)
  const screen = await render(<HealthPrompt />)
  await fireEvent.press(await screen.findByRole("button", { name: "Connect" }))
  expect(connectDeviceHealth).toHaveBeenCalledTimes(1)
  await waitFor(() => expect(SecureStore.setItemAsync).toHaveBeenCalledWith("health.prompted", "1"))
})

test("offers Health Connect on Android", async () => {
  Object.defineProperty(Platform, "OS", { configurable: true, value: "android" })
  jest.mocked(SecureStore.getItemAsync).mockResolvedValue(null)
  const screen = await render(<HealthPrompt />)
  expect(await screen.findByText("Connect to Health Connect")).toBeTruthy()
})

test("waits to ask while the health app is unavailable", async () => {
  jest.mocked(SecureStore.getItemAsync).mockResolvedValue(null)
  jest.mocked(isDeviceHealthAvailable).mockResolvedValue(false)
  const screen = await render(<HealthPrompt />)
  await waitFor(() => expect(isDeviceHealthAvailable).toHaveBeenCalled())
  expect(screen.queryByText("Connect to Apple Health")).toBeNull()
  expect(SecureStore.setItemAsync).not.toHaveBeenCalled()
})

test("stays away once it has been answered", async () => {
  jest.mocked(SecureStore.getItemAsync).mockResolvedValue("1")
  const screen = await render(<HealthPrompt />)
  await waitFor(() => expect(SecureStore.getItemAsync).toHaveBeenCalled())
  expect(screen.queryByText("Connect to Apple Health")).toBeNull()
})
