import { progressBounds, progressData } from "@/features/home"
import { formatTraining, trainingActivity } from "@/features/home/utils/training-activity"
import { towardGoal, weightGoal } from "@/features/home/utils/weight-goal"
import { weightTimeline } from "@/features/home/utils/weight-timeline"

// Saturday, Jan 3 2026.
const now = new Date(2026, 0, 3, 9)
const plan = { sessions: 3, minutes: 45 }

test("uses inclusive local calendar bounds across a year boundary", () => {
  expect(progressBounds("Week", now)).toEqual({ from: "2025-12-28", to: "2026-01-03" })
})

test("filters and sorts persisted weights without inventing intermediate measurements", () => {
  const logs = [
    { loggedDate: "2026-01-03", weightKg: 71 },
    { loggedDate: "2025-12-27", weightKg: 80 },
    { loggedDate: "2025-12-28", weightKg: 72.5 },
    { loggedDate: "2026-01-04", weightKg: 70 },
  ]
  const result = progressData("Week", logs, now)
  expect(result.logs).toEqual([
    { loggedDate: "2025-12-28", weightKg: 72.5 },
    { loggedDate: "2026-01-03", weightKg: 71 },
  ])
  expect(result.delta).toBe("-1.5 kg")
  expect(result.changeKg).toBe(-1.5)
  expect(logs[0].loggedDate).toBe("2026-01-03")
})

test("does not turn a single weight into fake progress", () => {
  const result = progressData("Week", [{ loggedDate: "2026-01-03", weightKg: 71 }], now)
  expect(result.delta).toBe("Not enough logs")
  expect(result.changeKg).toBeNull()
  expect(progressData("Week", [], now).logs).toEqual([])
})

test("formats training time for bars and totals", () => {
  expect(formatTraining(2700)).toBe("45m")
  expect(formatTraining(3900)).toBe("1h 05m")
  expect(formatTraining(43_200)).toBe("12h 00m")
  expect(formatTraining(43_200, true)).toBe("12h")
})

test("a week shows one bar per day and leaves days outside the range out", () => {
  const result = trainingActivity(
    "Week",
    {
      byDate: [
        { date: "2025-12-28", sessionCount: 1, totalDurationSeconds: 1800 },
        { date: "2026-01-03", sessionCount: 2, totalDurationSeconds: 1890 },
        { date: "2025-12-27", sessionCount: 99, totalDurationSeconds: 5000 },
      ],
    },
    plan,
    now,
  )
  expect(result.bars.map((bar) => bar.seconds)).toEqual([1800, 0, 0, 0, 0, 0, 1890])
  expect(result.bars.map((bar) => bar.current)).toEqual([
    false,
    false,
    false,
    false,
    false,
    false,
    true,
  ])
  expect(result.totalSeconds).toBe(3690)
  expect(result.sessions).toBe(3)
  expect(result.planSeconds).toBeNull()
  expect(result.previousSeconds).toBe(5000)
})

test("a month groups calendar weeks, compares with the 30 days before and counts weeks on plan", () => {
  const result = trainingActivity(
    "Month",
    {
      byDate: [
        { date: "2025-11-20", sessionCount: 1, totalDurationSeconds: 600 },
        { date: "2025-12-04", sessionCount: 1, totalDurationSeconds: 900 },
        { date: "2025-12-05", sessionCount: 1, totalDurationSeconds: 3600 },
        { date: "2025-12-13", sessionCount: 1, totalDurationSeconds: 3000 },
        { date: "2025-12-20", sessionCount: 1, totalDurationSeconds: 2400 },
        { date: "2026-01-03", sessionCount: 1, totalDurationSeconds: 1800 },
      ],
    },
    { sessions: 1, minutes: 45 },
    now,
  )
  expect(result.bars.map((bar) => bar.label)).toEqual([
    "Dec 1",
    "Dec 8",
    "Dec 15",
    "Dec 22",
    "Dec 29",
  ])
  // Dec 4 is before the range, so the first week only counts Dec 5.
  expect(result.bars.map((bar) => bar.seconds)).toEqual([3600, 3000, 2400, 0, 1800])
  expect(result.bars.at(-1)!.current).toBe(true)
  expect(result.bars[0]!.period).toBe("Dec 1 - 7")
  expect(result.bars.at(-1)!.period).toBe("Dec 29 - Jan 4")
  expect(result.planSeconds).toBe(2700)
  expect(result.previousSeconds).toBe(1500)
  expect(result.weeksOnPlan).toEqual({ met: 4, total: 5 })
})

