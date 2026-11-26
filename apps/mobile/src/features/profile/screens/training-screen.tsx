import { router } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text } from "react-native"

import { BackHeader, Button, PageHeading, Screen } from "@/components/ui"
import { useHealth } from "@/features/health"
import { PERIOD_AREA, PeriodSheet, useActiveInjuries, useInjuries } from "@/features/recovery"
import { emphasisFor, useLoads, usePlanPreferences } from "@/features/workout"
import { Palette as C } from "@/theme"

import { MenuGroup, MenuRow } from "../components/menu"
import {
  EmphasisSheet,
  ExperienceSheet,
  FrequencySheet,
  SessionLengthSheet,
} from "../components/sheets"
import { useProfileEditor } from "../components/use-profile-editor"

type EditorSheet = "frequency" | "session" | "emphasis" | "experience"

export function TrainingScreen() {
  const { sex, plan } = useHealth()
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
  const { openSheet, setOpenSheet, savedMessage, editorProps } = useProfileEditor<EditorSheet>()
  const [periodSheet, setPeriodSheet] = useState(false)

  return (
    <Screen>
      <BackHeader label="Profile" onPress={() => router.back()} />
      <PageHeading title="Training & recovery" />
      {savedMessage ? (
        <Text accessibilityLiveRegion="polite" style={styles.saved}>
          {savedMessage}
        </Text>
      ) : null}
      <MenuGroup>
        <MenuRow
          label="Workout frequency"
          value={plan.sessions === null ? "Not set" : `${plan.sessions} sessions/week`}
          onPress={() => setOpenSheet("frequency")}
        />
        <MenuRow
          label="Session length"
          value={`${minutes} min`}
          onPress={() => setOpenSheet("session")}
        />
        <MenuRow
          label="Emphasis"
          value={emphasisFor(emphasis, sex)}
          onPress={() => setOpenSheet("emphasis")}
        />
        <MenuRow label="Experience" value={experience} onPress={() => setOpenSheet("experience")} />
        <MenuRow
          label="Training weights"
          value={strengthLevel}
          onPress={() => router.push("/training-weights")}
        />
        <MenuRow
          label="Exercise preferences"
          value={preferencesLabel}
          onPress={() => router.push("/exercise-preferences")}
        />
        <MenuRow label="Injuries" value={injuriesLabel} onPress={() => router.push("/injuries")} />
      </MenuGroup>
      {sex === "Female" ? (
        <Button
          accessibilityLabel={`Period recovery, ${inPeriod ? "On" : "Off"}`}
          label={inPeriod ? "My period has ended" : "I am in my period"}
          variant="secondary"
          style={inPeriod ? styles.periodButtonActive : undefined}
          onPress={() => (inPeriod ? removeInjury(PERIOD_AREA) : setPeriodSheet(true))}
        />
      ) : null}

      {openSheet === "frequency" ? <FrequencySheet {...editorProps} /> : null}
      {openSheet === "session" ? <SessionLengthSheet {...editorProps} /> : null}
      {openSheet === "emphasis" ? <EmphasisSheet {...editorProps} /> : null}
      {openSheet === "experience" ? <ExperienceSheet {...editorProps} /> : null}
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
    </Screen>
  )
}

const styles = StyleSheet.create({
  saved: { color: C.textMuted, fontSize: 14 },
  periodButtonActive: {
    backgroundColor: C.accentTint,
    borderColor: C.accentTint,
  },
})
