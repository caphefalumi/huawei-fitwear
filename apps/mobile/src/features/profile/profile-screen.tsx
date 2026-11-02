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
};

function ProfileRow({ label, value, onPress }: RowProps) {
  return (
    <Pressable
      style={styles.row}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityLabel={`${label}, ${value}`}
      onPress={onPress}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={styles.rowValue}>{value}</Text>
        {onPress ? (
          <Image
            accessible={false}
            source={icons.chevronRight}
            style={styles.chevron}
            contentFit="contain"
          />
        ) : null}
      </View>
    </Pressable>
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
  | "period"
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
  const [pending, setPending] = useState(false);
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
    setPending(true);
    setError(null);
    try {
      await action();
    } catch (cause) {
      const message = `${cause instanceof Error ? cause.message : "Could not save."} Please try again.`;
      if (active.current) setError(message);
      else Alert.alert("Account update", message);
    } finally {
      busy.current = false;
      if (active.current) setPending(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
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
              .toUpperCase() || "?"}
          </Text>
        </View>
        <View style={styles.user}>
          <Text style={styles.userName}>{user?.name ?? "Your account"}</Text>
          <Text style={styles.userHandle}>{user?.email}</Text>
        </View>
      </View>
      {loading ? <Text style={styles.userHandle}>Loading health data…</Text> : null}
      {healthError ? (
        <Pressable
          onPress={() => {
            void refresh();
          }}
        >
          <Text accessibilityRole="alert">{healthError} Tap to retry.</Text>
        </Pressable>
      ) : null}
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Profile overview
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
          label="Sex / gender"
          value={sex ?? "Not set"}
          onPress={() => setOpenSheet("sex")}
        />
        <ProfileRow
          label="Height"
          value={heightCm === null ? "Not set" : `${heightCm} cm`}
          onPress={() => setOpenSheet("height")}
        />
        <ProfileRow
          label="Weight"
          value={weightKg === null ? "Not set" : `${weightKg.toFixed(1)} kg`}
          onPress={() => setOpenSheet("weight")}
        />
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Refine your plan
        </Text>
        <ProfileRow label="Goal / target" value={plan.goal} onPress={() => setOpenSheet("goal")} />
        <ProfileRow
          label="Workout frequency"
          value={plan.sessions === null ? "Not set" : `${plan.sessions} sessions/week`}
          onPress={() => setOpenSheet("frequency")}
        />
        <ProfileRow
          label="Daily activity"
          value={plan.activity}
          onPress={() => setOpenSheet("activity")}
        />
        <ProfileRow
          label="Target weight"
          value={plan.targetWeightKg === null ? "Not set" : `${plan.targetWeightKg.toFixed(1)} kg`}
          onPress={() => setOpenSheet("target")}
        />
        <ProfileRow
          label="Recovery plan"
          value={recovery?.area ?? "None"}
          onPress={() => setOpenSheet("recovery")}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected devices</Text>
        <ProfileRow
          label="Huawei Watch (BLE Sync)"
          value="Telemetry & Sync"
          onPress={() => router.push("/ble-sync" as never)}
        />
      </View>

      {sex === "Female" ? (
        <Pressable
          style={[styles.periodButton, inPeriod && styles.periodButtonActive]}
          disabled={pending || loading}
          accessibilityState={{ busy: pending }}
          onPress={() => {
            if (!inPeriod) setOpenSheet("period");
            else void mutate(() => saveRecovery(null));
          }}
        >
          <Text style={[styles.periodLabel, inPeriod && styles.periodLabelActive]}>
            {inPeriod ? "My period has ended" : "I am in my period"}
          </Text>
        </Pressable>
      ) : null}
      <Pressable
        style={styles.periodButton}
        disabled={pending}
        accessibilityLabel="Sign out"
        accessibilityState={{ busy: pending }}
        onPress={() => {
          void mutate(signOut);
        }}
      >
        <Text style={styles.periodLabel}>{pending ? "Please wait…" : "Sign out"}</Text>
      </Pressable>
      {mountedSheet === "period" ? (
        <RecoverySheet
          visible={openSheet === "period"}
          initialArea={PERIOD_AREA}
          onClose={close}
          onDismiss={didDismiss}
        />
      ) : null}

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
    paddingHorizontal: 24,
    gap: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: C.text,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
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
  section: {
    gap: 0,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: C.text,
    paddingBottom: 8,
  },
  row: {
    minHeight: 50,
    paddingVertical: 12,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowLabel: {
    fontSize: 13,
    flexShrink: 1,
    fontWeight: "600",
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
  chevron: {
    width: 16,
    height: 16,
  },
  syncTestButton: {
    minHeight: 50,
    padding: 12,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  syncTestButtonLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
  },
  periodButton: {
    minHeight: 52,
    padding: 12,
    borderRadius: 16,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  periodButtonActive: {
    backgroundColor: C.accentTint,
  },
  periodLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: C.onAccent,
  },
  periodLabelActive: {
    color: C.accent,
  },
});
