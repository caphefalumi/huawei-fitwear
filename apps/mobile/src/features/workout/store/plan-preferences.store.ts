import { create } from "zustand"

import { useHealth, type Sex } from "@/features/health"
import { useInjuries } from "@/features/recovery"
import { usePlanNow } from "@/lib/time/demo-clock"

import { routinesFor, type Emphasis, type Experience, type PlanInput } from "../utils/routines"

export const SESSION_MINUTES = [30, 45, 60, 90]
export const EMPHASES: readonly Emphasis[] = ["Balanced", "Lower body"]
export const EXPERIENCES: readonly Experience[] = ["Beginner", "Regular"]

/** The user's emphasis, or lower body by default for women. */
export const emphasisFor = (chosen: Emphasis | null, sex: Sex | null): Emphasis =>
  chosen ?? (sex === "Female" ? "Lower body" : "Balanced")

type Snapshot = { likes: string[]; dislikes: string[] }
type PlanPreferencesState = Snapshot & {
  minutes: number
  /** Null until the user picks one, so the default can follow their sex. */
  emphasis: Emphasis | null
  experience: Experience
  hintDismissed: boolean
  setMinutes: (minutes: number) => void
  setEmphasis: (emphasis: Emphasis) => void
  setExperience: (experience: Experience) => void
  /** Like, or back to neutral when already liked. */
  toggleLike: (key: string) => void
  /** Dislike, or back to neutral when already disliked. */
  toggleDislike: (key: string) => void
  /** Clears likes and dislikes and returns them so the reset can be undone. */
  reset: () => Snapshot
  restore: (snapshot: Snapshot) => void
  dismissHint: () => void
}

const without = (keys: string[], key: string) => keys.filter((other) => other !== key)

/** Session-scoped mock until plan preferences are stored on the server. */
export const usePlanPreferences = create<PlanPreferencesState>((set, get) => ({
  minutes: 45,
  emphasis: null,
  experience: "Regular",
  likes: [],
  dislikes: [],
  hintDismissed: false,
  setMinutes: (minutes) => set({ minutes }),
  setEmphasis: (emphasis) => set({ emphasis }),
  setExperience: (experience) => set({ experience }),
  toggleLike: (key) =>
    set((state) => ({
      likes: state.likes.includes(key) ? without(state.likes, key) : [...state.likes, key],
      dislikes: without(state.dislikes, key),
    })),
  toggleDislike: (key) =>
    set((state) => ({
      dislikes: state.dislikes.includes(key)
        ? without(state.dislikes, key)
        : [...state.dislikes, key],
      likes: without(state.likes, key),
    })),
  reset: () => {
    const { likes, dislikes } = get()
    set({ likes: [], dislikes: [] })
    return { likes, dislikes }
  },
  restore: (snapshot) => set(snapshot),
  dismissHint: () => set({ hintDismissed: true }),
}))

/** The planner input from the user's current settings. */
export function usePlanInput(): PlanInput {
  const { plan, sex } = useHealth()
  const injuries = useInjuries((state) => state.injuries)
  const { minutes, likes, dislikes, emphasis, experience } = usePlanPreferences()
  return {
    sessions: plan.sessions,
    goal: plan.goal,
    minutes,
    injuries,
    likes,
    dislikes,
    emphasis: emphasisFor(emphasis, sex),
    experience,
  }
}

/** Today's and the next routine from the user's plan settings. */
export function useRoutines(date?: Date) {
  const now = usePlanNow()
  return routinesFor(usePlanInput(), date ?? now)
}
