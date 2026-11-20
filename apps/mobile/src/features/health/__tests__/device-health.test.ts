import * as healthKit from "@kingstinct/react-native-healthkit"
import { Platform } from "react-native"
import * as healthConnect from "react-native-health-connect"

import { readDeviceHealth, shareWorkoutWithDeviceHealth } from "../api/device-health"

jest.mock("react-native-health-connect", () => ({
  initialize: jest.fn(),
  requestPermission: jest.fn(),
  readRecords: jest.fn(),
  insertRecords: jest.fn(),
  ExerciseType: { STRENGTH_TRAINING: 70 },
}))

jest.mock("@kingstinct/react-native-healthkit", () => ({
  isHealthDataAvailable: jest.fn(),
  requestAuthorization: jest.fn(),
  getMostRecentQuantitySample: jest.fn(),
  saveWorkoutSample: jest.fn(),
  WorkoutActivityType: { traditionalStrengthTraining: 50 },
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

const originalPlatform = Platform.OS
function platform(os: "android" | "ios") {
  Object.defineProperty(Platform, "OS", { configurable: true, value: os })
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(healthConnect.initialize).mockResolvedValue(true)
  jest.mocked(healthKit.isHealthDataAvailable).mockReturnValue(true)
})

afterAll(() => {
  Object.defineProperty(Platform, "OS", { configurable: true, value: originalPlatform })
})

test("Health Connect denies access without reading or writing", async () => {
  platform("android")
  jest.mocked(healthConnect.requestPermission).mockResolvedValue([])

  await expect(readDeviceHealth("weight")).rejects.toThrow("permission was not granted")
  await expect(shareWorkoutWithDeviceHealth(session)).rejects.toThrow("permission was not granted")
  expect(healthConnect.readRecords).not.toHaveBeenCalled()
  expect(healthConnect.insertRecords).not.toHaveBeenCalled()
})

test("Health Connect reads weight and writes an idempotent workout after permission", async () => {
  platform("android")
  jest
    .mocked(healthConnect.requestPermission)
    .mockImplementation(async (permissions) => permissions)
  jest.mocked(healthConnect.readRecords).mockResolvedValue({
    records: [{ time: "2026-11-20T09:00:00.000Z", weight: { inKilograms: 72.5 } }],
  } as never)
  jest.mocked(healthConnect.insertRecords).mockResolvedValue(["health-record"])

  await expect(readDeviceHealth("weight")).resolves.toEqual({
    value: 72.5,
    time: new Date("2026-11-20T09:00:00.000Z"),
  })
  await shareWorkoutWithDeviceHealth(session)
  expect(healthConnect.requestPermission).toHaveBeenCalledWith([
    { accessType: "read", recordType: "Weight" },
  ])
  expect(healthConnect.requestPermission).toHaveBeenCalledWith([
    { accessType: "write", recordType: "ExerciseSession" },
  ])
  expect(healthConnect.insertRecords).toHaveBeenCalledWith([
    expect.objectContaining({
      recordType: "ExerciseSession",
      metadata: { clientRecordId: "voochealth:user-1:workout-1", clientRecordVersion: 1 },
    }),
  ])
})

test("Apple Health reads heart rate and shares a completed workout", async () => {
  platform("ios")
  jest.mocked(healthKit.requestAuthorization).mockResolvedValue(true)
  jest.mocked(healthKit.getMostRecentQuantitySample).mockResolvedValue({
    quantity: 82,
    startDate: new Date("2026-11-20T09:00:00.000Z"),
  } as never)
  jest.mocked(healthKit.saveWorkoutSample).mockResolvedValue({} as never)

  await expect(readDeviceHealth("heartRate")).resolves.toEqual({
    value: 82,
    time: new Date("2026-11-20T09:00:00.000Z"),
  })
  await shareWorkoutWithDeviceHealth(session)
  expect(healthKit.requestAuthorization).toHaveBeenCalledWith({
    toRead: ["HKQuantityTypeIdentifierHeartRate"],
  })
  expect(healthKit.requestAuthorization).toHaveBeenCalledWith({
    toShare: ["HKWorkoutTypeIdentifier"],
  })
  expect(healthKit.saveWorkoutSample).toHaveBeenCalledWith(
    50,
    [],
    new Date(session.startedAt),
    new Date(session.completedAt),
    undefined,
    { HKSyncIdentifier: "voochealth:user-1:workout-1", HKSyncVersion: 1 },
  )
})

test("Apple Health does not claim a write succeeded when permission is denied", async () => {
  platform("ios")
  jest.mocked(healthKit.requestAuthorization).mockResolvedValue(true)
  jest.mocked(healthKit.saveWorkoutSample).mockRejectedValue(new Error("Authorization denied"))
  await expect(shareWorkoutWithDeviceHealth(session)).rejects.toThrow("Authorization denied")
})
