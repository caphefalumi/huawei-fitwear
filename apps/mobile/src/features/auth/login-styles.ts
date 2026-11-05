import * as Haptics from "expo-haptics"
import { Platform, StyleSheet } from "react-native"

import { Palette } from "@/theme"

export const AuthColors = {
  ...Palette,
  background: "#FFFFFF",
  surface: "#FFFFFF",
  text: "#1C1B1F",
  textMuted: "#49454F",
  border: "#79747E",
  error: "#B3261D",
  errorContainer: "#F9DEDC",
  onErrorContainer: "#410E0B",
}
type AuthColorPalette = typeof AuthColors

export const credentialMessage = "Incorrect email or password."

export const shake = {
  "0%": { transform: [{ translateX: 0 }] },
  "25%": { transform: [{ translateX: -4 }] },
  "75%": { transform: [{ translateX: 4 }] },
  "100%": { transform: [{ translateX: 0 }] },
}

export async function errorHaptic() {
  try {
    if (Platform.OS === "ios") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } else if (Platform.OS === "android") {
      try {
        await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject)
      } catch {
        await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press)
      }
    }
  } catch {
    // Haptics may be unavailable or disabled; visual feedback remains authoritative.
  }
}

const createStyles = (AuthColors: AuthColorPalette) =>
  StyleSheet.create({
    errorSpace: { paddingTop: 4 },
    resetHint: { gap: 8 },
    errorRow: { flexDirection: "row", alignItems: "flex-start", gap: 4, paddingHorizontal: 16 },
    credentialError: { color: AuthColors.error, fontSize: 12, lineHeight: 16, flex: 1 },
    error: { color: AuthColors.error, fontSize: 13, lineHeight: 20 },
    errorBanner: {
      padding: 16,
      gap: 8,
      backgroundColor: AuthColors.errorContainer,
      borderRadius: 12,
    },
    bannerText: { color: AuthColors.onErrorContainer, fontSize: 13, lineHeight: 20 },
    spinnerSlot: { width: 20, height: 20 },
    buttonContents: { flexDirection: "row", alignItems: "center", gap: 8 },
    disabled: { opacity: 0.6 },
    screen: { flex: 1, backgroundColor: AuthColors.background },
    content: { paddingHorizontal: 24, gap: 22 },
    back: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
    backLabel: { fontSize: 30, lineHeight: 36, color: AuthColors.text },
    welcome: {
      marginTop: 70,
      fontSize: 32,
      lineHeight: 38,
      fontWeight: "700",
      color: AuthColors.text,
    },
    credentials: { gap: 24 },
    forgot: { fontSize: 14, fontWeight: "600", color: AuthColors.accent, textAlign: "right" },
    primaryButton: {
      minHeight: 54,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: AuthColors.accent,
      borderWidth: 1,
      borderColor: AuthColors.accentBorder,
      borderRadius: 12,
    },
    primaryLabel: { fontSize: 16, fontWeight: "600", color: AuthColors.onAccent },
    otpField: { gap: 8 },
    otpLabel: { fontSize: 12, fontWeight: "500", color: AuthColors.textMuted },
    otpCells: { flexDirection: "row", justifyContent: "center", gap: 12 },
    otpCell: {
      width: 56,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: AuthColors.surface,
      borderWidth: 1,
      borderColor: AuthColors.border,
      borderRadius: 12,
    },
    otpCellActive: { borderColor: AuthColors.accent },
    otpDigit: {
      fontSize: 24,
      fontWeight: "600",
      fontVariant: ["tabular-nums"],
      color: AuthColors.text,
    },
    otpOverlay: {
      position: "absolute",
      top: 20,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      opacity: 0.02,
      color: "transparent",
      backgroundColor: "transparent",
    },
    passwordRequirement: { fontSize: 12, lineHeight: 18, color: AuthColors.textMuted },
    terms: { fontSize: 13, lineHeight: 19, color: AuthColors.textMuted, textAlign: "center" },
    footer: { alignItems: "center", gap: 15, paddingTop: 20 },
    separator: { width: 48, height: 1, borderRadius: 100, backgroundColor: AuthColors.border },
    footerRow: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    footerText: { fontSize: 14, color: AuthColors.textMuted },
    footerLink: { fontSize: 14, fontWeight: "700", color: AuthColors.accent },
  })

export const authStyles = createStyles(AuthColors)
