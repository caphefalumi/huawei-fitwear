import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  RefreshControl,
  Platform,
  Image,
  Modal
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme, softShadow } from '../../theme';
import { useUserStore } from '../../store/userStore';
import { useNutritionStore } from '../../store/nutritionStore';
import { useWorkoutStore } from '../../store/workoutStore';
import { useDeviceStore } from '../../store/deviceStore';
import { useSettingsStore } from '../../store/settingsStore';
import {
  SkeletonBlock,
  EmptyState,
  ErrorState,
  BrandLogo,
  MealNutritionModal,
  HuaweiGlanceDial,
  ActivityMetricModal,
  type ActivityMetricType
} from '../../components/ui';
import { MealDoc, MealType, Timestamp } from '../../types/types';

const MEAL_FILTERS: { key: 'all' | MealType; label: string; icon: any }[] = [
  { key: 'all', label: 'All', icon: 'apps-outline' },
  { key: 'breakfast', label: 'Breakfast', icon: 'sunny-outline' },
  { key: 'lunch', label: 'Lunch', icon: 'restaurant-outline' },
  { key: 'dinner', label: 'Dinner', icon: 'moon-outline' }
];
import {
  useUserProfileQuery,
  useTodaySummaryQuery,
  useMealsByDateQuery,
  usePlanQuery,
  useDevicesQuery
} from '@/hooks/use-queries';

