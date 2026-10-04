import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  RefreshControl,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, softShadow } from '../../theme';
import { useUserStore } from '../../store/userStore';
import { useNutritionStore } from '../../store/nutritionStore';
import { useWorkoutStore } from '../../store/workoutStore';
import { useDeviceStore } from '../../store/deviceStore';
import { useSettingsStore } from '../../store/settingsStore';
import {
  ProgressRing,
  StatusBadge,
  PrimaryButton,
  SecondaryButton,
  SyncStatusChip,
  SkeletonBlock,
  EmptyState,
  ErrorState
} from '../../components/ui';

export default function HomeScreen() {
  const { theme, radii } = useAppTheme();
  const { loadUser } = useUserStore();
  const { todaySummary, meals, loadNutrition, loading: nutritionLoading } = useNutritionStore();
  const { plan, loadPlanAndHistory } = useWorkoutStore();
  const { devices, loadDevices } = useDeviceStore();
  const previewState = useSettingsStore((state) => state.previewState);

  useEffect(() => {
    loadUser();
    loadNutrition();
    loadPlanAndHistory();
    loadDevices();
  }, [loadUser, loadNutrition, loadPlanAndHistory, loadDevices]);

  const watchDevice = devices.find((d) => d.type === 'watch') || devices[0];
  const connectionStatus = watchDevice ? watchDevice.connectionStatus : 'connected';

  // Derived metrics
  const caloriesLeft = Math.max(
    todaySummary.calorieTarget - todaySummary.caloriesConsumed,
    0
  );

  const nextDay = plan ? plan.days[plan.currentDayIndex] : null;

  // Formatted date
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  }, []);

  // Multi-arc progress data matching the Huawei watch dial
  const calRatio = Math.min(todaySummary.caloriesConsumed / Math.max(todaySummary.calorieTarget, 1), 1);
  const pRatio = Math.min(todaySummary.proteinConsumed / Math.max(todaySummary.proteinTarget, 1), 1);
  const cRatio = Math.min(todaySummary.carbsConsumed / Math.max(todaySummary.carbsTarget, 1), 1);
  const fRatio = Math.min(todaySummary.fatConsumed / Math.max(todaySummary.fatTarget, 1), 1);

  const ringsData = useMemo(() => [
    { value: calRatio, color: theme.calories, radius: 64, strokeWidth: 8 },
    { value: pRatio, color: theme.protein, radius: 53, strokeWidth: 4.5 },
    { value: cRatio, color: theme.carbs, radius: 44, strokeWidth: 4.5 },
    { value: fRatio, color: theme.fat, radius: 36, strokeWidth: 4.5 }
  ], [calRatio, pRatio, cRatio, fRatio, theme]);

  // 1. Loading State (Dev Preview)
  if (previewState === 'loading') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <SkeletonBlock height={14} width={120} />
          <SkeletonBlock height={32} width={180} style={{ marginBottom: 20 }} />
          <SkeletonBlock height={240} borderRadius={radii.xl} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <SkeletonBlock height={48} borderRadius={radii.full} style={{ flex: 1.2 }} />
            <SkeletonBlock height={48} borderRadius={radii.full} style={{ flex: 1 }} />
          </View>
          <SkeletonBlock height={180} borderRadius={radii.lg} style={{ marginBottom: 20 }} />
          <SkeletonBlock height={140} borderRadius={radii.lg} />
        </View>
      </SafeAreaView>
    );
  }

  // 2. Error State (Dev Preview)
  if (previewState === 'error') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ErrorState
          message="Failed to connect to local store or sync with watch telemetry."
          onRetry={() => {
            loadNutrition();
            loadPlanAndHistory();
          }}
        />
      </SafeAreaView>
    );
  }

  // 3. Empty State (Dev Preview)
  if (previewState === 'empty') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <EmptyState
          icon="fitness-outline"
          title="No Activity Yet Today"
          description="Snap your first meal or start today's workout to sync metrics with your watch."
          actionLabel="Snap a Meal"
          onAction={() => router.push('/snap-meal')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Offline banner if in offline preview mode */}
      {previewState === 'offline' ? (
        <View style={[styles.offlineBanner, { backgroundColor: theme.surfaceElevated }]}>
          <Ionicons name="cloud-offline" size={16} color={theme.textSecondary} />
          <Text style={[styles.offlineText, { color: theme.textSecondary }]}>
            Offline Mode — Changes will queue and sync when reconnected
          </Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 104 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={nutritionLoading}
            onRefresh={() => {
              loadNutrition();
              loadPlanAndHistory();
              loadDevices();
            }}
            tintColor={theme.primary}
          />
        }
      >
        {/* Header Section: Editorial Date & Greeting */}
        <View style={styles.headerRow}>
          <View style={styles.userInfoCol}>
            <View style={styles.dateBadgeRow}>
              <Ionicons name="flash-outline" size={12} color={theme.primary} />
              <Text style={[styles.dateSubtext, { color: theme.textSecondary }]}>
                {todayFormatted}
              </Text>
            </View>
            <Text style={[styles.headline, { color: theme.text }]}>
              Today
            </Text>
          </View>
          <SyncStatusChip
            status={previewState === 'offline' ? 'offline' : connectionStatus}
            onPress={() => router.push('/devices')}
          />
        </View>

        {/* HERO CARD: Kinetic Telemetry Activity Overview */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.xl,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.heroLayout}>
            {/* Multi-Ring Activity Dial */}
            <View style={styles.ringColumn}>
              <ProgressRing
                size={144}
                rings={ringsData}
                strokeWidth={8}
                icon={{ name: 'fire', color: theme.ringIcon.calories }}
                badge={todaySummary.status === 'OVER_TARGET' ? 'warning' : undefined}
                accessibilityLabel={`Calories: ${todaySummary.caloriesConsumed} of ${todaySummary.calorieTarget} kcal, ${caloriesLeft} kcal remaining`}
              />
            </View>

            {/* Glanceable Numbers */}
            <View style={styles.metricsColumn}>
              <View style={styles.primaryMetricBlock}>
                <Text style={[styles.metricKcalBig, { color: theme.text }]}>
                  {caloriesLeft.toLocaleString()}
                </Text>
                <Text style={[styles.metricKcalUnit, { color: theme.textSecondary }]}>
                  KCAL REMAINING
                </Text>
              </View>

              <View style={styles.metricSubRow}>
                <View>
                  <Text style={[styles.metricSmallNum, { color: theme.text }]}>
                    {todaySummary.caloriesConsumed}
                  </Text>
                  <Text style={[styles.metricSmallLabel, { color: theme.textMuted }]}>
                    INTAKE
                  </Text>
                </View>

                <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />

                <View>
                  <Text style={[styles.metricSmallNum, { color: theme.text }]}>
                    {todaySummary.calorieTarget}
                  </Text>
                  <Text style={[styles.metricSmallLabel, { color: theme.textMuted }]}>
                    GOAL
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 6, alignSelf: 'flex-start' }}>
                <StatusBadge status={todaySummary.status} size="small" />
              </View>
            </View>
          </View>

          {/* 3 Macro Dial Cards */}
          <View style={[styles.macroPillsRow, { borderTopColor: theme.borderSubtle }]}>
            {/* Protein */}
            <View style={[styles.macroPillCard, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
              <View style={styles.macroPillHeader}>
                <View style={[styles.macroDot, { backgroundColor: theme.protein }]} />
                <Text style={[styles.macroPillTitle, { color: theme.textSecondary }]}>PROTEIN</Text>
              </View>
              <Text style={[styles.macroPillValue, { color: theme.text }]}>
                {Math.round(todaySummary.proteinConsumed)}
                <Text style={[styles.macroPillTarget, { color: theme.textMuted }]}>/{todaySummary.proteinTarget}g</Text>
              </Text>
              <View style={[styles.macroMiniTrack, { backgroundColor: theme.track }]}>
                <View
                  style={[
                    styles.macroMiniFill,
                    {
                      width: `${Math.round(pRatio * 100)}%`,
                      backgroundColor: theme.protein,
                      borderRadius: radii.full
                    }
                  ]}
                />
              </View>
            </View>

            {/* Carbs */}
            <View style={[styles.macroPillCard, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
              <View style={styles.macroPillHeader}>
                <View style={[styles.macroDot, { backgroundColor: theme.carbs }]} />
                <Text style={[styles.macroPillTitle, { color: theme.textSecondary }]}>CARBS</Text>
              </View>
              <Text style={[styles.macroPillValue, { color: theme.text }]}>
                {Math.round(todaySummary.carbsConsumed)}
                <Text style={[styles.macroPillTarget, { color: theme.textMuted }]}>/{todaySummary.carbsTarget}g</Text>
              </Text>
              <View style={[styles.macroMiniTrack, { backgroundColor: theme.track }]}>
                <View
                  style={[
                    styles.macroMiniFill,
                    {
                      width: `${Math.round(cRatio * 100)}%`,
                      backgroundColor: theme.carbs,
                      borderRadius: radii.full
                    }
                  ]}
                />
              </View>
            </View>

            {/* Fat */}
            <View style={[styles.macroPillCard, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
              <View style={styles.macroPillHeader}>
                <View style={[styles.macroDot, { backgroundColor: theme.fat }]} />
                <Text style={[styles.macroPillTitle, { color: theme.textSecondary }]}>FAT</Text>
              </View>
              <Text style={[styles.macroPillValue, { color: theme.text }]}>
                {Math.round(todaySummary.fatConsumed)}
                <Text style={[styles.macroPillTarget, { color: theme.textMuted }]}>/{todaySummary.fatTarget}g</Text>
              </Text>
              <View style={[styles.macroMiniTrack, { backgroundColor: theme.track }]}>
                <View
                  style={[
                    styles.macroMiniFill,
                    {
                      width: `${Math.round(fRatio * 100)}%`,
                      backgroundColor: theme.fat,
                      borderRadius: radii.full
                    }
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* ACTIVITY VITALS GLANCE ROW */}
        <View style={styles.vitalsRow}>
          <View style={[styles.vitalCard, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }]}>
            <View style={styles.vitalHeader}>
              <Ionicons name="footsteps" size={14} color={theme.primary} />
              <Text style={[styles.vitalLabel, { color: theme.textSecondary }]}>STEPS</Text>
            </View>
            <Text style={[styles.vitalValue, { color: theme.text }]}>8,420</Text>
            <Text style={[styles.vitalTarget, { color: theme.textMuted }]}>Goal: 10,000</Text>
          </View>

          <View style={[styles.vitalCard, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }]}>
            <View style={styles.vitalHeader}>
              <Ionicons name="flame" size={14} color={theme.calories} />
              <Text style={[styles.vitalLabel, { color: theme.textSecondary }]}>ACTIVE</Text>
            </View>
            <Text style={[styles.vitalValue, { color: theme.text }]}>540</Text>
            <Text style={[styles.vitalTarget, { color: theme.textMuted }]}>kcal burn</Text>
          </View>

          <View style={[styles.vitalCard, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }]}>
            <View style={styles.vitalHeader}>
              <Ionicons name="heart" size={14} color={theme.fat} />
              <Text style={[styles.vitalLabel, { color: theme.textSecondary }]}>HEART</Text>
            </View>
            <Text style={[styles.vitalValue, { color: theme.text }]}>71</Text>
            <Text style={[styles.vitalTarget, { color: theme.textMuted }]}>bpm rest</Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.actionRow}>
          <PrimaryButton
            label="Snap Meal"
            icon="camera"
            size="large"
            onPress={() => router.push('/snap-meal')}
            style={styles.snapButton}
          />
          <SecondaryButton
            label="Start Workout"
            icon="barbell"
            size="large"
            onPress={() => router.push('/active-workout')}
            style={styles.workoutButton}
          />
        </View>

        {/* SECTION: TODAY'S WORKOUT */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {"TODAY'S WORKOUT"}
          </Text>
          <Pressable onPress={() => router.push('/(tabs)/train')}>
            <Text style={[styles.sectionLinkText, { color: theme.primary }]}>Plan Details</Text>
          </Pressable>
        </View>

        {nextDay ? (
          <View
            style={[
              styles.workoutHeroCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: radii.xl,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
          >
            <View style={styles.workoutCardTop}>
              <View style={{ flex: 1 }}>
                <View style={styles.workoutTagRow}>
                  <View style={[styles.workoutBadge, { backgroundColor: theme.onTrackBg }]}>
                    <Text style={[styles.workoutDayTag, { color: theme.primary }]}>
                      DAY {nextDay.dayNumber}
                    </Text>
                  </View>
                  <Text style={[styles.workoutMeta, { color: theme.textSecondary }]}>
                    {nextDay.estimatedDurationMin} min • {nextDay.exercises.length} exercises
                  </Text>
                </View>
                <Text style={[styles.workoutMainTitle, { color: theme.text }]} numberOfLines={1}>
                  {nextDay.title}
                </Text>
              </View>

              <View style={styles.workoutProgressCircle}>
                <ProgressRing
                  size={52}
                  strokeWidth={4.5}
                  progress={0}
                  color={theme.primary}
                  icon={{ name: 'dumbbell', color: theme.ringIcon.workout }}
                  accessibilityLabel="Today's workout progress: 0%"
                />
              </View>
            </View>

            {/* Exercise preview checklist */}
            <View style={[styles.exerciseList, { borderTopColor: theme.borderSubtle }]}>
              {nextDay.exercises.slice(0, 3).map((pe) => (
                <View key={pe.id} style={styles.exercisePreviewRow}>
                  <View style={[styles.exerciseBullet, { backgroundColor: theme.primary }]} />
                  <Text style={[styles.exerciseName, { color: theme.text }]} numberOfLines={1}>
                    {pe.exerciseId.replace('ex_', '').replace(/_/g, ' ')}
                  </Text>
                  <Text style={[styles.exerciseSetsText, { color: theme.textSecondary }]}>
                    {pe.sets} × {pe.repRange.min}-{pe.repRange.max} reps
                  </Text>
                </View>
              ))}
            </View>

            <PrimaryButton
              label="Begin Workout"
              icon="play"
              onPress={() => router.push('/active-workout')}
              style={{ marginTop: 14 }}
            />
          </View>
        ) : (
          <View style={[styles.emptyWorkoutCard, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.xl }]}>
            <EmptyState
              icon="barbell-outline"
              title="No Active Routine"
              description="Generate your personalized split based on your profile."
              actionLabel="Build Routine"
              onAction={() => router.push('/(tabs)/train')}
            />
          </View>
        )}

        {/* SECTION: TODAY'S LOGGED MEALS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {"TODAY'S FUEL"}
          </Text>
          <Pressable onPress={() => router.push('/(tabs)/nutrition')}>
            <Text style={[styles.sectionLinkText, { color: theme.primary }]}>See All</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.mealsListCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.xl,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          {meals.length === 0 ? (
            <Text style={[styles.noMealsText, { color: theme.textSecondary }]}>
              No meals logged today. Photograph your plate to auto-calculate nutrition.
            </Text>
          ) : (
            meals.slice(0, 3).map((meal, index) => (
              <View
                key={meal.id}
                style={[
                  styles.mealRowItem,
                  index > 0 ? { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.borderSubtle } : null
                ]}
              >
                <View style={[styles.mealIconBox, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
                  <Ionicons
                    name={
                      meal.type === 'breakfast'
                        ? 'sunny'
                        : meal.type === 'lunch'
                        ? 'restaurant'
                        : meal.type === 'dinner'
                        ? 'moon'
                        : 'cafe'
                    }
                    size={16}
                    color={theme.primary}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.mealItemType, { color: theme.text }]}>
                    {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} • {meal.time}
                  </Text>
                  <Text style={[styles.mealSummaryNames, { color: theme.textSecondary }]} numberOfLines={1}>
                    {meal.items.map((i) => i.name).join(', ')}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.mealKcalTotal, { color: theme.text }]}>
                    {meal.totalCalories} kcal
                  </Text>
                  <Text style={[styles.mealProteinGram, { color: theme.protein }]}>
                    {Math.round(meal.totalProtein)}g P
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 16
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '600'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16
  },
  userInfoCol: {
    flex: 1
  },
  dateBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4
  },
  dateSubtext: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8
  },
  heroCard: {
    borderWidth: 1,
    padding: 18,
    marginBottom: 16
  },
  heroLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ringColumn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricsColumn: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center'
  },
  primaryMetricBlock: {
    marginBottom: 8
  },
  metricKcalBig: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    fontVariant: ['tabular-nums']
  },
  metricKcalUnit: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 2
  },
  metricSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 6
  },
  metricSmallNum: {
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  metricSmallLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 1
  },
  metricDivider: {
    width: 1,
    height: 18
  },
  macroPillsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 16,
    paddingTop: 14
  },
  macroPillCard: {
    flex: 1,
    padding: 10
  },
  macroPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  macroPillTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  macroPillValue: {
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  macroPillTarget: {
    fontSize: 10,
    fontWeight: '500'
  },
  macroMiniTrack: {
    height: 3,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden'
  },
  macroMiniFill: {
    height: '100%'
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  vitalCard: {
    flex: 1,
    borderWidth: 1,
    padding: 12
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6
  },
  vitalLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  vitalTarget: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  snapButton: {
    flex: 1.2
  },
  workoutButton: {
    flex: 1
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 4,
    marginRight: 4
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  sectionLinkText: {
    fontSize: 12,
    fontWeight: '700'
  },
  workoutHeroCard: {
    borderWidth: 1,
    padding: 18,
    marginBottom: 20
  },
  emptyWorkoutCard: {
    borderWidth: 1,
    padding: 20,
    marginBottom: 20
  },
  workoutCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  workoutTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  workoutBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  workoutDayTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  workoutMeta: {
    fontSize: 11,
    fontWeight: '600'
  },
  workoutMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  workoutProgressCircle: {
    marginLeft: 12
  },
  exerciseList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
    gap: 8
  },
  exercisePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  exerciseBullet: {
    width: 4,
    height: 4,
    borderRadius: 2
  },
  exerciseName: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
    flex: 1
  },
  exerciseSetsText: {
    fontSize: 12,
    fontWeight: '500'
  },
  mealsListCard: {
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 16
  },
  noMealsText: {
    fontSize: 13,
    paddingVertical: 20,
    textAlign: 'center'
  },
  mealRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12
  },
  mealIconBox: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mealItemType: {
    fontSize: 14,
    fontWeight: '700'
  },
  mealSummaryNames: {
    fontSize: 12,
    marginTop: 2
  },
  mealKcalTotal: {
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  mealProteinGram: {
    fontSize: 11,
    fontWeight: '600'
  }
});
