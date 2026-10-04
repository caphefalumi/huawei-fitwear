import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { useReducedMotion } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';
import { RingIcon, type RingIconName } from './RingIcon';

export interface RestTimerRingIcon {
  name?: RingIconName;
  color?: string;
}

export interface RestTimerRingProps {
  secondsLeft: number;
  totalSeconds?: number;
  size?: number;
  onTimeUp?: () => void;
  icon?: RestTimerRingIcon;
  iconSize?: number; // default: ring size * 0.22, minimum 16
  badge?: 'warning' | 'check';
  children?: React.ReactNode; // replaces time + labels (the icon stays)
}

const FONT_CAP = 1.1;
const ICON_GAP = 3;

export const RestTimerRing: React.FC<RestTimerRingProps> = ({
  secondsLeft,
  totalSeconds = 90,
  size = 200,
  onTimeUp,
  icon,
  iconSize,
  badge,
  children
}) => {
  const { theme } = useAppTheme();
  const strokeWidth = 10;
  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const reducedMotion = useReducedMotion();

  const progress = Math.min(Math.max(secondsLeft / totalSeconds, 0), 1);
  const strokeDashoffset = circumference - progress * circumference;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Free circle inside the stroke; the icon never gets bigger than a third of it.
  const innerDiameter = 2 * (radius - strokeWidth / 2);
  const requestedIcon = iconSize ?? Math.round(size * 0.22);
  const finalIconSize = Math.max(16, Math.min(requestedIcon, Math.floor(innerDiameter * 0.3)));
  const timeFont = Math.min(42, Math.max(18, Math.round(innerDiameter * 0.2)));
  const showDetails = innerDiameter >= 180; // "REST TIME" + hint only where they fit
  const lastSeconds = secondsLeft > 0 && secondsLeft <= 3;

  // Haptic tick every second of the last 3 (the icon pulse follows `secondsLeft` too)
  useEffect(() => {
    if (lastSeconds && !reducedMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, [secondsLeft, lastSeconds, reducedMotion]);

  useEffect(() => {
    if (secondsLeft === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      if (onTimeUp) onTimeUp();
    }
  }, [secondsLeft]);

  const badgeSize = Math.max(Math.round(size * 0.14), 18);
  const badgeOffset = Math.round(size * 0.05);

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: totalSeconds, now: secondsLeft }}
      accessibilityLabel={`Rest timer, ${secondsLeft} seconds remaining`}
    >
      <Svg width={size} height={size} style={styles.svg}>
        {/* Track Background */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.track}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={theme.isDark ? 0.6 : 0.8}
        />
        {/* Active Progress Arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      <View style={[styles.centerContent, { pointerEvents: 'none' }]}>
        <View style={[styles.centerText, { maxWidth: innerDiameter }]}>
          <RingIcon
            name={icon?.name || 'timer-outline'}
            size={finalIconSize}
            color={icon?.color || theme.ringIcon.rest}
            pulseSignal={lastSeconds ? secondsLeft : 0}
          />

          {children ? (
            children
          ) : (
            <>
              <Text
                style={[
                  styles.timerValue,
                  {
                    color: theme.text,
                    fontSize: timeFont,
                    lineHeight: Math.round(timeFont * 1.2),
                    marginTop: ICON_GAP
                  }
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
                maxFontSizeMultiplier={FONT_CAP}
              >
                {formattedTime}
              </Text>
              {showDetails ? (
                <>
                  <Text
                    style={[styles.timerLabel, { color: theme.textSecondary }]}
                    maxFontSizeMultiplier={FONT_CAP}
                  >
                    REST TIME
                  </Text>
                  <Text
                    style={[styles.buzzHint, { color: theme.primary }]}
                    maxFontSizeMultiplier={FONT_CAP}
                  >
                    Buzz when rest ends
                  </Text>
                </>
              ) : null}
            </>
          )}
        </View>
      </View>

      {/* Top-Right Badge if present */}
      {badge ? (
        <View
          style={[
            styles.badgeContainer,
            {
              top: badgeOffset,
              right: badgeOffset,
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: badge === 'warning' ? theme.overTarget : theme.onTrack,
              borderColor: theme.background
            }
          ]}
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
        >
          <MaterialCommunityIcons
            name={badge === 'warning' ? 'alert' : 'check'}
            size={Math.round(badgeSize * 0.7)}
            color={theme.onStatus}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  svg: {
    position: 'absolute'
  },
  centerContent: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerText: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  timerValue: {
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  timerLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2
  },
  buzzHint: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3
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
  }
});
