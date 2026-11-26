import { router } from "expo-router"
import { StyleSheet, Text } from "react-native"

import { FetchErrorState } from "@/components/feedback/fetch-states"
import { BackHeader, PageHeading, Screen } from "@/components/ui"
import { useAuth } from "@/features/auth"
import { useHealth } from "@/features/health"
import { Palette as C } from "@/theme"

import { MenuGroup, MenuRow } from "../components/menu"
import {
  ActivitySheet,
  BirthdateSheet,
  GoalSheet,
  HeightSheet,
  SexSheet,
  TargetWeightSheet,
  WeightSheet,
} from "../components/sheets"
import { useProfileEditor } from "../components/use-profile-editor"
import { formatBirthdate } from "../utils/format-birthdate"

type EditorSheet = "birthdate" | "height" | "weight" | "sex" | "goal" | "activity" | "target"

export function BodyProfileScreen() {
  const { user, offline } = useAuth()
  const { weightKg, heightCm, sex, plan, loading, error, refresh, refreshing } = useHealth()
  const { openSheet, setOpenSheet, savedMessage, editorProps } = useProfileEditor<EditorSheet>()
  const missingWeight = loading ? "Loading" : offline ? "Unavailable offline" : "Not set"
  const weightLabel = weightKg === null ? missingWeight : `${weightKg.toFixed(1)} kg`
  const heightLabel = heightCm === null ? "Not set" : `${heightCm} cm`
  const targetWeightLabel =
    plan.targetWeightKg === null ? "Not set" : `${plan.targetWeightKg.toFixed(1)} kg`

  return (
    <Screen>
      <BackHeader label="Profile" onPress={() => router.back()} />
      <PageHeading title="Body & goals" />
      {savedMessage ? (
        <Text accessibilityLiveRegion="polite" style={styles.saved}>
          {savedMessage}
        </Text>
      ) : null}
      {error ? (
        <FetchErrorState
          title="Could not load your health data."
          message={error}
          onRetry={refresh}
          retrying={refreshing}
        />
      ) : null}
      <MenuGroup>
        <MenuRow label="Weight" value={weightLabel} onPress={() => setOpenSheet("weight")} />
        <MenuRow
          label="Birthdate"
          value={formatBirthdate(user?.birthDate)}
          onPress={() => setOpenSheet("birthdate")}
        />
        <MenuRow
          label="Sex / gender"
          value={sex ?? "Not set"}
          onPress={() => setOpenSheet("sex")}
        />
        <MenuRow
          label="Height"
          value={loading && heightCm === null ? "Loading" : heightLabel}
          onPress={() => setOpenSheet("height")}
        />
        <MenuRow
          label="Daily activity"
          value={plan.activity || "Not set"}
          onPress={() => setOpenSheet("activity")}
        />
        <MenuRow label="Goal" value={plan.goal || "Not set"} onPress={() => setOpenSheet("goal")} />
        <MenuRow
          label="Target weight"
          value={targetWeightLabel}
          onPress={() => setOpenSheet("target")}
        />
      </MenuGroup>

      {openSheet === "birthdate" ? <BirthdateSheet {...editorProps} /> : null}
      {openSheet === "height" ? <HeightSheet {...editorProps} /> : null}
      {openSheet === "weight" ? <WeightSheet {...editorProps} /> : null}
      {openSheet === "sex" ? <SexSheet {...editorProps} /> : null}
      {openSheet === "goal" ? <GoalSheet {...editorProps} /> : null}
      {openSheet === "activity" ? <ActivitySheet {...editorProps} /> : null}
      {openSheet === "target" ? <TargetWeightSheet {...editorProps} /> : null}
    </Screen>
  )
}

const styles = StyleSheet.create({
  saved: { color: C.textMuted, fontSize: 14 },
})
