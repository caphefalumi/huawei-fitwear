import { createInjury, PERIOD_AREA, UNWELL_AREA, type Injury } from "@/features/recovery"
import { CATALOG, REST_DAY, routineOn, routinesFor, type PlanInput } from "@/features/workout"

// 2026-11-09 is a Monday.
const monday = new Date(2026, 10, 9, 9)
const day = (offset: number) => new Date(2026, 10, 9 + offset, 9)
const base: PlanInput = {
  sessions: 3,
  minutes: 90,
  goal: "Maintain",
  injuries: [],
  likes: [],
  dislikes: [],
}
const names = (input: PlanInput, offsets: number[]) =>
  offsets.map((offset) => routineOn(day(offset), input).name)
/** The weekday this week that runs Full Body A. */
const fullBodyA = [0, 2, 4].find((offset) => routineOn(day(offset), base).name === "Full Body A")!
const keys = (input: PlanInput, date = day(fullBodyA)) =>
  routineOn(date, input).exercises.map((e) => e.key)
const find = (key: string) => CATALOG.find((exercise) => exercise.key === key)!
const injury = (patch: Partial<Injury>): Injury => ({
  ...createInjury("Knee", "Mild", "2026-11-09"),
  ...patch,
})
const excluded = { excludeDays: 7, lightDays: 0 }

test("alternates Full Body A and B on Monday, Wednesday and Friday, week to week", () => {
  const week = names(base, [0, 1, 2, 3, 4, 5, 6])
  expect(week.filter((name) => name !== "Rest day")).toHaveLength(3)
  expect([week[1], week[3], week[5], week[6]]).toEqual(Array(4).fill("Rest day"))
  expect(week[0]).toBe(week[4])
  expect(new Set([week[0], week[2]])).toEqual(new Set(["Full Body A", "Full Body B"]))
  expect(names(base, [7])).toEqual([week[2]])
  expect(names({ ...base, sessions: 2 }, [0, 3])).toEqual(["Full Body A", "Full Body B"])
})

test("schedules upper/lower, push/pull/legs and lower-body splits", () => {
  expect(names({ ...base, sessions: 4 }, [0, 1, 3, 4])).toEqual([
    "Upper A",
    "Lower A",
    "Upper B",
    "Lower B",
  ])
  const week = [0, 1, 2, 3, 4, 5]
  expect(names({ ...base, sessions: 5 }, week)).toEqual([
    "Push",
    "Pull",
    "Legs",
    "Upper",
    "Lower",
    "Rest day",
  ])
  expect(names({ ...base, sessions: 5, emphasis: "Lower body" }, week)).toEqual([
    "Lower A",
    "Push",
    "Pull",
    "Lower B",
    "Upper",
    "Rest day",
  ])
  expect(names({ ...base, sessions: 7, emphasis: "Lower body" }, week)).toEqual([
    "Push",
    "Pull",
    "Lower A",
    "Push",
    "Pull",
    "Lower B",
  ])
})

test("follows the Full Body A template with compounds first and 8–12 reps", () => {
  const routine = routineOn(day(fullBodyA), base)
  expect(routine.exercises.map((e) => e.key)).toEqual([
    "barbell-squat",
    "machine-chest-press",
    "seated-cable-row",
    "romanian-deadlift",
    "lateral-raise",
    "plank",
  ])
  expect(routine.exercises[0].prescription).toBe("3x8–12")
  expect(routine.exercises[5].prescription).toBe("3x30–45s")
})

test("drops singles first when the session is short", () => {
  expect(keys({ ...base, minutes: 30 })).toEqual([
    "barbell-squat",
    "machine-chest-press",
    "seated-cable-row",
  ])
  expect(routineOn(day(fullBodyA), { ...base, minutes: 45 }).minutes).toBeLessThanOrEqual(45)
})

test("swaps exercises that load an excluded joint for a safe one", () => {
  const picked = keys({ ...base, injuries: [injury(excluded)] })
  expect(picked.length).toBeGreaterThan(3)
  expect(picked.some((key) => find(key).joints.includes("knee"))).toBe(false)
})

test("drops to two sets only on exercises that load a light joint", () => {
  const routine = routineOn(day(fullBodyA), { ...base, injuries: [injury({ area: "Shoulder" })] })
  for (const exercise of routine.exercises) {
    const sets = find(exercise.key).joints.includes("shoulder") ? "2x" : "3x"
    expect(exercise.prescription.startsWith(sets)).toBe(true)
  }
})

