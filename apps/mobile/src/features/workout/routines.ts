import { dateKey } from "@/features/health"
import {
  AREA_JOINTS,
  isActive,
  PERIOD_AREA,
  periodPhase,
  type Injury,
  type Joint,
} from "@/features/recovery"

import { CATALOG, type CatalogExercise, type MuscleGroup } from "./catalog"

export type Routine = {
  name: string
  sets: number
  minutes: number
  exercises: { key: string; name: string; prescription: string; liked?: boolean }[]
}
export type RoutinePair = {
  today: Routine
  next: Routine
  nextDate: Date
  adjustedFor: string | null
}
export type PlanInput = {
  /** Sessions per week; null falls back to 3. */
  sessions: number | null
  /** Session length in minutes, warm-up included. */
  minutes: number
  goal: string
  injuries: Injury[]
  likes: string[]
  dislikes: string[]
}

type DayKind = "Full Body A" | "Full Body B" | "Upper" | "Lower" | "Push" | "Pull" | "Legs"

/** Training weekdays (0 = Monday) and the session on each. */
const WEEK: Record<number, [number, DayKind][]> = {
  1: [[0, "Full Body A"]],
  2: [
    [0, "Full Body A"],
    [3, "Full Body B"],
  ],
  3: [
    [0, "Full Body A"],
    [2, "Full Body B"],
    [4, "Full Body A"],
  ],
  4: [
    [0, "Upper"],
    [1, "Lower"],
    [3, "Upper"],
    [4, "Lower"],
  ],
  5: [
    [0, "Push"],
    [1, "Pull"],
    [2, "Legs"],
    [4, "Upper"],
    [5, "Lower"],
  ],
  6: [
    [0, "Push"],
    [1, "Pull"],
    [2, "Legs"],
    [3, "Push"],
    [4, "Pull"],
    [5, "Legs"],
  ],
  7: [
    [0, "Push"],
    [1, "Pull"],
    [2, "Legs"],
    [3, "Push"],
    [4, "Pull"],
    [5, "Legs"],
    [6, "Full Body A"],
  ],
}
const PUSH = ["chest", "front delt", "side delt", "triceps"]
const PULL = ["lats", "mid back", "upper back", "rear delt", "biceps"]
const isLower = (muscle: string) => !PUSH.includes(muscle) && !PULL.includes(muscle)
const IN_DAY: Record<DayKind, (primary: string) => boolean> = {
  "Full Body A": () => true,
  "Full Body B": () => true,
  Upper: (muscle) => !isLower(muscle),
  Lower: isLower,
  Push: (muscle) => PUSH.includes(muscle),
  Pull: (muscle) => PULL.includes(muscle),
  Legs: isLower,
}
/** Larger groups claim slots first. */
const GROUP_PRIORITY: MuscleGroup[] = ["Legs", "Back", "Chest", "Shoulders", "Arms", "Core"]
const REST_SECONDS: Record<string, number> = { "Lose fat": 60, Maintain: 75, "Build muscle": 90 }
const COMPOUND_EXTRA_REST = 30
const SET_SECONDS = 40
const WARM_UP_MINUTES = 5
const SETUP_MINUTES = 1
const MAX_EXERCISES = 6
const SHORT_SESSION_MINUTES = 45

export const REST_DAY: Routine = { name: "Rest day", sets: 0, minutes: 0, exercises: [] }

function exerciseMinutes(exercise: CatalogExercise, sets: number, goal: string) {
  const rest = (REST_SECONDS[goal] ?? 75) + (exercise.compound ? COMPOUND_EXTRA_REST : 0)
  return (sets * (SET_SECONDS + rest)) / 60 + SETUP_MINUTES
}

function buildRoutine(
  name: string,
  picked: CatalogExercise[],
  setsFor: (exercise: CatalogExercise) => number,
  goal: string,
  likes: string[],
): Routine {
  const minutes = picked.reduce(
    (total, exercise) => total + exerciseMinutes(exercise, setsFor(exercise), goal),
    WARM_UP_MINUTES,
  )
  return {
    name,
    sets: picked.reduce((total, exercise) => total + setsFor(exercise), 0),
    minutes: Math.round(minutes),
    exercises: picked.map((exercise) => ({
      key: exercise.key,
      name: exercise.name,
      prescription: `${setsFor(exercise)}x${exercise.reps}${exercise.unit === "seconds" ? "s" : ""}`,
      ...(likes.includes(exercise.key) ? { liked: true } : {}),
    })),
  }
}

