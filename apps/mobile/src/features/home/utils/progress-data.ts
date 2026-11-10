export const RANGES = ["Week", "Month", "3 mo", "Year"] as const
export type Range = (typeof RANGES)[number]
export type WorkoutStats = {
  completedSessionCount: number
  totalDurationSeconds: number
  byDate: { date: string; sessionCount: number }[]
}
export type RangeData = {
  delta: string
  weights: number[]
  dates: string[]
  bars: { label: string; sessions: number }[]
  sessionsNote: string
  duration: string
  durationNote: string
}
const RANGE_DAYS: Record<Range, number> = { Week: 7, Month: 30, "3 mo": 90, Year: 365 }

export function progressBounds(range: Range, now = new Date()) {
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  from.setDate(from.getDate() - RANGE_DAYS[range] + 1)
  const key = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  return { from: key(from), to: key(now) }
}

export function progressData(
  range: Range,
  logs: { loggedDate: string; weightKg: number }[],
  stats: WorkoutStats | null,
  now = new Date(),
): RangeData {
  const { from, to } = progressBounds(range, now)
  const selected = logs
    .filter((log) => log.loggedDate >= from && log.loggedDate <= to)
    .sort((a, b) => a.loggedDate.localeCompare(b.loggedDate))
  const change =
    selected.length > 1 ? selected[selected.length - 1].weightKg - selected[0].weightKg : null
  const count = range === "Week" ? 7 : range === "Month" ? 4 : range === "3 mo" ? 3 : 12
  const buckets = Array.from({ length: count }, (_, index) => {
    const date = new Date(`${from}T12:00:00`)
    date.setDate(date.getDate() + Math.ceil((index * RANGE_DAYS[range]) / count))
    return {
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      sessions: 0,
    }
  })
  for (const day of stats?.byDate ?? []) {
    if (day.date < from || day.date > to) continue
    const start = new Date(`${from}T12:00:00`)
    const current = new Date(`${day.date}T12:00:00`)
    const elapsed = Math.round((current.getTime() - start.getTime()) / 86_400_000)
    const index = Math.min(count - 1, Math.floor((elapsed * count) / RANGE_DAYS[range]))
    buckets[index].sessions += day.sessionCount
  }
  const minutes = Math.floor((stats?.totalDurationSeconds ?? 0) / 60)
  return {
    delta: change === null ? "Not enough logs" : `${change > 0 ? "+" : ""}${change.toFixed(1)} kg`,
    weights: selected.map((log) => log.weightKg),
    dates: selected.length
      ? [
          selected[0].loggedDate,
          ...(selected.length > 1 ? [selected[selected.length - 1].loggedDate] : []),
        ]
      : [],
    bars: buckets,
    sessionsNote: stats
      ? `${stats.completedSessionCount} completed sessions`
      : "Training data unavailable",
    duration: stats ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : "—",
    durationNote: `total duration · last ${RANGE_DAYS[range]} days`,
  }
}
