/**
 * Phone ↔ watch workout sync, protocol v1.
 * Mirrors apps/watch/entry/src/main/ets/features/link/SyncProtocol.ets — change both together.
 */

/** Carried by hello. Every watch app has required exactly 1, so it stays 1. */
export const PROTOCOL_VERSION = 1
/** The welcome version from which the watch reads compact plans and names the plan it holds. */
export const COMPACT_PLAN_VERSION = 2
/**
 * The version from which an app acks every plan, session, day and food message, and the watch
 * keeps its favorites when a day leaves them out. Both apps announce theirs: the watch in its
 * welcome, the phone as `app` in its hello.
 */
export const ACK_VERSION = 3
/** The version from which an app reads every message but the handshake as a row; see `toRow`. */
export const ROW_VERSION = 4
/** What this phone app does, sent as `app` in the hello. */
export const PHONE_VERSION = 4
const MAX_MESSAGE_CHARS = 16000
const MAX_EXERCISES = 30
const MAX_SETS = 20
export const MAX_FOOD_LOGS = 20
export const MAX_FAVORITES = 5
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

/** One exercise as a row instead of named fields; `unit` is 1 for seconds, 0 for reps. */
export type CompactExercise = [
  key: string,
  name: string,
  sets: number,
  reps: number,
  unit: 0 | 1,
  rest: number,
  superset: string,
]

/** A plan about half the size of a WirePlan, for watches from COMPACT_PLAN_VERSION on. */
export type CompactPlan = { name: string; minutes: number; x: CompactExercise[] }

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

/**
 * The set on the watch's screen while it is counted, sent on every change.
 * Watch to phone only, and never merged into the session: it is gone once the set is done.
 */
export type LiveReps = {
  /** The session the set belongs to. */
  id: string
  /** The set's position in the set-by-set order. */
  pos: number
  /** Reps so far, or seconds for timed holds. */
  reps: number
  /** Counted from the wrist, not with the watch's buttons. */
  auto: boolean
}

export type WireMacros = { protein: number; carbs: number; fat: number }

/** A recent meal the watch can log again. `ref` is that meal's ID. */
export type WireFavorite = WireMacros & { ref: string; name: string; kcal: number }

/** Today's nutrition, as the watch shows it. */
export type WireDay = {
  /** Local date, YYYY-MM-DD. */
  date: string
  /** Whose data this is, so one account's quick logs never reach another. */
  owner: string
  /** 0 until the profile is complete enough to have targets. */
  kcalTarget: number
  target: WireMacros
  kcalEaten: number
  eaten: WireMacros
  favorites: WireFavorite[]
  /** IDs of watch quick logs that these totals already include, or that were dropped. */
  applied: string[]
}

/** A favorite logged on the watch. The phone copies the meal `ref` points to. */
export type WireFoodLog = { id: string; ref: string; owner: string; at: number }

export type SyncMessage =
  /** `name` is what the watch calls this phone; older apps leave it out. */
  | { t: "hello"; v: number; phone: string; name?: string; app?: number }
  /** `v` says what the watch reads. `key` names the plan it holds; older watch apps leave it out. */
  | { t: "welcome"; v: number; ok: boolean; key?: string }
  /** `key` is the plan's ID from `planKey`, which the watch names in its next welcome. */
  | { t: "plan"; plan: WirePlan | CompactPlan; key?: string }
  | { t: "session"; session: SharedSession }
  /** Older watch apps never send it; older phone apps ignore it. */
  | { t: "reps"; live: LiveReps }
  /** From ACK_VERSION on, favorites are left out while they are unchanged. */
  | { t: "day"; day: WireDay | Omit<WireDay, "favorites"> }
  | { t: "food"; logs: WireFoodLog[] }
  /** The message with this frame ID arrived and was valid. Only between apps from ACK_VERSION. */
  | { t: "ack"; id: number }

export function compactPlan(plan: WirePlan): CompactPlan {
  return {
    name: plan.name,
    minutes: plan.minutes,
    x: plan.exercises.map((item) => [
      item.key,
      item.name,
      item.sets,
      item.reps,
      item.unit === "seconds" ? 1 : 0,
      item.rest,
      item.superset,
    ]),
  }
}

/** A short ID for a plan's content: an FNV-1a hash and the length of its JSON. */
export function planKey(plan: WirePlan): string {
  const json = JSON.stringify(plan)
  let hash = 0x811c9dc5
  for (let index = 0; index < json.length; index++) {
    hash = Math.imul(hash ^ json.charCodeAt(index), 0x01000193)
  }
  return `${(hash >>> 0).toString(16).padStart(8, "0")}${json.length.toString(36)}`
}

/** Splits a message into ASCII frames of at most `maxBytes`. */
const STATUSES = ["active", "done", "closed"] as const

const macroRow = (macros: WireMacros) => [macros.protein, macros.carbs, macros.fat]

/**
 * The message as a JSON array whose first element names it, about half the size of named
 * fields. Null for hello and welcome, which stay named because every app version reads them.
 *
 * - plan: ["p", key, name, minutes, exercises as in CompactPlan.x]
 * - session: ["s", id, rev, plan, status (0 active, 1 done, 2 closed), at, end, pos, rest,
 *   log as flat [exercise, set, reps, ...], skip]
 * - reps: ["r", id, pos, reps, auto (1 or 0)]
 * - day: ["d", date, owner, kcalTarget, [protein, carbs, fat], kcalEaten, [protein, carbs, fat],
 *   applied, favorites as [ref, name, kcal, protein, carbs, fat] rows, left out when unchanged]
 * - food: ["f", logs as [id, ref, owner, at] rows]
 * - ack: ["a", id]
 */
