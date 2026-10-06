import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
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

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

/**
 * Draws an arc starting at startAngle (bottom-left) and sweeping CLOCKWISE to endAngle (up and around to bottom-right).
 */
function describeArcClockwise(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const diff = endAngle - startAngle;
  if (diff <= 0.6) {
    return '';
  }
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = diff <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y
  ].join(' ');
}

export const HuaweiGlanceDial: React.FC<HuaweiGlanceDialProps> = ({
  size = 240,
  outerValue = 106,
  middleValue = 1,
  innerValue = 9,
  outerTarget = 500,
  middleTarget = 30,
  innerTarget = 12,
  onPress
}) => {
  const { radii, isDark } = useAppTheme();
  const reducedMotion = useReducedMotion();

  const strokeWidth = Math.round(size * 0.07);
  const center = size / 2;

  const rOuter = center - strokeWidth * 0.85;
  const rMiddle = rOuter - strokeWidth - 4;
  const rInner = rMiddle - strokeWidth - 4;

  const startAngle = 225; // Góc dưới bên trái (bắt đầu)
  const totalSweep = 260; // Quét từ góc trái vòng lên đỉnh rồi sang góc phải
  const maxEndAngle = startAngle + totalSweep; // Góc dưới bên phải (kết thúc)

  // Target ratios (capped between 0.04 and 1)
  const outerRatio = Math.min(Math.max(outerValue / Math.max(outerTarget, 1), 0.04), 1);
  const middleRatio = Math.min(Math.max(middleValue / Math.max(middleTarget, 1), 0.04), 1);
  const innerRatio = Math.min(Math.max(innerValue / Math.max(innerTarget, 1), 0.04), 1);

  // Smooth frame progress (0 -> 1)
  const [animProgress, setAnimProgress] = useState(reducedMotion ? 1 : 0);

  // Bead scales
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

    const duration = 1100; // 1.1s cinematic sweep
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);

      // easeOutCubic curve: nhanh ở đầu, trơn mượt ở đoạn về đích
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
  // Vòng ngoài (Đỏ/Move): bắt đầu ngay lập tức từ góc trái vòng lên
  const outerP = Math.min(animProgress / 0.88, 1);
  const currentOuterRatio = outerP * outerRatio;
  const currentOuterEnd = startAngle + totalSweep * currentOuterRatio;

  // Vòng giữa (Vàng/Exercise): bắt đầu sau 8% tiến trình
  const midP = Math.min(Math.max((animProgress - 0.08) / 0.84, 0), 1);
  const currentMiddleRatio = midP * middleRatio;
  const currentMiddleEnd = startAngle + totalSweep * currentMiddleRatio;

  // Vòng trong (Xanh/Stand): bắt đầu sau 16% tiến trình
  const innerP = Math.min(Math.max((animProgress - 0.16) / 0.84, 0), 1);
  const currentInnerRatio = innerP * innerRatio;
  const currentInnerEnd = startAngle + totalSweep * currentInnerRatio;

  // Real-time counting numbers in sync with arcs
  const displayOuterNumber = Math.round(outerP * outerValue);
  const displayMiddleNumber = Math.round(midP * middleValue);
  const displayInnerNumber = Math.round(innerP * innerValue);

  // SVG Paths for each arc (from startAngle at left corner sweeping clockwise up and around)
  const trackPathOuter = describeArcClockwise(center, center, rOuter, startAngle, maxEndAngle);
  const trackPathMid = describeArcClockwise(center, center, rMiddle, startAngle, maxEndAngle);
  const trackPathInner = describeArcClockwise(center, center, rInner, startAngle, maxEndAngle);

  const activePathOuter = describeArcClockwise(center, center, rOuter, startAngle, currentOuterEnd);
  const activePathMid = describeArcClockwise(center, center, rMiddle, startAngle, currentMiddleEnd);
  const activePathInner = describeArcClockwise(center, center, rInner, startAngle, currentInnerEnd);

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
    middleTrack: isDark ? '#3B320B' : 'rgba(255, 210, 0, 0.18)',
    inner: '#00A3FF',
    innerTrack: isDark ? '#0C223A' : 'rgba(0, 163, 255, 0.14)'
  };

  const outerBeadPos = polarToCartesian(center, center, rOuter, startAngle);
  const midBeadPos = polarToCartesian(center, center, rMiddle, startAngle);
  const innerBeadPos = polarToCartesian(center, center, rInner, startAngle);

  const isOuterLarge = outerValue > 999;
  const fontSize = Math.round(size * 0.096);
  const outerFontSize = isOuterLarge ? Math.round(size * 0.088) : fontSize;
  const lineHeight = Math.round(fontSize * 1.15);

  const handlePressIn = () => {
    if (!reducedMotion) {
      pressScale.set(withSpring(0.96, { damping: 15, stiffness: 300 }));
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
      accessibilityLabel={`Activity Glance: ${innerValue} active hours, ${middleValue} exercise minutes, ${outerValue} calories`}
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
          {/* Background Tracks (full sweep from left to right corner) */}
          <Path
            d={trackPathOuter}
            fill="none"
            stroke={colors.outerTrack}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <Path
            d={trackPathMid}
            fill="none"
            stroke={colors.middleTrack}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <Path
            d={trackPathInner}
            fill="none"
            stroke={colors.innerTrack}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Arcs: sweeping from left corner, looping up and around to right corner */}
          {activePathOuter ? (
            <Path
              d={activePathOuter}
              fill="none"
              stroke={colors.outer}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          ) : null}
          {activePathMid ? (
            <Path
              d={activePathMid}
              fill="none"
              stroke={colors.middle}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          ) : null}
          {activePathInner ? (
            <Path
              d={activePathInner}
              fill="none"
              stroke={colors.inner}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          ) : null}
        </Svg>

        {/* Outer Bead (Flame) at bottom-left start */}
        <Animated.View
          style={[
            styles.beadCircle,
            {
              top: outerBeadPos.y - strokeWidth * 0.48,
              left: outerBeadPos.x - strokeWidth * 0.48,
              width: strokeWidth * 0.96,
              height: strokeWidth * 0.96,
              backgroundColor: colors.outer
            },
            outerBeadAnimStyle
          ]}
        >
          <Ionicons name="flame" size={Math.max(10, strokeWidth * 0.58)} color="#FFFFFF" />
        </Animated.View>

        {/* Middle Bead (Walk/Exercise) at bottom-left start */}
        <Animated.View
          style={[
            styles.beadCircle,
            {
              top: midBeadPos.y - strokeWidth * 0.48,
              left: midBeadPos.x - strokeWidth * 0.48,
              width: strokeWidth * 0.96,
              height: strokeWidth * 0.96,
              backgroundColor: colors.middle
            },
            midBeadAnimStyle
          ]}
        >
          <Ionicons name="walk" size={Math.max(10, strokeWidth * 0.60)} color="#000000" />
        </Animated.View>

        {/* Inner Bead (Stand) at bottom-left start */}
        <Animated.View
          style={[
            styles.beadCircle,
            {
              top: innerBeadPos.y - strokeWidth * 0.48,
              left: innerBeadPos.x - strokeWidth * 0.48,
              width: strokeWidth * 0.96,
              height: strokeWidth * 0.96,
              backgroundColor: colors.inner
            },
            innerBeadAnimStyle
          ]}
        >
          <Ionicons name="body" size={Math.max(10, strokeWidth * 0.56)} color="#FFFFFF" />
        </Animated.View>

        {/* Center Numbers Container (Counting in sync with arcs) */}
        <View
          style={{
            position: 'absolute',
            left: center - Math.round(size * 0.20),
            width: Math.round(size * 0.40),
            top: center + Math.round(size * 0.03),
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <Text
            style={[
              styles.statNum,
              {
                color: colors.inner,
                fontSize,
                lineHeight,
                textAlign: 'center'
              }
            ]}
          >
            {displayInnerNumber}
          </Text>
          <Text
            style={[
              styles.statNum,
              {
                color: colors.middle,
                fontSize,
                lineHeight,
                textAlign: 'center',
                marginVertical: 1
              }
            ]}
          >
            {displayMiddleNumber}
          </Text>
          <Text
            style={[
              styles.statNum,
              {
                color: colors.outer,
                fontSize: outerFontSize,
                lineHeight: Math.round(outerFontSize * 1.15),
                textAlign: 'center'
              }
            ]}
            numberOfLines={1}
          >
            {displayOuterNumber}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  beadCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    pointerEvents: 'none'
  },
  statNum: {
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
    textAlign: 'center'
  }
});
