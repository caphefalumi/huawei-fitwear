import { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

import { Pressable } from "@/components/pressable"
import { Sheet, SheetField } from "@/components/sheet"
import { Palette as C } from "@/constants/palette"
import { Card } from "@/components/ui"
import { useWorkouts, type Exercise, type WorkoutSet } from "@/features/workout/workout-store"

export function WorkoutSessionPanel({
  title,
  split,
  exercises,
  sessionId,
  recovery = false,
}: {
  title: string
  split: string
  exercises: Exercise[]
  sessionId?: string
  recovery?: boolean
}) {
  const {
    sessions,
    activeSessionId,
    loadSession,
    startSession,
    finishSession,
    cancelSession,
    saveSet,
    deleteSet,
  } = useWorkouts()
  const active = sessions.find(
    (session) =>
      session.id === activeSessionId && session.workoutSplit.toLowerCase() === split.toLowerCase(),
  )
  const [selectedId, setSelectedId] = useState(sessionId)
  const id = selectedId ?? active?.id
  const session = sessions.find((entry) => entry.id === id)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editor, setEditor] = useState<{ exercise: Exercise; set?: WorkoutSet } | null>(null)
  const [weight, setWeight] = useState("")
  const [reps, setReps] = useState("")
  const [confirmCancel, setConfirmCancel] = useState(false)
  const inFlight = useRef(false)

  useEffect(() => {
    setSelectedId(sessionId)
  }, [sessionId])
  useEffect(() => {
    if (!id) return
    let current = true
    setLoading(true)
    setError(null)
    loadSession(id)
      .catch((cause: unknown) => {
        if (current)
          setError(cause instanceof Error ? cause.message : "Unable to load this workout.")
      })
      .finally(() => {
        if (current) setLoading(false)
      })
    return () => {
      current = false
    }
  }, [id, loadSession])

  async function perform(action: () => Promise<void>) {
    if (inFlight.current) return
    inFlight.current = true
    setBusy(true)
    setError(null)
    try {
      await action()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save this workout.")
    } finally {
      inFlight.current = false
      setBusy(false)
    }
  }

  function openEditor(exercise: Exercise, set?: WorkoutSet) {
    setError(null)
    setWeight(set ? String(set.weightKg) : exercise.repetitionUnit === "reps" ? "" : "0")
    setReps(set ? String(set.userConfirmedReps) : "")
    setEditor({ exercise, set })
  }

  async function submitSet() {
    if (!editor || !id) return
    const weightKg =
      editor.exercise.repetitionUnit === "reps" ? Number(weight.trim().replace(",", ".")) : 0
    const userConfirmedReps = Number(reps.trim())
    if (
      !weight.trim() ||
      !Number.isFinite(weightKg) ||
      weightKg < 0 ||
      !reps.trim() ||
      !Number.isSafeInteger(userConfirmedReps) ||
      userConfirmedReps < 0
    ) {
      setError("Enter a weight of 0 kg or more and a whole-number completed quantity of 0 or more.")
      return
    }
    await perform(async () => {
      await saveSet(
        id,
        {
          exerciseId: editor.exercise.id,
          weightKg,
          userConfirmedReps,
          targetReps: editor.set?.targetReps ?? editor.exercise.defaultReps,
        },
        editor.set?.id,
      )
      setEditor(null)
    })
  }

  const visibleSets =
    session?.sets?.filter((set) => exercises.some((exercise) => exercise.id === set.exerciseId)) ??
    []

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.title}>
        {session ? session.sessionTitle : "Workout session"}
      </Text>
      {session ? (
        <Text style={styles.muted}>
          Started {new Date(session.startedAt).toLocaleString()}
          {session.completedAt
            ? ` · Finished ${new Date(session.completedAt).toLocaleString()}`
            : " · In progress"}
        </Text>
      ) : null}
      {error && !editor && !confirmCancel ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      {id && !loading && !session?.sets ? (
        <Pressable
          style={styles.secondary}
          disabled={busy}
          accessibilityState={{ busy }}
          onPress={() =>
            void perform(async () => {
              await loadSession(id)
            })
          }
        >
          <Text style={styles.text}>Retry workout</Text>
        </Pressable>
      ) : null}
      {visibleSets.map((set) => (
        <Card key={set.id}>
          <Text accessibilityRole="header" style={styles.text}>
            {set.exercise.name} · Set {set.setIndex}
          </Text>
          <Text style={styles.muted}>
            {set.exercise.repetitionUnit === "reps" ? `${set.weightKg} kg × ` : ""}
            {set.userConfirmedReps} {set.exercise.repetitionUnit}
          </Text>
          {!session?.completedAt ? (
            <View style={styles.row}>
              <Pressable
                accessibilityLabel={`Edit ${set.exercise.name}, set ${set.setIndex}`}
                disabled={busy}
                onPress={() => openEditor(set.exercise, set)}
              >
                <Text style={styles.text}>Edit set</Text>
              </Pressable>
              <Pressable
                accessibilityLabel={`Delete ${set.exercise.name}, set ${set.setIndex}`}
                accessibilityState={{ busy }}
                disabled={busy}
                onPress={() =>
                  void perform(async () => {
                    if (id) await deleteSet(id, set.id)
                  })
                }
              >
                <Text style={styles.error}>Delete set</Text>
              </Pressable>
            </View>
          ) : null}
        </Card>
      ))}
      {session?.sets && !session.completedAt
        ? exercises.map((exercise) => (
            <Pressable
              key={exercise.id}
              style={styles.secondary}
              disabled={busy || loading}
              onPress={() => openEditor(exercise)}
            >
              <Text style={styles.text}>Log set · {exercise.name}</Text>
            </Pressable>
          ))
        : null}
      {!id ? (
        <Pressable
          style={styles.primary}
          disabled={busy || exercises.length === 0}
          accessibilityState={{ busy }}
          onPress={() =>
            void perform(async () => {
              const started = await startSession(title, split)
              setSelectedId(started.id)
            })
          }
        >
          <Text style={styles.primaryText}>Start workout</Text>
        </Pressable>
      ) : null}
      {recovery ? (
        <Text style={styles.muted}>
          A recovery plan is active. These exercises are not medical clearance; stop if you feel
          pain.
        </Text>
      ) : null}
      {session?.sets && !session.completedAt ? (
        <>
          <Pressable
            style={styles.primary}
            disabled={busy || loading}
            accessibilityState={{ busy }}
            onPress={() =>
              void perform(async () => {
                await finishSession(session.id)
              })
            }
          >
            <Text style={styles.primaryText}>Finish workout</Text>
          </Pressable>
          <Pressable
            style={styles.secondary}
            disabled={busy}
            onPress={() => {
              setError(null)
              setConfirmCancel(true)
            }}
          >
            <Text style={styles.error}>Cancel and delete workout</Text>
          </Pressable>
        </>
      ) : null}
      {session?.completedAt && !sessionId ? (
        <Pressable
          style={styles.secondary}
          disabled={busy}
          onPress={() => setSelectedId(undefined)}
        >
          <Text style={styles.text}>Start another workout</Text>
        </Pressable>
      ) : null}
      <Sheet
        visible={editor !== null}
        title={editor?.set ? "Edit logged set" : "Log completed set"}
        onClose={() => {
          if (!busy) setEditor(null)
        }}
      >
        <Text style={styles.text}>{editor?.exercise.name}</Text>
        <Text style={styles.muted}>
          Enter what you actually completed. Use 0 kg for bodyweight. Values are manually confirmed,
          not detected.
        </Text>
        {editor?.exercise.repetitionUnit === "reps" ? (
          <SheetField label="Weight (kg)">
            <TextInput
              accessibilityLabel="Weight in kilograms"
              style={styles.input}
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
              editable={!busy}
              accessibilityState={{ disabled: busy }}
            />
          </SheetField>
        ) : null}
        <SheetField label={`Completed ${editor?.exercise.repetitionUnit ?? "quantity"}`}>
          <TextInput
            accessibilityLabel={`Completed ${editor?.exercise.repetitionUnit ?? "quantity"}`}
            style={styles.input}
            keyboardType="number-pad"
            value={reps}
            onChangeText={setReps}
            editable={!busy}
            accessibilityState={{ disabled: busy }}
          />
        </SheetField>
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <Pressable
          style={styles.primary}
          disabled={busy}
          accessibilityState={{ busy }}
          onPress={() => void submitSet()}
        >
          <Text style={styles.primaryText}>Save set</Text>
        </Pressable>
        <Pressable style={styles.secondary} disabled={busy} onPress={() => setEditor(null)}>
          <Text style={styles.text}>Keep workout, discard edits</Text>
        </Pressable>
      </Sheet>
      <Sheet
        visible={confirmCancel}
        title="Delete this workout?"
        onClose={() => {
          if (!busy) setConfirmCancel(false)
        }}
      >
        <Text style={styles.text}>
          The session and all its logged sets will be permanently deleted.
        </Text>
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <Pressable
          style={styles.primary}
          disabled={busy}
          accessibilityState={{ busy }}
          onPress={() =>
            void perform(async () => {
              if (!id) return
              await cancelSession(id)
              setConfirmCancel(false)
              setSelectedId(undefined)
            })
          }
        >
          <Text style={styles.primaryText}>Delete workout</Text>
        </Pressable>
        <Pressable style={styles.secondary} disabled={busy} onPress={() => setConfirmCancel(false)}>
          <Text style={styles.text}>Keep workout</Text>
        </Pressable>
      </Sheet>
    </View>
  )
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 24, paddingTop: 12 },
  title: { fontSize: 18, fontWeight: "600", color: C.text },
  text: { fontSize: 14, color: C.text },
  muted: { fontSize: 12, lineHeight: 18, color: C.textMuted },
  error: { fontSize: 13, color: C.accent },
  input: { fontSize: 18, color: C.text, minHeight: 48, paddingVertical: 8 },
  primary: {
    minHeight: 52,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.accent,
  },
  primaryText: { fontSize: 15, fontWeight: "600", color: C.onAccent },
  secondary: {
    minHeight: 48,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
  },
})
