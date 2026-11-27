import * as Haptics from "expo-haptics"
import { router } from "expo-router"
import { SymbolView } from "expo-symbols"
import { useEffect, useRef } from "react"
import { Linking, StyleSheet, Text, View } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

import { BackHeader, Button, Card, PageHeading, Screen } from "@/components/ui"
import { Palette as C } from "@/theme"

import { usePairing } from "../pairing.store"
import { useWatchStatus } from "../status"

const STEPS = [
  "Open VoocHealth on your watch",
  "Keep the watch close to this phone",
  "Tap Allow on the watch the first time",
]

/** A ring that spreads out from the watch icon while the phone is looking. */
function Pulse() {
  const progress = useSharedValue(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    progress.set(withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }), -1))
  }, [progress, reduced])
  const style = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - progress.get()),
    transform: [{ scale: 1 + progress.get() * 0.7 }],
  }))
  return reduced ? null : <Animated.View style={[styles.ring, style]} />
}

export function WatchScreen() {
  const setEnabled = usePairing((state) => state.setEnabled)
  const { enabled, status, error, connected, label, name } = useWatchStatus()
  const looking = enabled && (status === "searching" || status === "connecting")
  const blocked = enabled && !!error && /permissions? denied/i.test(error)

  // One tap of feedback when the watch arrives, not on every visit to a connected one.
  const wasConnected = useRef(connected)
  useEffect(() => {
    if (connected && !wasConnected.current) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
    }
    wasConnected.current = connected
  }, [connected])

  return (
    <Screen contentStyle={styles.content}>
      <BackHeader label="Back" onPress={() => router.back()} />
      <PageHeading title="Huawei Watch" />
      <Card style={styles.hero}>
        <View style={styles.badgeArea}>
          {looking && !blocked ? <Pulse /> : null}
          <View style={[styles.badge, connected && styles.badgeOn]}>
            <SymbolView
              name={{ ios: "applewatch", android: "watch", web: "watch" }}
              size={44}
              tintColor={connected ? C.onAccent : C.accent}
            />
          </View>
        </View>
        <View
          style={styles.titles}
          accessible
          accessibilityLiveRegion="polite"
          accessibilityLabel={`Watch status, ${label}${name ? `, ${name}` : ""}`}
        >
          {name ? (
            <Text style={styles.name} numberOfLines={2}>
              {name}
            </Text>
          ) : null}
          <Text style={[styles.status, connected && styles.statusOn]}>{label}</Text>
        </View>
        {error && enabled ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
      </Card>

      <Card>
        {connected ? null : (
          <>
            {STEPS.map((step, index) => (
              <View key={step} style={styles.step}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </>
        )}
        <Text style={styles.detail}>
          {connected
            ? "Workouts and meals stay in step while both apps are running, even in the background."
            : "After the first connection the phone connects by itself."}
        </Text>
      </Card>

      {blocked ? (
        <Button label="Open settings" onPress={() => void Linking.openSettings()} />
      ) : null}
      <Button
        label={!enabled ? "Connect watch" : name ? "Forget watch" : "Stop searching"}
        variant={enabled ? "secondary" : undefined}
        onPress={() => setEnabled(!enabled)}
      />
    </Screen>
  )
}

const BADGE = 96
const BADGE_AREA = 164

const styles = StyleSheet.create({
  content: { gap: 16 },
  hero: { alignItems: "center", paddingVertical: 24 },
  badgeArea: {
    width: BADGE_AREA,
    height: BADGE_AREA,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    borderWidth: 2,
    borderColor: C.accent,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.accentTint,
  },
  badgeOn: { backgroundColor: C.accent },
  titles: { alignItems: "center", gap: 4 },
  name: { fontSize: 20, fontWeight: "700", color: C.text, textAlign: "center" },
  status: { fontSize: 15, color: C.textMuted },
  statusOn: { color: C.accent, fontWeight: "600" },
  error: { fontSize: 13, color: C.accent, textAlign: "center" },
  detail: { fontSize: 13, lineHeight: 19, color: C.textMuted },
  step: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 28,
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    color: C.accent,
    backgroundColor: C.accentTint,
  },
  stepText: { flex: 1, fontSize: 15, color: C.text },
})
