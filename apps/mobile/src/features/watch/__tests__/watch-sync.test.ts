import type { Routine } from "@/features/workout"

import { encodeFrames, FrameAssembler, mergeSessions, type SharedSession } from "../protocol"
import { resetWatchSession, toWirePlan, useWatchStore } from "../store"

/** The same frame is asserted by the watch's protocol test. */
const FIXTURE_FRAME = '~7.0.1~{"t":"welcome","v":1,"ok":true}'

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
