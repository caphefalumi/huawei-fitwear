import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme, softShadow } from '../../theme';
import { useUserStore } from '../../store/userStore';
import { useNutritionStore } from '../../store/nutritionStore';
import { useWorkoutStore } from '../../store/workoutStore';
import { useDeviceStore } from '../../store/deviceStore';
import { useSettingsStore, ThemeMode, DevPreviewState } from '../../store/settingsStore';
import {
  PrimaryButton,
  SecondaryButton,
  Stepper
} from '../../components/ui';
import {
  useUserProfileQuery,
  useUpdateProfileMutation
} from '../../hooks/useQueries';

export default function MeScreen() {
  const { theme, radii } = useAppTheme();
  const { user, updateUser, resetUser } = useUserStore();
  const { resetNutrition } = useNutritionStore();
  const { resetWorkout } = useWorkoutStore();
  const { devices, resetDevices } = useDeviceStore();

  const { data: qUser } = useUserProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const activeUser = qUser || user;

  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const previewState = useSettingsStore((state) => state.previewState);
  const setPreviewState = useSettingsStore((state) => state.setPreviewState);
  const simulateWatchActive = useSettingsStore((state) => state.simulateWatchActive);
  const setSimulateWatchActive = useSettingsStore((state) => state.setSimulateWatchActive);

  const watchDevice = devices.find((d) => d.type === 'watch') || devices[0];

  const [showEditTargetsModal, setShowEditTargetsModal] = useState<boolean>(false);
  const [editCalories, setEditCalories] = useState<number>(user.dailyCalorieTarget);
  const [editProtein, setEditProtein] = useState<number>(user.dailyProteinTarget);
  const [editCarbs, setEditCarbs] = useState<number>(user.dailyCarbsTarget);
  const [editFat, setEditFat] = useState<number>(user.dailyFatTarget);

  const handleSaveTargets = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        dailyCalorieTarget: editCalories,
        dailyProteinTarget: editProtein,
        dailyCarbsTarget: editCarbs,
        dailyFatTarget: editFat
      });
      await updateUser({
        dailyCalorieTarget: editCalories,
        dailyProteinTarget: editProtein,
        dailyCarbsTarget: editCarbs,
        dailyFatTarget: editFat
      });
    } catch {
      await updateUser({
        dailyCalorieTarget: editCalories,
        dailyProteinTarget: editProtein,
        dailyCarbsTarget: editCarbs,
        dailyFatTarget: editFat
      });
    }
    setShowEditTargetsModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Alert.alert('Targets Saved', 'Daily macro targets synced across your devices.');
  };

  const handleResetAllData = () => {
    Alert.alert(
      'Reset All Mock Data?',
      'Restore all workouts, meals, and targets to initial defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetUser();
            resetNutrition();
            resetWorkout();
            resetDevices();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
            Alert.alert('Reset Complete', 'Mock data restored.');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Erase Profile & Data',
      'Are you sure you want to permanently erase all locally stored fitness records? (Step 1 of 2)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'This action is irreversible. All offline logs will be cleared.',
              [
                { text: 'Keep Data', style: 'cancel' },
                {
                  text: 'Permanently Erase',
                  style: 'destructive',
                  onPress: () => {
                    resetUser();
                    resetNutrition();
                    resetWorkout();
                    resetDevices();
                    router.replace('/onboarding');
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 104 }]} showsVerticalScrollIndicator={false}>
        {/* Title Header */}
        <View style={styles.titleRow}>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>ATHLETE PROFILE</Text>
          <Text style={[styles.pageTitle, { color: theme.text }]}>Settings</Text>
        </View>

        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.xl,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={[styles.avatarCircle, { backgroundColor: theme.surfaceElevated, borderRadius: radii.full }]}>
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {activeUser.fullName.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: theme.text }]}>{activeUser.fullName}</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{activeUser.email}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.goalBadge, { backgroundColor: theme.onTrackBg, borderRadius: radii.full }]}>
                <Text style={[styles.goalBadgeText, { color: theme.onTrack }]}>
                  {activeUser.goal.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.userMeta, { color: theme.textMuted }]}>
                {activeUser.heightCm} cm • {activeUser.weightKg} kg
              </Text>
            </View>
          </View>
        </View>

        {/* Hardware & Watch Telemetry Plaque */}
        <Pressable
          onPress={() => router.push('/devices')}
          style={({ pressed }) => [
            styles.hardwareCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.xl,
              opacity: pressed ? 0.85 : 1,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={[styles.hardwareIconBox, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
            <Ionicons name="watch" size={24} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.hardwareTitleRow}>
              <Text style={[styles.hardwareName, { color: theme.text }]}>
                {watchDevice?.name || 'Huawei Watch GT 4'}
              </Text>
              <View style={[styles.connPill, { backgroundColor: theme.onTrackBg, borderRadius: radii.full }]}>
                <Text style={[styles.connPillText, { color: theme.primary }]}>
                  {watchDevice?.connectionStatus.toUpperCase() || 'CONNECTED'}
                </Text>
              </View>
            </View>
            <Text style={[styles.hardwareSub, { color: theme.textSecondary }]}>
              Battery: {watchDevice?.batteryLevel || 84}% • Firmware v2.1.0 • Sensor Active
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </Pressable>

        {/* ================= SECTION: THEME SWITCHER ================= */}
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>VISUAL THEME</Text>
        <View style={[styles.themePillsTrack, { backgroundColor: theme.surfaceElevated, borderColor: theme.border, borderRadius: radii.full }]}>
          {(['dark', 'light', 'system'] as ThemeMode[]).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setThemeMode(mode);
              }}
              style={[
                styles.themePill,
                {
                  backgroundColor: themeMode === mode ? theme.primary : 'transparent',
                  borderRadius: radii.full
                }
              ]}
            >
              <Ionicons
                name={
                  mode === 'dark'
                    ? 'moon'
                    : mode === 'light'
                    ? 'sunny'
                    : 'phone-portrait-outline'
                }
                size={14}
                color={themeMode === mode ? theme.onPrimary : theme.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.themePillText,
                  { color: themeMode === mode ? theme.onPrimary : theme.textSecondary }
                ]}
              >
                {mode === 'dark' ? 'Dark' : mode === 'light' ? 'Pure Light' : 'System'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ================= SECTION: NUTRITION TARGETS ================= */}
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>DAILY TARGETS</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setShowEditTargetsModal(true);
            }}
          >
            <Text style={[styles.sectionActionText, { color: theme.primary }]}>Edit</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.groupedCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.xl,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={styles.targetsGrid}>
            <View style={styles.targetItem}>
              <Text style={[styles.targetNumber, { color: theme.text }]}>
                {activeUser.dailyCalorieTarget.toLocaleString()}
              </Text>
              <Text style={[styles.targetLabel, { color: theme.textSecondary }]}>
                KCAL
              </Text>
            </View>

            <View style={styles.targetItem}>
              <Text style={[styles.targetNumber, { color: theme.protein }]}>
                {activeUser.dailyProteinTarget}g
              </Text>
              <Text style={[styles.targetLabel, { color: theme.textSecondary }]}>
                PROTEIN
              </Text>
            </View>

            <View style={styles.targetItem}>
              <Text style={[styles.targetNumber, { color: theme.carbs }]}>
                {activeUser.dailyCarbsTarget}g
              </Text>
              <Text style={[styles.targetLabel, { color: theme.textSecondary }]}>
                CARBS
              </Text>
            </View>

            <View style={styles.targetItem}>
              <Text style={[styles.targetNumber, { color: theme.fat }]}>
                {activeUser.dailyFatTarget}g
              </Text>
              <Text style={[styles.targetLabel, { color: theme.textSecondary }]}>
                FAT
              </Text>
            </View>
          </View>
        </View>

        {/* ================= SECTION: TRAINING PREFERENCES ================= */}
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>PREFERENCES</Text>
        <View
          style={[
            styles.groupedCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.xl,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <View style={[styles.groupedRow, { borderBottomColor: theme.borderSubtle }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: theme.text }]}>Rep Completion Window</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Auto-finish rep zone</Text>
            </View>
            <Text style={[styles.rowValue, { color: theme.primary }]}>
              {user.repWindow.min} - {user.repWindow.max} reps
            </Text>
          </View>

          <View style={[styles.groupedRow, { borderBottomColor: theme.borderSubtle }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: theme.text }]}>Default Rest Countdown</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Between active sets</Text>
            </View>
            <Text style={[styles.rowValue, { color: theme.text }]}>
              {user.defaultRestSeconds}s
            </Text>
          </View>

          <View style={[styles.groupedRow, { borderBottomColor: theme.borderSubtle }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: theme.text }]}>Haptic Rest End Buzz</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Wrist pulse when rest ends</Text>
            </View>
            <Switch
              value={user.hapticRestBuzz}
              onValueChange={(val) => updateUser({ hapticRestBuzz: val })}
              trackColor={{ false: theme.neutralFill, true: theme.primary }}
              thumbColor={theme.onStatus}
            />
          </View>

          <View style={[styles.groupedRow, { borderBottomColor: theme.borderSubtle }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: theme.text }]}>Unit System</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Metric vs Imperial</Text>
            </View>
            <Pressable
              onPress={() => {
                const nextUnit = user.unitSystem === 'metric' ? 'imperial' : 'metric';
                updateUser({ unitSystem: nextUnit });
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              }}
              style={[styles.unitPill, { backgroundColor: theme.surfaceElevated, borderRadius: radii.full }]}
            >
              <Text style={[styles.unitPillText, { color: theme.primary }]}>
                {user.unitSystem === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lb/ft)'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.groupedRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: theme.text }]}>Daily Reminders</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Workout & meal pushes</Text>
            </View>
            <Switch
              value={user.notificationsEnabled}
              onValueChange={(val) => updateUser({ notificationsEnabled: val })}
              trackColor={{ false: theme.neutralFill, true: theme.primary }}
              thumbColor={theme.onStatus}
            />
          </View>
        </View>

        {/* ================= SECTION: DEVELOPER TOOLS ================= */}
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>DEVELOPER TOOLS</Text>
        <View
          style={[
            styles.groupedCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderRadius: radii.xl,
              ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
            }
          ]}
        >
          <Text style={[styles.devLabel, { color: theme.textSecondary }]}>STATE PREVIEW OVERRIDE</Text>
          <View style={styles.statePillsWrap}>
            {(['normal', 'loading', 'empty', 'error', 'offline'] as DevPreviewState[]).map((st) => (
              <Pressable
                key={st}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setPreviewState(st);
                }}
                style={[
                  styles.statePill,
                  {
                    backgroundColor: previewState === st ? theme.primary : theme.surfaceElevated,
                    borderRadius: radii.full
                  }
                ]}
              >
                <Text
                  style={[
                    styles.statePillText,
                    { color: previewState === st ? theme.onPrimary : theme.text }
                  ]}
                >
                  {st.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.groupedRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.borderSubtle, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.borderSubtle }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: theme.text }]}>Watch Rep Simulator</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Emits live reps every 1.5s</Text>
            </View>
            <Switch
              value={simulateWatchActive}
              onValueChange={(val) => setSimulateWatchActive(val)}
              trackColor={{ false: theme.neutralFill, true: theme.primary }}
              thumbColor={theme.onStatus}
            />
          </View>

          {/* Watch Face Preview Link */}
          <Pressable
            onPress={() => router.push('/watch-preview' as any)}
            style={[styles.navigationLinkRow, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.borderSubtle }]}
          >
            <Ionicons name="watch-outline" size={20} color={theme.primary} style={{ marginRight: 12 }} />
            <Text style={[styles.navLinkText, { color: theme.text }]}>Huawei Watch AMOLED Face</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </Pressable>

          {/* Ring Symbolic Gallery Link */}
          <Pressable
            onPress={() => router.push('/ring-gallery' as any)}
            style={styles.navigationLinkRow}
          >
            <Ionicons name="sparkles-outline" size={20} color={theme.primary} style={{ marginRight: 12 }} />
            <Text style={[styles.navLinkText, { color: theme.text }]}>Ring Symbolic Gallery</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </Pressable>
        </View>

        {/* ================= SECTION: RESET & DANGER ZONE ================= */}
        <View style={styles.actionButtonsCol}>
          <SecondaryButton
            label="Restore Initial Mock Data"
            icon="refresh"
            onPress={handleResetAllData}
          />
          <Pressable
            onPress={handleDeleteAccount}
            style={[styles.dangerButton, { backgroundColor: theme.surfaceElevated, borderRadius: radii.full }]}
          >
            <Ionicons name="trash-outline" size={18} color={theme.error} style={{ marginRight: 8 }} />
            <Text style={[styles.dangerButtonText, { color: theme.error }]}>
              Erase Local Profile
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ================= EDIT TARGETS MODAL ================= */}
      <Modal
        visible={showEditTargetsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditTargetsModal(false)}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Daily Targets</Text>
            <Pressable onPress={() => setShowEditTargetsModal(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Stepper
              label="DAILY CALORIES"
              value={editCalories}
              onChange={setEditCalories}
              min={1200}
              max={4500}
              step={50}
              unit="kcal"
            />
            <View style={{ height: 16 }} />
            <Stepper
              label="DAILY PROTEIN"
              value={editProtein}
              onChange={setEditProtein}
              min={50}
              max={300}
              step={5}
              unit="g"
            />
            <View style={{ height: 16 }} />
            <Stepper
              label="DAILY CARBOHYDRATES"
              value={editCarbs}
              onChange={setEditCarbs}
              min={50}
              max={600}
              step={10}
              unit="g"
            />
            <View style={{ height: 16 }} />
            <Stepper
              label="DIETARY FAT"
              value={editFat}
              onChange={setEditFat}
              min={30}
              max={150}
              step={5}
              unit="g"
            />

            <PrimaryButton
              label="Save Targets"
              size="large"
              onPress={handleSaveTargets}
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
    padding: 16
  },
  titleRow: {
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 14
  },
  avatarCircle: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800'
  },
  userName: {
    fontSize: 18,
    fontWeight: '800'
  },
  userEmail: {
    fontSize: 13,
    marginTop: 1
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6
  },
  goalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  goalBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  userMeta: {
    fontSize: 11,
    fontWeight: '600'
  },
  hardwareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12
  },
  hardwareIconBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hardwareTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2
  },
  hardwareName: {
    fontSize: 15,
    fontWeight: '700'
  },
  connPill: {
    paddingHorizontal: 6,
    paddingVertical: 1
  },
  connPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  hardwareSub: {
    fontSize: 12,
    marginTop: 2
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 4,
    marginRight: 4
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: '700'
  },
  groupedCard: {
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
    paddingHorizontal: 16
  },
  targetsGrid: {
    flexDirection: 'row',
    paddingVertical: 16
  },
  targetItem: {
    flex: 1,
    alignItems: 'center'
  },
  targetNumber: {
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  targetLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2
  },
  themePillsTrack: {
    flexDirection: 'row',
    padding: 4,
    borderWidth: 1,
    marginBottom: 20
  },
  themePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8
  },
  themePillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  groupedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600'
  },
  rowSub: {
    fontSize: 12,
    marginTop: 2
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700'
  },
  unitPill: {
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  unitPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  devLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    paddingTop: 16,
    paddingBottom: 8
  },
  statePillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 14
  },
  statePill: {
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  statePillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  navigationLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14
  },
  navLinkText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1
  },
  actionButtonsCol: {
    gap: 12,
    marginTop: 8
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14
  },
  dangerButtonText: {
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
  }
});
