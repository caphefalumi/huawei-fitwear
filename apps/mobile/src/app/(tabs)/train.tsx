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
import { GoalType } from '../../types/types';
import {
  PrimaryButton,
  Chip,
  SkeletonBlock,
  EmptyState,
  ErrorState,
  BrandLogo
} from '../../components/ui';
import {
  usePlanQuery,
  useGeneratePlanMutation,
  useUpdatePlanMutation,
  useExercisesQuery
} from '@/hooks/use-queries';

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

  const { data: qPlan } = usePlanQuery();
  const { data: qExercises } = useExercisesQuery();
  const generatePlanMutation = useGeneratePlanMutation();
  const updatePlanMutation = useUpdatePlanMutation();

  const activePlan = qPlan !== undefined ? qPlan : plan;
  const activeExercises = qExercises || exercises;

  const [activeSegment, setActiveSegment] = useState<'plan' | 'library'>('plan');
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(0);
  const [showCycleModal, setShowCycleModal] = useState<boolean>(false);
  const [cycleChoice, setCycleChoice] = useState<'continue' | 'new'>('continue');
  const [showGeneratorModal, setShowGeneratorModal] = useState<boolean>(false);
  const [generatorGoal, setGeneratorGoal] = useState<GoalType>(user?.goal || 'build_muscle');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [watchSynced, setWatchSynced] = useState<boolean>(false);
  const [syncingWatch, setSyncingWatch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');

  const filteredExercises = useMemo(() => {
    return activeExercises.filter((ex) => {
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMuscle =
        selectedMuscle === 'All' || ex.muscleGroup.toLowerCase() === selectedMuscle.toLowerCase();

      return matchesSearch && matchesMuscle;
    });
  }, [activeExercises, searchQuery, selectedMuscle]);

  const handleRunGenerator = async () => {
    setIsGenerating(true);
    try {
      await generatePlanMutation.mutateAsync(generatorGoal);
      await generatePlan(generatorGoal);
      setIsGenerating(false);
      setShowGeneratorModal(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Alert.alert('Plan Activated', 'Your 6-day split is now synced to your Huawei Watch.');
    } catch {
      setIsGenerating(false);
    }
  };

  const handleLaunchWorkout = () => {
    if (!activePlan) return;
    setShowCycleModal(false);

    if (cycleChoice === 'new') {
      updatePlanMutation.mutate({
        currentCycle: (activePlan.currentCycle || 1) + 1,
        currentDayIndex: 0
      });
      updatePlan({
        currentCycle: (activePlan.currentCycle || 1) + 1,
        currentDayIndex: 0
      });
      startWorkout(0);
    } else {
      startWorkout(activePlan.currentDayIndex);
    }

    router.push('/active-workout');
  };

  // Sync to watch action
  const handleSyncToWatch = () => {
    setSyncingWatch(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setTimeout(() => {
      setSyncingWatch(false);
      setWatchSynced(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Alert.alert('Watch Synced', 'Today\'s workout split and exercises have been sent to your Huawei Watch GT 4.');
    }, 1000);
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { borderBottomColor: theme.borderSubtle }]}>
        <View style={styles.topBarBrand}>
          <BrandLogo size={32} />
          <View>
            <Text style={[styles.brandTitle, { color: theme.primary }]}>AI FitWear</Text>
            <View style={styles.watchSyncMiniRow}>
              <View style={[styles.syncDot, { backgroundColor: theme.onTrack }]} />
              <Text style={[styles.syncMiniText, { color: theme.textSecondary }]}>Watch synced • 2m ago</Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Profile & Settings"
          onPress={() => router.push('/(tabs)/me')}
          style={[styles.profileAvatar, { backgroundColor: theme.primaryContainer, borderColor: theme.border }]}
        >
          <Ionicons name="person" size={18} color={theme.primary} />
        </Pressable>
      </View>

      {/* Segmented Switcher Header */}
      <View style={styles.header}>
        <View style={[styles.segmentedTrack, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderRadius: radii.full }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setActiveSegment('plan');
            }}
            style={[
              styles.segmentTab,
              {
                backgroundColor: activeSegment === 'plan' ? theme.primary : 'transparent',
                borderRadius: radii.full
              }
            ]}
          >
            <Ionicons
              name="calendar"
              size={15}
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
            style={[
              styles.segmentTab,
              {
                backgroundColor: activeSegment === 'library' ? theme.primary : 'transparent',
                borderRadius: radii.full
              }
            ]}
          >
            <Ionicons
              name="book"
              size={15}
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
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 110 }]} showsVerticalScrollIndicator={false}>
          {/* Plan Title & Cycle Info */}
          <View style={styles.planHeaderSection}>
            <View style={styles.cycleBadgeRow}>
              <View style={[styles.activeCycleBadge, { backgroundColor: theme.primaryContainer }]}>
                <View style={[styles.cyclePulseDot, { backgroundColor: theme.primary }]} />
                <Text style={[styles.activeCycleText, { color: theme.onPrimaryContainer }]}>
                  Active Cycle
                </Text>
              </View>
              <Pressable
                onPress={() => setShowGeneratorModal(true)}
                style={[styles.calendarIconBtn, { backgroundColor: theme.surfaceElevated }]}
              >
                <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
              </Pressable>
            </View>

            <Text style={[styles.mainPlanHeadline, { color: theme.text }]}>Training Plan</Text>
            <Text style={[styles.mainPlanSubtext, { color: theme.textSecondary }]}>
              Cycle {plan?.currentCycle || 1}: Beginner Foundation (Week 2 of 4)
            </Text>
          </View>

          {/* Daily Baselines Card (Stitch design) */}
          <View style={[styles.baselinesCard, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
            <View style={styles.baselinesLeft}>
              <View style={[styles.baselinesIconBox, { backgroundColor: theme.card }]}>
                <Ionicons name="analytics" size={18} color={theme.primary} />
              </View>
              <View style={{ minWidth: 0 }}>
                <Text style={[styles.baselinesLabel, { color: theme.textSecondary }]}>DAILY BASELINES</Text>
                <Text style={[styles.baselinesNumbers, { color: theme.text }]} numberOfLines={1}>
                  BMR {user?.bmr || 1680} • TDEE {user?.tdee || 2350} kcal
                </Text>
              </View>
            </View>

            <View style={[styles.goalPillBadge, { backgroundColor: theme.card }]}>
              <Text style={[styles.goalPillText, { color: theme.primary }]}>
                {user?.goal === 'build_muscle' ? 'Lean Muscle Gain' : 'Fat Loss & Core'}
              </Text>
            </View>
          </View>

          {/* Weekly Schedule Header */}
          <View style={styles.scheduleHeaderRow}>
            <View>
              <Text style={[styles.scheduleTitle, { color: theme.text }]}>Weekly Schedule</Text>
              <Text style={[styles.scheduleSub, { color: theme.textSecondary }]}>
                Tap to inspect or reschedule day
              </Text>
            </View>

            <Pressable
              onPress={() => setShowGeneratorModal(true)}
              style={styles.autoFillBtn}
            >
              <Text style={[styles.autoFillText, { color: theme.primary }]}>Auto-Fill</Text>
              <Ionicons name="sparkles" size={14} color={theme.primary} />
            </Pressable>
          </View>

          {/* 6-Day Schedule List (Stitch style) */}
          <View style={styles.scheduleList}>
            {plan?.days.map((day, dIdx) => {
              const isToday = dIdx === plan.currentDayIndex;
              const isCompleted = dIdx < plan.currentDayIndex;
              const isExpanded = expandedDayIndex === dIdx;

              // Derive muscle tag colors
              const primaryMuscle = day.muscleGroup.toLowerCase();
              const muscleColor =
                primaryMuscle.includes('chest')
                  ? '#C2410C'
                  : primaryMuscle.includes('back')
                  ? '#0F766E'
                  : primaryMuscle.includes('leg')
                  ? '#4338CA'
                  : primaryMuscle.includes('shoulder')
                  ? '#B45309'
                  : '#BE185D';

              return (
                <Pressable
                  key={day.id}
                  onPress={() => setExpandedDayIndex(isExpanded ? null : dIdx)}
                  style={[
                    styles.scheduleDayCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isToday ? theme.primary : theme.border,
                      borderLeftWidth: isToday ? 4 : 1,
                      borderRadius: radii.md,
                      ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                    }
                  ]}
                >
                  <View style={styles.scheduleDayContent}>
                    {/* Day Date Block */}
                    <View
                      style={[
                        styles.dayNumberBlock,
                        {
                          backgroundColor: isToday ? theme.primary : theme.surfaceElevated
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNameText,
                          { color: isToday ? theme.onPrimary : theme.textSecondary }
                        ]}
                      >
                        DAY
                      </Text>
                      <Text
                        style={[
                          styles.dayNumVal,
                          { color: isToday ? theme.onPrimary : theme.text }
                        ]}
                      >
                        {day.dayNumber}
                      </Text>
                    </View>

                    {/* Day Info */}
                    <View style={styles.dayInfoCol}>
                      <View style={styles.dayTitleRow}>
                        <Text style={[styles.dayCardTitle, { color: theme.text }]} numberOfLines={1}>
                          {day.title}
                        </Text>
                        {isToday ? (
                          <View style={[styles.todayTag, { backgroundColor: theme.primaryContainer }]}>
                            <Text style={[styles.todayTagText, { color: theme.primary }]}>Today</Text>
                          </View>
                        ) : isCompleted ? (
                          <Text style={[styles.completedText, { color: theme.onTrack }]}>Completed</Text>
                        ) : null}
                      </View>

                      {/* Muscle chips */}
                      <View style={styles.muscleChipsRow}>
                        <View style={[styles.muscleMicroPill, { backgroundColor: muscleColor }]}>
                          <View style={styles.whiteMicroDot} />
                          <Text style={styles.muscleMicroPillText}>{day.muscleGroup}</Text>
                        </View>
                        <Text style={[styles.dayDurationMeta, { color: theme.textSecondary }]}>
                          {day.estimatedDurationMin}m • {day.exercises.length} moves
                        </Text>
                      </View>
                    </View>

                    {/* Right Action */}
                    {isToday ? (
                      <Pressable
                        onPress={() => handleLaunchWorkout()}
                        style={[styles.startPillBtn, { backgroundColor: theme.primary }]}
                      >
                        <Ionicons name="play" size={13} color={theme.onPrimary} />
                        <Text style={[styles.startPillText, { color: theme.onPrimary }]}>Start</Text>
                      </Pressable>
                    ) : isCompleted ? (
                      <View style={[styles.checkCircleBox, { backgroundColor: theme.primaryContainer }]}>
                        <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
                      </View>
                    ) : (
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={theme.textMuted}
                      />
                    )}
                  </View>

                  {/* Expanded Movement List */}
                  {isExpanded && (
                    <View style={[styles.expandedExercisesBox, { borderTopColor: theme.borderSubtle }]}>
                      {day.exercises.map((pe, idx) => (
                        <View key={pe.id} style={styles.expandedExerciseRow}>
                          <Text style={[styles.exerciseIndexNum, { color: theme.textSecondary }]}>
                            {idx + 1}.
                          </Text>
                          <Text style={[styles.expandedExerciseName, { color: theme.text }]} numberOfLines={1}>
                            {pe.exerciseId.replace('ex_', '').replace(/_/g, ' ')}
                          </Text>
                          <Text style={[styles.expandedExerciseSets, { color: theme.textSecondary }]}>
                            {pe.sets} × {pe.repRange.min}-{pe.repRange.max}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* TARGET MUSCLE FOCUS GRID (Stitch 6 Groups) */}
          <View style={styles.muscleFocusSection}>
            <View style={styles.muscleFocusHeader}>
              <View>
                <Text style={[styles.muscleFocusTitle, { color: theme.text }]}>Target Muscle Focus</Text>
                <Text style={[styles.muscleFocusSub, { color: theme.textSecondary }]}>
                  Emphasis based on weekly volume
                </Text>
              </View>
              <Text style={[styles.muscleFocusCount, { color: theme.primary }]}>6 Groups</Text>
            </View>

            <View style={styles.muscleGrid3x2}>
              {[
                { name: 'Chest', load: 'Heavy', color: '#C2410C' },
                { name: 'Back', load: 'Heavy', color: '#0F766E' },
                { name: 'Shoulders', load: 'Mod', color: '#B45309' },
                { name: 'Legs', load: 'Heavy', color: '#4338CA' },
                { name: 'Arms', load: 'Mod', color: '#BE185D' },
                { name: 'Abs', load: 'Core', color: '#4D7C0F' }
              ].map((m) => (
                <Pressable
                  key={m.name}
                  onPress={() => {
                    setSelectedMuscle(m.name);
                    setActiveSegment('library');
                  }}
                  style={[styles.muscleCardItem, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <View style={[styles.muscleCardDot, { backgroundColor: m.color }]} />
                  <View style={{ minWidth: 0 }}>
                    <Text style={[styles.muscleCardName, { color: theme.text }]} numberOfLines={1}>
                      {m.name}
                    </Text>
                    <Text style={[styles.muscleCardLoad, { color: theme.textSecondary }]}>
                      {m.load}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* SYNC SCHEDULE TO WATCH CARD (Stitch GT 4 Section) */}
          <View
            style={[
              styles.watchCardContainer,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: radii.lg,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
          >
            <View style={styles.watchCardTopRow}>
              <View style={styles.watchIconAndTitle}>
                <View style={[styles.watchIconSquare, { backgroundColor: theme.primaryContainer }]}>
                  <Ionicons name="watch-outline" size={24} color={theme.primary} />
                </View>
                <View>
                  <Text style={[styles.watchCardHeadline, { color: theme.text }]}>Sync Schedule to Watch</Text>
                  <Text style={[styles.watchCardSub, { color: theme.textSecondary }]}>
                    Huawei Watch GT 4 • Connected
                  </Text>
                </View>
              </View>
              <View style={[styles.connectedLiveDot, { backgroundColor: theme.onTrack }]} />
            </View>

            <View style={[styles.alarmPromptBox, { backgroundColor: theme.surfaceElevated }]}>
              <Ionicons name="alarm-outline" size={18} color={theme.primary} style={{ marginTop: 1 }} />
              <Text style={[styles.alarmPromptText, { color: theme.textSecondary }]}>
                HarmonyOS watch will buzz and prompt your session at{' '}
                <Text style={{ color: theme.text, fontWeight: '700' }}>5:30 PM</Text>.
              </Text>
            </View>

            <PrimaryButton
              label={syncingWatch ? 'Syncing Routine...' : watchSynced ? 'Synced to HarmonyOS Watch' : 'Send to Watch'}
              icon="sync-outline"
              loading={syncingWatch}
              onPress={handleSyncToWatch}
            />
          </View>

          {/* CYCLE OPTIONS */}
          <View style={styles.cycleOptionsSection}>
            <Text style={[styles.cycleOptionsTitle, { color: theme.text }]}>Cycle Options</Text>

            <Pressable
              onPress={() => setShowCycleModal(true)}
              style={[
                styles.cycleProgressCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  borderRadius: radii.md
                }
              ]}
            >
              <View style={styles.cycleProgressTop}>
                <View style={styles.cycleProgressIconRow}>
                  <Ionicons name="refresh-circle" size={20} color={theme.primary} />
                  <Text style={[styles.cycleProgressLabel, { color: theme.text }]}>
                    Continue Current Cycle
                  </Text>
                </View>
                <Text style={[styles.cycleProgressPct, { color: theme.primary }]}>45% Complete</Text>
              </View>

              <View style={[styles.cycleTrack, { backgroundColor: theme.surfaceElevated }]}>
                <View
                  style={[
                    styles.cycleTrackFill,
                    { width: '45%', backgroundColor: theme.primary, borderRadius: radii.full }
                  ]}
                />
              </View>

              <View style={styles.cycleProgressBottom}>
                <Text style={[styles.cycleBottomSub, { color: theme.textSecondary }]}>
                  Week 2 of 4 • 8 sessions left
                </Text>
                <Text style={[styles.cycleOnTrackText, { color: theme.primary }]}>On Track</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setShowGeneratorModal(true)}
              style={[
                styles.generateSplitRow,
                {
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                  borderRadius: radii.md
                }
              ]}
            >
              <View style={styles.generateSplitLeft}>
                <View style={[styles.generateSplitIcon, { backgroundColor: theme.card }]}>
                  <Ionicons name="sparkles" size={18} color={theme.primary} />
                </View>
                <View>
                  <Text style={[styles.generateSplitTitle, { color: theme.text }]}>
                    Generate New AI Split
                  </Text>
                  <Text style={[styles.generateSplitSub, { color: theme.textSecondary }]}>
                    Tap to re-calibrate goals & equipment
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        /* ================= 2. LIBRARY SEGMENT ================= */
        <View style={styles.libraryContainer}>
          {/* Search bar */}
          <View style={[styles.searchBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Ionicons name="search" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search exercise movements..."
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

          {/* Muscle Chips Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {muscleFilters.map((m) => (
              <Chip
                key={m}
                label={m.charAt(0).toUpperCase() + m.slice(1)}
                selected={selectedMuscle.toLowerCase() === m.toLowerCase()}
                onPress={() => setSelectedMuscle(m)}
              />
            ))}
          </ScrollView>

          {/* Exercise List */}
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            {filteredExercises.map((ex) => (
              <Pressable
                key={ex.id}
                onPress={() => router.push(`/exercise-detail?id=${ex.id}`)}
                style={[
                  styles.libraryExerciseCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: radii.md
                  }
                ]}
              >
                <View style={styles.libraryCardBody}>
                  <Text style={[styles.libraryCardName, { color: theme.text }]}>{ex.name}</Text>
                  <Text style={[styles.libraryCardDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                    {ex.description}
                  </Text>
                  <View style={styles.libraryMetaRow}>
                    <View style={[styles.libraryBadge, { backgroundColor: theme.surfaceElevated }]}>
                      <Text style={[styles.libraryBadgeText, { color: theme.primary }]}>
                        {ex.muscleGroup}
                      </Text>
                    </View>
                    <View style={[styles.libraryBadge, { backgroundColor: theme.surfaceElevated }]}>
                      <Text style={[styles.libraryBadgeText, { color: theme.textSecondary }]}>
                        {ex.equipment}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Plan Generator Modal */}
      <Modal
        visible={showGeneratorModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGeneratorModal(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Generate AI Split</Text>
            <Pressable onPress={() => setShowGeneratorModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <View style={{ padding: 20, gap: 16 }}>
            <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>SELECT PRIMARY GOAL</Text>
            {(['build_muscle', 'lose_fat', 'maintain'] as GoalType[]).map((g) => (
              <Pressable
                key={g}
                onPress={() => setGeneratorGoal(g)}
                style={[
                  styles.goalOptionRow,
                  {
                    backgroundColor: generatorGoal === g ? theme.primaryContainer : theme.surfaceElevated,
                    borderColor: generatorGoal === g ? theme.primary : theme.border,
                    borderRadius: radii.md
                  }
                ]}
              >
                <Text
                  style={[
                    styles.goalOptionText,
                    {
                      color: generatorGoal === g ? theme.primary : theme.text,
                      fontWeight: generatorGoal === g ? '700' : '500'
                    }
                  ]}
                >
                  {g === 'build_muscle' ? 'Build Muscle (Hypertrophy)' : g === 'lose_fat' ? 'Fat Loss & Conditioning' : 'Maintain & Mobility'}
                </Text>
                {generatorGoal === g && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
              </Pressable>
            ))}

            <PrimaryButton
              label={isGenerating ? 'Synthesizing Movements...' : 'Generate 6-Day Split'}
              icon="sparkles"
              loading={isGenerating}
              onPress={handleRunGenerator}
              style={{ marginTop: 20 }}
            />
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showCycleModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCycleModal(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Cycle Progression</Text>
            <Pressable onPress={() => setShowCycleModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <View style={{ padding: 20, gap: 16 }}>
            <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>SELECT CYCLE ENTRY</Text>

            <Pressable
              onPress={() => setCycleChoice('continue')}
              style={[
                styles.goalOptionRow,
                {
                  backgroundColor: cycleChoice === 'continue' ? theme.primaryContainer : theme.surfaceElevated,
                  borderColor: cycleChoice === 'continue' ? theme.primary : theme.border,
                  borderRadius: radii.md
                }
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.goalOptionText,
                    {
                      color: cycleChoice === 'continue' ? theme.primary : theme.text,
                      fontWeight: cycleChoice === 'continue' ? '700' : '500'
                    }
                  ]}
                >
                  Continue Active Cycle
                </Text>
                <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
                  Resume at Day {(plan?.currentDayIndex ?? 0) + 1} of 6 (Cycle {plan?.currentCycle ?? 1})
                </Text>
              </View>
              {cycleChoice === 'continue' && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
            </Pressable>

            <Pressable
              onPress={() => setCycleChoice('new')}
              style={[
                styles.goalOptionRow,
                {
                  backgroundColor: cycleChoice === 'new' ? theme.primaryContainer : theme.surfaceElevated,
                  borderColor: cycleChoice === 'new' ? theme.primary : theme.border,
                  borderRadius: radii.md
                }
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.goalOptionText,
                    {
                      color: cycleChoice === 'new' ? theme.primary : theme.text,
                      fontWeight: cycleChoice === 'new' ? '700' : '500'
                    }
                  ]}
                >
                  Start New Cycle
                </Text>
                <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
                  Begin Cycle {(plan?.currentCycle ?? 1) + 1} at Day 1 with calibrated volume
                </Text>
              </View>
              {cycleChoice === 'new' && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
            </Pressable>

            <PrimaryButton
              label={cycleChoice === 'new' ? 'Start Fresh Cycle (Day 1)' : 'Continue to Today\'s Workout'}
              icon="play"
              onPress={handleLaunchWorkout}
              style={{ marginTop: 16 }}
            />
          </View>
        </SafeAreaView>
      </Modal>
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
  topBarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  brandLogoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  watchSyncMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  syncMiniText: {
    fontSize: 11,
    fontWeight: '500'
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  segmentedTrack: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 3
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8
  },
  segmentTabText: {
    fontSize: 13,
    fontWeight: '600'
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16
  },
  planHeaderSection: {
    gap: 4
  },
  cycleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  activeCycleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999
  },
  cyclePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  activeCycleText: {
    fontSize: 11,
    fontWeight: '700'
  },
  calendarIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainPlanHeadline: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 2
  },
  mainPlanSubtext: {
    fontSize: 14,
    fontWeight: '500'
  },
  baselinesCard: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  baselinesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  baselinesIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  baselinesLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  baselinesNumbers: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1
  },
  goalPillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999
  },
  goalPillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  scheduleSub: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 1
  },
  autoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  autoFillText: {
    fontSize: 13,
    fontWeight: '700'
  },
  scheduleList: {
    gap: 10
  },
  scheduleDayCard: {
    borderWidth: 1,
    padding: 12,
    overflow: 'hidden'
  },
  scheduleDayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  dayNumberBlock: {
    width: 44,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayNameText: {
    fontSize: 10,
    fontWeight: '700'
  },
  dayNumVal: {
    fontSize: 16,
    fontWeight: '800'
  },
  dayInfoCol: {
    flex: 1,
    minWidth: 0
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  dayCardTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  todayTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  todayTagText: {
    fontSize: 10,
    fontWeight: '700'
  },
  completedText: {
    fontSize: 11,
    fontWeight: '700'
  },
  muscleChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4
  },
  muscleMicroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
  },
  whiteMicroDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF'
  },
  muscleMicroPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  dayDurationMeta: {
    fontSize: 12
  },
  startPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999
  },
  startPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  checkCircleBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  expandedExercisesBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 6
  },
  expandedExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  exerciseIndexNum: {
    fontSize: 12,
    fontWeight: '600',
    width: 18
  },
  expandedExerciseName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600'
  },
  expandedExerciseSets: {
    fontSize: 12,
    fontWeight: '500'
  },
  muscleFocusSection: {
    marginTop: 8,
    gap: 8
  },
  muscleFocusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  muscleFocusTitle: {
    fontSize: 17,
    fontWeight: '700'
  },
  muscleFocusSub: {
    fontSize: 12
  },
  muscleFocusCount: {
    fontSize: 12,
    fontWeight: '700'
  },
  muscleGrid3x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  muscleCardItem: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1
  },
  muscleCardDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  muscleCardName: {
    fontSize: 13,
    fontWeight: '700'
  },
  muscleCardLoad: {
    fontSize: 10,
    fontWeight: '500'
  },
  watchCardContainer: {
    borderWidth: 1,
    padding: 16,
    marginTop: 6,
    gap: 12
  },
  watchCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  watchIconAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  watchIconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  watchCardHeadline: {
    fontSize: 16,
    fontWeight: '700'
  },
  watchCardSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1
  },
  connectedLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  alarmPromptBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 10
  },
  alarmPromptText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16
  },
  cycleOptionsSection: {
    marginTop: 6,
    gap: 10
  },
  cycleOptionsTitle: {
    fontSize: 17,
    fontWeight: '700'
  },
  cycleProgressCard: {
    borderWidth: 1,
    padding: 14,
    gap: 8
  },
  cycleProgressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cycleProgressIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  cycleProgressLabel: {
    fontSize: 14,
    fontWeight: '700'
  },
  cycleProgressPct: {
    fontSize: 12,
    fontWeight: '700'
  },
  cycleTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden'
  },
  cycleTrackFill: {
    height: '100%'
  },
  cycleProgressBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cycleBottomSub: {
    fontSize: 11
  },
  cycleOnTrackText: {
    fontSize: 11,
    fontWeight: '700'
  },
  generateSplitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1
  },
  generateSplitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  generateSplitIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  generateSplitTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  generateSplitSub: {
    fontSize: 12,
    marginTop: 1
  },
  libraryContainer: {
    flex: 1
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1
  },
  searchInput: {
    flex: 1,
    fontSize: 14
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8
  },
  libraryExerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 14,
    marginBottom: 8
  },
  libraryCardBody: {
    flex: 1,
    marginRight: 10
  },
  libraryCardName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2
  },
  libraryCardDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6
  },
  libraryMetaRow: {
    flexDirection: 'row',
    gap: 6
  },
  libraryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  libraryBadgeText: {
    fontSize: 11,
    fontWeight: '600'
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
    fontWeight: '700'
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  goalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1
  },
  goalOptionText: {
    fontSize: 15
  }
});
