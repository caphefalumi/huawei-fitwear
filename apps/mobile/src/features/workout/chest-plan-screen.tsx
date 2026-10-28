import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { useHealth } from '@/features/health/health-store';
import { BackHeader, Card } from '@/features/home/ui';

const icons = {
  play: require('@/assets/images/workout/play.svg'),
  lock: require('@/assets/images/recovery/lock.svg'),
};

type Exercise = {
  key: string;
  name: string;
  sets: number;
  reps: number;
  load: number;
  loadUnit: string;
  step: number;
};

const EXERCISES: Exercise[] = [
  { key: 'bench-press', name: 'Barbell bench press', sets: 3, reps: 10, load: 30, loadUnit: 'kg', step: 2.5 },
  {
    key: 'incline-dumbbell-press',
    name: 'Incline dumbbell press',
    sets: 3,
    reps: 12,
    load: 10,
    loadUnit: 'kg/hand',
    step: 2,
  },
  {
    key: 'cable-chest-fly',
    name: 'Cable chest fly',
    sets: 3,
    reps: 12,
    load: 7.5,
    loadUnit: 'kg/side',
    step: 2.5,
  },
];

const SUMMARY = [
  { value: '3', label: 'exercises' },
  { value: '9', label: 'sets' },
  { value: '35', label: 'min' },
];

export function ChestPlanScreen() {
  const insets = useSafeAreaInsets();
  const { recovery } = useHealth();
  const [loads, setLoads] = useState<Record<string, number>>(() =>
    Object.fromEntries(EXERCISES.map((exercise) => [exercise.key, exercise.load])),
  );

  function adjust(exercise: Exercise, direction: -1 | 1) {
    setLoads((prev) => ({
      ...prev,
      [exercise.key]: Math.max(0, Number(((prev[exercise.key] ?? 0) + direction * exercise.step).toFixed(1))),
    }));
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <BackHeader label="Workouts" onPress={() => router.back()} />

      <View style={styles.heading}>
        <Text style={styles.title}>Chest</Text>
        <Text style={styles.subtitle}>Tentative return · {recovery.returnDate}</Text>
      </View>

      <Image
        source={require('@/assets/images/workout/chest-hero.png')}
        style={styles.hero}
        contentFit="cover"
      />

      <View style={styles.summary}>
        {SUMMARY.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.restriction}>
        <Image source={icons.lock} style={styles.restrictionIcon} contentFit="contain" />
        <Text style={styles.restrictionText}>
          View only during {recovery.area.toLowerCase()} recovery. Overload is disabled.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Exercises</Text>

      {EXERCISES.map((exercise, index) => (
        <Card key={exercise.key} style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseIndex}>{String(index + 1).padStart(2, '0')}</Text>
            <Pressable
              style={styles.exerciseIdentity}
              onPress={() => router.push(`/exercise-guide?name=${exercise.key}`)}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </Pressable>
            <Pressable
              style={styles.playButton}
              onPress={() => router.push(`/exercise-guide?name=${exercise.key}`)}>
              <Image source={icons.play} style={styles.playIcon} contentFit="contain" />
            </Pressable>
          </View>

          <View style={styles.prescriptionRow}>
            <View style={styles.prescription}>
              <Text style={styles.prescriptionValue}>{exercise.sets} sets</Text>
              <Text style={styles.prescriptionLabel}>Sets</Text>
            </View>
            <View style={styles.prescription}>
              <Text style={styles.prescriptionValue}>{exercise.reps} reps</Text>
              <Text style={styles.prescriptionLabel}>Reps</Text>
            </View>
          </View>

          <View style={styles.exerciseFooter}>
            <View style={styles.loadGroup}>
              <Text style={styles.loadLabel}>Saved load</Text>
              <View style={styles.loadInput}>
                <Text style={styles.loadValue}>{loads[exercise.key]}</Text>
                <Text style={styles.loadUnit}>{exercise.loadUnit}</Text>
              </View>
              <View style={styles.stepper}>
                <Pressable style={styles.stepButton} onPress={() => adjust(exercise, -1)}>
                  <View style={styles.minus} />
                </Pressable>
                <Pressable style={styles.stepButton} onPress={() => adjust(exercise, 1)}>
                  <View style={styles.minus} />
                  <View style={styles.plus} />
                </Pressable>
              </View>
            </View>
            <View style={styles.watchGroup}>
              <Image source={icons.play} style={styles.watchIcon} contentFit="contain" />
              <Text style={styles.watchLabel}>Watch</Text>
            </View>
          </View>
        </Card>
      ))}

      <Pressable style={styles.disabledAction}>
        <Text style={styles.disabledActionLabel}>Start workout</Text>
      </Pressable>
      <Text style={styles.footnote}>Resume your regular plan when you’re ready.</Text>
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
    gap: 14,
  },
  heading: {
    gap: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: C.text,
  },
  subtitle: {
    fontSize: 13,
    color: C.textMuted,
  },
  hero: {
    width: '100%',
    aspectRatio: 354 / 165,
    borderRadius: 18,
    backgroundColor: C.card,
  },
  summary: {
    flexDirection: 'row',
    gap: 10,
  },
  metric: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
  },
  metricValue: {
    fontSize: 25,
    fontWeight: '400',
    color: C.text,
  },
  metricLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  restriction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  restrictionIcon: {
    width: 16,
    height: 16,
  },
  restrictionText: {
    flex: 1,
    fontSize: 11,
    color: C.textMuted,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: C.text,
    paddingTop: 4,
  },
  exerciseCard: {
    padding: 14,
    gap: 10,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exerciseIndex: {
    fontSize: 12,
    color: C.textMuted,
  },
  exerciseIdentity: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: C.accentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    width: 14,
    height: 14,
  },
  prescriptionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  prescription: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  prescriptionValue: {
    fontSize: 12,
    color: C.text,
  },
  prescriptionLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
  exerciseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  loadGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  loadInput: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    backgroundColor: C.previewTint,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  loadValue: {
    fontSize: 10,
    fontWeight: '600',
    color: C.text,
  },
  loadUnit: {
    fontSize: 10,
    color: C.textMuted,
  },
  stepper: {
    flexDirection: 'row',
    gap: 4,
  },
  stepButton: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: C.previewTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minus: {
    width: 8,
    height: 1,
    backgroundColor: C.textMuted,
  },
  plus: {
    position: 'absolute',
    width: 1,
    height: 8,
    backgroundColor: C.textMuted,
  },
  watchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  watchIcon: {
    width: 14,
    height: 14,
  },
  watchLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  disabledAction: {
    height: 52,
    borderRadius: 16,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textMuted,
  },
  footnote: {
    fontSize: 11,
    color: C.textMuted,
  },
});
