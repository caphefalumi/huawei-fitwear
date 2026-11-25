import { Image } from "expo-image"
import { router } from "expo-router"
import { useState } from "react"
import { AccessibilityInfo, StyleSheet, Text, View } from "react-native"

import { FetchErrorState } from "@/components/feedback/fetch-states"
import { Button, Card, PageHeading, Screen } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Toggle } from "@/components/ui/toggle"
import { useAuth } from "@/features/auth"
import { useHealth } from "@/features/health"
import { DeviceHealthSettings } from "@/features/health/components/device-health-settings"
import { PERIOD_AREA, PeriodSheet, useActiveInjuries, useInjuries } from "@/features/recovery"
import { useWatchStatus } from "@/features/watch"
import { emphasisFor, useLoads, usePlanPreferences } from "@/features/workout"
import { captureException } from "@/lib/analytics/posthog"
import { Palette as C } from "@/theme"

import { AppCacheSettings } from "../components/app-cache-settings"
import {
  ActivitySheet,
  BirthdateSheet,
  EmphasisSheet,
  ExperienceSheet,
  FrequencySheet,
  GoalSheet,
  HeightSheet,
  NameSheet,
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
  value?: string
  onPress: () => void
}

function ProfileRow({ label, value, onPress }: RowProps) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      accessibilityLabel={value ? `${label}, ${value}` : label}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Image
        accessible={false}
        source={icons.chevronRight}
        style={styles.chevron}
        contentFit="contain"
      />
    </Pressable>
  )
}

