import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Palette as C } from '@/constants/palette';

const icons = {
  back: require('@/assets/images/progress/chevron-left.svg'),
};

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeading({
  title,
  actionLabel,
  onPress,
}: {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.headingRow}>
      <Text style={styles.headingText}>{title}</Text>
      {actionLabel && onPress ? (
        <Pressable onPress={onPress} hitSlop={10}>
          <Text style={styles.headingAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function BackHeader({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.back} onPress={onPress} hitSlop={10}>
      <Image source={icons.back} style={styles.backIcon} contentFit="contain" />
      <Text style={styles.backLabel}>{label}</Text>
    </Pressable>
  );
}

export function MacroBar({
  label,
  value,
  target,
  unit,
  note,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
  note?: string;
}) {
  const fill = Math.max(0, Math.min(1, value / target));
  return (
    <View style={styles.macro}>
      <View style={styles.macroRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>
          {value} / {target} {unit}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fill * 100}%` }]} />
      </View>
      {note ? <Text style={styles.macroNote}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingText: {
    fontSize: 17,
    fontWeight: '600',
    color: C.text,
  },
  headingAction: {
    fontSize: 12,
    fontWeight: '500',
    color: C.accent,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  backLabel: {
    fontSize: 13,
    color: C.accent,
  },
  macro: {
    gap: 4,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  macroValue: {
    fontSize: 11,
    fontWeight: '600',
    color: C.text,
  },
  track: {
    height: 5,
    borderRadius: 100,
    backgroundColor: C.card,
    overflow: 'hidden',
  },
  fill: {
    height: 5,
    borderRadius: 100,
    backgroundColor: C.accent,
  },
  macroNote: {
    fontSize: 10,
    color: C.textMuted,
  },
});
