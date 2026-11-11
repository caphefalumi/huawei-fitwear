import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, PageHeading, Screen } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Toggle } from "@/components/ui/toggle"
import { useDemoClock, usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { type DeveloperFeature, useDeveloperMode } from "../store/developer-mode.store"

const FEATURES: { key: DeveloperFeature; label: string; description: string }[] = [
  {
    key: "testError",
    label: "Send test error",
    description: "Captures a test event in Sentry from the Profile screen.",
  },
  {
    key: "bleTest",
    label: "BLE test",
    description: "Shows the watch Bluetooth test screen from the Profile screen.",
  },
]

export function DeveloperOptionsScreen() {
  const features = useDeveloperMode((state) => state.features)
  const toggleFeature = useDeveloperMode((state) => state.toggleFeature)
  const offsetDays = useDemoClock((state) => state.offsetDays)
  const setOffsetDays = useDemoClock((state) => state.setOffsetDays)
  const planDate = usePlanNow().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <Screen>
      <BackHeader label="Profile" onPress={() => router.back()} />
      <PageHeading
        title="Developer options"
        subtitle="Choose which developer tools appear in Profile."
      />
      <View style={styles.section}>
        {FEATURES.map(({ key, label, description }) => (
          <View key={key} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
            <Toggle
              accessibilityLabel={label}
              value={features[key]}
              onValueChange={() => toggleFeature(key)}
            />
          </View>
        ))}
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Demo date</Text>
            <Text style={styles.description}>
              Shows the workout plan and recovery as if today were this day.
            </Text>
          </View>
          <View style={styles.dateControls}>
            <Pressable
              accessibilityLabel="Previous day"
              onPress={() => setOffsetDays(offsetDays - 1)}
            >
              <Text style={styles.arrow}>‹</Text>
            </Pressable>
            <Text style={styles.date} accessibilityLabel={`Demo date, ${planDate}`}>
              {planDate}
            </Text>
            <Pressable accessibilityLabel="Next day" onPress={() => setOffsetDays(offsetDays + 1)}>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          </View>
        </View>
        {offsetDays ? (
          <Pressable style={styles.reset} onPress={() => setOffsetDays(0)}>
            <Text style={styles.resetLabel}>Back to today</Text>
          </Pressable>
        ) : null}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  section: {
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  row: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowText: {
    flexShrink: 1,
    gap: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  dateControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    fontSize: 24,
    color: C.accent,
    textAlign: "center",
  },
  date: {
    minWidth: 92,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  reset: {
    alignItems: "flex-end",
  },
  resetLabel: {
    fontSize: 13,
    color: C.accent,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    color: C.textMuted,
  },
})
