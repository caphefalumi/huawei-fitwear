import { useQuery, useQueryClient } from "@tanstack/react-query"
import * as Crypto from "expo-crypto"
import * as Haptics from "expo-haptics"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Button, Card, PageHeading, Screen } from "@/components/ui"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Pressable } from "@/components/ui/pressable"
import { Toggle } from "@/components/ui/toggle"
import { useAuth } from "@/features/auth"
import { dateKey } from "@/features/health"
import { posthog } from "@/lib/analytics/posthog"
import { apiErrorMessage, apiRequest } from "@/lib/api/client"
import { planNow, usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { writeWorkout } from "../api/workout-api"
import { workoutQueryKeys } from "../hooks/workout-hooks"
import { usePlanInput, usePlanPreferences } from "../store/plan-preferences.store"
import { formatLoad, loadStep, loadUnit, useLoads } from "../store/training-weights.store"
import { useWorkoutLog } from "../store/workout-log.store"
import { findExercise } from "../utils/catalog"
import { nextLoad, type ExerciseProgression } from "../utils/progression"
import {
  fromDateKey,
  repTargetKey,
  routineOn,
  type PlanInput,
  type RoutineExercise,
} from "../utils/routines"

const REST_EXTRA_SECONDS = 15
const TICK_MS = 250

export const formatClock = (totalSeconds: number) => {
  const seconds = Math.max(0, Math.ceil(totalSeconds))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}

const unitLabel = (exercise: RoutineExercise, value: number) =>
  exercise.unit === "seconds" ? `${value}s` : `${value} reps`
const target = (exercise: RoutineExercise) => exercise.prescription.split("x")[1] ?? ""
const average = (values: number[]) =>
  Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)

type Phase = "set" | "rest" | "summary"

type LoggedSet = { reps: number; weightKg: number }

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

export function SessionScreen() {
  const input = usePlanInput()
  const { user } = useAuth()
  const { routineOwner, routineStorageError, loadRoutines } = usePlanPreferences()
  if (!user || routineOwner !== user.id || routineStorageError) {
    return (
      <Screen>
        <BackHeader label="Back" onPress={() => router.back()} />
        <PageHeading
          title={routineStorageError ? "Could not load routines" : "Loading routines…"}
        />
        {routineStorageError && user ? (
          <Button label="Retry" onPress={() => loadRoutines(user.id)} />
        ) : null}
      </Screen>
    )
  }
  return <ActiveSession input={input} />
}

