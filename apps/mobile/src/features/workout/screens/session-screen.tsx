import { useQuery, useQueryClient } from "@tanstack/react-query"
import * as Crypto from "expo-crypto"
import * as Haptics from "expo-haptics"
import { router, useLocalSearchParams } from "expo-router"
import { usePreventRemove } from "expo-router/react-navigation"
import { SymbolView } from "expo-symbols"
import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react"
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native"
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

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
import {
  EASE_OUT,
  ExerciseProgress,
  ExerciseThumb,
  glyphs,
  ProgressRing,
  RoundButton,
  SetStrip,
  WatchChip,
} from "../components/session-parts"
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
import { EQUIPMENT_LABELS } from "../utils/muscle-groups"
import { nextLoad, type ExerciseProgression } from "../utils/progression"
import {
  fromDateKey,
  repTargetKey,
  routineOn,
  type PlanInput,
  type RoutineExercise,
} from "../utils/routines"
import {
  allSets,
  sessionSlots,
  slotLabel,
  slotRest,
  slotTarget,
  warmUpCount,
  warmUpLoad,
  warmUpStep,
  type Slot,
} from "../utils/warm-up"

const REST_EXTRA_SECONDS = 15
const TICK_MS = 250

export const formatClock = (totalSeconds: number) => {
  const seconds = Math.max(0, Math.ceil(totalSeconds))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const clock = `${String(seconds % 60).padStart(2, "0")}`
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${clock}` : `${minutes}:${clock}`
}

const unitLabel = (exercise: RoutineExercise, value: number) =>
  exercise.unit === "seconds" ? `${value}s` : `${value} reps`
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

/** Leave on the leading edge, the clock in the middle, Finish on the trailing edge. */
function TopBar({
  title,
  elapsed,
  onFinish,
}: {
  title: string
  elapsed: string
  onFinish: () => void
}) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
      <RoundButton
        glyph={glyphs.back}
        label="Leave workout"
        size={44}
        plain
        onPress={() => router.back()}
      />
      <View style={styles.topCenter}>
        <Text style={styles.topTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.topClock} accessibilityLabel={`${elapsed} elapsed`}>
          {elapsed}
        </Text>
      </View>
      <Pressable style={styles.finish} hitSlop={8} onPress={onFinish}>
        <Text style={styles.finishLabel}>Finish</Text>
      </Pressable>
    </View>
  )
}

/** The screen's one main action, held above the home indicator. */
function Footer({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
      {children}
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
  // Unfinished sets from either device are offered back, unless the watch just opened this screen.
  const unfinished =
    adopted?.session.status === "active" &&
    (adopted.session.pos > 0 || adopted.session.log.length > 0 || adopted.session.skip.length > 0)
  const [resumePrompt, setResumePrompt] = useState(!fromWatch && (adopted ? unfinished : canResume))

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
    exercises.map((item) => Array.from({ length: allSets(item) }, () => undefined))
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
  const repsAt = (exercises: RoutineExercise[], at: number) => {
    const target = sessionSlots(exercises)[at]
    const item = exercises[target?.index ?? 0]
    return item && target ? slotTarget(item, target) : (item?.reps ?? 0)
  }
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
        Array.from({ length: allSets(item) }, (_, set) => saved.logged[index]?.[set]),
      ),
    )
    setDraft(saved.reps ?? repsAt(exercises, restoredPosition))
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

  /** Starts over: the unfinished workout is discarded here and on the watch. */
  const startNewCycle = () => {
    const unfinishedId = adopted?.session.id ?? existingDraft?.saveId
    if (unfinishedId) useWatchStore.getState().close(unfinishedId)
    discardDraft()
    if (adopted) {
      setSaveId(Crypto.randomUUID())
      setStartedAt(Date.now())
      setPosition(0)
      setSkipped([])
      setLogged(emptySets(routine.exercises))
      setWeights(initialWeights(routine.exercises))
      setDraft(repsAt(routine.exercises, 0))
      setRestEndsAt(0)
      setFinishedAt(null)
      setPhase("set")
      appliedProgression.current = false
    }
    setResumePrompt(false)
  }

  useEffect(() => {
    const records = progression.data?.exercises
    if (!records || appliedProgression.current || resumePrompt) return
    appliedProgression.current = true
    setWeights((current) =>
      routine.exercises.map((item, index) => {
        const history = records.find((entry) => entry.exerciseId === item.key)
        const exercise = findExercise(item.key)
        return history && exercise && exercise.equipment !== "bodyweight"
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
  /** Warm-up loads ramp toward the working weight unless changed for that set. */
  const [warmLoads, setWarmLoads] = useState<Record<string, number>>({})
  const step = catalog ? loadStep(catalog) : 2.5
  const loadAt = (target: Slot | undefined) => {
    if (!target) return 0
    const working = weights[target.index] ?? 0
    if (!target.warmUp) return working
    return (
      warmLoads[`${target.index}:${target.set}`] ??
      warmUpLoad(working, warmUpStep(target.of, target.n).share, step)
    )
  }
  const weightKg = loadAt(slot)
  const target = exercise && slot ? slotTarget(exercise, slot) : 0
  const weight =
    catalog && catalog.equipment !== "bodyweight"
      ? `${formatLoad(weightKg)} ${loadUnit(catalog)}`
      : "Body weight"
  const reduceMotion = useReducedMotion()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()

  // --- Live reps from the watch ---
  const live = useWatchStore((state) => state.live)
  const setKey = `${saveId}:${position}`
  const liveHere =
    watch.connected && phase === "set" && live && `${live.id}:${live.pos}` === setKey ? live : null
  /**
   * The set whose count comes from the watch. Every set starts at 0 there, so the target stays here
   * until the watch counts from the wrist or its count changes.
   */
  const [countedSet, setCountedSet] = useState("")
  /** The set whose count was changed here; the watch's count is offered, not imposed, from then on. */
  const [editedSet, setEditedSet] = useState("")
  const bump = useSharedValue(1)
  const bumpStyle = useAnimatedStyle(() => ({ transform: [{ scale: bump.get() }] }))
  const followWatch = useEffectEvent(() => {
    if (!liveHere || (liveHere.reps === 0 && !liveHere.auto && countedSet !== setKey)) return
    setCountedSet(setKey)
    if (editedSet === setKey || liveHere.reps === draft) return
    setDraft(liveHere.reps)
    if (!reduceMotion) {
      bump.set(
        withSequence(
          withTiming(1.08, { duration: 90, easing: EASE_OUT }),
          withTiming(1, { duration: 180, easing: EASE_OUT }),
        ),
      )
    }
  })
  useEffect(() => followWatch(), [live, setKey, phase])
  const watchCount = liveHere && countedSet === setKey ? liveHere : null
  const followingWatch = watchCount !== null && editedSet !== setKey

  const countStep = exercise?.unit === "seconds" ? 5 : 1
  const changeDraft = (delta: number) => {
    setEditedSet(setKey)
    setDraft((value) => Math.min(999, Math.max(0, value + delta)))
    void Haptics.selectionAsync().catch(() => {})
  }
  const changeWeight = (delta: number) => {
    if (!slot) return
    if (slot.warmUp) {
      const key = `${slot.index}:${slot.set}`
      setWarmLoads((loads) => ({ ...loads, [key]: Math.min(1000, Math.max(0, weightKg + delta)) }))
      void Haptics.selectionAsync().catch(() => {})
      return
    }
    setWeights((values) =>
      values.map((value, index) =>
        index === slot.index ? Math.min(1000, Math.max(0, value + delta)) : value,
      ),
    )
    void Haptics.selectionAsync().catch(() => {})
  }

  // The rep ring fills toward the target; a ring past the target stays full.
  const repProgress = useSharedValue(0)
  const repFill = target > 0 ? draft / target : 0
  useEffect(() => {
    repProgress.set(withTiming(repFill, { duration: 240, easing: EASE_OUT }))
  }, [repFill, repProgress])

  // The rest ring drains with the clock, on the UI thread rather than with each tick.
  const lastDone = slots
    .slice(0, position)
    .reverse()
    .find(({ index, set }) => logged[index]?.[set])
  const restSlot = lastDone ?? slot
  const restItem = routine.exercises[restSlot?.index ?? 0]
  const restBase = restItem && restSlot ? slotRest(restItem, restSlot) : 0
  const restProgress = useSharedValue(1)
  useEffect(() => {
    if (phase !== "rest") return
    const left = Math.max(0, restEndsAt - Date.now())
    const span = Math.max(left, restBase * 1000, 1)
    const settle = Math.min(200, left)
    restProgress.set(
      withSequence(
        withTiming(left / span, { duration: settle, easing: EASE_OUT }),
        // A countdown is a readout, not decoration: it keeps moving under Reduce Motion.
        withTiming(0, {
          duration: left - settle,
          easing: Easing.linear,
          reduceMotion: ReduceMotion.Never,
        }),
      ),
    )
  }, [phase, restEndsAt, restBase, restProgress])

  const finish = () => {
    setFinishedAt(Date.now())
    setPhase("summary")
  }

  const doneSet = () => {
    if (!slot || !exercise) return
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
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
    if (following.index !== slot.index || following.warmUp !== slot.warmUp)
      setDraft(slotTarget(routine.exercises[following.index]!, following))
    setRestEndsAt(Date.now() + slotRest(exercise, slot) * 1000)
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
    setDraft(slotTarget(routine.exercises[slots[following]!.index]!, slots[following]!))
    setPhase("set")
  }

  // Summary numbers from what was actually logged.
  const done = routine.exercises
    .map((item, index) => ({
      item,
      // Warm-up sets are left out of the summary, records and rep targets.
      sets: logged[index]!.slice(warmUpCount(item)).filter(
        (value): value is LoggedSet => value !== undefined,
      ),
    }))
    .filter(({ sets }) => sets.length)
  const totalSets = done.reduce((sum, { sets }) => sum + sets.length, 0)
  /** Every finished set, warm-ups included: anything worth saving or guarding. */
  const loggedCount = logged.reduce((sum, sets) => sum + sets.filter(Boolean).length, 0)
  const disableExitGuard = usePreventRemove(!exitApproved && loggedCount > 0, ({ repeat }) => {
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
    if (loggedCount) {
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
                    isWarmup: set < warmUpCount(item),
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
    if (!loggedCount && user?.id) await clearSessionDraft(user.id)
    router.dismissTo("/workout")
  }

  if (resumePrompt)
    return (
      <Screen>
        <BackHeader label="Back" onPress={() => router.back()} />
        <PageHeading title="Preparing workout" />
        <ConfirmDialog
          visible
          title="Resume previous session?"
          message={`You left "${adopted ? routine.name : existingDraft?.routineName}" without finishing. Continue the old cycle, or start a new one.`}
          cancelLabel="New cycle"
          confirmLabel="Continue"
          onCancel={startNewCycle}
          onConfirm={adopted ? () => setResumePrompt(false) : continueDraft}
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
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 36 }]}
        >
          <View style={styles.celebrate}>
            <View style={styles.doneBadge}>
              <SymbolView name={glyphs.check} size={30} tintColor={C.onAccent} />
            </View>
            <Text style={styles.celebrateTitle} accessibilityRole="header">
              {totalSets ? "Great work!" : "Workout ended"}
            </Text>
            <Text style={styles.celebrateSub}>
              {totalSets ? `You finished ${routine.name}.` : "No sets were logged this time."}
            </Text>
          </View>

          <View style={styles.stats}>
            <Stat value={formatClock(((finishedAt ?? now) - startedAt) / 1000)} label="Time" />
            <Stat value={String(done.length)} label="Exercises" />
            <Stat value={String(totalSets)} label="Sets" />
            <Stat value={String(sum("reps"))} label="Reps" />
          </View>
          {holds ? (
            <Text style={styles.summaryMeta}>Plus {formatClock(holds)} of holds</Text>
          ) : null}

          {done.length ? (
            <View style={styles.summaryList}>
              {done.map(({ item, sets }, index) => (
                <View key={item.key} style={[styles.summaryRow, index > 0 && styles.divider]}>
                  <ExerciseThumb exerciseKey={item.key} name={item.name} size={40} />
                  <View style={styles.summaryCopy}>
                    <Text style={styles.summaryName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.summaryValue}>
                      {sets.map((set) => set.reps).join(", ")}
                      {item.unit === "seconds" ? " s" : " reps"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
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
                  <Text key={item.key} style={styles.record}>
                    New weight record: {item.name} - {formatLoad(best)} kg
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
            <Text accessibilityRole="alert" style={styles.error}>
              {saveError}
            </Text>
          ) : null}
        </ScrollView>
        <Footer>
          <Button
            label={loggedCount ? "Save workout" : "Done"}
            onPress={() => void close()}
            busy={saving}
          />
        </Footer>
        {exitDialog}
      </View>
    )
  }

  const seconds = exercise.unit === "seconds"
  const loadable = catalog !== undefined && catalog.equipment !== "bodyweight"
  const openGuide = () => router.push(`/exercise-guide?name=${exercise.key}`)
  const fills = routine.exercises.map((item, index) =>
    skipped.includes(index)
      ? null
      : (logged[index]?.filter(Boolean).length ?? 0) / Math.max(1, allSets(item)),
  )
  const takeWatchCount = () => {
    if (!watchCount) return
    setEditedSet("")
    setDraft(watchCount.reps)
  }
  const ringSize = Math.min(196, Math.max(132, width - 204))
  const lastItem = lastDone ? routine.exercises[lastDone.index] : undefined
  const lastValue = lastDone ? logged[lastDone.index]?.[lastDone.set] : undefined

  const setView = (
    <>
      <View style={styles.exerciseHead}>
        <ExerciseThumb exerciseKey={exercise.key} name={exercise.name} onPress={openGuide} />
        <View style={styles.exerciseCopy}>
          <Text style={styles.eyebrow}>
            Exercise {slot.index + 1} of {routine.exercises.length}
          </Text>
          <Text style={styles.exerciseName} accessibilityRole="header" numberOfLines={2}>
            {exercise.name}
          </Text>
          <Text style={styles.setLine}>
            {slotLabel(slot)}
            {loadable ? "" : " - Body weight"}
          </Text>
        </View>
      </View>
      {/* Warm-up and working sets each get their own strip, so the pills match the label. */}
      <SetStrip
        sets={(logged[slot.index] ?? [])
          .slice(slot.set - slot.n, slot.set - slot.n + slot.of)
          .map((value, n) => ({
            done: value?.reps,
            target: slot.warmUp ? warmUpStep(slot.of, n).reps : exercise.reps,
          }))}
        current={slot.n}
        seconds={seconds}
      />

      <Card style={styles.countCard}>
        <View style={styles.cardHead}>
          <Text style={styles.cardLabel}>{seconds ? "Seconds" : "Reps"}</Text>
          {watch.enabled ? (
            <WatchChip
              live={liveHere !== null && editedSet !== setKey && (liveHere.auto || followingWatch)}
              label={watch.connected ? watch.name || "Watch connected" : watch.label}
            />
          ) : null}
        </View>
        <View style={styles.countRow}>
          <RoundButton
            glyph={glyphs.minus}
            label={seconds ? "Fewer seconds" : "Fewer reps"}
            onPress={() => changeDraft(-countStep)}
          />
          <ProgressRing size={ringSize} stroke={8} progress={repProgress}>
            <Animated.Text
              style={[styles.countNumber, bumpStyle]}
              accessibilityLabel={unitLabel(exercise, draft)}
              accessibilityLiveRegion={followingWatch ? "polite" : "none"}
            >
              {draft}
            </Animated.Text>
            <Text style={styles.countOf}>
              of {target}
              {seconds ? " s" : " reps"}
            </Text>
          </ProgressRing>
          <RoundButton
            glyph={glyphs.plus}
            label={seconds ? "More seconds" : "More reps"}
            onPress={() => changeDraft(countStep)}
          />
        </View>
        {/* Held open while the watch is connected, so the cards below stay put when counting starts. */}
        {watch.connected ? (
          <View style={styles.captionRow}>
            {followingWatch ? (
              <Text style={styles.countCaption}>
                {!watchCount.auto
                  ? "Changed on your watch"
                  : watchCount.reps
                    ? "Counted from your wrist"
                    : "Start moving. Your watch counts each rep."}
              </Text>
            ) : watchCount ? (
              <Pressable
                style={styles.useWatch}
                hitSlop={12}
                accessibilityLabel={`Use the watch's count, ${unitLabel(exercise, watchCount.reps)}`}
                onPress={takeWatchCount}
              >
                <Text style={styles.useWatchLabel}>Use watch count - {watchCount.reps}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </Card>

      {loadable ? (
        <Card style={styles.loadCard}>
          <View style={styles.loadCopy}>
            <Text style={styles.cardLabel}>Weight</Text>
            <Text style={styles.loadHint}>{EQUIPMENT_LABELS[catalog.equipment]}</Text>
          </View>
          <RoundButton
            glyph={glyphs.minus}
            label="Decrease weight"
            size={44}
            onPress={() => changeWeight(-loadStep(catalog))}
          />
          <Text style={styles.loadValue} accessibilityLabel={`Weight, ${weight}`}>
            {formatLoad(weightKg)}
            <Text style={styles.loadUnit}> {loadUnit(catalog)}</Text>
          </Text>
          <RoundButton
            glyph={glyphs.plus}
            label="Increase weight"
            size={44}
            onPress={() => changeWeight(loadStep(catalog))}
          />
        </Card>
      ) : null}

      <Pressable style={styles.skip} onPress={skipExercise}>
        <Text style={styles.skipLabel}>Skip exercise</Text>
      </Pressable>
    </>
  )

  const restView = (
    <>
      <View style={styles.restHero}>
        <ProgressRing size={Math.min(248, width - 112)} stroke={8} progress={restProgress}>
          <Text style={styles.restLabel}>Rest</Text>
          <Text style={styles.restClock} accessibilityLabel={`Rest, ${formatClock(restLeft)} left`}>
            {formatClock(restLeft)}
          </Text>
          {lastItem && lastValue ? (
            <Text style={styles.restLogged}>Logged {unitLabel(lastItem, lastValue.reps)}</Text>
          ) : null}
        </ProgressRing>
        <View style={styles.restAdjust}>
          <Pressable
            style={styles.restButton}
            accessibilityLabel="Subtract 15 seconds"
            onPress={() =>
              setRestEndsAt((value) => Math.max(Date.now(), value - REST_EXTRA_SECONDS * 1000))
            }
          >
            <Text style={styles.restButtonLabel}>−15s</Text>
          </Pressable>
          <Pressable
            style={styles.restButton}
            accessibilityLabel="Add 15 seconds"
            onPress={() => setRestEndsAt((value) => value + REST_EXTRA_SECONDS * 1000)}
          >
            <Text style={styles.restButtonLabel}>+15s</Text>
          </Pressable>
        </View>
      </View>
      <Card style={styles.upNext}>
        <ExerciseThumb
          exerciseKey={exercise.key}
          name={exercise.name}
          size={56}
          onPress={openGuide}
        />
        <View style={styles.upNextCopy}>
          <Text style={styles.eyebrow}>Up next</Text>
          <Text style={styles.upNextName} numberOfLines={2}>
            {exercise.name}
          </Text>
          <Text style={styles.upNextSub}>
            {`${slotLabel(slot)} - ${weight} - ${unitLabel(exercise, target)}`}
          </Text>
        </View>
      </Card>
    </>
  )

  return (
    <View style={styles.container}>
      <TopBar
        title={routine.name}
        elapsed={formatClock((now - startedAt) / 1000)}
        onFinish={finish}
      />
      <View
        style={styles.progressArea}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`Exercise ${slot.index + 1} of ${routine.exercises.length}`}
        accessibilityValue={{ min: 0, max: slots.length, now: loggedCount }}
      >
        <ExerciseProgress fills={fills} current={slot.index} />
      </View>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scroll}>
        {phase === "rest" ? restView : setView}
      </ScrollView>
      <Footer>
        {phase === "rest" ? (
          <Button label="Skip rest" onPress={() => setPhase("set")} />
        ) : (
          <Button
            label="Done set"
            icon={<SymbolView name={glyphs.check} size={18} tintColor={C.onAccent} />}
            onPress={doneSet}
          />
        )}
      </Footer>
      {exitDialog}
    </View>
  )
}

