import React, { useState, useEffect } from 'react';
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
  ErrorState
} from '../../components/ui';

export default function ProgressScreen() {
  const { theme, radii } = useAppTheme();
  const { history } = useWorkoutStore();
  const { todaySummary } = useNutritionStore();
  const previewState = useSettingsStore((state) => state.previewState);

  // Time Range: '1W' | '1M' | '3M' | 'All'
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | 'All'>('1W');

  // Measurements
  const [measurements, setMeasurements] = useState<BodyMeasurementDoc[]>([]);
  const [showAddMeasureModal, setShowAddMeasureModal] = useState<boolean>(false);
  const [newWeight, setNewWeight] = useState<number>(72.5);
  const [newBodyFat, setNewBodyFat] = useState<number>(17.0);
  const [newMuscleMass, setNewMuscleMass] = useState<number>(57.0);

  useEffect(() => {
    profileService.getMeasurements().then(setMeasurements);
  }, []);

  const handleSaveMeasurement = async () => {
    const saved = await profileService.addMeasurement({
      date: Timestamp.toDateString(),
      weightKg: newWeight,
      bodyFatPercentage: newBodyFat,
      muscleMassKg: newMuscleMass
    });
    setMeasurements((prev) => [...prev, saved]);
    setShowAddMeasureModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert('Saved', 'Measurement recorded and trend updated.');
  };

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
          <View style={[styles.brandLogoCircle, { backgroundColor: theme.primaryContainer }]}>
            <Ionicons name="fitness" size={20} color={theme.primary} />
          </View>
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

        {/* KEY METRICS BENTO GRID */}
        <View style={styles.bentoSection}>
          {/* Total Workout Volume Card */}
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
                <Text style={[styles.volumeNumberLarge, { color: theme.text }]}>18,420</Text>
                <Text style={[styles.volumeUnit, { color: theme.textSecondary }]}>kg</Text>
              </View>

              <View style={styles.volumeTrendRow}>
                <View style={[styles.trendPill, { backgroundColor: theme.primaryContainer }]}>
                  <Ionicons name="trending-up" size={13} color={theme.primary} />
                  <Text style={[styles.trendPillText, { color: theme.primary }]}>+8.4%</Text>
                </View>
                <Text style={[styles.trendCompareText, { color: theme.textSecondary }]}>
                  vs last week
                </Text>
              </View>
            </View>

            <View style={[styles.volumeCircleIcon, { backgroundColor: theme.primaryContainer }]}>
              <Ionicons name="barbell" size={26} color={theme.primary} />
            </View>
          </View>

          {/* Secondary Metrics Pair */}
          <View style={styles.pairGrid}>
            {/* Avg Daily Calories */}
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
                <Text style={[styles.pairCardMainNumber, { color: theme.text }]}>2,140</Text>
                <Text style={[styles.pairCardUnit, { color: theme.textSecondary }]}>kcal / day avg</Text>
              </View>
              <View style={[styles.adherencePill, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.microGreenDot, { backgroundColor: theme.onTrack }]} />
                <Text style={[styles.adherenceText, { color: theme.text }]}>94% goal hit</Text>
              </View>
            </View>

            {/* Avg Protein Target */}
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
                <Text style={[styles.pairCardMainNumber, { color: theme.text }]}>132g</Text>
                <Text style={[styles.pairCardUnit, { color: theme.textSecondary }]}>daily mean</Text>
              </View>
              <View style={[styles.adherencePill, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.microGreenDot, { backgroundColor: theme.primary }]} />
                <Text style={[styles.adherenceText, { color: theme.text }]}>92% adherence</Text>
              </View>
            </View>
          </View>
        </View>

        {/* MAIN TREND CHART CARD (Stitch Weekly Volume & Calorie Balance) */}
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
                Weekly Volume & Calorie Balance
              </Text>
              <Text style={[styles.chartCardSubtitle, { color: theme.textSecondary }]}>
                Tonnage load paired with intake response
              </Text>
            </View>

            <View style={styles.chartLegendGroup}>
              <View style={styles.legendItem}>
                <View style={[styles.legendBarSample, { backgroundColor: theme.primary }]} />
                <Text style={[styles.legendText, { color: theme.textSecondary }]}>Volume (kg)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendLineSample, { backgroundColor: theme.calories }]} />
                <Text style={[styles.legendText, { color: theme.textSecondary }]}>Intake (kcal)</Text>
              </View>
            </View>
          </View>

          {/* Tooltip & SVG Chart Canvas */}
          <View style={styles.svgChartContainer}>
            {/* Wednesday Active Peak Tooltip */}
            <View style={[styles.chartTooltip, { backgroundColor: theme.isDark ? '#273331' : '#121E1C' }]}>
              <Text style={styles.tooltipTitle}>Wed • Workout Peak</Text>
              <Text style={styles.tooltipMetrics}>
                <Text style={{ color: '#4FD6C4', fontWeight: '700' }}>4,200 kg</Text> •{' '}
                <Text style={{ color: '#FF8A5B', fontWeight: '700' }}>2,180 kcal</Text>
              </Text>
            </View>

            <Svg width="100%" height={160} viewBox="0 0 320 160">
              {/* Horizontal Gridlines */}
              <Line x1="0" y1="30" x2="320" y2="30" stroke={theme.borderSubtle} strokeDasharray="3, 3" strokeWidth="1" />
              <Line x1="0" y1="75" x2="320" y2="75" stroke={theme.borderSubtle} strokeDasharray="3, 3" strokeWidth="1" />
              <Line x1="0" y1="120" x2="320" y2="120" stroke={theme.borderSubtle} strokeDasharray="3, 3" strokeWidth="1" />

              {/* Volume Bars */}
              {/* Mon */}
              <Rect x="16" y="70" width="20" height="65" rx="5" fill={theme.primary} opacity="0.85" />
              {/* Tue */}
              <Rect x="60" y="88" width="20" height="47" rx="5" fill={theme.primary} opacity="0.85" />
              {/* Wed (Peak) */}
              <Rect x="104" y="38" width="20" height="97" rx="5" fill={theme.primary} />
              {/* Thu (Rest) */}
              <Rect x="148" y="125" width="20" height="10" rx="3" fill={theme.primaryContainer} />
              {/* Fri */}
              <Rect x="192" y="48" width="20" height="87" rx="5" fill={theme.primary} opacity="0.85" />
              {/* Sat */}
              <Rect x="236" y="58" width="20" height="77" rx="5" fill={theme.primary} opacity="0.85" />
              {/* Sun (Recovery) */}
              <Rect x="280" y="118" width="20" height="17" rx="4" fill={theme.primaryContainer} />

              {/* Calorie Intake Curve */}
              <Path
                d="M 26 62 Q 70 85, 114 55 T 202 60 T 290 80"
                fill="none"
                stroke="#D9480F"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx="114" cy="55" r="4.5" fill="#FFFFFF" stroke="#D9480F" strokeWidth="2.5" />
              <Circle cx="202" cy="60" r="3" fill="#D9480F" />
              <Circle cx="246" cy="68" r="3" fill="#D9480F" />
            </Svg>

            {/* Day Labels Row */}
            <View style={styles.daysLabelsRow}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <Text
                  key={day}
                  style={[
                    styles.dayLabelText,
                    {
                      color: day === 'Wed' ? theme.primary : theme.textSecondary,
                      fontWeight: day === 'Wed' ? '700' : '500'
                    }
                  ]}
                >
                  {day}
                </Text>
              ))}
            </View>
          </View>

          {/* Coach Smart Insight Pill */}
          <View style={[styles.coachInsightBox, { backgroundColor: theme.surfaceElevated }]}>
            <Ionicons name="sparkles" size={18} color={theme.primary} />
            <Text style={[styles.coachInsightText, { color: theme.text }]}>
              <Text style={{ fontWeight: '700', color: theme.primary }}>Volume Surge: </Text>
              Wednesday showed optimal glycogen recovery. Keep weekly surplus on heavy pull days.
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

        {/* LOGGED SESSIONS (WORKOUT HISTORY) */}
        <View style={styles.historySection}>
          <View style={styles.historyHeaderRow}>
            <Text style={[styles.historySectionTitle, { color: theme.text }]}>Logged Sessions</Text>
            <Pressable onPress={() => setShowAddMeasureModal(true)}>
              <Text style={[styles.logMetricLink, { color: theme.primary }]}>+ Log Metric</Text>
            </Pressable>
          </View>

          <View style={styles.historyStack}>
            {[
              { title: 'Pull Hypertrophy', meta: '45m • 4,200 kg volume', time: 'Yesterday', icon: 'barbell', color: '#0F766E' },
              { title: 'Push Strength', meta: '50m • 4,850 kg volume', time: '3 days ago', icon: 'fitness', color: '#C2410C' },
              { title: 'Leg Day Foundation', meta: '40m • 5,100 kg volume', time: '5 days ago', icon: 'walk', color: '#4338CA' }
            ].map((sess, sIdx) => (
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
