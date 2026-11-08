import { create } from "zustand"

import { dateKey } from "@/features/health"

export type Joint = "shoulder" | "elbow" | "wrist" | "lumbar spine" | "hip" | "knee" | "ankle"

export const PERIOD_AREA = "In period"
/** Areas map 1:1 to exercise joint tags; the planner treats left and right the same. */
export const AREA_JOINTS = {
  Shoulder: "shoulder",
  Elbow: "elbow",
  Wrist: "wrist",
  "Lower back": "lumbar spine",
  Hip: "hip",
  Knee: "knee",
  Ankle: "ankle",
} as const satisfies Record<string, Joint>
export type InjuryArea = keyof typeof AREA_JOINTS | typeof PERIOD_AREA
export const INJURY_AREAS = [...Object.keys(AREA_JOINTS), PERIOD_AREA] as InjuryArea[]

export type InjuryMode = "light" | "exclude"
/** `endDate` is the last adjusted day, inclusive; `null` means permanent. */
export type Injury = {
  area: InjuryArea
  mode: InjuryMode
  startDate: string
  endDate: string | null
}

export const PERIOD_REST_DAYS = 4
export const PERIOD_LIGHT_DAYS = 3
const DEFAULT_DAYS = 7

export function addDays(key: string, days: number) {
  const date = new Date(`${key}T12:00:00`)
  date.setDate(date.getDate() + days)
  return dateKey(date)
}

export function daysBetween(from: string, to: string) {
  const start = new Date(`${from}T12:00:00`).getTime()
  return Math.round((new Date(`${to}T12:00:00`).getTime() - start) / 86400000)
}

export function createInjury(area: InjuryArea, today = dateKey()): Injury {
  const days = area === PERIOD_AREA ? PERIOD_REST_DAYS + PERIOD_LIGHT_DAYS : DEFAULT_DAYS
  return { area, mode: "light", startDate: today, endDate: addDays(today, days - 1) }
}

export const isActive = (injury: Injury, today = dateKey()) =>
  injury.startDate <= today && (injury.endDate === null || today <= injury.endDate)

/** Period recovery rests for the first days, then trains light. */
export function periodPhase(injury: Injury, today = dateKey()): "rest" | "light" | null {
  if (injury.area !== PERIOD_AREA || !isActive(injury, today)) return null
  return daysBetween(injury.startDate, today) < PERIOD_REST_DAYS ? "rest" : "light"
}

export function injuryTitle(injuries: Injury[]) {
  if (injuries.length !== 1) return `${injuries.length} injuries`
  return injuries[0].area === PERIOD_AREA ? "Period recovery" : `${injuries[0].area} recovery`
}

/** What changes in the user's plan, in their words. */
export function injuryEffect(injury: Injury) {
  if (injury.area === PERIOD_AREA)
    return `Rest ${PERIOD_REST_DAYS} days, then light ${PERIOD_LIGHT_DAYS} days`
  return injury.mode === "light"
    ? `${injury.area} exercises: 3 → 2 sets`
    : `${injury.area} exercises are removed from your plan`
}

type InjuriesState = {
  injuries: Injury[]
  save: (next: Injury[]) => void
  add: (area: InjuryArea) => void
  remove: (area: InjuryArea) => void
}

/** Session-scoped mock until injuries are stored on the server. */
export const useInjuries = create<InjuriesState>((set) => ({
  injuries: [],
  save: (injuries) => set({ injuries }),
  add: (area) =>
    set((state) =>
      state.injuries.some((injury) => injury.area === area)
        ? state
        : { injuries: [...state.injuries, createInjury(area)] },
    ),
  remove: (area) =>
    set((state) => ({ injuries: state.injuries.filter((injury) => injury.area !== area) })),
}))

export function useActiveInjuries(today = dateKey()) {
  const injuries = useInjuries((state) => state.injuries)
  return injuries.filter((injury) => isActive(injury, today))
}
