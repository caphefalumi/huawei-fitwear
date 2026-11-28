import type { Routine } from "@/features/workout"

import {
  compactPlan,
  encodeFrames,
  FrameAssembler,
  mergeSessions,
  parseMessage,
  planKey,
  type SharedSession,
  type SyncMessage,
  type WireDay,
} from "../protocol"
import { resetWatchSession, toWirePlan, useWatchStore } from "../store"

/** The same frame is asserted by the watch's protocol test. */
const FIXTURE_FRAME = '~7.0.1~{"t":"welcome","v":1,"ok":true}'
/** Rows written and read the same way by the watch's protocol test. */
const ROW_PLAN_FRAME = '~8.0.1~["p","k1","Push",10,[["bench-press","Bench press",2,8,0,60,""]]]'
const ROW_SESSION_FRAME = '~9.0.1~["s","one",2,"Push",0,1000,0,1,0,[0,0,8],[]]'
const ROW_DAY_FRAME =
  '~10.0.1~["d","2026-03-02","u1",2000,[100,200,60],100,[1,2,3],["a"],[["m1","Rice",500,10,20,5]]]'
const ROW_FOOD_FRAME = '~11.0.1~["f",[["log-1","m1","u1",1000]]]'
const ROW_REPS_FRAME = '~12.0.1~["r","one",1,4,1]'
const ROW_ACK_FRAME = '~13.0.1~["a",42]'
/** The watch's protocol test reads this frame back into the named plan. */
const COMPACT_PLAN_FRAME =
  '~8.0.1~{"t":"plan","plan":{"name":"Push","minutes":10,"x":[["bench-press","Bench press",2,8,0,60,""]]},"key":"k1"}'

const session: SharedSession = {
  id: "one",
  rev: 1,
  plan: "Push",
  status: "active",
  at: 1000,
  end: 0,
  pos: 0,
  rest: 0,
  log: [],
  skip: [],
}

const routine: Routine = {
  name: "Push",
  sets: 2,
  minutes: 10,
  exercises: [
    {
      key: "bench-press",
      name: "Bench press",
      prescription: "2x8",
      sets: 2,
      reps: 8,
      unit: "reps",
      rest: 60,
    },
  ],
}

beforeEach(() => {
  resetWatchSession()
  useWatchStore.setState({ remoteSeq: 0, outbox: 0 })
})

test("reads the shared fixture and ignores junk", () => {
  expect(new FrameAssembler().push(FIXTURE_FRAME)).toEqual({ t: "welcome", v: 1, ok: true })
  expect(new FrameAssembler().push('~1.0.1~{"t":"session"}')).toBeUndefined()
  expect(new FrameAssembler().push("VoocHealth Watch Ready")).toBeUndefined()
  expect(new FrameAssembler().push("~1.1.2~tail")).toBeUndefined()
})

test("writes a compact plan exactly as the watch's test reads it", () => {
  const plan = compactPlan(toWirePlan(routine))
  expect(encodeFrames({ t: "plan", plan, key: "k1" }, 180, 8)).toEqual([COMPACT_PLAN_FRAME])
})

test("reads what the watch reads and which plan it holds from its welcome", () => {
  expect(parseMessage('{"t":"welcome","v":2,"ok":true,"key":"abc"}')).toEqual({
    t: "welcome",
    v: 2,
    ok: true,
    key: "abc",
  })
  // Older watch apps send no key; a malformed one counts as no plan held.
  expect(parseMessage('{"t":"welcome","ok":true,"key":7}')).toEqual({
    t: "welcome",
    v: 1,
    ok: true,
  })
  expect(parseMessage('{"t":"welcome","v":2,"ok":true,"key":""}')).toEqual({
    t: "welcome",
    v: 2,
    ok: true,
  })
})

test("gives a plan a short key that changes with its content", () => {
  const plan = toWirePlan(routine)
  const key = planKey(plan)
  expect(key.length).toBeLessThanOrEqual(16)
  expect(planKey(toWirePlan(routine))).toBe(key)
  expect(planKey({ ...plan, exercises: [{ ...plan.exercises[0]!, reps: 9 }] })).not.toBe(key)
})

test("splits a long message into small ASCII frames and rebuilds it", () => {
  const sent = { ...session, plan: "Đẩy ngực" }
  const frames = encodeFrames({ t: "session", session: sent }, 20, 3)
  expect(frames.every((frame) => /^[\x20-\x7e]{1,20}$/.test(frame))).toBe(true)
  const assembler = new FrameAssembler()
  const results = frames.map((frame) => assembler.push(frame))
  expect(results.at(-1)).toEqual({ t: "session", session: sent })
})

test("never loses a finished set when both devices changed", () => {
  const mine: SharedSession = { ...session, rev: 2, pos: 1, log: [[0, 0, 8]] }
  const theirs: SharedSession = { ...session, rev: 3, pos: 2, log: [[0, 1, 6]] }
  const merged = mergeSessions(mine, theirs, false)
  expect(merged.session.pos).toBe(2)
  expect(merged.session.log).toHaveLength(2)
  expect(merged.reply).toBe(true)
  expect(mergeSessions(theirs, merged.session, true).reply).toBe(false)
})

