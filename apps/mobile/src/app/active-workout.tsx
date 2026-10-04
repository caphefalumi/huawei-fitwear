import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Modal,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useAppTheme, softShadow } from '../theme';
import { useWorkoutStore } from '../store/workoutStore';
import { useSettingsStore } from '../store/settingsStore';
import {
  PrimaryButton,
  SecondaryButton,
  RestTimerRing
} from '../components/ui';

export default function ActiveWorkoutScreen() {
  const { theme, radii } = useAppTheme();
  const {
    activeSession,
    currentExerciseIndex,
    currentSetIndex,
    isResting,
    restSecondsRemaining,
    startWorkout,
    incrementRep,
    updateSet,
    completeCurrentSet,
    skipRest,
    addRestSeconds,
    tickRest,
    endWorkout,
    exercises,
    addSetToCurrentExercise,
    swapCurrentExercise
  } = useWorkoutStore();

  const simulateWatchActive = useSettingsStore((state) => state.simulateWatchActive);

  const [isSimulatingWatch, setIsSimulatingWatch] = useState<boolean>(simulateWatchActive);
  const [watchConnected] = useState<boolean>(true);
  const [showEndModal, setShowEndModal] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(1455);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showSwapModal, setShowSwapModal] = useState<boolean>(false);

  // Keep screen awake while in active workout
  useEffect(() => {
    activateKeepAwakeAsync('active-workout').catch(() => {});
    return () => {
      deactivateKeepAwake('active-workout').catch(() => {});
    };
  }, []);

  // Ensure an active session exists
  useEffect(() => {
    if (!activeSession) {
      startWorkout();
    }
  }, [activeSession, startWorkout]);

  // Workout duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dev Watch Simulation ticker: emits a rep every 1.5s while not resting
  useEffect(() => {
    if (!isSimulatingWatch || isResting || !activeSession || !watchConnected) return;

    const interval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      incrementRep(true);
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulatingWatch, isResting, activeSession, watchConnected, incrementRep]);

  // Rest countdown timer ticker (ticks every 1s while resting)
  useEffect(() => {
    if (!isResting) return;

    const restInterval = setInterval(() => {
      tickRest();
    }, 1000);

    return () => clearInterval(restInterval);
  }, [isResting, tickRest]);

  if (!activeSession) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingBox}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Preparing Workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = activeSession.exercises[currentExerciseIndex] || activeSession.exercises[0];
  const currentSet = currentExercise?.sets[currentSetIndex] || currentExercise?.sets[0];

  // Overall workout progress
  const totalSets = activeSession.totalSets || 1;
  const completedSetsCount = activeSession.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );

  // Volume calculation
  const totalVolumeKg = activeSession.exercises.reduce((acc, ex) => {
    return (
      acc +
      ex.sets.reduce((setAcc, s) => {
        return setAcc + (s.completed ? s.completedReps * s.weightKg : 0);
      }, 0)
    );
  }, 0) || 2480;

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleFinishWorkout = async () => {
    setShowEndModal(false);
    await endWorkout();
    router.replace('/session-summary');
  };

  const handleAddWeight = () => {
    if (!currentSet) return;
    updateSet(currentSet.completedReps, currentSet.weightKg + 2.5);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const handleDropWeight = () => {
    if (!currentSet) return;
    const newWeight = Math.max(0, currentSet.weightKg - 2.5);
    updateSet(currentSet.completedReps, newWeight);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { borderBottomColor: theme.borderSubtle }]}>
        <View style={styles.topBarLeft}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="End Workout"
            onPress={() => setShowEndModal(true)}
            style={[styles.backCircleBtn, { backgroundColor: theme.surfaceElevated }]}
          >
            <Ionicons name="arrow-back" size={20} color={theme.text} />
          </Pressable>
          <View style={[styles.brandIconMini, { backgroundColor: theme.primaryContainer }]}>
            <Ionicons name="fitness" size={16} color={theme.primary} />
          </View>
          <Text style={[styles.topBarTitle, { color: theme.text }]}>Active Session Tracking</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="End Workout Session"
          onPress={() => setShowEndModal(true)}
          style={[styles.endPill, { backgroundColor: `${theme.error}18`, borderColor: `${theme.error}40` }]}
        >
          <Text style={[styles.endPillText, { color: theme.error }]}>End</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Banner: Watch Mirroring & Overall Exercise Progress */}
        <View style={styles.statusSection}>
          <View
            style={[
              styles.mirrorStatusCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: radii.md,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
          >
            <View style={styles.mirrorStatusLeft}>
              <View style={[styles.pingCircle, { backgroundColor: theme.onTrack }]} />
              <Ionicons name="watch" size={15} color={theme.primary} />
              <Text style={[styles.mirrorStatusText, { color: theme.text }]}>
                Watch Live Mirroring • Latency 12ms
              </Text>
            </View>
            <Pressable
              onPress={() => {
                setIsSimulatingWatch((prev) => !prev);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              }}
              style={[
                styles.awakeBadge,
                { backgroundColor: isSimulatingWatch ? theme.primaryContainer : theme.surfaceElevated }
              ]}
            >
              <Ionicons
                name="hardware-chip-outline"
                size={12}
                color={isSimulatingWatch ? theme.primary : theme.textSecondary}
              />
              <Text
                style={[
                  styles.awakeBadgeText,
                  { color: isSimulatingWatch ? theme.primary : theme.textSecondary }
                ]}
              >
                {isSimulatingWatch ? 'Auto Reps' : 'Manual'}
              </Text>
            </Pressable>
          </View>

          {/* Micro Session Timeline Stepper */}
          <View style={styles.timelineStepperRow}>
            <Text style={[styles.timelineExerciseLabel, { color: theme.text }]}>
              Exercise {currentExerciseIndex + 1} of {activeSession.exercises.length}
            </Text>
            <View style={styles.timelineSegmentsRow}>
              {activeSession.exercises.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.timelineSegment,
                    {
                      backgroundColor:
                        idx <= currentExerciseIndex ? theme.primary : theme.borderSubtle
                    }
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.timelineSetLabel, { color: theme.primary }]}>
              Set {currentSet?.setNumber || 1} of {currentExercise?.sets.length || 4}
            </Text>
          </View>
        </View>

        {/* MAIN ACTIVE EXERCISE CARD */}
        <View
          style={[
            styles.mainExerciseCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.lg,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          {/* Muscle Tag & Exercise Headline */}
          <View style={styles.exerciseCardTop}>
            <View style={{ flex: 1 }}>
              <View style={styles.muscleBadgeRow}>
                <View style={[styles.musclePillBack, { backgroundColor: '#0F766E' }]}>
                  <Ionicons name="barbell-outline" size={12} color="#FFFFFF" />
                  <Text style={styles.musclePillBackText}>Back</Text>
                </View>
                <Text style={[styles.movementCategoryText, { color: theme.textSecondary }]}>
                  Compound Pull
                </Text>
              </View>
              <Text style={[styles.exerciseMainName, { color: theme.text }]} numberOfLines={1}>
                {currentExercise?.exerciseName || 'Barbell Bent-Over Row'}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Exercise Form Guide"
              onPress={() => setShowGuideModal(true)}
              style={[styles.guideHelpBtn, { backgroundColor: theme.surfaceElevated }]}
            >
              <Ionicons name="help-circle-outline" size={20} color={theme.primary} />
            </Pressable>
          </View>

          {/* Live Hero Rep Tracker Metric Box */}
          <View style={[styles.heroRepBox, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
            <Text style={[styles.repBoxLabel, { color: theme.textSecondary }]}>
              REP COUNT (LIVE SENSOR)
            </Text>
            <View style={styles.repNumbersRow}>
              <Text style={[styles.repBigNumber, { color: theme.primary }]}>
                {currentSet?.completedReps || 0}
              </Text>
              <Text style={[styles.repTargetSlash, { color: theme.textMuted }]}>
                / {currentSet?.targetReps || 10}
              </Text>
            </View>

            <View style={[styles.targetPillBox, { backgroundColor: theme.card }]}>
              <Ionicons name="options-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.targetPillText, { color: theme.text }]}>
                Target: {currentSet?.targetReps || 10} reps ({currentSet?.weightKg || 65} kg)
              </Text>
            </View>

            {/* Micro Rep Cadence Indicator */}
            <View style={styles.cadenceTrackRow}>
              {Array.from({ length: currentSet?.targetReps || 10 }).map((_, rIdx) => {
                const isRepDone = rIdx < (currentSet?.completedReps || 0);
                const isRepActive = rIdx === (currentSet?.completedReps || 0);
                return (
                  <View
                    key={rIdx}
                    style={[
                      styles.cadenceBar,
                      {
                        backgroundColor: isRepDone
                          ? theme.primary
                          : isRepActive
                          ? theme.primaryGlow
                          : theme.track
                      }
                    ]}
                  />
                );
              })}
            </View>
          </View>

          {isResting ? (
            <View style={[styles.restHeroCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderRadius: radii.lg }]}>
              <Text style={[styles.restHeroSubtitle, { color: theme.textSecondary }]}>REST INTERVAL</Text>
              <View style={styles.restRingWrapper}>
                <RestTimerRing
                  size={140}
                  totalSeconds={currentSet?.restSeconds || 90}
                  secondsLeft={restSecondsRemaining}
                  onTimeUp={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                  }}
                />
              </View>

              <View style={[styles.nextSetPreviewPill, { backgroundColor: theme.card }]}>
                <Ionicons name="barbell-outline" size={14} color={theme.primary} />
                <Text style={[styles.nextSetPreviewText, { color: theme.text }]}>
                  Next: Set {currentSetIndex + 2 <= (currentExercise?.sets.length || 0) ? currentSetIndex + 2 : 1} of {currentExercise?.sets.length}
                </Text>
              </View>

              <View style={styles.restActionButtonsRow}>
                <Pressable
                  onPress={() => addRestSeconds(15)}
                  style={[styles.restExtBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <Text style={[styles.restExtBtnText, { color: theme.text }]}>+15s</Text>
                </Pressable>
                <Pressable
                  onPress={() => addRestSeconds(30)}
                  style={[styles.restExtBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <Text style={[styles.restExtBtnText, { color: theme.text }]}>+30s</Text>
                </Pressable>
                <Pressable
                  onPress={skipRest}
                  style={[styles.skipRestBtn, { backgroundColor: theme.primary }]}
                >
                  <Ionicons name="play" size={16} color={theme.onPrimary} />
                  <Text style={[styles.skipRestBtnText, { color: theme.onPrimary }]}>Skip Rest</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={[styles.restTimerStrip, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
              <View style={[styles.restTimerRingMini, { backgroundColor: theme.card }]}>
                <Ionicons name="timer-outline" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.restTimerHeader}>
                  <Text style={[styles.restTimerSub, { color: theme.textSecondary }]}>Auto-Rest Configured</Text>
                  <Text style={[styles.restTimerCountdown, { color: theme.text }]}>
                    {currentSet?.restSeconds || 90}s rest
                  </Text>
                </View>
                <Text style={[styles.restVibeText, { color: theme.textSecondary }]}>
                  Watch tracks your breathing & heart rate recovery
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.setsTableCard, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
            <View style={styles.setsTableHeader}>
              <Text style={[styles.setsTableColTitle, { flex: 0.8, color: theme.textSecondary }]}>SET</Text>
              <Text style={[styles.setsTableColTitle, { flex: 1.5, color: theme.textSecondary }]}>TARGET</Text>
              <Text style={[styles.setsTableColTitle, { flex: 1.5, color: theme.textSecondary }]}>WEIGHT</Text>
              <Text style={[styles.setsTableColTitle, { flex: 1, color: theme.textSecondary, textAlign: 'right' }]}>STATUS</Text>
            </View>

            {currentExercise?.sets.map((s, idx) => {
              const isCurrent = idx === currentSetIndex;
              return (
                <View
                  key={s.id || idx}
                  style={[
                    styles.setTableRow,
                    {
                      borderTopColor: theme.borderSubtle,
                      backgroundColor: isCurrent ? `${theme.primary}12` : 'transparent'
                    }
                  ]}
                >
                  <Text style={[styles.setTableNum, { color: isCurrent ? theme.primary : theme.text }]}>
                    {idx + 1}
                  </Text>
                  <Text style={[styles.setTableTarget, { color: theme.text }]}>
                    {s.targetReps} reps
                  </Text>
                  <Text style={[styles.setTableWeight, { color: theme.text }]}>
                    {s.weightKg} kg
                  </Text>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    {s.completed ? (
                      <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                    ) : (
                      <View style={[styles.uncompletedCircle, { borderColor: isCurrent ? theme.primary : theme.border }]} />
                    )}
                  </View>
                </View>
              );
            })}

            <View style={styles.setsTableActionsRow}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  addSetToCurrentExercise();
                }}
                style={styles.addSetBtn}
              >
                <Ionicons name="add-circle-outline" size={16} color={theme.primary} />
                <Text style={[styles.addSetBtnText, { color: theme.primary }]}>Add Set</Text>
              </Pressable>

              <Pressable
                onPress={() => setShowSwapModal(true)}
                style={styles.swapExerciseBtn}
              >
                <Ionicons name="swap-horizontal" size={16} color={theme.textSecondary} />
                <Text style={[styles.swapExerciseBtnText, { color: theme.textSecondary }]}>Swap Movement</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.formCueBox, { backgroundColor: `${theme.primary}12`, borderRadius: radii.md }]}>
            <View style={[styles.formCueIcon, { backgroundColor: theme.primary }]}>
              <Ionicons name="bulb" size={15} color={theme.onPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.formCueTitle, { color: theme.primary }]}>Form cue</Text>
              <Text style={[styles.formCueBody, { color: theme.text }]}>
                Keep spine neutral & pull elbows tight toward hips. Squeeze scapulae at apex.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.controlsSection}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Complete Set ${currentSet?.setNumber || 1}`}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
              completeCurrentSet();
            }}
            style={({ pressed }) => [
              styles.completeSetBtn64,
              {
                backgroundColor: theme.primary,
                borderRadius: radii.md,
                opacity: pressed ? 0.9 : 1
              }
            ]}
          >
            <Ionicons name="checkmark-circle" size={24} color={theme.onPrimary} />
            <Text style={[styles.completeSetBtnText, { color: theme.onPrimary }]}>
              Complete Set {currentSet?.setNumber || 1}
            </Text>
          </Pressable>

          <View style={styles.tweakButtonsGrid}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add 1 Rep"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                incrementRep(false);
              }}
              style={({ pressed }) => [
                styles.tweakBtn,
                {
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                  borderRadius: radii.md,
                  opacity: pressed ? 0.8 : 1
                }
              ]}
            >
              <Ionicons name="add" size={18} color={theme.primary} />
              <Text style={[styles.tweakBtnText, { color: theme.text }]}>+1 Rep</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add 2.5kg Weight"
              onPress={handleAddWeight}
              style={({ pressed }) => [
                styles.tweakBtn,
                {
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                  borderRadius: radii.md,
                  opacity: pressed ? 0.8 : 1
                }
              ]}
            >
              <Ionicons name="arrow-up" size={16} color={theme.primary} />
              <Text style={[styles.tweakBtnText, { color: theme.text }]}>+2.5kg</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Drop 2.5kg Weight"
              onPress={handleDropWeight}
              style={({ pressed }) => [
                styles.tweakBtn,
                {
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                  borderRadius: radii.md,
                  opacity: pressed ? 0.8 : 1
                }
              ]}
            >
              <Ionicons name="arrow-down" size={16} color={theme.carbs} />
              <Text style={[styles.tweakBtnText, { color: theme.text }]}>-2.5kg</Text>
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.metricsFooterCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.lg,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          {/* Volume */}
          <View style={styles.metricCell}>
            <View style={styles.metricHeaderMini}>
              <Ionicons name="barbell-outline" size={13} color={theme.textSecondary} />
              <Text style={[styles.metricLabelMini, { color: theme.textSecondary }]}>Volume</Text>
            </View>
            <Text style={[styles.metricValueLarge, { color: theme.text }]}>
              {totalVolumeKg.toLocaleString()}{' '}
              <Text style={[styles.metricUnitMini, { color: theme.textSecondary }]}>kg</Text>
            </Text>
          </View>

          <View style={[styles.metricDividerVertical, { backgroundColor: theme.borderSubtle }]} />

          {/* Elapsed */}
          <View style={styles.metricCell}>
            <View style={styles.metricHeaderMini}>
              <Ionicons name="time-outline" size={13} color={theme.textSecondary} />
              <Text style={[styles.metricLabelMini, { color: theme.textSecondary }]}>Elapsed</Text>
            </View>
            <Text style={[styles.metricValueLarge, { color: theme.text }]}>
              {formatTime(elapsedSeconds)}
            </Text>
          </View>

          <View style={[styles.metricDividerVertical, { backgroundColor: theme.borderSubtle }]} />

          {/* Live Biometric Watch HR */}
          <View style={styles.metricCell}>
            <View style={styles.metricHeaderMini}>
              <Ionicons name="heart" size={13} color={theme.error} />
              <Text style={[styles.metricLabelMini, { color: theme.textSecondary }]}>Heart Rate</Text>
            </View>
            <Text style={[styles.metricValueLarge, { color: theme.text }]}>
              142 <Text style={[styles.metricUnitMini, { color: theme.textSecondary }]}>bpm</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Guide Modal */}
      <Modal
        visible={showGuideModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGuideModal(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Exercise Guidance</Text>
            <Pressable onPress={() => setShowGuideModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>
          <View style={{ padding: 20, gap: 14 }}>
            <Text style={[styles.exerciseMainName, { color: theme.text }]}>
              {currentExercise?.exerciseName}
            </Text>
            <Text style={[styles.formCueBody, { color: theme.textSecondary }]}>
              Keep feet shoulder-width apart. Hinge at hips until torso is roughly 45 degrees.
              Pull barbell toward navel, keeping wrists rigid and elbows tracking close to the ribs.
            </Text>
            <PrimaryButton label="Got it" onPress={() => setShowGuideModal(false)} />
          </View>
        </SafeAreaView>
      </Modal>

      {/* End Workout Modal */}
      <Modal
        visible={showEndModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEndModal(false)}
      >
        <View style={styles.modalScrim}>
          <View style={[styles.confirmEndCard, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }]}>
            <Ionicons name="alert-circle-outline" size={40} color={theme.warning} />
            <Text style={[styles.confirmEndTitle, { color: theme.text }]}>End Workout?</Text>
            <Text style={[styles.confirmEndDesc, { color: theme.textSecondary }]}>
              You have completed {completedSetsCount} of {totalSets} planned sets. Your telemetry will be saved and synced to your summary.
            </Text>

            <View style={{ width: '100%', gap: 10, marginTop: 10 }}>
              <PrimaryButton label="Save & Finish" onPress={handleFinishWorkout} />
              <SecondaryButton label="Resume Session" onPress={() => setShowEndModal(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSwapModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSwapModal(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Swap Current Movement</Text>
            <Pressable onPress={() => setShowSwapModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
            <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 4 }}>
              Select an alternative {currentExercise?.muscleGroup} exercise if equipment is occupied:
            </Text>
            {exercises
              .filter((e) => e.muscleGroup === currentExercise?.muscleGroup && e.id !== currentExercise?.exerciseId)
              .map((alt) => (
                <Pressable
                  key={alt.id}
                  onPress={() => {
                    swapCurrentExercise(alt);
                    setShowSwapModal(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                  }}
                  style={[styles.swapModalItem, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.md }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>{alt.name}</Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                      {alt.equipment} • {alt.difficulty}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.primary} />
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
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600'
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
  endPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1
  },
  endPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 14
  },
  statusSection: {
    gap: 8
  },
  mirrorStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1
  },
  mirrorStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  pingCircle: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  mirrorStatusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  awakeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999
  },
  awakeBadgeText: {
    fontSize: 11,
    fontWeight: '600'
  },
  timelineStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  timelineExerciseLabel: {
    fontSize: 13,
    fontWeight: '700'
  },
  timelineSegmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  timelineSegment: {
    width: 24,
    height: 4,
    borderRadius: 2
  },
  timelineSetLabel: {
    fontSize: 13,
    fontWeight: '700'
  },
  mainExerciseCard: {
    borderWidth: 1,
    padding: 16,
    gap: 12
  },
  exerciseCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  muscleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  musclePillBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
  },
  musclePillBackText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  movementCategoryText: {
    fontSize: 12,
    fontWeight: '500'
  },
  exerciseMainName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  guideHelpBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroRepBox: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  repBoxLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6
  },
  repNumbersRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginVertical: 4
  },
  repBigNumber: {
    fontSize: 60,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    lineHeight: 66
  },
  repTargetSlash: {
    fontSize: 22,
    fontWeight: '600'
  },
  targetPillBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    marginTop: 4
  },
  targetPillText: {
    fontSize: 13,
    fontWeight: '600'
  },
  cadenceTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    width: '100%',
    marginTop: 14
  },
  cadenceBar: {
    flex: 1,
    height: 6,
    borderRadius: 3
  },
  restTimerStrip: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  restTimerRingMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  restTimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  restTimerSub: {
    fontSize: 12,
    fontWeight: '600'
  },
  restTimerCountdown: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  restVibePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2
  },
  restVibeText: {
    fontSize: 11,
    fontWeight: '400'
  },
  formCueBox: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  formCueIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1
  },
  formCueTitle: {
    fontSize: 12,
    fontWeight: '700'
  },
  formCueBody: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2
  },
  controlsSection: {
    gap: 10
  },
  restHeroCard: {
    padding: 16,
    borderWidth: 1,
    alignItems: 'center'
  },
  restHeroSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 8
  },
  restRingWrapper: {
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nextSetPreviewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    marginVertical: 8
  },
  nextSetPreviewText: {
    fontSize: 12,
    fontWeight: '600'
  },
  restActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    width: '100%'
  },
  restExtBtn: {
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  restExtBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  skipRestBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  skipRestBtnText: {
    fontSize: 13,
    fontWeight: '700'
  },
  setsTableCard: {
    padding: 14,
    gap: 8
  },
  setsTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 6
  },
  setsTableColTitle: {
    fontSize: 11,
    fontWeight: '700'
  },
  setTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  setTableNum: {
    flex: 0.8,
    fontSize: 13,
    fontWeight: '700'
  },
  setTableTarget: {
    flex: 1.5,
    fontSize: 13,
    fontWeight: '500'
  },
  setTableWeight: {
    flex: 1.5,
    fontSize: 13,
    fontWeight: '700'
  },
  uncompletedCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5
  },
  setsTableActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128, 128, 128, 0.2)'
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4
  },
  addSetBtnText: {
    fontSize: 13,
    fontWeight: '700'
  },
  swapExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4
  },
  swapExerciseBtnText: {
    fontSize: 13,
    fontWeight: '600'
  },
  swapModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1
  },
  completeSetBtn64: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  completeSetBtnText: {
    fontSize: 17,
    fontWeight: '700'
  },
  tweakButtonsGrid: {
    flexDirection: 'row',
    gap: 8
  },
  tweakBtn: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1
  },
  tweakBtnText: {
    fontSize: 13,
    fontWeight: '600'
  },
  metricsFooterCard: {
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  metricCell: {
    alignItems: 'center',
    flex: 1
  },
  metricHeaderMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metricLabelMini: {
    fontSize: 11,
    fontWeight: '500'
  },
  metricValueLarge: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginTop: 2
  },
  metricUnitMini: {
    fontSize: 11,
    fontWeight: '400'
  },
  metricDividerVertical: {
    width: 1,
    height: 28
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
  modalScrim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  confirmEndCard: {
    width: '100%',
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12
  },
  confirmEndTitle: {
    fontSize: 20,
    fontWeight: '700'
  },
  confirmEndDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20
  }
});
