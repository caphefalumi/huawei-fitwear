import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Modal,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useAppTheme } from '../theme';
import { useWorkoutStore } from '../store/workoutStore';
import { useSettingsStore } from '../store/settingsStore';
import {
  PrimaryButton,
  SecondaryButton,
  Stepper,
  ProgressRing,
  RestTimerRing
} from '../components/ui';

export default function ActiveWorkoutScreen() {
  const { theme, radii, spacing } = useAppTheme();
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
    endWorkout
  } = useWorkoutStore();

  const simulateWatchActive = useSettingsStore((state) => state.simulateWatchActive);
  const setSimulateWatchActive = useSettingsStore((state) => state.setSimulateWatchActive);

  // Local simulated ticker
  const [isSimulatingWatch, setIsSimulatingWatch] = useState<boolean>(simulateWatchActive);
  const [watchConnected, setWatchConnected] = useState<boolean>(true);
  const [showEndModal, setShowEndModal] = useState<boolean>(false);

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
  }, [activeSession]);

  // Dev Watch Simulation ticker: emits a rep every 1.5s while not resting
  useEffect(() => {
    if (!isSimulatingWatch || isResting || !activeSession || !watchConnected) return;

    const interval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      incrementRep(true);
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulatingWatch, isResting, activeSession, watchConnected]);

  // Rest countdown timer ticker (ticks every 1s while resting)
  useEffect(() => {
    if (!isResting) return;

    const restInterval = setInterval(() => {
      tickRest();
    }, 1000);

    return () => clearInterval(restInterval);
  }, [isResting]);

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
  const progressRatio = Math.min(completedSetsCount / totalSets, 1);

  // Next exercise/set preview for rest screen
  let nextExName = currentExercise?.exerciseName;
  let nextSetNum = (currentSetIndex || 0) + 2;
  if (currentSetIndex + 1 >= (currentExercise?.sets.length || 0)) {
    const nextEx = activeSession.exercises[currentExerciseIndex + 1];
    if (nextEx) {
      nextExName = nextEx.exerciseName;
      nextSetNum = 1;
    }
  }

  const handleFinishWorkout = async () => {
    setShowEndModal(false);
    const session = await endWorkout();
    router.replace('/session-summary');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Banner if watch is simulated as disconnected */}
      {!watchConnected ? (
        <View style={[styles.disconnectedBanner, { backgroundColor: theme.almostThereBg }]}>
          <Ionicons name="warning" size={16} color={theme.almostThere} />
          <Text style={[styles.disconnectedText, { color: theme.almostThere }]}>
            Watch disconnected • Counting continues on watch, will sync later
          </Text>
        </View>
      ) : null}

      {/* Workout Navigation Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.headerRingBox}>
          <ProgressRing
            size={52}
            strokeWidth={4}
            progress={progressRatio}
            color={theme.protein}
            icon={{ name: 'dumbbell', color: theme.ringIcon.workout }}
            isWorkoutRing={true}
            accessibilityLabel={`Workout progress, ${completedSetsCount} of ${totalSets} sets completed`}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.exerciseTitle, { color: theme.text }]} numberOfLines={1}>
            {currentExercise?.exerciseName}
          </Text>
          <Text style={[styles.exerciseSubtitle, { color: theme.textSecondary }]}>
            Set {currentSet?.setNumber} of {currentExercise?.sets.length} • {completedSetsCount}/{totalSets} Sets
          </Text>
        </View>

        <Pressable
          onPress={() => setShowEndModal(true)}
          style={[styles.endButton, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
        >
          <Text style={[styles.endButtonText, { color: theme.overTarget }]}>End</Text>
        </Pressable>
      </View>

      {/* Overall Sets Progress Bar */}
      <View style={[styles.overallProgressTrack, { backgroundColor: theme.surfaceElevated }]}>
        <View
          style={[
            styles.overallProgressFill,
            { width: `${progressRatio * 100}%`, backgroundColor: theme.primary }
          ]}
        />
      </View>

      {/* Main Live Execution Area */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Connection & Counter Source Pill */}
        <View style={styles.sourcePillRow}>
          <Pressable
            onPress={() => setWatchConnected(!watchConnected)}
            style={[
              styles.sourceChip,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: watchConnected ? theme.primary : theme.almostThere
              }
            ]}
          >
            <Ionicons
              name="watch"
              size={14}
              color={watchConnected ? theme.primary : theme.almostThere}
            />
            <Text style={[styles.sourceChipText, { color: theme.text }]}>
              {watchConnected
                ? currentSet?.countedBy === 'watch'
                  ? 'Counted by Watch'
                  : 'Manual Entry'
                : 'Watch Disconnected'}
            </Text>
          </Pressable>

          {/* Dev Watch Simulator Button */}
          <Pressable
            onPress={() => {
              const nextSim = !isSimulatingWatch;
              setIsSimulatingWatch(nextSim);
              setSimulateWatchActive(nextSim);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            }}
            style={[
              styles.simWatchButton,
              {
                backgroundColor: isSimulatingWatch ? theme.primary : theme.surfaceElevated,
                borderColor: isSimulatingWatch ? theme.primary : theme.border
              }
            ]}
          >
            <Ionicons
              name={isSimulatingWatch ? 'play-circle' : 'stopwatch-outline'}
              size={14}
              color={isSimulatingWatch ? theme.onPrimary : theme.textSecondary}
            />
            <Text
              style={[
                styles.simWatchText,
                { color: isSimulatingWatch ? theme.onPrimary : theme.text }
              ]}
            >
              {isSimulatingWatch ? 'Simulating Watch (1.5s)' : 'Simulate Watch'}
            </Text>
          </Pressable>
        </View>

        {/* Giant Live Rep Display */}
        <View style={[styles.giantCounterCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.targetWindowLabel, { color: theme.textSecondary }]}>
            TARGET REPS: {currentSet?.targetReps}
          </Text>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              incrementRep(false);
            }}
            style={styles.giantNumberTouch}
          >
            <Text style={[styles.giantNumber, { color: theme.primary }]}>
              {currentSet?.completedReps || 0}
            </Text>
            <Text style={[styles.giantSubLabel, { color: theme.textMuted }]}>
              TAP TO LOG REP MANUALLY
            </Text>
          </Pressable>

          {/* Manual Correction Steppers */}
          <View style={styles.correctionSteppers}>
            <View style={{ flex: 1 }}>
              <Stepper
                label="REPS"
                value={currentSet?.completedReps || 0}
                onChange={(val) => {
                  updateSet(val, currentSet?.weightKg || 0);
                }}
                min={0}
                max={50}
                step={1}
              />
            </View>

            <View style={{ width: 12 }} />

            <View style={{ flex: 1 }}>
              <Stepper
                label="WEIGHT"
                value={currentSet?.weightKg || 0}
                onChange={(val) => {
                  updateSet(currentSet?.completedReps || 0, val);
                }}
                min={0}
                max={300}
                step={2.5}
                unit="kg"
              />
            </View>
          </View>

          {/* Finish Set Primary Action */}
          <PrimaryButton
            label="Complete Set & Rest"
            icon="checkmark-circle"
            size="large"
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
              completeCurrentSet();
            }}
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Set List under Counter */}
        <View style={styles.setsListContainer}>
          <Text style={[styles.setsSectionTitle, { color: theme.text }]}>
            Sets Breakdown ({currentExercise?.exerciseName})
          </Text>

          {currentExercise?.sets.map((set, sIdx) => {
            const isSetCurrent = sIdx === currentSetIndex;
            return (
              <View
                key={set.id}
                style={[
                  styles.setRow,
                  {
                    backgroundColor: isSetCurrent ? theme.surfaceElevated : theme.card,
                    borderColor: isSetCurrent ? theme.primary : theme.border
                  }
                ]}
              >
                <View style={styles.setRowLeft}>
                  <View
                    style={[
                      styles.setIndexBadge,
                      {
                        backgroundColor: set.completed
                          ? theme.primary
                          : isSetCurrent
                          ? theme.primaryGlow
                          : theme.surfaceSubtle
                      }
                    ]}
                  >
                    {set.completed ? (
                      <Ionicons name="checkmark" size={14} color={theme.onPrimary} />
                    ) : (
                      <Text
                        style={[
                          styles.setIndexText,
                          { color: isSetCurrent ? theme.primary : theme.textMuted }
                        ]}
                      >
                        {set.setNumber}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.setRowSpecs, { color: theme.text }]}>
                    {set.completed ? set.completedReps : set.targetReps} reps × {set.weightKg} kg
                  </Text>
                </View>

                <Text
                  style={[
                    styles.setStatusLabel,
                    {
                      color: set.completed
                        ? theme.primary
                        : isSetCurrent
                        ? theme.text
                        : theme.textMuted
                    }
                  ]}
                >
                  {set.completed ? 'Completed' : isSetCurrent ? 'Active Set' : 'Upcoming'}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ================= REST COUNTDOWN OVERLAY MODAL ================= */}
      <Modal visible={isResting} animationType="fade" transparent={false}>
        <SafeAreaView style={[styles.restOverlayContainer, { backgroundColor: theme.background }]}>
          <View style={styles.restContent}>
            <View style={styles.restTopHeader}>
              <View style={[styles.restWatchChip, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Ionicons name="watch" size={16} color={theme.primary} />
                <Text style={[styles.restWatchText, { color: theme.primary }]}>
                  Watch Counting Rest
                </Text>
              </View>
            </View>

            {/* Large Rest Timer Ring */}
            <RestTimerRing
              size={240}
              secondsLeft={restSecondsRemaining}
              totalSeconds={currentSet?.restSeconds || 90}
              icon={{ name: 'timer-outline', color: theme.ringIcon.rest }}
              onTimeUp={skipRest}
            />

            {/* Next Exercise Preview */}
            <View style={[styles.nextPreviewCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <Text style={[styles.nextPreviewLabel, { color: theme.textSecondary }]}>
                UP NEXT
              </Text>
              <Text style={[styles.nextPreviewTitle, { color: theme.text }]}>
                {nextExName}
              </Text>
              <Text style={[styles.nextPreviewSet, { color: theme.textSecondary }]}>
                Set {nextSetNum} • Target: 8-12 reps
              </Text>
            </View>

            {/* Rest Actions */}
            <View style={styles.restButtonsRow}>
              <SecondaryButton
                label="+15s"
                icon="add"
                onPress={() => addRestSeconds(15)}
                style={{ flex: 1 }}
              />
              <PrimaryButton
                label="Skip Rest"
                icon="play-skip-forward"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                  skipRest();
                }}
                style={{ flex: 1.4 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ================= END WORKOUT CONFIRMATION MODAL ================= */}
      <Modal
        visible={showEndModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEndModal(false)}
      >
        <View style={[styles.modalBackdrop, { backgroundColor: theme.scrim }]}>
          <View style={[styles.confirmSheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="alert-circle" size={48} color={theme.overTarget} style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={[styles.confirmTitle, { color: theme.text }]}>End Workout?</Text>
            <Text style={[styles.confirmDesc, { color: theme.textSecondary }]}>
              You have completed {completedSetsCount} of {totalSets} sets. Your progress will be saved and synced to your watch.
            </Text>

            <PrimaryButton
              label="Save & View Summary"
              icon="checkmark-circle"
              size="large"
              onPress={handleFinishWorkout}
              style={{ marginTop: 12 }}
            />
            <SecondaryButton
              label="Resume Training"
              onPress={() => setShowEndModal(false)}
            />
          </View>
        </View>
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
    fontWeight: '700'
  },
  disconnectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8
  },
  disconnectedText: {
    fontSize: 12,
    fontWeight: '700'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  headerRingBox: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: '800'
  },
  exerciseSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2
  },
  endButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1
  },
  endButtonText: {
    fontSize: 13,
    fontWeight: '700'
  },
  overallProgressTrack: {
    height: 4,
    width: '100%',
    overflow: 'hidden'
  },
  overallProgressFill: {
    height: '100%'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  sourcePillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1
  },
  sourceChipText: {
    fontSize: 11,
    fontWeight: '700'
  },
  simWatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1
  },
  simWatchText: {
    fontSize: 11,
    fontWeight: '700'
  },
  giantCounterCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20
  },
  targetWindowLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8
  },
  giantNumberTouch: {
    alignItems: 'center',
    paddingVertical: 8
  },
  giantNumber: {
    fontSize: 96,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2
  },
  giantSubLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: -4,
    marginBottom: 16
  },
  correctionSteppers: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 8
  },
  setsListContainer: {
    marginTop: 8
  },
  setsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8
  },
  setRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  setIndexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  setIndexText: {
    fontSize: 13,
    fontWeight: '700'
  },
  setRowSpecs: {
    fontSize: 15,
    fontWeight: '600'
  },
  setStatusLabel: {
    fontSize: 12,
    fontWeight: '600'
  },
  restOverlayContainer: {
    flex: 1
  },
  restContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingVertical: 40
  },
  restTopHeader: {
    alignItems: 'center'
  },
  restWatchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1
  },
  restWatchText: {
    fontSize: 13,
    fontWeight: '700'
  },
  nextPreviewCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center'
  },
  nextPreviewLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4
  },
  nextPreviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2
  },
  nextPreviewSet: {
    fontSize: 13
  },
  restButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  confirmSheet: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 24
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8
  },
  confirmDesc: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20
  }
});
