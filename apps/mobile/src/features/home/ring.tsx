import { Image } from 'expo-image';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';

import { Palette as C } from '@/constants/palette';

/** Ring frame size from Figma (node 4:3836, "Nutrition" body). */
const SIZE = 112;

/**
 * The arc art is exported as its own bounding box (88.916 x 112 progress arc,
 * 91.996 x 112 consumed arc) flush to the right edge of the 112 frame. Rendering
 * it into a square box stretches it, so keep the exported aspect ratio.
 */
const ARC_WIDTH = { remaining: 88.916, consumed: 91.9961 };

const icons = {
  track: require('@/assets/images/home/ring-bg.svg'),
  hole: require('@/assets/images/home/ring-hole.svg'),
  remaining: require('@/assets/images/home/ring-remaining.svg'),
  consumed: require('@/assets/images/home/ring-saved.svg'),
};

export function NutritionRing({ kcalLeft, saved }: { kcalLeft: number; saved: boolean }) {
  return (
    <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.ring}>
      <Image source={icons.track} style={styles.disc} contentFit="fill" />
      <Image
        source={saved ? icons.consumed : icons.remaining}
        style={[
          styles.arc,
          { width: saved ? ARC_WIDTH.consumed : ARC_WIDTH.remaining },
        ]}
        contentFit="fill"
      />
      <Image source={icons.hole} style={styles.hole} contentFit="fill" />
      <View style={styles.center}>
        <Text style={styles.value}>{kcalLeft}</Text>
        <Text style={styles.label}>kcal left</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: SIZE,
    height: SIZE,
  },
  disc: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  arc: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: SIZE,
  },
  hole: {
    position: 'absolute',
    left: (SIZE - 80) / 2,
    top: (SIZE - 80) / 2,
    width: 80,
    height: 80,
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
