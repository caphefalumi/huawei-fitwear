/**
 * AI FitWear - Kinetic Dual-Engine Theme Tokens
 * Fully specified for Kinetic Obsidian (Dark / AMOLED) and Kinetic Pure Light (Light / Porcelain)
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
  onPrimary: string;
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
}

export const kineticObsidian: ThemeColors = {
  name: 'Kinetic Obsidian',
  isDark: true,
  background: '#000000',
  surface: '#121214',
  card: '#161618',
  surfaceElevated: '#1C1C1F',
  surfaceSubtle: '#111113',
  border: '#242428',
  borderSubtle: '#1C1C20',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textMuted: '#636366',
  primary: '#22C55E', // Apple Fitness Green
  primaryGlow: 'rgba(34, 197, 94, 0.25)',
  onPrimary: '#000000',
  protein: '#0EA5E9', // Electric Cyan
  carbs: '#F59E0B', // Amber Gold
  fat: '#EF4444', // Coral Red
  calories: '#22C55E',
  onTrack: '#22C55E',
  onTrackBg: 'rgba(34, 197, 94, 0.15)',
  almostThere: '#F59E0B',
  almostThereBg: 'rgba(245, 158, 11, 0.15)',
  overTarget: '#EF4444',
  overTargetBg: 'rgba(239, 68, 68, 0.15)',
  track: '#1C1C1F',
  neutralFill: '#242428',
  onStatus: '#FFFFFF',
  shadow: '#000000',
  scrim: 'rgba(0, 0, 0, 0.75)',
  ringIcon: {
    calories: '#22C55E',
    protein: '#0EA5E9',
    carbs: '#F59E0B',
    fat: '#EF4444',
    workout: '#0EA5E9',
    rest: '#22C55E'
  },
  connected: '#22C55E',
  syncing: '#0EA5E9',
  offline: '#8E8E93',
  error: '#EF4444'
};

// Kinetic Pure Light: cool porcelain canvas, white cards lifted by soft shadows,
// blue / orange / rose macro colors and green for "on track".
export const kineticPureLight: ThemeColors = {
  name: 'Kinetic Pure Light',
  isDark: false,
  background: '#F4F6FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  surfaceElevated: '#EEF2F8',
  surfaceSubtle: '#F8FAFC',
  border: '#E6EBF2',
  borderSubtle: '#DDE3EC',
  text: '#0F172A',
  textSecondary: '#475569', // 7.6:1 on white
  textMuted: '#64748B', // 4.8:1 on white
  primary: '#0369A1', // 5.9:1 with white text
  primaryGlow: 'rgba(3, 105, 161, 0.2)',
  onPrimary: '#FFFFFF',
  protein: '#0284C7',
  carbs: '#D97706',
  fat: '#E11D48',
  calories: '#059669',
  onTrack: '#047857',
  onTrackBg: '#D1FAE5',
  almostThere: '#B45309',
  almostThereBg: '#FEF3C7',
  overTarget: '#BE123C',
  overTargetBg: '#FFE4E6',
  track: '#E8EDF4',
  neutralFill: '#DDE3EC',
  onStatus: '#FFFFFF',
  shadow: '#0F172A',
  scrim: 'rgba(15, 23, 42, 0.5)',
  // Icon color == its ring stroke color; every one is >= 3:1 on white
  ringIcon: {
    calories: '#059669', // 3.8:1
    protein: '#0284C7', // 4.1:1
    carbs: '#D97706', // 3.2:1
    fat: '#E11D48', // 4.7:1
    workout: '#0284C7',
    rest: '#0369A1' // 5.9:1
  },
  connected: '#047857',
  syncing: '#0284C7',
  offline: '#64748B',
  error: '#BE123C'
};

/** Soft card lift for the light theme (dark relies on borders). Pair with `shadowColor: theme.shadow`. */
export const softShadow = Platform.select({
  web: {
    boxShadow: '0 6px 16px -4px rgba(15, 23, 42, 0.07)'
  },
  default: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 2
  }
}) as any;
/**
 * The watch face mock is always dark (AMOLED), whatever the app theme is.
 * Ring icon tints keep >= 3:1 against #000000 (all are > 9:1).
 */
export const watchFace = {
  bezel: '#18181B',
  bezelBorder: '#27272A',
  screen: '#000000',
  chip: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  calories: '#34D399',
  protein: '#38BDF8',
  carbs: '#FBBF24',
  fat: '#FB7185',
  workout: '#34D399',
  rest: '#38BDF8',
  ringIcon: {
    calories: '#FFFFFF',
    workout: '#FFFFFF',
    protein: '#7DD3FC',
    carbs: '#FCD34D',
    fat: '#FDA4AF'
  }
} as const;

/** Readable glyph/text color (black or white) for a solid #RRGGBB fill. */
export function onColor(bg: string): string {
  const lin = (i: number) => {
    const c = parseInt(bg.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * lin(0) + 0.7152 * lin(1) + 0.0722 * lin(2);
  return lum > 0.18 ? '#000000' : '#FFFFFF'; // crossover where black/white contrast is equal
}
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  touchTarget: 44
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999
} as const;

export const typography = {
  displayLarge: {
    fontSize: 40,
    fontWeight: '700' as const,
    letterSpacing: -1
  },
  displayMedium: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.8
  },
  headlineLarge: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5
  },
  headlineMedium: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.3
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600' as const
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
    letterSpacing: 0.2
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.4
  },
  micro: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.8
  }
} as const;