export function toRow(message: SyncMessage): unknown[] | null {
  switch (message.t) {
    case "plan": {
      const plan = "x" in message.plan ? message.plan : compactPlan(message.plan)
      return ["p", message.key ?? "", plan.name, plan.minutes, plan.x]
    }
    case "session": {
      const session = message.session
      return [
        "s",
        session.id,
        session.rev,
        session.plan,
        STATUSES.indexOf(session.status),
        session.at,
        session.end,
        session.pos,
        session.rest,
        session.log.flat(),
        session.skip,
      ]
    }
    case "reps": {
      const live = message.live
      return ["r", live.id, live.pos, live.reps, live.auto ? 1 : 0]
    }
    case "day": {
      const day = message.day
      const row = [
        "d",
        day.date,
        day.owner,
        day.kcalTarget,
        macroRow(day.target),
        day.kcalEaten,
        macroRow(day.eaten),
        day.applied,
      ]
      if (!("favorites" in day)) return row
      const favorites = day.favorites.map((food) => [
        food.ref,
        food.name,
        food.kcal,
        food.protein,
        food.carbs,
        food.fat,
      ])
      return [...row, favorites]
    }
    case "food":
      return ["f", message.logs.map((log) => [log.id, log.ref, log.owner, log.at])]
    case "ack":
      return ["a", message.id]
    default:
      return null
  }
}

/** Every 3 entries of a flat log as one [exercise, set, reps]; null if it does not split. */
function triples(flat: unknown) {
  if (!Array.isArray(flat) || flat.length % 3 !== 0) return null
  return Array.from({ length: flat.length / 3 }, (_, index) => flat.slice(index * 3, index * 3 + 3))
}

/** The named message for a row the phone receives; the usual checks then apply to it. */
function fromRow(row: unknown[]): unknown {
  switch (row[0]) {
    case "s": {
      const [, id, rev, plan, status, at, end, pos, rest, log, skip] = row
      const session = { id, rev, plan, at, end, pos, rest, log: triples(log), skip }
      return { t: "session", session: { ...session, status: STATUSES[status as 0 | 1 | 2] } }
    }
    case "r": {
      const [, id, pos, reps, auto] = row
      return {
        t: "reps",
        live: { id, pos, reps, auto: auto === 1 ? true : auto === 0 ? false : auto },
      }
    }
    case "f": {
      const logs = row[1]
      return {
        t: "food",
        logs: Array.isArray(logs)
          ? logs.map((log) =>
              Array.isArray(log) ? { id: log[0], ref: log[1], owner: log[2], at: log[3] } : log,
            )
          : logs,
      }
    }
    case "a":
      return { t: "ack", id: row[1] }
    default:
      return undefined
  }
}

/** Splits a message into ASCII frames of at most `maxBytes`, as a row when `rows` is set. */
export function encodeFrames(
  message: SyncMessage,
  maxBytes: number,
  id: number,
  rows = false,
): string[] {
  const json = JSON.stringify((rows && toRow(message)) || message).replace(
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
  /** Frame ID of the last message completed, so it can be acked. */
  lastId = -1
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
    this.lastId = this.id
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

const isLive = (live: LiveReps | undefined) =>
  !!live &&
  isText(live.id, 64) &&
  live.id !== "" &&
  isCount(live.pos, MAX_EXERCISES * MAX_SETS) &&
  isCount(live.reps, 10000) &&
  typeof live.auto === "boolean"

const isFoodLog = (log: WireFoodLog | undefined) =>
  !!log &&
  isText(log.id, 64) &&
  log.id !== "" &&
  isText(log.ref, 64) &&
  log.ref !== "" &&
  isText(log.owner, 64) &&
  Number.isFinite(log.at) &&
  log.at > 0

/** Input from the radio is untrusted: anything malformed is ignored. */
export function parseMessage(json: string): SyncMessage | undefined {
  let message: SyncMessage
  try {
    const parsed: unknown = JSON.parse(json)
    message = (Array.isArray(parsed) ? fromRow(parsed) : parsed) as SyncMessage
  } catch {
    return undefined
  }
  if (message?.t === "welcome") {
    if (typeof message.ok !== "boolean") return undefined
    // A watch app from before versions in the welcome counts as 1, and an odd key as none.
    return {
      t: "welcome",
      v: isCount(message.v, 1000) && message.v > 0 ? message.v : 1,
      ok: message.ok,
      ...(isText(message.key, 16) && message.key ? { key: message.key } : {}),
    }
  }
  if (message?.t === "session") return isSession(message.session) ? message : undefined
  if (message?.t === "reps") return isLive(message.live) ? message : undefined
  if (message?.t === "ack") return isCount(message.id, 999) ? message : undefined
  if (message?.t === "food") {
    return Array.isArray(message.logs) &&
      message.logs.length <= MAX_FOOD_LOGS &&
      message.logs.every(isFoodLog)
      ? message
      : undefined
  }
  // The phone only ever receives the messages above.
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
