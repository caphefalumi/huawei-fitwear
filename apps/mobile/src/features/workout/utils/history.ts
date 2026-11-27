import { dateKey } from "@/features/health"

import type { StatsSession } from "../api/workout-api"
import type { WorkoutSession, WorkoutSet, WorkoutSummary } from "../hooks/workout-hooks"
import type { MuscleGroup } from "./catalog"
import type { ExerciseProgression } from "./progression"

/** Local midnight of the Monday that starts the week containing `date`. */
export function weekStart(date: Date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return monday
}

const addDays = (date: Date, days: number) => {
  const shifted = new Date(date)
  shifted.setDate(date.getDate() + days)
  return shifted
}

export const weekKey = (value: Date | string) => dateKey(weekStart(new Date(value)))

const monthDay = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

/** `This week`, `Last week`, then `Nov 10 - 16` or `Oct 27 - Nov 2`. */
export function weekTitle(start: Date, now: Date) {
  const current = weekStart(now).getTime()
  if (start.getTime() === current) return "This week"
  if (start.getTime() === addDays(new Date(current), -7).getTime()) return "Last week"
  const end = addDays(start, 6)
  const endLabel = end.getMonth() === start.getMonth() ? String(end.getDate()) : monthDay(end)
  const year = start.getFullYear() === now.getFullYear() ? "" : `, ${start.getFullYear()}`
  return `${monthDay(start)} - ${endLabel}${year}`
}

export function durationSeconds(session: { startedAt: string; completedAt: string | null }) {
  if (!session.completedAt) return null
  const seconds = (Date.parse(session.completedAt) - Date.parse(session.startedAt)) / 1000
  return Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : null
}

/** `52 min`, `1 h 05 min`. */
export function formatDuration(seconds: number) {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")} min`
}

export const formatVolume = (kg: number) => `${Math.round(kg).toLocaleString("en-US")} kg`

/** `6.2k` style for tight spaces. */
export const compactVolume = (kg: number) =>
  kg >= 1000 ? `${(kg / 1000).toFixed(kg >= 10_000 ? 0 : 1)}k` : String(Math.round(kg))

const formatLoad = (kg: number) => (Number.isInteger(kg) ? String(kg) : kg.toFixed(1))

const isWorking = (set: Pick<WorkoutSet, "isWarmup">) => !set.isWarmup

/** Same rules as the server: warm-ups are left out, reps and volume count rep-based sets only. */
export function summarizeSets(sets: WorkoutSet[]): WorkoutSummary {
  const groups = new Map<string, number>()
  let totalReps = 0
  let totalVolumeKg = 0
  const working = sets.filter(isWorking)
  for (const set of working) {
    const group = set.exercise?.muscleGroup ?? "Other"
    groups.set(group, (groups.get(group) ?? 0) + 1)
    if ((set.exercise?.repetitionUnit ?? "reps") === "reps") {
      totalReps += set.userConfirmedReps
      totalVolumeKg += set.weightKg * set.userConfirmedReps
    }
  }
  return {
    totalSets: working.length,
    totalReps,
    totalVolumeKg: Math.round(totalVolumeKg * 100) / 100,
    muscleGroups: [...groups]
      .map(([muscleGroup, count]) => ({ muscleGroup, sets: count }))
      .sort((a, b) => b.sets - a.sets || a.muscleGroup.localeCompare(b.muscleGroup)),
  }
}

/** Server totals when present, otherwise worked out from the sets a write returned. */
export function sessionSummary(session: WorkoutSession): WorkoutSummary | null {
  if (session.totalSets !== undefined)
    return {
      totalSets: session.totalSets,
      totalReps: session.totalReps ?? 0,
      totalVolumeKg: session.totalVolumeKg ?? 0,
      muscleGroups: session.muscleGroups ?? [],
    }
  return session.sets ? summarizeSets(session.sets) : null
}

/** `52 min - 18 sets - 6,240 kg`; parts without data are left out. */
export function summaryLine(session: WorkoutSession) {
  if (!session.completedAt) return "In progress"
  const summary = sessionSummary(session)
  const seconds = durationSeconds(session)
  const parts = [
    seconds !== null ? formatDuration(seconds) : null,
    summary ? `${summary.totalSets} ${summary.totalSets === 1 ? "set" : "sets"}` : null,
    summary?.totalVolumeKg ? formatVolume(summary.totalVolumeKg) : null,
  ].filter(Boolean)
  return parts.join(" - ")
}

