import { create } from "zustand"

import { dateKey } from "@/features/health"
import { planNow, usePlanNow } from "@/lib/time/demo-clock"

export type Joint =
  | "cervical spine"
  | "shoulder"
  | "elbow"
  | "wrist"
  | "lumbar spine"
  | "hip"
  | "knee"
  | "ankle"

export const PERIOD_AREA = "In period"
export const UNWELL_AREA = "Feeling unwell"

/** Which exercise tags each body area matches; left and right are treated the same. */
const AREA_TAGS = {
  Neck: { joints: ["cervical spine"] },
  Shoulder: { joints: ["shoulder"] },
  Elbow: { joints: ["elbow"] },
  Wrist: { joints: ["wrist"] },
  "Lower back": { joints: ["lumbar spine"] },
  Hip: { joints: ["hip"] },
  Hamstring: { muscles: ["hamstrings"] },
  Knee: { joints: ["knee"] },
  Calf: { muscles: ["calves"] },
  Ankle: { joints: ["ankle"] },
} as const satisfies Record<string, { joints?: Joint[]; muscles?: string[] }>

export type BodyArea = keyof typeof AREA_TAGS
export type InjuryArea = BodyArea | typeof PERIOD_AREA | typeof UNWELL_AREA

export const AREA_GROUPS: { title: string; areas: InjuryArea[] }[] = [
  { title: "Upper", areas: ["Neck", "Shoulder", "Elbow", "Wrist"] },
  { title: "Lower", areas: ["Lower back", "Hip", "Hamstring", "Knee", "Calf", "Ankle"] },
  { title: "Not an injury", areas: [PERIOD_AREA, UNWELL_AREA] },
]

/** Period and feeling unwell change the whole session, not one area. */
export const isWholeBody = (area: InjuryArea): area is typeof PERIOD_AREA | typeof UNWELL_AREA =>
  area === PERIOD_AREA || area === UNWELL_AREA

/** Whether an injury in `area` affects an exercise with these tags. */
export function affects(area: InjuryArea, exercise: { joints: string[]; muscles: string[] }) {
  if (isWholeBody(area)) return true
  const tags: { joints?: readonly string[]; muscles?: readonly string[] } = AREA_TAGS[area]
  return (
    !!tags.joints?.some((joint) => exercise.joints.includes(joint)) ||
    !!tags.muscles?.some((muscle) => exercise.muscles.includes(muscle))
  )
}

export type Phase = "exclude" | "light"

/**
 * Recovery runs Exclude for `excludeDays`, then Light for `lightDays`, then back to normal.
 * For period recovery the Exclude phase means a rest day. `permanent` keeps one phase forever.
 */
export type Injury = {
  area: InjuryArea
  startDate: string
  excludeDays: number
  lightDays: number
  permanent: Phase | null
}

export const SEVERITIES = {
  Mild: { excludeDays: 0, lightDays: 7 },
  Moderate: { excludeDays: 3, lightDays: 7 },
  Severe: { excludeDays: 7, lightDays: 14 },
} as const
export type Severity = keyof typeof SEVERITIES

/** Period is not an injury: how the user feels sets the rest and light days. */
export const PERIOD_FEELINGS = {
  "Okay, just go easier": { excludeDays: 0, lightDays: 3 },
  "Tired or crampy": { excludeDays: 1, lightDays: 3 },
  Rough: { excludeDays: 2, lightDays: 3 },
} as const
export type PeriodFeeling = keyof typeof PERIOD_FEELINGS
const UNWELL_LIGHT_DAYS = 3

export function addDays(key: string, days: number) {
  const date = new Date(`${key}T12:00:00`)
  date.setDate(date.getDate() + days)
  return dateKey(date)
}

export function daysBetween(from: string, to: string) {
  const start = new Date(`${from}T12:00:00`).getTime()
  return Math.round((new Date(`${to}T12:00:00`).getTime() - start) / 86400000)
}