export default function HomeScreen() {
  const { theme, radii } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { user, loadUser } = useUserStore();
  const { todaySummary, meals, loadNutrition, deleteMeal, loading: nutritionLoading } = useNutritionStore();
  const { plan, loadPlanAndHistory, updatePlan, exercises } = useWorkoutStore();
  const { devices, loadDevices } = useDeviceStore();
  const previewState = useSettingsStore((state) => state.previewState);

  const { data: userProfile } = useUserProfileQuery();
  const { data: qSummary, isLoading: summaryLoading } = useTodaySummaryQuery();
  const { data: qMeals, refetch: refetchMeals } = useMealsByDateQuery(Timestamp.toDateString());
  const { data: qPlan } = usePlanQuery();
  const { data: qDevices } = useDevicesQuery();

  const [selectedMeal, setSelectedMeal] = useState<MealDoc | null>(null);
  const [selectedMealCategory, setSelectedMealCategory] = useState<'all' | MealType>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const [previewWorkoutModal, setPreviewWorkoutModal] = useState(false);
  const [selectedActivityMetric, setSelectedActivityMetric] = useState<ActivityMetricType | null>(null);

  const handleCycleWorkoutDay = () => {
    if (!activePlan || !activePlan.days || activePlan.days.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setSpinDeg((prev) => prev + 180);
    const nextIdx = (activePlan.currentDayIndex + 1) % activePlan.days.length;
    updatePlan({ currentDayIndex: nextIdx });
  };

  useEffect(() => {
    loadUser();
    loadNutrition();
    loadPlanAndHistory();
    loadDevices();
  }, [loadUser, loadNutrition, loadPlanAndHistory, loadDevices]);

  const activeUser = userProfile || user;
  const activeSummary = qSummary || todaySummary;
  const activeMeals = qMeals || meals;
  const filteredMeals = useMemo(() => {
    if (selectedMealCategory === 'all') return activeMeals;
    return activeMeals.filter((m) => m.type === selectedMealCategory);
  }, [activeMeals, selectedMealCategory]);
  const activePlan = qPlan !== undefined ? qPlan : plan;
  const activeDevices = qDevices || devices;

  const watchDevice = activeDevices.find((d) => d.type === 'watch') || activeDevices[0];
  const connectionStatus = watchDevice ? watchDevice.connectionStatus : 'connected';

  const nextDay = activePlan ? activePlan.days[activePlan.currentDayIndex] : null;

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
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {/* Top Header Bar */}
      <View style={[styles.topBar, { borderBottomColor: theme.borderSubtle }]}>
        <View style={styles.topBarBrand}>
          <BrandLogo size={32} />
          <View>
            <Text style={[styles.brandTitle, { color: theme.primary }]}>AI FitWear</Text>
            <Text style={[styles.syncMiniText, { color: theme.textSecondary }]}>Smart Fitness & Nutrition</Text>
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
        contentContainerStyle={[styles.content, { paddingBottom: 130 }]}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => {
          if (dropdownOpen) setDropdownOpen(false);
        }}
        refreshControl={
          <RefreshControl
            refreshing={nutritionLoading || summaryLoading}
            onRefresh={() => {
              refetchMeals();
              loadNutrition();
              loadPlanAndHistory();
              loadDevices();
            }}
            tintColor={theme.primary}
          />
        }
      >
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderWidth: 1,
              borderRadius: radii.xl,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.heroHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="watch-outline" size={18} color={theme.primary} />
              <Text style={[styles.heroSubHeader, { color: theme.text }]}>
                Activity Rings
              </Text>
            </View>

            <View style={[styles.liveBadge, { backgroundColor: theme.primaryContainer }]}>
              <View style={[styles.livePulseDot, { backgroundColor: theme.primary }]} />
              <Text style={[styles.liveBadgeText, { color: theme.onPrimaryContainer }]}>
                Live Glance
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginVertical: 6 }}>
            <HuaweiGlanceDial
              size={230}
              outerValue={activeSummary.caloriesConsumed || 1537}
              middleValue={activeSummary.workoutsCompleted || 1}
              innerValue={9}
              outerTarget={2000}
            />

            {/* Interactive 3-Metric Cards: Stand • Exercise • Move */}
            <View style={styles.activityMetricsGrid}>
              {/* Stand (Cyan) */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View Stand hours chart and telemetry"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setSelectedActivityMetric('stand');
                }}
                style={({ pressed }) => [
                  styles.activityMetricTile,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                    transform: [{ scale: pressed ? 0.96 : 1 }]
                  }
                ]}
              >
                <View style={styles.metricTileHeader}>
                  <View style={[styles.metricTileDot, { backgroundColor: '#00A3FF' }]} />
                  <Text style={[styles.metricTileTitle, { color: theme.textSecondary }]}>Stand</Text>
                  <Ionicons name="chevron-forward" size={11} color={theme.textMuted} style={{ marginLeft: 'auto' }} />
                </View>
                <Text style={[styles.metricTileValue, { color: theme.text }]} numberOfLines={1}>
                  9
                  <Text style={[styles.metricTileUnit, { color: theme.textSecondary }]}>/12h</Text>
                </Text>
                <View style={[styles.metricMiniTrack, { backgroundColor: theme.card }]}>
                  <View style={[styles.metricMiniFill, { width: '75%', backgroundColor: '#00A3FF' }]} />
                </View>
              </Pressable>

              {/* Exercise (Yellow) */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View Exercise minutes chart and telemetry"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setSelectedActivityMetric('exercise');
                }}
                style={({ pressed }) => [
                  styles.activityMetricTile,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                    transform: [{ scale: pressed ? 0.96 : 1 }]
                  }
                ]}
              >
                <View style={styles.metricTileHeader}>
                  <View style={[styles.metricTileDot, { backgroundColor: '#FFD200' }]} />
                  <Text style={[styles.metricTileTitle, { color: theme.textSecondary }]}>Exercise</Text>
                  <Ionicons name="chevron-forward" size={11} color={theme.textMuted} style={{ marginLeft: 'auto' }} />
                </View>
                <Text style={[styles.metricTileValue, { color: theme.text }]} numberOfLines={1}>
                  {activeSummary.workoutsCompleted || 1}
                  <Text style={[styles.metricTileUnit, { color: theme.textSecondary }]}>/30m</Text>
                </Text>
                <View style={[styles.metricMiniTrack, { backgroundColor: theme.card }]}>
                  <View style={[styles.metricMiniFill, { width: '10%', backgroundColor: '#FFD200' }]} />
                </View>
              </Pressable>

              {/* Move (Red) */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View Move calories chart and telemetry"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setSelectedActivityMetric('move');
                }}
                style={({ pressed }) => [
                  styles.activityMetricTile,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                    transform: [{ scale: pressed ? 0.96 : 1 }]
                  }
                ]}
              >
                <View style={styles.metricTileHeader}>
                  <View style={[styles.metricTileDot, { backgroundColor: '#FF4D30' }]} />
                  <Text style={[styles.metricTileTitle, { color: theme.textSecondary }]}>Move</Text>
                  <Ionicons name="chevron-forward" size={11} color={theme.textMuted} style={{ marginLeft: 'auto' }} />
                </View>
                <Text style={[styles.metricTileValue, { color: theme.text }]} numberOfLines={1}>
                  {activeSummary.caloriesConsumed || 1537}
                  <Text style={[styles.metricTileUnit, { color: theme.textSecondary }]}>/2000 kcal</Text>
                </Text>
                <View style={[styles.metricMiniTrack, { backgroundColor: theme.card }]}>
                  <View style={[styles.metricMiniFill, { width: '77%', backgroundColor: '#FF4D30' }]} />
                </View>
              </Pressable>
            </View>
          </View>
        </View>

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
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View workout exercises preview"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setPreviewWorkoutModal(true);
              }}
              style={({ pressed }) => [
                { flex: 1, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <View style={styles.workoutBadgeRow}>
                <View style={[styles.musclePill, { backgroundColor: `${theme.primary}18` }]}>
                  <Text style={[styles.musclePillText, { color: theme.primary }]}>
                    {nextDay ? nextDay.muscleGroup.toUpperCase() : 'CHEST'}
                  </Text>
                </View>
                <Text style={[styles.scheduledText, { color: theme.textSecondary }]}>
                  Scheduled for 17:30
                </Text>
                <View style={styles.previewHintPill}>
                  <Text style={[styles.previewHintText, { color: theme.textMuted }]}>Tap to preview</Text>
                  <Ionicons name="chevron-forward" size={11} color={theme.textMuted} />
                </View>
              </View>

              <Text style={[styles.workoutTitle, { color: theme.text }]} numberOfLines={1}>
                {nextDay ? nextDay.title : 'Chest & Anterior Pectoral Focus'}
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
                <Text style={{ color: theme.borderSubtle }}>•</Text>
                <View style={styles.metaItem}>
                  <Ionicons name="flame-outline" size={15} color={theme.calories} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    ~{nextDay ? Math.round(nextDay.estimatedDurationMin * 7.5) : 340} kcal
                  </Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Switch to next workout split day"
              onPress={handleCycleWorkoutDay}
              style={({ pressed }) => [
                styles.workoutCircleIcon,
                {
                  backgroundColor: theme.primaryContainer,
                  transform: [{ rotate: `${spinDeg}deg` }, { scale: pressed ? 0.90 : 1 }]
                }
              ]}
            >
              <Ionicons name="repeat" size={22} color={theme.primary} />
            </Pressable>
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

        {/* TODAY'S MEALS HEADER WITH ENGLISH DROPDOWN */}
        <View style={[styles.sectionHeaderRow, { zIndex: 100 }]}>
          <View style={styles.sectionTitleGroup}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{"Today's Meals"}</Text>
            <View style={[styles.countBadge, { backgroundColor: theme.surfaceElevated }]}>
              <Text style={[styles.countBadgeText, { color: theme.textSecondary }]}>
                {filteredMeals.length} logged
              </Text>
            </View>
          </View>

          {/* English Dropdown Filter */}
          <View style={{ position: 'relative', zIndex: 110 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Filter meals by category dropdown"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setDropdownOpen((prev) => !prev);
              }}
              style={({ pressed }) => [
                styles.dropdownTrigger,
                {
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                  opacity: pressed ? 0.8 : 1
                }
              ]}
            >
              <Ionicons
                name={MEAL_FILTERS.find((f) => f.key === selectedMealCategory)?.icon || 'apps-outline'}
                size={14}
                color={theme.primary}
              />
              <Text style={[styles.dropdownTriggerText, { color: theme.text }]}>
                {MEAL_FILTERS.find((f) => f.key === selectedMealCategory)?.label || 'All'}
              </Text>
              <Ionicons
                name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={13}
                color={theme.textSecondary}
              />
            </Pressable>

            {dropdownOpen && (
              <>
                <Pressable
                  style={{
                    position: 'absolute',
                    top: -1000,
                    left: -1000,
                    right: -1000,
                    bottom: -1000,
                    zIndex: 95
                  }}
                  onPress={() => setDropdownOpen(false)}
                />
                <View
                  style={[
                    styles.dropdownMenu,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      borderRadius: radii.md,
                      ...Platform.select({
                        web: {
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.14)'
                        },
                        default: {
                          shadowColor: theme.shadow,
                          shadowOffset: { width: 0, height: 6 },
                          shadowOpacity: 0.16,
                          shadowRadius: 14,
                          elevation: 12
                        }
                      })
                    }
                  ]}
                >
                  {MEAL_FILTERS.map((f) => {
                    const isSelected = selectedMealCategory === f.key;
                    return (
                      <Pressable
                        key={f.key}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                          setSelectedMealCategory(f.key);
                          setDropdownOpen(false);
                        }}
                        style={({ pressed }) => [
                          styles.dropdownItem,
                          {
                            backgroundColor: pressed
                              ? theme.surfaceElevated
                              : isSelected
                              ? `${theme.primary}12`
                              : 'transparent'
                          }
                        ]}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Ionicons
                            name={f.icon}
                            size={15}
                            color={isSelected ? theme.primary : theme.textSecondary}
                          />
                          <Text
                            style={[
                              styles.dropdownItemText,
                              {
                                color: isSelected ? theme.primary : theme.text,
                                fontWeight: isSelected ? '700' : '500'
                              }
                            ]}
                          >
                            {f.label}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark" size={15} color={theme.primary} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mealCarouselContainer}
        >
          {filteredMeals.length === 0 ? (
            <Pressable
              onPress={() => router.push('/snap-meal')}
              style={[
                styles.emptyMealCard,
                { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }
              ]}
            >
              <Ionicons name="camera-outline" size={28} color={theme.primary} />
              <Text style={[styles.emptyMealTitle, { color: theme.text }]}>
                {selectedMealCategory === 'all'
                  ? 'No meals logged today'
                  : `No ${MEAL_FILTERS.find((f) => f.key === selectedMealCategory)?.label} logged`}
              </Text>
              <Text style={[styles.emptyMealSub, { color: theme.textSecondary }]}>
                Tap to snap and calculate nutrition
              </Text>
            </Pressable>
          ) : (
            filteredMeals.map((meal) => (
              <Pressable
                key={meal.id}
                onPress={() => setSelectedMeal(meal)}
                style={({ pressed }) => [
                  styles.mealCardItem,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: radii.lg,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                  }
                ]}
              >
                <View style={[styles.mealPhotoBox, { backgroundColor: theme.surfaceElevated }]}>
                  {meal.imageUrl ? (
                    <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} resizeMode="cover" />
                  ) : (
                    <Ionicons name="restaurant-outline" size={32} color={theme.primary} />
                  )}
                  <View style={styles.mealTypeTag}>
                    <Text style={styles.mealTypeTagText}>
                      {meal.type.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.mealTimeTag}>
                    <Ionicons name="time-outline" size={12} color="#FFFFFF" />
                    <Text style={styles.mealTimeTagText}>
                      {meal.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.mealCardBody}>
                  <Text style={[styles.mealCardName, { color: theme.text }]} numberOfLines={1}>
                    {meal.items[0]?.name || 'Logged Meal'}
                  </Text>

                  {/* Clean Calorie Badge Only */}
                  <View style={styles.calorieRow}>
                    <Ionicons name="flame" size={14} color={theme.calories} />
                    <Text style={[styles.calorieText, { color: theme.calories }]}>
                      {meal.totalCalories} kcal
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </ScrollView>

      {/* Detailed Nutrition Facts Modal for Stored Meals */}
      <MealNutritionModal
        meal={selectedMeal}
        visible={selectedMeal !== null}
        onClose={() => setSelectedMeal(null)}
        onDelete={deleteMeal}
      />

      {/* Today's Workout Routine Preview Modal */}
      <Modal
        visible={previewWorkoutModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPreviewWorkoutModal(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeaderBar, { borderBottomColor: theme.borderSubtle }]}>
            <View style={styles.headerLeft}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close routine preview"
                onPress={() => setPreviewWorkoutModal(false)}
                style={[styles.closeCircleBtn, { backgroundColor: theme.surfaceElevated }]}
              >
                <Ionicons name="close" size={18} color={theme.text} />
              </Pressable>
              <View>
                <Text style={[styles.modalHeaderTitle, { color: theme.text }]}>Today's Workout</Text>
                <Text style={[styles.modalHeaderSubtitle, { color: theme.textSecondary }]}>
                  {nextDay ? `${nextDay.exercises.length} exercises • ~${nextDay.estimatedDurationMin} mins` : 'Routine preview'}
                </Text>
              </View>
            </View>

            <View style={[styles.musclePill, { backgroundColor: `${theme.primary}18` }]}>
              <Text style={[styles.musclePillText, { color: theme.primary }]}>
                {nextDay ? nextDay.muscleGroup.toUpperCase() : 'CHEST'}
              </Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.routineScrollContent} showsVerticalScrollIndicator={false}>
            {/* Routine Title Header Card */}
            <View
              style={[
                styles.routineHeaderCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  borderRadius: radii.lg,
                  ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                }
              ]}
            >
              <Text style={[styles.routineCardTitle, { color: theme.text }]}>
                {nextDay ? nextDay.title : 'Chest & Anterior Pectoral Focus'}
              </Text>
              <View style={styles.routineMetaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="barbell-outline" size={14} color={theme.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {nextDay ? nextDay.exercises.length : 4} exercises
                  </Text>
                </View>
                <Text style={{ color: theme.borderSubtle }}>•</Text>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {nextDay ? nextDay.estimatedDurationMin : 45} mins
                  </Text>
                </View>
                <Text style={{ color: theme.borderSubtle }}>•</Text>
                <View style={styles.metaItem}>
                  <Ionicons name="flame-outline" size={14} color={theme.calories} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    ~{nextDay ? Math.round(nextDay.estimatedDurationMin * 7.5) : 340} kcal
                  </Text>
                </View>
              </View>
            </View>

            {/* Exercise List */}
            <View style={styles.routineExercisesList}>
              {(nextDay?.exercises || []).map((pe, idx) => {
                const exDoc = (exercises || []).find((e) => e.id === pe.exerciseId);
                return (
                  <View
                    key={pe.id || idx}
                    style={[
                      styles.routineExerciseCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        borderRadius: radii.md
                      }
                    ]}
                  >
                    <View style={styles.routineExerciseTop}>
                      <View style={[styles.exerciseIndexBadge, { backgroundColor: theme.primaryContainer }]}>
                        <Text style={[styles.exerciseIndexText, { color: theme.primary }]}>
                          {idx + 1}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.routineExerciseName, { color: theme.text }]} numberOfLines={1}>
                          {exDoc?.name || 'Exercise'}
                        </Text>
                        <Text style={[styles.routineExerciseMeta, { color: theme.textSecondary }]}>
                          {pe.sets} sets • {pe.repRange.min}-{pe.repRange.max} reps
                          {pe.targetWeightKg > 0 ? ` • ${pe.targetWeightKg} kg` : ' • Bodyweight'}
                        </Text>
                      </View>
                      <View style={[styles.restTimeBadge, { backgroundColor: theme.surfaceElevated }]}>
                        <Ionicons name="timer-outline" size={12} color={theme.textSecondary} />
                        <Text style={[styles.restTimeText, { color: theme.textSecondary }]}>
                          {pe.restSeconds}s
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View style={styles.routineActionsRow}>
              <Pressable
                onPress={() => {
                  setPreviewWorkoutModal(false);
                  router.push('/active-workout');
                }}
                style={({ pressed }) => [
                  styles.routineStartBtn,
                  {
                    backgroundColor: theme.primary,
                    borderRadius: radii.md,
                    opacity: pressed ? 0.88 : 1
                  }
                ]}
              >
                <Ionicons name="watch-outline" size={18} color={theme.onPrimary} />
                <Text style={[styles.routineStartBtnText, { color: theme.onPrimary }]}>
                  Start on Watch
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setPreviewWorkoutModal(false);
                  router.push('/active-workout');
                }}
                style={({ pressed }) => [
                  styles.routineStartBtn,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                    borderWidth: 1,
                    borderRadius: radii.md,
                    opacity: pressed ? 0.88 : 1
                  }
                ]}
              >
                <Ionicons name="phone-portrait-outline" size={18} color={theme.text} />
                <Text style={[styles.routineStartBtnText, { color: theme.text }]}>
                  Start on Phone
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Activity Metric Trends & Deep Analytics Modal */}
      <ActivityMetricModal
        metric={selectedActivityMetric}
        visible={selectedActivityMetric !== null}
        onClose={() => setSelectedActivityMetric(null)}
        caloriesBurned={activeSummary.caloriesConsumed || 1537}
        exerciseMinutes={activeSummary.workoutsCompleted || 1}
        standHours={9}
      />
    </View>
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
  heroCard: {
    padding: 20,
    alignItems: 'center',
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center'
  },
  activityMetricsGrid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginTop: 14
  },
  activityMetricTile: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 4
  },
  metricTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  metricTileDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  metricTileTitle: {
    fontSize: 11,
    fontWeight: '600'
  },
  metricTileValue: {
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginTop: 1
  },
  metricTileUnit: {
    fontSize: 10,
    fontWeight: '500'
  },
  metricMiniTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
    marginTop: 3
  },
  metricMiniFill: {
    height: '100%',
    borderRadius: 2
  },
  heroHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  heroSubHeader: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3
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
    color: '#94A3B8',
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
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1
  },
  dropdownTriggerText: {
    fontSize: 13,
    fontWeight: '600'
  },
  dropdownMenu: {
    position: 'absolute',
    top: 38,
    right: 0,
    width: 155,
    borderWidth: 1,
    paddingVertical: 4,
    zIndex: 999
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    marginHorizontal: 4
  },
  dropdownItemText: {
    fontSize: 13
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
    height: '100%'
  },
  mealTypeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.92)'
  },
  mealTypeTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#0F172A'
  },
  mealTimeTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 9999,
    backgroundColor: 'rgba(15, 23, 42, 0.70)'
  },
  mealTimeTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  mealCardBody: {
    padding: 12
  },
  mealCardName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4
  },
  previewHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 'auto'
  },
  previewHintText: {
    fontSize: 11,
    fontWeight: '500'
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  calorieText: {
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  modalHeaderBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  modalHeaderSubtitle: {
    fontSize: 11,
    fontWeight: '500'
  },
  routineScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 14
  },
  routineHeaderCard: {
    borderWidth: 1,
    padding: 16,
    gap: 8
  },
  routineCardTitle: {
    fontSize: 17,
    fontWeight: '700'
  },
  routineMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  routineExercisesList: {
    gap: 8
  },
  routineExerciseCard: {
    borderWidth: 1,
    padding: 12
  },
  routineExerciseTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  exerciseIndexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  exerciseIndexText: {
    fontSize: 12,
    fontWeight: '800'
  },
  routineExerciseName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2
  },
  routineExerciseMeta: {
    fontSize: 12,
    fontWeight: '500'
  },
  restTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 9999
  },
  restTimeText: {
    fontSize: 11,
    fontWeight: '600'
  },
  routineActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6
  },
  routineStartBtn: {
    flex: 1,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  routineStartBtnText: {
    fontSize: 14,
    fontWeight: '600'
  }
});
