import { router } from "expo-router"
import { Image } from "expo-image"
import { useAuth } from "@/features/auth/auth-store"
import { useState } from "react"
import { Alert, StyleSheet, Text, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

import { Pressable } from "@/components/pressable"
import { Button, PageHeading, Screen } from "@/components/ui"
import { Palette as C } from "@/constants/palette"
import { PERIOD_AREA, useHealth } from "@/features/health/health-store"
import {
  ActivitySheet,
  FrequencySheet,
  GoalSheet,
  HeightSheet,
  SexSheet,
  TargetWeightSheet,
  WeightSheet,
} from "@/features/profile/sheets"
import { RecoverySheet } from "@/features/recovery/recovery-sheet"

const icons = {
  chevronRight: require("@/assets/images/profile/chevron-right.svg"),
}

type RowProps = {
  label: string
  value: string
  onPress?: () => void
  loading?: boolean
}

function ProfileRow({ label, value, onPress, loading = false }: RowProps) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? `${label}, ${loading ? "loading" : value}` : undefined}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {loading ? (
          <View accessibilityLabel={`${label} loading`} style={styles.skeleton} />
        ) : (
          <Text style={styles.rowValue}>{value}</Text>
        )}
        <Image source={icons.chevronRight} style={styles.chevron} contentFit="contain" />
      </View>
    </Pressable>
  )
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
  | null

export function ProfileScreen() {
  const { user, signOut } = useAuth()
  const { weightKg, heightCm, sex, plan, recovery, saveRecovery, loading, error, refresh } =
    useHealth()
  const inPeriod = recovery?.area === PERIOD_AREA
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null)
  const sexLabel = sex ?? "Not set"
  const weightLabel = weightKg === null ? "Not set" : `${weightKg.toFixed(1)} kg`
  const heightLabel = heightCm === null ? "Not set" : `${heightCm} cm`
  const targetWeightLabel =
    plan.targetWeightKg === null ? "Not set" : `${plan.targetWeightKg.toFixed(1)} kg`

  const close = () => setOpenSheet(null)

  return (
    <Screen contentStyle={styles.content}>
      <PageHeading title="Profile" />
      {error ? (
        <View style={styles.errorBanner}>
          <Text>Couldn’t load your health data.</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading health data"
            onPress={() => void refresh()}
          >
            <Text>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <Animated.View entering={FadeInUp.duration(220)}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name
                ?.trim()
                .split(/\s+/)
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() ?? "•"}
            </Text>
          </View>
          <View style={styles.user}>
            <Text style={styles.userName}>{user?.name?.trim() || "VoocHealth member"}</Text>
            <Text style={styles.userHandle}>{user?.email ?? ""}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(50).duration(220)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile overview</Text>
          <ProfileRow label="Birthdate" value="14 Jun 1998" />
          <ProfileRow label="Sex / gender" value={sexLabel} onPress={() => setOpenSheet("sex")} />
          <ProfileRow
            label="Height"
            value={heightLabel}
            onPress={() => setOpenSheet("height")}
            loading={loading}
          />
          <ProfileRow label="Weight" value={weightLabel} onPress={() => setOpenSheet("weight")} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(100).duration(220)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Refine your plan</Text>
          <ProfileRow
            label="Goal / target"
            value={plan.goal}
            onPress={() => setOpenSheet("goal")}
          />
          <ProfileRow
            label="Workout frequency"
            value={`${plan.sessions} sessions/week`}
            onPress={() => setOpenSheet("frequency")}
          />
          <ProfileRow
            label="Daily activity"
            value={plan.activity}
            onPress={() => setOpenSheet("activity")}
          />
          <ProfileRow
            label="Target weight"
            value={targetWeightLabel}
            onPress={() => setOpenSheet("target")}
          />
          <ProfileRow
            label="Recovery plan"
            value={recovery?.area ?? "None"}
            onPress={() => setOpenSheet("recovery")}
          />
        </View>
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/account-data")}
          style={styles.row}
        >
          <Text style={styles.rowLabel}>Account data</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/ble-sync")}
          style={styles.row}
        >
          <Text style={styles.rowLabel}>BLE test</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => void signOut()} style={styles.row}>
          <Text style={styles.rowLabel}>Sign out</Text>
        </Pressable>
      </View>
      {sex === "Female" ? (
        <Animated.View entering={FadeInUp.delay(150).duration(220)}>
          <Button
            accessibilityLabel={`Period recovery, ${inPeriod ? "On" : "Off"}`}
            label={inPeriod ? "My period has ended" : "I am in my period"}
            variant={inPeriod ? "secondary" : "primary"}
            style={inPeriod ? styles.periodButtonActive : undefined}
            onPress={() => {
              if (inPeriod) {
                void saveRecovery(null)
              } else {
                Alert.alert(
                  "Period recovery",
                  "Used only to adjust your plan. You can turn it off any time.",
                  [
                    { text: "Not now", style: "cancel" },
                    { text: "Turn on", onPress: () => setOpenSheet("recovery") },
                  ],
                )
              }
            }}
          />
        </Animated.View>
      ) : null}

      {openSheet === "height" ? <HeightSheet visible onClose={close} /> : null}
      {openSheet === "weight" ? <WeightSheet visible onClose={close} /> : null}
      {openSheet === "sex" ? <SexSheet visible onClose={close} /> : null}
      {openSheet === "goal" ? <GoalSheet visible onClose={close} /> : null}
      {openSheet === "frequency" ? <FrequencySheet visible onClose={close} /> : null}
      {openSheet === "activity" ? <ActivitySheet visible onClose={close} /> : null}
      {openSheet === "target" ? <TargetWeightSheet visible onClose={close} /> : null}
      {openSheet === "recovery" ? <RecoverySheet visible onClose={close} /> : null}
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 22,
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
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skeleton: {
    width: 56,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.border,
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
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  chevron: {
    width: 16,
    height: 16,
  },
  periodButtonActive: {
    backgroundColor: C.accentTint,
    borderColor: C.accentTint,
  },
})
