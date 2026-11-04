/** Design tokens: colors, spacing, typography, radii */
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
  previewTint: "#F7F5F2",
  onAccent: "#FFFFFF",
} as const

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
