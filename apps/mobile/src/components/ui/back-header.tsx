import { Image } from "expo-image"
import { StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/pressable"
import { Palette as C } from "@/theme"

const icons = {
  back: require("@/assets/images/progress/chevron-left.svg"),
}

/** Back chevron + label, with an optional action on the trailing edge. */
export function BackHeader({
  label,
  onPress,
  actionLabel,
  onAction,
}: {
  label: string
  onPress: () => void
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <View style={styles.headerRow}>
      <Pressable
        accessibilityLabel={`Back to ${label}`}
        style={styles.back}
        onPress={onPress}
        hitSlop={10}
      >
        <Image
          accessible={false}
          source={icons.back}
          style={styles.backIcon}
          contentFit="contain"
        />
        <Text style={styles.backLabel}>{label}</Text>
      </Pressable>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  back: {
    flexDirection: "row",
    flexShrink: 1,
    alignItems: "center",
    gap: 6,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  backLabel: {
    flexShrink: 1,
    fontSize: 13,
    color: C.accent,
  },
  action: {
    fontSize: 13,
    fontWeight: "600",
    color: C.accent,
  },
})