export type WeekSection<T> = { key: string; start: Date; title: string; data: T[] }

/** Sessions (newest first) grouped into Monday-to-Sunday weeks. */
export function weekSections<T extends { startedAt: string }>(sessions: T[], now: Date) {
  const sections: WeekSection<T>[] = []
  for (const session of sessions) {
    const start = weekStart(new Date(session.startedAt))
    const key = dateKey(start)
    let section = sections.find((entry) => entry.key === key)
    if (!section) {
      section = { key, start, title: weekTitle(start, now), data: [] }
      sections.push(section)
    }
    section.data.push(session)
  }
  return sections
}

export type WeekTotals = { sessions: number; volumeKg: number }

/** Completed sessions and working volume per week key. */
export function totalsByWeek(
  sessions: (Pick<WorkoutSession, "startedAt" | "completedAt"> & Partial<WorkoutSummary>)[],
) {
  const totals = new Map<string, WeekTotals>()
  for (const session of sessions) {
    if (!session.completedAt) continue
    const key = weekKey(session.startedAt)
    const entry = totals.get(key) ?? { sessions: 0, volumeKg: 0 }
    entry.sessions++
    entry.volumeKg += session.totalVolumeKg ?? 0
    totals.set(key, entry)
  }
  return totals
}

export function weekTotalsLine({ sessions, volumeKg }: WeekTotals) {
  const count = `${sessions} ${sessions === 1 ? "session" : "sessions"}`
  return volumeKg ? `${count} - ${formatVolume(volumeKg)}` : count
}

/** Working volume for each of the last `weeks` weeks, oldest first, ending with this week. */
export function weeklyVolume(sessions: StatsSession[], now: Date, weeks = 8) {
  const totals = totalsByWeek(sessions)
  const current = weekStart(now)
  return Array.from({ length: weeks }, (_, index) => {
    const start = addDays(current, (index - weeks + 1) * 7)
    return { start, volumeKg: totals.get(dateKey(start))?.volumeKg ?? 0 }
  })
}

/** Which days Monday to Sunday of this week have a completed session. */
export function trainedDays(sessions: StatsSession[], now: Date) {
  const key = dateKey(weekStart(now))
  const days = Array.from({ length: 7 }, () => false)
  for (const session of sessions)
    if (weekKey(session.startedAt) === key)
      days[(new Date(session.startedAt).getDay() + 6) % 7] = true
  return days
}

/**
 * Weeks in a row that reached `target` sessions. This week counts once it reaches the target;
 * until then the streak runs up to last week, so an unfinished week never breaks it.
 */
export function weekStreak(sessions: StatsSession[], now: Date, target: number) {
  if (target < 1) return 0
  const totals = totalsByWeek(sessions)
  const met = (start: Date) => (totals.get(dateKey(start))?.sessions ?? 0) >= target
  let start = weekStart(now)
  let streak = met(start) ? 1 : 0
  start = addDays(start, -7)
  while (met(start)) {
    streak++
    start = addDays(start, -7)
  }
  return streak
}

/** Working sets per muscle group this week, in the given display order. */
export function setsByMuscleGroup(
  sessions: StatsSession[],
  now: Date,
  groups: readonly MuscleGroup[],
) {
  const key = dateKey(weekStart(now))
  const counts = new Map<string, number>()
  for (const session of sessions) {
    if (weekKey(session.startedAt) !== key) continue
    for (const { muscleGroup, sets } of session.muscleGroups)
      counts.set(muscleGroup, (counts.get(muscleGroup) ?? 0) + sets)
  }
  return groups.map((group) => ({ group, sets: counts.get(group) ?? 0 }))
}

export type ExerciseBlock = { exerciseId: string; name: string; unit: string; sets: WorkoutSet[] }