test("ignores injuries outside their dates and keeps permanent ones", () => {
  const ended = injury({ ...excluded, startDate: "2026-10-01" })
  expect(keys({ ...base, injuries: [ended] })).toEqual(keys(base))
  const permanent = injury({ ...excluded, startDate: "2026-01-01", permanent: "exclude" })
  expect(keys({ ...base, injuries: [permanent] })).not.toEqual(keys(base))
})

test("lower-body emphasis adds glute work and a glute set", () => {
  const lower = { ...base, emphasis: "Lower body" as const }
  expect(keys(lower)).toContain("cable-glute-kickback")
  expect(keys(lower)).not.toContain("plank")
  const lowerA = routineOn(day(1), { ...lower, sessions: 4 })
  expect(lowerA.exercises.find((e) => e.key === "hip-thrust")?.prescription).toBe("4x8–12")
})

test("beginners get easier variations, fewer sets and at most three compounds", () => {
  const beginner = { ...base, experience: "Beginner" as const, emphasis: "Lower body" as const }
  const routine = routineOn(day(fullBodyA), beginner)
  const picked = routine.exercises.map((e) => e.key)
  expect(picked[0]).toBe("goblet-squat")
  expect(picked.filter((key) => find(key).compound)).toHaveLength(3)
  for (const exercise of routine.exercises)
    expect(exercise.prescription.startsWith(find(exercise.key).compound ? "3x" : "2x")).toBe(true)
  const legs = routineOn(day(2), { ...beginner, sessions: 5, emphasis: "Balanced" })
  expect(legs.exercises.map((e) => e.key)).toEqual(
    expect.arrayContaining(["leg-press", "leg-extension"]),
  )
})

test("liked exercises take the slot for the same muscle and disliked ones are swapped", () => {
  const liked = routineOn(day(fullBodyA), { ...base, likes: ["bench-press"] }).exercises
  expect(liked.find((e) => e.key === "bench-press")?.liked).toBe(true)
  expect(liked.map((e) => e.key)).not.toContain("machine-chest-press")
  const swapped = keys({ ...base, dislikes: ["barbell-squat"] })
  expect(swapped).not.toContain("barbell-squat")
  expect(swapped).toHaveLength(6)
})

test("keeps a disliked exercise when nothing else fits", () => {
  const coreKeys = CATALOG.filter((exercise) => exercise.group === "Core").map((e) => e.key)
  expect(keys({ ...base, dislikes: coreKeys })).toContain("plank")
})

test("rests on rough period days, then trains light", () => {
  const period = createInjury(PERIOD_AREA, "Rough", "2026-11-09")
  const input = { ...base, sessions: 6, injuries: [period] }
  expect([0, 1].map((offset) => routineOn(day(offset), input))).toEqual([REST_DAY, REST_DAY])
  const light = routineOn(day(2), input)
  expect(light.exercises.every((exercise) => exercise.prescription.startsWith("2x"))).toBe(true)
  expect(routineOn(day(5), input).exercises.some((e) => e.prescription.startsWith("3x"))).toBe(true)
})

test("excludes first, then trains light, as recovery moves on", () => {
  const knee = injury({ excludeDays: 2, lightDays: 7 })
  const input = { ...base, injuries: [knee] }
  const kneeKeys = (offset: number) =>
    routineOn(day(offset), input).exercises.filter((e) => find(e.key).joints.includes("knee"))
  expect(kneeKeys(0)).toEqual([])
  expect(kneeKeys(2).length).toBeGreaterThan(0)
  expect(kneeKeys(2).every((e) => e.prescription.startsWith("2x"))).toBe(true)
})

test("trains every exercise light while feeling unwell", () => {
  const unwell = createInjury(UNWELL_AREA, "Mild", "2026-11-09")
  const routine = routineOn(monday, { ...base, injuries: [unwell] })
  expect(routine.exercises.every((exercise) => exercise.prescription.startsWith("2x"))).toBe(true)
})

test("finds the next training day and names active injuries", () => {
  const pair = routinesFor({ ...base, injuries: [injury({ area: "Shoulder" })] }, day(1))
  expect(pair.today).toBe(REST_DAY)
  expect(pair.next.name).toBe(routineOn(day(2), base).name)
  expect(pair.nextDate.getDate()).toBe(11)
  expect(pair.adjustedFor).toBe("Shoulder")
})
