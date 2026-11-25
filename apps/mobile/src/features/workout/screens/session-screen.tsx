import { useQuery, useQueryClient } from "@tanstack/react-query"
import * as Crypto from "expo-crypto"
import * as Haptics from "expo-haptics"
import { router, useLocalSearchParams } from "expo-router"
import { usePreventRemove } from "expo-router/react-navigation"
import { useEffect, useEffectEvent, useRef, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Button, Card, PageHeading, Screen } from "@/components/ui"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Pressable } from "@/components/ui/pressable"
import { Toggle } from "@/components/ui/toggle"
import { useAuth } from "@/features/auth"
import { dateKey } from "@/features/health"
import { useWatchStatus, useWatchStore } from "@/features/watch"
import { posthog } from "@/lib/analytics/posthog"
import { apiErrorMessage, apiRequest } from "@/lib/api/client"
import { planNow, usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { writeWorkout } from "../api/workout-api"
import { workoutQueryKeys } from "../hooks/workout-hooks"
import { usePlanInput, usePlanPreferences } from "../store/plan-preferences.store"
import {
  clearSessionDraft,
  readSessionDraft,
  writeSessionDraft,
  type SessionDraft,
} from "../store/session-draft.store"
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

/** Flatten exercises into set-by-set order, alternating superset members within a round. */
function sessionSlots(exercises: RoutineExercise[]) {
  const slots: { index: number; set: number }[] = []
  for (let index = 0; index < exercises.length;) {
    const first = exercises[index]!
    let end = index + 1
    if (first.superset) {
      while (end < exercises.length && exercises[end]!.superset === first.superset) end++
    }
    const rounds = Math.max(...exercises.slice(index, end).map((entry) => entry.sets))
    for (let set = 0; set < rounds; set++) {
      for (let member = index; member < end; member++) {
        if (set < exercises[member]!.sets) slots.push({ index: member, set })
      }
    }
    index = end
  }
  return slots
}

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
  // The draft lives in the database, so it is read asynchronously before the session starts.
  const [loadedDraft, setLoadedDraft] = useState<{ userId: string; draft: SessionDraft | null }>()
  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    void readSessionDraft(user.id).then((draft) => {
      if (!cancelled) setLoadedDraft({ userId: user.id, draft })
    })
    return () => {
      cancelled = true
    }
  }, [user?.id])
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
  if (loadedDraft?.userId !== user.id) {
    return (
      <Screen>
        <BackHeader label="Back" onPress={() => router.back()} />
        <PageHeading title="Preparing workout" />
      </Screen>
    )
  }
  return <ActiveSession key={user.id} input={input} initialDraft={loadedDraft.draft} />
}

