import { Palette } from "@/constants/palette"
const light = {
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

export type AuthColorPalette = typeof light

export function useAuthColors(): AuthColorPalette {
  return light
}
