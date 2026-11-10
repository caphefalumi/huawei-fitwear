import { router } from "expo-router"
import { StyleSheet, Text, View, useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/pressable"
import { useMarkInteractive } from "@/lib/observe"
import { Palette as AuthColors } from "@/theme"

export function WelcomeScreen() {
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  useMarkInteractive()

  return (
    <View
      style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
    >
      <View style={[styles.hero, { minHeight: Math.max(180, Math.min(height * 0.4, 320)) }]}>
        <View style={styles.illustration}>
          <View style={styles.orbitOuter} />
          <View style={styles.orbitInner} />
          <View style={styles.logoCircle}>
            <View style={styles.logoMark}>
              <View style={styles.logoVertical} />
              <View style={styles.logoHorizontal} />
            </View>
          </View>
          <View style={styles.sparkleTop} />
          <View style={styles.sparkleBottom} />
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          Explore the app
        </Text>
        <Text style={styles.subtitle}>
          Everything you need to manage your health and training, all in one place.
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign in"
          onPress={() => router.push("/(auth)/login")}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryLabel}>Sign In</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create account"
          onPress={() => router.push("/(auth)/sign-up")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryLabel}>Create account</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    backgroundColor: AuthColors.background,
  },
  hero: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  illustration: {
    width: 208,
    height: 208,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  orbitOuter: {
    position: "absolute",
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  orbitInner: {
    position: "absolute",
    width: 152,
    height: 152,
    borderRadius: 76,
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  logoCircle: {
    width: 92,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 46,
    backgroundColor: AuthColors.surface,
    borderWidth: 1,
    borderColor: AuthColors.border,
  },
  logoMark: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  logoVertical: { width: 10, height: 36, borderRadius: 5, backgroundColor: AuthColors.accent },
  logoHorizontal: {
    position: "absolute",
    width: 36,
    height: 10,
    borderRadius: 5,
    backgroundColor: AuthColors.accent,
  },
  sparkleTop: {
    position: "absolute",
    top: 29,
    right: 23,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AuthColors.accent,
  },
  sparkleBottom: {
    position: "absolute",
    left: 20,
    bottom: 35,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AuthColors.accentBorder,
  },
  title: {
    marginTop: 8,
    color: AuthColors.text,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 300,
    marginTop: 12,
    color: AuthColors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  actions: { gap: 12 },
  primaryButton: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AuthColors.accentBorder,
    backgroundColor: AuthColors.accent,
  },
  primaryLabel: { color: AuthColors.onAccent, fontSize: 16, fontWeight: "600" },
  secondaryButton: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AuthColors.border,
    backgroundColor: AuthColors.surface,
  },
  secondaryLabel: { color: AuthColors.text, fontSize: 16, fontWeight: "600" },
})
