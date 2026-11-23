import { Q } from "@nozbe/watermelondb"

import type { RoutineExercise } from "../utils/routines"
import { database } from "./database"
import type { SessionDraftModel } from "./session-draft.model"

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

const drafts = () => database.get<SessionDraftModel>("session_drafts")

/** Read the current draft for a user, or null if none exists / it's invalid. */
export async function readSessionDraft(userId: string): Promise<SessionDraft | null> {
  try {
    const [record] = await drafts().query(Q.where("user_id", userId)).fetch()
    if (!record) return null
    const data: unknown = JSON.parse(record.payload)
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

/** Persist an in-progress session draft, replacing that user's previous one. */
export async function writeSessionDraft(draft: SessionDraft): Promise<void> {
  try {
    const payload = JSON.stringify(draft)
    await database.write(async () => {
      const [existing] = await drafts().query(Q.where("user_id", draft.userId)).fetch()
      if (existing) {
        await existing.update((record) => {
          record.payload = payload
        })
      } else {
        await drafts().create((record) => {
          record.userId = draft.userId
          record.payload = payload
        })
      }
    })
  } catch {
    // Non-fatal: session continues without persistence.
  }
}

/** Remove the draft (called when the session completes or the user starts fresh). */
export async function clearSessionDraft(userId: string): Promise<void> {
  try {
    await database.write(async () => {
      const records = await drafts().query(Q.where("user_id", userId)).fetch()
      for (const record of records) await record.destroyPermanently()
    })
  } catch {
    // Best-effort.
  }
}