/** Sets grouped by exercise, in the order each exercise was first done. */
export function exerciseBlocks(sets: WorkoutSet[]): ExerciseBlock[] {
  const blocks: ExerciseBlock[] = []
  for (const set of [...sets].sort((a, b) => a.setIndex - b.setIndex)) {
    let block = blocks.find((entry) => entry.exerciseId === set.exerciseId)
    if (!block) {
      block = {
        exerciseId: set.exerciseId,
        name: set.exercise?.name ?? "Exercise",
        unit: set.exercise?.repetitionUnit ?? "reps",
        sets: [],
      }
      blocks.push(block)
    }
    block.sets.push(set)
  }
  return blocks
}

type SetLike = { weightKg: number; userConfirmedReps: number }

/** Heaviest working set that had reps; ties go to more reps. */
export function topSet(sets: SetLike[]) {
  let best: SetLike | null = null
  for (const set of sets) {
    if (set.userConfirmedReps <= 0) continue
    if (
      !best ||
      set.weightKg > best.weightKg ||
      (set.weightKg === best.weightKg && set.userConfirmedReps > best.userConfirmedReps)
    )
      best = set
  }
  return best
}

export type Comparison = { tone: "up" | "flat"; label: string }

/**
 * How this exercise's top set compares with the last time it was done. Weight decides when
 * either top set has load; otherwise reps (or seconds) decide.
 */
export function compareWithPrevious(
  block: ExerciseBlock,
  previous: ExerciseProgression | undefined,
): Comparison {
  if (!previous) return { tone: "flat", label: "First time" }
  const when = previous.completedAt
    ? new Date(previous.completedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "last time"
  const now = topSet(block.sets.filter(isWorking))
  const before = topSet(previous.sets)
  if (!now || !before) return { tone: "flat", label: `Last done ${when}` }
  const unit = block.unit === "seconds" ? "s" : block.unit === "minutes" ? " min" : " reps"
  const [delta, suffix] =
    now.weightKg > 0 || before.weightKg > 0
      ? [Math.round((now.weightKg - before.weightKg) * 100) / 100, " kg"]
      : [now.userConfirmedReps - before.userConfirmedReps, unit]
  if (delta === 0) return { tone: "flat", label: `Same as ${when}` }
  const amount = suffix === " kg" ? formatLoad(Math.abs(delta)) : String(Math.abs(delta))
  return {
    tone: delta > 0 ? "up" : "flat",
    label: `${delta > 0 ? "+" : "-"}${amount}${suffix} vs ${when}`,
  }
}

/**
 * One line for a collapsed exercise: working sets, then volume, or total reps / time when there
 * is no load. `3 sets - 1,020 kg`, `3 sets - 36 reps`, `2 sets - 105 s`, `+ 1 warm-up`.
 */
export function blockLine(block: ExerciseBlock) {
  const working = block.sets.filter(isWorking)
  const warmups = block.sets.length - working.length
  const count = working.reduce((sum, set) => sum + set.userConfirmedReps, 0)
  const volume = working.reduce((sum, set) => sum + set.weightKg * set.userConfirmedReps, 0)
  const amount =
    block.unit === "reps"
      ? volume > 0
        ? formatVolume(volume)
        : `${count} reps`
      : `${count} ${block.unit === "seconds" ? "s" : "min"}`
  const sets = `${working.length} ${working.length === 1 ? "set" : "sets"}`
  const warm = warmups ? ` + ${warmups} warm-up${warmups === 1 ? "" : "s"}` : ""
  return working.length
    ? `${sets} - ${amount}${warm}`
    : `${warmups} warm-up${warmups === 1 ? "" : "s"}`
}

export type TargetResult = { mark: string; met: boolean; spoken: string }

/**
 * Confirmed reps (or seconds) against the set's target: `✓` on target, `+2` over, `-1` under.
 * Warm-ups and sets without a target have none.
 */
export function targetResult(
  set: Pick<WorkoutSet, "isWarmup" | "targetReps" | "userConfirmedReps">,
): TargetResult | null {
  if (set.isWarmup || !(set.targetReps > 0)) return null
  const diff = set.userConfirmedReps - set.targetReps
  if (diff === 0) return { mark: "✓", met: true, spoken: `goal of ${set.targetReps} met` }
  return diff > 0
    ? { mark: `+${diff}`, met: true, spoken: `${diff} above goal of ${set.targetReps}` }
    : { mark: `-${-diff}`, met: false, spoken: `${-diff} short of goal of ${set.targetReps}` }
}