type OpenSheet =
  | "birthdate"
  | "name"
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
  const watch = useWatchStatus()
  const { user, signOut, offline } = useAuth()
  const developerMode = useDeveloperMode((state) => state.enabled)
  const developerFeatures = useDeveloperMode((state) => state.features)
  const toggleDeveloperMode = useDeveloperMode((state) => state.toggle)
  const { weightKg, heightCm, sex, plan, loading, error, refresh, refreshing } = useHealth()
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
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const sexLabel = sex ?? "Not set"
  const missingWeight = loading ? "Loading" : offline ? "Unavailable offline" : "Not set"
  const weightLabel = weightKg === null ? missingWeight : `${weightKg.toFixed(1)} kg`
  const heightLabel = heightCm === null ? "Not set" : `${heightCm} cm`
  const targetWeightLabel =
    plan.targetWeightKg === null ? "Not set" : `${plan.targetWeightKg.toFixed(1)} kg`

  const close = () => setOpenSheet(null)
  const editorProps = {
    visible: true,
    onClose: close,
    onSaved: () => {
      setSavedMessage("Profile updated.")
      void AccessibilityInfo.announceForAccessibility("Profile updated.")
    },
  }

  return (
    <Screen contentStyle={styles.content}>
      <PageHeading title="Profile" subtitle="Health, training, devices, and account settings." />
      <Card>
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
        <ProfileRow label="Edit name" onPress={() => setOpenSheet("name")} />
      </Card>
      {savedMessage ? (
        <Text accessibilityLiveRegion="polite" style={styles.saved}>
          {savedMessage}
        </Text>
      ) : null}

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Health &amp; goals
        </Text>
        {error ? (
          <FetchErrorState
            title="Could not load your health data."
            message={error}
            onRetry={refresh}
            retrying={refreshing}
          />
        ) : null}
        <Card style={styles.group}>
          <ProfileRow label="Weight" value={weightLabel} onPress={() => setOpenSheet("weight")} />
          <ProfileRow
            label="Birthdate"
            value={formatBirthdate(user?.birthDate)}
            onPress={() => setOpenSheet("birthdate")}
          />
          <ProfileRow label="Sex / gender" value={sexLabel} onPress={() => setOpenSheet("sex")} />
          <ProfileRow
            label="Height"
            onPress={() => setOpenSheet("height")}
            value={loading && heightCm === null ? "Loading" : heightLabel}
          />
          <ProfileRow
            label="Daily activity"
            value={plan.activity || "Not set"}
            onPress={() => setOpenSheet("activity")}
          />
          <ProfileRow
            label="Goal"
            value={plan.goal || "Not set"}
            onPress={() => setOpenSheet("goal")}
          />
          <ProfileRow
            label="Target weight"
            value={targetWeightLabel}
            onPress={() => setOpenSheet("target")}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Training &amp; recovery
        </Text>
        <Card style={styles.group}>
          <ProfileRow
            label="Workout frequency"
            value={plan.sessions === null ? "Not set" : `${plan.sessions} sessions/week`}
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
            label="Injuries"
            value={injuriesLabel}
            onPress={() => router.push("/injuries")}
          />
        </Card>
        {sex === "Female" ? (
          <Button
            accessibilityLabel={`Period recovery, ${inPeriod ? "On" : "Off"}`}
            label={inPeriod ? "My period has ended" : "I am in my period"}
            variant="secondary"
            style={inPeriod ? styles.periodButtonActive : undefined}
            onPress={() => (inPeriod ? removeInjury(PERIOD_AREA) : setPeriodSheet(true))}
          />
        ) : null}
      </View>

      <AppCacheSettings />

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Connected devices
        </Text>
        <Card style={styles.group}>
          <ProfileRow
            label="VoocHealth watch"
            value={watch.label}
            onPress={() => router.push("/watch")}
          />
        </Card>
        <DeviceHealthSettings />
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Account &amp; privacy
        </Text>
        <Card style={styles.group}>
          <ProfileRow label="Account data" onPress={() => router.push("/account-data")} />
        </Card>
        <Button variant="secondary" label="Sign out" onPress={() => void signOut()} />
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Developer settings
        </Text>
        <Card style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Developer mode</Text>
            <Toggle
              accessibilityLabel="Developer mode"
              value={developerMode}
              onValueChange={toggleDeveloperMode}
            />
          </View>
          {developerMode ? (
            <ProfileRow
              label="Developer options"
              onPress={() => router.push("/developer-options")}
            />
          ) : null}
          {developerMode && developerFeatures.bleTest ? (
            <ProfileRow label="BLE test" onPress={() => router.push("/ble-sync")} />
          ) : null}
          {developerMode && developerFeatures.testError ? (
            <ProfileRow
              label="Send test error"
              onPress={() => captureException(new Error("First error"))}
            />
          ) : null}
        </Card>
      </View>

      {openSheet === "birthdate" ? <BirthdateSheet {...editorProps} /> : null}
      {openSheet === "height" ? <HeightSheet {...editorProps} /> : null}
      {openSheet === "weight" ? <WeightSheet {...editorProps} /> : null}
      {openSheet === "sex" ? <SexSheet {...editorProps} /> : null}
      {openSheet === "goal" ? <GoalSheet {...editorProps} /> : null}
      {openSheet === "frequency" ? <FrequencySheet {...editorProps} /> : null}
      {openSheet === "activity" ? <ActivitySheet {...editorProps} /> : null}
      {openSheet === "target" ? <TargetWeightSheet {...editorProps} /> : null}
      {openSheet === "session" ? <SessionLengthSheet {...editorProps} /> : null}
      {openSheet === "emphasis" ? <EmphasisSheet {...editorProps} /> : null}
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
      {openSheet === "experience" ? <ExperienceSheet {...editorProps} /> : null}
      {openSheet === "name" ? <NameSheet {...editorProps} /> : null}
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
  group: { paddingVertical: 0, gap: 0 },
  saved: { color: C.textMuted, fontSize: 14 },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: C.text,
    marginBottom: 2,
  },
  row: {
    minHeight: 52,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: C.text,
  },
  rowValue: {
    flexShrink: 1,
    maxWidth: "46%",
    textAlign: "right",
    fontSize: 14,
    color: C.textMuted,
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
