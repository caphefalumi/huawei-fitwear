import { captureException } from "@/lib/analytics/posthog"

import type { RoutineExercise } from "../utils/routines"
import { clearDraftPayload, readDraftPayload, writeDraftPayload } from "./database"

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
  /** Stable ID for retries of the completed-workout request. */
  saveId?: string
  /** Set when the draft has reached the summary but has not been saved. */
  finishedAt?: number
}

/** Read the current draft for a user, or null if none exists / it's invalid. */
export async function readSessionDraft(userId: string): Promise<SessionDraft | null> {
  let payload: string | null
  try {
    payload = await readDraftPayload(userId)
  } catch {
    captureException(new Error("Could not read the workout draft."))
    return null
  }
  if (payload === null) return null
  try {
    const data: unknown = JSON.parse(payload)
    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data) ||
      (data as SessionDraft).userId !== userId ||
      typeof (data as SessionDraft).date !== "string" ||
      typeof (data as SessionDraft).routineName !== "string" ||
      !Number.isSafeInteger((data as SessionDraft).position) ||
      (data as SessionDraft).position < 0 ||
      !Array.isArray((data as SessionDraft).weights) ||
      !Array.isArray((data as SessionDraft).logged) ||
      ((data as SessionDraft).reps !== undefined &&
        typeof (data as SessionDraft).reps !== "number") ||
      ((data as SessionDraft).skipped !== undefined &&
        !Array.isArray((data as SessionDraft).skipped)) ||
      ((data as SessionDraft).exercises !== undefined &&
        !Array.isArray((data as SessionDraft).exercises)) ||
      !Number.isFinite((data as SessionDraft).startedAt) ||
      ((data as SessionDraft).finishedAt !== undefined &&
        !Number.isFinite((data as SessionDraft).finishedAt)) ||
      ((data as SessionDraft).saveId !== undefined &&
        typeof (data as SessionDraft).saveId !== "string")
    )
      return null
    const draft = data as SessionDraft
    // JSON stores empty slots as null; the session treats undefined as "not logged".
    return { ...draft, logged: draft.logged.map((sets) => sets.map((set) => set ?? undefined)) }
  } catch {
    return null
  }
}

/** Persist an in-progress session draft, replacing that user's previous one. */
export async function writeSessionDraft(draft: SessionDraft): Promise<void> {
  try {
    await writeDraftPayload(draft.userId, JSON.stringify(draft))
  } catch {
    captureException(new Error("Could not save the workout draft."))
  }
}

/** Remove the draft (called when the session completes or the user starts fresh). */
export async function clearSessionDraft(userId: string): Promise<void> {
  try {
    await clearDraftPayload(userId)
  } catch {
    captureException(new Error("Could not clear the workout draft."))
  }
}
