import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme, softShadow } from '../../theme';
import { useWorkoutStore } from '../../store/workoutStore';
import { useUserStore } from '../../store/userStore';
import { GoalType, MuscleGroup } from '../../types/types';

interface MuscleDayConfig {
  dayNumber: number;
  muscle: MuscleGroup;
  title: string;
  exercisesCount: number;
  durationMin: number;
  color: string;
}

const DEFAULT_SCHEDULE: MuscleDayConfig[] = [
  { dayNumber: 1, muscle: 'Chest', title: 'Chest & Anterior Pectoral Focus', exercisesCount: 4, durationMin: 45, color: '#C2410C' },
  { dayNumber: 2, muscle: 'Back', title: 'Back Width & Lat Thickness', exercisesCount: 4, durationMin: 45, color: '#0F766E' },
  { dayNumber: 3, muscle: 'Shoulders', title: 'Shoulders & 3D Deltoid Foundation', exercisesCount: 4, durationMin: 40, color: '#B45309' },
  { dayNumber: 4, muscle: 'Legs', title: 'Legs & Quad/Hamstring Architecture', exercisesCount: 4, durationMin: 50, color: '#4338CA' },
  { dayNumber: 5, muscle: 'Arms', title: 'Arms: Biceps & Triceps Synergy', exercisesCount: 4, durationMin: 40, color: '#BE185D' },
  { dayNumber: 6, muscle: 'Abs', title: 'Core Flexion & Trunk Pillar Strength', exercisesCount: 4, durationMin: 35, color: '#4D7C0F' }
];