/** Shape rule: icon buttons and chips are round, text buttons 16, cards 20. */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    gap: 14,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  topCenter: {
    flex: 1,
    alignItems: "center",
  },
  topTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: C.textMuted,
  },
  topClock: {
    fontSize: 17,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    color: C.text,
  },
  finish: {
    minWidth: 0,
    minHeight: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: C.accentTint,
  },
  finishLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.accent,
  },
  progressArea: {
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
  scrollArea: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  exerciseHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  exerciseCopy: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "500",
    color: C.textMuted,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "600",
    color: C.text,
  },
  setLine: {
    fontSize: 14,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    color: C.accent,
  },
  countCard: {
    padding: 16,
    gap: 12,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 28,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countNumber: {
    fontSize: 56,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    color: C.text,
    lineHeight: 64,
  },
  countOf: {
    fontSize: 13,
    fontVariant: ["tabular-nums"],
    color: C.textMuted,
  },
  captionRow: {
    minHeight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  countCaption: {
    fontSize: 13,
    lineHeight: 20,
    color: C.textMuted,
    textAlign: "center",
  },
  useWatch: {
    minWidth: 0,
    minHeight: 20,
    paddingHorizontal: 8,
  },
  useWatchLabel: {
    fontSize: 13,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    color: C.accent,
  },
  loadCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  loadCopy: {
    flex: 1,
    gap: 2,
  },
  loadHint: {
    fontSize: 12,
    color: C.textMuted,
  },
  loadValue: {
    minWidth: 72,
    fontSize: 22,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    color: C.text,
    textAlign: "center",
  },
  loadUnit: {
    fontSize: 13,
    fontWeight: "500",
    color: C.textMuted,
  },
  skip: {
    alignSelf: "center",
    minHeight: 44,
    paddingHorizontal: 12,
  },
  skipLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: C.textMuted,
  },
  restHero: {
    alignItems: "center",
    gap: 20,
    paddingTop: 12,
  },
  restLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: C.textMuted,
    textTransform: "uppercase",
  },
  restClock: {
    fontSize: 60,
    fontWeight: "300",
    fontVariant: ["tabular-nums"],
    color: C.text,
  },
  restLogged: {
    fontSize: 13,
    fontVariant: ["tabular-nums"],
    color: C.textMuted,
  },
  restAdjust: {
    flexDirection: "row",
    gap: 12,
  },
  restButton: {
    minWidth: 96,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: C.card,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  restButtonLabel: {
    fontSize: 15,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    color: C.text,
  },
  upNext: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
  },
  upNextCopy: {
    flex: 1,
    gap: 2,
  },
  upNextName: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
  },
  upNextSub: {
    fontSize: 13,
    fontVariant: ["tabular-nums"],
    color: C.textMuted,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
    backgroundColor: C.background,
  },
  celebrate: {
    alignItems: "center",
    gap: 6,
  },
  doneBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.accent,
  },
  celebrateTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: C.text,
  },
  celebrateSub: {
    fontSize: 14,
    color: C.textMuted,
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  stat: {
    flexGrow: 1,
    flexBasis: "40%",
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    borderCurve: "continuous",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 2,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
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
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    borderCurve: "continuous",
    paddingHorizontal: 14,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
  },
  summaryCopy: {
    flex: 1,
    gap: 2,
  },
  summaryName: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  summaryValue: {
    fontSize: 13,
    fontVariant: ["tabular-nums"],
    color: C.textMuted,
  },
  record: {
    fontSize: 13,
    fontWeight: "600",
    color: C.accent,
    textAlign: "center",
  },
  keep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.accentTint,
    borderRadius: 20,
    borderCurve: "continuous",
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
  error: {
    fontSize: 13,
    color: C.accent,
    textAlign: "center",
  },
})
