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
import Svg, { Rect, Line, Circle, Polyline } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme, softShadow } from '../../theme';
import { useWorkoutStore } from '../../store/workoutStore';
import { useNutritionStore } from '../../store/nutritionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { profileService } from '../../services/profileService';
import { BodyMeasurementDoc, Timestamp } from '../../types/types';
import {
  StatCard,
  PrimaryButton,
  ProgressRing,
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

  // Time Range: 7, 30, 90 days
  const [rangeDays, setRangeDays] = useState<7 | 30 | 90>(7);

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

  // 1. Loading State (Dev Preview)
  if (previewState === 'loading') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <SkeletonBlock height={32} width={180} />
          <SkeletonBlock height={80} borderRadius={radii.xl} style={{ marginVertical: 14 }} />
          <SkeletonBlock height={200} borderRadius={radii.xl} style={{ marginBottom: 14 }} />
          <SkeletonBlock height={200} borderRadius={radii.xl} />
        </View>
      </SafeAreaView>
    );
  }

  // 2. Error State (Dev Preview)
  if (previewState === 'error') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ErrorState message="Could not load your progression history and analytics." />
      </SafeAreaView>
    );
  }

  // 3. Empty State (Dev Preview)
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

  // Chart Dimensions
  const chartWidth = 320;
  const chartHeight = 140;

  // 1. Volume Chart Data (Bar chart for past 6 sessions)
  const volumeData = history.slice(0, 6).reverse();
  const maxVolume = Math.max(...volumeData.map((v) => v.totalVolumeKg || 5000), 10000);

  // 2. Weight Line Chart Data
  const weightPoints = measurements.slice(-7);
  const minW = Math.min(...weightPoints.map((p) => p.weightKg), 70);
  const maxW = Math.max(...weightPoints.map((p) => p.weightKg), 75);
  const wRange = Math.max(maxW - minW, 1);

  const polylineCoords = weightPoints
    .map((p, i) => {
      const x = (i / Math.max(weightPoints.length - 1, 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - ((p.weightKg - minW) / wRange) * (chartHeight - 40) - 20;
      return `${x},${y}`;
    })
    .join(' ');

  const currentWeight = measurements[measurements.length - 1]?.weightKg || 72.5;
  const currentBodyFat = measurements[measurements.length - 1]?.bodyFatPercentage || 17.0;
  const currentMuscleMass = measurements[measurements.length - 1]?.muscleMassKg || 57.0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {previewState === 'offline' ? (
        <View style={[styles.offlineBanner, { backgroundColor: theme.surfaceElevated }]}>
          <Ionicons name="cloud-offline" size={16} color={theme.textSecondary} />
          <Text style={[styles.offlineText, { color: theme.textSecondary }]}>
            Offline Mode — Historical charts rendered from local store
          </Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 104 }]} showsVerticalScrollIndicator={false}>
        {/* Title Header */}
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>HISTORICAL TELEMETRY</Text>
            <Text style={[styles.pageTitle, { color: theme.text }]}>Progress</Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setShowAddMeasureModal(true);
            }}
            style={[
              styles.addMetricBtn,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: radii.full,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
            <Text style={[styles.addMetricBtnText, { color: theme.primary }]}>Log Metric</Text>
          </Pressable>
        </View>

        {/* Weekly Summary Header Plaque */}
        <View
          style={[
            styles.summaryPlaque,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.xl,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.plaqueItem}>
            <Text style={[styles.plaqueValue, { color: theme.primary }]}>
              {history.length}
            </Text>
            <Text style={[styles.plaqueLabel, { color: theme.textSecondary }]}>
              SESSIONS
            </Text>
          </View>

          <View style={[styles.plaqueDivider, { backgroundColor: theme.border }]} />

          <View style={styles.plaqueItem}>
            <Text style={[styles.plaqueValue, { color: theme.protein }]}>
              92%
            </Text>
            <Text style={[styles.plaqueLabel, { color: theme.textSecondary }]}>
              ADHERENCE
            </Text>
          </View>

          <View style={[styles.plaqueDivider, { backgroundColor: theme.border }]} />

          <View style={styles.plaqueItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="flame" size={18} color={theme.carbs} style={{ marginRight: 2 }} />
              <Text style={[styles.plaqueValue, { color: theme.carbs }]}>
                {todaySummary.currentStreak}d
              </Text>
            </View>
            <Text style={[styles.plaqueLabel, { color: theme.textSecondary }]}>
              STREAK
            </Text>
          </View>
        </View>

        {/* Range Selector */}
        <View style={[styles.rangeSelector, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderRadius: radii.full }]}>
          {([7, 30, 90] as (7 | 30 | 90)[]).map((r) => (
            <Pressable
              key={r}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setRangeDays(r);
              }}
              style={[
                styles.rangeTab,
                {
                  backgroundColor: rangeDays === r ? theme.primary : 'transparent',
                  borderRadius: radii.full
                }
              ]}
            >
              <Text
                style={[
                  styles.rangeTabText,
                  { color: rangeDays === r ? theme.onPrimary : theme.textSecondary }
                ]}
              >
                {r} Days
              </Text>
            </Pressable>
          ))}
        </View>

        {/* CHART 1: Daily Calories vs Target Bar Chart */}
        <StatCard title="Daily Calorie Adherence" subtitle="Intake vs 2,200 kcal target line">
          <View style={styles.adherenceHeroRow}>
            <ProgressRing
              size={84}
              strokeWidth={7}
              progress={0.92}
              color={theme.calories}
              primaryValue="92%"
              icon={{ name: 'fire', color: theme.ringIcon.calories }}
              accessibilityLabel="7-day calorie adherence: 92 percent"
            />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.adherenceHighlight, { color: theme.text }]}>6 of 7 Days on Target</Text>
              <Text style={[styles.adherenceNote, { color: theme.textSecondary }]}>
                Average daily intake is 2,175 kcal (within 2% of your 2,200 kcal goal).
              </Text>
            </View>
          </View>

          <View style={styles.chartWrapper}>
            <Svg width={chartWidth} height={chartHeight}>
              {/* Target Line at 2,200 kcal */}
              <Line
                x1="0"
                y1={45}
                x2={chartWidth}
                y2={45}
                stroke={theme.carbs}
                strokeWidth="1.5"
                strokeDasharray="4, 4"
              />

              {/* Calorie Bars */}
              {[2180, 2240, 2150, 2050, 2210, 2190, todaySummary.caloriesConsumed].map(
                (cal, idx) => {
                  const bWidth = 24;
                  const bSpacing = chartWidth / 7;
                  const x = idx * bSpacing + 12;
                  const bHeight = (cal / 2800) * (chartHeight - 35);
                  const y = chartHeight - 20 - bHeight;
                  const isOver = cal > 2200;

                  return (
                    <Rect
                      key={idx}
                      x={x}
                      y={y}
                      width={bWidth}
                      height={bHeight}
                      rx={6}
                      fill={isOver ? theme.overTarget : theme.calories}
                    />
                  );
                }
              )}
            </Svg>
          </View>
        </StatCard>

        {/* CHART 2: Workout Volume Bar Chart */}
        <StatCard title="Training Volume" subtitle="Tonnage lifted per session (kg)">
          <View style={styles.chartWrapper}>
            <Svg width={chartWidth} height={chartHeight}>
              {/* Baseline */}
              <Line
                x1="0"
                y1={chartHeight - 20}
                x2={chartWidth}
                y2={chartHeight - 20}
                stroke={theme.border}
                strokeWidth="1"
              />

              {volumeData.map((item, index) => {
                const barWidth = 24;
                const barSpacing = chartWidth / (volumeData.length || 1);
                const x = index * barSpacing + 16;
                const barHeight = ((item.totalVolumeKg || 4000) / maxVolume) * (chartHeight - 40);
                const y = chartHeight - 20 - barHeight;

                return (
                  <Rect
                    key={item.id}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={6}
                    fill={theme.protein}
                  />
                );
              })}
            </Svg>
          </View>

          <View style={styles.chartLegend}>
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              Peak Volume: {Math.max(...volumeData.map((v) => v.totalVolumeKg), 0).toLocaleString()} kg
            </Text>
          </View>
        </StatCard>

        {/* CHART 3: Body Composition & Weight Trend */}
        <StatCard title="Body Composition" subtitle="Morning scale & biomarker telemetry">
          <View style={styles.compositionTilesRow}>
            <View style={[styles.compTile, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
              <Text style={[styles.compTileLabel, { color: theme.textSecondary }]}>WEIGHT</Text>
              <Text style={[styles.compTileVal, { color: theme.text }]}>{currentWeight} kg</Text>
              <Text style={[styles.compTileDelta, { color: theme.primary }]}>-1.7 kg overall</Text>
            </View>

            <View style={[styles.compTile, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
              <Text style={[styles.compTileLabel, { color: theme.textSecondary }]}>BODY FAT</Text>
              <Text style={[styles.compTileVal, { color: theme.carbs }]}>{currentBodyFat}%</Text>
              <Text style={[styles.compTileDelta, { color: theme.primary }]}>-0.8% trend</Text>
            </View>

            <View style={[styles.compTile, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
              <Text style={[styles.compTileLabel, { color: theme.textSecondary }]}>MUSCLE</Text>
              <Text style={[styles.compTileVal, { color: theme.protein }]}>{currentMuscleMass} kg</Text>
              <Text style={[styles.compTileDelta, { color: theme.primary }]}>+0.9 kg gain</Text>
            </View>
          </View>

          <View style={styles.chartWrapper}>
            <Svg width={chartWidth} height={chartHeight}>
              {/* Baseline */}
              <Line
                x1="0"
                y1={chartHeight - 20}
                x2={chartWidth}
                y2={chartHeight - 20}
                stroke={theme.border}
                strokeWidth="1"
              />

              {/* Trend Polyline */}
              <Polyline
                points={polylineCoords}
                fill="none"
                stroke={theme.primary}
                strokeWidth="3.5"
              />

              {/* Data points */}
              {weightPoints.map((p, i) => {
                const x = (i / Math.max(weightPoints.length - 1, 1)) * (chartWidth - 40) + 20;
                const y = chartHeight - ((p.weightKg - minW) / wRange) * (chartHeight - 40) - 20;
                return (
                  <Circle
                    key={p.id}
                    cx={x}
                    cy={y}
                    r={5}
                    fill={theme.primary}
                    stroke={theme.background}
                    strokeWidth={2}
                  />
                );
              })}
            </Svg>
          </View>
        </StatCard>

        {/* RECENT COMPLETED SESSIONS */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            RECENT COMPLETED SESSIONS
          </Text>

          {history.length === 0 ? (
            <Text style={[styles.noSessionsText, { color: theme.textMuted }]}>
              No workouts completed yet. Start your first session in the Train tab.
            </Text>
          ) : (
            history.slice(0, 3).map((session) => (
              <View
                key={session.id}
                style={[
                  styles.sessionCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: radii.lg,
                    ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                  }
                ]}
              >
                <View style={[styles.sessionIconBox, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
                  <Ionicons name="barbell" size={18} color={theme.primary} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.sessionTitle, { color: theme.text }]}>
                    {session.title}
                  </Text>
                  <Text style={[styles.sessionMeta, { color: theme.textSecondary }]}>
                    {session.date} • {Math.round(session.durationSeconds / 60)} min • {session.exercises?.length || 0} exercises
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.sessionVolume, { color: theme.protein }]}>
                    {session.totalVolumeKg?.toLocaleString()} kg
                  </Text>
                  <Text style={[styles.sessionVolumeLabel, { color: theme.textMuted }]}>
                    TONNAGE
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* ================= ADD MEASUREMENT MODAL ================= */}
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

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Stepper
              label="BODY WEIGHT (REQUIRED)"
              value={newWeight}
              onChange={setNewWeight}
              min={40}
              max={200}
              step={0.1}
              unit="kg"
            />

            <View style={{ height: 16 }} />

            <Stepper
              label="BODY FAT PERCENTAGE (OPTIONAL)"
              value={newBodyFat}
              onChange={setNewBodyFat}
              min={5}
              max={45}
              step={0.5}
              unit="%"
            />

            <View style={{ height: 16 }} />

            <Stepper
              label="MUSCLE MASS (OPTIONAL)"
              value={newMuscleMass}
              onChange={setNewMuscleMass}
              min={30}
              max={100}
              step={0.5}
              unit="kg"
            />

            <PrimaryButton
              label="Save Measurement"
              icon="checkmark"
              size="large"
              onPress={handleSaveMeasurement}
              style={{ marginTop: 24 }}
            />
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
  content: {
    padding: 18
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
  subtitle: {
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
  addMetricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1
  },
  addMetricBtnText: {
    fontSize: 13,
    fontWeight: '700'
  },
  summaryPlaque: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    marginBottom: 16
  },
  plaqueItem: {
    flex: 1,
    alignItems: 'center'
  },
  plaqueValue: {
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  plaqueLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2
  },
  plaqueDivider: {
    width: 1,
    height: 32
  },
  rangeSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 4,
    marginBottom: 16
  },
  rangeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8
  },
  rangeTabText: {
    fontSize: 12,
    fontWeight: '700'
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 10
  },
  chartLegend: {
    alignItems: 'flex-end',
    marginTop: 4
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600'
  },
  adherenceHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  adherenceHighlight: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4
  },
  adherenceNote: {
    fontSize: 13,
    lineHeight: 18
  },
  compositionTilesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  compTile: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },
  compTileLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  compTileVal: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
    fontVariant: ['tabular-nums']
  },
  compTileDelta: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2
  },
  recentSection: {
    marginTop: 16
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 4
  },
  noSessionsText: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 16
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 12
  },
  sessionIconBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  sessionMeta: {
    fontSize: 12,
    marginTop: 2
  },
  sessionVolume: {
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  sessionVolumeLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5
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
    fontWeight: '800'
  }
});
