import type { PropsWithChildren } from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Palette as C } from "@/theme"
import { tokens } from "@/theme/tokens"

/** Scrollable screen with the shared gutter, background and safe-area padding. */
export function Screen({
  children,
  contentStyle,
  style,
  keyboardShouldPersistTaps,
}: PropsWithChildren<{
  contentStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  keyboardShouldPersistTaps?: ScrollViewProps["keyboardShouldPersistTaps"]
}>) {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      style={[styles.screen, style]}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
        contentStyle,
      ]}
    >
      {children}
    </ScrollView>
  )
}

/** Page title block: optional eyebrow, then the display title and an optional subtitle. */
export function PageHeading({
  eyebrow,
  title,
  subtitle,
  style,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View style={[styles.heading, style]}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: tokens.spacing.lg,
    gap: tokens.spacing.lg,
  },
  heading: {
    gap: 3,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "500",
    color: C.textMuted,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: C.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: C.textMuted,
  },
})
