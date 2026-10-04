import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  RefreshControl,
  Platform,
  Image
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
  SyncStatusChip,
  SkeletonBlock,
  EmptyState,
  ErrorState,
  BrandLogo
} from '../../components/ui';

export default function HomeScreen() {
  const { theme, radii } = useAppTheme();
  const { user, loadUser } = useUserStore();
  const { todaySummary, meals, loadNutrition, loading: nutritionLoading } = useNutritionStore();
  const { plan, loadPlanAndHistory } = useWorkoutStore();
  const { devices, loadDevices } = useDeviceStore();
  const previewState = useSettingsStore((state) => state.previewState);
  const [waterMl, setWaterMl] = useState(1800);

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
  const remainingPct = Math.round(
    (caloriesLeft / Math.max(todaySummary.calorieTarget, 1)) * 100
  );

  const nextDay = plan ? plan.days[plan.currentDayIndex] : null;

  // Multi-arc progress data matching the Huawei watch dial
  const calRatio = Math.min(todaySummary.caloriesConsumed / Math.max(todaySummary.calorieTarget, 1), 1);
  const pRatio = Math.min(todaySummary.proteinConsumed / Math.max(todaySummary.proteinTarget, 1), 1);
  const cRatio = Math.min(todaySummary.carbsConsumed / Math.max(todaySummary.carbsTarget, 1), 1);
  const fRatio = Math.min(todaySummary.fatConsumed / Math.max(todaySummary.fatTarget, 1), 1);

  // 1. Loading State
  if (previewState === 'loading') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <SkeletonBlock height={14} width={120} />
          <SkeletonBlock height={32} width={180} style={{ marginBottom: 20 }} />
          <SkeletonBlock height={240} borderRadius={radii.xl} style={{ marginBottom: 16 }} />
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <SkeletonBlock height={48} borderRadius={radii.md} style={{ flex: 1 }} />
            <SkeletonBlock height={48} borderRadius={radii.md} style={{ flex: 1 }} />
          </View>
          <SkeletonBlock height={180} borderRadius={radii.lg} style={{ marginBottom: 20 }} />
          <SkeletonBlock height={140} borderRadius={radii.lg} />
        </View>
      </SafeAreaView>
    );
  }

  // 2. Error State
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

  // 3. Empty State
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

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 110 }]}
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
        {/* Top Greeting & Target Summary */}
        <View style={styles.greetingSection}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greetingHeadline, { color: theme.text }]}>
              Good morning, {user?.fullName || 'Alex'} 👋
            </Text>
            <View style={styles.targetSubRow}>
              <Text style={[styles.targetHighlight, { color: theme.primary }]}>
                Target: {todaySummary.calorieTarget.toLocaleString()} kcal
              </Text>
              <View style={[styles.subDot, { backgroundColor: theme.border }]} />
              <Text style={[styles.subMeta, { color: theme.textSecondary }]}>
                {nextDay ? nextDay.title : 'Pull day'}
              </Text>
            </View>
          </View>

          <SyncStatusChip
            status={previewState === 'offline' ? 'offline' : connectionStatus}
            onPress={() => router.push('/devices')}
          />
        </View>

        {/* HERO CALORIE RING CARD */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.isDark ? '#12332E' : '#00796B',
              borderRadius: radii.xl
            }
          ]}
        >
          <View style={styles.heroHeader}>
            <Text style={styles.heroSubHeader}>DAILY FUELING</Text>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>{remainingPct}% Remaining</Text>
            </View>
          </View>

          {/* Radial Calorie Gauge */}
          <View style={styles.gaugeContainer}>
            <ProgressRing
              size={172}
              strokeWidth={14}
              progress={calRatio}
              color="#FF8A5B"
              icon={{ name: 'fire', color: '#FF8A5B' }}
              accessibilityLabel={`Calories: ${todaySummary.caloriesConsumed} of ${todaySummary.calorieTarget} kcal, ${caloriesLeft} kcal remaining`}
            >
              <View style={styles.gaugeCenter}>
                <Text style={styles.gaugeOverline}>REMAINING</Text>
                <Text style={styles.gaugeMainNumber}>{caloriesLeft.toLocaleString()}</Text>
                <Text style={styles.gaugeUnit}>kcal left</Text>
              </View>
            </ProgressRing>
          </View>

          {/* Hero Sub-Stats Split Pill */}
          <View style={styles.heroSplitPill}>
            <View style={styles.splitPillItem}>
              <Text style={styles.splitPillLabel}>Consumed</Text>
              <Text style={styles.splitPillValue}>
                {todaySummary.caloriesConsumed} <Text style={styles.splitPillUnit}>kcal</Text>
              </Text>
            </View>
            <View style={styles.splitPillDivider} />
            <View style={styles.splitPillItem}>
              <Text style={styles.splitPillLabel}>Daily Goal</Text>
              <Text style={styles.splitPillValue}>
                {todaySummary.calorieTarget} <Text style={styles.splitPillUnit}>kcal</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* MACRO NUTRIENTS BREAKDOWN CARD */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.lg,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderTitleGroup}>
              <Ionicons name="pie-chart" size={18} color={theme.primary} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Macros Remaining</Text>
            </View>
            <Text style={[styles.cardMetaTag, { color: theme.textSecondary }]}>Auto-balanced</Text>
          </View>

          {/* Protein Bar */}
          <View style={styles.macroRow}>
            <View style={styles.macroHeader}>
              <View style={styles.macroLabelGroup}>
                <View style={[styles.macroDotBadge, { backgroundColor: theme.protein }]} />
                <Text style={[styles.macroName, { color: theme.text }]}>Protein</Text>
                <View style={[styles.macroStatusPill, { backgroundColor: `${theme.protein}18` }]}>
                  <Text style={[styles.macroStatusPillText, { color: theme.protein }]}>
                    {Math.max(0, todaySummary.proteinTarget - todaySummary.proteinConsumed)}g to goal
                  </Text>
                </View>
              </View>
              <Text style={[styles.macroValue, { color: theme.text }]}>
                {Math.round(todaySummary.proteinConsumed)}g{' '}
                <Text style={{ color: theme.textSecondary, fontWeight: '400' }}>
                  / {todaySummary.proteinTarget}g
                </Text>
              </Text>
            </View>
            <View style={[styles.macroTrack, { backgroundColor: theme.surfaceElevated }]}>
              <View
                style={[
                  styles.macroFill,
                  {
                    width: `${Math.round(pRatio * 100)}%`,
                    backgroundColor: theme.protein,
                    borderRadius: radii.full
                  }
                ]}
              />
            </View>
          </View>

          {/* Carbs Bar */}
          <View style={styles.macroRow}>
            <View style={styles.macroHeader}>
              <View style={styles.macroLabelGroup}>
                <View style={[styles.macroDotBadge, { backgroundColor: theme.carbs }]} />
                <Text style={[styles.macroName, { color: theme.text }]}>Carbs</Text>
              </View>
              <Text style={[styles.macroValue, { color: theme.text }]}>
                {Math.round(todaySummary.carbsConsumed)}g{' '}
                <Text style={{ color: theme.textSecondary, fontWeight: '400' }}>
                  / {todaySummary.carbsTarget}g
                </Text>
              </Text>
            </View>
            <View style={[styles.macroTrack, { backgroundColor: theme.surfaceElevated }]}>
              <View
                style={[
                  styles.macroFill,
                  {
                    width: `${Math.round(cRatio * 100)}%`,
                    backgroundColor: theme.carbs,
                    borderRadius: radii.full
                  }
                ]}
              />
            </View>
          </View>

          {/* Fat Bar */}
          <View style={styles.macroRow}>
            <View style={styles.macroHeader}>
              <View style={styles.macroLabelGroup}>
                <View style={[styles.macroDotBadge, { backgroundColor: theme.fat }]} />
                <Text style={[styles.macroName, { color: theme.text }]}>Fat</Text>
              </View>
              <Text style={[styles.macroValue, { color: theme.text }]}>
                {Math.round(todaySummary.fatConsumed)}g{' '}
                <Text style={{ color: theme.textSecondary, fontWeight: '400' }}>
                  / {todaySummary.fatTarget}g
                </Text>
              </Text>
            </View>
            <View style={[styles.macroTrack, { backgroundColor: theme.surfaceElevated }]}>
              <View
                style={[
                  styles.macroFill,
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

        {/* TODAY'S WORKOUT FOCUS CARD */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.lg,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.workoutTopRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.workoutBadgeRow}>
                <View style={[styles.musclePill, { backgroundColor: `${theme.primary}18` }]}>
                  <Text style={[styles.musclePillText, { color: theme.primary }]}>
                    BACK & BICEPS
                  </Text>
                </View>
                <Text style={[styles.scheduledText, { color: theme.textSecondary }]}>
                  Scheduled for 17:30
                </Text>
              </View>

              <Text style={[styles.workoutTitle, { color: theme.text }]} numberOfLines={1}>
                {nextDay ? nextDay.title : 'Pull Hypertrophy Routine'}
              </Text>

              <View style={styles.workoutMetaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="barbell-outline" size={15} color={theme.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {nextDay ? nextDay.exercises.length : 4} exercises
                  </Text>
                </View>
                <Text style={{ color: theme.borderSubtle }}>•</Text>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={15} color={theme.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {nextDay ? nextDay.estimatedDurationMin : 45} mins
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.workoutCircleIcon, { backgroundColor: theme.primaryContainer }]}>
              <Ionicons name="repeat" size={22} color={theme.primary} />
            </View>
          </View>

          {/* Action Controls: Dual Phone + Watch */}
          <View style={styles.workoutActionsGrid}>
            <Pressable
              onPress={() => router.push('/active-workout')}
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: theme.primary,
                  borderRadius: radii.md,
                  opacity: pressed ? 0.88 : 1
                }
              ]}
            >
              <Ionicons name="watch-outline" size={18} color={theme.onPrimary} />
              <Text style={[styles.actionBtnText, { color: theme.onPrimary }]}>
                Start on Watch
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/active-workout')}
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                  borderRadius: radii.md,
                  opacity: pressed ? 0.88 : 1
                }
              ]}
            >
              <Ionicons name="phone-portrait-outline" size={18} color={theme.text} />
              <Text style={[styles.actionBtnText, { color: theme.text }]}>
                Start on Phone
              </Text>
            </Pressable>
          </View>
        </View>

        {/* TODAY'S MEALS CAROUSEL */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleGroup}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{"Today's Meals"}</Text>
            <View style={[styles.countBadge, { backgroundColor: theme.surfaceElevated }]}>
              <Text style={[styles.countBadgeText, { color: theme.textSecondary }]}>
                {meals.length} logged
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/snap-meal')}
            style={styles.addMealLink}
          >
            <Ionicons name="add-circle" size={18} color={theme.primary} />
            <Text style={[styles.addMealLinkText, { color: theme.primary }]}>Log meal</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mealCarouselContainer}
        >
          {meals.length === 0 ? (
            <Pressable
              onPress={() => router.push('/snap-meal')}
              style={[
                styles.emptyMealCard,
                { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }
              ]}
            >
              <Ionicons name="camera-outline" size={28} color={theme.primary} />
              <Text style={[styles.emptyMealTitle, { color: theme.text }]}>Snap your first meal</Text>
              <Text style={[styles.emptyMealSub, { color: theme.textSecondary }]}>
                Tap to auto-calculate nutrition
              </Text>
            </Pressable>
          ) : (
            meals.map((meal) => (
              <Pressable
                key={meal.id}
                onPress={() => router.push('/snap-meal')}
                style={[
                  styles.mealCardItem,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: radii.lg,
                    ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                  }
                ]}
              >
                <View style={[styles.mealPhotoBox, { backgroundColor: theme.surfaceElevated }]}>
                  {meal.imageUrl ? (
                    <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
                  ) : (
                    <Ionicons name="restaurant-outline" size={32} color={theme.primary} />
                  )}
                  <View style={[styles.mealTypeTag, { backgroundColor: `${theme.card}EE` }]}>
                    <Text style={[styles.mealTypeTagText, { color: theme.text }]}>
                      {meal.type.toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.mealTimeTag, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.mealTimeTagText, { color: theme.onPrimary }]}>
                      {meal.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.mealCardBody}>
                  <Text style={[styles.mealCardName, { color: theme.text }]} numberOfLines={1}>
                    {meal.items[0]?.name || 'Logged Meal'}
                  </Text>
                  <Text style={[styles.mealCardMacros, { color: theme.textSecondary }]}>
                    {meal.totalCalories} kcal •{' '}
                    <Text style={{ color: theme.protein, fontWeight: '700' }}>
                      {meal.totalProtein}g Protein
                    </Text>
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* QUICK HEALTH COACH TIP / HYDRATION */}
        <View
          style={[
            styles.hydrationCard,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: theme.border,
              borderRadius: radii.lg
            }
          ]}
        >
          <View style={[styles.hydrationIconCircle, { backgroundColor: `${theme.primary}18` }]}>
            <Ionicons name="water" size={22} color={theme.primary} />
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={styles.hydrationHeaderRow}>
              <Text style={[styles.hydrationTitle, { color: theme.text }]}>Hydration Tracker</Text>
              <Text style={[styles.hydrationTargetText, { color: theme.primary }]}>
                {(waterMl / 1000).toFixed(1)} / 2.5 L
              </Text>
            </View>
            <Text style={[styles.hydrationTip, { color: theme.textSecondary }]} numberOfLines={1}>
              Drink 1 glass before your Pull workout to sustain muscle pump.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add 250ml water"
            onPress={() => setWaterMl((prev) => Math.min(prev + 250, 4000))}
            style={({ pressed }) => [
              styles.addWaterBtn,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                opacity: pressed ? 0.75 : 1
              }
            ]}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
          </Pressable>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  greetingHeadline: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4
  },
  targetSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3
  },
  targetHighlight: {
    fontSize: 13,
    fontWeight: '600'
  },
  subDot: {
    width: 4,
    height: 4,
    borderRadius: 2
  },
  subMeta: {
    fontSize: 13,
    fontWeight: '400'
  },
  heroCard: {
    padding: 20,
    alignItems: 'center'
  },
  heroHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  heroSubHeader: {
    color: '#DDF3EF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8
  },
  heroPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999
  },
  heroPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600'
  },
  gaugeContainer: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gaugeCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  gaugeOverline: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 2
  },
  gaugeMainNumber: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums']
  },
  gaugeUnit: {
    color: '#DDF3EF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1
  },
  heroSplitPill: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 6
  },
  splitPillItem: {
    flex: 1,
    alignItems: 'center'
  },
  splitPillDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  },
  splitPillLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '500'
  },
  splitPillValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginTop: 2
  },
  splitPillUnit: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  card: {
    borderWidth: 1,
    padding: 16
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  cardHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  cardMetaTag: {
    fontSize: 12,
    fontWeight: '500'
  },
  macroRow: {
    marginBottom: 12
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  macroLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  macroDotBadge: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  macroName: {
    fontSize: 14,
    fontWeight: '600'
  },
  macroStatusPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  macroStatusPillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  macroTrack: {
    height: 8,
    borderRadius: 9999,
    overflow: 'hidden'
  },
  macroFill: {
    height: '100%'
  },
  workoutTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12
  },
  workoutBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  musclePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
  },
  musclePillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  scheduledText: {
    fontSize: 12,
    fontWeight: '500'
  },
  workoutTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 6
  },
  workoutMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500'
  },
  workoutCircleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  workoutActionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14
  },
  actionBtn: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600'
  },
  addMealLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  addMealLinkText: {
    fontSize: 14,
    fontWeight: '600'
  },
  mealCarouselContainer: {
    gap: 12,
    paddingRight: 16
  },
  emptyMealCard: {
    width: 240,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed'
  },
  emptyMealTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8
  },
  emptyMealSub: {
    fontSize: 12,
    marginTop: 2
  },
  mealCardItem: {
    width: 240,
    borderWidth: 1,
    overflow: 'hidden'
  },
  mealPhotoBox: {
    width: '100%',
    height: 130,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  mealTypeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
  },
  mealTypeTagText: {
    fontSize: 11,
    fontWeight: '700'
  },
  mealTimeTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
  },
  mealTimeTagText: {
    fontSize: 11,
    fontWeight: '600'
  },
  mealCardBody: {
    padding: 12
  },
  mealCardName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2
  },
  mealCardMacros: {
    fontSize: 12,
    fontWeight: '500'
  },
  hydrationCard: {
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  hydrationIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hydrationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  hydrationTitle: {
    fontSize: 14,
    fontWeight: '600'
  },
  hydrationTargetText: {
    fontSize: 13,
    fontWeight: '700'
  },
  hydrationTip: {
    fontSize: 12,
    fontWeight: '400'
  },
  addWaterBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  }
});
