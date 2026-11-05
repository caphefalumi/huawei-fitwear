import type { ReactNode } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native"

import { Pressable } from "@/components/pressable"
import { Palette as C } from "@/theme"

/** Filled (primary) or outlined (secondary) action button with a busy state. */
export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  busy = false,
  icon,
  style,
  labelStyle,
  accessibilityLabel,
}: {
  label: string
  onPress: () => void
  variant?: "primary" | "secondary"
  disabled?: boolean
  busy?: boolean
  icon?: ReactNode
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  accessibilityLabel?: string
}) {
  const inactive = disabled || busy
  const primary = variant === "primary"

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy }}
      disabled={inactive}
      onPress={onPress}
      style={[
        styles.base,
        primary ? styles.primary : styles.secondary,
        inactive && styles.inactive,
        style,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={primary ? C.onAccent : C.accent} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              primary ? styles.primaryLabel : styles.secondaryLabel,
              labelStyle,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primary: {
    backgroundColor: C.accent,
  },
  secondary: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  inactive: {
    opacity: 0.5,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  primaryLabel: {
    color: C.onAccent,
  },
  secondaryLabel: {
    color: C.accent,
  },
})
