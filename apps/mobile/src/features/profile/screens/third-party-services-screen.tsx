import { router } from "expo-router"
import { Platform, StyleSheet, Text } from "react-native"

import { BackHeader, Card, PageHeading, Screen } from "@/components/ui"
import { DeviceHealthSettings } from "@/features/health/components/device-health-settings"
import { Palette as C } from "@/theme"

export function ThirdPartyServicesScreen() {
  return (
    <Screen>
      <BackHeader label="Profile" onPress={() => router.back()} />
      <PageHeading title="Third-party services" />
      {Platform.OS === "web" ? (
        <Text style={styles.copy}>Health services are available in the iOS and Android apps.</Text>
      ) : (
        <Card>
          <DeviceHealthSettings />
        </Card>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  copy: { fontSize: 13, color: C.textMuted },
})
