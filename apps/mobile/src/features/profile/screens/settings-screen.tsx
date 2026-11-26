import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Button, Card, PageHeading, Screen } from "@/components/ui"
import { Toggle } from "@/components/ui/toggle"
import { useAuth } from "@/features/auth"
import { captureException } from "@/lib/analytics/posthog"
import { Palette as C } from "@/theme"

import { AppCacheSettings } from "../components/app-cache-settings"
import { MenuGroup, MenuRow } from "../components/menu"
import { useDeveloperMode } from "../store/developer-mode.store"

export function SettingsScreen() {
  const { signOut } = useAuth()
  const developerMode = useDeveloperMode((state) => state.enabled)
  const developerFeatures = useDeveloperMode((state) => state.features)
  const toggleDeveloperMode = useDeveloperMode((state) => state.toggle)

  return (
    <Screen>
      <BackHeader label="Profile" onPress={() => router.back()} />
      <PageHeading title="Settings" />
      <Card>
        <AppCacheSettings />
      </Card>
      <MenuGroup title="Developer settings">
        <View style={styles.row}>
          <Text style={styles.label}>Developer mode</Text>
          <Toggle
            accessibilityLabel="Developer mode"
            value={developerMode}
            onValueChange={toggleDeveloperMode}
          />
        </View>
        {developerMode ? (
          <MenuRow label="Developer options" onPress={() => router.push("/developer-options")} />
        ) : null}
        {developerMode && developerFeatures.testError ? (
          <MenuRow
            label="Send test error"
            onPress={() => captureException(new Error("First error"))}
          />
        ) : null}
      </MenuGroup>
      <Button variant="secondary" label="Sign out" onPress={() => void signOut()} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: { flex: 1, fontSize: 15, fontWeight: "500", color: C.text },
})
