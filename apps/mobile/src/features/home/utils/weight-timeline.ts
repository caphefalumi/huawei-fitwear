const DAY_MS = 86_400_000

const time = (key: string) => Date.parse(`${key}T12:00:00`)
const short = (ms: number) =>
  new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" })

/**
 * Where each log sits along the chart (0 to 1, by its date, so gaps between logs show as distance)
 * and the dates for the time axis: first, middle and last. One date centres the point; the middle
 * date needs at least two days between the first and the last log.
 */
export function weightTimeline(dates: string[]) {
  const times = dates.map(time)
  const first = Math.min(...times)
  const last = Math.max(...times)
  const span = last - first
  return {
    positions: times.map((value) => (span > 0 ? (value - first) / span : 0.5)),
    axis: dates.length
      ? {
          first: short(first),
          middle: span >= 2 * DAY_MS ? short(first + span / 2) : null,
          last: span > 0 ? short(last) : null,
        }
      : null,
  }
}
