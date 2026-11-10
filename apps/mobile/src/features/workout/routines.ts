import { dateKey } from "@/features/health"
import {
  affects,
  daysBetween,
  isActive,
  isWholeBody,
  PERIOD_AREA,
  phaseOn,
  UNWELL_AREA,
  type Injury,
} from "@/features/recovery"

import { CATALOG, findExercise, type CatalogExercise, type MuscleGroup } from "./catalog"

export type Emphasis = "Balanced" | "Lower body"
export type Experience = "Beginner" | "Regular"

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
  emphasis?: Emphasis
  experience?: Experience
}

/** One template slot: the first liked option wins, else the first; beginners get `beginner`. */
type Slot = { options: string[]; beginner?: string }
const slot = (options: string | string[], beginner?: string): Slot => ({
  options: [options].flat(),
  beginner,
})

/** Curated sessions from the planner spec; injuries, dislikes and experience swap single slots. */
const TEMPLATES = {
  "Full Body A": [
    slot("barbell-squat", "goblet-squat"),
    slot("machine-chest-press"),
    slot("seated-cable-row"),
    slot("romanian-deadlift"),
    slot("lateral-raise"),
    slot("plank"),
  ],
  "Full Body B": [
    slot("leg-press"),
    slot("shoulder-press"),
    slot("lat-pulldown"),
    slot("hip-thrust"),
    slot("seated-leg-curl"),
    slot(["cable-curl", "triceps-pushdown"]),
  ],
  "Upper A": [
    slot("machine-chest-press"),
    slot("seated-cable-row"),
    slot("shoulder-press"),
    slot("triceps-pushdown"),
    slot("cable-curl"),
  ],
  "Lower A": [
    slot("hip-thrust"),
    slot("romanian-deadlift"),
    slot("bulgarian-split-squat"),
    slot("seated-leg-curl"),
    slot("cable-glute-kickback"),
  ],
  "Upper B": [
    slot("incline-dumbbell-press"),
    slot("lat-pulldown"),
    slot("chest-supported-row"),
    slot("lateral-raise"),
    slot("face-pull"),
    slot("overhead-rope-extension"),
  ],
  "Lower B": [
    slot("barbell-squat", "goblet-squat"),
    slot("walking-lunge"),
    slot("leg-extension"),
    slot("hip-abduction-machine"),
    slot("calf-raise"),
  ],
  Push: [
    slot("machine-chest-press"),
    slot("incline-dumbbell-press"),
    slot("shoulder-press"),
    slot("lateral-raise"),
    slot("triceps-pushdown"),
    slot("overhead-rope-extension"),
  ],
  Pull: [
    slot("lat-pulldown"),
    slot("seated-cable-row"),
    slot("face-pull"),
    slot("rear-delt-fly"),
    slot("cable-curl"),
    slot("hammer-curl"),
  ],
  Legs: [
    slot("barbell-squat", "leg-press"),
    slot("romanian-deadlift"),
    slot("hip-thrust"),
    slot("walking-lunge", "leg-extension"),
    slot("seated-leg-curl"),
    slot("calf-raise"),
  ],
  Upper: [
    slot("dumbbell-press"),
    slot("lat-pulldown"),
    slot("machine-shoulder-press"),
    slot("machine-row"),
    slot("lateral-raise"),
    slot("triceps-pushdown"),
  ],
  Lower: [
    slot("leg-press"),
    slot("hip-thrust"),
    slot("bulgarian-split-squat"),
    slot("seated-leg-curl"),
    slot("cable-glute-kickback"),
    slot("calf-raise"),
  ],
} satisfies Record<string, Slot[]>
type DayKind = keyof typeof TEMPLATES | "Full Body"

/** Lower-body emphasis swaps the last single in Full Body A for glute work. */
const LOWER_BODY_SWAPS: Partial<Record<DayKind, Record<string, string>>> = {
  "Full Body A": { plank: "cable-glute-kickback" },
}

