import { Platform } from "react-native"

/** Brand palette used by the app's designed light surfaces. */
export const Palette = {
  background: "#FAF9F6",
  surface: "#FFFFFF",
  card: "#EFEBE5",
  border: "#E7E2DC",
  text: "#252321",
  textMuted: "#68625C",
  accent: "#9D2332",
  accentBorder: "#9D2232",
  accentTint: "#F5E8E8",
  accentSoft: "#E2A6AD",
  track: "#D6D0C9",
  previewTint: "#F7F5F2",
  onAccent: "#FFFFFF",
} as const

/** Semantic colors for theme-aware primitives. */
export const Colors = {
  light: {
    text: "#000000",
    background: "#ffffff",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    textSecondary: "#60646C",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
  },
} as const

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark

export const tokens = {
  colors: Palette,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 6,
    md: 12,
    lg: 16,
    full: 9999,
  },
} as const

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
})

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0
