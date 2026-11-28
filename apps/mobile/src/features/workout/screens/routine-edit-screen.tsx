import { router, useLocalSearchParams } from "expo-router"
import { usePreventRemove } from "expo-router/react-navigation"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { showToast } from "@/components/feedback/toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/features/auth"
import { usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { ExerciseEditSheet } from "../components/exercise-edit-sheet"
import { ExercisePickerSheet } from "../components/exercise-picker-sheet"
import { usePlanInput, usePlanPreferences } from "../store/plan-preferences.store"
import {
  addExercises,
  canMove,
  changed,
  exerciseLine,
  moveExercise,
  restoreExercise,
  setWarmUp,
  updateExercise,
} from "../utils/routine-edit"
import { fromDateKey, routineMinutes, routineOn, type RoutineExercise } from "../utils/routines"

/** Copies the routine for editing, dropping fields the editor no longer supports. */
const editable = (items: RoutineExercise[]) =>
  items.map((item) => {
    const { superset: _legacy, ...rest } = item as RoutineExercise & { superset?: string }
    return { ...rest }
  })

function ExerciseRow({
  item,
  first,
  onPress,
}: {
  item: RoutineExercise
  first: boolean
  onPress: () => void
}) {
  const line = exerciseLine(item)
  return (
    <Pressable
      style={[styles.row, !first && styles.rowDivider]}
      accessibilityLabel={`${item.name}, ${line}`}
      accessibilityHint="Opens sets, reps and rest"
      onPress={onPress}
    >
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.rowSub}>{line}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  )
}

