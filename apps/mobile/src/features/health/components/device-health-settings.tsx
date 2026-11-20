import { useState } from "react"
import { Platform, StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/ui/pressable"
import { fetchWorkoutHistory } from "@/features/workout/api/workout-api"
import type { WorkoutSession } from "@/features/workout/hooks/workout-hooks"
import { Palette as C } from "@/theme"

import { readDeviceHealth, shareWorkoutWithDeviceHealth } from "../api/device-health"

export function DeviceHealthSettings() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  if (Platform.OS !== "ios" && Platform.OS !== "android") return null
  const provider = Platform.OS === "ios" ? "Apple Health" : "Health Connect"

  async function run(action: () => Promise<string>) {
    setBusy(true)
    setMessage(null)
    try {
      setMessage(await action())
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Health access failed.")
    } finally {
      setBusy(false)
    }
  }

  async function read(metric: "weight" | "heartRate") {
    const result = await readDeviceHealth(metric)
    if (!result)
      return "No data available or access was not granted. Android reads the last 30 days."
    return `${metric === "weight" ? `${result.value.toFixed(1)} kg` : `${Math.round(result.value)} bpm`} · ${result.time.toLocaleString()}`
  }

  async function shareLatest() {
    let latest: WorkoutSession | undefined
    let offset = 0
    let count: number
    do {
      const page = await fetchWorkoutHistory(offset)
      count = page.count
      if (!page.sessions.length) break
      for (const session of page.sessions) {
        if (
          session.completedAt &&
          (!latest?.completedAt || session.completedAt > latest.completedAt)
        )
          latest = session
      }
      offset += page.sessions.length
    } while (offset < count)
    if (!latest) return "No completed workout to share."
    await shareWorkoutWithDeviceHealth(latest)
    return `Shared ${latest.sessionTitle} with ${provider}.`
  }

  return (
    <View>
      <Text style={styles.title}>{provider}</Text>
      <Text style={styles.description}>
        Only accesses health data when you choose an action. Readings are displayed here, not saved
        to your profile.
      </Text>
      {(
        [
          ["Read latest weight", () => read("weight")],
          ["Read latest heart rate", () => read("heartRate")],
          ["Share latest completed workout", shareLatest],
        ] as const
      ).map(([label, action]) => (
        <Pressable
          key={label}
          accessibilityRole="button"
          disabled={busy}
          onPress={() => void run(action)}
          style={styles.row}
        >
          <Text style={styles.label}>{label}</Text>
        </Pressable>
      ))}
      {busy ? <Text style={styles.description}>Working…</Text> : null}
      {message ? (
        <Text accessibilityLiveRegion="polite" selectable style={styles.description}>
          {message}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: "600", color: C.text, paddingBottom: 8 },
  description: { fontSize: 13, color: C.textMuted, paddingVertical: 6 },
  row: {
    minHeight: 50,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  label: { fontSize: 13, fontWeight: "600", color: C.text },
})