/** Picks exercises round-robin across groups until the session time or slot cap runs out. */
function sessionFor(
  kind: DayKind,
  variant: number,
  input: PlanInput,
  today: string,
  allLight: boolean,
) {
  const active = input.injuries.filter((injury) => isActive(injury, today))
  const jointsFor = (mode: Injury["mode"]) =>
    active.flatMap((injury): Joint[] =>
      injury.area !== PERIOD_AREA && injury.mode === mode ? [AREA_JOINTS[injury.area]] : [],
    )
  const excluded = jointsFor("exclude")
  const light = jointsFor("light")
  const setsFor = (exercise: CatalogExercise) =>
    allLight || exercise.joints.some((joint) => light.includes(joint)) ? 2 : 3

  const pool = CATALOG.filter(
    (exercise) =>
      IN_DAY[kind](exercise.muscles[0]) &&
      !exercise.joints.some((joint) => excluded.includes(joint)),
  )
  const rank = (exercise: CatalogExercise) =>
    (input.likes.includes(exercise.key) ? 0 : 2) + (exercise.compound ? 0 : 1)
  let groups = GROUP_PRIORITY.map((group) => {
    const options = pool.filter((exercise) => exercise.group === group)
    // Disliked exercises only stay when the group has nothing else.
    const allowed = options.filter((exercise) => !input.dislikes.includes(exercise.key))
    const sorted = (allowed.length ? allowed : options).sort((a, b) => rank(a) - rank(b))
    const shift = sorted.length ? variant % sorted.length : 0
    return [...sorted.slice(shift), ...sorted.slice(0, shift)]
  }).filter((options) => options.length)
  // Short full-body sessions cannot fit every group, so the B session leads with the other half.
  if (kind.startsWith("Full Body") && input.minutes < SHORT_SESSION_MINUTES && variant % 2) {
    const half = Math.ceil(groups.length / 2)
    groups = [...groups.slice(half), ...groups.slice(0, half)]
  }

  const picked: CatalogExercise[] = []
  let budget = input.minutes - WARM_UP_MINUTES
  for (let round = 0; picked.length < MAX_EXERCISES; round++) {
    const candidates = groups.flatMap((options) => (options[round] ? [options[round]] : []))
    if (!candidates.length) break
    for (const exercise of candidates) {
      const cost = exerciseMinutes(exercise, setsFor(exercise), input.goal)
      if (picked.length >= MAX_EXERCISES || (cost > budget && picked.length)) continue
      picked.push(exercise)
      budget -= cost
    }
  }
  picked.sort((a, b) => Number(b.compound) - Number(a.compound))
  return buildRoutine(kind, picked, setsFor, input.goal, input.likes)
}

const mondayIndex = (date: Date) => (date.getDay() + 6) % 7

/** The routine on a calendar day, or the rest day when nothing is scheduled. */
export function routineOn(date: Date, input: PlanInput): Routine {
  const today = dateKey(date)
  const period = input.injuries.map((injury) => periodPhase(injury, today)).find(Boolean)
  if (period === "rest") return REST_DAY
  const schedule = WEEK[Math.min(Math.max(input.sessions ?? 3, 1), 7)]
  const slot = schedule.findIndex(([weekday]) => weekday === mondayIndex(date))
  if (slot < 0) return REST_DAY
  const kind = schedule[slot][1]
  const variant = schedule.slice(0, slot).filter(([, other]) => other === kind).length
  return sessionFor(kind, variant, input, today, period === "light")
}

export function routinesFor(input: PlanInput, date = new Date()): RoutinePair {
  const nextDate = new Date(date)
  let next = REST_DAY
  for (let offset = 1; offset <= 14 && next === REST_DAY; offset++) {
    nextDate.setTime(date.getTime())
    nextDate.setDate(date.getDate() + offset)
    next = routineOn(nextDate, input)
  }
  const active = input.injuries.filter((injury) => isActive(injury, dateKey(date)))
  return {
    today: routineOn(date, input),
    next,
    nextDate,
    adjustedFor: active.length
      ? active.map((injury) => (injury.area === PERIOD_AREA ? "period" : injury.area)).join(", ")
      : null,
  }
}

/** Every catalogue exercise for one muscle group, for the browse grid. */
export const GROUP_ROUTINES: Record<string, Routine> = Object.fromEntries(
  GROUP_PRIORITY.map((group) => [
    group.toLowerCase(),
    buildRoutine(
      group,
      CATALOG.filter((exercise) => exercise.group === group),
      () => 3,
      "Maintain",
      [],
    ),
  ]),
)
