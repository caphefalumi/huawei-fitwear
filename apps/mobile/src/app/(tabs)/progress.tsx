import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Modal,
  Alert,
  Platform
} from 'react-native';
import Svg, { Rect, Line, Circle, Path } from 'react-native-svg';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme, softShadow } from '../../theme';
import { useWorkoutStore } from '../../store/workoutStore';
import { useNutritionStore } from '../../store/nutritionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { profileService } from '../../services/profileService';
import { BodyMeasurementDoc, Timestamp } from '../../types/types';
import {
  PrimaryButton,
  Stepper,
  SkeletonBlock,
  EmptyState,
  ErrorState,
  BrandLogo
} from '../../components/ui';
import {
  useMeasurementsQuery,
  useAddMeasurementMutation,
  useWorkoutHistoryQuery,
  useTodaySummaryQuery
} from '../../hooks/useQueries';

export default function ProgressScreen() {
  const { theme, radii } = useAppTheme();
  const { history } = useWorkoutStore();
  const { todaySummary } = useNutritionStore();
  const previewState = useSettingsStore((state) => state.previewState);

  const { data: qMeasurements } = useMeasurementsQuery();
  const { data: qHistory } = useWorkoutHistoryQuery();
  const { data: qSummary } = useTodaySummaryQuery();
  const addMeasurementMutation = useAddMeasurementMutation();

  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | 'All'>('1W');

  const [measurements, setMeasurements] = useState<BodyMeasurementDoc[]>([]);
  const [showAddMeasureModal, setShowAddMeasureModal] = useState<boolean>(false);
  const [newWeight, setNewWeight] = useState<number>(72.5);
  const [newBodyFat, setNewBodyFat] = useState<number>(17.0);
  const [newMuscleMass, setNewMuscleMass] = useState<number>(57.0);

  useEffect(() => {
    profileService.getMeasurements().then(setMeasurements);
  }, []);

  const activeMeasurements = qMeasurements || measurements;
  const activeHistory = qHistory || history;
  const activeSummary = qSummary || todaySummary;

  const handleSaveMeasurement = async () => {
    try {
      const saved = await addMeasurementMutation.mutateAsync({
        date: Timestamp.toDateString(),
        weightKg: newWeight,
        bodyFatPercentage: newBodyFat,
        muscleMassKg: newMuscleMass
      });
      setMeasurements((prev) => [...prev, saved]);
    } catch {
      const saved = await profileService.addMeasurement({
        date: Timestamp.toDateString(),
        weightKg: newWeight,
        bodyFatPercentage: newBodyFat,
        muscleMassKg: newMuscleMass
      });
      setMeasurements((prev) => [...prev, saved]);
    }
    setShowAddMeasureModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert('Saved', 'Measurement recorded and trend updated.');
  };

  const activeRangeData = useMemo(() => {
    const configs = {
      '1W': {
        title: 'Weekly Volume & Calorie Balance',
        sub: 'Tonnage load paired with intake response',
        totalVolume: '18,420',
        volumeTrend: '+8.4%',
        trendSub: 'vs last week',
        avgCalories: activeSummary.caloriesConsumed > 0 ? activeSummary.caloriesConsumed.toLocaleString() : '2,140',
        adherenceCalories: '94% goal hit',
        avgProtein: activeSummary.proteinConsumed > 0 ? `${Math.round(activeSummary.proteinConsumed)}g` : '132g',
        adherenceProtein: '92% adherence',
        tooltipTitle: 'Wed • Workout Peak',
        tooltipMetrics: '4,200 kg • 2,180 kcal',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        activeDay: 'Wed',
        bars: [
          { x: 16, y: 70, h: 65, active: false },
          { x: 60, y: 88, h: 47, active: false },
          { x: 104, y: 38, h: 97, active: true },
          { x: 148, y: 125, h: 10, active: false },
          { x: 192, y: 48, h: 87, active: false },
          { x: 236, y: 58, h: 77, active: false },
          { x: 280, y: 118, h: 17, active: false }
        ],
        pathD: 'M 26 62 Q 70 85, 114 55 T 202 60 T 290 80',
        insight: 'Wednesday showed optimal glycogen recovery. Keep weekly surplus on heavy pull days.'
      },
      '1M': {
        title: 'Monthly Progressive Overload',
        sub: '4-week progressive tonnage accumulation',
        totalVolume: '74,800',
        volumeTrend: '+12.6%',
        trendSub: 'vs last month',
        avgCalories: '2,180',
        adherenceCalories: '96% goal hit',
        avgProtein: '138g',
        adherenceProtein: '95% adherence',
        tooltipTitle: 'Wk 3 • Peak Volume',
        tooltipMetrics: '19,850 kg • 2,200 kcal',
        days: ['W1', 'W2', 'W3', 'W4', 'Recov', 'Peak', 'Target'],
        activeDay: 'W3',
        bars: [
          { x: 16, y: 65, h: 70, active: false },
          { x: 60, y: 50, h: 85, active: false },
          { x: 104, y: 25, h: 110, active: true },
          { x: 148, y: 40, h: 95, active: false },
          { x: 192, y: 75, h: 60, active: false },
          { x: 236, y: 30, h: 105, active: false },
          { x: 280, y: 20, h: 115, active: false }
        ],
        pathD: 'M 26 75 Q 104 55, 192 45 T 280 55',
        insight: 'Week 3 exceeded volume threshold by 12%. Deload planned for end of mesocycle.'
      },
      '3M': {
        title: 'Quarterly Hypertrophy Trend',
        sub: '12-week volume periodization overview',
        totalVolume: '228,500',
        volumeTrend: '+18.2%',
        trendSub: 'quarterly gain',
        avgCalories: '2,210',
        adherenceCalories: '93% goal hit',
        avgProtein: '140g',
        adherenceProtein: '94% adherence',
        tooltipTitle: 'M2 • Peak Mesocycle',
        tooltipMetrics: '78,400 kg • 2,240 kcal',
        days: ['M1-A', 'M1-B', 'M2-A', 'M2-B', 'M3-A', 'M3-B', 'Target'],
        activeDay: 'M2-B',
        bars: [
          { x: 16, y: 75, h: 60, active: false },
          { x: 60, y: 65, h: 70, active: false },
          { x: 104, y: 45, h: 90, active: false },
          { x: 148, y: 20, h: 115, active: true },
          { x: 192, y: 55, h: 80, active: false },
          { x: 236, y: 35, h: 100, active: false },
          { x: 280, y: 25, h: 110, active: false }
        ],
        pathD: 'M 26 80 Q 148 40, 236 55 T 280 48',
        insight: 'Mesocycle 2 showed greatest rate of strength adaptation. Lean mass gained +1.8 kg.'
      },
      'All': {
        title: 'All-Time Training Volume',
        sub: 'Cumulative athletic tonnage since inception',
        totalVolume: '482,000',
        volumeTrend: 'All-time High',
        trendSub: 'lifetime lifts',
        avgCalories: '2,190',
        adherenceCalories: '94% goal hit',
        avgProtein: '139g',
        adherenceProtein: '93% adherence',
        tooltipTitle: 'Mar • Lifetime Peak',
        tooltipMetrics: '88,200 kg volume',
        days: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
        activeDay: 'Mar',
        bars: [
          { x: 16, y: 85, h: 50, active: false },
          { x: 60, y: 70, h: 65, active: false },
          { x: 104, y: 55, h: 80, active: false },
          { x: 148, y: 45, h: 90, active: false },
          { x: 192, y: 25, h: 110, active: true },
          { x: 236, y: 35, h: 100, active: false },
          { x: 280, y: 30, h: 105, active: false }
        ],
        pathD: 'M 26 95 Q 70 85, 114 70 T 202 45 T 290 50',
        insight: 'Consistent progressive overload tracked across 482 metric tons moved.'
      }
    };
    return configs[timeRange] || configs['1W'];
  }, [timeRange, activeSummary]);

  // 1. Loading State
  if (previewState === 'loading') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.scrollContent}>
          <SkeletonBlock height={32} width={180} />
          <SkeletonBlock height={80} borderRadius={radii.xl} style={{ marginVertical: 14 }} />
          <SkeletonBlock height={200} borderRadius={radii.xl} style={{ marginBottom: 14 }} />
          <SkeletonBlock height={200} borderRadius={radii.xl} />
        </View>
      </SafeAreaView>
    );
  }

  // 2. Error State
  if (previewState === 'error') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ErrorState message="Could not load your progression history and analytics." />
      </SafeAreaView>
    );
  }

  // 3. Empty State
  if (previewState === 'empty') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <EmptyState
          icon="trending-up-outline"
          title="No Progress Recorded"
          description="Complete your first workout or log body metrics to see volume and weight curves."
          actionLabel="Log Measurement"
          onAction={() => setShowAddMeasureModal(true)}
        />
      </SafeAreaView>
    );
  }

  // Muscle distributions matching Stitch design
  const muscleDistribution = [
    { name: 'Back & Lats', pct: 28, kg: '5,157 kg', color: '#0F766E' },
    { name: 'Chest & Pecs', pct: 24, kg: '4,420 kg', color: '#C2410C' },
    { name: 'Legs & Posterior Chain', pct: 20, kg: '3,684 kg', color: '#4338CA' },
    { name: 'Deltoids', pct: 14, kg: '2,578 kg', color: '#B45309' },
    { name: 'Arms (Bi/Tri)', pct: 10, kg: '1,842 kg', color: '#BE185D' },
    { name: 'Core & Abs', pct: 4, kg: '739 kg', color: '#4D7C0F' }
  ];

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
          accessibilityLabel="Open Profile"
          onPress={() => router.push('/(tabs)/me')}
          style={[styles.profileAvatar, { backgroundColor: theme.primaryContainer, borderColor: theme.border }]}
        >
          <Ionicons name="person" size={18} color={theme.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title & Range Selector */}
        <View style={styles.headerSection}>
          <View style={styles.headerTitleRow}>
            <View>
              <Text style={[styles.mainHeadline, { color: theme.text }]}>Progress & Analytics</Text>
              <Text style={[styles.mainSubtext, { color: theme.textSecondary }]}>
                Your momentum & biometric milestones
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Share progress report"
              onPress={() => Alert.alert('Export Report', 'Generated 7-day fitness telemetry summary.')}
              style={[styles.exportBtn, { backgroundColor: theme.surfaceElevated }]}
            >
              <Ionicons name="share-outline" size={19} color={theme.primary} />
            </Pressable>
          </View>

          {/* Time Range Segmented Selector */}
          <View style={[styles.rangeSegmentedBar, { backgroundColor: theme.surfaceElevated }]}>
            {(['1W', '1M', '3M', 'All'] as const).map((r) => (
              <Pressable
                key={r}
                onPress={() => {
                  setTimeRange(r);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                }}
                style={[
                  styles.rangeTab,
                  {
                    backgroundColor: timeRange === r ? theme.primary : 'transparent',
                    borderRadius: radii.sm
                  }
                ]}
              >
                <Text
                  style={[
                    styles.rangeTabText,
                    {
                      color: timeRange === r ? theme.onPrimary : theme.textSecondary,
                      fontWeight: timeRange === r ? '700' : '500'
                    }
                  ]}
                >
                  {r}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.bentoSection}>
          <View
            style={[
              styles.volumeCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: radii.lg,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.volumeCardHeader}>
                <View style={[styles.volumeDot, { backgroundColor: theme.primary }]} />
                <Text style={[styles.volumeCardLabel, { color: theme.textSecondary }]}>
                  TOTAL VOLUME
                </Text>
              </View>

              <View style={styles.volumeNumberRow}>
                <Text style={[styles.volumeNumberLarge, { color: theme.text }]}>
                  {activeRangeData.totalVolume}
                </Text>
                <Text style={[styles.volumeUnit, { color: theme.textSecondary }]}>kg</Text>
              </View>

              <View style={styles.volumeTrendRow}>
                <View style={[styles.trendPill, { backgroundColor: theme.primaryContainer }]}>
                  <Ionicons name="trending-up" size={13} color={theme.primary} />
                  <Text style={[styles.trendPillText, { color: theme.primary }]}>
                    {activeRangeData.volumeTrend}
                  </Text>
                </View>
                <Text style={[styles.trendCompareText, { color: theme.textSecondary }]}>
                  {activeRangeData.trendSub}
                </Text>
              </View>
            </View>

            <View style={[styles.volumeCircleIcon, { backgroundColor: theme.primaryContainer }]}>
              <Ionicons name="barbell" size={26} color={theme.primary} />
            </View>
          </View>

          <View style={styles.pairGrid}>
            <View
              style={[
                styles.pairCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  borderRadius: radii.md,
                  ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                }
              ]}
            >
              <View style={styles.pairCardTop}>
                <Text style={[styles.pairCardLabel, { color: theme.textSecondary }]}>Daily Energy</Text>
                <Ionicons name="flame" size={17} color={theme.calories} />
              </View>
              <View style={{ marginVertical: 6 }}>
                <Text style={[styles.pairCardMainNumber, { color: theme.text }]}>
                  {activeRangeData.avgCalories}
                </Text>
                <Text style={[styles.pairCardUnit, { color: theme.textSecondary }]}>kcal / day</Text>
              </View>
              <View style={[styles.adherencePill, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.microGreenDot, { backgroundColor: theme.onTrack }]} />
                <Text style={[styles.adherenceText, { color: theme.text }]}>
                  {activeRangeData.adherenceCalories}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.pairCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  borderRadius: radii.md,
                  ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                }
              ]}
            >
              <View style={styles.pairCardTop}>
                <Text style={[styles.pairCardLabel, { color: theme.textSecondary }]}>Protein Target</Text>
                <Ionicons name="egg-outline" size={17} color={theme.protein} />
              </View>
              <View style={{ marginVertical: 6 }}>
                <Text style={[styles.pairCardMainNumber, { color: theme.text }]}>
                  {activeRangeData.avgProtein}
                </Text>
                <Text style={[styles.pairCardUnit, { color: theme.textSecondary }]}>daily average</Text>
              </View>
              <View style={[styles.adherencePill, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.microGreenDot, { backgroundColor: theme.primary }]} />
                <Text style={[styles.adherenceText, { color: theme.text }]}>
                  {activeRangeData.adherenceProtein}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.lg,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.chartHeaderRow}>
            <View>
              <Text style={[styles.chartCardTitle, { color: theme.text }]}>
                {activeRangeData.title}
              </Text>
              <Text style={[styles.chartCardSubtitle, { color: theme.textSecondary }]}>
                {activeRangeData.sub}
              </Text>
            </View>

            <View style={styles.chartLegendGroup}>
              <View style={styles.legendItem}>
                <View style={[styles.legendBarSample, { backgroundColor: theme.primary }]} />
                <Text style={[styles.legendText, { color: theme.textSecondary }]}>Volume</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendLineSample, { backgroundColor: theme.calories }]} />
                <Text style={[styles.legendText, { color: theme.textSecondary }]}>Intake</Text>
              </View>
            </View>
          </View>

          <View style={styles.svgChartContainer}>
            <View style={[styles.chartTooltip, { backgroundColor: theme.isDark ? '#273331' : '#121E1C' }]}>
              <Text style={styles.tooltipTitle}>{activeRangeData.tooltipTitle}</Text>
              <Text style={styles.tooltipMetrics}>
                <Text style={{ color: theme.primary, fontWeight: '700' }}>
                  {activeRangeData.tooltipMetrics}
                </Text>
              </Text>
            </View>

            <Svg width="100%" height={160} viewBox="0 0 320 160">
              <Line x1="0" y1="30" x2="320" y2="30" stroke={theme.borderSubtle} strokeDasharray="3, 3" strokeWidth="1" />
              <Line x1="0" y1="75" x2="320" y2="75" stroke={theme.borderSubtle} strokeDasharray="3, 3" strokeWidth="1" />
              <Line x1="0" y1="120" x2="320" y2="120" stroke={theme.borderSubtle} strokeDasharray="3, 3" strokeWidth="1" />

              {activeRangeData.bars.map((bar, bIdx) => (
                <Rect
                  key={bIdx}
                  x={bar.x}
                  y={bar.y}
                  width="20"
                  height={bar.h}
                  rx="5"
                  fill={bar.active ? theme.primary : theme.primaryContainer}
                />
              ))}

              <Path
                d={activeRangeData.pathD}
                fill="none"
                stroke={theme.calories}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx="104" cy="45" r="4.5" fill="#FFFFFF" stroke={theme.calories} strokeWidth="2.5" />
              <Circle cx="192" cy="50" r="3" fill={theme.calories} />
              <Circle cx="280" cy="55" r="3" fill={theme.calories} />
            </Svg>

            <View style={styles.daysLabelsRow}>
              {activeRangeData.days.map((day, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.dayLabelText,
                    {
                      color: day === activeRangeData.activeDay ? theme.primary : theme.textSecondary,
                      fontWeight: day === activeRangeData.activeDay ? '700' : '500'
                    }
                  ]}
                >
                  {day}
                </Text>
              ))}
            </View>
          </View>

          <View style={[styles.coachInsightBox, { backgroundColor: theme.surfaceElevated }]}>
            <Ionicons name="sparkles" size={18} color={theme.primary} />
            <Text style={[styles.coachInsightText, { color: theme.text }]}>
              <Text style={{ fontWeight: '700', color: theme.primary }}>Coach Insight: </Text>
              {activeRangeData.insight}
            </Text>
          </View>
        </View>

        {/* MUSCLE LOAD BALANCE BREAKDOWN */}
        <View
          style={[
            styles.muscleBalanceCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.lg,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.muscleBalanceHeader}>
            <View>
              <Text style={[styles.muscleBalanceTitle, { color: theme.text }]}>Muscle Load Balance</Text>
              <Text style={[styles.muscleBalanceSub, { color: theme.textSecondary }]}>
                Training distribution over current period
              </Text>
            </View>
            <View style={[styles.targetedTag, { backgroundColor: theme.primaryContainer }]}>
              <Text style={[styles.targetedTagText, { color: theme.primary }]}>6 Targeted</Text>
            </View>
          </View>

          {/* Horizontal Cumulative Segmented Bar */}
          <View style={[styles.cumulativeBar, { backgroundColor: theme.surfaceElevated }]}>
            {muscleDistribution.map((m) => (
              <View
                key={m.name}
                style={{ width: `${m.pct}%`, height: '100%', backgroundColor: m.color }}
              />
            ))}
          </View>

          {/* Detailed Muscle Tokens Breakdown List */}
          <View style={styles.muscleListBlock}>
            {muscleDistribution.map((m) => (
              <View key={m.name} style={styles.muscleItemRow}>
                <View style={styles.muscleItemTop}>
                  <View style={styles.muscleItemNameGroup}>
                    <View style={[styles.muscleItemDot, { backgroundColor: m.color }]} />
                    <Text style={[styles.muscleItemName, { color: theme.text }]}>{m.name}</Text>
                  </View>
                  <Text style={[styles.muscleItemVal, { color: theme.text }]}>
                    {m.pct}% <Text style={{ color: theme.textSecondary, fontWeight: '400' }}>({m.kg})</Text>
                  </Text>
                </View>
                <View style={[styles.muscleItemTrack, { backgroundColor: theme.surfaceElevated }]}>
                  <View
                    style={[
                      styles.muscleItemFill,
                      { width: `${m.pct}%`, backgroundColor: m.color, borderRadius: radii.full }
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.muscleBalanceCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.lg,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.muscleBalanceHeader}>
            <View>
              <Text style={[styles.muscleBalanceTitle, { color: theme.text }]}>Body Composition</Text>
              <Text style={[styles.muscleBalanceSub, { color: theme.textSecondary }]}>
                Scale trends & lean body mass tracking
              </Text>
            </View>
            <Pressable
              onPress={() => setShowAddMeasureModal(true)}
              style={[styles.targetedTag, { backgroundColor: theme.primaryContainer }]}
            >
              <Ionicons name="add" size={14} color={theme.primary} />
              <Text style={[styles.targetedTagText, { color: theme.primary }]}>Log Scale</Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <View style={[styles.pairCard, { flex: 1, backgroundColor: theme.surfaceElevated, borderRadius: radii.md, padding: 12 }]}>
              <Text style={[styles.pairCardLabel, { color: theme.textSecondary, fontSize: 11 }]}>BODY WEIGHT</Text>
              <Text style={[styles.pairCardMainNumber, { color: theme.text, fontSize: 20, marginVertical: 4 }]}>
                {activeMeasurements.length > 0 ? activeMeasurements[activeMeasurements.length - 1].weightKg : 72.5}
                <Text style={{ fontSize: 13, color: theme.textSecondary }}> kg</Text>
              </Text>
              <Text style={{ fontSize: 11, color: theme.onTrack }}>-0.4 kg this week</Text>
            </View>

            <View style={[styles.pairCard, { flex: 1, backgroundColor: theme.surfaceElevated, borderRadius: radii.md, padding: 12 }]}>
              <Text style={[styles.pairCardLabel, { color: theme.textSecondary, fontSize: 11 }]}>BODY FAT</Text>
              <Text style={[styles.pairCardMainNumber, { color: theme.text, fontSize: 20, marginVertical: 4 }]}>
                {activeMeasurements.length > 0 ? activeMeasurements[activeMeasurements.length - 1].bodyFatPercentage : 17.0}
                <Text style={{ fontSize: 13, color: theme.textSecondary }}>%</Text>
              </Text>
              <Text style={{ fontSize: 11, color: theme.primary }}>Lean bulk phase</Text>
            </View>

            <View style={[styles.pairCard, { flex: 1, backgroundColor: theme.surfaceElevated, borderRadius: radii.md, padding: 12 }]}>
              <Text style={[styles.pairCardLabel, { color: theme.textSecondary, fontSize: 11 }]}>MUSCLE MASS</Text>
              <Text style={[styles.pairCardMainNumber, { color: theme.text, fontSize: 20, marginVertical: 4 }]}>
                {activeMeasurements.length > 0 ? activeMeasurements[activeMeasurements.length - 1].muscleMassKg : 57.0}
                <Text style={{ fontSize: 13, color: theme.textSecondary }}> kg</Text>
              </Text>
              <Text style={{ fontSize: 11, color: theme.protein }}>+0.8 kg gained</Text>
            </View>
          </View>
        </View>

        <View style={styles.historySection}>
          <View style={styles.historyHeaderRow}>
            <Text style={[styles.historySectionTitle, { color: theme.text }]}>Logged Sessions</Text>
            <Pressable onPress={() => setShowAddMeasureModal(true)}>
              <Text style={[styles.logMetricLink, { color: theme.primary }]}>+ Log Metric</Text>
            </Pressable>
          </View>

          <View style={styles.historyStack}>
            {(activeHistory && activeHistory.length > 0
              ? activeHistory.slice(0, 5).map((s) => ({
                  title: s.title || 'Strength Session',
                  meta: `${Math.round((s.durationSeconds || 2400) / 60)}m • ${(s.totalVolumeKg || 4200).toLocaleString()} kg volume`,
                  time: s.date || 'Recent',
                  icon: 'barbell',
                  color: '#0F766E'
                }))
              : [
                  { title: 'Pull Hypertrophy', meta: '45m • 4,200 kg volume', time: 'Yesterday', icon: 'barbell', color: '#0F766E' },
                  { title: 'Push Strength', meta: '50m • 4,850 kg volume', time: '3 days ago', icon: 'fitness', color: '#C2410C' },
                  { title: 'Leg Day Foundation', meta: '40m • 5,100 kg volume', time: '5 days ago', icon: 'walk', color: '#4338CA' }
                ]
            ).map((sess, sIdx) => (
              <Pressable
                key={sIdx}
                onPress={() => router.push('/session-summary')}
                style={[
                  styles.sessionCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: radii.md,
                    ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                  }
                ]}
              >
                <View style={styles.sessionLeft}>
                  <View style={[styles.sessionIconBox, { backgroundColor: `${sess.color}15` }]}>
                    <Ionicons name={sess.icon as any} size={20} color={sess.color} />
                  </View>
                  <View style={{ minWidth: 0, flex: 1 }}>
                    <Text style={[styles.sessionTitle, { color: theme.text }]} numberOfLines={1}>
                      {sess.title}
                    </Text>
                    <Text style={[styles.sessionMeta, { color: theme.textSecondary }]}>
                      {sess.meta}
                    </Text>
                    <View style={styles.sessionWatchSyncRow}>
                      <Ionicons name="watch" size={12} color={theme.onTrack} />
                      <Text style={[styles.sessionWatchSyncText, { color: theme.textSecondary }]}>
                        {sess.time} • Watch synced
                      </Text>
                      <Ionicons name="checkmark-circle" size={12} color={theme.onTrack} />
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.historySection}>
          <View style={styles.historyHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="trophy" size={18} color={theme.primary} />
              <Text style={[styles.historySectionTitle, { color: theme.text }]}>Personal Records (1RM)</Text>
            </View>
            <Text style={{ fontSize: 12, color: theme.primary, fontWeight: '700' }}>All Verified</Text>
          </View>

          <View style={{ gap: 10 }}>
            {[
              { exercise: 'Barbell Flat Bench Press', pr: '100 kg', reps: '5 reps', date: '2 weeks ago', color: '#C2410C' },
              { exercise: 'Barbell Bent-Over Row', pr: '80 kg', reps: '8 reps', date: 'Yesterday', color: '#0F766E' },
              { exercise: 'Barbell Back Squat', pr: '125 kg', reps: '4 reps', date: '1 month ago', color: '#4338CA' },
              { exercise: 'Overhead Dumbbell Press', pr: '32 kg', reps: '8 reps', date: '3 weeks ago', color: '#B45309' }
            ].map((prItem, idx) => (
              <View
                key={idx}
                style={[
                  styles.sessionCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: radii.md,
                    ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                  }
                ]}
              >
                <View style={styles.sessionLeft}>
                  <View style={[styles.sessionIconBox, { backgroundColor: `${prItem.color}15` }]}>
                    <Ionicons name="ribbon" size={20} color={prItem.color} />
                  </View>
                  <View style={{ minWidth: 0, flex: 1 }}>
                    <Text style={[styles.sessionTitle, { color: theme.text }]} numberOfLines={1}>
                      {prItem.exercise}
                    </Text>
                    <Text style={[styles.sessionMeta, { color: theme.textSecondary }]}>
                      {prItem.pr} • {prItem.reps} • {prItem.date}
                    </Text>
                  </View>
                </View>
                <Ionicons name="checkmark-circle" size={18} color={theme.onTrack} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Log Body Measurement Modal */}
      <Modal
        visible={showAddMeasureModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddMeasureModal(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Log Body Metrics</Text>
            <Pressable onPress={() => setShowAddMeasureModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <View style={{ padding: 20, gap: 16 }}>
            <Stepper
              label="BODY WEIGHT"
              value={newWeight}
              onChange={setNewWeight}
              min={40}
              max={200}
              step={0.1}
              unit="kg"
            />
            <Stepper
              label="BODY FAT PERCENTAGE"
              value={newBodyFat}
              onChange={setNewBodyFat}
              min={5}
              max={50}
              step={0.1}
              unit="%"
            />
            <Stepper
              label="SKELETAL MUSCLE MASS"
              value={newMuscleMass}
              onChange={setNewMuscleMass}
              min={20}
              max={100}
              step={0.1}
              unit="kg"
            />

            <PrimaryButton
              label="Record Measurement"
              icon="checkmark-circle"
              size="large"
              onPress={handleSaveMeasurement}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
    gap: 16
  },
  headerSection: {
    gap: 12
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  mainHeadline: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  mainSubtext: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2
  },
  exportBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rangeSegmentedBar: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12
  },
  rangeTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rangeTabText: {
    fontSize: 12
  },
  bentoSection: {
    gap: 10
  },
  volumeCard: {
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  volumeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  volumeDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  volumeCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6
  },
  volumeNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginVertical: 4
  },
  volumeNumberLarge: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums']
  },
  volumeUnit: {
    fontSize: 14,
    fontWeight: '600'
  },
  volumeTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999
  },
  trendPillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  trendCompareText: {
    fontSize: 12
  },
  volumeCircleIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pairGrid: {
    flexDirection: 'row',
    gap: 10
  },
  pairCard: {
    flex: 1,
    borderWidth: 1,
    padding: 14
  },
  pairCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pairCardLabel: {
    fontSize: 11,
    fontWeight: '600'
  },
  pairCardMainNumber: {
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  pairCardUnit: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2
  },
  adherencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  microGreenDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5
  },
  adherenceText: {
    fontSize: 11,
    fontWeight: '600'
  },
  chartCard: {
    borderWidth: 1,
    padding: 16,
    gap: 12
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  chartCardTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  chartCardSubtitle: {
    fontSize: 12,
    marginTop: 2
  },
  chartLegendGroup: {
    alignItems: 'flex-end',
    gap: 3
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  legendBarSample: {
    width: 8,
    height: 8,
    borderRadius: 2
  },
  legendLineSample: {
    width: 10,
    height: 3,
    borderRadius: 1.5
  },
  legendText: {
    fontSize: 10,
    fontWeight: '500'
  },
  svgChartContainer: {
    position: 'relative',
    marginVertical: 4
  },
  chartTooltip: {
    position: 'absolute',
    top: -6,
    left: '30%',
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  tooltipTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  tooltipMetrics: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 1
  },
  daysLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 6
  },
  dayLabelText: {
    fontSize: 11
  },
  coachInsightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 8
  },
  coachInsightText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16
  },
  muscleBalanceCard: {
    borderWidth: 1,
    padding: 16,
    gap: 12
  },
  muscleBalanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  muscleBalanceTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  muscleBalanceSub: {
    fontSize: 12,
    marginTop: 2
  },
  targetedTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999
  },
  targetedTagText: {
    fontSize: 11,
    fontWeight: '700'
  },
  cumulativeBar: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  muscleListBlock: {
    gap: 8
  },
  muscleItemRow: {
    gap: 3
  },
  muscleItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  muscleItemNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  muscleItemDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5
  },
  muscleItemName: {
    fontSize: 12,
    fontWeight: '500'
  },
  muscleItemVal: {
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  muscleItemTrack: {
    width: '100%',
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden'
  },
  muscleItemFill: {
    height: '100%'
  },
  historySection: {
    gap: 10
  },
  historyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  historySectionTitle: {
    fontSize: 17,
    fontWeight: '700'
  },
  logMetricLink: {
    fontSize: 13,
    fontWeight: '700'
  },
  historyStack: {
    gap: 8
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  sessionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  sessionMeta: {
    fontSize: 12,
    marginTop: 1
  },
  sessionWatchSyncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3
  },
  sessionWatchSyncText: {
    fontSize: 10,
    fontWeight: '500'
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
  }
});
