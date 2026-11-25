/**
 * Phone ↔ watch workout sync, protocol v1.
 * Mirrors apps/watch/entry/src/main/ets/features/link/SyncProtocol.ets — change both together.
 */

export const PROTOCOL_VERSION = 1
const MAX_MESSAGE_CHARS = 16000
const MAX_EXERCISES = 30
const MAX_SETS = 20
/** Longest frame header, "~999.999.999~". */
const HEADER_CHARS = 13

export type PlanExercise = {
  key: string
  name: string
  sets: number
  /** Target per set: reps, or seconds for timed holds. */
  reps: number
  unit: "reps" | "seconds"
  /** Rest after each set, in seconds. */
  rest: number
  /** Adjacent exercises with the same non-empty value are a superset. */
  superset: string
}

export type WirePlan = { name: string; minutes: number; exercises: PlanExercise[] }

export type SharedSession = {
  id: string
  /** Raised on every change; the higher one wins a merge. */
  rev: number
  /** Name of the plan being trained. */
  plan: string
  /** `done` is finished but not yet saved; `closed` is saved or discarded. */
  status: "active" | "done" | "closed"
  /** Start time, ms since the epoch. */
  at: number
  /** Finish time, ms since the epoch; 0 while active. */
  end: number
  /** Index into the set-by-set order of the plan. */
  pos: number
  /** Rest left in ms; 0 when not resting. */
  rest: number
  /** One [exercise, set, reps] per finished set. */
  log: [exercise: number, set: number, reps: number][]
  /** Indices of skipped exercises. */
  skip: number[]
}

export type SyncMessage =
  | { t: "hello"; v: number; phone: string }
  | { t: "welcome"; v: number; ok: boolean }
  | { t: "plan"; plan: WirePlan }
  | { t: "session"; session: SharedSession }

/** Splits a message into ASCII frames of at most `maxBytes`. */
export function encodeFrames(message: SyncMessage, maxBytes: number, id: number): string[] {
  const json = JSON.stringify(message).replace(
    /[\u0080-￿]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
  )
  const size = Math.max(1, maxBytes - HEADER_CHARS)
  const total = Math.ceil(json.length / size)
  return Array.from(
    { length: total },
    (_, index) => `~${id % 1000}.${index}.${total}~${json.slice(index * size, (index + 1) * size)}`,
  )
}

/** Rebuilds messages from frames that arrive in order, as GATT delivers them. */
export class FrameAssembler {
  private id = -1
  private next = 0
  private text = ""

  /** Returns the whole message once its last frame arrives. Anything else is dropped. */
  push(frame: string): SyncMessage | undefined {
    const match = /^~(\d+)\.(\d+)\.(\d+)~/.exec(frame)
    if (!match) return undefined
    const [header, id, index, total] = [match[0], Number(match[1]), Number(match[2]), match[3]]
    if (index === 0) {
      this.id = id
      this.next = 0
      this.text = ""
    }
    if (id !== this.id || index !== this.next) {
      this.id = -1
      return undefined
    }
    this.text += frame.slice(header.length)
    this.next++
    if (this.text.length > MAX_MESSAGE_CHARS) {
      this.id = -1
      return undefined
    }
    if (this.next < Number(total)) return undefined
    this.id = -1
    return parseMessage(this.text)
  }
}

const isCount = (value: unknown, max: number) =>
  Number.isInteger(value) && (value as number) >= 0 && (value as number) <= max
const isText = (value: unknown, max: number): value is string =>
  typeof value === "string" && value.length <= max

function isSession(session: SharedSession | undefined) {
  return (
    !!session &&
    isText(session.id, 64) &&
    session.id !== "" &&
    isCount(session.rev, 1_000_000) &&
    isText(session.plan, 60) &&
    ["active", "done", "closed"].includes(session.status) &&
    Number.isFinite(session.at) &&
    Number.isFinite(session.end) &&
    isCount(session.pos, MAX_EXERCISES * MAX_SETS) &&
    isCount(session.rest, 3_600_000) &&
    Array.isArray(session.log) &&
    session.log.length <= MAX_EXERCISES * MAX_SETS &&
    session.log.every(
      (entry) =>
        Array.isArray(entry) &&
        entry.length === 3 &&
        isCount(entry[0], MAX_EXERCISES) &&
        isCount(entry[1], MAX_SETS) &&
        isCount(entry[2], 10000),
    ) &&
    Array.isArray(session.skip) &&
    session.skip.length <= MAX_EXERCISES &&
    session.skip.every((index) => isCount(index, MAX_EXERCISES))
  )
}

/** Input from the radio is untrusted: anything malformed is ignored. */
export function parseMessage(json: string): SyncMessage | undefined {
  let message: SyncMessage
  try {
    message = JSON.parse(json) as SyncMessage
  } catch {
    return undefined
  }
  if (message?.t === "welcome") return typeof message.ok === "boolean" ? message : undefined
  if (message?.t === "session") return isSession(message.session) ? message : undefined
  // The phone only ever receives the two messages above.
  return undefined
}

const sameContent = (a: SharedSession, b: SharedSession) =>
  a.id === b.id &&
  a.rev === b.rev &&
  a.status === b.status &&
  a.pos === b.pos &&
  a.log.length === b.log.length &&
  a.skip.length === b.skip.length

/** Finished sets are never lost: the loser's extra sets are added to the winner's. */
const unionLog = (winner: SharedSession["log"], loser: SharedSession["log"]) =>
  winner.concat(
    loser.filter((entry) => !winner.some((kept) => kept[0] === entry[0] && kept[1] === entry[1])),
  )

export function mergeSessions(
  local: SharedSession | null,
  remote: SharedSession,
  remoteWinsTie: boolean,
): { session: SharedSession; changed: boolean; reply: boolean } {
  if (!local || local.id !== remote.id) {
    const adopt =
      remote.status !== "closed" && (!local || local.status === "closed" || remote.at > local.at)
    return {
      session: adopt || !local ? remote : local,
      changed: adopt,
      reply: !adopt && local !== null,
    }
  }
  const remoteWins = remote.rev > local.rev || (remote.rev === local.rev && remoteWinsTie)
  const winner = remoteWins ? remote : local
  const loser = remoteWins ? local : remote
  const log = unionLog(winner.log, loser.log)
  const closed = local.status === "closed" || remote.status === "closed"
  const status = closed ? "closed" : winner.status
  const amended = log.length !== winner.log.length || status !== winner.status
  const session: SharedSession = {
    ...winner,
    rev: amended ? Math.max(local.rev, remote.rev) + 1 : winner.rev,
    status,
    log,
  }
  return {
    session,
    changed: !sameContent(session, local),
    reply: !sameContent(session, remote),
  }
}
