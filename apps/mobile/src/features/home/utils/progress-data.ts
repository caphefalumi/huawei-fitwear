export const RANGES = ["Week", "Month", "3 mo", "Year"] as const
export type Range = (typeof RANGES)[number]
export type RangeData = {
  /** Change from the first to the last log in the range, or null with fewer than two logs. */
  changeKg: number | null
  delta: string
  /** Logs in the range, oldest first. */
  logs: { loggedDate: string; weightKg: number }[]
}
export const RANGE_DAYS: Record<Range, number> = { Week: 7, Month: 30, "3 mo": 90, Year: 365 }

/** Subtitle under the page title for the range being viewed. */
export const RANGE_PERIODS: Record<Range, string> = {
  Week: "Last 7 days",
  Month: "Last 30 days",
  "3 mo": "Last 3 months",
  Year: "Last 12 months",
}

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
  now = new Date(),
): RangeData {
  const { from, to } = progressBounds(range, now)
  const selected = logs
    .filter((log) => log.loggedDate >= from && log.loggedDate <= to)
    .sort((a, b) => a.loggedDate.localeCompare(b.loggedDate))
  const change =
    selected.length > 1 ? selected[selected.length - 1].weightKg - selected[0].weightKg : null
  return {
    changeKg: change,
    delta: change === null ? "Not enough logs" : `${change > 0 ? "+" : ""}${change.toFixed(1)} kg`,
    logs: selected,
  }
}
