import { File, Paths } from "expo-file-system"
import { useEffect } from "react"
import { Platform } from "react-native"
import { create } from "zustand"

import { useAuth } from "@/features/auth"
import { useHealth, type Sex } from "@/features/health"
import { useInjuries } from "@/features/recovery"
import { usePlanNow } from "@/lib/time/demo-clock"

import {
  routinesFor,
  type Emphasis,
  type Experience,
  type PlanInput,
  type Routine,
} from "../utils/routines"

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
  /** Reps kept from finished workouts, by `repTargetKey`. */
  repTargets: Record<string, number>
  hintDismissed: boolean
  routineOwner: string | null
  customRoutines: Record<string, Routine>
  routineStorageError: string | null
  loadRoutines: (owner: string | null) => void
  saveRoutine: (owner: string, routine: Routine) => void
  resetRoutine: (owner: string, name: string) => void
  setMinutes: (minutes: number) => void
  setEmphasis: (emphasis: Emphasis) => void
  setExperience: (experience: Experience) => void
  saveRepTargets: (targets: Record<string, number>) => void
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
const storageKey = (owner: string) => `workout-routines-${encodeURIComponent(owner)}.json`
const readRoutines = (owner: string): Record<string, Routine> => {
  const key = storageKey(owner)
  const text =
    Platform.OS === "web"
      ? globalThis.localStorage?.getItem(key)
      : (() => {
          const file = new File(Paths.document, key)
          return file.exists ? file.textSync() : null
        })()
  if (!text) return {}
  const data: unknown = JSON.parse(text)
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    Object.entries(data).some(([name, value]) => {
      if (!value || typeof value !== "object") return true
      const routine = value as Partial<Routine>
      return (
        routine.name !== name ||
        !Array.isArray(routine.exercises) ||
        !routine.exercises.length ||
        routine.exercises.some(
          (item) =>
            !item ||
            typeof item.key !== "string" ||
            typeof item.name !== "string" ||
            !Number.isInteger(item.sets) ||
            item.sets < 1 ||
            item.sets > 20 ||
            !Number.isFinite(item.reps) ||
            item.reps < 1 ||
            item.reps > 999 ||
            !Number.isFinite(item.rest) ||
            item.rest < 0 ||
            item.rest > 600 ||
            (item.unit !== "reps" && item.unit !== "seconds"),
        )
      )
    })
  )
    throw new Error("Invalid saved routines")
  return data as Record<string, Routine>
}
const writeRoutines = (owner: string, routines: Record<string, Routine>) => {
  const key = storageKey(owner)
  const data = JSON.stringify(routines)
  if (Platform.OS === "web") {
    if (!globalThis.localStorage) throw new Error("Storage is unavailable")
    globalThis.localStorage.setItem(key, data)
  } else {
    const saved = new File(Paths.document, key)
    const temporary = new File(Paths.document, `${key}.part`)
    try {
      temporary.create({ overwrite: true })
      temporary.writeSync(data)
      temporary.moveSync(saved, { overwrite: true })
    } finally {
      if (temporary.uri !== saved.uri && temporary.exists) temporary.delete()
    }
  }
}

/** Planner settings and locally persisted, account-scoped routine edits. */
export const usePlanPreferences = create<PlanPreferencesState>((set, get) => ({
  minutes: 45,
  emphasis: null,
  experience: "Regular",
  repTargets: {},
  likes: [],
  dislikes: [],
  hintDismissed: false,
  routineOwner: null,
  customRoutines: {},
  routineStorageError: null,
  loadRoutines: (owner) => {
    if (get().routineOwner === owner && !get().routineStorageError) return
    if (!owner) return set({ routineOwner: null, customRoutines: {}, routineStorageError: null })
    try {
      set({ routineOwner: owner, customRoutines: readRoutines(owner), routineStorageError: null })
    } catch {
      set({
        routineOwner: owner,
        customRoutines: {},
        routineStorageError: "Could not load saved routines.",
      })
    }
  },
  saveRoutine: (owner, routine) => {
    if (get().routineOwner !== owner || get().routineStorageError)
      throw new Error("Routines are not loaded.")
    const customRoutines = { ...get().customRoutines, [routine.name]: routine }
    writeRoutines(owner, customRoutines)
    set({ customRoutines })
  },
  resetRoutine: (owner, name) => {
    if (get().routineOwner !== owner || get().routineStorageError)
      throw new Error("Routines are not loaded.")
    const customRoutines = { ...get().customRoutines }
    delete customRoutines[name]
    writeRoutines(owner, customRoutines)
    set({ customRoutines })
  },
  setMinutes: (minutes) => set({ minutes }),
  setEmphasis: (emphasis) => set({ emphasis }),
  setExperience: (experience) => set({ experience }),
  saveRepTargets: (targets) =>
    set((state) => ({ repTargets: { ...state.repTargets, ...targets } })),
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
  const { user } = useAuth()
  const owner = user?.id ?? null
  const { routineOwner, customRoutines, loadRoutines } = usePlanPreferences()
  useEffect(() => {
    loadRoutines(owner)
  }, [owner, loadRoutines])
  const injuries = useInjuries((state) => state.injuries)
  const { minutes, likes, dislikes, emphasis, experience, repTargets } = usePlanPreferences()
  return {
    sessions: plan.sessions,
    goal: plan.goal,
    minutes,
    injuries,
    likes,
    dislikes,
    emphasis: emphasisFor(emphasis, sex),
    experience,
    repTargets,
    customRoutines: owner && routineOwner === owner ? customRoutines : undefined,
  }
}

/** Today's and the next routine from the user's plan settings. */
export function useRoutines(date?: Date) {
  const now = usePlanNow()
  return routinesFor(usePlanInput(), date ?? now)
}