/** Edit one routine: every day it is scheduled uses the saved version. */
export function RoutineEditScreen() {
  const { date: param } = useLocalSearchParams<{ date?: string }>()
  const now = usePlanNow()
  const input = usePlanInput()
  const routine = routineOn(fromDateKey(param) ?? now, input)
  const { user } = useAuth()
  const { saveRoutine, resetRoutine, customRoutines } = usePlanPreferences()
  const insets = useSafeAreaInsets()

  const [saved] = useState(() => editable(routine.exercises))
  const [draft, setDraft] = useState(saved)
  const [open, setOpen] = useState<string | null>(null)
  const [picker, setPicker] = useState<"warmUp" | "workout" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [leave, setLeave] = useState<(() => void) | null>(null)
  const [confirmRestore, setConfirmRestore] = useState(false)

  const dirty = changed(saved, draft)
  const disableGuard = usePreventRemove(dirty, ({ repeat }) => setLeave(() => repeat))

  const warmUps = draft.filter((item) => item.warmUp)
  const workout = draft.filter((item) => !item.warmUp)
  const totalSets = draft.reduce((sum, item) => sum + item.sets, 0)
  const editing = draft.find((item) => item.key === open) ?? null

  const save = () => {
    if (!user) return
    if (!workout.length) return setError("Add at least one exercise to the workout before saving.")
    try {
      saveRoutine(user.id, {
        ...routine,
        exercises: draft,
        sets: totalSets,
        minutes: routineMinutes(draft),
      })
      disableGuard()
      router.back()
    } catch {
      setError("Could not save this routine. Your changes are still here; try again.")
    }
  }

  const remove = (item: RoutineExercise) => {
    const index = draft.findIndex((entry) => entry.key === item.key)
    setOpen(null)
    setDraft((items) => items.filter((entry) => entry.key !== item.key))
    showToast({
      message: `Removed ${item.name}`,
      actionLabel: "Undo",
      onAction: () => setDraft((items) => restoreExercise(items, item, index)),
    })
  }

  const section = (title: string, caption: string | null, items: RoutineExercise[]) => (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      {items.length ? (
        <View style={styles.list}>
          {items.map((item, index) => (
            <ExerciseRow
              key={item.key}
              item={item}
              first={index === 0}
              onPress={() => setOpen(item.key)}
            />
          ))}
        </View>
      ) : null}
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.headerSide} onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text accessibilityRole="header" style={styles.title} numberOfLines={1}>
          {`Edit ${routine.name}`}
        </Text>
        <View style={[styles.headerSide, styles.headerEnd]}>
          <Pressable
            style={[styles.save, !dirty && styles.saveOff]}
            disabled={!dirty}
            accessibilityState={{ disabled: !dirty }}
            onPress={save}
          >
            <Text style={[styles.saveLabel, !dirty && styles.saveLabelOff]}>Save</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      >
        <Text style={styles.summary}>
          {`${draft.length} ${draft.length === 1 ? "exercise" : "exercises"} - ${totalSets} sets - about ${routineMinutes(draft)} min`}
        </Text>
        <Text style={styles.scope}>{`Changes apply to every ${routine.name} day.`}</Text>

        {section("Warm-up", "Done first. Not counted in volume or progress.", warmUps)}
        <Pressable style={styles.addLine} onPress={() => setPicker("warmUp")}>
          <Text style={styles.addLineLabel}>
            {warmUps.length ? "+ Add warm-up exercise" : "Add a warm-up exercise"}
          </Text>
        </Pressable>

        {section("Workout", null, workout)}
        <Pressable style={styles.add} onPress={() => setPicker("workout")}>
          <Text style={styles.addLabel}>+ Add exercises</Text>
        </Pressable>

        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}

        {user && customRoutines[routine.name] ? (
          <Pressable style={styles.restore} onPress={() => setConfirmRestore(true)}>
            <Text style={styles.restoreLabel}>Restore generated routine</Text>
          </Pressable>
        ) : null}
      </ScrollView>

      <ExerciseEditSheet
        exercise={editing}
        canMoveUp={editing ? canMove(draft, editing.key, -1) : false}
        canMoveDown={editing ? canMove(draft, editing.key, 1) : false}
        onChange={(patch) =>
          editing && setDraft((items) => updateExercise(items, editing.key, patch))
        }
        onWarmUp={(on) => editing && setDraft((items) => setWarmUp(items, editing.key, on))}
        onMove={(direction) =>
          editing && setDraft((items) => moveExercise(items, editing.key, direction))
        }
        onRemove={() => editing && remove(editing)}
        onClose={() => setOpen(null)}
      />

      <ExercisePickerSheet
        visible={picker !== null}
        warmUp={picker === "warmUp"}
        inRoutine={draft.map((item) => item.key)}
        onAdd={(picked) => {
          setDraft((items) => addExercises(items, picked, picker === "warmUp", input.goal))
          setError(null)
          setPicker(null)
        }}
        onClose={() => setPicker(null)}
      />

      <ConfirmDialog
        visible={leave !== null}
        title="Discard changes?"
        message={`Your edits to ${routine.name} will be lost.`}
        cancelLabel="Keep editing"
        confirmLabel="Discard"
        onCancel={() => setLeave(null)}
        onConfirm={() => {
          const repeat = leave
          setLeave(null)
          repeat?.()
        }}
      />
      <ConfirmDialog
        visible={confirmRestore}
        title="Restore generated routine?"
        message={`Your changes to ${routine.name} will be replaced by the routine your plan creates.`}
        cancelLabel="Keep mine"
        confirmLabel="Restore"
        onCancel={() => setConfirmRestore(false)}
        onConfirm={() => {
          setConfirmRestore(false)
          if (!user) return
          try {
            resetRoutine(user.id, routine.name)
            disableGuard()
            router.back()
          } catch {
            setError("Could not restore the generated routine. Try again.")
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.background,
  },
  headerSide: { width: 76, minWidth: 76 },
  headerEnd: { alignItems: "flex-end" },
  cancel: { fontSize: 15, fontWeight: "600", color: C.accent },
  title: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "600", color: C.text },
  save: {
    minWidth: 64,
    minHeight: 36,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: C.accent,
    alignItems: "center",
  },
  saveOff: { backgroundColor: C.card },
  saveLabel: { fontSize: 14, fontWeight: "600", color: C.onAccent },
  saveLabelOff: { color: C.textMuted },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 16, gap: 12 },
  summary: { fontSize: 13, color: C.textMuted, textAlign: "center" },
  scope: {
    fontSize: 13,
    color: C.text,
    backgroundColor: C.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  section: { gap: 6, marginTop: 6 },
  sectionTitle: { fontSize: 17, fontWeight: "600", color: C.text },
  caption: { fontSize: 12, color: C.textMuted },
  list: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rowDivider: { borderTopWidth: 1, borderTopColor: C.border },
  rowCopy: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 15, fontWeight: "600", color: C.text },
  rowSub: { fontSize: 13, color: C.textMuted, fontVariant: ["tabular-nums"] },
  chevron: { fontSize: 20, color: C.track },
  addLine: { alignSelf: "flex-start" },
  addLineLabel: { fontSize: 14, fontWeight: "600", color: C.accent },
  add: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: C.border,
    borderRadius: 16,
    alignItems: "center",
  },
  addLabel: { fontSize: 15, fontWeight: "600", color: C.accent },
  error: { fontSize: 13, color: C.accent },
  restore: { alignItems: "center", marginTop: 12 },
  restoreLabel: { fontSize: 14, fontWeight: "600", color: C.accent },
})