export const shortDate = (key: string) =>
  new Date(`${key}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })

export type PhaseDays = { excludeDays: number; lightDays: number }
/** A severity for body areas, a feeling for period, or custom days for either. */
export type InjuryOption = Severity | PeriodFeeling | PhaseDays

export function createInjury(
  area: InjuryArea,
  option?: InjuryOption,
  today = dateKey(planNow()),
): Injury {
  const days =
    typeof option === "object"
      ? option
      : area === PERIOD_AREA
        ? (PERIOD_FEELINGS[option as PeriodFeeling] ?? PERIOD_FEELINGS["Tired or crampy"])
        : area === UNWELL_AREA
          ? { excludeDays: 0, lightDays: UNWELL_LIGHT_DAYS }
          : (SEVERITIES[option as Severity] ?? SEVERITIES.Mild)
  return {
    area,
    startDate: today,
    excludeDays: days.excludeDays,
    lightDays: days.lightDays,
    permanent: null,
  }
}

/** The phase on `today`, or null before the start and after recovery ends. */
export function phaseOn(injury: Injury, today = dateKey(planNow())): Phase | null {
  const day = daysBetween(injury.startDate, today)
  if (day < 0) return null
  if (day < injury.excludeDays) return "exclude"
  if (injury.permanent) return injury.permanent
  return day < injury.excludeDays + injury.lightDays ? "light" : null
}

export const isActive = (injury: Injury, today = dateKey(planNow())) =>
  phaseOn(injury, today) !== null

/** Last day (inclusive) of a phase. */
export const phaseEnd = (injury: Injury, phase: Phase) =>
  addDays(
    injury.startDate,
    (phase === "exclude" ? injury.excludeDays : injury.excludeDays + injury.lightDays) - 1,
  )

export function injuryTitle(injuries: Injury[]) {
  if (injuries.length !== 1) return `${injuries.length} injuries`
  const { area } = injuries[0]
  return area === PERIOD_AREA ? "Period recovery" : area === UNWELL_AREA ? area : `${area} recovery`
}

/** What changes in the user's plan today, in their words. */
export function injuryEffect(injury: Injury, today = dateKey(planNow())) {
  const phase = phaseOn(injury, today) ?? (injury.excludeDays ? "exclude" : "light")
  const until = (end: Phase) =>
    injury.permanent === end ? "" : ` until ${shortDate(phaseEnd(injury, end))}`
  const wholeBody = isWholeBody(injury.area)
  const subject = wholeBody ? "All exercises" : `${injury.area} exercises`
  const light = `${subject}: 3 → 2 sets${until("light")}`
  if (phase === "light") return light
  const removed =
    injury.area !== PERIOD_AREA
      ? `${subject} are removed from your plan${until("exclude")}`
      : phaseEnd(injury, "exclude") === today && injury.permanent !== "exclude"
        ? "Rest today"
        : `Rest${until("exclude")}`
  return injury.permanent === "exclude" || !injury.lightDays
    ? removed
    : `${removed}, then ${wholeBody ? "all exercises " : ""}3 → 2 sets${until("light")}`
}

type InjuriesState = {
  injuries: Injury[]
  save: (next: Injury[]) => void
  add: (area: InjuryArea, option?: InjuryOption) => void
  remove: (area: InjuryArea) => void
}

/** Session-scoped mock until injuries are stored on the server. */
export const useInjuries = create<InjuriesState>((set) => ({
  injuries: [],
  save: (injuries) => set({ injuries }),
  add: (area, option) =>
    set((state) =>
      state.injuries.some((injury) => injury.area === area)
        ? state
        : { injuries: [...state.injuries, createInjury(area, option)] },
    ),
  remove: (area) =>
    set((state) => ({ injuries: state.injuries.filter((injury) => injury.area !== area) })),
}))

export function useActiveInjuries(today?: string) {
  const now = dateKey(usePlanNow())
  const injuries = useInjuries((state) => state.injuries)
  return injuries.filter((injury) => isActive(injury, today ?? now))
}
