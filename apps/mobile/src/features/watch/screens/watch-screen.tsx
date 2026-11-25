import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Button, Card, PageHeading, Screen } from "@/components/ui"
import { Palette as C } from "@/theme"

import { usePairing } from "../pairing.store"
import { useWatchStatus } from "../status"

export function WatchScreen() {
  const setEnabled = usePairing((state) => state.setEnabled)
  const { enabled, error, connected, label } = useWatchStatus()
  return (
    <Screen contentStyle={styles.content}>
      <BackHeader label="Back" onPress={() => router.back()} />
      <PageHeading title="VoocHealth watch" />
      <Card style={styles.card}>
        <View style={styles.statusRow} accessible accessibilityLabel={`Watch status, ${label}`}>
          <View style={[styles.dot, connected && styles.dotOn]} />
          <Text style={styles.status}>{label}</Text>
        </View>
        {error && enabled ? (
          <Text accessibilityRole="alert" style={styles.detail}>
            {error}
          </Text>
        ) : null}
        <Text style={styles.detail}>
          Open VoocHealth on your watch and keep it nearby. After the first connection the phone
          connects by itself. A workout started on either device appears on both while both apps are
          open.
        </Text>
      </Card>
      <Button
        label={enabled ? "Forget watch" : "Connect watch"}
        variant={enabled ? "secondary" : undefined}
        onPress={() => setEnabled(!enabled)}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { gap: 16 },
  card: { gap: 10 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.track },
  dotOn: { backgroundColor: C.accent },
  status: { fontSize: 17, fontWeight: "600", color: C.text },
  detail: { fontSize: 13, color: C.textMuted },
})
