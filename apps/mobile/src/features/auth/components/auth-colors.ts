import { useColorScheme } from "react-native";

import { Palette } from "@/constants/palette";

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
};
const dark = {
  ...light,
  background: "#1C1B1F",
  surface: "#1C1B1F",
  text: "#E6E1E5",
  textMuted: "#CAC4D0",
  border: "#938F99",
  accent: "#F2B8C1",
  accentBorder: "#F2B8C1",
  onAccent: "#561521",
  error: "#F2B8B5",
  errorContainer: "#8C1D18",
  onErrorContainer: "#F9DEDC",
};

export type AuthColorPalette = Record<keyof typeof light, string>;

export function useAuthColors(): AuthColorPalette {
  return useColorScheme() === "dark" ? dark : light;
}
