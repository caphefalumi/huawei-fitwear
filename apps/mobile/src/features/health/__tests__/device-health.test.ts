import * as health from "@appeeky/expo-healthkit"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"

import {
  connectDeviceHealth,
  readDeviceHealth,
  shareWorkoutWithDeviceHealth,
} from "../api/device-health"

jest.mock("@appeeky/expo-healthkit", () => ({
  isAvailable: jest.fn(),
  requestAuthorization: jest.fn(),
  requestPermissions: jest.fn(),
  queryQuantitySamples: jest.fn(),
  saveWorkout: jest.fn(),
  WorkoutActivityType: { traditionalStrengthTraining: 50 },
}))
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}))

const session = {
  id: "workout-1",
  userId: "user-1",
  sessionTitle: "Strength",
  workoutSplit: "Full body",
  startedAt: "2026-11-20T10:00:00.000Z",
  completedAt: "2026-11-20T11:00:00.000Z",
  avgHeartRateBpm: null,
  maxHeartRateBpm: null,
}
const sample = (value: number) => [{ value, startDate: new Date("2026-11-20T09:00:00.000Z") }]

const originalPlatform = Platform.OS
function platform(os: "android" | "ios") {
  Object.defineProperty(Platform, "OS", { configurable: true, value: os })
}

const stored = new Map<string, string>()
beforeEach(() => {
  jest.clearAllMocks()
  stored.clear()
  jest.mocked(SecureStore.getItemAsync).mockImplementation(async (key) => stored.get(key) ?? null)
  jest.mocked(SecureStore.setItemAsync).mockImplementation(async (key, value) => {
    stored.set(key, value)
  })
  jest.mocked(health.isAvailable).mockReturnValue(true)
  jest.mocked(health.requestAuthorization).mockResolvedValue(true)
  jest.mocked(health.requestPermissions).mockImplementation(async (permissions) => permissions)
  jest.mocked(health.saveWorkout).mockResolvedValue("uuid")
})

afterAll(() => {
  Object.defineProperty(Platform, "OS", { configurable: true, value: originalPlatform })
})

test("Health Connect denies access without reading or writing", async () => {
  platform("android")
  jest.mocked(health.requestPermissions).mockResolvedValue([])

  await expect(readDeviceHealth("weight")).rejects.toThrow("permission was not granted")
  await expect(shareWorkoutWithDeviceHealth(session)).rejects.toThrow("permission was not granted")
  await expect(connectDeviceHealth()).rejects.toThrow("permission was not granted")
  expect(health.queryQuantitySamples).not.toHaveBeenCalled()
  expect(health.saveWorkout).not.toHaveBeenCalled()
})

test("Health Connect reads weight with only the permission it needs", async () => {
  platform("android")
  jest.mocked(health.queryQuantitySamples).mockResolvedValue(sample(72.5) as never)

  await expect(readDeviceHealth("weight")).resolves.toEqual({
    value: 72.5,
    time: new Date("2026-11-20T09:00:00.000Z"),
  })
  expect(health.requestPermissions).toHaveBeenCalledWith(["android.permission.health.READ_WEIGHT"])
  expect(health.requestAuthorization).not.toHaveBeenCalled()
})

test("Apple Health reads heart rate and shares a completed workout once", async () => {
  platform("ios")
  jest.mocked(health.queryQuantitySamples).mockResolvedValue(sample(82) as never)

  await expect(readDeviceHealth("heartRate")).resolves.toEqual({
    value: 82,
    time: new Date("2026-11-20T09:00:00.000Z"),
  })
  await shareWorkoutWithDeviceHealth(session)
  await shareWorkoutWithDeviceHealth(session)

  expect(health.requestAuthorization).toHaveBeenCalledWith({
    toShare: ["HKWorkoutTypeIdentifier"],
  })
  expect(health.saveWorkout).toHaveBeenCalledTimes(1)
  expect(health.saveWorkout).toHaveBeenCalledWith({
    activityType: 50,
    startDate: new Date(session.startedAt),
    endDate: new Date(session.completedAt),
    metadata: { HKExternalUUID: "voochealth:user-1:workout-1" },
  })
})

test("a failed write is reported and can be tried again", async () => {
  platform("ios")
  jest.mocked(health.saveWorkout).mockRejectedValueOnce(new Error("Authorization denied"))

  await expect(shareWorkoutWithDeviceHealth(session)).rejects.toThrow("Authorization denied")
  await shareWorkoutWithDeviceHealth(session)

  expect(health.saveWorkout).toHaveBeenCalledTimes(2)
})
