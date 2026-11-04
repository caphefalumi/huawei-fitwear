import { useEffect, useRef } from "react"
import { Animated, StyleSheet, Text, View } from "react-native"

import { Palette as C } from "@/constants/palette"

export function MacroBar({
  label,
  value,
  target,
  unit,
  note,
}: {
  label: string
  value: number
  target: number
  unit: string
  note?: string
}) {
  const fill = Math.max(0, Math.min(1, value / target))
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const t = Animated.timing(anim, { toValue: fill, duration: 500, useNativeDriver: false })
    t.start()
    return () => t.stop()
  }, [anim, fill])

  const barWidth = anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] })
  return (
    <View style={styles.macro}>
      <View style={styles.macroRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>
          {value} / {target} {unit}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: barWidth }]} />
      </View>
      {note ? <Text style={styles.macroNote}>{note}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  macro: {
    gap: 4,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  macroValue: {
    fontSize: 11,
    fontWeight: "600",
    color: C.text,
  },
  track: {
    height: 5,
    borderRadius: 100,
    backgroundColor: C.card,
    overflow: "hidden",
  },
  fill: {
    height: 5,
    borderRadius: 100,
    backgroundColor: C.accent,
  },
  macroNote: {
    fontSize: 10,
    color: C.textMuted,
  },
})