/** Training weekdays (0 = Monday) and the session on each. */
function weekFor(sessions: number, emphasis: Emphasis): [number, DayKind][] {
  const lower = emphasis === "Lower body"
  switch (sessions) {
    case 1:
      return [[0, "Full Body"]]
    case 2:
      return [
        [0, "Full Body"],
        [3, "Full Body"],
      ]
    case 3:
      return [
        [0, "Full Body"],
        [2, "Full Body"],
        [4, "Full Body"],
      ]
    case 4:
      return [
        [0, "Upper A"],
        [1, "Lower A"],
        [3, "Upper B"],
        [4, "Lower B"],
      ]
    case 5: {
      const days: DayKind[] = lower
        ? ["Lower A", "Push", "Pull", "Lower B", "Upper"]
        : ["Push", "Pull", "Legs", "Upper", "Lower"]
      return days.map((kind, weekday) => [weekday, kind])
    }
    default: {
      const days: DayKind[] = lower
        ? ["Push", "Pull", "Lower A", "Push", "Pull", "Lower B"]
        : ["Push", "Pull", "Legs", "Push", "Pull", "Legs"]
      return days.map((kind, weekday) => [weekday, kind])
    }
  }
}

/** Larger groups first in the browse grid. */
const GROUP_PRIORITY: MuscleGroup[] = ["Legs", "Back", "Chest", "Shoulders", "Arms", "Core"]
const REST_SECONDS: Record<string, number> = { "Lose fat": 60, Maintain: 75, "Build muscle": 90 }
const COMPOUND_EXTRA_REST = 30
const SET_SECONDS = 40
const WARM_UP_MINUTES = 5
const SETUP_MINUTES = 1
const MAX_EXERCISES = 6
const MAX_SESSIONS = 6
const BEGINNER_MAX_COMPOUNDS = 3
/** A Monday used to alternate Full Body A and B from week to week. */
const FIRST_WEEK = "2024-01-01"

export const REST_DAY: Routine = { name: "Rest day", sets: 0, minutes: 0, exercises: [] }

function exerciseMinutes(exercise: CatalogExercise, sets: number, goal: string) {
  const rest = (REST_SECONDS[goal] ?? 75) + (exercise.compound ? COMPOUND_EXTRA_REST : 0)
  return (sets * (SET_SECONDS + rest)) / 60 + SETUP_MINUTES
}

const prescription = (exercise: CatalogExercise, sets: number) =>
  `${sets}x${exercise.unit === "seconds" ? "30–45s" : "8–12"}`

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
      prescription: prescription(exercise, setsFor(exercise)),
      ...(likes.includes(exercise.key) ? { liked: true } : {}),
    })),
  }
}

const exercise = (key: string) => {
  const found = findExercise(key)
  if (!found) throw new Error(`Unknown exercise ${key}`)
  return found
}

