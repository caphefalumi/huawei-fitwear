import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme, softShadow } from '../../theme';
import { useNutritionStore } from '../../store/nutritionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Timestamp, MealType } from '../../types/types';
import {
  MealCard,
  PrimaryButton,
  SecondaryButton,
  ProgressRing,
  StatusBadge,
  SkeletonBlock,
  EmptyState,
  ErrorState
} from '../../components/ui';

export default function NutritionScreen() {
  const { theme, radii } = useAppTheme();
  const {
    meals,
    todaySummary,
    selectedDate,
    setSelectedDate,
    loadNutrition,
    deleteMeal,
    loading
  } = useNutritionStore();
  const previewState = useSettingsStore((state) => state.previewState);

  // Hydration state (local telemetry tracking)
  const [waterMl, setWaterMl] = useState<number>(2000);
  const waterTargetMl = 3000;

  // Past 7 days for the horizontal date strip
  const dates = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const offset = i - 6; // -6 to 0 (today)
      const dateStr = Timestamp.getRelativeDate(offset);
      const d = new Date();
      d.setDate(d.getDate() + offset);
      const dayName = offset === 0 ? 'TODAY' : d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dayNum = d.getDate();
      return { dateStr, dayName, dayNum };
    });
  }, []);

  useEffect(() => {
    loadNutrition(selectedDate);
  }, [selectedDate, loadNutrition]);

  const handleDelete = (id: string, type: string) => {
    Alert.alert(
      'Delete Meal',
      `Remove this ${type} from your log?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            deleteMeal(id);
          }
        }
      ]
    );
  };

  const handleAddWater = (amount: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setWaterMl((prev) => Math.min(prev + amount, 6000));
  };

  // 1. Loading State
  if (previewState === 'loading') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <SkeletonBlock height={32} width={180} />
          <SkeletonBlock height={64} borderRadius={radii.md} style={{ marginVertical: 16 }} />
          <SkeletonBlock height={200} borderRadius={radii.xl} style={{ marginBottom: 16 }} />
          <SkeletonBlock height={120} borderRadius={radii.lg} style={{ marginBottom: 12 }} />
          <SkeletonBlock height={120} borderRadius={radii.lg} />
        </View>
      </SafeAreaView>
    );
  }

  // 2. Error State
  if (previewState === 'error') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ErrorState
          message="Could not load your nutrition logs. Check local database."
          onRetry={() => loadNutrition(selectedDate)}
        />
      </SafeAreaView>
    );
  }

  // 3. Empty State
  if (previewState === 'empty') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <EmptyState
          icon="restaurant-outline"
          title="No Meals on this Date"
          description="Photograph your plate or add food manually to start tracking your daily macros."
          actionLabel="Snap Meal"
          onAction={() => router.push('/snap-meal')}
        />
      </SafeAreaView>
    );
  }

  const mealCategories: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  const isToday = selectedDate === Timestamp.toDateString();

  const totalMacroGrams =
    todaySummary.proteinConsumed + todaySummary.carbsConsumed + todaySummary.fatConsumed;
  const pPercent = totalMacroGrams > 0 ? Math.round((todaySummary.proteinConsumed / totalMacroGrams) * 100) : 0;
  const cPercent = totalMacroGrams > 0 ? Math.round((todaySummary.carbsConsumed / totalMacroGrams) * 100) : 0;
  const fPercent = totalMacroGrams > 0 ? Math.max(0, 100 - pPercent - cPercent) : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Offline Banner */}
      {previewState === 'offline' ? (
        <View style={[styles.offlineBanner, { backgroundColor: theme.surfaceElevated }]}>
          <Ionicons name="cloud-offline" size={16} color={theme.textSecondary} />
          <Text style={[styles.offlineText, { color: theme.textSecondary }]}>
            Offline Mode — Changes saved locally
          </Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 104 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => loadNutrition(selectedDate)}
            tintColor={theme.primary}
          />
        }
      >
        {/* Title Header */}
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.dateSubtitle, { color: theme.textSecondary }]}>
              {isToday ? 'TODAY' : selectedDate}
            </Text>
            <Text style={[styles.pageTitle, { color: theme.text }]}>Nutrition</Text>
          </View>
          <Pressable
            style={[
              styles.cameraHeaderBtn,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
            onPress={() => router.push('/snap-meal')}
          >
            <Ionicons name="camera" size={20} color={theme.primary} />
          </Pressable>
        </View>

        {/* Horizontal Date Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStrip}
        >
          {dates.map((item) => {
            const isSelected = item.dateStr === selectedDate;
            return (
              <Pressable
                key={item.dateStr}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setSelectedDate(item.dateStr);
                }}
                style={[
                  styles.datePill,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                    borderRadius: radii.md
                  }
                ]}
              >
                <Text
                  style={[
                    styles.dateDayName,
                    { color: isSelected ? theme.onPrimary : theme.textSecondary }
                  ]}
                >
                  {item.dayName}
                </Text>
                <Text
                  style={[
                    styles.dateDayNum,
                    { color: isSelected ? theme.onPrimary : theme.text }
                  ]}
                >
                  {item.dayNum}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Daily Summary Card */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.xl,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.summaryTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.summaryKcalBig, { color: theme.text }]}>
                {todaySummary.caloriesConsumed.toLocaleString()}
                <Text style={[styles.summaryKcalTarget, { color: theme.textSecondary }]}>
                  {' '}/ {todaySummary.calorieTarget.toLocaleString()} kcal
                </Text>
              </Text>
              <Text
                style={[
                  styles.summaryRemainingText,
                  {
                    color:
                      todaySummary.calorieTarget - todaySummary.caloriesConsumed >= 0
                        ? theme.primary
                        : theme.overTarget
                  }
                ]}
              >
                {todaySummary.calorieTarget - todaySummary.caloriesConsumed >= 0
                  ? `${(todaySummary.calorieTarget - todaySummary.caloriesConsumed).toLocaleString()} kcal remaining`
                  : `${(todaySummary.caloriesConsumed - todaySummary.calorieTarget).toLocaleString()} kcal over target`}
              </Text>
            </View>
            <StatusBadge status={todaySummary.status} size="small" />
          </View>

          {/* 3 Macro Rings Row */}
          <View style={[styles.macroRingsRow, { borderTopColor: theme.borderSubtle }]}>
            <View style={styles.macroRingItem}>
              <ProgressRing
                size={78}
                strokeWidth={6}
                progress={todaySummary.proteinConsumed / Math.max(todaySummary.proteinTarget, 1)}
                color={theme.protein}
                primaryValue={`${Math.round(todaySummary.proteinConsumed)}g`}
                primaryLabel="Protein"
                icon={{ name: 'arm-flex', color: theme.ringIcon.protein }}
                accessibilityLabel={`Protein: ${Math.round(todaySummary.proteinConsumed)} of ${todaySummary.proteinTarget} grams`}
              />
            </View>

            <View style={styles.macroRingItem}>
              <ProgressRing
                size={78}
                strokeWidth={6}
                progress={todaySummary.carbsConsumed / Math.max(todaySummary.carbsTarget, 1)}
                color={theme.carbs}
                primaryValue={`${Math.round(todaySummary.carbsConsumed)}g`}
                primaryLabel="Carbs"
                icon={{ name: 'grain', color: theme.ringIcon.carbs }}
                accessibilityLabel={`Carbohydrates: ${Math.round(todaySummary.carbsConsumed)} of ${todaySummary.carbsTarget} grams`}
              />
            </View>

            <View style={styles.macroRingItem}>
              <ProgressRing
                size={78}
                strokeWidth={6}
                progress={todaySummary.fatConsumed / Math.max(todaySummary.fatTarget, 1)}
                color={theme.fat}
                primaryValue={`${Math.round(todaySummary.fatConsumed)}g`}
                primaryLabel="Fat"
                icon={{ name: 'water', color: theme.ringIcon.fat }}
                accessibilityLabel={`Fat: ${Math.round(todaySummary.fatConsumed)} of ${todaySummary.fatTarget} grams`}
              />
            </View>
          </View>

          {/* Macro Ratio Segmented Distribution Bar */}
          <View style={styles.macroDistSection}>
            <View style={styles.macroDistHeader}>
              <Text style={[styles.macroDistTitle, { color: theme.textSecondary }]}>
                MACRO DISTRIBUTION
              </Text>
              <Text style={[styles.macroDistSplit, { color: theme.textMuted }]}>
                {pPercent}% P • {cPercent}% C • {fPercent}% F
              </Text>
            </View>
            <View style={[styles.distBarTrack, { backgroundColor: theme.track, borderRadius: radii.full }]}>
              {pPercent > 0 ? (
                <View style={[styles.distBarSegment, { width: `${pPercent}%`, backgroundColor: theme.protein }]} />
              ) : null}
              {cPercent > 0 ? (
                <View style={[styles.distBarSegment, { width: `${cPercent}%`, backgroundColor: theme.carbs }]} />
              ) : null}
              {fPercent > 0 ? (
                <View style={[styles.distBarSegment, { width: `${fPercent}%`, backgroundColor: theme.fat }]} />
              ) : null}
            </View>
          </View>
        </View>

        {/* HYDRATION TELEMETRY TRACKER */}
        <View
          style={[
            styles.hydrationCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.xl,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.hydrationHeader}>
            <View style={styles.hydrationTitleRow}>
              <Ionicons name="water" size={18} color={theme.protein} />
              <Text style={[styles.hydrationTitle, { color: theme.text }]}>Hydration</Text>
            </View>
            <Text style={[styles.hydrationValue, { color: theme.protein }]}>
              {waterMl} <Text style={[styles.hydrationTarget, { color: theme.textSecondary }]}>/ {waterTargetMl} ml</Text>
            </Text>
          </View>
          <View style={[styles.hydrationTrack, { backgroundColor: theme.track, borderRadius: radii.full }]}>
            <View
              style={[
                styles.hydrationFill,
                {
                  width: `${Math.min(Math.round((waterMl / waterTargetMl) * 100), 100)}%`,
                  backgroundColor: theme.protein,
                  borderRadius: radii.full
                }
              ]}
            />
          </View>
          <View style={styles.hydrationActions}>
            <Pressable
              style={[styles.waterPillBtn, { backgroundColor: theme.surfaceElevated, borderRadius: radii.full }]}
              onPress={() => handleAddWater(250)}
            >
              <Ionicons name="add" size={14} color={theme.text} />
              <Text style={[styles.waterPillText, { color: theme.text }]}>250 ml</Text>
            </Pressable>
            <Pressable
              style={[styles.waterPillBtn, { backgroundColor: theme.surfaceElevated, borderRadius: radii.full }]}
              onPress={() => handleAddWater(500)}
            >
              <Ionicons name="add" size={14} color={theme.text} />
              <Text style={[styles.waterPillText, { color: theme.text }]}>500 ml</Text>
            </Pressable>
          </View>
        </View>

        {/* Meals Section Grouped by Category */}
        <View style={styles.categorySection}>
          <View style={styles.sectionHeadingRow}>
            <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
              LOGGED MEALS
            </Text>
            <Text style={[styles.sectionItemCount, { color: theme.textMuted }]}>
              {meals.length} {meals.length === 1 ? 'entry' : 'entries'}
            </Text>
          </View>

          {meals.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.xl }]}>
              <EmptyState
                icon="fast-food-outline"
                title="No Meals Logged"
                description="Capture food with your camera to immediately recognize calories and macros."
                actionLabel="Snap a Meal"
                onAction={() => router.push('/snap-meal')}
              />
            </View>
          ) : (
            mealCategories.map((cat) => {
              const catMeals = meals.filter((m) => m.type === cat);
              if (catMeals.length === 0) return null;

              const catKcal = catMeals.reduce((acc, m) => acc + m.totalCalories, 0);

              return (
                <View key={cat} style={styles.catGroup}>
                  <View style={styles.catHeader}>
                    <Text style={[styles.catTitle, { color: theme.textSecondary }]}>
                      {cat.toUpperCase()} • {catMeals.length}
                    </Text>
                    <Text style={[styles.catKcalSummary, { color: theme.textMuted }]}>
                      {catKcal} kcal
                    </Text>
                  </View>
                  {catMeals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onDelete={() => handleDelete(meal.id, meal.type)}
                    />
                  ))}
                </View>
              );
            })
          )}
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomButtons}>
          <PrimaryButton
            label="Snap Meal"
            icon="camera"
            size="large"
            onPress={() => router.push('/snap-meal')}
          />
          <SecondaryButton
            label="Search Food Library"
            icon="search"
            onPress={() => router.push('/snap-meal')}
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16
  },
  dateSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8
  },
  cameraHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateStrip: {
    gap: 8,
    marginBottom: 16
  },
  datePill: {
    width: 52,
    height: 64,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8
  },
  dateDayName: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  dateDayNum: {
    fontSize: 18,
    fontWeight: '800'
  },
  summaryCard: {
    borderWidth: 1,
    padding: 18,
    marginBottom: 16
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  summaryKcalBig: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums']
  },
  summaryKcalTarget: {
    fontSize: 14,
    fontWeight: '600'
  },
  summaryRemainingText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2
  },
  macroRingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 16,
    paddingBottom: 16
  },
  macroRingItem: {
    alignItems: 'center'
  },
  macroDistSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128, 128, 128, 0.15)',
    paddingTop: 14
  },
  macroDistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  macroDistTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  macroDistSplit: {
    fontSize: 11,
    fontWeight: '700'
  },
  distBarTrack: {
    height: 6,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  distBarSegment: {
    height: '100%'
  },
  hydrationCard: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 16
  },
  hydrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  hydrationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  hydrationTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  hydrationValue: {
    fontSize: 15,
    fontWeight: '800'
  },
  hydrationTarget: {
    fontSize: 12,
    fontWeight: '500'
  },
  hydrationTrack: {
    height: 8,
    overflow: 'hidden',
    marginBottom: 12
  },
  hydrationFill: {
    height: '100%'
  },
  hydrationActions: {
    flexDirection: 'row',
    gap: 8
  },
  waterPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  waterPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  categorySection: {
    marginVertical: 10
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 4,
    marginRight: 4
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  sectionItemCount: {
    fontSize: 11,
    fontWeight: '600'
  },
  emptyCard: {
    borderWidth: 1,
    padding: 20
  },
  catGroup: {
    marginBottom: 12
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 4,
    marginRight: 4
  },
  catTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  catKcalSummary: {
    fontSize: 11,
    fontWeight: '600'
  },
  bottomButtons: {
    marginTop: 16,
    gap: 10
  }
});
