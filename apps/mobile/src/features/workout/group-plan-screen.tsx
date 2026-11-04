import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';
import { BackHeader, Card, SectionHeading } from '@/features/home/ui';
import { GROUP_ROUTINES } from '@/features/workout/routines';

export function GroupPlanScreen() {
  const insets = useSafeAreaInsets();
  const { group } = useLocalSearchParams<{ group?: string }>();
  const routine = GROUP_ROUTINES[group ?? ''] ?? GROUP_ROUTINES.chest;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <BackHeader label="Workout plan" onPress={() => router.back()} />

      <View style={styles.heading}>
        <Text style={styles.eyebrow}>{routine.name} plan</Text>
        <Text style={styles.title}>{routine.name}</Text>
        <Text style={styles.subtitle}>
          {routine.exercises.length} exercises · {routine.sets} sets · {routine.minutes} min
        </Text>
      </View>

      <View style={styles.section}>
        <SectionHeading title="Exercises" actionLabel={`${routine.exercises.length} moves`} />
        <Card>
          <View style={styles.exerciseList}>
            {routine.exercises.map((exercise) => (
              <View key={exercise.name} style={styles.exerciseRow}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => router.push('/session')}>
        <Text style={styles.primaryLabel}>Start workout</Text>
      </Pressable>
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
  eyebrow: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textMuted,
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
  section: {
    gap: 8,
  },
  exerciseList: {
    gap: 8,
    paddingTop: 4,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseName: {
    fontSize: 12,
    color: C.text,
  },
  exercisePrescription: {
    fontSize: 12,
    color: C.textMuted,
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
});
