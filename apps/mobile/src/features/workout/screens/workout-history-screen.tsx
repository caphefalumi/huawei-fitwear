import { useQuery } from "@tanstack/react-query"
import { Image } from "expo-image"
import { router, useFocusEffect, useLocalSearchParams, type Href } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { ActivityIndicator, SectionList, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BackHeader, Button, PageHeading, Screen, SectionHeading } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/features/auth"
import { Palette as C } from "@/theme"

import { fetchPreviousProgression } from "../api/workout-api"
import { WorkoutHistoryCard } from "../components/workout-history-card"
import { WorkoutOverview } from "../components/workout-overview"
import {
  useWorkoutProgress,
  useWorkouts,
  workoutQueryKeys,
  type SessionWithSets,
  type WorkoutSet,
} from "../hooks/workout-hooks"
import { usePlanInput } from "../store/plan-preferences.store"
import { readSessionDraft, type SessionDraft } from "../store/session-draft.store"
import {
  blockLine,
  targetResult,
  compareWithPrevious,
  durationSeconds,
  exerciseBlocks,
  formatDuration,
  summarizeSets,
  totalsByWeek,
  weekSections,
  weekStart,
  weekTotalsLine,
  type ExerciseBlock,
} from "../utils/history"
import type { ExerciseProgression } from "../utils/progression"
import { routineOn } from "../utils/routines"

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
}

const CHEVRON = require("@/assets/images/profile/chevron-right.svg")

const formatKg = (kg: number) => (Number.isInteger(kg) ? String(kg) : String(+kg.toFixed(2)))

/** A workout left unfinished on this device, read again whenever the screen is shown. */
function useSessionDraft() {
  const userId = useAuth().user?.id
  const [draft, setDraft] = useState<SessionDraft | null>(null)
  useFocusEffect(
    useCallback(() => {
      if (!userId) return undefined
      let active = true
      void readSessionDraft(userId).then((value) => {
        if (active) setDraft(value)
      })
      return () => {
        active = false
      }
    }, [userId]),
  )
  return draft
}

function ResumeBanner({ draft }: { draft: SessionDraft }) {
  const logged = draft.logged.flat().filter(Boolean).length
  return (
    <View style={styles.resume}>
      <Text style={styles.resumeTitle}>Workout in progress</Text>
      <Text style={styles.message}>
        {`${draft.routineName} - ${logged} ${logged === 1 ? "set" : "sets"} logged`}
      </Text>
      <Button
        label="Resume workout"
        onPress={() => router.push(`/session?date=${draft.date}` as Href)}
      />
    </View>
  )
}

