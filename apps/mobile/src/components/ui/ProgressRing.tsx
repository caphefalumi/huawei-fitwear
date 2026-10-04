import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme, kineticObsidian, onColor } from '../../theme';
import { RingIcon, type RingIconName } from './RingIcon';

export interface RingData {
  value: number; // 0 to 1 (or >1)
  color: string;
  radius: number;
  strokeWidth: number;
  icon?: RingIconName; // concentric rings: glyph on a fixed bead at the ring's 12 o'clock start
}

export interface ProgressRingIcon {
  name: RingIconName;
  color?: string;
}

export interface ProgressRingProps {
  size?: number;
  rings?: RingData[];
  primaryValue?: string | number;
  primaryLabel?: string;
  secondaryLabel?: string;
  strokeWidth?: number;
  progress?: number; // 0 to 1 for single ring (or >1 if over target)
  color?: string;
  icon?: ProgressRingIcon;
  iconSize?: number; // default: ring size * 0.22 (watch: 0.16), minimum 16
  badge?: 'warning' | 'check'; // small badge at the top right; auto-set when over target / workout done
  isWatch?: boolean; // dark watch-face variant
  isWorkoutRing?: boolean; // at 100% the icon swaps to a check
  isLoading?: boolean; // skeleton ring, no icon
  accessibilityLabel?: string;
  children?: React.ReactNode; // replaces number + label (the icon stays)
}

// In-ring text never grows past this with the system font scale, so it can't reach the stroke.
const FONT_CAP = 1.1;
const ICON_GAP = 3;

