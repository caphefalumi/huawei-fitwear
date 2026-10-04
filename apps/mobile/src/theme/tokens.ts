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
  background: '#0E1312',
  surface: '#161C1B',
  card: '#161C1B',
  surfaceElevated: '#1F2625',
  surfaceSubtle: '#121E1C',
  border: '#2B3433',
  borderSubtle: '#1F2625',
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#636366',
  primary: '#4FD6C4', // Stitch Mint Teal
  primaryGlow: 'rgba(79, 214, 196, 0.25)',
  primaryContainer: '#12332E',
  onPrimary: '#00201B',
  onPrimaryContainer: '#BFF3EB',
  secondary: '#2D4FCF',
  secondaryContainer: '#4B69EA',
  protein: '#8CA2FF', // Macro Protein Dark
  carbs: '#F2B84B', // Macro Carbs Dark
  fat: '#D58AF0', // Macro Fat Dark
  calories: '#FF8A5B', // Macro Kcal Dark
  onTrack: '#6FD38A',
  onTrackBg: 'rgba(111, 211, 138, 0.18)',
  almostThere: '#F2B84B',
  almostThereBg: 'rgba(242, 184, 75, 0.18)',
  overTarget: '#F2B84B', // Supportive warning tone per Stitch guidelines
  overTargetBg: 'rgba(242, 184, 75, 0.18)',
  track: '#1F2625',
  neutralFill: '#242428',
  onStatus: '#FFFFFF',
  shadow: '#000000',
  scrim: 'rgba(0, 0, 0, 0.75)',
  ringIcon: {
    calories: '#FF8A5B',
    protein: '#8CA2FF',
    carbs: '#F2B84B',
    fat: '#D58AF0',
    workout: '#4FD6C4',
    rest: '#6CC1F5'
  },
  connected: '#6FD38A',
  syncing: '#6CC1F5',
  offline: '#8E8E93',
  error: '#FF8A80',
  info: '#6CC1F5',
  warning: '#F2B84B'
};

// Kinetic Pure Light: Stitch AI FitWear light mode porcelain with teal-green seed
export const kineticPureLight: ThemeColors = {
  name: 'Kinetic Pure Light',
  isDark: false,
  background: '#EFFCF9',
  surface: '#EFFCF9',
  card: '#FFFFFF',
  surfaceElevated: '#E4F1EE',
  surfaceSubtle: '#EAF6F3',
  border: '#DDE4E4',
  borderSubtle: '#BDC9C5',
  text: '#121E1C',
  textSecondary: '#3E4946',
  textMuted: '#6E7A76',
  primary: '#005E53', // Stitch Deep Teal
  primaryGlow: 'rgba(0, 94, 83, 0.2)',
  primaryContainer: '#DDF3EF',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#00302A',
  secondary: '#2D4FCF',
  secondaryContainer: '#4B69EA',
  protein: '#3B5BDB', // Stitch Macro Protein
  carbs: '#A8730A', // Stitch Macro Carbs
  fat: '#9C36B5', // Stitch Macro Fat
  calories: '#D9480F', // Stitch Macro Kcal
  onTrack: '#2E7D32',
  onTrackBg: '#D1FAE5',
  almostThere: '#9A5B00',
  almostThereBg: '#FEF3C7',
  overTarget: '#9A5B00', // Non-punitive warning
  overTargetBg: '#FEF3C7',
  track: '#E8EDF4',
  neutralFill: '#DDE3EC',
  onStatus: '#FFFFFF',
  shadow: '#121E1C',
  scrim: 'rgba(18, 30, 28, 0.5)',
  ringIcon: {
    calories: '#D9480F',
    protein: '#3B5BDB',
    carbs: '#A8730A',
    fat: '#9C36B5',
    workout: '#005E53',
    rest: '#0B6FA8'
  },
  connected: '#2E7D32',
  syncing: '#0B6FA8',
  offline: '#6E7A76',
  error: '#B3261E',
  info: '#0B6FA8',
  warning: '#9A5B00'
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
  bezel: '#18181B',
  bezelBorder: '#27272A',
  screen: '#000000',
  chip: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  calories: '#FF8A5B',
  protein: '#8CA2FF',
  carbs: '#F2B84B',
  fat: '#D58AF0',
  workout: '#4FD6C4',
  rest: '#6CC1F5',
  ringIcon: {
    calories: '#FFFFFF',
    workout: '#FFFFFF',
    protein: '#8CA2FF',
    carbs: '#F2B84B',
    fat: '#D58AF0'
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
