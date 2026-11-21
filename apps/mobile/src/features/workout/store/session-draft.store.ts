import { File, Paths } from "expo-file-system"
import { Platform } from "react-native"

import type { RoutineExercise } from "../utils/routines"

export type SessionDraft = {
  /** The user who owns this draft. */
  userId: string
  /** `YYYY-MM-DD` date key the session was started on. */
  date: string
  /** Name of the routine (e.g. "Full Body A"). */
  routineName: string
  /** Index into the flattened slots array — which set/exercise the user was on. */
  position: number
  /** Weights per exercise index (kg). */
  weights: number[]
  /** Logged sets per exercise, same shape as the in-session `logged` state. */
  logged: ({ reps: number; weightKg: number } | undefined)[][]
  /** In-progress rep/seconds counter for the current set. */
  reps?: number
  /** Exercise indices the user skipped. */
  skipped?: number[]
  /** Routine snapshot, so a draft left on another day can still be resumed. */
  exercises?: RoutineExercise[]
  /** unix ms the session was started. */
  startedAt: number
}

const storageKey = (userId: string) => `session-draft-${encodeURIComponent(userId)}.json`

/** Read the current draft for a user, or null if none exists / it's invalid. */
export function readSessionDraft(userId: string): SessionDraft | null {
  try {
    const key = storageKey(userId)
    const text =
      Platform.OS === "web"
        ? globalThis.localStorage?.getItem(key)
        : (() => {
            const file = new File(Paths.document, key)
            return file.exists ? file.textSync() : null
          })()
    if (!text) return null
    const data: unknown = JSON.parse(text)
    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data) ||
      typeof (data as SessionDraft).userId !== "string" ||
      typeof (data as SessionDraft).date !== "string" ||
      typeof (data as SessionDraft).routineName !== "string" ||
      typeof (data as SessionDraft).position !== "number" ||
      !Array.isArray((data as SessionDraft).weights) ||
      !Array.isArray((data as SessionDraft).logged) ||
      ((data as SessionDraft).reps !== undefined &&
        typeof (data as SessionDraft).reps !== "number") ||
      ((data as SessionDraft).skipped !== undefined &&
        !Array.isArray((data as SessionDraft).skipped)) ||
      ((data as SessionDraft).exercises !== undefined &&
        !Array.isArray((data as SessionDraft).exercises)) ||
      typeof (data as SessionDraft).startedAt !== "number"
    )
      return null
    const draft = data as SessionDraft
    // JSON stores empty slots as null; the session treats undefined as "not logged".
    return { ...draft, logged: draft.logged.map((sets) => sets.map((set) => set ?? undefined)) }
  } catch {
    return null
  }
}

/** Persist an in-progress session draft. */
export function writeSessionDraft(draft: SessionDraft): void {
  try {
    const key = storageKey(draft.userId)
    const data = JSON.stringify(draft)
    if (Platform.OS === "web") {
      globalThis.localStorage?.setItem(key, data)
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
  } catch {
    // Non-fatal: session continues without persistence.
  }
}

/** Remove the draft (called when the session completes or the user starts fresh). */
export function clearSessionDraft(userId: string): void {
  try {
    const key = storageKey(userId)
    if (Platform.OS === "web") {
      globalThis.localStorage?.removeItem(key)
    } else {
      const file = new File(Paths.document, key)
      if (file.exists) file.delete()
    }
  } catch {
    // Best-effort.
  }
}
