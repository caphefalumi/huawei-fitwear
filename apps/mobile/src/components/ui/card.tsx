import type { ReactNode } from "react"
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native"

import { Pressable } from "@/components/pressable"
import { Palette as C } from "@/constants/palette"
import { tokens } from "@/theme/tokens"

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>
}

/** Section title with an optional action on the right (button when `onPress` is set). */
export function SectionHeading({
  title,
  actionLabel,
  onPress,
}: {
  title: string
  actionLabel?: string
  onPress?: () => void
}) {
  return (
    <View style={styles.headingRow}>
      <Text accessibilityRole="header" style={styles.headingText}>
        {title}
      </Text>
      {actionLabel ? (
        onPress ? (
          <Pressable onPress={onPress} hitSlop={10}>
            <Text style={styles.headingAction}>{actionLabel}</Text>
          </Pressable>
        ) : (
          <Text style={styles.headingAction}>{actionLabel}</Text>
        )
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 18,
    gap: tokens.spacing.md,
  },
  headingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacing.sm,
  },
  headingText: {
    fontSize: 17,
    fontWeight: "600",
    color: C.text,
  },
  headingAction: {
    fontSize: 12,
    fontWeight: "500",
    color: C.accent,
  },
})
