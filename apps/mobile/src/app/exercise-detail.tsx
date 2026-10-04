import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, softShadow } from '../theme';
import { useWorkoutStore } from '../store/workoutStore';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import { ExerciseDoc } from '../types/types';

let planExerciseCounter = 1000;
function createPlanExId(): string {
  planExerciseCounter += 1;
  return `pe_${planExerciseCounter}`;
}

export default function ExerciseDetailScreen() {
  const { theme, radii } = useAppTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { exercises, plan, updatePlan } = useWorkoutStore();

  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);
  const activeExerciseId = userSelectedId || id || exercises[0]?.id || 'ex_barbell_bent_over_row';

  const activeExercise =
    exercises.find((e) => e.id === activeExerciseId) || exercises[0];

  const muscleList = [
    { key: 'all', label: 'All', color: theme.primary },
    { key: 'chest', label: 'Chest', color: '#C2410C' },
    { key: 'back', label: 'Back', color: '#0F766E' },
    { key: 'shoulders', label: 'Shoulders', color: '#B45309' },
    { key: 'legs', label: 'Legs', color: '#4338CA' },
    { key: 'arms', label: 'Arms', color: '#BE185D' },
    { key: 'abs', label: 'Abs', color: '#4D7C0F' }
  ];

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMuscle =
        selectedMuscle === 'all' ||
        ex.muscleGroup.toLowerCase() === selectedMuscle.toLowerCase();

      return matchesSearch && matchesMuscle;
    });
  }, [exercises, searchQuery, selectedMuscle]);

  const handleAddToPlan = (targetEx: ExerciseDoc) => {
    if (!plan) {
      Alert.alert('No Plan', 'Please generate or activate a plan first.');
      return;
    }

    const matchingDayIndex = plan.days.findIndex(
      (d) => d.muscleGroup.toLowerCase() === targetEx.muscleGroup.toLowerCase()
    );

    const targetDayIndex = matchingDayIndex !== -1 ? matchingDayIndex : plan.currentDayIndex;
    const targetDay = plan.days[targetDayIndex];

    const newPlanExercise = {
      id: createPlanExId(),
      exerciseId: targetEx.id,
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
    Alert.alert('Added to Plan', `"${targetEx.name}" added to Day ${targetDay.dayNumber} (${targetDay.muscleGroup}).`);
  };

  // Derive muscle color
  const getMuscleColor = (group: string) => {
    const g = group.toLowerCase();
    if (g.includes('chest')) return '#C2410C';
    if (g.includes('back')) return '#0F766E';
    if (g.includes('leg')) return '#4338CA';
    if (g.includes('shoulder')) return '#B45309';
    if (g.includes('arm')) return '#BE185D';
    if (g.includes('abs') || g.includes('core')) return '#4D7C0F';
    return theme.primary;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.topBar, { borderBottomColor: theme.borderSubtle }]}>
        <View style={styles.topBarLeft}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            style={[styles.backCircleBtn, { backgroundColor: theme.surfaceElevated }]}
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </Pressable>
          <View style={[styles.brandIconMini, { backgroundColor: theme.primaryContainer }]}>
            <Ionicons name="fitness" size={16} color={theme.primary} />
          </View>
          <Text style={[styles.topBarTitle, { color: theme.text }]}>Action Guidance & Form</Text>
        </View>

        <View style={[styles.offlineHubBadge, { backgroundColor: theme.primaryContainer }]}>
          <Ionicons name="flash" size={13} color={theme.primary} />
          <Text style={[styles.offlineHubText, { color: theme.primary }]}>120+ Offline</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search 120+ gym exercises or muscle cues..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Filter Chips Horizontal Carousel */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {muscleList.map((m) => {
            const isSelected = selectedMuscle === m.key;
            return (
              <Pressable
                key={m.key}
                onPress={() => setSelectedMuscle(m.key)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? m.color : theme.surfaceElevated,
                    borderColor: isSelected ? m.color : theme.border
                  }
                ]}
              >
                {m.key !== 'all' && (
                  <View
                    style={[
                      styles.filterChipDot,
                      { backgroundColor: isSelected ? '#FFFFFF' : m.color }
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.text,
                      fontWeight: isSelected ? '700' : '500'
                    }
                  ]}
                >
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* FEATURED FORM FOCUS CARD */}
        {activeExercise && (
          <View style={styles.featuredSection}>
            <View style={styles.featuredHeaderRow}>
              <View style={styles.featuredTitleGroup}>
                <Ionicons name="star" size={16} color={theme.primary} />
                <Text style={[styles.featuredSectionTitle, { color: theme.text }]}>
                  Featured Form Focus
                </Text>
              </View>
              <View style={[styles.muscleGroupPill, { backgroundColor: `${getMuscleColor(activeExercise.muscleGroup)}18` }]}>
                <Text style={[styles.muscleGroupPillText, { color: getMuscleColor(activeExercise.muscleGroup) }]}>
                  {activeExercise.muscleGroup} Chain
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.featuredCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  borderRadius: radii.lg,
                  ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                }
              ]}
            >
              {/* Kinematic Tutorial Video / Viewport */}
              <View style={[styles.videoViewport, { backgroundColor: theme.surfaceElevated }]}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
                  }}
                  style={styles.videoPoster}
                  resizeMode="cover"
                />
                <View style={styles.videoOverlayGradient} />

                <View style={styles.videoBottomInfo}>
                  <View>
                    <Text style={styles.videoSubBadge}>Kinematic Tutorial • 45s Loop</Text>
                    <Text style={styles.videoMainTitle}>{activeExercise.name}</Text>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Play Form Demo"
                    onPress={() => setIsPlaying(!isPlaying)}
                    style={({ pressed }) => [
                      styles.playBtnCircle,
                      { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 }
                    ]}
                  >
                    <Ionicons
                      name={isPlaying ? 'pause' : 'play'}
                      size={22}
                      color={theme.onPrimary}
                      style={{ marginLeft: isPlaying ? 0 : 2 }}
                    />
                  </Pressable>
                </View>

                {/* Offline Ready Tag */}
                <View style={[styles.offlineReadyTag, { backgroundColor: 'rgba(255, 255, 255, 0.92)' }]}>
                  <Ionicons name="checkmark-circle" size={13} color={theme.onTrack} />
                  <Text style={styles.offlineReadyText}>Offline Ready</Text>
                </View>
              </View>

              {/* Core Kinetic Cue Box (Stitch Blue/Info) */}
              <View style={[styles.kineticCueBox, { backgroundColor: `${theme.info}15` }]}>
                <Text style={{ fontSize: 18, marginRight: 6 }}>🔑</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.kineticCueHeader, { color: theme.info }]}>CORE KINETIC CUE</Text>
                  <Text style={[styles.kineticCueBody, { color: theme.text }]}>
                    {activeExercise.formCues[0] ||
                      'Hinge hips backwards first, keep shins vertical and bar skimming along your thighs.'}
                  </Text>
                </View>
              </View>

              {/* Key Execution Steps */}
              <View style={styles.executionStepsBlock}>
                <Text style={[styles.executionStepsTitle, { color: theme.textSecondary }]}>
                  KEY EXECUTION STEPS
                </Text>

                {activeExercise.formCues.map((cue, idx) => (
                  <View key={idx} style={styles.stepItemRow}>
                    <View style={[styles.stepNumCircle, { backgroundColor: theme.primaryContainer }]}>
                      <Text style={[styles.stepNumText, { color: theme.primary }]}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.stepTitle, { color: theme.text }]}>
                        {cue}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Common Mistake Box */}
              {activeExercise.commonMistakes && activeExercise.commonMistakes.length > 0 && (
                <View style={[styles.mistakeBox, { backgroundColor: `${theme.error}14` }]}>
                  <Text style={{ fontSize: 18, marginRight: 6 }}>⚠️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.mistakeHeader, { color: theme.error }]}>COMMON MISTAKE</Text>
                    <Text style={[styles.mistakeBody, { color: theme.text }]}>
                      {activeExercise.commonMistakes[0]}
                    </Text>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtonsRow}>
                <PrimaryButton
                  label="Add to Routine"
                  icon="add-circle"
                  onPress={() => handleAddToPlan(activeExercise)}
                  style={{ flex: 1.2 }}
                />
                <SecondaryButton
                  label="Practice"
                  icon="barbell-outline"
                  onPress={() => router.push('/active-workout')}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        )}

        {/* EXERCISE LIBRARY 2-COLUMN GRID (Stitch layout) */}
        <View style={styles.libraryGridSection}>
          <View style={styles.libraryGridHeader}>
            <View style={styles.libraryGridTitleGroup}>
              <Ionicons name="grid-outline" size={17} color={theme.textSecondary} />
              <Text style={[styles.libraryGridTitle, { color: theme.text }]}>Exercise Library</Text>
            </View>
            <Text style={[styles.libraryGridCount, { color: theme.textSecondary }]}>
              Showing {filteredExercises.length} of {exercises.length}
            </Text>
          </View>

          <View style={styles.exerciseTwoColGrid}>
            {filteredExercises.map((ex) => {
              const mColor = getMuscleColor(ex.muscleGroup);
              const isCurrent = ex.id === activeExercise?.id;

              return (
                <Pressable
                  key={ex.id}
                  onPress={() => setUserSelectedId(ex.id)}
                  style={({ pressed }) => [
                    styles.gridExerciseCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isCurrent ? theme.primary : theme.border,
                      borderWidth: isCurrent ? 2 : 1,
                      borderRadius: radii.md,
                      opacity: pressed ? 0.88 : 1,
                      ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                    }
                  ]}
                >
                  <View style={[styles.cardThumbBox, { backgroundColor: theme.surfaceElevated }]}>
                    <Ionicons name="barbell" size={26} color={mColor} />
                    <View style={[styles.muscleThumbBadge, { backgroundColor: mColor }]}>
                      <Text style={styles.muscleThumbBadgeText}>{ex.muscleGroup}</Text>
                    </View>
                  </View>

                  <View style={styles.cardInfoBox}>
                    <Text style={[styles.cardExerciseName, { color: theme.text }]} numberOfLines={1}>
                      {ex.name}
                    </Text>

                    <View style={styles.cuesCountRow}>
                      <Ionicons name="sparkles-outline" size={12} color={theme.textSecondary} />
                      <Text style={[styles.cuesCountText, { color: theme.textSecondary }]}>
                        {ex.formCues.length} Form Cues
                      </Text>
                    </View>

                    <View style={[styles.focusFooterPill, { backgroundColor: theme.surfaceElevated }]}>
                      <Text style={[styles.focusPillText, { color: mColor }]}>
                        {ex.difficulty.toUpperCase()}
                      </Text>
                      <Ionicons name="arrow-forward" size={13} color={mColor} />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  backCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandIconMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  offlineHubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999
  },
  offlineHubText: {
    fontSize: 11,
    fontWeight: '700'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12
  },
  searchInput: {
    flex: 1,
    fontSize: 14
  },
  filterScroll: {
    gap: 8,
    paddingRight: 16
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
    borderWidth: 1
  },
  filterChipDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5
  },
  filterChipText: {
    fontSize: 12
  },
  featuredSection: {
    gap: 8
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  featuredTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  featuredSectionTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  muscleGroupPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
  },
  muscleGroupPillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  featuredCard: {
    borderWidth: 1,
    padding: 14,
    gap: 12
  },
  videoViewport: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoPoster: {
    width: '100%',
    height: '100%'
  },
  videoOverlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)'
  },
  videoBottomInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  videoSubBadge: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2
  },
  videoMainTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  playBtnCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  offlineReadyTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999
  },
  offlineReadyText: {
    color: '#121E1C',
    fontSize: 10,
    fontWeight: '700'
  },
  kineticCueBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10
  },
  kineticCueHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2
  },
  kineticCueBody: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500'
  },
  executionStepsBlock: {
    gap: 8
  },
  executionStepsTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  stepNumCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '800'
  },
  stepTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500'
  },
  mistakeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10
  },
  mistakeHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2
  },
  mistakeBody: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500'
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  libraryGridSection: {
    gap: 10
  },
  libraryGridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  libraryGridTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  libraryGridTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  libraryGridCount: {
    fontSize: 12
  },
  exerciseTwoColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  gridExerciseCard: {
    width: '48.5%',
    padding: 8,
    overflow: 'hidden'
  },
  cardThumbBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  muscleThumbBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999
  },
  muscleThumbBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  cardInfoBox: {
    paddingTop: 8,
    gap: 4
  },
  cardExerciseName: {
    fontSize: 13,
    fontWeight: '700'
  },
  cuesCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  cuesCountText: {
    fontSize: 11
  },
  focusFooterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 2
  },
  focusPillText: {
    fontSize: 10,
    fontWeight: '700'
  }
});
