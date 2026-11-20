import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Button, PageHeading, Screen } from "@/components/ui"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/features/auth"
import { dateKey } from "@/features/health"
import { isActive } from "@/features/recovery"
import { usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { usePlanInput, usePlanPreferences } from "../store/plan-preferences.store"
import { formatLoad, loadUnit, useLoads } from "../store/training-weights.store"
import { backToBackFullBody, useWorkoutLog } from "../store/workout-log.store"
import { CATALOG, findExercise } from "../utils/catalog"
import { fromDateKey, routineOn, type RoutineExercise } from "../utils/routines"

export const formatRest = (seconds: number) =>
  seconds % 60
    ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
    : `${seconds / 60} min`

function ExerciseRow({ exercise, index }: { exercise: RoutineExercise; index: number }) {
  const { loadFor } = useLoads()
  const catalog = findExercise(exercise.key)
  const load = catalog ? loadFor(catalog) : null
  const weight = load && catalog ? `${formatLoad(load.kg)} ${loadUnit(catalog)}` : "Body weight"
  const target = exercise.prescription.split("x")[1]
  const reps = exercise.unit === "seconds" ? target : `${target} reps`

  return (
    <Pressable
      style={[styles.row, index > 0 && styles.rowDivider]}
      accessibilityLabel={`${exercise.name}, ${exercise.sets} sets of ${reps}, ${weight}`}
      accessibilityHint="Opens the technique guide"
      onPress={() => router.push(`/exercise-guide?name=${exercise.key}`)}
    >
      <Text style={styles.index}>{String(index + 1).padStart(2, "0")}</Text>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>
          {exercise.name}
          {exercise.liked ? <Text style={styles.liked}> ♥</Text> : null}
        </Text>
        <Text style={styles.rowSub}>
          {exercise.sets} sets x {reps}
        </Text>
        <Text style={styles.rowSub}>
          {weight} - Rest {formatRest(exercise.rest)}
        </Text>
        {exercise.warmUp ? <Text style={styles.rowSub}>Warm-up</Text> : null}
        {exercise.superset ? <Text style={styles.rowSub}>Superset</Text> : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  )
}

/** One day's routine, with Start workout. Any training day can start, with a warning for back-to-back full body. */
export function RoutineScreen() {
  const { date: param } = useLocalSearchParams<{ date?: string }>()
  const now = usePlanNow()
  const date = fromDateKey(param) ?? now
  const input = usePlanInput()
  const routine = routineOn(date, input)
  const finished = useWorkoutLog((state) => state.finished)
  const { user } = useAuth()
  const {
    routineOwner,
    routineStorageError,
    loadRoutines,
    saveRoutine,
    resetRoutine,
    customRoutines,
  } = usePlanPreferences()
  const [draft, setDraft] = useState<RoutineExercise[] | null>(null)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState(false)
  const isToday = dateKey(date) === dateKey(now)
  const key = dateKey(date)
  const day = isToday
    ? "Today"
    : date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })

  const injured = input.injuries.some((injury) => isActive(injury, key))
  const update = (index: number, patch: Partial<RoutineExercise>) => {
    setDraft(
      (items) => items?.map((item, i) => (i === index ? { ...item, ...patch } : item)) ?? null,
    )
  }
  const save = () => {
    if (!user || !draft?.length) return setError("Add at least one exercise before saving.")
    try {
      saveRoutine(user.id, { ...routine, exercises: draft })
      setDraft(null)
      setError(null)
    } catch {
      setError("Could not save this routine. Your changes are still here; try again.")
    }
  }
  const start = () => router.push(`/session?date=${key}`)

  return (
    <View style={styles.container}>
      <Screen contentStyle={styles.content}>
        <BackHeader label="Workout plan" onPress={() => router.back()} />
        <PageHeading
          eyebrow={day}
          title={routine.name}
          subtitle={routine.exercises.length ? `About ${routine.minutes} min` : undefined}
        />

        {draft ? (
          <>
            <Text style={styles.hint}>
              Changes apply whenever {routine.name} is scheduled and are saved on this device for
              your account. Warm-ups appear first.
            </Text>
            {draft.map((exercise, index) => (
              <View key={exercise.key} style={styles.editorCard}>
                <Text style={styles.rowTitle}>
                  {exercise.name}
                  {exercise.warmUp ? " · Warm-up" : ""}
                </Text>
                <Text style={styles.rowSub}>
                  {exercise.sets} sets · {exercise.reps} {exercise.unit} · {exercise.rest}s rest
                </Text>
                <View style={styles.actions}>
                  {(["sets", "reps", "rest"] as const).map((field) => (
                    <View key={field} style={styles.actions}>
                      <Pressable
                        accessibilityLabel={`Decrease ${field} for ${exercise.name}`}
                        onPress={() =>
                          update(index, {
                            [field]: Math.max(
                              field === "rest" ? 0 : 1,
                              exercise[field] - (field === "rest" ? 15 : 1),
                            ),
                          })
                        }
                      >
                        <Text style={styles.action}>− {field}</Text>
                      </Pressable>
                      <Pressable
                        accessibilityLabel={`Increase ${field} for ${exercise.name}`}
                        onPress={() =>
                          update(index, {
                            [field]: Math.min(
                              field === "rest" ? 600 : field === "sets" ? 20 : 999,
                              exercise[field] + (field === "rest" ? 15 : 1),
                            ),
                          })
                        }
                      >
                        <Text style={styles.action}>+ {field}</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
                <View style={styles.actions}>
                  <Pressable
                    onPress={() =>
                      setDraft((items) => {
                        if (!items) return items
                        const changed = items.map((item, i) =>
                          i === index
                            ? { ...item, warmUp: !item.warmUp, superset: undefined }
                            : { ...item, superset: undefined },
                        )
                        return [
                          ...changed.filter((item) => item.warmUp),
                          ...changed.filter((item) => !item.warmUp),
                        ]
                      })
                    }
                  >
                    <Text style={styles.action}>
                      {exercise.warmUp ? "Make working set" : "Make warm-up"}
                    </Text>
                  </Pressable>
                  {index > 0 && !!draft[index - 1]?.warmUp === !!exercise.warmUp ? (
                    <Pressable
                      onPress={() =>
                        setDraft((items) => {
                          if (!items) return items
                          const changed = items.map((item) => ({ ...item, superset: undefined }))
                          ;[changed[index - 1], changed[index]] = [
                            changed[index]!,
                            changed[index - 1]!,
                          ]
                          return changed
                        })
                      }
                    >
                      <Text style={styles.action}>Move up</Text>
                    </Pressable>
                  ) : null}
                  <Pressable
                    onPress={() =>
                      setDraft(
                        (items) =>
                          items
                            ?.filter((_, i) => i !== index)
                            .map((item) => ({ ...item, superset: undefined })) ?? null,
                      )
                    }
                  >
                    <Text style={styles.action}>Remove</Text>
                  </Pressable>
                </View>
                {index < draft.length - 1 && !!exercise.warmUp === !!draft[index + 1]?.warmUp ? (
                  <Pressable
                    onPress={() =>
                      setDraft((items) => {
                        if (!items) return items
                        const paired =
                          !!items[index]?.superset &&
                          items[index]?.superset === items[index + 1]?.superset
                        const affected = new Set(
                          [items[index]?.superset, items[index + 1]?.superset].filter(Boolean),
                        )
                        const id = `pair-${exercise.key}-${items[index + 1]!.key}`
                        return items.map((item, i) =>
                          i === index || i === index + 1
                            ? { ...item, superset: paired ? undefined : id }
                            : affected.has(item.superset)
                              ? { ...item, superset: undefined }
                              : item,
                        )
                      })
                    }
                  >
                    <Text style={styles.action}>
                      {exercise.superset && exercise.superset === draft[index + 1]?.superset
                        ? "Remove superset"
                        : "Superset with next"}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            ))}
            <Pressable onPress={() => setAdding(!adding)}>
              <Text style={styles.action}>{adding ? "Done adding" : "+ Add exercise"}</Text>
            </Pressable>
            {adding
              ? CATALOG.filter((item) => !draft.some((current) => current.key === item.key)).map(
                  (item) => (
                    <Pressable
                      key={item.key}
                      onPress={() => {
                        setDraft([
                          ...draft,
                          {
                            key: item.key,
                            name: item.name,
                            sets: 3,
                            reps: item.reps,
                            unit: item.unit,
                            rest: 75,
                            prescription: `3x${item.reps}${item.unit === "seconds" ? "s" : ""}`,
                          },
                        ])
                        setAdding(false)
                      }}
                    >
                      <Text style={styles.action}>
                        {item.name} · {item.group}
                      </Text>
                    </Pressable>
                  ),
                )
              : null}
            {error ? (
              <Text accessibilityLiveRegion="polite" style={styles.restText}>
                {error}
              </Text>
            ) : null}
            <Button label="Save routine" onPress={save} />
            <Pressable
              onPress={() => {
                setDraft(null)
                setError(null)
                setAdding(false)
              }}
            >
              <Text style={styles.action}>Cancel</Text>
            </Pressable>
          </>
        ) : routine.exercises.length ? (
          <>
            <View style={styles.list}>
              {routine.exercises.map((exercise, index) => (
                <ExerciseRow key={exercise.key} exercise={exercise} index={index} />
              ))}
            </View>
            <Text style={styles.hint}>Tap an exercise to see how it's done.</Text>
            {routineStorageError ? (
              <Pressable onPress={() => loadRoutines(user?.id ?? null)}>
                <Text style={styles.restText}>{routineStorageError} Tap to retry.</Text>
              </Pressable>
            ) : null}
            {user && routineOwner === user.id && !routineStorageError && !injured ? (
              <>
                <Pressable onPress={() => setDraft(routine.exercises.map((item) => ({ ...item })))}>
                  <Text style={styles.action}>Edit routine</Text>
                </Pressable>
                {customRoutines[routine.name] ? (
                  <Pressable
                    onPress={() => {
                      try {
                        resetRoutine(user.id, routine.name)
                        setError(null)
                      } catch {
                        setError("Could not restore the generated routine. Try again.")
                      }
                    }}
                  >
                    <Text style={styles.action}>Restore generated routine</Text>
                  </Pressable>
                ) : null}
              </>
            ) : injured ? (
              <Text style={styles.hint}>
                Editing is unavailable while recovery adjustments are active.
              </Text>
            ) : null}
            {error ? (
              <Text accessibilityLiveRegion="polite" style={styles.restText}>
                {error}
              </Text>
            ) : null}
            {user && routineOwner === user.id && !routineStorageError ? (
              <Button
                label="Start workout"
                onPress={() =>
                  backToBackFullBody(routine.name, now, input, finished)
                    ? setWarning(true)
                    : start()
                }
              />
            ) : !routineStorageError ? (
              <Text style={styles.hint}>Loading your routines…</Text>
            ) : null}
          </>
        ) : (
          <View style={styles.rest}>
            <Text style={styles.restText}>Rest and recover.</Text>
          </View>
        )}
      </Screen>

      <ConfirmDialog
        visible={warning}
        title="Full body two days in a row?"
        message="Muscles need about 48 hours to recover. Training full body on back-to-back days raises the risk of injury."
        cancelLabel="Not today"
        confirmLabel="Start anyway"
        onCancel={() => setWarning(false)}
        onConfirm={() => {
          setWarning(false)
          start()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    gap: 14,
  },
  editorCard: { backgroundColor: C.surface, borderRadius: 18, padding: 14, gap: 8 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  action: { color: C.accent, fontSize: 14, fontWeight: "600", paddingVertical: 10 },
  list: {
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 72,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  index: {
    fontSize: 12,
    color: C.textMuted,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  liked: {
    color: C.accent,
  },
  rowSub: {
    fontSize: 12,
    color: C.textMuted,
  },
  chevron: {
    fontSize: 20,
    color: C.track,
  },
  hint: {
    fontSize: 12,
    color: C.textMuted,
    textAlign: "center",
  },
  rest: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 20,
  },
  restText: {
    fontSize: 14,
    color: C.text,
  },
})
