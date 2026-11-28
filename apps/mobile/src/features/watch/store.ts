import { create } from "zustand"

import type { Routine } from "@/features/workout"

import { mergeSessions, type LiveReps, type SharedSession, type WirePlan } from "./protocol"

export type WatchStatus = "off" | "searching" | "connecting" | "approval" | "connected"

/** A rest end that differs by less than this is the same rest. */
const REST_TOLERANCE_MS = 1500

export type LocalSession = Omit<SharedSession, "rev" | "rest"> & {
  /** Wall-clock end of the current rest; 0 when not resting. */
  restEndsAt: number
}

type WatchState = {
  status: WatchStatus
  error: string | null
  /** The workout both devices are showing, if any. */
  session: SharedSession | null
  restEndsAt: number
  /** ID of the workout the watch last changed; empty if it has not touched one. */
  watchSessionId: string
  /** Counts changes that came from the watch, so screens know when to apply them. */
  remoteSeq: number
  /** Raised when something must be (re)sent to the watch. */
  outbox: number
  /** The routine of the current session, or today's routine when idle. */
  routine: Routine | null
  /** True while the workout screen is mounted. */
  sessionOpen: boolean
  /** The count of the set on the watch's screen; null when it is not connected. */
  live: LiveReps | null
  publish: (session: LocalSession, routine: Routine) => void
  close: (id: string) => void
  receive: (remote: SharedSession) => void
}

const closedIds = new Set<string>()

export const useWatchStore = create<WatchState>((set, get) => ({
  status: "off",
  error: null,
  session: null,
  restEndsAt: 0,
  watchSessionId: "",
  remoteSeq: 0,
  outbox: 0,
  routine: null,
  sessionOpen: false,
  live: null,

  publish: (local, routine) => {
    const { session, restEndsAt, outbox } = get()
    if (closedIds.has(local.id)) return
    const { restEndsAt: nextRestEndsAt, ...fields } = local
    const now = Date.now()
    if (session && session.id === local.id) {
      // A rest that has simply run out is not news: the watch times it too.
      const sameRest =
        Math.abs(Math.max(nextRestEndsAt, now) - Math.max(restEndsAt, now)) < REST_TOLERANCE_MS
      const same =
        sameRest &&
        session.status === local.status &&
        session.pos === local.pos &&
        session.log.length === local.log.length &&
        session.skip.length === local.skip.length
      if (same) return
    }
    set({
      session: {
        ...fields,
        rev: session && session.id === local.id ? session.rev + 1 : 1,
        rest: Math.min(3_600_000, Math.max(0, Math.round(nextRestEndsAt - now))),
      },
      restEndsAt: nextRestEndsAt,
      routine,
      outbox: outbox + 1,
    })
  },

  close: (id) => {
    closedIds.add(id)
    const { session, outbox } = get()
    if (session?.id !== id) return
    set({
      session: { ...session, status: "closed", rev: session.rev + 1, rest: 0 },
      restEndsAt: 0,
      outbox: outbox + 1,
    })
  },

  receive: (remote) => {
    const { session, remoteSeq, outbox } = get()
    // A workout already saved here must not come back to be saved again.
    if (closedIds.has(remote.id) && remote.status !== "closed") {
      set({
        session: { ...remote, status: "closed", rev: remote.rev + 1, rest: 0 },
        restEndsAt: 0,
        outbox: outbox + 1,
      })
      return
    }
    const result = mergeSessions(session, remote, false)
    set({
      ...(result.changed
        ? {
            session: result.session,
            restEndsAt: result.session.rest ? Date.now() + result.session.rest : 0,
            watchSessionId: result.session.id,
            remoteSeq: remoteSeq + 1,
          }
        : null),
      ...(result.reply ? { outbox: outbox + 1 } : null),
    })
  },
}))

export function resetWatchSession() {
  closedIds.clear()
  useWatchStore.setState({
    session: null,
    restEndsAt: 0,
    routine: null,
    sessionOpen: false,
    watchSessionId: "",
    live: null,
  })
}

export function toWirePlan(routine: Routine): WirePlan {
  return {
    name: routine.name.slice(0, 60),
    minutes: Math.round(routine.minutes),
    exercises: routine.exercises.map((item) => ({
      key: item.key,
      name: item.name.slice(0, 60),
      // Warm-up sets come first in the phone's set order, so the watch counts them as sets too.
      // Same rule as allSets() in workout/utils/warm-up.ts; importing it would make a cycle.
      sets: item.sets + (item.unit === "reps" ? Math.min(3, Math.max(0, item.warmUpSets ?? 0)) : 0),
      reps: item.reps,
      unit: item.unit,
      rest: Math.round(item.rest),
      // Supersets were removed from the app; the watch protocol still carries the field.
      superset: "",
    })),
  }
}
