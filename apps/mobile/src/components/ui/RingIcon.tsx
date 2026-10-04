import React, { useEffect, useRef } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  useReducedMotion
} from 'react-native-reanimated';

export type RingIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface RingIconProps {
  name: RingIconName;
  size: number;
  color: string;
  dimmed?: boolean; // 0% progress: icon at 0.5 opacity
  pulseSignal?: number; // any change (after mount) triggers one brief pulse
}

/**
 * Decorative symbol shown inside progress rings.
 * - fades + scales in on mount (~300 ms); reduced motion: plain fade only
 * - one brief pulse whenever `pulseSignal` changes; reduced motion: no pulse
 * - hidden from screen readers (the ring itself carries the spoken label)
 */
export const RingIcon: React.FC<RingIconProps> = ({
  name,
  size,
  color,
  dimmed = false,
  pulseSignal = 0
}) => {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(reducedMotion ? 1 : 0.85);
  const pulse = useSharedValue(1);
  const lastSignal = useRef(pulseSignal);
  const targetOpacity = dimmed ? 0.5 : 1;

  useEffect(() => {
    opacity.set(withTiming(targetOpacity, { duration: 300 }));
    scale.set(reducedMotion ? 1 : withTiming(1, { duration: 300 }));
  }, [targetOpacity, reducedMotion, opacity, scale]);

  useEffect(() => {
    if (lastSignal.current === pulseSignal) return;
    lastSignal.current = pulseSignal;
    if (reducedMotion) return;
    pulse.set(withSequence(withTiming(1.2, { duration: 120 }), withTiming(1, { duration: 180 })));
  }, [pulseSignal, reducedMotion, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ scale: scale.get() * pulse.get() }]
  }));

  return (
    <Animated.View
      style={animatedStyle}
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
    >
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </Animated.View>
  );
};
