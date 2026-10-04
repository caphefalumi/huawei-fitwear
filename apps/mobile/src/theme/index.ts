import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';
import { kineticObsidian, kineticPureLight, radii, spacing, typography, type ThemeColors } from './tokens';

export function useAppTheme(): {
  theme: ThemeColors;
  isDark: boolean;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
} {
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);

  const isDark =
    themeMode === 'system'
      ? systemScheme === 'dark' || !systemScheme
      : themeMode === 'dark';

  const theme = isDark ? kineticObsidian : kineticPureLight;

  return {
    theme,
    isDark,
    spacing,
    radii,
    typography
  };
}

export * from './tokens';