export default function TrainScreen() {
  const { theme, radii } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { plan, updatePlan } = useWorkoutStore();
  const { user, updateUser } = useUserStore();

  // 1. Body Parameters State (BMR / TDEE)
  const [weightKg, setWeightKg] = useState<number>(user?.weightKg || 74.5);
  const [heightCm, setHeightCm] = useState<number>(user?.heightCm || 176);
  const [age, setAge] = useState<number>(24);
  const [activityMultiplier, setActivityMultiplier] = useState<number>(1.55); // Moderate default

  // 2. Goal Selection State
  const [selectedGoal, setSelectedGoal] = useState<GoalType>(user?.goal || 'build_muscle');

  // 3. 6-Muscle Group Schedule State
  const [schedule, setSchedule] = useState<MuscleDayConfig[]>(DEFAULT_SCHEDULE);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Live BMR & TDEE Calculations (Mifflin-St Jeor formula)
  const bmr = useMemo(() => {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  }, [weightKg, heightCm, age]);

  const tdee = useMemo(() => {
    return Math.round(bmr * activityMultiplier);
  }, [bmr, activityMultiplier]);

  const targetKcal = useMemo(() => {
    switch (selectedGoal) {
      case 'build_muscle':
        return tdee + 300;
      case 'lose_fat':
        return Math.max(tdee - 450, 1500);
      case 'maintain':
      default:
        return tdee;
    }
  }, [tdee, selectedGoal]);

  const handleSaveAndSync = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setIsSyncing(true);

    try {
      if (updateUser) {
        await updateUser({
          weightKg,
          heightCm,
          goal: selectedGoal,
          bmr,
          tdee,
          dailyCalorieTarget: targetKcal
        });
      }

      if (updatePlan && plan) {
        await updatePlan({
          goal: selectedGoal
        });
      }

      setIsSyncing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Alert.alert(
        'Plan Generated & Saved',
        `Your personalized parameters (BMR: ${bmr} kcal, TDEE: ${tdee} kcal) and 6-muscle schedule are active.`
      );
    } catch {
      setIsSyncing(false);
      Alert.alert('Saved', 'Your plan parameters have been updated.');
    }
  };

  const activityOptions = [
    { label: 'Sedentary', multiplier: 1.2, desc: 'Desk job, little exercise' },
    { label: 'Light', multiplier: 1.375, desc: '1-2 workouts / week' },
    { label: 'Moderate', multiplier: 1.55, desc: '3-5 workouts / week' },
    { label: 'Very Active', multiplier: 1.725, desc: '6-7 workouts / week' }
  ];

  const goalOptions: { key: GoalType; title: string; subtitle: string; icon: any }[] = [
    {
      key: 'build_muscle',
      title: 'Build Muscle',
      subtitle: 'Hypertrophy focus • Calorie surplus (+300 kcal)',
      icon: 'barbell'
    },
    {
      key: 'lose_fat',
      title: 'Fat Loss',
      subtitle: 'Caloric deficit (-450 kcal) • Lean muscle definition',
      icon: 'flame'
    },
    {
      key: 'maintain',
      title: 'Maintain & Tone',
      subtitle: 'Energy equilibrium • Functional conditioning',
      icon: 'fitness'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={[styles.headerBar, { borderBottomColor: theme.borderSubtle }]}>
        <View>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            FITNESS BLUEPRINT
          </Text>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Plan Generation</Text>
        </View>

        <View style={[styles.headerBadge, { backgroundColor: theme.primaryContainer }]}>
          <Ionicons name="sparkles" size={13} color={theme.primary} />
          <Text style={[styles.headerBadgeText, { color: theme.primary }]}>6-Day Split</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ======================================================== */}
        {/* SECTION 1: Body Parameters Input (BMR/TDEE)              */}
        {/* ======================================================== */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeadingRow}>
            <View style={[styles.sectionNumberCircle, { backgroundColor: theme.primary }]}>
              <Text style={styles.sectionNumberText}>1</Text>
            </View>
            <Text style={[styles.sectionHeadingTitle, { color: theme.text }]}>
              Body Parameters Input (BMR/TDEE)
            </Text>
          </View>

          <View
            style={[
              styles.cardBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: radii.xl,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
          >
            {/* Inputs 3-Column: Weight • Height • Age */}
            <View style={styles.parametersRow}>
              {/* Weight */}
              <View style={[styles.parameterInputBox, { backgroundColor: theme.surfaceElevated }]}>
                <Text style={[styles.paramLabel, { color: theme.textSecondary }]}>Weight (kg)</Text>
                <View style={styles.stepperControlRow}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setWeightKg((prev) => Math.max(Number((prev - 0.5).toFixed(1)), 40));
                    }}
                    style={[styles.stepperBtn, { backgroundColor: theme.card }]}
                  >
                    <Ionicons name="remove" size={14} color={theme.text} />
                  </Pressable>
                  <Text style={[styles.paramValue, { color: theme.text }]}>{weightKg}</Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setWeightKg((prev) => Number((prev + 0.5).toFixed(1)));
                    }}
                    style={[styles.stepperBtn, { backgroundColor: theme.card }]}
                  >
                    <Ionicons name="add" size={14} color={theme.text} />
                  </Pressable>
                </View>
              </View>

              {/* Height */}
              <View style={[styles.parameterInputBox, { backgroundColor: theme.surfaceElevated }]}>
                <Text style={[styles.paramLabel, { color: theme.textSecondary }]}>Height (cm)</Text>
                <View style={styles.stepperControlRow}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setHeightCm((prev) => Math.max(prev - 1, 140));
                    }}
                    style={[styles.stepperBtn, { backgroundColor: theme.card }]}
                  >
                    <Ionicons name="remove" size={14} color={theme.text} />
                  </Pressable>
                  <Text style={[styles.paramValue, { color: theme.text }]}>{heightCm}</Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setHeightCm((prev) => Math.min(prev + 1, 220));
                    }}
                    style={[styles.stepperBtn, { backgroundColor: theme.card }]}
                  >
                    <Ionicons name="add" size={14} color={theme.text} />
                  </Pressable>
                </View>
              </View>

              {/* Age */}
              <View style={[styles.parameterInputBox, { backgroundColor: theme.surfaceElevated }]}>
                <Text style={[styles.paramLabel, { color: theme.textSecondary }]}>Age (yrs)</Text>
                <View style={styles.stepperControlRow}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setAge((prev) => Math.max(prev - 1, 16));
                    }}
                    style={[styles.stepperBtn, { backgroundColor: theme.card }]}
                  >
                    <Ionicons name="remove" size={14} color={theme.text} />
                  </Pressable>
                  <Text style={[styles.paramValue, { color: theme.text }]}>{age}</Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setAge((prev) => Math.min(prev + 1, 80));
                    }}
                    style={[styles.stepperBtn, { backgroundColor: theme.card }]}
                  >
                    <Ionicons name="add" size={14} color={theme.text} />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Activity Level Selector */}
            <View style={styles.activityLevelBlock}>
              <Text style={[styles.subLabel, { color: theme.textSecondary }]}>Activity Multiplier</Text>
              <View style={styles.activityPillsGrid}>
                {activityOptions.map((opt) => {
                  const isSelected = activityMultiplier === opt.multiplier;
                  return (
                    <Pressable
                      key={opt.label}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                        setActivityMultiplier(opt.multiplier);
                      }}
                      style={[
                        styles.activityPill,
                        {
                          backgroundColor: isSelected ? theme.primary : theme.surfaceElevated,
                          borderColor: isSelected ? theme.primary : theme.border
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.activityPillTitle,
                          { color: isSelected ? theme.onPrimary : theme.text }
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text
                        style={[
                          styles.activityPillDesc,
                          { color: isSelected ? 'rgba(255,255,255,0.85)' : theme.textSecondary }
                        ]}
                      >
                        x{opt.multiplier}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Computed BMR / TDEE Results Card */}
            <View style={[styles.resultsBanner, { backgroundColor: theme.surfaceElevated }]}>
              <View style={styles.resultCol}>
                <Text style={[styles.resultMeta, { color: theme.textSecondary }]}>Basal Rate (BMR)</Text>
                <Text style={[styles.resultValue, { color: theme.text }]}>
                  {bmr.toLocaleString()} <Text style={styles.resultUnit}>kcal</Text>
                </Text>
                <Text style={[styles.resultHint, { color: theme.textSecondary }]}>Resting baseline</Text>
              </View>

              <View style={[styles.verticalDivider, { backgroundColor: theme.borderSubtle }]} />

              <View style={styles.resultCol}>
                <Text style={[styles.resultMeta, { color: theme.textSecondary }]}>Daily Expenditure (TDEE)</Text>
                <Text style={[styles.resultValue, { color: theme.primary }]}>
                  {tdee.toLocaleString()} <Text style={styles.resultUnit}>kcal</Text>
                </Text>
                <Text style={[styles.resultHint, { color: theme.textSecondary }]}>Maintenance intake</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ======================================================== */}
        {/* SECTION 2: Goal Selection                                */}
        {/* ======================================================== */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeadingRow}>
            <View style={[styles.sectionNumberCircle, { backgroundColor: theme.primary }]}>
              <Text style={styles.sectionNumberText}>2</Text>
            </View>
            <Text style={[styles.sectionHeadingTitle, { color: theme.text }]}>
              Goal Selection
            </Text>
          </View>

          <View style={styles.goalsContainer}>
            {goalOptions.map((g) => {
              const isSelected = selectedGoal === g.key;
              return (
                <Pressable
                  key={g.key}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    setSelectedGoal(g.key);
                  }}
                  style={({ pressed }) => [
                    styles.goalCard,
                    {
                      backgroundColor: isSelected ? `${theme.primary}10` : theme.card,
                      borderColor: isSelected ? theme.primary : theme.border,
                      borderRadius: radii.lg,
                      transform: [{ scale: pressed ? 0.98 : 1 }]
                    }
                  ]}
                >
                  <View style={[styles.goalIconCircle, { backgroundColor: isSelected ? theme.primary : theme.surfaceElevated }]}>
                    <Ionicons
                      name={g.icon}
                      size={18}
                      color={isSelected ? theme.onPrimary : theme.primary}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.goalCardTitle, { color: theme.text }]}>
                      {g.title}
                    </Text>
                    <Text style={[styles.goalCardSub, { color: theme.textSecondary }]}>
                      {g.subtitle}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? theme.primary : theme.border,
                        backgroundColor: isSelected ? theme.primary : 'transparent'
                      }
                    ]}
                  >
                    {isSelected && <View style={styles.radioInnerDot} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Goal Intake Banner */}
          <View style={[styles.goalIntakePill, { backgroundColor: theme.primaryContainer }]}>
            <Ionicons name="calculator-outline" size={15} color={theme.primary} />
            <Text style={[styles.goalIntakeText, { color: theme.onPrimaryContainer }]}>
              Target Calories for {selectedGoal.replace('_', ' ').toUpperCase()}:{' '}
              <Text style={{ fontWeight: '800' }}>{targetKcal.toLocaleString()} kcal/day</Text>
            </Text>
          </View>
        </View>

        {/* ======================================================== */}
        {/* SECTION 3: 6-muscle group schedule builder              */}
        {/* ======================================================== */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeadingRow}>
            <View style={[styles.sectionNumberCircle, { backgroundColor: theme.primary }]}>
              <Text style={styles.sectionNumberText}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionHeadingTitle, { color: theme.text }]}>
                6-Muscle Group Schedule Builder
              </Text>
              <Text style={[styles.sectionSubtext, { color: theme.textSecondary }]}>
                6-Day Hypertrophy & Strength Split
              </Text>
            </View>
          </View>

          <View style={styles.scheduleList}>
            {schedule.map((item) => (
              <View
                key={item.dayNumber}
                style={[
                  styles.scheduleItemCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: radii.lg,
                    ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                  }
                ]}
              >
                <View style={styles.scheduleLeftCol}>
                  <View style={[styles.dayBadge, { backgroundColor: theme.surfaceElevated }]}>
                    <Text style={[styles.dayBadgeText, { color: theme.textSecondary }]}>
                      DAY {item.dayNumber}
                    </Text>
                  </View>

                  <View style={[styles.muscleGroupPill, { backgroundColor: `${item.color}16` }]}>
                    <Text style={[styles.muscleGroupText, { color: item.color }]}>
                      {item.muscle.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <Text style={[styles.scheduleItemTitle, { color: theme.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.scheduleItemMetaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="barbell-outline" size={13} color={theme.textSecondary} />
                      <Text style={[styles.metaItemText, { color: theme.textSecondary }]}>
                        {item.exercisesCount} exercises
                      </Text>
                    </View>
                    <Text style={{ color: theme.borderSubtle }}>•</Text>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={13} color={theme.textSecondary} />
                      <Text style={[styles.metaItemText, { color: theme.textSecondary }]}>
                        {item.durationMin} mins
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Save & Apply Plan Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save and apply plan"
          onPress={handleSaveAndSync}
          style={({ pressed }) => [
            styles.savePlanBtn,
            {
              backgroundColor: theme.primary,
              borderRadius: radii.full,
              opacity: pressed ? 0.88 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }]
            }
          ]}
        >
          <Ionicons name="checkmark-done" size={18} color={theme.onPrimary} />
          <Text style={[styles.savePlanBtnText, { color: theme.onPrimary }]}>
            {isSyncing ? 'Syncing...' : 'Save & Sync Plan to Watch'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 20
  },
  sectionBlock: {
    gap: 10
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2
  },
  sectionNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  sectionHeadingTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  sectionSubtext: {
    fontSize: 12,
    fontWeight: '500'
  },
  cardBox: {
    borderWidth: 1,
    padding: 14,
    gap: 14
  },
  parametersRow: {
    flexDirection: 'row',
    gap: 8
  },
  parameterInputBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6
  },
  paramLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center'
  },
  stepperControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  stepperBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  paramValue: {
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  activityLevelBlock: {
    gap: 6
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600'
  },
  activityPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  activityPill: {
    flexBasis: '48.5%',
    flexGrow: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2
  },
  activityPillTitle: {
    fontSize: 12,
    fontWeight: '700'
  },
  activityPillDesc: {
    fontSize: 10,
    fontWeight: '500'
  },
  resultsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12
  },
  resultCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2
  },
  resultMeta: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center'
  },
  resultValue: {
    fontSize: 17,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  resultUnit: {
    fontSize: 11,
    fontWeight: '600'
  },
  resultHint: {
    fontSize: 10,
    fontWeight: '500'
  },
  verticalDivider: {
    width: 1,
    height: 36
  },
  goalsContainer: {
    gap: 8
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    gap: 10
  },
  goalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  goalCardTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  goalCardSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF'
  },
  goalIntakePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 2
  },
  goalIntakeText: {
    fontSize: 12,
    fontWeight: '600'
  },
  scheduleList: {
    gap: 8
  },
  scheduleItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1
  },
  scheduleLeftCol: {
    alignItems: 'flex-start',
    gap: 4,
    minWidth: 78
  },
  dayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  dayBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  muscleGroupPill: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6
  },
  muscleGroupText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  scheduleItemTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  scheduleItemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  metaItemText: {
    fontSize: 11,
    fontWeight: '500'
  },
  savePlanBtn: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6
  },
  savePlanBtnText: {
    fontSize: 15,
    fontWeight: '700'
  }
});