export function WorkoutHistoryScreen() {
  const { sessions, loading, historyMessage, error, refreshing, refresh, hasMore, loadMore } =
    useWorkouts()
  const stats = useWorkoutProgress()
  const input = usePlanInput()
  const draft = useSessionDraft()
  const insets = useSafeAreaInsets()
  const [loadingMore, setLoadingMore] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const pendingPage = useRef(false)
  const now = new Date()

  const nextPage = async () => {
    if (pendingPage.current || !hasMore) return
    pendingPage.current = true
    setLoadingMore(true)
    setPageError(null)
    try {
      await loadMore()
    } catch {
      setPageError("Could not load more workouts. Please try again.")
    } finally {
      pendingPage.current = false
      setLoadingMore(false)
    }
  }

  const retry = async () => {
    try {
      await Promise.all([refresh(), stats.refetch()])
    } catch {
      /* The workout provider exposes the error. */
    }
  }

  const statsSessions = stats.data?.sessions
  // Week totals come from the full stats range when available; loaded pages may cut a week short.
  const totals = totalsByWeek(statsSessions ?? sessions)
  const sections = weekSections(sessions, now)
  const monday = weekStart(now)
  const plannedDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return routineOn(date, input).exercises.length > 0
  })
  const showOverview = Boolean(statsSessions?.length)

  return (
    <SectionList
      testID="workout-history-list"
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 26 },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      sections={sections}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled
      ListHeaderComponent={
        <View style={styles.header}>
          <BackHeader label="Workout plan" onPress={() => router.back()} />
          <PageHeading title="Workout history" subtitle="Your saved workouts and sets." />
          {sessions.length > 0 && error ? (
            <>
              <Text style={styles.message} selectable>
                {error}
              </Text>
              <Button label="Retry" variant="secondary" onPress={() => void retry()} />
            </>
          ) : null}
          {draft ? <ResumeBanner draft={draft} /> : null}
          {showOverview && statsSessions ? (
            <WorkoutOverview
              sessions={statsSessions}
              now={now}
              target={Math.max(1, input.sessions ?? 3)}
              plannedDays={plannedDays}
            />
          ) : sessions.length > 0 && stats.isError ? (
            <Text style={styles.message}>Could not load your training summary.</Text>
          ) : null}
        </View>
      }
      renderSectionHeader={({ section }) => {
        const week = totals.get(section.key)
        return (
          <View style={styles.sectionHeader}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              {section.title}
            </Text>
            {week ? <Text style={styles.sectionMeta}>{weekTotalsLine(week)}</Text> : null}
          </View>
        )
      }}
      renderItem={({ item }) => (
        <WorkoutHistoryCard
          session={item}
          onPress={() => router.push(`/workout-history/${encodeURIComponent(item.id)}` as Href)}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      SectionSeparatorComponent={() => <View style={styles.sectionGap} />}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator accessibilityLabel="Loading workout history" color={C.accent} />
        ) : historyMessage || error ? (
          <View style={styles.card}>
            <Text style={styles.message} selectable>
              {historyMessage || error}
            </Text>
            <Button label="Retry" variant="secondary" onPress={() => void retry()} />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>No workouts yet</Text>
            <Text style={styles.message}>Your saved workouts will appear here.</Text>
          </View>
        )
      }
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (sessions.length > 0 && !pageError) void nextPage()
      }}
      ListFooterComponent={
        sessions.length > 0 && hasMore ? (
          <View style={styles.footer}>
            {pageError ? (
              <>
                <Text style={styles.message} selectable>
                  {pageError}
                </Text>
                <Button
                  label="Retry loading more"
                  variant="secondary"
                  busy={loadingMore}
                  onPress={() => void nextPage()}
                />
              </>
            ) : (
              <ActivityIndicator accessibilityLabel="Loading more workouts" color={C.accent} />
            )}
          </View>
        ) : undefined
      }
      refreshing={refreshing && !loadingMore}
      onRefresh={() => void retry()}
    />
  )
}

function SummaryStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function SetRow({ set, label, unit }: { set: WorkoutSet; label: string; unit: string }) {
  const watch =
    set.detectedReps != null && set.detectedReps !== set.userConfirmedReps
      ? `Watch counted ${set.detectedReps}`
      : null
  const amount = unit === "reps" ? "reps" : unit === "seconds" ? "seconds" : "minutes"
  const target = targetResult(set)
  return (
    <View
      style={styles.setRow}
      accessible
      accessibilityLabel={[
        set.isWarmup ? "Warm-up set" : `Set ${label}`,
        set.weightKg ? `${formatKg(set.weightKg)} kg` : "body weight",
        `${set.userConfirmedReps} ${amount}`,
        target?.spoken,
        watch,
      ]
        .filter(Boolean)
        .join(", ")}
    >
      <Text style={[styles.setIndex, set.isWarmup && styles.setWarmup]}>{label}</Text>
      <Text style={styles.setCell}>{set.weightKg ? formatKg(set.weightKg) : "-"}</Text>
      <Text style={styles.setCell}>{set.userConfirmedReps}</Text>
      <View style={styles.setGoal}>
        {target ? (
          <Text style={[styles.targetMark, !target.met && styles.targetMissed]}>{target.mark}</Text>
        ) : null}
        {watch ? (
          <Text style={styles.setNote} numberOfLines={1}>
            {watch}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

function ExerciseCard({
  block,
  previous,
  compared,
  expanded,
  onToggle,
}: {
  block: ExerciseBlock
  previous: ExerciseProgression | undefined
  compared: boolean
  expanded: boolean
  onToggle: () => void
}) {
  const comparison = compared ? compareWithPrevious(block, previous) : null
  const line = blockLine(block)
  let working = 0
  const unitLabel = block.unit === "reps" ? "Reps" : block.unit === "seconds" ? "Sec" : "Min"
  return (
    <View style={styles.card}>
      <Pressable
        style={styles.exerciseHead}
        accessibilityState={{ expanded }}
        accessibilityLabel={[block.name, line, comparison?.label].filter(Boolean).join(", ")}
        accessibilityHint={expanded ? "Hides the sets" : "Shows each set"}
        onPress={onToggle}
      >
        <View style={styles.exerciseText}>
          <Text style={styles.title}>{block.name}</Text>
          <Text style={styles.exerciseLine}>{line}</Text>
        </View>
        {comparison ? (
          <Text style={[styles.delta, comparison.tone === "up" && styles.deltaUp]}>
            {comparison.label}
          </Text>
        ) : null}
        <Image
          source={CHEVRON}
          style={[styles.chevron, expanded && styles.chevronOpen]}
          tintColor={C.textMuted}
          accessible={false}
        />
      </Pressable>
      {expanded ? (
        <>
          <View style={styles.setHeader} importantForAccessibility="no-hide-descendants">
            <Text style={[styles.setIndex, styles.setHead]}>Set</Text>
            <Text style={[styles.setCell, styles.setHead]}>kg</Text>
            <Text style={[styles.setCell, styles.setHead]}>{unitLabel}</Text>
            <Text style={[styles.setCell, styles.setHead]}>Goal</Text>
          </View>
          {block.sets.map((set) => (
            <SetRow
              key={set.id}
              set={set}
              unit={block.unit}
              label={set.isWarmup ? "W" : String(++working)}
            />
          ))}
        </>
      ) : null}
    </View>
  )
}

export function WorkoutHistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const { loadSession } = useWorkouts()
  const { user } = useAuth()
  const loadSessionRef = useRef(loadSession)
  loadSessionRef.current = loadSession
  const [session, setSession] = useState<SessionWithSets | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  useEffect(() => {
    let active = true
    setSession(null)
    setError(null)
    setLoading(true)
    if (!id) {
      setError("This workout could not be found.")
      setLoading(false)
    } else {
      void loadSessionRef
        .current(id)
        .then(
          (result) => {
            if (active) setSession(result)
          },
          () => {
            if (active) setError("Could not load this workout. Please try again.")
          },
        )
        .finally(() => {
          if (active) setLoading(false)
        })
    }
    return () => {
      active = false
    }
  }, [id, attempt])

  // What each exercise looked like the last time before this workout.
  const previous = useQuery({
    queryKey: [
      ...workoutQueryKeys.all(user?.id ?? "signed-out"),
      "progression",
      "before",
      session?.id ?? "",
    ],
    enabled: Boolean(user?.id && session?.sets.length),
    queryFn: ({ signal }) => fetchPreviousProgression(session!, signal),
  })

  return (
    <Screen contentStyle={styles.detailContent}>
      <BackHeader label="Workout history" onPress={() => router.back()} />
      <PageHeading
        title={session?.sessionTitle ?? "Workout details"}
        subtitle={session ? formatDate(session.startedAt) : undefined}
      />
      {loading ? (
        <ActivityIndicator accessibilityLabel="Loading workout details" color={C.accent} />
      ) : null}
      {!loading && error ? (
        <View style={styles.card}>
          <Text style={styles.message} selectable>
            {error}
          </Text>
          {id ? <Button label="Retry" variant="secondary" onPress={retry} /> : null}
        </View>
      ) : null}
      {!loading && session ? <SessionDetail session={session} previous={previous} /> : null}
    </Screen>
  )
}

function SessionDetail({
  session,
  previous,
}: {
  session: SessionWithSets
  previous: { data?: { exercises: ExerciseProgression[] }; isSuccess: boolean }
}) {
  const summary = summarizeSets(session.sets)
  const seconds = durationSeconds(session)
  const blocks = exerciseBlocks(session.sets)
  const byExercise = new Map(
    (previous.data?.exercises ?? []).map((entry) => [entry.exerciseId, entry]),
  )
  // Exercises start collapsed: the summary line answers most questions, sets are one tap away.
  const [open, setOpen] = useState<Set<string>>(() => new Set())
  const allOpen = blocks.length > 0 && blocks.every(({ exerciseId }) => open.has(exerciseId))
  return (
    <>
      <View style={styles.stats}>
        <SummaryStat
          value={seconds !== null ? formatDuration(seconds) : "-"}
          label={seconds !== null ? "Time" : "In progress"}
        />
        <SummaryStat value={String(summary?.totalSets ?? 0)} label="Sets" />
        <SummaryStat
          value={
            summary?.totalVolumeKg ? Math.round(summary.totalVolumeKg).toLocaleString("en-US") : "-"
          }
          label="Volume kg"
        />
        {session.avgHeartRateBpm ? (
          <SummaryStat value={String(session.avgHeartRateBpm)} label="Avg HR" />
        ) : null}
      </View>
      {blocks.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.message}>No sets saved for this workout.</Text>
        </View>
      ) : (
        <>
          <SectionHeading
            title={`${blocks.length} ${blocks.length === 1 ? "exercise" : "exercises"}`}
            actionLabel={allOpen ? "Collapse all" : "Expand all"}
            onPress={() =>
              setOpen(allOpen ? new Set() : new Set(blocks.map(({ exerciseId }) => exerciseId)))
            }
          />
          {blocks.map((block) => (
            <ExerciseCard
              key={block.exerciseId}
              block={block}
              previous={byExercise.get(block.exerciseId)}
              compared={previous.isSuccess}
              expanded={open.has(block.exerciseId)}
              onToggle={() =>
                setOpen((current) => {
                  const next = new Set(current)
                  if (!next.delete(block.exerciseId)) next.add(block.exerciseId)
                  return next
                })
              }
            />
          ))}
        </>
      )}
      {blocks.length ? (
        <Text style={styles.footnote}>Volume counts working sets only. W marks a warm-up set.</Text>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: 24 },
  detailContent: { gap: 12 },
  header: { gap: 18, paddingBottom: 18 },
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  title: { color: C.text, fontSize: 16, fontWeight: "600", flexShrink: 1 },
  message: { color: C.textMuted, fontSize: 14, lineHeight: 20 },
  footer: { gap: 8, paddingTop: 14 },
  separator: { height: 10 },
  sectionGap: { height: 4 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 8,
    backgroundColor: C.background,
    paddingVertical: 8,
  },
  sectionTitle: { color: C.text, fontSize: 13, fontWeight: "600" },
  sectionMeta: { color: C.textMuted, fontSize: 12 },
  resume: {
    backgroundColor: C.accentTint,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  resumeTitle: { color: C.accent, fontSize: 14, fontWeight: "600" },
  stats: { flexDirection: "row", gap: 8 },
  stat: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    gap: 2,
  },
  statValue: { color: C.text, fontSize: 16, fontWeight: "600" },
  statLabel: { color: C.textMuted, fontSize: 11 },
  exerciseHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  exerciseText: { flex: 1, gap: 2 },
  exerciseLine: { color: C.textMuted, fontSize: 12 },
  chevron: { width: 16, height: 16 },
  chevronOpen: { transform: [{ rotate: "90deg" }] },
  delta: { color: C.textMuted, fontSize: 12 },
  deltaUp: { color: C.accent, fontWeight: "600" },
  // Set label on the left, then three equal numeric columns aligned right so digits line up.
  setHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    paddingBottom: 6,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 44,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  setIndex: { width: 32, color: C.text, fontSize: 14, fontWeight: "600" },
  setWarmup: { color: C.textMuted, fontWeight: "400" },
  setCell: {
    flex: 1,
    textAlign: "right",
    color: C.text,
    fontSize: 15,
    fontVariant: ["tabular-nums"],
  },
  setHead: { color: C.textMuted, fontSize: 12, fontWeight: "500" },
  setGoal: { flex: 1, alignItems: "flex-end" },
  targetMark: { color: C.accent, fontSize: 15, fontWeight: "600", fontVariant: ["tabular-nums"] },
  targetMissed: { color: C.textMuted, fontWeight: "400" },
  setNote: { color: C.textMuted, fontSize: 11 },
  footnote: { color: C.textMuted, fontSize: 11, textAlign: "center" },
})