/** Guided workout: one set at a time, a rest timer between sets, then a summary. */
function ActiveSession({
  input,
  initialDraft,
}: {
  input: PlanInput
  initialDraft: SessionDraft | null
}) {
  const { date: param, watch: fromWatch } = useLocalSearchParams<{
    date?: string
    watch?: string
  }>()
  const { user } = useAuth()
  const watch = useWatchStatus()
  const queryClient = useQueryClient()
  const planToday = usePlanNow()
  // Freeze the routine at the start so plan changes mid-workout don't reshuffle it.
  // A workout trained on the watch is continued, not replaced.
  const [adopted] = useState(() => {
    const store = useWatchStore.getState()
    const { session, routine: shared, restEndsAt: restEnd } = store
    if (!session || session.status === "closed" || !shared) return null
    if (store.watchSessionId !== session.id) return null
    const wanted = fromWatch ? shared : routineOn(fromDateKey(param) ?? planToday, input)
    return session.plan === wanted.name ? { session, routine: shared, restEnd } : null
  })
  const [routine, setRoutine] = useState(
    () => adopted?.routine ?? routineOn(fromDateKey(param) ?? planToday, input),
  )
  const progression = useQuery({
    queryKey: [...workoutQueryKeys.all(user?.id ?? "signed-out"), "progression"],
    queryFn: ({ signal }) =>
      apiRequest<{ exercises: ExerciseProgression[] }>("/workouts/progression", { signal }),
    enabled: Boolean(user?.id),
  })
  const slots = sessionSlots(routine.exercises)
  const saveRepTargets = usePlanPreferences((state) => state.saveRepTargets)
  const addFinished = useWorkoutLog((state) => state.add)

  // --- Draft / resume ---
  const [sessionDate, setSessionDate] = useState(() => param ?? dateKey(planToday))
  const existingDraft = initialDraft
  // A draft of this routine, including one left on an earlier day, resumes in place.
  const hasDraft = existingDraft !== null && existingDraft.routineName === routine.name
  // A draft of another routine is offered too: its exercise snapshot is restored on resume.
  const canResume = existingDraft !== null && (hasDraft || Boolean(existingDraft.exercises?.length))
  const [resumePrompt, setResumePrompt] = useState(canResume && !adopted)

  const [phase, setPhase] = useState<Phase>(() =>
    adopted?.session.status === "done" ? "summary" : adopted?.session.rest ? "rest" : "set",
  )
  const [position, setPosition] = useState(() => adopted?.session.pos ?? 0)
  const [skipped, setSkipped] = useState<number[]>(() => adopted?.session.skip ?? [])
  const { loadFor } = useLoads()
  const initialWeights = (exercises: RoutineExercise[]) =>
    exercises.map((item) => {
      const catalog = findExercise(item.key)
      return catalog ? (loadFor(catalog)?.kg ?? 0) : 0
    })
  const emptySets = (exercises: RoutineExercise[]): (LoggedSet | undefined)[][] =>
    exercises.map((item) => Array.from({ length: item.sets }, () => undefined))
  const ownDraft = adopted && initialDraft?.saveId === adopted.session.id ? initialDraft : null
  const [weights, setWeights] = useState(() =>
    ownDraft?.weights.length === routine.exercises.length
      ? ownDraft.weights
      : initialWeights(routine.exercises),
  )
  /** Sets finished on either device; the watch sends reps, weights stay here. */
  const mergeLog = (
    current: (LoggedSet | undefined)[][],
    log: [number, number, number][],
    loads: number[],
  ) =>
    current.map((sets, index) =>
      sets.map((value, set) => {
        const entry = log.find((item) => item[0] === index && item[1] === set)
        if (!entry) return value
        return { reps: entry[2], weightKg: value?.weightKg ?? loads[index] ?? 0 }
      }),
    )
  const repsAt = (exercises: RoutineExercise[], at: number) =>
    exercises[sessionSlots(exercises)[at]?.index ?? 0]?.reps ?? 0
  const [logged, setLogged] = useState(() =>
    mergeLog(
      emptySets(routine.exercises).map((sets, index) =>
        sets.map((_, set) => ownDraft?.logged[index]?.[set]),
      ),
      adopted?.session.log ?? [],
      weights,
    ),
  )
  const [draft, setDraft] = useState(() => repsAt(routine.exercises, adopted?.session.pos ?? 0))
  const [startedAt, setStartedAt] = useState(() => adopted?.session.at ?? Date.now())
  const [now, setNow] = useState(Date.now)
  const [restEndsAt, setRestEndsAt] = useState(() => adopted?.restEnd ?? 0)
  const [finishedAt, setFinishedAt] = useState<number | null>(() =>
    adopted?.session.status === "done" ? adopted.session.end || Date.now() : null,
  )
  const [keepReps, setKeepReps] = useState(true)
  const [repeatExit, setRepeatExit] = useState<(() => void) | null>(null)
  const [exitApproved, setExitApproved] = useState(false)
  // Shared with the watch, so either device's copy saves the same workout once.
  const [saveId, setSaveId] = useState(() => adopted?.session.id ?? Crypto.randomUUID())
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const appliedProgression = useRef(Boolean(ownDraft))
  const [skipProgression, setSkipProgression] = useState(false)

  /** Discard the persisted draft (session completed or user chose to start fresh). */
  const discardDraft = () => {
    if (user?.id) void clearSessionDraft(user.id)
  }

  // Autosave after every change, so a hardware back, app kill or crash still leaves a resumable draft.
  // Wait while the resume prompt is open, otherwise this routine would overwrite the draft being offered.
  useEffect(() => {
    if (!user?.id || resumePrompt || !slots.length) return
    void writeSessionDraft({
      userId: user.id,
      date: sessionDate,
      routineName: routine.name,
      position,
      weights,
      logged: logged as SessionDraft["logged"],
      reps: draft,
      skipped,
      exercises: routine.exercises,
      startedAt,
      saveId,
      finishedAt: finishedAt ?? undefined,
    })
  }, [
    user?.id,
    resumePrompt,
    sessionDate,
    routine.name,
    routine.exercises,
    position,
    weights,
    logged,
    draft,
    skipped,
    startedAt,
    saveId,
    finishedAt,
    slots.length,
  ])

  const continueDraft = () => {
    if (!existingDraft) return
    const saved = existingDraft
    const exercises = saved.exercises?.length ? saved.exercises : routine.exercises
    const restoredSlots = sessionSlots(exercises)
    const restoredPosition = Math.max(0, Math.min(saved.position, restoredSlots.length - 1))
    setRoutine((current) => ({ ...current, name: saved.routineName, exercises }))
    setPosition(restoredPosition)
    setWeights(
      saved.weights.length === exercises.length ? saved.weights : initialWeights(exercises),
    )
    setLogged(
      exercises.map((item, index) =>
        Array.from({ length: item.sets }, (_, set) => saved.logged[index]?.[set]),
      ),
    )
    setDraft(saved.reps ?? exercises[restoredSlots[restoredPosition]?.index ?? 0]?.reps ?? 0)
    setSkipped(saved.skipped ?? [])
    setStartedAt(saved.startedAt)
    setSessionDate(saved.date)
    setNow(Date.now())
    if (saved.saveId) setSaveId(saved.saveId)
    if (saved.finishedAt !== undefined) {
      setFinishedAt(saved.finishedAt)
      setPhase("summary")
    }
    appliedProgression.current = true
    setSkipProgression(true)
    setResumePrompt(false)
  }

  // --- Watch sync ---
  useEffect(() => {
    useWatchStore.setState({ sessionOpen: true })
    return () => useWatchStore.setState({ sessionOpen: false })
  }, [])

  // Apply what the watch did. Declared before publishing so it is never overwritten.
  const remoteSeq = useWatchStore((state) => state.remoteSeq)
  const appliedSeq = useRef(useWatchStore.getState().remoteSeq)
  const applyRemote = useEffectEvent(() => {
    if (remoteSeq === appliedSeq.current) return
    appliedSeq.current = remoteSeq
    const { session, restEndsAt: restEnd } = useWatchStore.getState()
    if (!session || session.status === "closed" || session.plan !== routine.name) return
    setResumePrompt(false)
    setSaveId(session.id)
    setStartedAt(session.at)
    if (session.pos !== position || session.id !== saveId) {
      setDraft(repsAt(routine.exercises, session.pos))
    }
    setPosition(session.pos)
    setSkipped(session.skip)
    setLogged((current) =>
      mergeLog(
        session.id === saveId ? current : emptySets(routine.exercises),
        session.log,
        weights,
      ),
    )
    setRestEndsAt(restEnd)
    setNow(Date.now())
    if (session.status === "done") {
      setFinishedAt(session.end || Date.now())
      setPhase("summary")
    } else {
      setFinishedAt(null)
      setPhase(restEnd > Date.now() ? "rest" : "set")
    }
  })
  useEffect(() => applyRemote(), [remoteSeq])

  // Tell the watch about every change made here.
  const publishLocal = useEffectEvent(() => {
    if (resumePrompt || !slots.length || remoteSeq !== appliedSeq.current) return
    useWatchStore.getState().publish(
      {
        id: saveId,
        plan: routine.name,
        status: phase === "summary" ? "done" : "active",
        at: startedAt,
        end: phase === "summary" ? (finishedAt ?? Date.now()) : 0,
        pos: position,
        restEndsAt: phase === "rest" ? restEndsAt : 0,
        log: logged.flatMap((sets, index) =>
          sets.flatMap((value, set): [number, number, number][] =>
            value ? [[index, set, value.reps]] : [],
          ),
        ),
        skip: skipped,
      },
      routine,
    )
  })
  useEffect(
    () => publishLocal(),
    [
      resumePrompt,
      saveId,
      routine,
      phase,
      startedAt,
      finishedAt,
      position,
      restEndsAt,
      logged,
      skipped,
    ],
  )

  useEffect(() => {
    const records = progression.data?.exercises
    if (!records || appliedProgression.current || resumePrompt) return
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
  }, [progression.data, routine, resumePrompt])

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
    if (
      exercise.superset &&
      exercise.superset === routine.exercises[following.index]?.superset &&
      following.set === slot.set
    ) {
      setPhase("set")
      return
    }
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
  const disableExitGuard = usePreventRemove(!exitApproved && totalSets > 0, ({ repeat }) => {
    if (!saving) setRepeatExit(() => repeat)
  })
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
      await clearSessionDraft(user.id)
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
    useWatchStore.getState().close(saveId)
    setExitApproved(true)
    disableExitGuard()
    if (!totalSets && user?.id) await clearSessionDraft(user.id)
    router.dismissTo("/workout")
  }

  if (resumePrompt && existingDraft)
    return (
      <Screen>
        <BackHeader label="Back" onPress={() => router.back()} />
        <PageHeading title="Preparing workout" />
        <ConfirmDialog
          visible
          title="Resume previous session?"
          message={`You left "${existingDraft.routineName}" without finishing. Continue where you left off, or start fresh.`}
          cancelLabel="Start fresh"
          confirmLabel="Continue"
          onCancel={() => {
            discardDraft()
            setResumePrompt(false)
          }}
          onConfirm={continueDraft}
        />
      </Screen>
    )

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

  const exitDialog = (
    <ConfirmDialog
      visible={repeatExit !== null}
      title="Leave workout?"
      message="Your progress is saved, so you can resume this workout next time."
      cancelLabel="Keep going"
      confirmLabel="Leave"
      onCancel={() => setRepeatExit(null)}
      onConfirm={() => {
        setExitApproved(true)
        repeatExit?.()
      }}
    />
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
        {exitDialog}
      </Screen>
    )
  }

  const exerciseNumber = slot.index + 1

  return (
    <View style={styles.container}>
      <Screen contentStyle={styles.content}>
        <BackHeader
          label="Leave"
          onPress={() => router.back()}
          actionLabel="Finish"
          onAction={finish}
        />

        <View style={styles.progressHead}>
          <Text style={styles.progressLabel}>
            Exercise {exerciseNumber} of {routine.exercises.length}
          </Text>
          <Text style={styles.progressLabel}>{formatClock((now - startedAt) / 1000)}</Text>
        </View>
        {watch.enabled ? <Text style={styles.progressLabel}>Watch · {watch.label}</Text> : null}
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
      {exitDialog}
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
