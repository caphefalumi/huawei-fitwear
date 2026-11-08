import { create } from "zustand"

import { useHealth } from "@/features/health"
import { useInjuries } from "@/features/recovery"

import { routinesFor } from "./routines"

export const SESSION_MINUTES = [30, 45, 60, 90]

type Snapshot = { likes: string[]; dislikes: string[] }
type PlanPreferencesState = Snapshot & {
  minutes: number
  hintDismissed: boolean
  setMinutes: (minutes: number) => void
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
  likes: [],
  dislikes: [],
  hintDismissed: false,
  setMinutes: (minutes) => set({ minutes }),
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

/** Today's and the next routine from the user's plan settings. */
export function useRoutines(date = new Date()) {
  const { plan } = useHealth()
  const injuries = useInjuries((state) => state.injuries)
  const { minutes, likes, dislikes } = usePlanPreferences()
  return routinesFor(
    { sessions: plan.sessions, goal: plan.goal, minutes, injuries, likes, dislikes },
    date,
  )
}