/** Fills a template, swaps blocked slots for the same muscle, then trims to the session time. */
function sessionFor(
  kind: keyof typeof TEMPLATES,
  input: PlanInput,
  today: string,
  allLight: boolean,
) {
  const beginner = input.experience === "Beginner"
  const lowerBody = input.emphasis === "Lower body"
  const inPhase = (phase: "exclude" | "light") =>
    input.injuries.filter((injury) => !isWholeBody(injury.area) && phaseOn(injury, today) === phase)
  const excluded = inPhase("exclude")
  const light = inPhase("light")
  const isExcluded = (item: CatalogExercise) =>
    excluded.some((injury) => affects(injury.area, item))
  const liked = (item: CatalogExercise) => input.likes.includes(item.key)
  const disliked = (item: CatalogExercise) => input.dislikes.includes(item.key)

  const picked: CatalogExercise[] = []
  /** Best free exercise for the same muscle, then the same group; liked ones first. */
  const substitute = (
    original: CatalogExercise,
    accept: (item: CatalogExercise) => boolean = () => true,
  ) => {
    const score = (item: CatalogExercise) =>
      (liked(item) ? 0 : 4) +
      (item.muscles[0] === original.muscles[0] ? 0 : 2) +
      (item.compound === original.compound ? 0 : 1)
    return CATALOG.filter(
      (item) =>
        item.key !== original.key &&
        !picked.includes(item) &&
        (item.muscles[0] === original.muscles[0] || item.group === original.group) &&
        !isExcluded(item) &&
        !disliked(item) &&
        accept(item),
    ).sort((a, b) => score(a) - score(b))[0]
  }

  const swaps = lowerBody ? (LOWER_BODY_SWAPS[kind] ?? {}) : {}
  for (const { options, beginner: easier } of TEMPLATES[kind]) {
    const key =
      (beginner && easier) ||
      options.find((option) => input.likes.includes(option)) ||
      options.find((option) => !input.dislikes.includes(option)) ||
      options[0]
    let choice: CatalogExercise | undefined = exercise(swaps[key] ?? key)
    if (picked.includes(choice)) continue
    // A liked exercise for the same muscle takes the slot.
    if (!liked(choice)) {
      const original = choice
      const favourite = substitute(
        original,
        (item) =>
          liked(item) &&
          item.muscles[0] === original.muscles[0] &&
          item.compound === original.compound,
      )
      if (favourite) choice = favourite
    }
    if (isExcluded(choice) || disliked(choice)) {
      // Disliked exercises only stay when nothing else fits; injured ones never stay.
      choice = substitute(choice) ?? (isExcluded(choice) ? undefined : choice)
    }
    if (choice) picked.push(choice)
  }

  if (beginner) {
    // Beginners lift at most three compounds; later ones become singles for the same muscle.
    for (let index = picked.length - 1; index >= 0; index--) {
      if (picked.filter((item) => item.compound).length <= BEGINNER_MAX_COMPOUNDS) break
      if (!picked[index].compound) continue
      const single = substitute(picked[index], (item) => !item.compound)
      if (single) picked[index] = single
      else picked.splice(index, 1)
    }
  }
  picked.sort((a, b) => Number(b.compound) - Number(a.compound))

  const extraSets = new Set(
    lowerBody && !beginner ? picked.filter((item) => item.muscles[0] === "glutes") : [],
  )
  const setsFor = (item: CatalogExercise) => {
    const sets = (beginner && !item.compound ? 2 : 3) + (extraSets.has(item) ? 1 : 0)
    return allLight || light.some((injury) => affects(injury.area, item)) ? Math.min(sets, 2) : sets
  }
  const total = () =>
    picked.reduce(
      (sum, item) => sum + exerciseMinutes(item, setsFor(item), input.goal),
      WARM_UP_MINUTES,
    )
  picked.splice(MAX_EXERCISES)
  // Over time: drop singles from the end, then extra glute sets, then compounds from the end.
  const droppable = (item: CatalogExercise) =>
    !item.compound && !(lowerBody && item.muscles[0] === "glutes")
  while (total() > input.minutes && picked.length > 1) {
    const single = picked.map(droppable).lastIndexOf(true)
    const [extra] = [...extraSets].reverse()
    if (single >= 0) picked.splice(single, 1)
    else if (extra) extraSets.delete(extra)
    else picked.pop()
  }
  return buildRoutine(kind, picked, setsFor, input.goal, input.likes)
}

const mondayIndex = (date: Date) => (date.getDay() + 6) % 7

/** The routine on a calendar day, or the rest day when nothing is scheduled. */
export function routineOn(date: Date, input: PlanInput): Routine {
  const today = dateKey(date)
  const wholeBody = (area: Injury["area"]) =>
    input.injuries.find((injury) => injury.area === area && isActive(injury, today))
  const period = wholeBody(PERIOD_AREA)
  if (period && phaseOn(period, today) === "exclude") return REST_DAY
  const sessions = Math.min(Math.max(input.sessions ?? 3, 1), MAX_SESSIONS)
  const schedule = weekFor(sessions, input.emphasis ?? "Balanced")
  const slot = schedule.findIndex(([weekday]) => weekday === mondayIndex(date))
  if (slot < 0) return REST_DAY
  let kind = schedule[slot][1]
  if (kind === "Full Body") {
    // A and B alternate across weeks too: A-B-A, then B-A-B.
    const week = Math.floor(daysBetween(FIRST_WEEK, today) / 7)
    kind = (week * schedule.length + slot) % 2 ? "Full Body B" : "Full Body A"
  }
  return sessionFor(kind, input, today, !!period || !!wholeBody(UNWELL_AREA))
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
      CATALOG.filter((item) => item.group === group),
      () => 3,
      "Maintain",
      [],
    ),
  ]),
)
