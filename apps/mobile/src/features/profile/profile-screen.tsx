import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";
import { PERIOD_AREA, useHealth } from "@/features/health/health-store";
import { useAuth } from "@/features/auth/auth-store";
import {
  ActivitySheet,
  FrequencySheet,
  GoalSheet,
  HeightSheet,
  SexSheet,
  TargetWeightSheet,
  WeightSheet,
} from "@/features/profile/sheets";
import { RecoverySheet } from "@/features/recovery/recovery-sheet";

const icons = {
  chevronRight: require("@/assets/images/profile/chevron-right.svg"),
};

type RowProps = {
  label: string;
  value: string;
  onPress?: () => void;
  loading?: boolean;
  unavailable?: boolean;
};

function ProfileRow({ label, value, onPress, loading, unavailable }: RowProps) {
  const content = (
    <>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {loading ? (
          <View accessibilityLabel={`${label} loading`} style={styles.skeleton} />
        ) : (
          <Text style={[styles.rowValue, value === "Not set" && styles.rowValueUnset]}>
            {unavailable ? "—" : value}
          </Text>
        )}
        {onPress ? (
          <Image
            accessible={false}
            source={icons.chevronRight}
            style={styles.chevron}
            contentFit="contain"
          />
        ) : null}
      </View>
    </>
  );
  return onPress ? (
    <Pressable
      style={styles.row}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${loading ? "loading" : unavailable ? "unavailable" : value}`}
      onPress={onPress}
    >
      {content}
    </Pressable>
  ) : (
    <View style={styles.row} accessibilityRole="text" accessibilityLabel={`${label}, ${value}`}>
      {content}
    </View>
  );
}

type OpenSheet =
  | "height"
  | "weight"
  | "sex"
  | "goal"
  | "frequency"
  | "activity"
  | "target"
  | "recovery"
  | null;

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const {
    weightKg,
    heightCm,
    sex,
    plan,
    recovery,
    saveRecovery,
    loading,
    error: healthError,
    refresh,
  } = useHealth();
  const inPeriod = recovery?.area === PERIOD_AREA;
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);
  const [closingSheet, setClosingSheet] = useState<OpenSheet>(null);
  const mountedSheet = openSheet ?? closingSheet;
  const didDismiss = () => setClosingSheet(null);
  const [error, setError] = useState<string | null>(null);
  const active = useRef(true);
  const busy = useRef(false);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const close = () => {
    setClosingSheet(openSheet);
    setOpenSheet(null);
  };
  const mutate = async (action: () => Promise<void>) => {
    if (busy.current) return;
    busy.current = true;
    setError(null);
    try {
      await action();
    } catch (cause) {
      const message = `${cause instanceof Error ? cause.message : "Could not save."} Please try again.`;
      if (active.current) setError(message);
      else Alert.alert("Account update", message);
    } finally {
      busy.current = false;
    }
  };
  const handlePeriodPress = () => {
    if (inPeriod) {
      Alert.alert("Turn off period recovery?", "You can turn it on again any time.", [
        { text: "Cancel", style: "cancel" },
        { text: "Turn off", onPress: () => void mutate(() => saveRecovery(null)) },
      ]);
      return;
    }
    Alert.alert("Period recovery", "Used only to adjust your plan. You can turn it off any time.", [
      { text: "Not now", style: "cancel" },
      { text: "Turn on", onPress: () => setOpenSheet("recovery") },
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 24 + insets.bottom + 68 },
      ]}
    >
      <Text accessibilityRole="header" style={styles.title}>
        Profile
      </Text>

      <View style={styles.identity}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>
            {user?.name
              ?.trim()
              .split(/\s+/)
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "•"}
          </Text>
        </View>
        <View style={styles.user}>
          <Text numberOfLines={2} accessibilityRole="header" style={styles.userName}>
            {user?.name?.trim() || "Fitwear member"}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="middle" selectable style={styles.userHandle}>
            {user?.email ?? ""}
          </Text>
        </View>
      </View>
      {healthError ? (
        <View style={styles.errorBanner}>
          <Text accessibilityRole="alert" style={styles.errorText}>
            Couldn’t load your health data.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading health data"
            style={styles.retryButton}
            onPress={() => void refresh()}
          >
            <Text style={styles.retryLabel}>Retry</Text>
          </Pressable>
        </View>
      ) : null}
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Your details
        </Text>
        <ProfileRow
          label="Birthdate"
          value={
            user?.birthDate
              ? new Date(`${user.birthDate}T12:00:00`).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Not set"
          }
        />
        <ProfileRow
          label="Sex"
          value={sex ?? "Not set"}
          onPress={() => setOpenSheet("sex")}
          loading={loading && !healthError}
          unavailable={Boolean(healthError)}
        />
        <ProfileRow
          label="Height"
          value={heightCm === null ? "Not set" : `${heightCm} cm`}
          onPress={() => setOpenSheet("height")}
          loading={loading && !healthError}
          unavailable={Boolean(healthError)}
        />
        <ProfileRow
          label="Weight"
          value={weightKg === null ? "Not set" : `${weightKg.toFixed(1)} kg`}
          onPress={() => setOpenSheet("weight")}
          loading={loading && !healthError}
          unavailable={Boolean(healthError)}
        />
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Your plan
        </Text>
        <ProfileRow
          label="Goal"
          value={plan.goal}
          onPress={() => setOpenSheet("goal")}
          loading={loading && !healthError}
          unavailable={Boolean(healthError)}
        />
        <ProfileRow
          label="Workouts"
          value={plan.sessions === null ? "Not set" : `${plan.sessions}× per week`}
          onPress={() => setOpenSheet("frequency")}
          loading={loading && !healthError}
          unavailable={Boolean(healthError)}
        />
        <ProfileRow
          label="Activity"
          value={plan.activity}
          onPress={() => setOpenSheet("activity")}
          loading={loading && !healthError}
          unavailable={Boolean(healthError)}
        />
        <ProfileRow
          label="Target weight"
          value={plan.targetWeightKg === null ? "Not set" : `${plan.targetWeightKg.toFixed(1)} kg`}
          onPress={() => setOpenSheet("target")}
          loading={loading && !healthError}
          unavailable={Boolean(healthError)}
        />
        <ProfileRow
          label="Recovery plan"
          value={recovery?.area ?? "Not set"}
          onPress={() => setOpenSheet("recovery")}
          loading={loading && !healthError}
          unavailable={Boolean(healthError)}
        />
      </View>

      {sex === "Female" ? (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Period recovery
          </Text>
          <ProfileRow
            label="Period recovery"
            value={inPeriod ? "On" : "Off"}
            onPress={handlePeriodPress}
            loading={loading && !healthError}
            unavailable={Boolean(healthError)}
          />
          <Text style={styles.helperText}>
            Used only to adjust your plan. You can turn it off any time.
          </Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Account
        </Text>
        <Pressable
          style={styles.row}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          onPress={() => void signOut()}
        >
          <Text style={styles.rowLabel}>Sign out</Text>
        </Pressable>
        <Pressable
          style={styles.row}
          accessibilityRole="button"
          accessibilityLabel="Account and data"
          onPress={() => router.push("/account-data" as never)}
        >
          <Text style={styles.rowLabel}>Account &amp; data</Text>
          <Image accessible={false} source={icons.chevronRight} style={styles.chevron} />
        </Pressable>
      </View>

      {mountedSheet === "height" ? (
        <HeightSheet visible={openSheet === "height"} onClose={close} onDismiss={didDismiss} />
      ) : null}
      {mountedSheet === "weight" ? (
        <WeightSheet visible={openSheet === "weight"} onClose={close} onDismiss={didDismiss} />
      ) : null}
      {mountedSheet === "sex" ? (
        <SexSheet visible={openSheet === "sex"} onClose={close} onDismiss={didDismiss} />
      ) : null}
      {mountedSheet === "goal" ? (
        <GoalSheet visible={openSheet === "goal"} onClose={close} onDismiss={didDismiss} />
      ) : null}
      {mountedSheet === "frequency" ? (
        <FrequencySheet
          visible={openSheet === "frequency"}
          onClose={close}
          onDismiss={didDismiss}
        />
      ) : null}
      {mountedSheet === "activity" ? (
        <ActivitySheet visible={openSheet === "activity"} onClose={close} onDismiss={didDismiss} />
      ) : null}
      {mountedSheet === "target" ? (
        <TargetWeightSheet
          visible={openSheet === "target"}
          onClose={close}
          onDismiss={didDismiss}
        />
      ) : null}
      {mountedSheet === "recovery" ? (
        <RecoverySheet visible={openSheet === "recovery"} onClose={close} onDismiss={didDismiss} />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 16,
    gap: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: C.text,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.accentTint,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "500",
    color: C.accent,
  },
  user: {
    flex: 1,
    gap: 5,
  },
  userName: {
    fontSize: 19,
    fontWeight: "600",
    color: C.text,
  },
  userHandle: {
    fontSize: 12,
    color: C.textMuted,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: C.textMuted,
  },
  section: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: C.surface,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
    paddingBottom: 8,
  },
  row: {
    minHeight: 56,
    paddingVertical: 12,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  rowLabel: {
    fontSize: 14,
    flexShrink: 1,
    fontWeight: "500",
    color: C.text,
  },
  rowRight: {
    flexDirection: "row",
    flexShrink: 1,
    alignItems: "center",
    gap: 8,
  },
  rowValue: {
    fontSize: 14,
    flexShrink: 1,
    fontWeight: "600",
    color: C.text,
  },
  rowValueUnset: {
    color: C.textMuted,
  },
  skeleton: {
    width: 72,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.card,
  },
  chevron: {
    width: 16,
    height: 16,
  },
  errorBanner: {
    minHeight: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderRadius: 12,
    backgroundColor: C.accentTint,
  },
  errorText: {
    flex: 1,
    color: C.text,
    fontSize: 14,
  },
  retryButton: {
    minHeight: 48,
    minWidth: 48,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  retryLabel: {
    color: C.accent,
    fontSize: 14,
    fontWeight: "600",
  },
});
