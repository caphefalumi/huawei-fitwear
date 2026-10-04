import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, watchFace } from '../theme';
import { useNutritionStore } from '../store/nutritionStore';
import { ProgressRing, StatusBadge } from '../components/ui';

export default function WatchPreviewScreen() {
  const { theme } = useAppTheme();
  const { todaySummary } = useNutritionStore();

  const [activeWatchPage, setActiveWatchPage] = useState<1 | 2>(1);

  const caloriesLeft = Math.max(todaySummary.calorieTarget - todaySummary.caloriesConsumed, 0);
  const proteinLeft = Math.max(todaySummary.proteinTarget - todaySummary.proteinConsumed, 0);

  // Multi-arc watch progress data
  const calRatio = Math.min(todaySummary.caloriesConsumed / todaySummary.calorieTarget, 1);
  const pRatio = Math.min(todaySummary.proteinConsumed / todaySummary.proteinTarget, 1);
  const cRatio = Math.min(todaySummary.carbsConsumed / todaySummary.carbsTarget, 1);
  const fRatio = Math.min(todaySummary.fatConsumed / todaySummary.fatTarget, 1);

  const watchRings = [
    { value: calRatio, color: watchFace.calories, radius: 100, strokeWidth: 10, icon: 'fire' as const },
    { value: pRatio, color: watchFace.protein, radius: 86, strokeWidth: 5, icon: 'arm-flex' as const },
    { value: cRatio, color: watchFace.carbs, radius: 76, strokeWidth: 5, icon: 'grain' as const },
    { value: fRatio, color: watchFace.fat, radius: 66, strokeWidth: 5, icon: 'water' as const }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.closeBtn, { backgroundColor: theme.surfaceElevated }]}
        >
          <Ionicons name="close" size={22} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Huawei Watch Preview</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.subTitle, { color: theme.textSecondary }]}>
          Exact 466 × 466 AMOLED Glance Reference (HarmonyOS NEXT API 11+)
        </Text>

        {/* Circular Hardware Frame */}
        <View style={styles.hardwareBezel}>
          <View style={styles.watchScreen}>
            {activeWatchPage === 1 ? (
              /* ================= PAGE 1: NUTRITION DIAL ================= */
              <View style={styles.watchPage}>
                <Text style={styles.watchTime}>10:42</Text>

                <View style={styles.ringCenter}>
                  <ProgressRing
                    size={240}
                    rings={watchRings}
                    primaryValue={caloriesLeft}
                    primaryLabel="KCAL LEFT"
                    secondaryLabel={`${todaySummary.caloriesConsumed} eaten`}
                    icon={{ name: 'fire', color: watchFace.ringIcon.calories }}
                    isWatch={true}
                    accessibilityLabel={`Huawei Watch face calories: ${caloriesLeft} kilocalories left`}
                  />
                </View>

                <View style={styles.watchStatusRow}>
                  <StatusBadge status={todaySummary.status} size="small" />
                  <Text style={styles.watchProteinChip}>{Math.round(proteinLeft)}g P left</Text>
                </View>
              </View>
            ) : (
              /* ================= PAGE 2: ACTIVE WORKOUT GLANCE ================= */
              <View style={styles.watchPage}>
                <View style={styles.workoutTopRow}>
                  <Ionicons name="barbell" size={14} color={watchFace.workout} />
                  <Text style={styles.watchExerciseName}>BENCH PRESS</Text>
                </View>

                <View style={styles.ringCenter}>
                  <ProgressRing
                    size={190}
                    strokeWidth={8}
                    progress={0.8}
                    color={watchFace.workout}
                    primaryValue="8"
                    primaryLabel="OF 10 REPS"
                    icon={{ name: 'dumbbell', color: watchFace.ringIcon.workout }}
                    isWatch={true}
                    isWorkoutRing={true}
                    accessibilityLabel="Huawei Watch face workout: 8 of 10 reps completed"
                  />
                </View>

                <View style={styles.watchRestFooter}>
                  <Ionicons name="timer-outline" size={14} color={watchFace.rest} />
                  <Text style={styles.watchRestTimer}>REST: 90s AUTO</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Page Switcher */}
        <View style={[styles.pageToggle, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <Pressable
            onPress={() => setActiveWatchPage(1)}
            style={[
              styles.toggleBtn,
              { backgroundColor: activeWatchPage === 1 ? theme.primary : 'transparent' }
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: activeWatchPage === 1 ? theme.onPrimary : theme.textSecondary }
              ]}
            >
              Page 1: Nutrition Dial
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveWatchPage(2)}
            style={[
              styles.toggleBtn,
              { backgroundColor: activeWatchPage === 2 ? theme.primary : 'transparent' }
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: activeWatchPage === 2 ? theme.onPrimary : theme.textSecondary }
              ]}
            >
              Page 2: Workout Glance
            </Text>
          </Pressable>
        </View>

        {/* Architecture Spec Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>HarmonyOS Architecture</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            • Hardware: 1.43-inch circular AMOLED (466x466 px, 326 PPI){'\n'}
            • Codebase: ArkTS in `apps/watch/entry/src/main/ets`{'\n'}
            • Protocol: Bi-directional Bluetooth LE socket mirror
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700'
  },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40
  },
  subTitle: {
    fontSize: 13,
    marginBottom: 24,
    textAlign: 'center'
  },
  hardwareBezel: {
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: watchFace.bezel,
    borderWidth: 6,
    borderColor: watchFace.bezelBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.8)'
      },
      default: {
        shadowColor: watchFace.screen,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10
      }
    }),
    marginBottom: 24
  },
  watchScreen: {
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: watchFace.screen,
    overflow: 'hidden'
  },
  watchPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 20
  },
  watchTime: {
    color: watchFace.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  watchStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  watchProteinChip: {
    color: watchFace.protein,
    fontSize: 11,
    fontWeight: '700'
  },
  workoutTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  watchExerciseName: {
    color: watchFace.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  workoutRepBox: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  watchRepNumber: {
    color: watchFace.workout,
    fontSize: 72,
    fontWeight: '900',
    fontVariant: ['tabular-nums']
  },
  watchRepUnit: {
    color: watchFace.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: -8
  },
  watchRestFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: watchFace.chip,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12
  },
  watchRestTimer: {
    color: watchFace.rest,
    fontSize: 11,
    fontWeight: '700'
  },
  pageToggle: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 24,
    width: '100%'
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700'
  },
  infoCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20
  }
});
