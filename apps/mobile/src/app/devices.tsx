import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme';
import { useDeviceStore } from '../store/deviceStore';
import { useNutritionStore } from '../store/nutritionStore';
import { useWorkoutStore } from '../store/workoutStore';
import { Timestamp, DeviceDoc } from '../types/types';
import { PrimaryButton, SecondaryButton, StatCard } from '../components/ui';

export default function DevicesScreen() {
  const { theme, radii, spacing } = useAppTheme();
  const { devices, syncDevice, pairWatch } = useDeviceStore();
  const { todaySummary } = useNutritionStore();
  const { plan } = useWorkoutStore();

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showPairModal, setShowPairModal] = useState<boolean>(false);
  const [pairStep, setPairStep] = useState<1 | 2 | 3>(1);

  const watch = devices.find((d) => d.type === 'watch') || devices[0];

  const handleSyncNow = async () => {
    if (!watch) return;
    setIsSyncing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    await syncDevice(watch.id);
    setIsSyncing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert('Sync Complete', 'Huawei Watch GT 4 mirrored telemetry is fully up to date.');
  };

  const handleStartPairing = () => {
    setPairStep(1);
    setShowPairModal(true);
    // Simulate step 1 -> step 2
    setTimeout(() => {
      setPairStep(2);
    }, 1800);
  };

  const handleConfirmPair = async () => {
    setPairStep(3);
    await pairWatch('Huawei Watch GT 4', 'ARA-B19');
    setTimeout(() => {
      setShowPairModal(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Alert.alert('Pairing Success', 'Your smartwatch is now connected.');
    }, 1500);
  };

  const caloriesLeft = Math.max(todaySummary.calorieTarget - todaySummary.caloriesConsumed, 0);
  const proteinLeft = Math.max(todaySummary.proteinTarget - todaySummary.proteinConsumed, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.surfaceElevated }]}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Connected Devices</Text>
        <Pressable
          onPress={() => router.push('/watch-preview' as any)}
          style={[styles.previewWatchBtn, { backgroundColor: theme.surfaceElevated }]}
        >
          <Ionicons name="eye-outline" size={20} color={theme.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Device Cards */}
        {devices.map((device) => {
          const isWatch = device.type === 'watch';
          const isConnected = device.connectionStatus === 'connected';

          return (
            <View
              key={device.id}
              style={[
                styles.deviceCard,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <View style={styles.deviceRow}>
                <View
                  style={[
                    styles.deviceIconCircle,
                    { backgroundColor: theme.surfaceElevated }
                  ]}
                >
                  <Ionicons
                    name={isWatch ? 'watch' : 'phone-portrait'}
                    size={28}
                    color={theme.primary}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.deviceNameRow}>
                    <Text style={[styles.deviceName, { color: theme.text }]}>
                      {device.name}
                    </Text>
                    <View
                      style={[
                        styles.statusDotPill,
                        {
                          backgroundColor: isConnected
                            ? theme.onTrackBg
                            : theme.almostThereBg
                        }
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor: isConnected
                              ? theme.onTrack
                              : theme.almostThere
                          }
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: isConnected
                              ? theme.onTrack
                              : theme.almostThere
                          }
                        ]}
                      >
                        {device.connectionStatus.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.deviceModel, { color: theme.textSecondary }]}>
                    {device.model} • {device.appVersion}
                  </Text>

                  <View style={styles.deviceMetaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="battery-charging"
                        size={14}
                        color={theme.primary}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                        {device.batteryLevel}%
                      </Text>
                    </View>

                    <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>

                    <View style={styles.metaItem}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={theme.textMuted}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                        Synced {Timestamp.formatTime(device.lastSyncTime)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Sync Actions */}
        <View style={styles.actionsBox}>
          <PrimaryButton
            label={isSyncing ? 'Syncing with Watch...' : 'Sync Now'}
            icon="sync"
            loading={isSyncing}
            size="large"
            onPress={handleSyncNow}
          />
          <SecondaryButton
            label="Pair Another Watch"
            icon="add-circle-outline"
            onPress={handleStartPairing}
          />
        </View>

        {/* "What the watch shows" Mirroring Card */}
        <StatCard title="Mirrored Watch Telemetry">
          <Text style={[styles.mirrorSub, { color: theme.textSecondary }]}>
            These values are updated simultaneously on your wrist in real-time:
          </Text>

          <View style={styles.mirrorList}>
            <View style={[styles.mirrorRow, { borderBottomColor: theme.borderSubtle }]}>
              <Text style={[styles.mirrorLabel, { color: theme.text }]}>Calories Left</Text>
              <Text style={[styles.mirrorValue, { color: theme.primary }]}>
                {caloriesLeft} kcal
              </Text>
            </View>

            <View style={[styles.mirrorRow, { borderBottomColor: theme.borderSubtle }]}>
              <Text style={[styles.mirrorLabel, { color: theme.text }]}>Protein Deficit</Text>
              <Text style={[styles.mirrorValue, { color: theme.protein }]}>
                {Math.round(proteinLeft)}g left
              </Text>
            </View>

            <View style={[styles.mirrorRow, { borderBottomColor: theme.borderSubtle }]}>
              <Text style={[styles.mirrorLabel, { color: theme.text }]}>Active Routine</Text>
              <Text style={[styles.mirrorValue, { color: theme.text }]}>
                Day {plan?.days[plan?.currentDayIndex || 0]?.dayNumber}:{' '}
                {plan?.days[plan?.currentDayIndex || 0]?.muscleGroup}
              </Text>
            </View>

            <View style={styles.mirrorRow}>
              <Text style={[styles.mirrorLabel, { color: theme.text }]}>Rep Counter Engine</Text>
              <Text style={[styles.mirrorValue, { color: theme.carbs }]}>
                IMU Accelerometer + Gyro
              </Text>
            </View>
          </View>
        </StatCard>
      </ScrollView>

      {/* ================= 3-STEP PAIRING WIZARD MODAL ================= */}
      <Modal
        visible={showPairModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPairModal(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Pair Huawei Smartwatch</Text>
            <Pressable onPress={() => setShowPairModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.pairContent}>
            {pairStep === 1 ? (
              <View style={styles.stepBox}>
                <ActivityIndicator size="large" color={theme.primary} style={{ marginBottom: 20 }} />
                <Text style={[styles.stepTitle, { color: theme.text }]}>Searching for Watch...</Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  Ensure your Huawei Watch has Bluetooth enabled and the AI FitWear wearable app open.
                </Text>
              </View>
            ) : null}

            {pairStep === 2 ? (
              <View style={styles.stepBox}>
                <View style={[styles.codeBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.primary }]}>
                  <Text style={[styles.codeText, { color: theme.primary }]}>8 4 9 2 0 1</Text>
                </View>
                <Text style={[styles.stepTitle, { color: theme.text }]}>Confirm Pairing Code</Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  Verify that this 6-digit code matches the number shown on your watch screen.
                </Text>

                <PrimaryButton
                  label="Confirm & Link"
                  size="large"
                  onPress={handleConfirmPair}
                  style={{ width: '100%', marginTop: 24 }}
                />
              </View>
            ) : null}

            {pairStep === 3 ? (
              <View style={styles.stepBox}>
                <View style={[styles.successPairCircle, { backgroundColor: theme.onTrackBg }]}>
                  <Ionicons name="checkmark" size={48} color={theme.onTrack} />
                </View>
                <Text style={[styles.stepTitle, { color: theme.text }]}>Pairing Complete!</Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  Sensors connected and bi-directional telemetry enabled.
                </Text>
              </View>
            ) : null}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  backBtn: {
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
  previewWatchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  deviceCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  deviceIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deviceNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '800'
  },
  statusDotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800'
  },
  deviceModel: {
    fontSize: 12,
    marginBottom: 8
  },
  deviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500'
  },
  metaDot: {
    fontSize: 12
  },
  actionsBox: {
    marginVertical: 12,
    gap: 8
  },
  mirrorSub: {
    fontSize: 13,
    marginBottom: 12
  },
  mirrorList: {
    gap: 8
  },
  mirrorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  mirrorLabel: {
    fontSize: 14,
    fontWeight: '600'
  },
  mirrorValue: {
    fontSize: 14,
    fontWeight: '700'
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
  },
  pairContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepBox: {
    alignItems: 'center',
    width: '100%'
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center'
  },
  stepDesc: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 280
  },
  codeBox: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24
  },
  codeText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4
  },
  successPairCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  }
});
