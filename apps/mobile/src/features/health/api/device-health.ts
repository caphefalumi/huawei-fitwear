import type * as HealthKit from "@kingstinct/react-native-healthkit"
import { Platform } from "react-native"
import type * as HealthConnect from "react-native-health-connect"

import type { WorkoutSession } from "@/features/workout/hooks/workout-hooks"

type Metric = "weight" | "heartRate"
export type HealthMeasurement = { value: number; time: Date }

async function androidHealth() {
  // Health Connect is Android-only; loading it on iOS or web would access a missing native module.
  const health: typeof HealthConnect = require("react-native-health-connect")
  if (!(await health.initialize()))
    throw new Error(
      "Health Connect is unavailable. Install or update Health Connect and try again.",
    )
  return health
}

async function appleHealth() {
  // HealthKit is iOS-only; loading it on Android or web would access a missing native module.
  const health: typeof HealthKit = require("@kingstinct/react-native-healthkit")
  if (!health.isHealthDataAvailable())
    throw new Error("Apple Health is unavailable on this device.")
  return health
}

export async function readDeviceHealth(metric: Metric): Promise<HealthMeasurement | null> {
  if (Platform.OS === "android") {
    const health = await androidHealth()
    const recordType = metric === "weight" ? "Weight" : "HeartRate"
    const granted = await health.requestPermission([{ accessType: "read", recordType }])
    if (
      !granted.some(
        (permission) => permission.accessType === "read" && permission.recordType === recordType,
      )
    ) {
      throw new Error("Health Connect permission was not granted.")
    }
    const options = {
      timeRangeFilter: {
        operator: "between" as const,
        startTime: new Date(Date.now() - 30 * 86400000).toISOString(),
        endTime: new Date().toISOString(),
      },
      ascendingOrder: false,
      pageSize: 1,
    }
    if (metric === "weight") {
      const { records } = await health.readRecords("Weight", options)
      return records[0]
        ? { value: records[0].weight.inKilograms, time: new Date(records[0].time) }
        : null
    }
    const { records } = await health.readRecords("HeartRate", options)
    const sample = records[0]?.samples.reduce<(typeof records)[number]["samples"][number] | null>(
      (latest, item) => (!latest || item.time > latest.time ? item : latest),
      null,
    )
    return sample ? { value: sample.beatsPerMinute, time: new Date(sample.time) } : null
  }
  if (Platform.OS === "ios") {
    const health = await appleHealth()
    if (metric === "weight") {
      await health.requestAuthorization({ toRead: ["HKQuantityTypeIdentifierBodyMass"] })
      const sample = await health.getMostRecentQuantitySample(
        "HKQuantityTypeIdentifierBodyMass",
        "kg",
      )
      return sample ? { value: sample.quantity, time: sample.startDate } : null
    }
    await health.requestAuthorization({ toRead: ["HKQuantityTypeIdentifierHeartRate"] })
    const sample = await health.getMostRecentQuantitySample(
      "HKQuantityTypeIdentifierHeartRate",
      "count/min",
    )
    return sample ? { value: sample.quantity, time: sample.startDate } : null
  }
  throw new Error("Health data is only available on supported Android and iOS devices.")
}

/** Call only in response to an explicit request to share this completed workout. */
export async function shareWorkoutWithDeviceHealth(session: WorkoutSession): Promise<void> {
  const start = new Date(session.startedAt)
  const end = session.completedAt ? new Date(session.completedAt) : null
  if (
    !end ||
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    end <= start
  ) {
    throw new Error("Only completed workouts with valid start and end times can be shared.")
  }
  const syncId = `voochealth:${session.userId}:${session.id}`
  if (Platform.OS === "android") {
    const health = await androidHealth()
    const granted = await health.requestPermission([
      { accessType: "write", recordType: "ExerciseSession" },
    ])
    if (
      !granted.some(
        (permission) =>
          permission.accessType === "write" && permission.recordType === "ExerciseSession",
      )
    ) {
      throw new Error("Health Connect workout permission was not granted.")
    }
    await health.insertRecords([
      {
        recordType: "ExerciseSession",
        exerciseType: health.ExerciseType.STRENGTH_TRAINING,
        title: session.sessionTitle,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        metadata: { clientRecordId: syncId, clientRecordVersion: 1 },
      },
    ])
    return
  }
  if (Platform.OS === "ios") {
    const health = await appleHealth()
    await health.requestAuthorization({ toShare: ["HKWorkoutTypeIdentifier"] })
    await health.saveWorkoutSample(
      health.WorkoutActivityType.traditionalStrengthTraining,
      [],
      start,
      end,
      undefined,
      {
        HKSyncIdentifier: syncId,
        HKSyncVersion: 1,
      },
    )
    return
  }
  throw new Error("Sharing workouts requires a supported Android or iOS device.")
}
