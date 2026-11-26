import { isRunningInExpoGo } from "expo"
import * as SecureStore from "expo-secure-store"
import { useEffect, useState } from "react"
import { Platform, StyleSheet, Text } from "react-native"

import { Sheet, SheetActions } from "@/components/ui/sheet"
import { captureException } from "@/lib/analytics/posthog"
import { Palette as C } from "@/theme"

import { connectDeviceHealth, isDeviceHealthAvailable } from "../api/device-health"

const PROMPTED_KEY = "health.prompted"

/** Offers Apple Health or Health Connect once, the first time someone is signed in. */
export function HealthPrompt() {
  const provider = Platform.OS === "ios" ? "Apple Health" : "Health Connect"
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (Platform.OS === "web" || isRunningInExpoGo()) return
    let cancelled = false
    void (async () => {
      try {
        if ((await SecureStore.getItemAsync(PROMPTED_KEY)) === "1") return
        // Without the health app there is nothing to connect; ask again once there is.
        if ((await isDeviceHealthAvailable()) && !cancelled) setVisible(true)
      } catch {
        captureException(new Error("Could not check whether to offer health access."))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    void SecureStore.setItemAsync(PROMPTED_KEY, "1").catch(() =>
      captureException(new Error("Could not save the health prompt setting.")),
    )
  }

  const connect = async () => {
    setBusy(true)
    setError(null)
    try {
      await connectDeviceHealth()
      dismiss()
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Health access failed.")
    } finally {
      setBusy(false)
    }
  }

  if (!visible) return null
  return (
    <Sheet visible title={`Connect to ${provider}`} onClose={dismiss}>
      <Text style={styles.copy}>
        Let VoocHealth read your latest weight and heart rate, and save the workouts you choose to
        share. You can also do this later in Profile, under Third-party services.
      </Text>
      {error ? (
        <Text accessibilityRole="alert" style={styles.copy}>
          {error}
        </Text>
      ) : null}
      <SheetActions
        primaryLabel="Connect"
        secondaryLabel="Not now"
        onPrimary={() => void connect()}
        onSecondary={dismiss}
        primaryDisabled={busy}
        secondaryDisabled={busy}
        busy={busy}
      />
    </Sheet>
  )
}

const styles = StyleSheet.create({
  copy: { fontSize: 15, lineHeight: 22, color: C.text },
})
