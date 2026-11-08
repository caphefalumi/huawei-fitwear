import { createInjury, PERIOD_AREA, type Injury } from "@/features/recovery"
import { CATALOG, REST_DAY, routineOn, routinesFor, type PlanInput } from "@/features/workout"

// 2026-11-09 is a Monday.
const monday = new Date(2026, 10, 9, 9)
const day = (offset: number) => new Date(2026, 10, 9 + offset, 9)
const base: PlanInput = {
  sessions: 3,
  minutes: 60,
  goal: "Maintain",
  injuries: [],
  likes: [],
  dislikes: [],
}
const keys = (input: PlanInput, date = monday) => routineOn(date, input).exercises.map((e) => e.key)
const joints = (key: string) => CATALOG.find((exercise) => exercise.key === key)?.joints ?? []
const injury = (patch: Partial<Injury>): Injury => ({
  ...createInjury("Knee", "2026-11-09"),
  ...patch,
})

test("spreads three full-body sessions over Monday, Wednesday and Friday", () => {
  const names = [0, 1, 2, 3, 4, 5, 6].map((offset) => routineOn(day(offset), base).name)
  expect(names).toEqual([
    "Full Body A",
    "Rest day",
    "Full Body B",
    "Rest day",
    "Full Body A",
    "Rest day",
    "Rest day",
  ])
})

test("uses upper/lower for four sessions and push/pull/legs for five", () => {
  expect(routineOn(monday, { ...base, sessions: 4 }).name).toBe("Upper")
  expect(routineOn(day(1), { ...base, sessions: 4 }).name).toBe("Lower")
  expect(
    [0, 1, 2, 4, 5].map((offset) => routineOn(day(offset), { ...base, sessions: 5 }).name),
  ).toEqual(["Push", "Pull", "Legs", "Upper", "Lower"])
})

test("caps a session at six exercises with compound lifts first", () => {
  const routine = routineOn(monday, { ...base, minutes: 90 })
  expect(routine.exercises).toHaveLength(6)
  const compound = routine.exercises.map(
    (exercise) => CATALOG.find((item) => item.key === exercise.key)?.compound,
  )
  expect(compound).toEqual([...compound].sort((a, b) => Number(b) - Number(a)))
})

test("fits fewer exercises into shorter sessions", () => {
  expect(keys({ ...base, minutes: 30 }).length).toBeLessThan(keys({ ...base, minutes: 60 }).length)
  expect(routineOn(monday, { ...base, minutes: 45 }).minutes).toBeLessThanOrEqual(45)
})

test("removes every exercise that loads an excluded joint", () => {
  const picked = keys({ ...base, injuries: [injury({ mode: "exclude" })] })
  expect(picked.length).toBeGreaterThan(0)
  expect(picked.some((key) => joints(key).includes("knee"))).toBe(false)
})

test("drops to two sets only on exercises that load a light joint", () => {
  const routine = routineOn(monday, { ...base, injuries: [injury({ area: "Shoulder" })] })
  for (const exercise of routine.exercises) {
    const sets = joints(exercise.key).includes("shoulder") ? "2x" : "3x"
    expect(exercise.prescription.startsWith(sets)).toBe(true)
  }
})

test("ignores injuries outside their dates and keeps permanent ones", () => {
  const ended = injury({ mode: "exclude", startDate: "2026-10-01", endDate: "2026-10-08" })
  expect(keys({ ...base, injuries: [ended] })).toEqual(keys(base))
  const permanent = injury({ mode: "exclude", startDate: "2026-01-01", endDate: null })
  expect(keys({ ...base, injuries: [permanent] })).not.toEqual(keys(base))
})

test("rests four period days, then trains light for three", () => {
  const period = createInjury(PERIOD_AREA, "2026-11-09")
  const input = { ...base, sessions: 7, injuries: [period] }
  expect([0, 1, 2, 3].map((offset) => routineOn(day(offset), input))).toEqual([
    REST_DAY,
    REST_DAY,
    REST_DAY,
    REST_DAY,
  ])
  const light = routineOn(day(4), input)
  expect(light.exercises.every((exercise) => exercise.prescription.startsWith("2x"))).toBe(true)
  expect(routineOn(day(7), input).exercises.some((e) => e.prescription.startsWith("3x"))).toBe(true)
})

test("puts liked exercises first in their group and leaves disliked ones out", () => {
  const liked = keys({ ...base, likes: ["leg-press"] })
  expect(liked).toContain("leg-press")
  expect(
    routineOn(monday, { ...base, likes: ["leg-press"] }).exercises.find(
      (e) => e.key === "leg-press",
    )?.liked,
  ).toBe(true)
  expect(keys({ ...base, dislikes: ["barbell-squat"] })).not.toContain("barbell-squat")
})

test("keeps a disliked exercise when its group has nothing else", () => {
  const coreKeys = CATALOG.filter((exercise) => exercise.group === "Core").map((e) => e.key)
  const picked = keys({ ...base, minutes: 90, dislikes: coreKeys })
  expect(picked.some((key) => coreKeys.includes(key))).toBe(true)
})

test("finds the next training day and names active injuries", () => {
  const pair = routinesFor({ ...base, injuries: [injury({ area: "Shoulder" })] }, day(1))
  expect(pair.today).toBe(REST_DAY)
  expect(pair.next.name).toBe("Full Body B")
  expect(pair.nextDate.getDate()).toBe(11)
  expect(pair.adjustedFor).toBe("Shoulder")
})
