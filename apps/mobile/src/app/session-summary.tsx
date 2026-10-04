import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Share,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useWorkoutStore } from '../store/workoutStore';
import { PrimaryButton, SecondaryButton, StatCard } from '../components/ui';

export default function SessionSummaryScreen() {
  const { theme, radii, spacing } = useAppTheme();
  const { history } = useWorkoutStore();

  const session = history[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏋️ Workout Complete with AI FitWear!\n\n${session?.title || 'Workout Session'}\nDuration: ${Math.round((session?.durationSeconds || 2700) / 60)} min\nVolume: ${session?.totalVolumeKg || 4800} kg\nSets: ${session?.totalSets || 12} • Reps: ${session?.totalReps || 120}\nSynced to Huawei Watch ⌚`
      });
    } catch {
      Alert.alert('Shared', 'Workout summary ready to share.');
    }
  };

  const minutes = Math.round((session?.durationSeconds || 2700) / 60);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Celebration Header */}
        <View style={styles.celebrationBox}>
          <View style={[styles.trophyCircle, { backgroundColor: theme.primaryGlow, borderColor: theme.primary }]}>
            <Ionicons name="trophy" size={44} color={theme.primary} />
          </View>
          <Text style={[styles.heading, { color: theme.text }]}>Workout Complete!</Text>
          <Text style={[styles.subheading, { color: theme.textSecondary }]}>
            {session?.title || 'Hypertrophy Foundation'}
          </Text>
        </View>

        {/* 4 Core Stat Tiles */}
        <View style={styles.statsGrid}>
          <View style={[styles.statTile, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="time-outline" size={20} color={theme.primary} />
            <Text style={[styles.statVal, { color: theme.text }]}>{minutes}m</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>DURATION</Text>
          </View>

          <View style={[styles.statTile, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="barbell-outline" size={20} color={theme.protein} />
            <Text style={[styles.statVal, { color: theme.text }]}>{session?.totalVolumeKg || 4800} kg</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>TOTAL VOLUME</Text>
          </View>

          <View style={[styles.statTile, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="repeat-outline" size={20} color={theme.carbs} />
            <Text style={[styles.statVal, { color: theme.text }]}>{session?.totalSets || 14}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>SETS COMPLETED</Text>
          </View>

          <View style={[styles.statTile, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="flame-outline" size={20} color={theme.fat} />
            <Text style={[styles.statVal, { color: theme.text }]}>{session?.totalReps || 148}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>TOTAL REPS</Text>
          </View>
        </View>

        {/* Watch Biometrics Card */}
        <StatCard title="Huawei Watch Telemetry">
          <View style={styles.heartRateRow}>
            <View style={styles.hrMetric}>
              <View style={styles.hrHeader}>
                <Ionicons name="heart" size={16} color={theme.fat} style={{ marginRight: 4 }} />
                <Text style={[styles.hrLabel, { color: theme.textSecondary }]}>AVG HEART RATE</Text>
              </View>
              <Text style={[styles.hrValue, { color: theme.text }]}>
                {session?.avgHeartRate || 135} <Text style={styles.hrUnit}>bpm</Text>
              </Text>
            </View>

            <View style={[styles.hrDivider, { backgroundColor: theme.border }]} />

            <View style={styles.hrMetric}>
              <View style={styles.hrHeader}>
                <Ionicons name="pulse" size={16} color={theme.fat} style={{ marginRight: 4 }} />
                <Text style={[styles.hrLabel, { color: theme.textSecondary }]}>PEAK HEART RATE</Text>
              </View>
              <Text style={[styles.hrValue, { color: theme.text }]}>
                {session?.maxHeartRate || 168} <Text style={styles.hrUnit}>bpm</Text>
              </Text>
            </View>
          </View>
        </StatCard>

        {/* Per-Exercise Breakdown */}
        <StatCard title="Exercise Breakdown">
          {(session?.exercises || []).map((ex, idx) => (
            <View
              key={idx}
              style={[
                styles.breakdownRow,
                { borderBottomColor: theme.borderSubtle }
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.exTitle, { color: theme.text }]}>
                  {ex.exerciseName}
                </Text>
                <Text style={[styles.exSetsSummary, { color: theme.textSecondary }]}>
                  {ex.sets.length} sets completed • {ex.muscleGroup}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
            </View>
          ))}
        </StatCard>

        {/* Actions */}
        <View style={styles.buttonsContainer}>
          <PrimaryButton
            label="Save & Return to Home"
            icon="checkmark-done"
            size="large"
            onPress={() => router.replace('/(tabs)')}
          />
          <SecondaryButton
            label="Share Workout"
            icon="share-social-outline"
            onPress={handleShare}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  celebrationBox: {
    alignItems: 'center',
    marginVertical: 16
  },
  trophyCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4
  },
  subheading: {
    fontSize: 15,
    fontWeight: '500'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 16
  },
  statTile: {
    width: '48%',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'flex-start'
  },
  statVal: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
    fontVariant: ['tabular-nums']
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4
  },
  heartRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4
  },
  hrMetric: {
    flex: 1,
    alignItems: 'center'
  },
  hrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  hrLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  hrValue: {
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  hrUnit: {
    fontSize: 12,
    fontWeight: '500'
  },
  hrDivider: {
    width: 1,
    height: 36
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  exTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  exSetsSummary: {
    fontSize: 12,
    marginTop: 2
  },
  buttonsContainer: {
    marginTop: 16,
    gap: 10
  }
});