/** Guided workout: one set at a time, a rest timer between sets, then a summary. */
function ActiveSession({ input }: { input: PlanInput }) {
  const { date: param } = useLocalSearchParams<{ date?: string }>()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const planToday = usePlanNow()
  // Freeze the routine at the start so plan changes mid-workout don't reshuffle it.
  const [routine] = useState(() => routineOn(fromDateKey(param) ?? planToday, input))
  const progression = useQuery({
    queryKey: [...workoutQueryKeys.all(user?.id ?? "signed-out"), "progression"],
    queryFn: ({ signal }) =>
      apiRequest<{ exercises: ExerciseProgression[] }>("/workouts/progression", { signal }),
    enabled: Boolean(user?.id),
  })
  const slots: { index: number; set: number }[] = []
  for (let index = 0; index < routine.exercises.length;) {
    const first = routine.exercises[index]!
    let end = index + 1
    if (first.superset) {
      while (end < routine.exercises.length && routine.exercises[end]!.superset === first.superset)
        end++
    }
    const rounds = Math.max(...routine.exercises.slice(index, end).map((entry) => entry.sets))
    for (let set = 0; set < rounds; set++) {
      for (let member = index; member < end; member++) {
        if (set < routine.exercises[member]!.sets) slots.push({ index: member, set })
      }
    }
    index = end
  }
  const saveRepTargets = usePlanPreferences((state) => state.saveRepTargets)
  const addFinished = useWorkoutLog((state) => state.add)

  const [phase, setPhase] = useState<Phase>("set")
  const [position, setPosition] = useState(0)
  const [skipped, setSkipped] = useState<number[]>([])
  const { loadFor } = useLoads()
  const [weights, setWeights] = useState(() =>
    routine.exercises.map((item) => {
      const catalog = findExercise(item.key)
      return catalog ? (loadFor(catalog)?.kg ?? 0) : 0
    }),
  )
  const [logged, setLogged] = useState<(LoggedSet | undefined)[][]>(() =>
    routine.exercises.map((exercise) => Array.from({ length: exercise.sets }, () => undefined)),
  )
  const [draft, setDraft] = useState(routine.exercises[0]?.reps ?? 0)
  const [startedAt] = useState(() => Date.now())
  const [now, setNow] = useState(startedAt)
  const [restEndsAt, setRestEndsAt] = useState(0)
  const [finishedAt, setFinishedAt] = useState<number | null>(null)
  const [keepReps, setKeepReps] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [saveId] = useState(() => Crypto.randomUUID())
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const appliedProgression = useRef(false)
  const [skipProgression, setSkipProgression] = useState(false)

  useEffect(() => {
    const records = progression.data?.exercises
    if (!records || appliedProgression.current) return
    appliedProgression.current = true
    setWeights((current) =>
      routine.exercises.map((item, index) => {
        const history = records.find((entry) => entry.exerciseId === item.key)
        const exercise = findExercise(item.key)
        return history && exercise && !item.warmUp && exercise.equipment !== "bodyweight"
          ? nextLoad(history, item.sets, loadStep(exercise))
          : (current[index] ?? 0)
      }),
    )
  }, [progression.data, routine])

  useEffect(() => {
    if (phase === "summary") return
    const id = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(id)
  }, [phase])

  const restLeft = (restEndsAt - now) / 1000
  useEffect(() => {
    if (phase !== "rest" || restLeft > 0) return
    setPhase("set")
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }, [phase, restLeft])

  const slot = slots[Math.min(position, slots.length - 1)]
  const exercise = routine.exercises[slot?.index ?? 0]
  const catalog = findExercise(exercise?.key)
  const weightKg = weights[slot?.index ?? 0] ?? 0
  const weight =
    catalog && catalog.equipment !== "bodyweight"
      ? `${formatLoad(weightKg)} ${loadUnit(catalog)}`
      : "Body weight"

  const finish = () => {
    setFinishedAt(Date.now())
    setPhase("summary")
  }

  const doneSet = () => {
    if (!slot || !exercise) return
    setLogged((previous) =>
      previous.map((sets, index) =>
        index === slot.index
          ? sets.map((value, set) => (set === slot.set ? { reps: draft, weightKg } : value))
          : sets,
      ),
    )
    const next = slots.findIndex(
      (entry, index) => index > position && !skipped.includes(entry.index),
    )
    const following = slots[next]
    if (!following) return finish()
    setPosition(next)
    if (following.index !== slot.index) setDraft(routine.exercises[following.index]!.reps)
    setRestEndsAt(Date.now() + exercise.rest * 1000)
    setNow(Date.now())
    setPhase("rest")
  }

  const skipExercise = () => {
    if (!slot) return
    setSkipped((previous) => [...previous, slot.index])
    const following = slots.findIndex(
      (item, index) =>
        index > position && item.index !== slot.index && !skipped.includes(item.index),
    )
    if (following < 0) return finish()
    setPosition(following)
    setDraft(routine.exercises[slots[following]!.index]!.reps)
    setPhase("set")
  }

  // Summary numbers from what was actually logged.
  const done = routine.exercises
    .map((item, index) => ({
      item,
      sets: logged[index]!.filter((value): value is LoggedSet => value !== undefined),
    }))
    .filter(({ sets }) => sets.length)
  const totalSets = done.reduce((sum, { sets }) => sum + sets.length, 0)
  const sum = (unit: RoutineExercise["unit"]) =>
    done
      .filter(({ item }) => item.unit === unit)
      .reduce((total, { sets }) => total + sets.reduce((acc, value) => acc + value.reps, 0), 0)
  const changed = done.filter(({ item, sets }) => {
    const reps = average(sets.map((set) => set.reps))
    return reps > 0 && reps !== item.reps
  })

  const close = async () => {
    if (saving) return
    if (totalSets) {
      if (!user?.id) {
        setSaveError("Sign in to save your workout.")
        return
      }
      setSaving(true)
      setSaveError(null)
      try {
        const sets = slots
          .flatMap(({ index, set }) => {
            const entry = logged[index]?.[set]
            const item = routine.exercises[index]
            return entry && item
              ? [
                  {
                    exerciseId: item.key,
                    weightKg: entry.weightKg,
                    isWarmup: Boolean(item.warmUp),
                    targetReps: item.reps,
                    userConfirmedReps: entry.reps,
                    restDurationSeconds: item.rest,
                  },
                ]
              : []
          })
          .map((entry, index) => ({ ...entry, setIndex: index + 1 }))
        await writeWorkout({
          path: "/workouts/completed",
          method: "POST",
          body: {
            id: saveId,
            sessionTitle: routine.name,
            workoutSplit: routine.name,
            startedAt: new Date(startedAt).toISOString(),
            completedAt: new Date(finishedAt ?? Date.now()).toISOString(),
            sets,
          },
        })
        void queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all(user.id) })
      } catch (error) {
        setSaveError(apiErrorMessage(error, "your workout", "save"))
        setSaving(false)
        return
      }
      setSaving(false)
    }
    if (keepReps && changed.length)
      saveRepTargets(
        Object.fromEntries(
          changed.map(({ item, sets }) => [
            repTargetKey(routine.name, item.key),
            average(sets.map((set) => set.reps)),
          ]),
        ),
      )
    if (totalSets) {
      addFinished({ date: dateKey(planNow()), routine: routine.name })
      posthog?.capture("workout_completed", {
        routine_name: routine.name,
        exercise_count: done.length,
        set_count: totalSets,
        duration_seconds: Math.round(((finishedAt ?? Date.now()) - startedAt) / 1000),
      })
    }
    router.dismissTo("/workout")
  }

  if (!skipProgression && !progression.data) {
    return (
      <Screen contentStyle={styles.content}>
        <BackHeader label="Back" onPress={() => router.back()} />
        <PageHeading
          title={progression.isError ? "Could not load previous workouts" : "Preparing workout"}
          subtitle={
            progression.isError
              ? "Retry for progression suggestions, or continue without them."
              : "Loading your previous training…"
          }
        />
        {progression.isError ? (
          <>
            <Button label="Retry" onPress={() => void progression.refetch()} />
            <Button
              label="Continue without suggestions"
              variant="secondary"
              onPress={() => {
                appliedProgression.current = true
                setSkipProgression(true)
              }}
            />
          </>
        ) : null}
      </Screen>
    )
  }

  if (!exercise || !slot)
    return (
      <Screen contentStyle={styles.content}>
        <BackHeader label="Back" onPress={() => router.back()} />
        <PageHeading title="Rest day" subtitle="Nothing to train today." />
      </Screen>
    )

  if (phase === "summary") {
    const holds = sum("seconds")
    return (
      <Screen contentStyle={styles.content}>
        <View style={styles.celebrate}>
          <Text style={styles.celebrateEmoji}>🎉</Text>
          <Text style={styles.celebrateTitle} accessibilityRole="header">
            {totalSets ? "Great work!" : "Workout ended"}
          </Text>
          <Text style={styles.celebrateSub}>
            {totalSets ? `You finished ${routine.name}.` : "No sets were logged this time."}
          </Text>
        </View>

        <View style={styles.stats}>
          <Stat value={String(done.length)} label="Exercises" />
          <Stat value={String(totalSets)} label="Sets" />
          <Stat value={String(sum("reps"))} label="Reps" />
        </View>
        <Text style={styles.summaryMeta}>
          Time {formatClock(((finishedAt ?? now) - startedAt) / 1000)}
          {holds ? `\nPlus ${formatClock(holds)} of holds` : ""}
        </Text>

        {done.length ? (
          <Card style={styles.summaryList}>
            {done.map(({ item, sets }) => (
              <View key={item.key} style={styles.summaryRow}>
                <Text style={styles.summaryName}>{item.name}</Text>
                <Text style={styles.summaryValue}>
                  {sets.map((set) => set.reps).join(", ")}
                  {item.unit === "seconds" ? "s" : " reps"}
                </Text>
              </View>
            ))}
          </Card>
        ) : null}
        {progression.data
          ? done.map(({ item, sets }) => {
              const previous = progression.data.exercises.find(
                (entry) => entry.exerciseId === item.key,
              )
              const best = Math.max(
                0,
                ...sets.filter((set) => set.reps > 0).map((set) => set.weightKg),
              )
              return previous && best > previous.maxWeightKg ? (
                <Text key={item.key} style={styles.summaryMeta}>
                  New weight record: {item.name} · {formatLoad(best)} kg
                </Text>
              ) : null
            })
          : null}

        {changed.length ? (
          <View style={styles.keep}>
            <View style={styles.keepCopy}>
              <Text style={styles.keepTitle}>Use these reps next time</Text>
              <Text style={styles.keepSub}>
                Updates {changed.length === 1 ? "1 exercise" : `${changed.length} exercises`} in{" "}
                {routine.name}.
              </Text>
            </View>
            <Toggle
              accessibilityLabel="Use these reps next time"
              value={keepReps}
              onValueChange={setKeepReps}
            />
          </View>
        ) : null}

        {saveError ? (
          <Text accessibilityRole="alert" style={styles.summaryMeta}>
            {saveError}
          </Text>
        ) : null}
        <Button
          label={totalSets ? "Save workout" : "Done"}
          onPress={() => void close()}
          busy={saving}
        />
      </Screen>
    )
  }

  const exerciseNumber = slot.index + 1

  return (
    <View style={styles.container}>
      <Screen contentStyle={styles.content}>
        <BackHeader
          label="Leave"
          onPress={() => setLeaving(true)}
          actionLabel="Finish"
          onAction={finish}
        />

        <View style={styles.progressHead}>
          <Text style={styles.progressLabel}>
            Exercise {exerciseNumber} of {routine.exercises.length}
          </Text>
          <Text style={styles.progressLabel}>{formatClock((now - startedAt) / 1000)}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(position / slots.length) * 100}%` }]} />
        </View>

        {phase === "rest" ? (
          <>
            <View style={styles.restBlock}>
              <Text style={styles.restLabel}>Rest</Text>
              <Text
                style={styles.restClock}
                accessibilityLabel={`Rest, ${formatClock(restLeft)} left`}
              >
                {formatClock(restLeft)}
              </Text>
              <View style={styles.restActions}>
                <Pressable
                  style={styles.restButton}
                  accessibilityLabel="Add 15 seconds"
                  onPress={() => setRestEndsAt((value) => value + REST_EXTRA_SECONDS * 1000)}
                >
                  <Text style={styles.restButtonLabel}>+15s</Text>
                </Pressable>
                <Pressable style={styles.restButton} onPress={() => setPhase("set")}>
                  <Text style={styles.restButtonLabel}>Skip rest</Text>
                </Pressable>
              </View>
            </View>
            <Card style={styles.upNext}>
              <Text style={styles.upNextLabel}>UP NEXT</Text>
              <Text style={styles.upNextName}>{exercise.name}</Text>
              <Text style={styles.upNextSub}>
                Set {slot.set + 1} of {exercise.sets} - {weight} - Target {target(exercise)}
              </Text>
            </Card>
          </>
        ) : (
          <>
            <View style={styles.setHead}>
              <Text style={styles.setTitle} accessibilityRole="header">
                {exercise.name}
              </Text>
              <Text style={styles.setSub}>
                Set {slot.set + 1} of {exercise.sets} - {weight}
              </Text>
              <Pressable
                hitSlop={10}
                onPress={() => router.push(`/exercise-guide?name=${exercise.key}`)}
              >
                <Text style={styles.link}>How to do it ›</Text>
              </Pressable>
            </View>

            {catalog && catalog.equipment !== "bodyweight" ? (
              <Card style={styles.repCard}>
                <View style={styles.stepper}>
                  <Pressable
                    style={styles.stepButton}
                    accessibilityLabel="Decrease weight"
                    onPress={() =>
                      setWeights((values) =>
                        values.map((value, index) =>
                          index === slot.index ? Math.max(0, value - loadStep(catalog)) : value,
                        ),
                      )
                    }
                  >
                    <Text style={styles.stepLabel}>−</Text>
                  </Pressable>
                  <Text style={styles.stepUnit}>{weight}</Text>
                  <Pressable
                    style={styles.stepButton}
                    accessibilityLabel="Increase weight"
                    onPress={() =>
                      setWeights((values) =>
                        values.map((value, index) =>
                          index === slot.index ? Math.min(1000, value + loadStep(catalog)) : value,
                        ),
                      )
                    }
                  >
                    <Text style={styles.stepLabel}>+</Text>
                  </Pressable>
                </View>
              </Card>
            ) : null}

            <Card style={styles.repCard}>
              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepButton}
                  accessibilityLabel={exercise.unit === "seconds" ? "Fewer seconds" : "Fewer reps"}
                  onPress={() =>
                    setDraft((value) => Math.max(0, value - (exercise.unit === "seconds" ? 5 : 1)))
                  }
                >
                  <Text style={styles.stepLabel}>−</Text>
                </Pressable>
                <View style={styles.stepValue}>
                  <Text style={styles.stepNumber} accessibilityLabel={unitLabel(exercise, draft)}>
                    {draft}
                  </Text>
                  <Text style={styles.stepUnit}>
                    {exercise.unit === "seconds" ? "seconds" : "reps"}
                  </Text>
                </View>
                <Pressable
                  style={styles.stepButton}
                  accessibilityLabel={exercise.unit === "seconds" ? "More seconds" : "More reps"}
                  onPress={() =>
                    setDraft((value) =>
                      Math.min(999, value + (exercise.unit === "seconds" ? 5 : 1)),
                    )
                  }
                >
                  <Text style={styles.stepLabel}>+</Text>
                </Pressable>
              </View>
              <Text style={styles.targetText}>Target {target(exercise)}</Text>
            </Card>

            <Button label="Done set" onPress={doneSet} />
            <Pressable style={styles.skip} onPress={skipExercise}>
              <Text style={styles.skipLabel}>Skip exercise</Text>
            </Pressable>
          </>
        )}
      </Screen>

      <ConfirmDialog
        visible={leaving}
        title="Leave workout?"
        message="Sets you logged in this workout won't be saved."
        cancelLabel="Keep going"
        confirmLabel="Leave"
        onCancel={() => setLeaving(false)}
        onConfirm={() => {
          setLeaving(false)
          router.back()
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
  progressHead: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: C.card,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: C.accent,
  },
  setHead: {
    gap: 4,
    paddingTop: 8,
  },
  setTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: C.text,
  },
  setSub: {
    fontSize: 14,
    color: C.textMuted,
  },
  link: {
    fontSize: 13,
    fontWeight: "600",
    color: C.accent,
    paddingTop: 4,
  },
  repCard: {
    padding: 14,
    gap: 10,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: C.previewTint,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: 28,
    color: C.text,
  },
  stepValue: {
    alignItems: "center",
  },
  stepNumber: {
    fontSize: 44,
    fontWeight: "600",
    color: C.text,
  },
  stepUnit: {
    fontSize: 12,
    color: C.textMuted,
  },
  targetText: {
    fontSize: 12,
    color: C.textMuted,
    textAlign: "center",
  },
  skip: {
    alignSelf: "center",
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  skipLabel: {
    fontSize: 13,
    color: C.textMuted,
  },
  restBlock: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 24,
  },
  restLabel: {
    fontSize: 13,
    letterSpacing: 0.8,
    color: C.textMuted,
    textTransform: "uppercase",
  },
  restClock: {
    fontSize: 64,
    fontWeight: "300",
    color: C.text,
    fontVariant: ["tabular-nums"],
  },
  restActions: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 8,
  },
  restButton: {
    minWidth: 110,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  restButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  upNext: {
    padding: 14,
    gap: 3,
  },
  upNextLabel: {
    fontSize: 10,
    letterSpacing: 0.6,
    color: C.textMuted,
  },
  upNextName: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
  },
  upNextSub: {
    fontSize: 12,
    color: C.textMuted,
  },
  celebrate: {
    alignItems: "center",
    gap: 6,
    paddingTop: 32,
  },
  celebrateEmoji: {
    fontSize: 44,
  },
  celebrateTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: C.text,
  },
  celebrateSub: {
    fontSize: 14,
    color: C.textMuted,
  },
  stats: {
    flexDirection: "row",
    gap: 10,
  },
  stat: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "600",
    color: C.text,
  },
  statLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  summaryMeta: {
    fontSize: 12,
    color: C.textMuted,
    textAlign: "center",
  },
  summaryList: {
    padding: 14,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryName: {
    flex: 1,
    fontSize: 13,
    color: C.text,
  },
  summaryValue: {
    fontSize: 13,
    color: C.textMuted,
  },
  keep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.accentTint,
    borderRadius: 16,
    padding: 14,
  },
  keepCopy: {
    flex: 1,
    gap: 2,
  },
  keepTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  keepSub: {
    fontSize: 12,
    color: C.textMuted,
  },
})
