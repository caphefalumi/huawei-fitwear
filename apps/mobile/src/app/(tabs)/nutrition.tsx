import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  Platform,
  TextInput
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme, softShadow } from '../../theme';
import { useNutritionStore } from '../../store/nutritionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Timestamp, MealType, MealDoc } from '../../types/types';
import {
  MealCard,
  ProgressRing,
  StatusBadge,
  SkeletonBlock,
  EmptyState,
  ErrorState,
  MealNutritionModal
} from '../../components/ui';
import {
  useMealsByDateQuery,
  useTodaySummaryQuery,
  useDeleteMealMutation
} from '@/hooks/use-queries';

export default function NutritionScreen() {
  const { theme, radii } = useAppTheme();
  const insets = useSafeAreaInsets();
  const dateScrollRef = useRef<ScrollView>(null);
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

  const { data: qMeals, refetch: refetchMeals, isLoading: mealsLoading } = useMealsByDateQuery(selectedDate);
  const { data: qSummary } = useTodaySummaryQuery();
  const deleteMealMutation = useDeleteMealMutation();

  const activeMeals = qMeals || meals;
  const activeSummary = qSummary || todaySummary;

  const [selectedMeal, setSelectedMeal] = useState<MealDoc | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Order dates starting from TODAY (0) to 6 days ago (-6) so TODAY is on the left
  const dates = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const offset = -i;
      const dateStr = Timestamp.getRelativeDate(offset);
      const d = new Date();
      d.setDate(d.getDate() + offset);
      const dayName = offset === 0 ? 'TODAY' : d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dayNum = d.getDate();
      return { dateStr, dayName, dayNum };
    });
  }, []);

  const filteredMeals = useMemo(() => {
    if (!searchQuery.trim()) return activeMeals;
    const q = searchQuery.toLowerCase().trim();
    return activeMeals.filter(
      (m) =>
        m.type.toLowerCase().includes(q) ||
        m.items.some((item) => item.name.toLowerCase().includes(q))
    );
  }, [activeMeals, searchQuery]);

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
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            await deleteMealMutation.mutateAsync(id);
            deleteMeal(id);
          }
        }
      ]
    );
  };

  // 1. Loading State
  if (previewState === 'loading') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <View style={styles.content}>
          <SkeletonBlock height={32} width={180} />
          <SkeletonBlock height={64} borderRadius={radii.md} style={{ marginVertical: 16 }} />
          <SkeletonBlock height={200} borderRadius={radii.xl} style={{ marginBottom: 16 }} />
          <SkeletonBlock height={120} borderRadius={radii.lg} style={{ marginBottom: 12 }} />
          <SkeletonBlock height={120} borderRadius={radii.lg} />
        </View>
      </View>
    );
  }

  // 2. Error State
  if (previewState === 'error') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <ErrorState
          message="Could not load your nutrition logs. Check local database."
          onRetry={() => loadNutrition(selectedDate)}
        />
      </View>
    );
  }

  // 3. Empty State
  if (previewState === 'empty') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <EmptyState
          icon="restaurant-outline"
          title="No Meals on this Date"
          description="Photograph your plate or add food manually to start tracking your daily macros."
          actionLabel="Snap Meal"
          onAction={() => router.push('/snap-meal')}
        />
      </View>
    );
  }

  const mealCategories: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  const isToday = selectedDate === Timestamp.toDateString();

  const totalMacroGrams =
    activeSummary.proteinConsumed + activeSummary.carbsConsumed + activeSummary.fatConsumed;
  const pPercent = totalMacroGrams > 0 ? Math.round((activeSummary.proteinConsumed / totalMacroGrams) * 100) : 0;
  const cPercent = totalMacroGrams > 0 ? Math.round((activeSummary.carbsConsumed / totalMacroGrams) * 100) : 0;
  const fPercent = totalMacroGrams > 0 ? Math.max(0, 100 - pPercent - cPercent) : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {previewState === 'offline' ? (
        <View style={[styles.offlineBanner, { backgroundColor: theme.surfaceElevated }]}>
          <Ionicons name="cloud-offline" size={16} color={theme.textSecondary} />
          <Text style={[styles.offlineText, { color: theme.textSecondary }]}>
            Offline Mode — Changes saved locally
          </Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 140 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading || mealsLoading}
            onRefresh={() => {
              refetchMeals();
              loadNutrition(selectedDate);
            }}
            tintColor={theme.primary}
          />
        }
      >
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.dateSubtitle, { color: theme.textSecondary }]}>
              {isToday ? 'TODAY' : selectedDate}
            </Text>
            <Text style={[styles.pageTitle, { color: theme.text }]}>Nutrition</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.lg,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <Ionicons name="search" size={17} color={theme.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search foods, ingredients or meal..."
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              hitSlop={8}
              style={{ padding: 4 }}
            >
              <Ionicons name="close-circle" size={17} color={theme.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Evenly distributed 7-Day Week Strip */}
        <View style={styles.dateStripRow}>
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
                  numberOfLines={1}
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
        </View>

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
                {activeSummary.caloriesConsumed.toLocaleString()}
                <Text style={[styles.summaryKcalTarget, { color: theme.textSecondary }]}>
                  {' '}/ {activeSummary.calorieTarget.toLocaleString()} kcal
                </Text>
              </Text>
              <Text
                style={[
                  styles.summaryRemainingText,
                  {
                    color:
                      activeSummary.calorieTarget - activeSummary.caloriesConsumed >= 0
                        ? theme.secondary
                        : theme.overTarget
                  }
                ]}
              >
                {activeSummary.calorieTarget - activeSummary.caloriesConsumed >= 0
                  ? `${(activeSummary.calorieTarget - activeSummary.caloriesConsumed).toLocaleString()} kcal remaining`
                  : `${(activeSummary.caloriesConsumed - activeSummary.calorieTarget).toLocaleString()} kcal over target`}
              </Text>
            </View>
            <StatusBadge status={activeSummary.status} size="small" />
          </View>

          <View style={[styles.macroRingsRow, { borderTopColor: theme.borderSubtle }]}>
            <View style={styles.macroRingItem}>
              <ProgressRing
                size={78}
                strokeWidth={6}
                progress={activeSummary.proteinConsumed / Math.max(activeSummary.proteinTarget, 1)}
                color={theme.protein}
                primaryValue={`${Math.round(activeSummary.proteinConsumed)}g`}
                primaryLabel="Protein"
                icon={{ name: 'arm-flex', color: theme.ringIcon.protein }}
                accessibilityLabel={`Protein: ${Math.round(activeSummary.proteinConsumed)} of ${activeSummary.proteinTarget} grams`}
              />
            </View>

            <View style={styles.macroRingItem}>
              <ProgressRing
                size={78}
                strokeWidth={6}
                progress={activeSummary.carbsConsumed / Math.max(activeSummary.carbsTarget, 1)}
                color={theme.carbs}
                primaryValue={`${Math.round(activeSummary.carbsConsumed)}g`}
                primaryLabel="Carbs"
                icon={{ name: 'grain', color: theme.ringIcon.carbs }}
                accessibilityLabel={`Carbohydrates: ${Math.round(activeSummary.carbsConsumed)} of ${activeSummary.carbsTarget} grams`}
              />
            </View>

            <View style={styles.macroRingItem}>
              <ProgressRing
                size={78}
                strokeWidth={6}
                progress={activeSummary.fatConsumed / Math.max(activeSummary.fatTarget, 1)}
                color={theme.fat}
                primaryValue={`${Math.round(activeSummary.fatConsumed)}g`}
                primaryLabel="Fat"
                icon={{ name: 'water', color: theme.ringIcon.fat }}
                accessibilityLabel={`Fat: ${Math.round(activeSummary.fatConsumed)} of ${activeSummary.fatTarget} grams`}
              />
            </View>
          </View>

          <View style={styles.macroDistSection}>
            <Text style={[styles.macroDistTitle, { color: theme.text }]}>
              Macro Breakdown
            </Text>

            <View style={[styles.distBarTrack, { backgroundColor: theme.surfaceElevated, height: 8, borderRadius: 4, gap: 3, flexDirection: 'row', overflow: 'hidden' }]}>
              {pPercent > 0 ? (
                <View style={[styles.distBarSegment, { width: `${pPercent}%`, height: '100%', backgroundColor: theme.protein, borderRadius: 4 }]} />
              ) : null}
              {cPercent > 0 ? (
                <View style={[styles.distBarSegment, { width: `${cPercent}%`, height: '100%', backgroundColor: theme.carbs, borderRadius: 4 }]} />
              ) : null}
              {fPercent > 0 ? (
                <View style={[styles.distBarSegment, { width: `${fPercent}%`, height: '100%', backgroundColor: theme.fat, borderRadius: 4 }]} />
              ) : null}
            </View>

            {/* Explicit, readable labels: Protein • Carbs • Fat */}
            <View style={styles.macroDistLegendRow}>
              <View style={styles.macroDistLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.protein }]} />
                <Text style={styles.legendText}>
                  <Text style={{ color: theme.protein, fontWeight: '700' }}>{pPercent}%</Text>{' '}
                  <Text style={{ color: theme.textSecondary }}>Protein</Text>
                </Text>
              </View>

              <View style={styles.macroDistLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.carbs }]} />
                <Text style={styles.legendText}>
                  <Text style={{ color: theme.carbs, fontWeight: '700' }}>{cPercent}%</Text>{' '}
                  <Text style={{ color: theme.textSecondary }}>Carbs</Text>
                </Text>
              </View>

              <View style={styles.macroDistLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.fat }]} />
                <Text style={styles.legendText}>
                  <Text style={{ color: theme.fat, fontWeight: '700' }}>{fPercent}%</Text>{' '}
                  <Text style={{ color: theme.textSecondary }}>Fat</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.categorySection}>
          <View style={styles.sectionHeadingRow}>
            <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
              LOGGED MEALS
            </Text>
            <Text style={[styles.sectionItemCount, { color: theme.textMuted }]}>
              {filteredMeals.length} {filteredMeals.length === 1 ? 'entry' : 'entries'}
            </Text>
          </View>

          {filteredMeals.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.xl }]}>
              <EmptyState
                icon={searchQuery ? 'search-outline' : 'fast-food-outline'}
                title={searchQuery ? 'No Matching Meals' : 'No Meals Logged'}
                description={
                  searchQuery
                    ? `No meals match "${searchQuery}". Try another keyword.`
                    : 'Capture food with your camera to immediately recognize calories and macros.'
                }
                actionLabel={searchQuery ? 'Clear Search' : 'Snap a Meal'}
                onAction={() => (searchQuery ? setSearchQuery('') : router.push('/snap-meal'))}
              />
            </View>
          ) : (
            mealCategories.map((cat) => {
              const catMeals = filteredMeals.filter((m) => m.type === cat);
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
                      onPress={() => setSelectedMeal(meal)}
                      onDelete={() => handleDelete(meal.id, meal.type)}
                    />
                  ))}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Detailed Nutrition Facts Modal for Stored Meals */}
      <MealNutritionModal
        meal={selectedMeal}
        visible={selectedMeal !== null}
        onClose={() => setSelectedMeal(null)}
        onDelete={deleteMeal}
      />
    </View>
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
    marginBottom: 12
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginBottom: 14
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 0
  },
  dateStripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    width: '100%',
    marginBottom: 16
  },
  datePill: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5
  },
  dateDayName: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 3
  },
  dateDayNum: {
    fontSize: 16,
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
  macroDistTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 8
  },
  distBarTrack: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    gap: 3,
    overflow: 'hidden'
  },
  distBarSegment: {
    height: '100%',
    borderRadius: 4
  },
  macroDistLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8
  },
  macroDistLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500'
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
  }
});
