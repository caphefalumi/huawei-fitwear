import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  useReducedMotion
} from 'react-native-reanimated';
import { useAppTheme } from '../../theme';

export interface HuaweiGlanceDialProps {
  size?: number;
  outerValue?: number;
  middleValue?: number;
  innerValue?: number;
  outerTarget?: number;
  middleTarget?: number;
  innerTarget?: number;
  onPress?: () => void;
}

export const HuaweiGlanceDial: React.FC<HuaweiGlanceDialProps> = ({
  size = 230,
  outerValue = 1537,
  middleValue = 1,
  innerValue = 9,
  outerTarget = 500,
  middleTarget = 30,
  innerTarget = 12,
  onPress
}) => {
  const { radii, isDark, theme } = useAppTheme();
  const reducedMotion = useReducedMotion();

  const center = size / 2;
  const strokeWidth = Math.round(size * 0.082); // ~19px thick rings
  const ringGap = 3.5;

  const rOuter = center - strokeWidth / 2 - 4;
  const rMiddle = rOuter - strokeWidth - ringGap;
  const rInner = rMiddle - strokeWidth - ringGap;

  const circOuter = 2 * Math.PI * rOuter;
  const circMiddle = 2 * Math.PI * rMiddle;
  const circInner = 2 * Math.PI * rInner;

  // Target ratios: always leave an open segment so the progress arc and rounded tip are visible like Stand & Exercise
  const maxArcRatio = 0.82;
  const outerRatio = Math.min(Math.max(outerValue / Math.max(outerTarget, 1), 0.04), maxArcRatio);
  const middleRatio = Math.min(Math.max(middleValue / Math.max(middleTarget, 1), 0.04), maxArcRatio);
  const innerRatio = Math.min(Math.max(innerValue / Math.max(innerTarget, 1), 0.04), maxArcRatio);

  // Smooth frame progress (0 -> 1)
  const [animProgress, setAnimProgress] = useState(reducedMotion ? 1 : 0);

  // Bead scales (at 12 o'clock start)
  const outerBeadScale = useSharedValue(reducedMotion ? 1 : 0);
  const midBeadScale = useSharedValue(reducedMotion ? 1 : 0);
  const innerBeadScale = useSharedValue(reducedMotion ? 1 : 0);

  // Interactive press scale
  const pressScale = useSharedValue(1);

  const triggerAnimation = useCallback(() => {
    if (reducedMotion) {
      setAnimProgress(1);
      return;
    }

    setAnimProgress(0);
    let startTime: number | null = null;
    let animId: number;

    const duration = 1200; // 1.2s smooth cinematic sweep
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);

      // easeOutCubic curve: fast start, silky smooth deceleration
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimProgress(eased);

      if (t < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      outerBeadScale.set(1);
      midBeadScale.set(1);
      innerBeadScale.set(1);
      return;
    }

    // Beads spring pop-in
    outerBeadScale.set(0);
    midBeadScale.set(0);
    innerBeadScale.set(0);
    outerBeadScale.set(withSpring(1, { damping: 14, stiffness: 200 }));
    midBeadScale.set(withDelay(80, withSpring(1, { damping: 14, stiffness: 200 })));
    innerBeadScale.set(withDelay(160, withSpring(1, { damping: 14, stiffness: 200 })));

    const cleanup = triggerAnimation();
    return cleanup;
  }, [
    outerValue,
    middleValue,
    innerValue,
    outerTarget,
    middleTarget,
    innerTarget,
    reducedMotion,
    triggerAnimation,
    outerBeadScale,
    midBeadScale,
    innerBeadScale
  ]);

  // Staggered arc progress calculation
  const outerP = Math.min(animProgress / 0.88, 1) * outerRatio;
  const midP = Math.min(Math.max((animProgress - 0.08) / 0.84, 0), 1) * middleRatio;
  const innerP = Math.min(Math.max((animProgress - 0.16) / 0.84, 0), 1) * innerRatio;

  // Stroke Dash Offsets (clockwise from 12 o'clock)
  const outerOffset = circOuter * (1 - outerP);
  const midOffset = circMiddle * (1 - midP);
  const innerOffset = circInner * (1 - innerP);

  const dialAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.get() }]
  }));

  const outerBeadAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: outerBeadScale.get() }]
  }));

  const midBeadAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: midBeadScale.get() }]
  }));

  const innerBeadAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerBeadScale.get() }]
  }));

  const colors = {
    outer: '#FF4D30',
    outerTrack: isDark ? '#381410' : 'rgba(255, 77, 48, 0.12)',
    middle: '#FFD200',
    middleTrack: isDark ? '#3B320B' : 'rgba(255, 210, 0, 0.16)',
    inner: '#00A3FF',
    innerTrack: isDark ? '#0C223A' : 'rgba(0, 163, 255, 0.14)'
  };

  const handlePressIn = () => {
    if (!reducedMotion) {
      pressScale.set(withSpring(0.97, { damping: 15, stiffness: 300 }));
    }
  };

  const handlePressOut = () => {
    if (!reducedMotion) {
      pressScale.set(withSpring(1, { damping: 12, stiffness: 200 }));
    }
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    triggerAnimation();
    if (onPress) onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="progressbar"
      accessibilityLabel={`Activity Rings: ${innerValue} hours standing, ${middleValue} exercise minutes, ${outerValue} active calories`}
    >
      <Animated.View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            backgroundColor: 'transparent',
            borderRadius: radii.full
          },
          dialAnimStyle
        ]}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Complete 360-Degree Background Tracks */}
          <Circle
            cx={center}
            cy={center}
            r={rOuter}
            stroke={colors.outerTrack}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={rMiddle}
            stroke={colors.middleTrack}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={center}
            cy={center}
            r={rInner}
            stroke={colors.innerTrack}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Active 360-Degree Progress Arcs (Clockwise from 12 o'clock) */}
          {outerP > 0 ? (
            <Circle
              cx={center}
              cy={center}
              r={rOuter}
              stroke={colors.outer}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circOuter} ${circOuter}`}
              strokeDashoffset={outerOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          ) : null}

          {midP > 0 ? (
            <Circle
              cx={center}
              cy={center}
              r={rMiddle}
              stroke={colors.middle}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circMiddle} ${circMiddle}`}
              strokeDashoffset={midOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          ) : null}

          {innerP > 0 ? (
            <Circle
              cx={center}
              cy={center}
              r={rInner}
              stroke={colors.inner}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circInner} ${circInner}`}
              strokeDashoffset={innerOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          ) : null}
        </Svg>

        {/* Outer Bead (Flame) at 12 o'clock start */}
        <Animated.View
          style={[
            styles.beadCircle,
            {
              top: center - rOuter - strokeWidth * 0.48,
              left: center - strokeWidth * 0.48,
              width: strokeWidth * 0.96,
              height: strokeWidth * 0.96,
              backgroundColor: colors.outer
            },
            outerBeadAnimStyle
          ]}
        >
          <Ionicons name="flame" size={Math.max(10, strokeWidth * 0.58)} color="#FFFFFF" />
        </Animated.View>

        {/* Middle Bead (Walk/Exercise) at 12 o'clock start */}
        <Animated.View
          style={[
            styles.beadCircle,
            {
              top: center - rMiddle - strokeWidth * 0.48,
              left: center - strokeWidth * 0.48,
              width: strokeWidth * 0.96,
              height: strokeWidth * 0.96,
              backgroundColor: colors.middle
            },
            midBeadAnimStyle
          ]}
        >
          <Ionicons name="walk" size={Math.max(10, strokeWidth * 0.60)} color="#000000" />
        </Animated.View>

        {/* Inner Bead (Stand) at 12 o'clock start */}
        <Animated.View
          style={[
            styles.beadCircle,
            {
              top: center - rInner - strokeWidth * 0.48,
              left: center - strokeWidth * 0.48,
              width: strokeWidth * 0.96,
              height: strokeWidth * 0.96,
              backgroundColor: colors.inner
            },
            innerBeadAnimStyle
          ]}
        >
          <Ionicons name="body" size={Math.max(10, strokeWidth * 0.56)} color="#FFFFFF" />
        </Animated.View>

        {/* Center Airy Icon Corridor */}
        <View style={styles.centerCorridor}>
          <View style={[styles.centerIconBadge, { backgroundColor: `${theme.primary}12` }]}>
            <Ionicons name="sparkles" size={18} color={theme.primary} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  beadCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    pointerEvents: 'none'
  },
  centerCorridor: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  },
  centerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