export const ProgressRing: React.FC<ProgressRingProps> = ({
  size = 200,
  rings,
  primaryValue,
  primaryLabel,
  secondaryLabel,
  strokeWidth = 10,
  progress = 0.75,
  color,
  icon,
  iconSize,
  badge,
  isWatch = false,
  isWorkoutRing = false,
  isLoading = false,
  accessibilityLabel,
  children
}) => {
  const { theme: appTheme } = useAppTheme();
  // The watch face is always dark, whatever the app theme is.
  const theme = isWatch ? kineticObsidian : appTheme;
  const center = size / 2;

  const activeRings: RingData[] = rings || [
    {
      value: progress,
      color: color || theme.calories,
      radius: (size - strokeWidth * 2) / 2,
      strokeWidth
    }
  ];

  const primaryProgress = activeRings[0]?.value ?? progress;
  const isZeroPercent = primaryProgress <= 0;
  const isOverTarget = primaryProgress > 1;
  const isWorkoutDone = isWorkoutRing && primaryProgress >= 1;

  const effectiveBadge = badge || (isOverTarget ? 'warning' : isWorkoutDone ? 'check' : undefined);
  const iconName: RingIconName | undefined = isWorkoutDone ? 'check' : icon?.name;
  const iconColor = icon?.color || activeRings[0]?.color || theme.ringIcon.calories;
  // Calories icon pulses when the value changes; the workout icon pops once when it flips to check.
  const pulseSignal = isWorkoutRing ? Number(isWorkoutDone) : icon?.name === 'fire' ? primaryProgress : 0;

  const isLarge = size >= 160;
  const isSmall = size < 100;

  // Free circle inside the innermost stroke: everything in the center must fit in here.
  const innerDiameter = 2 * Math.min(...activeRings.map((r) => r.radius - r.strokeWidth / 2));
  const budget = innerDiameter * 0.78;
  const requestedIcon = iconSize ?? Math.round(size * (isWatch ? 0.16 : 0.22));
  const maxIcon = Math.floor(innerDiameter * (isSmall ? 0.7 : isWatch ? 0.3 : 0.27));
  const finalIconSize = Math.max(16, Math.min(requestedIcon, maxIcon));

  const numberFont = Math.min(isLarge ? 30 : 20, Math.floor(innerDiameter * 0.24));
  const numberLine = Math.round(numberFont * 1.15);
  const hasNumber = primaryValue !== undefined;
  const numberHeight = hasNumber ? ICON_GAP + Math.ceil(numberLine * FONT_CAP) : 0;
  const labelHeight = isLarge && primaryLabel ? 2 + Math.ceil(13 * FONT_CAP) : 0;
  const withLabel = finalIconSize + numberHeight + labelHeight;
  const secondaryHeight = 1 + Math.ceil(12 * FONT_CAP);
  const secondaryInside = !!secondaryLabel && isLarge && withLabel + secondaryHeight <= budget;
  // Doesn't fit inside the free circle: show it under the ring instead (never on the watch face).
  const secondaryBelow = !!secondaryLabel && isLarge && !secondaryInside && !isWatch;
  const contentHeight = withLabel + (secondaryInside ? secondaryHeight : 0);
  // Widest line that still clears the stroke at the bottom of the content block (glyphs end ~3px above the line box).
  const edgeWidth = Math.floor(2 * Math.sqrt(Math.max((innerDiameter / 2) ** 2 - (contentHeight / 2 - 3) ** 2, 0)));

  // Concentric rings: each ring with an icon gets a fixed bead at its 12 o'clock start,
  // sized to the gap between neighbouring strokes.
  const beads =
    activeRings.length > 1
      ? activeRings.flatMap((ring, i) => {
          if (!ring.icon) return [];
          const gap = Math.min(
            ...activeRings
              .filter((_, j) => j !== i)
              .map((o) => Math.abs(o.radius - ring.radius) - o.strokeWidth / 2)
          );
          const spacing = Math.min(
            ...activeRings.filter((_, j) => j !== i).map((o) => Math.abs(o.radius - ring.radius))
          );
          // also capped by ring spacing so beads on adjacent rings barely touch when tips line up (e.g. 100%)
          const r = Math.max(
            ring.strokeWidth / 2 + 1,
            Math.min(Math.floor(gap - 0.5), 8, Math.floor(spacing * 0.65))
          );
          // fixed at the 12 o'clock start: the icons stay put while the arcs fill
          const x = center;
          const y = center - ring.radius;
          return [{ ring, r, x, y, glyph: Math.round(r * 1.35), key: i }];
        })
      : [];

  const percent = Math.min(Math.round(primaryProgress * 100), 100);
  const spokenLabel = `${accessibilityLabel || `${primaryLabel || 'Progress'}, ${percent} percent`}${
    isOverTarget ? ', over target' : ''
  }`;

  if (isLoading) {
    return (
      <View
        style={[styles.container, { width: size, height: size }]}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel="Loading"
      >
        <Svg width={size} height={size} style={styles.svg}>
          <Circle
            cx={center}
            cy={center}
            r={(size - strokeWidth * 2) / 2}
            stroke={theme.neutralFill}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.5}
          />
        </Svg>
      </View>
    );
  }

  const badgeSize = Math.max(Math.round(size * 0.14), 18);
  const badgeOffset = Math.round(size * 0.05);

  const iconNode = iconName ? (
    <RingIcon
      name={iconName}
      size={finalIconSize}
      color={iconColor}
      dimmed={isZeroPercent}
      pulseSignal={pulseSignal}
    />
  ) : null;

  return (
    <View style={styles.outerWrapper}>
      <View
        style={[styles.container, { width: size, height: size }]}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: percent }}
        accessibilityLabel={spokenLabel}
      >
        <Svg width={size} height={size} style={styles.svg}>
          {activeRings.map((ring, index) => {
            const circumference = 2 * Math.PI * ring.radius;
            const cappedValue = Math.min(Math.max(ring.value, 0), 1);
            const strokeDashoffset = circumference - cappedValue * circumference;

            return (
              <React.Fragment key={index}>
                {/* Background Track */}
                <Circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  stroke={theme.track}
                  strokeWidth={ring.strokeWidth}
                  fill="none"
                  opacity={theme.isDark ? 0.6 : 0.8}
                />
                {/* Active Progress Arc */}
                <Circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth}
                  fill="none"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${center} ${center})`}
                />
              </React.Fragment>
            );
          })}
          {beads.map(({ ring, r, x, y, key }) => (
            <Circle
              key={`bead-${key}`}
              cx={x}
              cy={y}
              r={r}
              fill={ring.color}
              opacity={ring.value <= 0 ? 0.5 : 1}
            />
          ))}
        </Svg>

        {beads.map(({ ring, x, y, glyph, key }) => (
          <View
            key={`glyph-${key}`}
            style={{
              position: 'absolute',
              left: x - glyph / 2,
              top: y - glyph / 2,
              pointerEvents: 'none'
            }}
          >
            <RingIcon name={ring.icon!} size={glyph} color={onColor(ring.color)} dimmed={ring.value <= 0} />
          </View>
        ))}

        {/* Central content: small = icon alone; medium/large = icon above number (+ label on large) */}
        <View style={[styles.centerContentWrapper, { pointerEvents: 'none' }]}>
          {isSmall ? (
            iconNode
          ) : (
            <View style={[styles.centerTextContainer, { maxWidth: innerDiameter }]}>
              {iconNode}

              {children ? (
                children
              ) : (
                <>
                  {hasNumber ? (
                    <Text
                      style={[
                        styles.primaryValue,
                        {
                          color: theme.text,
                          fontSize: numberFont,
                          lineHeight: numberLine,
                          marginTop: iconNode ? ICON_GAP : 0
                        }
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.6}
                      maxFontSizeMultiplier={FONT_CAP}
                    >
                      {primaryValue}
                    </Text>
                  ) : null}

                  {/* Label only on large rings (size >= 160) */}
                  {isLarge && primaryLabel ? (
                    <Text
                      style={[styles.primaryLabel, { color: theme.textSecondary, maxWidth: edgeWidth }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                      maxFontSizeMultiplier={FONT_CAP}
                    >
                      {primaryLabel}
                    </Text>
                  ) : null}

                  {secondaryInside ? (
                    <Text
                      style={[styles.secondaryLabel, { color: theme.textMuted, maxWidth: edgeWidth }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                      maxFontSizeMultiplier={FONT_CAP}
                    >
                      {secondaryLabel}
                    </Text>
                  ) : null}
                </>
              )}
            </View>
          )}
        </View>

        {/* Top-right badge (warning or check) */}
        {effectiveBadge ? (
          <View
            style={[
              styles.badgeContainer,
              {
                top: badgeOffset,
                right: badgeOffset,
                width: badgeSize,
                height: badgeSize,
                borderRadius: badgeSize / 2,
                backgroundColor: effectiveBadge === 'warning' ? theme.overTarget : theme.onTrack,
                borderColor: theme.background,
                ...(Platform.OS !== 'web' ? { shadowColor: theme.shadow } : null)
              }
            ]}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          >
            <MaterialCommunityIcons
              name={effectiveBadge === 'warning' ? 'alert' : 'check'}
              size={Math.round(badgeSize * 0.7)}
              color={theme.onStatus}
            />
          </View>
        ) : null}
      </View>

      {/* Small ring value sits below the ring; the ring's own label already speaks it */}
      {isSmall && hasNumber ? (
        <View
          style={styles.belowRingLabel}
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
        >
          <Text style={[styles.smallValueText, { color: theme.text }]}>{primaryValue}</Text>
          {primaryLabel ? (
            <Text style={[styles.smallLabelText, { color: theme.textSecondary }]}>{primaryLabel}</Text>
          ) : null}
        </View>
      ) : null}

      {secondaryBelow ? (
        <Text
          style={[styles.secondaryBelow, { color: theme.textSecondary }]}
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
        >
          {secondaryLabel}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  svg: {
    position: 'absolute'
  },
  centerContentWrapper: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryValue: {
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    fontVariant: ['tabular-nums']
  },
  primaryLabel: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
    textAlign: 'center'
  },
  secondaryLabel: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
    marginTop: 1,
    textAlign: 'center'
  },
  badgeContainer: {
    position: 'absolute',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
      },
      default: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3
      }
    })
  },
  belowRingLabel: {
    alignItems: 'center',
    marginTop: 4
  },
  secondaryBelow: {
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    marginTop: 8
  },
  smallValueText: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  smallLabelText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase'
  }
});
