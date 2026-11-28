import type { WorkoutStats } from "@/features/workout/api/workout-api"

import { progressBounds, RANGE_DAYS, type Range } from "./progress-data"

export type ActivityBar = {
  key: string
  /** Under the bar: weekday, week start or month. */
  label: string
  /** Spoken and shown when the bar is picked: `Nov 17 - 23`. */
  period: string
  sessions: number
  seconds: number
  /** The bar that holds today. */
  current: boolean
}

export type TrainingActivity = {
  bars: ActivityBar[]
  totalSeconds: number
  /** Same length of time just before this range; null when stats do not reach that far. */
  previousSeconds: number | null
  sessions: number
  /** Planned training time for one bar (a week or a month); null for day bars. */
  planSeconds: number | null
  /** Calendar weeks that reached the planned sessions; the current week counts once it does. */
  weeksOnPlan: { met: number; total: number }
}

const STATS_DAYS = 365

const key = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
const parse = (value: string) => new Date(`${value}T12:00:00`)
const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(date.getDate() + days)
  return next
}
const monday = (date: Date) => addDays(date, -((date.getDay() + 6) % 7))
const monthDay = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

/** `Nov 17 - 23`, or `Oct 27 - Nov 2` across months. */
const weekPeriod = (start: Date) => {
  const end = addDays(start, 6)
  return `${monthDay(start)} - ${end.getMonth() === start.getMonth() ? end.getDate() : monthDay(end)}`
}

/** `45m`, `1h 05m`; `12h` for long totals where minutes do not matter. */
export function formatTraining(seconds: number, compact = false) {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (compact && hours >= 10) return `${Math.round(minutes / 60)}h`
  return `${hours}h ${String(minutes % 60).padStart(2, "0")}m`
}

/**
 * Training time for the range: days for a week, Monday-to-Sunday weeks for a month or three,
 * and months for a year. Days outside the range are left out of the first bar.
 */
export function trainingActivity(
  range: Range,
  stats: WorkoutStats | null,
  plan: { sessions: number; minutes: number },
  now = new Date(),
): TrainingActivity {
  const { from, to } = progressBounds(range, now)
  const today = key(now)
  const days = new Map((stats?.byDate ?? []).map((day) => [day.date, day]))
  const sum = (start: string, end: string) => {
    let sessions = 0
    let seconds = 0
    for (const day of days.values()) {
      if (day.date < start || day.date > end) continue
      sessions += day.sessionCount
      seconds += day.totalDurationSeconds
    }
    return { sessions, seconds }
  }

  const bars: ActivityBar[] = []
  if (range === "Week") {
    for (let date = parse(from); key(date) <= to; date = addDays(date, 1)) {
      const day = key(date)
      bars.push({
        key: day,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        period: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        ...sum(day, day),
        current: day === today,
      })
    }
  } else if (range === "Year") {
    const end = parse(to)
    for (let back = 11; back >= 0; back--) {
      const start = new Date(end.getFullYear(), end.getMonth() - back, 1, 12)
      const last = new Date(start.getFullYear(), start.getMonth() + 1, 0, 12)
      const startKey = key(start) < from ? from : key(start)
      bars.push({
        key: key(start),
        label: start.toLocaleDateString("en-US", { month: "narrow" }),
        period: start.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        ...sum(startKey, key(last)),
        current: back === 0,
      })
    }
  } else {
    for (let start = monday(parse(from)); key(start) <= to; start = addDays(start, 7)) {
      const startKey = key(start) < from ? from : key(start)
      bars.push({
        key: key(start),
        label: monthDay(start),
        period: weekPeriod(start),
        ...sum(startKey, key(addDays(start, 6))),
        current: key(start) <= today && today <= key(addDays(start, 6)),
      })
    }
  }

  const weeklyPlan = plan.sessions * plan.minutes * 60
  const planSeconds =
    range === "Week"
      ? null
      : range === "Year"
        ? Math.round((weeklyPlan * 365) / 12 / 7)
        : weeklyPlan

  const total = sum(from, to)
  const length = RANGE_DAYS[range]
  const previousEnd = addDays(parse(from), -1)
  const previousStart = addDays(parse(from), -length)
  const reach = addDays(now, -STATS_DAYS + 1)
  const previousSeconds =
    stats && key(previousStart) >= key(reach)
      ? sum(key(previousStart), key(previousEnd)).seconds
      : null

  let met = 0
  let weeks = 0
  for (let start = monday(parse(from)); key(start) <= to; start = addDays(start, 7)) {
    const reached = sum(key(start), key(addDays(start, 6))).sessions >= plan.sessions
    const current = key(start) <= today && today <= key(addDays(start, 6))
    if (current && !reached) continue
    weeks++
    if (reached) met++
  }

  return {
    bars,
    totalSeconds: total.seconds,
    previousSeconds,
    sessions: total.sessions,
    planSeconds,
    weeksOnPlan: { met, total: weeks },
  }
}
