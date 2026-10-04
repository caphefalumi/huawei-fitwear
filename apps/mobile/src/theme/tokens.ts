/**
 * AI FitWear - Stitch AI FitWear Design System Tokens
 * Dual-engine theme tokens: Kinetic Obsidian (Dark) and Kinetic Pure Light (Light)
 * Center seed: #00796B / #005E53 with Be Vietnam Pro + Inter typography
 */

import { Platform } from 'react-native';

export interface ThemeColors {
  name: 'Kinetic Obsidian' | 'Kinetic Pure Light';
  isDark: boolean;
  background: string;
  surface: string;
  card: string;
  surfaceElevated: string;
  surfaceSubtle: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryGlow: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  // Functional Macro Telemetry
  protein: string;
  carbs: string;
  fat: string;
  calories: string;
  // Status Telemetry
  onTrack: string;
  onTrackBg: string;
  almostThere: string;
  almostThereBg: string;
  overTarget: string;
  overTargetBg: string;
  // Neutral fills & utility
  track: string; // ring / macro-bar background track
  neutralFill: string; // skeletons, disabled buttons, switch off-state
  onStatus: string; // glyphs on solid status badges / switch thumbs
  shadow: string;
  scrim: string;
  // Ring Symbolic Icons
  ringIcon: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    workout: string;
    rest: string;
  };
  // Device & Sync States
  connected: string;
  syncing: string;
  offline: string;
  error: string;
  info: string;
  warning: string;
}

export const kineticObsidian: ThemeColors = {
  name: 'Kinetic Obsidian',
  isDark: true,
  background: '#0D0D10',
  surface: '#15151A',
  card: '#15151A',
  surfaceElevated: '#1E1E26',
  surfaceSubtle: '#121216',
  border: '#262630',
  borderSubtle: '#1C1C24',
  text: '#FFFFFF',
  textSecondary: '#A0A0AB',
  textMuted: '#6B6B78',
  primary: '#FFFFFF',
  primaryGlow: 'rgba(255, 255, 255, 0.15)',
  primaryContainer: '#22222C',
  onPrimary: '#0D0D10',
  onPrimaryContainer: '#FFFFFF',
  secondary: '#38BDF8',
  secondaryContainer: '#0C4A6E',
  protein: '#60A5FA',
  carbs: '#FBBF24',
  fat: '#C084FC',
  calories: '#FF7A45',
  onTrack: '#34D399',
  onTrackBg: 'rgba(52, 211, 153, 0.16)',
  almostThere: '#FBBF24',
  almostThereBg: 'rgba(251, 191, 36, 0.16)',
  overTarget: '#FBBF24',
  overTargetBg: 'rgba(251, 191, 36, 0.16)',
  track: '#202028',
  neutralFill: '#282834',
  onStatus: '#0D0D10',
  shadow: '#000000',
  scrim: 'rgba(0, 0, 0, 0.75)',
  ringIcon: {
    calories: '#FF7A45',
    protein: '#60A5FA',
    carbs: '#FBBF24',
    fat: '#C084FC',
    workout: '#38BDF8',
    rest: '#818CF8'
  },
  connected: '#34D399',
  syncing: '#38BDF8',
  offline: '#8E8E93',
  error: '#FF6B6B',
  info: '#38BDF8',
  warning: '#FBBF24'
};

export const kineticPureLight: ThemeColors = {
  name: 'Kinetic Pure Light',
  isDark: false,
  background: '#F6F7FA',
  surface: '#F6F7FA',
  card: '#FFFFFF',
  surfaceElevated: '#ECEEF2',
  surfaceSubtle: '#F1F3F6',
  border: '#E2E5EB',
  borderSubtle: '#CBD1DC',
  text: '#0F1115',
  textSecondary: '#4A505C',
  textMuted: '#717886',
  primary: '#0F1115',
  primaryGlow: 'rgba(15, 17, 21, 0.12)',
  primaryContainer: '#E5E8EE',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#0F1115',
  secondary: '#0284C7',
  secondaryContainer: '#E0F2FE',
  protein: '#2563EB',
  carbs: '#D97706',
  fat: '#9333EA',
  calories: '#EA580C',
  onTrack: '#059669',
  onTrackBg: '#D1FAE5',
  almostThere: '#D97706',
  almostThereBg: '#FEF3C7',
  overTarget: '#D97706',
  overTargetBg: '#FEF3C7',
  track: '#E8ECF2',
  neutralFill: '#DFE4ED',
  onStatus: '#FFFFFF',
  shadow: '#0F1115',
  scrim: 'rgba(15, 17, 21, 0.5)',
  ringIcon: {
    calories: '#EA580C',
    protein: '#2563EB',
    carbs: '#D97706',
    fat: '#9333EA',
    workout: '#0284C7',
    rest: '#6366F1'
  },
  connected: '#059669',
  syncing: '#0284C7',
  offline: '#717886',
  error: '#DC2626',
  info: '#0284C7',
  warning: '#D97706'
};

/** Soft card lift for the light theme (dark relies on borders). Pair with `shadowColor: theme.shadow`. */
export const softShadow = Platform.select({
  web: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
  },
  default: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2
  }
}) as any;

/**
 * The watch face mock is always dark (AMOLED), whatever the app theme is.
 */
export const watchFace = {
  bezel: '#141418',
  bezelBorder: '#22222A',
  screen: '#000000',
  chip: '#181820',
  text: '#FFFFFF',
  textSecondary: '#A0A0AB',
  calories: '#FF7A45',
  protein: '#60A5FA',
  carbs: '#FBBF24',
  fat: '#C084FC',
  workout: '#38BDF8',
  rest: '#818CF8',
  ringIcon: {
    calories: '#FFFFFF',
    workout: '#FFFFFF',
    protein: '#60A5FA',
    carbs: '#FBBF24',
    fat: '#C084FC'
  }
} as const;

/** Readable glyph/text color (black or white) for a solid #RRGGBB fill. */
export function onColor(bg: string): string {
  const lin = (i: number) => {
    const c = parseInt(bg.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * lin(0) + 0.7152 * lin(1) + 0.0722 * lin(2);
  return lum > 0.18 ? '#000000' : '#FFFFFF';
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  touchTarget: 48
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999
} as const;

export const typography = {
  displayLarge: {
    fontSize: 44,
    fontWeight: '700' as const,
    lineHeight: 48,
    letterSpacing: -0.8
  },
  displayMedium: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 38,
    letterSpacing: -0.6
  },
  headlineLarge: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.3
  },
  headlineMedium: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 30,
    letterSpacing: -0.1
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: 0.1
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.2
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.2
  },
  micro: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.8
  }
} as const;
