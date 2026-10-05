import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
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

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const diff = endAngle - startAngle;
  const largeArcFlag = diff <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

export const HuaweiGlanceDial: React.FC<HuaweiGlanceDialProps> = ({
  size = 260,
  outerValue = 106,
  middleValue = 1,
  innerValue = 9,
  outerTarget = 500,
  middleTarget = 30,
  innerTarget = 12,
  onPress
}) => {
  const { radii, isDark } = useAppTheme();

  const strokeWidth = Math.round(size * 0.08);
  const center = size / 2;

  const rOuter = center - strokeWidth * 0.75;
  const rMiddle = rOuter - strokeWidth - 4;
  const rInner = rMiddle - strokeWidth - 4;

  const startAngle = 220;
  const totalSweep = 245;
  const maxEndAngle = startAngle + totalSweep;

  const outerRatio = Math.min(Math.max(outerValue / Math.max(outerTarget, 1), 0.04), 1);
  const middleRatio = Math.min(Math.max(middleValue / Math.max(middleTarget, 1), 0.04), 1);
  const innerRatio = Math.min(Math.max(innerValue / Math.max(innerTarget, 1), 0.04), 1);

  const outerEnd = startAngle + totalSweep * outerRatio;
  const middleEnd = startAngle + totalSweep * middleRatio;
  const innerEnd = startAngle + totalSweep * innerRatio;

  const colors = {
    outer: '#FF4D30',
    outerTrack: isDark ? '#381410' : 'rgba(255, 77, 48, 0.12)',
    middle: '#FFD200',
    middleTrack: isDark ? '#3B320B' : 'rgba(255, 210, 0, 0.18)',
    inner: '#00A3FF',
    innerTrack: isDark ? '#0C223A' : 'rgba(0, 163, 255, 0.14)'
  };

  const midBeadPos = polarToCartesian(center, center, rMiddle, startAngle + 2);
  const innerBeadPos = polarToCartesian(center, center, rInner, startAngle + 2);

  const isOuterLarge = outerValue > 999;
  const standardFontSize = Math.round(size * 0.115);
  const outerFontSize = isOuterLarge ? Math.round(size * 0.098) : standardFontSize;

  const rightOffset = size - (center + Math.round(size * 0.16));
  const topOffset = center + Math.round(size * 0.03);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: 'transparent',
          borderRadius: radii.full
        }
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Activity Glance: ${innerValue} active hours, ${middleValue} exercise minutes, ${outerValue} calories`}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Path
          d={describeArc(center, center, rOuter, startAngle, maxEndAngle)}
          fill="none"
          stroke={colors.outerTrack}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d={describeArc(center, center, rMiddle, startAngle, maxEndAngle)}
          fill="none"
          stroke={colors.middleTrack}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d={describeArc(center, center, rInner, startAngle, maxEndAngle)}
          fill="none"
          stroke={colors.innerTrack}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        <Path
          d={describeArc(center, center, rOuter, startAngle, outerEnd)}
          fill="none"
          stroke={colors.outer}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d={describeArc(center, center, rMiddle, startAngle, middleEnd)}
          fill="none"
          stroke={colors.middle}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d={describeArc(center, center, rInner, startAngle, innerEnd)}
          fill="none"
          stroke={colors.inner}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        <G x={midBeadPos.x} y={midBeadPos.y}>
          <Circle cx={0} cy={0} r={strokeWidth * 0.48} fill={colors.middle} />
        </G>

        <G x={innerBeadPos.x} y={innerBeadPos.y}>
          <Circle cx={0} cy={0} r={strokeWidth * 0.48} fill={colors.inner} />
        </G>
      </Svg>

      <View
        style={[
          styles.beadIconOverlay,
          {
            top: midBeadPos.y - strokeWidth * 0.48,
            left: midBeadPos.x - strokeWidth * 0.48,
            width: strokeWidth * 0.96,
            height: strokeWidth * 0.96,
            pointerEvents: 'none'
          }
        ]}
      >
        <Ionicons name="walk" size={Math.max(12, strokeWidth * 0.58)} color="#000000" />
      </View>

      <View
        style={[
          styles.beadIconOverlay,
          {
            top: innerBeadPos.y - strokeWidth * 0.48,
            left: innerBeadPos.x - strokeWidth * 0.48,
            width: strokeWidth * 0.96,
            height: strokeWidth * 0.96,
            pointerEvents: 'none'
          }
        ]}
      >
        <Ionicons name="body" size={Math.max(11, strokeWidth * 0.54)} color="#FFFFFF" />
      </View>

      <View
        style={[
          styles.numbersStack,
          {
            right: rightOffset,
            top: topOffset,
            alignItems: 'flex-end',
            pointerEvents: 'none'
          }
        ]}
      >
        <Text style={[styles.statNum, { color: colors.inner, fontSize: standardFontSize, lineHeight: standardFontSize * 1.1 }]}>
          {innerValue}
        </Text>
        <Text style={[styles.statNum, { color: colors.middle, fontSize: standardFontSize, lineHeight: standardFontSize * 1.1, marginVertical: 1 }]}>
          {middleValue}
        </Text>
        <Text
          style={[
            styles.statNum,
            {
              color: colors.outer,
              fontSize: outerFontSize,
              lineHeight: outerFontSize * 1.1
            }
          ]}
          numberOfLines={1}
        >
          {outerValue}
        </Text>
      </View>
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
  beadIconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  numbersStack: {
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  statNum: {
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
    textAlign: 'right'
  }
});