test("publishing an unchanged workout sends nothing", () => {
  const publish = () =>
    useWatchStore.getState().publish(
      {
        id: "one",
        plan: "Push",
        status: "active",
        at: 1000,
        end: 0,
        pos: 0,
        restEndsAt: 0,
        log: [],
        skip: [],
      },
      routine,
    )
  publish()
  publish()
  expect(useWatchStore.getState().outbox).toBe(1)
  expect(useWatchStore.getState().session?.rev).toBe(1)
})

test("a workout saved on the phone cannot be brought back by the watch", () => {
  useWatchStore.getState().receive(session)
  expect(useWatchStore.getState().remoteSeq).toBe(1)
  useWatchStore.getState().close("one")
  useWatchStore.getState().receive({ ...session, rev: 9, status: "done" })
  expect(useWatchStore.getState().session?.status).toBe("closed")
  expect(useWatchStore.getState().remoteSeq).toBe(1)
})

test("sends the watch only what it needs from a routine", () => {
  expect(toWirePlan(routine)).toEqual({
    name: "Push",
    minutes: 10,
    exercises: [
      {
        key: "bench-press",
        name: "Bench press",
        sets: 2,
        reps: 8,
        unit: "reps",
        rest: 60,
        superset: "",
      },
    ],
  })
})

test("reads the count of the set on the watch and drops a malformed one", () => {
  const live = { id: "one", pos: 2, reps: 7, auto: true }
  const [frame] = encodeFrames({ t: "reps", live }, 180, 4)
  expect(new FrameAssembler().push(frame!)).toEqual({ t: "reps", live })
  for (const bad of [
    { ...live, id: "" },
    { ...live, reps: -1 },
    { ...live, pos: 1.5 },
    { ...live, auto: "yes" },
  ]) {
    const [junk] = encodeFrames({ t: "reps", live: bad as never }, 180, 5)
    expect(new FrameAssembler().push(junk!)).toBeUndefined()
  }
})

const rowSession: SharedSession = {
  id: "one",
  rev: 2,
  plan: "Push",
  status: "active",
  at: 1000,
  end: 0,
  pos: 1,
  rest: 0,
  log: [[0, 0, 8]],
  skip: [],
}

test("writes rows exactly as the watch's test reads them", () => {
  const rows = (message: SyncMessage, id: number) => encodeFrames(message, 180, id, true)
  const day: WireDay = {
    date: "2026-03-02",
    owner: "u1",
    kcalTarget: 2000,
    target: { protein: 100, carbs: 200, fat: 60 },
    kcalEaten: 100,
    eaten: { protein: 1, carbs: 2, fat: 3 },
    favorites: [{ ref: "m1", name: "Rice", kcal: 500, protein: 10, carbs: 20, fat: 5 }],
    applied: ["a"],
  }
  const plan = compactPlan(toWirePlan(routine))
  expect(rows({ t: "plan", plan, key: "k1" }, 8)).toEqual([ROW_PLAN_FRAME])
  expect(rows({ t: "session", session: rowSession }, 9)).toEqual([ROW_SESSION_FRAME])
  expect(rows({ t: "day", day }, 10)).toEqual([ROW_DAY_FRAME])
  expect(rows({ t: "ack", id: 42 }, 13)).toEqual([ROW_ACK_FRAME])
  // The handshake stays named, so every app version can read it.
  expect(rows({ t: "welcome", v: 1, ok: true }, 7)).toEqual([FIXTURE_FRAME])
})

test("reads the rows the watch writes, and rejects broken ones", () => {
  const read = (frame: string) => new FrameAssembler().push(frame)
  expect(read(ROW_SESSION_FRAME)).toEqual({ t: "session", session: rowSession })
  expect(read(ROW_FOOD_FRAME)).toEqual({
    t: "food",
    logs: [{ id: "log-1", ref: "m1", owner: "u1", at: 1000 }],
  })
  expect(read(ROW_REPS_FRAME)).toEqual({
    t: "reps",
    live: { id: "one", pos: 1, reps: 4, auto: true },
  })
  expect(read(ROW_ACK_FRAME)).toEqual({ t: "ack", id: 42 })
  // A log that does not split into sets, an unknown status, an unknown type.
  expect(read('~1.0.1~["s","one",2,"Push",0,1000,0,1,0,[0,0],[]]')).toBeUndefined()
  expect(read('~1.0.1~["s","one",2,"Push",3,1000,0,1,0,[],[]]')).toBeUndefined()
  expect(read('~1.0.1~["x",1]')).toBeUndefined()
})

test("fits a starting session and a day's totals in one frame as rows", () => {
  const id = "3f2b8c1e-9a4d-4e7b-8c21-5d6f7a8b9c0d"
  const session: SharedSession = {
    ...rowSession,
    id,
    plan: "Full Body A",
    at: 1764320000000,
    pos: 0,
    log: [],
  }
  const totals: Omit<WireDay, "favorites"> = {
    date: "2026-11-28",
    owner: id,
    kcalTarget: 2200,
    target: { protein: 150, carbs: 240, fat: 70 },
    kcalEaten: 1240,
    eaten: { protein: 82, carbs: 130, fat: 41 },
    applied: [],
  }
  expect(encodeFrames({ t: "session", session }, 180, 1, true)).toHaveLength(1)
  expect(encodeFrames({ t: "day", day: totals }, 180, 1, true)).toHaveLength(1)
  expect(encodeFrames({ t: "session", session }, 180, 1)).toHaveLength(2)
})
