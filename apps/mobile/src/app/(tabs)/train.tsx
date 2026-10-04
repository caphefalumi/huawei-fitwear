import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme, softShadow } from '../../theme';
import { useWorkoutStore } from '../../store/workoutStore';
import { useUserStore } from '../../store/userStore';
import { useSettingsStore } from '../../store/settingsStore';
import { GoalType, ExerciseDoc } from '../../types/types';
import {
  PrimaryButton,
  SecondaryButton,
  ProgressRing,
  Chip,
  SkeletonBlock,
  EmptyState,
  ErrorState
} from '../../components/ui';

export default function TrainScreen() {
  const { theme, radii } = useAppTheme();
  const {
    plan,
    exercises,
    generatePlan,
    updatePlan,
    startWorkout
  } = useWorkoutStore();
  const { user } = useUserStore();
  const previewState = useSettingsStore((state) => state.previewState);

  // Tab segment: 'plan' | 'library'
  const [activeSegment, setActiveSegment] = useState<'plan' | 'library'>('plan');

  // Expanded day index in plan
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(0);

  // Cycle Choice Bottom Sheet
  const [showCycleModal, setShowCycleModal] = useState<boolean>(false);
  const [cycleChoice, setCycleChoice] = useState<'continue' | 'new'>('continue');

  // Plan Generator Modal
  const [showGeneratorModal, setShowGeneratorModal] = useState<boolean>(false);
  const [generatorGoal, setGeneratorGoal] = useState<GoalType>(user.goal || 'build_muscle');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Library Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');

  // Swap exercise modal
  const [swappingDayIndex, setSwappingDayIndex] = useState<number | null>(null);
  const [swappingExerciseIndex, setSwappingExerciseIndex] = useState<number | null>(null);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMuscle =
        selectedMuscle === 'All' || ex.muscleGroup.toLowerCase() === selectedMuscle.toLowerCase();

      const matchesDifficulty =
        selectedDifficulty === 'All' || ex.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchesEquipment =
        selectedEquipment === 'All' || ex.equipment.toLowerCase() === selectedEquipment.toLowerCase();

      return matchesSearch && matchesMuscle && matchesDifficulty && matchesEquipment;
    });
  }, [exercises, searchQuery, selectedMuscle, selectedDifficulty, selectedEquipment]);

  // Handle Plan Generation
  const handleRunGenerator = async () => {
    setIsGenerating(true);
    setTimeout(async () => {
      await generatePlan(generatorGoal);
      setIsGenerating(false);
      setShowGeneratorModal(false);
      Alert.alert('Plan Activated', 'Your 6-day split is now synced to your Huawei Watch.');
    }, 1200);
  };

  // Launch Workout
  const handleLaunchWorkout = () => {
    if (!plan) return;
    setShowCycleModal(false);

    if (cycleChoice === 'new') {
      updatePlan({
        currentCycle: (plan.currentCycle || 1) + 1,
        currentDayIndex: 0
      });
      startWorkout(0);
    } else {
      startWorkout(plan.currentDayIndex);
    }

    router.push('/active-workout');
  };

  // Remove exercise from plan day
  const handleRemoveExercise = (dayIdx: number, exIdx: number) => {
    if (!plan) return;

    Alert.alert('Remove Exercise', 'Remove this movement from your routine?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const updatedDays = [...plan.days];
          updatedDays[dayIdx].exercises.splice(exIdx, 1);
          updatePlan({ days: updatedDays });
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        }
      }
    ]);
  };

  // Swap exercise action
  const handleSelectSwapExercise = (chosenEx: ExerciseDoc) => {
    if (swappingDayIndex === null || swappingExerciseIndex === null || !plan) return;

    const updatedDays = [...plan.days];
    const targetDay = updatedDays[swappingDayIndex];

    if (swappingExerciseIndex >= targetDay.exercises.length) {
      targetDay.exercises.push({
        id: `pe_${targetDay.exercises.length}_${chosenEx.id}`,
        exerciseId: chosenEx.id,
        sets: 3,
        repRange: { min: 8, max: 12 },
        restSeconds: 90,
        targetWeightKg: 40
      });
    } else {
      targetDay.exercises[swappingExerciseIndex].exerciseId = chosenEx.id;
    }

    updatePlan({ days: updatedDays });
    setSwappingDayIndex(null);
    setSwappingExerciseIndex(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  // 1. Loading State
  if (previewState === 'loading') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <SkeletonBlock height={40} borderRadius={radii.full} style={{ marginBottom: 16 }} />
          <SkeletonBlock height={180} borderRadius={radii.xl} style={{ marginBottom: 16 }} />
          <SkeletonBlock height={72} borderRadius={radii.lg} style={{ marginBottom: 10 }} />
          <SkeletonBlock height={72} borderRadius={radii.lg} style={{ marginBottom: 10 }} />
          <SkeletonBlock height={72} borderRadius={radii.lg} />
        </View>
      </SafeAreaView>
    );
  }

  // 2. Error State
  if (previewState === 'error') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ErrorState message="Could not sync routine with local workout engine." />
      </SafeAreaView>
    );
  }

  // 3. Empty State
  if (previewState === 'empty') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <EmptyState
          icon="barbell-outline"
          title="No Routine Configured"
          description="Create your first training split to start logging sets with your watch."
          actionLabel="Build Routine"
          onAction={() => setShowGeneratorModal(true)}
        />
      </SafeAreaView>
    );
  }

  const muscleFilters = ['All', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core'];
  const difficultyFilters = ['All', 'beginner', 'intermediate', 'advanced'];
  const equipmentFilters = ['All', 'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Segmented Switcher Header */}
      <View style={styles.header}>
        <View style={[styles.segmentedTrack, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderRadius: radii.full }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setActiveSegment('plan');
            }}
            style={({ pressed }) => [
              styles.segmentTab,
              {
                backgroundColor: activeSegment === 'plan' ? theme.primary : 'transparent',
                borderRadius: radii.full,
                opacity: pressed ? 0.85 : 1
              }
            ]}
          >
            <Ionicons
              name="calendar"
              size={16}
              color={activeSegment === 'plan' ? theme.onPrimary : theme.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.segmentTabText,
                { color: activeSegment === 'plan' ? theme.onPrimary : theme.textSecondary }
              ]}
            >
              Workout Plan
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setActiveSegment('library');
            }}
            style={({ pressed }) => [
              styles.segmentTab,
              {
                backgroundColor: activeSegment === 'library' ? theme.primary : 'transparent',
                borderRadius: radii.full,
                opacity: pressed ? 0.85 : 1
              }
            ]}
          >
            <Ionicons
              name="book"
              size={16}
              color={activeSegment === 'library' ? theme.onPrimary : theme.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.segmentTabText,
                { color: activeSegment === 'library' ? theme.onPrimary : theme.textSecondary }
              ]}
            >
              Exercise Library
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ================= 1. PLAN SEGMENT ================= */}
      {activeSegment === 'plan' ? (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 104 }]} showsVerticalScrollIndicator={false}>
          {plan ? (
            <>
              {/* Cycle & Next Day Status Card */}
              <View
                style={[
                  styles.cycleCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: radii.xl,
                    ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                  }
                ]}
              >
                <View style={styles.cycleTopRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.cycleTitleRow}>
                      <Text style={[styles.cycleTitle, { color: theme.text }]}>
                        Cycle {plan.currentCycle}
                      </Text>
                      <View style={[styles.syncPill, { backgroundColor: theme.surfaceElevated, borderRadius: radii.full }]}>
                        <Ionicons name="watch" size={13} color={theme.primary} />
                        <Text style={[styles.syncPillText, { color: theme.primary }]}>Watch Synced</Text>
                      </View>
                    </View>
                    <Text style={[styles.nextDayLabel, { color: theme.textSecondary }]}>
                      Next: Day {plan.days[plan.currentDayIndex]?.dayNumber} •{' '}
                      {plan.days[plan.currentDayIndex]?.muscleGroup}
                    </Text>
                  </View>

                  <View style={styles.cycleRingBox}>
                    <ProgressRing
                      size={74}
                      strokeWidth={6}
                      progress={(plan.currentDayIndex + 1) / Math.max(plan.days.length, 1)}
                      color={theme.protein}
                      primaryValue={`${plan.currentDayIndex + 1}/${plan.days.length}`}
                      primaryLabel="Day"
                      icon={{ name: 'dumbbell', color: theme.ringIcon.workout }}
                      isWorkoutRing={true}
                      accessibilityLabel={`Cycle progress: Day ${plan.currentDayIndex + 1} of ${plan.days.length}`}
                    />
                  </View>
                </View>

                {/* Banner explanation */}
                <View style={[styles.ruleBanner, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
                  <Ionicons name="information-circle" size={18} color={theme.primary} style={{ marginRight: 8 }} />
                  <Text style={[styles.ruleBannerText, { color: theme.textSecondary }]}>
                    Automated progressive overload. Edit sets, reps, or swap movements anytime.
                  </Text>
                </View>

                {/* Start Workout Primary CTA */}
                <PrimaryButton
                  label={`Start Day ${plan.days[plan.currentDayIndex]?.dayNumber}: ${plan.days[plan.currentDayIndex]?.muscleGroup}`}
                  icon="play"
                  size="large"
                  onPress={() => setShowCycleModal(true)}
                  style={{ marginTop: 8 }}
                />
              </View>

              {/* 6 Day Cards */}
              <View style={styles.daysListHeader}>
                <Text style={[styles.sectionHeading, { color: theme.text }]}>6-Day Routine</Text>
                <Pressable onPress={() => setShowGeneratorModal(true)}>
                  <Text style={[styles.regenerateText, { color: theme.primary }]}>Re-generate</Text>
                </Pressable>
              </View>

              {plan.days.map((day, dIdx) => {
                const isCurrent = dIdx === plan.currentDayIndex;
                const isExpanded = expandedDayIndex === dIdx;

                return (
                  <View
                    key={day.id}
                    style={[
                      styles.dayCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: isCurrent ? theme.primary : theme.border,
                        borderRadius: radii.lg,
                        ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                      }
                    ]}
                  >
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        setExpandedDayIndex(isExpanded ? null : dIdx);
                      }}
                      style={styles.dayCardHeader}
                    >
                      <View style={styles.dayTitleGroup}>
                        <View
                          style={[
                            styles.dayNumberBadge,
                            {
                              backgroundColor: isCurrent ? theme.primary : theme.surfaceElevated,
                              borderRadius: radii.md
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayNumberText,
                              { color: isCurrent ? theme.onPrimary : theme.text }
                            ]}
                          >
                            D{day.dayNumber}
                          </Text>
                        </View>
                        <View>
                          <Text style={[styles.dayMuscle, { color: theme.text }]}>
                            {day.muscleGroup}
                          </Text>
                          <Text style={[styles.dayMeta, { color: theme.textSecondary }]}>
                            {day.estimatedDurationMin} min • {day.exercises.length} Movements
                          </Text>
                        </View>
                      </View>

                      <View style={styles.dayActionGroup}>
                        {isCurrent ? (
                          <View style={[styles.todayBadge, { backgroundColor: theme.primaryGlow, borderRadius: radii.full }]}>
                            <Text style={[styles.todayBadgeText, { color: theme.primary }]}>Today</Text>
                          </View>
                        ) : null}
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color={theme.textSecondary}
                        />
                      </View>
                    </Pressable>

                    {/* Expanded Day Details */}
                    {isExpanded ? (
                      <View style={[styles.dayExpandedContent, { borderTopColor: theme.borderSubtle }]}>
                        {day.exercises.map((pe, eIdx) => {
                          const doc = exercises.find((e) => e.id === pe.exerciseId);
                          return (
                            <View key={pe.id} style={styles.planExerciseRow}>
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.planExName, { color: theme.text }]}>
                                  {doc?.name || pe.exerciseId}
                                </Text>
                                <Text style={[styles.planExSpecs, { color: theme.textSecondary }]}>
                                  {pe.sets} sets × {pe.repRange.min}-{pe.repRange.max} reps • {pe.restSeconds}s rest • {pe.targetWeightKg}kg
                                </Text>
                              </View>

                              <View style={styles.planExActions}>
                                <Pressable
                                  onPress={() => {
                                    setSwappingDayIndex(dIdx);
                                    setSwappingExerciseIndex(eIdx);
                                  }}
                                  style={[styles.smallActionBtn, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}
                                >
                                  <Ionicons name="swap-horizontal" size={16} color={theme.primary} />
                                </Pressable>
                                <Pressable
                                  onPress={() => handleRemoveExercise(dIdx, eIdx)}
                                  style={[styles.smallActionBtn, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}
                                >
                                  <Ionicons name="trash-outline" size={16} color={theme.overTarget} />
                                </Pressable>
                              </View>
                            </View>
                          );
                        })}

                        <SecondaryButton
                          label="Add Movement"
                          icon="add"
                          onPress={() => {
                            setSwappingDayIndex(dIdx);
                            setSwappingExerciseIndex(day.exercises.length);
                          }}
                          style={{ marginTop: 8 }}
                        />
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </>
          ) : (
            <EmptyState
              icon="barbell-outline"
              title="No Plan Configured"
              description="Generate your 6-day beginner foundation split."
              actionLabel="Generate Plan"
              onAction={() => setShowGeneratorModal(true)}
            />
          )}
        </ScrollView>
      ) : (
        /* ================= 2. EXERCISE LIBRARY SEGMENT ================= */
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 104 }]} showsVerticalScrollIndicator={false}>
          {/* Search Box */}
          <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }]}>
            <Ionicons name="search" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search 50+ movements..."
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text }]}
            />
            {searchQuery.length > 0 ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
              </Pressable>
            ) : null}
          </View>

          {/* Muscle Category Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipRow}>
            {muscleFilters.map((m) => (
              <Chip
                key={m}
                label={m.toUpperCase()}
                selected={selectedMuscle.toLowerCase() === m.toLowerCase()}
                onPress={() => setSelectedMuscle(m)}
              />
            ))}
          </ScrollView>

          {/* Difficulty Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipRow}>
            {difficultyFilters.map((d) => (
              <Chip
                key={d}
                label={d.toUpperCase()}
                selected={selectedDifficulty.toLowerCase() === d.toLowerCase()}
                onPress={() => setSelectedDifficulty(d)}
              />
            ))}
          </ScrollView>

          {/* Equipment Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipRow}>
            {equipmentFilters.map((eq) => (
              <Chip
                key={eq}
                label={eq.toUpperCase()}
                selected={selectedEquipment.toLowerCase() === eq.toLowerCase()}
                onPress={() => setSelectedEquipment(eq)}
              />
            ))}
          </ScrollView>

          {/* Exercise Items List */}
          <View style={styles.libCountRow}>
            <Text style={[styles.libCountText, { color: theme.textSecondary }]}>
              {filteredExercises.length} Movements Found
            </Text>
          </View>

          {filteredExercises.map((ex) => (
            <Pressable
              key={ex.id}
              onPress={() => router.push(`/exercise-detail?id=${ex.id}`)}
              style={({ pressed }) => [
                styles.libCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  borderRadius: radii.lg,
                  opacity: pressed ? 0.8 : 1,
                  ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                }
              ]}
            >
              <View style={[styles.libIconBox, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
                <Ionicons name="barbell" size={20} color={theme.primary} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.libExName, { color: theme.text }]}>{ex.name}</Text>
                <Text style={[styles.libExMeta, { color: theme.textSecondary }]}>
                  {ex.muscleGroup.toUpperCase()} • {ex.equipment.toUpperCase()} • {ex.difficulty.toUpperCase()}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* ================= CYCLE CONTROL BOTTOM SHEET MODAL ================= */}
      <Modal
        visible={showCycleModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCycleModal(false)}
      >
        <View style={[styles.modalBackdrop, { backgroundColor: theme.scrim }]}>
          <View style={[styles.bottomSheet, { backgroundColor: theme.card, borderColor: theme.border, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl }]}>
            <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Cycle Progression Controls</Text>
            <Text style={[styles.sheetDesc, { color: theme.textSecondary }]}>
              Current cycle: Cycle {plan?.currentCycle || 1} • Next: Day {plan?.days[plan?.currentDayIndex || 0]?.dayNumber}
            </Text>

            {/* Option A: Continue Old Cycle */}
            <Pressable
              onPress={() => setCycleChoice('continue')}
              style={[
                styles.choiceCard,
                {
                  backgroundColor: cycleChoice === 'continue' ? theme.surfaceElevated : theme.surfaceSubtle,
                  borderColor: cycleChoice === 'continue' ? theme.primary : theme.border,
                  borderRadius: radii.lg
                }
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.choiceTitle, { color: theme.text }]}>Continue Current Cycle</Text>
                <Text style={[styles.choiceSub, { color: theme.textSecondary }]}>
                  Resume at Day {plan?.days[plan?.currentDayIndex || 0]?.dayNumber} ({plan?.days[plan?.currentDayIndex || 0]?.muscleGroup})
                </Text>
              </View>
              {cycleChoice === 'continue' ? (
                <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
              ) : null}
            </Pressable>

            {/* Option B: Start New Cycle */}
            <Pressable
              onPress={() => setCycleChoice('new')}
              style={[
                styles.choiceCard,
                {
                  backgroundColor: cycleChoice === 'new' ? theme.surfaceElevated : theme.surfaceSubtle,
                  borderColor: cycleChoice === 'new' ? theme.primary : theme.border,
                  borderRadius: radii.lg
                }
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.choiceTitle, { color: theme.text }]}>Start New Cycle (Cycle {(plan?.currentCycle || 1) + 1})</Text>
                <Text style={[styles.choiceSub, { color: theme.textSecondary }]}>
                  Restart from Day 1 and increment cycle counter
                </Text>
              </View>
              {cycleChoice === 'new' ? (
                <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
              ) : null}
            </Pressable>

            <PrimaryButton
              label="Launch Workout"
              icon="flash"
              size="large"
              onPress={handleLaunchWorkout}
              style={{ marginTop: 16 }}
            />
            <SecondaryButton
              label="Cancel"
              onPress={() => setShowCycleModal(false)}
            />
          </View>
        </View>
      </Modal>

      {/* ================= PLAN GENERATOR MODAL ================= */}
      <Modal
        visible={showGeneratorModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGeneratorModal(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>AI Routine Generator</Text>
            <Pressable onPress={() => setShowGeneratorModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={[styles.generatorIntro, { color: theme.textSecondary }]}>
              Generates a calibrated 6-day split based on your profile telemetry:
            </Text>

            <View style={[styles.profilePrefillCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderRadius: radii.lg }]}>
              <Text style={[styles.prefillItem, { color: theme.text }]}>Height: {user.heightCm} cm</Text>
              <Text style={[styles.prefillItem, { color: theme.text }]}>Weight: {user.weightKg} kg</Text>
              <Text style={[styles.prefillItem, { color: theme.text }]}>Activity: {user.activityLevel?.toUpperCase() || 'MODERATE'}</Text>
            </View>

            <Text style={[styles.selectGoalHeader, { color: theme.text }]}>Select Primary Objective:</Text>

            <View style={styles.goalChoiceList}>
              {[
                { key: 'build_muscle' as GoalType, label: 'Hypertrophy & Muscle Growth', icon: 'barbell' },
                { key: 'lose_fat' as GoalType, label: 'Caloric Deficit & Conditioning', icon: 'flame' },
                { key: 'maintain' as GoalType, label: 'Strength & Biomarker Maintenance', icon: 'shield-checkmark' }
              ].map((g) => {
                const isSelected = generatorGoal === g.key;
                return (
                  <Pressable
                    key={g.key}
                    onPress={() => setGeneratorGoal(g.key)}
                    style={[
                      styles.goalChoiceCard,
                      {
                        backgroundColor: isSelected ? theme.surfaceElevated : theme.card,
                        borderColor: isSelected ? theme.primary : theme.border,
                        borderRadius: radii.lg
                      }
                    ]}
                  >
                    <Ionicons
                      name={g.icon as any}
                      size={20}
                      color={isSelected ? theme.primary : theme.textSecondary}
                      style={{ marginRight: 12 }}
                    />
                    <Text style={[styles.goalChoiceText, { color: isSelected ? theme.primary : theme.text }]}>
                      {g.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <PrimaryButton
              label={isGenerating ? 'Synthesizing Movements...' : 'Generate 6-Day Split'}
              icon="sparkles"
              size="large"
              onPress={handleRunGenerator}
              disabled={isGenerating}
              style={{ marginTop: 24 }}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= SWAP EXERCISE MODAL ================= */}
      <Modal
        visible={swappingDayIndex !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setSwappingDayIndex(null);
          setSwappingExerciseIndex(null);
        }}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Swap Movement</Text>
            <Pressable
              onPress={() => {
                setSwappingDayIndex(null);
                setSwappingExerciseIndex(null);
              }}
            >
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {exercises.map((ex) => (
              <Pressable
                key={ex.id}
                onPress={() => handleSelectSwapExercise(ex)}
                style={[styles.libCard, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }]}
              >
                <View style={[styles.libIconBox, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
                  <Ionicons name="barbell" size={20} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.libExName, { color: theme.text }]}>{ex.name}</Text>
                  <Text style={[styles.libExMeta, { color: theme.textSecondary }]}>
                    {ex.muscleGroup.toUpperCase()} • {ex.equipment.toUpperCase()}
                  </Text>
                </View>
                <Ionicons name="add-circle" size={22} color={theme.primary} />
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  segmentedTrack: {
    flexDirection: 'row',
    padding: 4,
    borderWidth: 1
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  segmentTabText: {
    fontSize: 13,
    fontWeight: '700'
  },
  content: {
    padding: 16
  },
  cycleCard: {
    borderWidth: 1,
    padding: 18,
    marginBottom: 16
  },
  cycleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  cycleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2
  },
  cycleRingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  },
  cycleTitle: {
    fontSize: 22,
    fontWeight: '800'
  },
  nextDayLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  syncPillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  ruleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12
  },
  ruleBannerText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1
  },
  daysListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    marginHorizontal: 4
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800'
  },
  regenerateText: {
    fontSize: 13,
    fontWeight: '700'
  },
  dayCard: {
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden'
  },
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  dayTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  dayNumberBadge: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayNumberText: {
    fontSize: 13,
    fontWeight: '800'
  },
  dayMuscle: {
    fontSize: 16,
    fontWeight: '700'
  },
  dayMeta: {
    fontSize: 12,
    marginTop: 2
  },
  dayActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  todayBadgeText: {
    fontSize: 11,
    fontWeight: '800'
  },
  dayExpandedContent: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
    paddingTop: 12
  },
  planExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.15)'
  },
  planExName: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  planExSpecs: {
    fontSize: 12,
    marginTop: 2
  },
  planExActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12
  },
  smallActionBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%'
  },
  filterChipRow: {
    gap: 8,
    marginBottom: 10
  },
  libCountRow: {
    marginVertical: 10,
    marginHorizontal: 4
  },
  libCountText: {
    fontSize: 12,
    fontWeight: '600'
  },
  libCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 12
  },
  libIconBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  libExName: {
    fontSize: 15,
    fontWeight: '700'
  },
  libExMeta: {
    fontSize: 12,
    marginTop: 2
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  bottomSheet: {
    borderTopWidth: 1,
    padding: 20,
    paddingBottom: 36
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800'
  },
  sheetDesc: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 10
  },
  choiceTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  choiceSub: {
    fontSize: 12,
    marginTop: 2
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  generatorIntro: {
    fontSize: 14,
    marginBottom: 12
  },
  profilePrefillCard: {
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
    gap: 4
  },
  prefillItem: {
    fontSize: 13,
    fontWeight: '600'
  },
  selectGoalHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12
  },
  goalChoiceList: {
    gap: 10
  },
  goalChoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 16
  },
  goalChoiceText: {
    fontSize: 14,
    fontWeight: '700'
  }
});
