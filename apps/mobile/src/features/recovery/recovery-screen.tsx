import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { BackHeader, Card } from '@/features/home/ui';

const GROUPS = [
  { key: 'chest', label: 'Chest', icon: require('@/assets/images/recovery/body-chest.svg') },
  { key: 'back', label: 'Back', icon: require('@/assets/images/recovery/body-back.svg') },
  {
    key: 'shoulders',
    label: 'Shoulders',
    icon: require('@/assets/images/recovery/body-shoulders.svg'),
  },
  { key: 'arms', label: 'Arms', icon: require('@/assets/images/recovery/body-arms.svg') },
  { key: 'legs', label: 'Legs', icon: require('@/assets/images/recovery/body-legs.svg') },
  { key: 'core', label: 'Core', icon: require('@/assets/images/recovery/body-core.svg') },
];

const icons = {
  circleX: require('@/assets/images/recovery/circle-x.svg'),
  switchDisabled: require('@/assets/images/recovery/switch-disabled.svg'),
  lock: require('@/assets/images/recovery/lock.svg'),
};

const DETAIL_ROWS = [
  { label: 'Starts', value: 'Oct 8, 2026' },
  { label: 'Rest days', value: '2 days · Oct 8–9' },
  { label: 'Light days', value: '3 days · Oct 10–12' },
  { label: 'Back to normal', value: 'Oct 13' },
];

export function RecoveryScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('shoulders');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <BackHeader label="Profile" onPress={() => router.back()} />

      <Text style={styles.title}>Recovery plan</Text>

      <Card>
        <Text style={styles.cardTitle}>Area to watch</Text>

        <View style={styles.grid}>
          {GROUPS.map((group) => {
            const active = group.key === selected;
            return (
              <Pressable
                key={group.key}
                style={[styles.tile, active && styles.tileActive]}
                onPress={() => setSelected(group.key)}>
                <View style={styles.preview}>
                  <Image source={group.icon} style={styles.previewImage} contentFit="contain" />
                </View>
                <Text style={styles.tileLabel}>{group.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <View style={styles.detailHeader}>
          <View style={styles.detailText}>
            <Text style={styles.cardTitle}>Right shoulder</Text>
            <Text style={styles.cardNote}>Sore when pressing</Text>
          </View>
          <Image source={icons.circleX} style={styles.detailIcon} contentFit="contain" />
        </View>

        {DETAIL_ROWS.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}

        <View style={styles.row}>
          <View style={styles.rowLabelGroup}>
            <Text style={styles.rowLabel}>Overload trigger</Text>
            <Text style={styles.cardNote}>Disabled during recovery</Text>
          </View>
          <View style={styles.switchGroup}>
            <Image source={icons.lock} style={styles.switchIcon} contentFit="contain" />
            <Image source={icons.switchDisabled} style={styles.switchTrack} contentFit="contain" />
          </View>
        </View>
      </Card>

      <Pressable style={styles.primaryButton} onPress={() => router.back()}>
        <Text style={styles.primaryLabel}>Save recovery plan</Text>
      </Pressable>

      <Text style={styles.disclaimer}>
        If pain persists or worsens, seek medical advice.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: C.text,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: C.text,
  },
  cardNote: {
    fontSize: 11,
    color: C.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    width: '31%',
    height: 64,
    padding: 8,
    gap: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  tileActive: {
    backgroundColor: C.accentTint,
    borderColor: C.accent,
  },
  preview: {
    height: 28,
    borderRadius: 12,
    backgroundColor: C.previewTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    height: 28,
    width: 15,
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailText: {
    gap: 2,
  },
  detailIcon: {
    width: 18,
    height: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  rowLabel: {
    fontSize: 13,
    color: C.textMuted,
  },
  rowLabelGroup: {
    gap: 2,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchIcon: {
    width: 14,
    height: 14,
  },
  switchTrack: {
    width: 40,
    height: 24,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: C.onAccent,
  },
  disclaimer: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'center',
  },
});