test("a year shows twelve months and has no earlier year to compare with", () => {
  const result = trainingActivity("Year", { byDate: [] }, plan, now)
  expect(result.bars).toHaveLength(12)
  expect(result.bars.at(-1)!.current).toBe(true)
  expect(result.bars.at(-1)!.period).toBe("January 2026")
  expect(result.previousSeconds).toBeNull()
  expect(result.planSeconds).toBe(35_196)
})

test("the current week only counts toward weeks on plan once it reaches the plan", () => {
  const result = trainingActivity("Week", { byDate: [] }, plan, now)
  expect(result.weeksOnPlan).toEqual({ met: 0, total: 1 })
  expect(trainingActivity("Week", null, plan, now).previousSeconds).toBeNull()
})

describe("weight goal", () => {
  const logs = [
    { loggedDate: "2025-12-01", weightKg: 75 },
    { loggedDate: "2025-12-20", weightKg: 73 },
    { loggedDate: "2025-12-27", weightKg: 72.5 },
    { loggedDate: "2026-01-02", weightKg: 72 },
  ]

  test("measures progress from the first log and estimates when the trend gets there", () => {
    const goal = weightGoal(logs, 72, 70, now)
    expect(goal).toMatchObject({
      status: "progress",
      goalKg: 70,
      leftKg: 2,
      startKg: 75,
      away: false,
    })
    if (goal?.status !== "progress") throw new Error("expected progress")
    expect(goal.progress).toBeCloseTo(0.6)
    const days = (goal.eta!.getTime() - now.getTime()) / 86_400_000
    expect(days).toBeGreaterThan(20)
    expect(days).toBeLessThan(32)
  })

  test("says when the trend moves away and gives no date", () => {
    const rising = logs.map((log, index) => ({ ...log, weightKg: 70 + index }))
    const goal = weightGoal(rising, 73, 68, now)
    expect(goal).toMatchObject({ status: "progress", away: true, eta: null })
  })

  test("needs three recent logs for a trend, and reports a reached target", () => {
    expect(weightGoal(logs.slice(0, 2), 73, 70, now)).toMatchObject({ eta: null, away: false })
    expect(weightGoal(logs, 69.8, 70, now)).toEqual({ status: "reached", goalKg: 70 })
    expect(weightGoal(logs, 72, null, now)).toBeNull()
  })

  test("a change counts as good news only when it heads to the goal", () => {
    expect(towardGoal(-1, 72, 70)).toBe(true)
    expect(towardGoal(1, 72, 70)).toBe(false)
    expect(towardGoal(1, 72, null)).toBeNull()
  })
})

describe("weight chart timeline", () => {
  test("places logs by date, so a long gap shows as distance", () => {
    const { positions, axis } = weightTimeline(["2025-11-01", "2025-11-02", "2025-11-11"])
    expect(positions).toEqual([0, 0.1, 1])
    expect(axis).toEqual({ first: "Nov 1", middle: "Nov 6", last: "Nov 11" })
  })

  test("leaves out the middle date when logs are a day apart, and centres a single log", () => {
    expect(weightTimeline(["2025-11-01", "2025-11-02"]).axis).toEqual({
      first: "Nov 1",
      middle: null,
      last: "Nov 2",
    })
    expect(weightTimeline(["2025-11-01"])).toEqual({
      positions: [0.5],
      axis: { first: "Nov 1", middle: null, last: null },
    })
    expect(weightTimeline([]).axis).toBeNull()
  })
})
