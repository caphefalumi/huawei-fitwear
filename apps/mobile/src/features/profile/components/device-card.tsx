import { Image } from "expo-image"
import { SymbolView } from "expo-symbols"
import { StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/ui/pressable"
import type { WatchStatus } from "@/features/watch"
import { Palette as C } from "@/theme"

const chevron = require("@/assets/images/profile/chevron-right.svg")

/**
 * The paired watch as a device row (sits inside a MenuGroup), the way health apps list "My devices":
 * product glyph, product name, the watch's own name and a live state line.
 */
export function WatchDeviceRow({
  enabled,
  status,
  name,
  label,
  onPress,
}: {
  enabled: boolean
  status: WatchStatus
  name: string
  label: string
  onPress: () => void
}) {
  const connected = status === "connected"
  const busy = enabled && !connected
  const detail = connected && name ? name : null
  const hint = !enabled ? "Pair to sync workouts and meals" : null

  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      accessibilityLabel={["Huawei Watch", label, detail].filter(Boolean).join(", ")}
      accessibilityHint={enabled ? "Opens watch settings" : "Opens watch setup"}
    >
      <View style={[styles.tile, connected && styles.tileOn]}>
        <SymbolView
          name={{ ios: "applewatch", android: "watch", web: "watch" }}
          size={28}
          tintColor={connected ? C.onAccent : C.accent}
        />
      </View>

      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          Huawei Watch
        </Text>
        {detail ? (
          <Text style={styles.detail} numberOfLines={1}>
            {detail}
          </Text>
        ) : null}
        <View style={styles.state}>
          <View style={[styles.dot, connected && styles.dotOn, busy && styles.dotBusy]} />
          <Text style={[styles.stateText, connected && styles.stateOn]} numberOfLines={1}>
            {hint ?? label}
          </Text>
        </View>
      </View>

      {enabled ? (
        <Image accessible={false} source={chevron} style={styles.chevron} contentFit="contain" />
      ) : (
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Set up</Text>
        </View>
      )}
    </Pressable>
  )
}

const TILE = 52

const styles = StyleSheet.create({
  row: {
    minHeight: 76,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: 14,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.accentTint,
  },
  tileOn: { backgroundColor: C.accent },
  text: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: "600", color: C.text },
  detail: { fontSize: 14, color: C.text },
  state: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.track },
  dotBusy: { backgroundColor: C.accentSoft },
  dotOn: { backgroundColor: C.accent },
  stateText: { flexShrink: 1, fontSize: 13, color: C.textMuted },
  stateOn: { color: C.accent, fontWeight: "500" },
  chevron: { width: 16, height: 16 },
  cta: {
    minHeight: 32,
    paddingHorizontal: 14,
    borderRadius: 999,
    justifyContent: "center",
    backgroundColor: C.accentTint,
  },
  ctaText: { fontSize: 14, fontWeight: "600", color: C.accent },
})
