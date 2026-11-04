import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Palette as C } from '@/constants/palette';

/** Ring frame size from Figma (node 4:3836, "Nutrition" body). */
const SIZE = 112;
const R = 46;
const LEN = 2 * Math.PI * R;

const ACircle = Animated.createAnimatedComponent(Circle);

export function NutritionRing({
  kcalLeft,
  progress,
}: {
  kcalLeft: number;
  progress: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const fill = Math.max(0, Math.min(1, progress));

  useEffect(() => {
    anim.setValue(0);
    const t = Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: false });
    t.start();
    return () => t.stop();
  }, [anim, fill]);

  const dashOffset = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [LEN, LEN * (1 - fill)],
  });

  return (
    <View style={styles.ring}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={C.card}
          strokeWidth={10}
        />
        <ACircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={C.accent}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={LEN}
          strokeDashoffset={dashOffset}
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.value}>{kcalLeft}</Text>
        <Text style={styles.label}>kcal left</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },
  label: {
    fontSize: 9,
    color: C.textMuted,
  },
});
