import type * as Health from "@appeeky/expo-healthkit"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"

import type { WorkoutSession } from "@/features/workout/hooks/workout-hooks"

type Metric = "weight" | "heartRate"
export type HealthMeasurement = { value: number; time: Date }

const METRICS = {
  weight: {
    type: "HKQuantityTypeIdentifierBodyMass",
    unit: "kg",
    permission: "android.permission.health.READ_WEIGHT",
  },
  heartRate: {
    type: "HKQuantityTypeIdentifierHeartRate",
    unit: "count/min",
    permission: "android.permission.health.READ_HEART_RATE",
  },
} as const
const WORKOUT_TYPE = "HKWorkoutTypeIdentifier"
// Must match healthConnectPermissions in app.json.
const WRITE_WORKOUT = "android.permission.health.WRITE_EXERCISE"

function healthModule(): typeof Health {
  // Loading it eagerly would require a native module that Expo Go and web do not have.
  return require("@appeeky/expo-healthkit")
}

function openHealth() {
  const health = healthModule()
  if (!health.isAvailable()) {
    throw new Error(
      Platform.OS === "android"
        ? "Health Connect is unavailable. Install or update Health Connect and try again."
        : "Apple Health is unavailable on this device.",
    )
  }
  return health
}

export async function readDeviceHealth(metric: Metric): Promise<HealthMeasurement | null> {
  if (Platform.OS !== "android" && Platform.OS !== "ios") {
    throw new Error("Health data is only available on supported Android and iOS devices.")
  }
  const health = openHealth()
  const { type, unit, permission } = METRICS[metric]
  // Asked for one by one on Android: requestAuthorization there also asks for full history.
  if (Platform.OS === "android") {
    const granted = await health.requestPermissions([permission])
    if (!granted.includes(permission)) {
      throw new Error("Health Connect permission was not granted.")
    }
  } else {
    await health.requestAuthorization({ toRead: [type] })
  }
  const [sample] = await health.queryQuantitySamples({
    type,
    unit,
    from: Platform.OS === "android" ? new Date(Date.now() - 30 * 86400000) : undefined,
    limit: 1,
    ascending: false,
  })
  return sample ? { value: sample.value, time: sample.startDate } : null
}

export async function isDeviceHealthAvailable(): Promise<boolean> {
  if (Platform.OS !== "android" && Platform.OS !== "ios") return false
  return healthModule().isAvailable()
}

/** Asks for everything the app uses. HealthKit does not reveal which reads were allowed. */
export async function connectDeviceHealth(): Promise<void> {
  const health = openHealth()
  if (Platform.OS === "android") {
    const granted = await health.requestPermissions([
      METRICS.weight.permission,
      METRICS.heartRate.permission,
      WRITE_WORKOUT,
    ])
    if (!granted.length) throw new Error("Health Connect permission was not granted.")
    return
  }
  await health.requestAuthorization({
    toRead: [METRICS.weight.type, METRICS.heartRate.type],
    toShare: [WORKOUT_TYPE],
  })
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
  if (Platform.OS !== "android" && Platform.OS !== "ios") {
    throw new Error("Sharing workouts requires a supported Android or iOS device.")
  }
  // The library cannot replace an earlier copy, so remember what was already shared.
  const sharedKey = `health.shared.${session.userId}.${session.id}`.replace(/[^\w.-]/g, "_")
  if (await SecureStore.getItemAsync(sharedKey)) return

  const health = openHealth()
  if (Platform.OS === "android") {
    const granted = await health.requestPermissions([WRITE_WORKOUT])
    if (!granted.includes(WRITE_WORKOUT)) {
      throw new Error("Health Connect workout permission was not granted.")
    }
  } else {
    await health.requestAuthorization({ toShare: [WORKOUT_TYPE] })
  }
  await health.saveWorkout({
    activityType: health.WorkoutActivityType.traditionalStrengthTraining,
    startDate: start,
    endDate: end,
    metadata: { HKExternalUUID: `voochealth:${session.userId}:${session.id}` },
  })
  await SecureStore.setItemAsync(sharedKey, "1")
}
