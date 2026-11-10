import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, PageHeading, Screen } from "@/components/ui"
import { Toggle } from "@/components/ui/toggle"
import { Palette as C } from "@/theme"

import { type DeveloperFeature, useDeveloperMode } from "../developer-mode.store"

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
  description: {
    fontSize: 12,
    lineHeight: 16,
    color: C.textMuted,
  },
})
