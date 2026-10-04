import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useWorkoutStore } from '../store/workoutStore';
import { PrimaryButton, SecondaryButton } from '../components/ui';

export default function ExerciseDetailScreen() {
  const { theme, radii, spacing } = useAppTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { exercises, plan, updatePlan } = useWorkoutStore();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const exercise =
    exercises.find((e) => e.id === id) || exercises[0];

  const handleAddToPlan = () => {
    if (!plan) {
      Alert.alert('No Plan', 'Please generate or activate a plan first.');
      return;
    }

    // Add to matching muscle group day or current day
    const matchingDayIndex = plan.days.findIndex(
      (d) => d.muscleGroup.toLowerCase() === exercise.muscleGroup.toLowerCase()
    );

    const targetDayIndex = matchingDayIndex !== -1 ? matchingDayIndex : plan.currentDayIndex;
    const targetDay = plan.days[targetDayIndex];

    const newPlanExercise = {
      id: `pe_${Date.now()}`,
      exerciseId: exercise.id,
      sets: 3,
      repRange: { min: 8, max: 12 },
      restSeconds: 90,
      targetWeightKg: 20
    };

    const updatedDays = [...plan.days];
    updatedDays[targetDayIndex] = {
      ...targetDay,
      exercises: [...targetDay.exercises, newPlanExercise]
    };

    updatePlan({ days: updatedDays });
    Alert.alert('Added to Plan', `"${exercise.name}" added to Day ${targetDay.dayNumber} (${targetDay.muscleGroup}).`);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Pressable
          style={[styles.closeBtn, { backgroundColor: theme.surfaceElevated }]}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={22} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Exercise Detail</Text>
        <Pressable
          style={[styles.shareBtn, { backgroundColor: theme.surfaceElevated }]}
          onPress={() => Alert.alert('Share', `Shared ${exercise.name} guidance.`)}
        >
          <Ionicons name="share-outline" size={20} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Video Player Placeholder */}
        <View style={[styles.videoContainer, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <View style={styles.videoOverlay}>
            <Pressable
              onPress={() => setIsPlaying(!isPlaying)}
              style={({ pressed }) => [
                styles.playButtonCircle,
                { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 }
              ]}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color={theme.onPrimary}
                style={{ marginLeft: isPlaying ? 0 : 4 }}
              />
            </Pressable>
            <Text style={[styles.videoDurationBadge, { color: theme.onPrimary }]}>
              {isPlaying ? 'Playing High-Res Demo (1080p)' : '0:45 • Form Demonstration'}
            </Text>
          </View>
        </View>

        {/* Title and Badges */}
        <Text style={[styles.title, { color: theme.text }]}>{exercise.name}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.tagPill, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.tagText, { color: theme.primary }]}>
              {exercise.muscleGroup}
            </Text>
          </View>
          <View style={[styles.tagPill, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.tagText, { color: theme.protein }]}>
              {exercise.difficulty.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.tagPill, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Text style={[styles.tagText, { color: theme.textSecondary }]}>
              {exercise.equipment.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {exercise.description}
        </Text>

        {/* "Plays on your watch" Card */}
        <View style={[styles.watchCoachCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <View style={styles.watchIconCircle}>
            <Ionicons name="watch" size={26} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.watchCardTitle, { color: theme.text }]}>Plays on Your Watch</Text>
            <Text style={[styles.watchCardDesc, { color: theme.textSecondary }]}>
              A 3-second looping form illustration plays on your Huawei AMOLED watch during rest periods.
            </Text>
          </View>
          <View style={[styles.watchLiveBadge, { backgroundColor: theme.primaryGlow }]}>
            <View style={[styles.livePulse, { backgroundColor: theme.primary }]} />
            <Text style={[styles.liveText, { color: theme.primary }]}>SYNCED</Text>
          </View>
        </View>

        {/* Form Cues Checklist */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Beginner Form Cues</Text>
          <View style={styles.cuesList}>
            {exercise.formCues.map((cue, index) => (
              <View key={index} style={styles.cueRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.primary}
                  style={styles.cueIcon}
                />
                <Text style={[styles.cueText, { color: theme.text }]}>{cue}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Common Mistakes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Common Mistakes to Avoid</Text>
          <View style={styles.cuesList}>
            {exercise.commonMistakes.map((mistake, index) => (
              <View key={index} style={styles.cueRow}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={theme.overTarget}
                  style={styles.cueIcon}
                />
                <Text style={[styles.cueText, { color: theme.textSecondary }]}>
                  {mistake}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomButtons}>
          <PrimaryButton
            label="Add to Workout Plan"
            icon="add-circle"
            size="large"
            onPress={handleAddToPlan}
          />
          <SecondaryButton
            label="Practice Movement (Live)"
            icon="barbell-outline"
            onPress={() => {
              router.push('/active-workout');
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700'
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  videoContainer: {
    height: 210,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20
  },
  videoOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  videoDurationBadge: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700'
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20
  },
  watchCoachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24
  },
  watchIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  watchCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2
  },
  watchCardDesc: {
    fontSize: 12,
    lineHeight: 16
  },
  watchLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12
  },
  cuesList: {
    gap: 10
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  cueIcon: {
    marginRight: 10,
    marginTop: 1
  },
  cueText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20
  },
  bottomButtons: {
    marginTop: 12,
    gap: 8
  }
});
