type Log = { loggedDate: string; weightKg: number }

export type WeightGoal =
  | { status: "reached"; goalKg: number }
  | {
      status: "progress"
      goalKg: number
      /** Absolute kilograms left, one decimal. */
      leftKg: number
      /** Weight the progress is measured from: the first log. */
      startKg: number
      /** 0 to 1. */
      progress: number
      /** Linear trend over recent logs; only when it heads to the goal within a year. */
      eta: Date | null
      /** The recent trend moves away from the goal. */
      away: boolean
    }

const DAY_MS = 86_400_000
const TREND_DAYS = 28
const MIN_TREND_LOGS = 3
/** Slower than this (kg per day) is treated as flat. */
const FLAT_SLOPE = 0.005

const dayNumber = (key: string) => Date.parse(`${key}T12:00:00`) / DAY_MS

/** Least-squares slope in kilograms per day, or null without enough spread. */
function slope(logs: Log[]) {
  const xs = logs.map((log) => dayNumber(log.loggedDate))
  const meanX = xs.reduce((a, b) => a + b, 0) / xs.length
  const meanY = logs.reduce((a, log) => a + log.weightKg, 0) / logs.length
  let num = 0
  let den = 0
  logs.forEach((log, index) => {
    num += (xs[index]! - meanX) * (log.weightKg - meanY)
    den += (xs[index]! - meanX) ** 2
  })
  return den > 0 ? num / den : null
}

/**
 * Where the latest weight stands against the target weight. Progress counts from the first log,
 * which the screen names, since the date the goal was set is not stored.
 */
export function weightGoal(
  logs: Log[],
  currentKg: number | null,
  goalKg: number | null,
  now = new Date(),
): WeightGoal | null {
  if (goalKg === null || currentKg === null) return null
  const sorted = [...logs].sort((a, b) => a.loggedDate.localeCompare(b.loggedDate))
  const startKg = sorted[0]?.weightKg ?? currentKg
  const losing = startKg > goalKg
  const reached =
    Math.abs(currentKg - goalKg) < 0.05 ||
    (losing ? currentKg <= goalKg : startKg < goalKg && currentKg >= goalKg)
  if (reached) return { status: "reached", goalKg }

  const leftKg = Math.round(Math.abs(goalKg - currentKg) * 10) / 10
  const span = Math.abs(startKg - goalKg)
  const progress = span > 0 ? Math.min(1, Math.max(0, 1 - Math.abs(currentKg - goalKg) / span)) : 0

  const from = dayNumber(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
  )
  const recent = sorted.filter((log) => dayNumber(log.loggedDate) > from - TREND_DAYS)
  const perDay = recent.length >= MIN_TREND_LOGS ? slope(recent) : null
  const direction = Math.sign(goalKg - currentKg)
  let eta: Date | null = null
  let away = false
  if (perDay !== null && Math.abs(perDay) >= FLAT_SLOPE) {
    if (Math.sign(perDay) === direction) {
      const days = Math.ceil(Math.abs(goalKg - currentKg) / Math.abs(perDay))
      if (days <= 365) eta = new Date(now.getTime() + days * DAY_MS)
    } else away = true
  }
  return { status: "progress", goalKg, leftKg, startKg, progress, eta, away }
}

/** True when a weight change moves toward the goal, so the change can be shown as good news. */
export function towardGoal(changeKg: number, currentKg: number | null, goalKg: number | null) {
  if (goalKg === null || currentKg === null || changeKg === 0) return null
  return Math.sign(changeKg) === Math.sign(goalKg - (currentKg - changeKg))
}
