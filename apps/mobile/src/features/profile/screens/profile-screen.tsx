import * as Sentry from "@sentry/react-native"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

import { Button, PageHeading, Screen } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Toggle } from "@/components/ui/toggle"
import { useAuth } from "@/features/auth"
import { useHealth } from "@/features/health"
import { PERIOD_AREA, PeriodSheet, useActiveInjuries, useInjuries } from "@/features/recovery"
import { emphasisFor, useLoads, usePlanPreferences } from "@/features/workout"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { Palette as C } from "@/theme"

import {
  ActivitySheet,
  BirthdateSheet,
  EmphasisSheet,
  ExperienceSheet,
  FrequencySheet,
  GoalSheet,
  HeightSheet,
  SessionLengthSheet,
  SexSheet,
  TargetWeightSheet,
  WeightSheet,
} from "../components/sheets"
import { useDeveloperMode } from "../store/developer-mode.store"
import { formatBirthdate } from "../utils/format-birthdate"

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
  | "birthdate"
  | "height"
  | "weight"
  | "sex"
  | "goal"
  | "frequency"
  | "activity"
  | "target"
  | "session"
  | "emphasis"
  | "experience"
  | null

export function ProfileScreen() {
  useMarkInteractive()
  const { user, signOut } = useAuth()
  const developerMode = useDeveloperMode((state) => state.enabled)
  const developerFeatures = useDeveloperMode((state) => state.features)
  const toggleDeveloperMode = useDeveloperMode((state) => state.toggle)
  const { weightKg, heightCm, sex, plan, loading, error, refresh } = useHealth()
  const injuries = useActiveInjuries()
  const addInjury = useInjuries((state) => state.add)
  const removeInjury = useInjuries((state) => state.remove)
  const inPeriod = injuries.some((injury) => injury.area === PERIOD_AREA)
  const { minutes, likes, dislikes, emphasis, experience } = usePlanPreferences()
  const strengthLevel = useLoads().level
  const preferencesLabel =
    likes.length || dislikes.length ? `${likes.length} liked, ${dislikes.length} disliked` : "None"
  const injuriesLabel =
    injuries.length > 1 ? `${injuries.length} active` : (injuries[0]?.area ?? "None")
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null)
  const [periodSheet, setPeriodSheet] = useState(false)
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
          <Text>Could not load your health data.</Text>
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
          <ProfileRow
            label="Birthdate"
            value={formatBirthdate(user?.birthDate)}
            onPress={() => setOpenSheet("birthdate")}
          />
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
            label="Session length"
            value={`${minutes} min`}
            onPress={() => setOpenSheet("session")}
          />
          <ProfileRow
            label="Emphasis"
            value={emphasisFor(emphasis, sex)}
            onPress={() => setOpenSheet("emphasis")}
          />
          <ProfileRow
            label="Experience"
            value={experience}
            onPress={() => setOpenSheet("experience")}
          />
          <ProfileRow
            label="Training weights"
            value={strengthLevel}
            onPress={() => router.push("/training-weights")}
          />
          <ProfileRow
            label="Exercise preferences"
            value={preferencesLabel}
            onPress={() => router.push("/exercise-preferences")}
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
            label="Injuries"
            value={injuriesLabel}
            onPress={() => router.push("/injuries")}
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
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Developer mode</Text>
          <Toggle
            style={{ alignSelf: "center" }}
            accessibilityLabel="Developer mode"
            value={developerMode}
            onValueChange={toggleDeveloperMode}
          />
        </View>
        {developerMode ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/developer-options")}
            style={styles.row}
          >
            <Text style={styles.rowLabel}>Developer options</Text>
          </Pressable>
        ) : null}
        {developerMode && developerFeatures.bleTest ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/ble-sync")}
            style={styles.row}
          >
            <Text style={styles.rowLabel}>BLE test</Text>
          </Pressable>
        ) : null}
        {developerMode && developerFeatures.testError ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => Sentry.captureException(new Error("First error"))}
            style={styles.row}
          >
            <Text style={styles.rowLabel}>Send test error</Text>
          </Pressable>
        ) : null}
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
            onPress={() => (inPeriod ? removeInjury(PERIOD_AREA) : setPeriodSheet(true))}
          />
        </Animated.View>
      ) : null}

      {openSheet === "birthdate" ? <BirthdateSheet visible onClose={close} /> : null}
      {openSheet === "height" ? <HeightSheet visible onClose={close} /> : null}
      {openSheet === "weight" ? <WeightSheet visible onClose={close} /> : null}
      {openSheet === "sex" ? <SexSheet visible onClose={close} /> : null}
      {openSheet === "goal" ? <GoalSheet visible onClose={close} /> : null}
      {openSheet === "frequency" ? <FrequencySheet visible onClose={close} /> : null}
      {openSheet === "activity" ? <ActivitySheet visible onClose={close} /> : null}
      {openSheet === "target" ? <TargetWeightSheet visible onClose={close} /> : null}
      {openSheet === "session" ? <SessionLengthSheet visible onClose={close} /> : null}
      {openSheet === "emphasis" ? <EmphasisSheet visible onClose={close} /> : null}
      {periodSheet ? (
        <PeriodSheet
          visible
          onClose={() => setPeriodSheet(false)}
          onAdd={(feeling) => {
            addInjury(PERIOD_AREA, feeling)
            setPeriodSheet(false)
          }}
        />
      ) : null}
      {openSheet === "experience" ? <ExperienceSheet visible onClose={close} /> : null}
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
