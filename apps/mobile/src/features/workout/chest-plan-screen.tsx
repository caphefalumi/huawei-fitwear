import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';
import { useHealth } from '@/features/health/health-store';
import { BackHeader, Card } from '@/features/home/ui';
import { routineForGroup } from '@/features/workout/routines';
import { WorkoutSessionPanel } from '@/features/workout/workout-session-panel';
import { useWorkouts } from '@/features/workout/workout-store';

const icons = { play: require('@/assets/images/workout/play.svg') };

export function ChestPlanScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ group?: string; sessionId?: string }>();
  const { recovery } = useHealth();
  const { exercises, sessions, activeSessionId, loading, error, refresh } = useWorkouts();
  const savedSession = sessions.find((session) => session.id === params.sessionId);
  const group = savedSession?.workoutSplit ?? params.group ?? 'Chest';
  const routine = routineForGroup(group, exercises);
  const sessionExercises = savedSession?.sets?.map((set) => set.exercise) ?? [];
  const availableExercises = [...(routine?.exercises ?? []), ...sessionExercises.filter((exercise, index) =>
    !routine?.exercises.some((entry) => entry.id === exercise.id) && sessionExercises.findIndex((entry) => entry.id === exercise.id) === index)];
  const currentId = params.sessionId ?? sessions.find((session) => session.id === activeSessionId && session.workoutSplit.toLowerCase() === group.toLowerCase())?.id;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom }]}>
      <BackHeader label="Workouts" onPress={() => router.back()} />
      <View style={styles.heading}>
        <Text style={styles.title}>{savedSession?.sessionTitle ?? routine?.name ?? group}</Text>
        <Text style={styles.subtitle}>{params.sessionId ? 'Saved workout' : 'Exercise plan · choose your own working weight'}</Text>
      </View>
      {group.toLowerCase() === 'chest' ? <Image source={require('@/assets/images/workout/chest-hero.png')} style={styles.hero} contentFit="cover" /> : null}
      {loading ? <Text style={styles.subtitle}>Loading workout data…</Text> : null}
      {error ? <Text accessibilityRole="alert" style={styles.footnote}>{error}</Text> : null}
      {!routine && !loading ? <Text style={styles.subtitle}>No exercises are available for this group.</Text> : null}
      <Pressable onPress={() => void refresh()}><Text style={styles.footnote}>Refresh workout data</Text></Pressable>
      {routine ? <View style={styles.summary}>
        {[{ value: routine.exercises.length, label: 'exercises' }, { value: routine.sets, label: 'planned sets' }].map((metric) => (
          <View key={metric.label} style={styles.metric}><Text style={styles.metricValue}>{metric.value}</Text><Text style={styles.metricLabel}>{metric.label}</Text></View>
        ))}
      </View> : null}
      <Text style={styles.sectionTitle}>Exercises</Text>
      {availableExercises.map((exercise, index) => (
        <Card key={exercise.id} style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseIndex}>{String(index + 1).padStart(2, '0')}</Text>
            <Pressable style={styles.exerciseIdentity} onPress={() => router.push({ pathname: '/exercise-guide', params: { name: exercise.id, group, ...(currentId ? { sessionId: currentId } : {}) } })}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </Pressable>
            <Pressable accessibilityLabel={`View ${exercise.name} technique`} style={styles.playButton} onPress={() => router.push({ pathname: '/exercise-guide', params: { name: exercise.id, group, ...(currentId ? { sessionId: currentId } : {}) } })}>
              <Image source={icons.play} style={styles.playIcon} contentFit="contain" />
            </Pressable>
          </View>
          <View style={styles.prescriptionRow}>
            <Text style={styles.prescriptionValue}>{exercise.defaultSets} planned sets · {exercise.defaultReps} target {exercise.repetitionUnit}</Text>
          </View>
          <Text style={styles.loadLabel}>{exercise.equipment} · load is recorded when you log a completed set</Text>
        </Card>
      ))}
      <WorkoutSessionPanel key={params.sessionId ?? group} title={routine?.name ?? group} split={group} exercises={availableExercises} sessionId={params.sessionId} recovery={Boolean(recovery)} />
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
  prescriptionValue: {
    fontSize: 12,
    color: C.text,
  },
  loadLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  footnote: {
    fontSize: 11,
    color: C.textMuted,
  },
});
