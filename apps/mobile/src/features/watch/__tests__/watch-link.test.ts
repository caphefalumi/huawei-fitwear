import * as SecureStore from "expo-secure-store"

import type { WatchBleListener } from "@/features/ble"
import type { Routine } from "@/features/workout"

import { usePairing } from "../pairing.store"
import {
  compactPlan,
  encodeFrames,
  PHONE_VERSION,
  planKey,
  type SharedSession,
  type SyncMessage,
  type WireDay,
} from "../protocol"
import { resetWatchSession, toWirePlan, useWatchStore } from "../store"
import { reportSync } from "../telemetry"
import { WatchLink, type WatchNutrition } from "../watch-link"

const mockClient = {
  listener: undefined as unknown as WatchBleListener,
  connect: jest.fn(async () => {}),
  disconnect: jest.fn(async () => {}),
  destroy: jest.fn(),
  setForeground: jest.fn(),
  maxPayload: jest.fn(() => 180),
  sendFrame: jest.fn(async (_frame: string, _answered: boolean) => true),
}
jest.mock("@/features/ble", () => ({
  BLE_MAX_MESSAGE_BYTES: 180,
  WatchBleClient: jest.fn((listener: WatchBleListener) => {
    mockClient.listener = listener
    return mockClient
  }),
}))
jest.mock("../telemetry", () => ({
  ...jest.requireActual("../telemetry"),
  reportSync: jest.fn(),
}))
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(async () => {}),
  deleteItemAsync: jest.fn(async () => {}),
}))

beforeEach(() => {
  jest.useFakeTimers()
  jest.clearAllMocks()
  mockClient.sendFrame.mockImplementation(async () => true)
  resetWatchSession()
  usePairing.setState({ enabled: false })
})
afterEach(() => jest.useRealTimers())

test("remembers the watch only after a connection works, and reconnects after a drop", async () => {
  usePairing.getState().setEnabled(true)
  expect(SecureStore.setItemAsync).not.toHaveBeenCalled()

  const link = new WatchLink("phone-1")
  link.start()
  expect(mockClient.connect).toHaveBeenCalledTimes(1)
  mockClient.listener.onStatus("connected")
  for (const frame of encodeFrames({ t: "welcome", v: 1, ok: true }, 180, 1)) {
    mockClient.listener.onMessage("watch-to-phone", frame, frame.length)
  }
  expect(useWatchStore.getState().status).toBe("connected")
  expect(SecureStore.setItemAsync).toHaveBeenCalledWith("watch.enabled", "1")

  mockClient.listener.onStatus("disconnected")
  await jest.advanceTimersByTimeAsync(6000)
  expect(mockClient.connect).toHaveBeenCalledTimes(2)
  link.destroy()
})

test("a tick reconnects at once, for when timers are paused", () => {
  const link = new WatchLink("phone-1")
  link.start()
  mockClient.listener.onStatus("disconnected")

  link.tick()

  expect(mockClient.connect).toHaveBeenCalledTimes(2)
  link.destroy()
})

test("connects on its own next launch until the watch is forgotten", async () => {
  jest.mocked(SecureStore.getItemAsync).mockResolvedValueOnce("1")
  await usePairing.getState().load()
  expect(usePairing.getState().enabled).toBe(true)

  usePairing.getState().setEnabled(false)
  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("watch.enabled")
})

test("reconnects quickly after a drop, and keeps the watch's name until it is forgotten", async () => {
  usePairing.getState().setEnabled(true)
  const link = new WatchLink("phone-1", undefined, "Pixel 9")
  link.start()
  mockClient.listener.onDeviceName("HUAWEI WATCH 5")
  mockClient.listener.onStatus("connected")
  await jest.advanceTimersByTimeAsync(0)

  expect(usePairing.getState().name).toBe("HUAWEI WATCH 5")
  const sent = mockClient.sendFrame.mock.calls.map(([frame]) => frame).join("")
  expect(sent).toContain('"name":"Pixel 9"')

  mockClient.listener.onDeviceName("None")
  mockClient.listener.onStatus("disconnected")
  await jest.advanceTimersByTimeAsync(1000)
  expect(mockClient.connect).toHaveBeenCalledTimes(2)
  expect(usePairing.getState().name).toBe("HUAWEI WATCH 5")

  usePairing.getState().setEnabled(false)
  expect(usePairing.getState().name).toBe("")
  link.destroy()
})

test("keeps the watch's live count while connected and drops it with the link", async () => {
  const link = new WatchLink("phone-1")
  link.start()
  const deliver = (message: Parameters<typeof encodeFrames>[0], id: number) => {
    for (const frame of encodeFrames(message, 180, id)) {
      mockClient.listener.onMessage("watch-to-phone", frame, frame.length)
    }
  }
  const live = { id: "s1", pos: 0, reps: 4, auto: true }

  // Nothing is taken from a watch that has not been welcomed yet.
  mockClient.listener.onStatus("connected")
  deliver({ t: "reps", live }, 1)
  expect(useWatchStore.getState().live).toBeNull()

  deliver({ t: "welcome", v: 1, ok: true }, 2)
  deliver({ t: "reps", live }, 3)
  expect(useWatchStore.getState().live).toEqual(live)

  mockClient.listener.onStatus("disconnected")
  expect(useWatchStore.getState().live).toBeNull()
  link.destroy()
})

const routine: Routine = {
  name: "Full Body A",
  sets: 15,
  minutes: 45,
  exercises: ["barbell-squat", "machine-chest-press", "seated-cable-row", "romanian-deadlift"].map(
    (key) => ({
      key,
      name: key,
      prescription: "3 x 10",
      sets: 3,
      reps: 10,
      unit: "reps",
      rest: 90,
    }),
  ),
}

/** Connects and is welcomed, then hands the watch a plan long enough for several frames. */
async function sendPlan(welcome: { v: number; key?: string } = { v: 1 }) {
  const link = new WatchLink("phone-1")
  link.start()
  mockClient.listener.onStatus("connected")
  for (const frame of encodeFrames({ t: "welcome", ok: true, ...welcome }, 180, 1)) {
    mockClient.listener.onMessage("watch-to-phone", frame, frame.length)
  }
  useWatchStore.setState({ routine })
  await jest.advanceTimersByTimeAsync(0)
  return link
}

const header = (frame: string) => /^~(\d+)\.(\d+)\.(\d+)~/.exec(frame)!.slice(1).map(Number)

/** The messages the phone sent, rebuilt from their frames. */
function sentMessages() {
  const texts = new Map<number, string>()
  for (const [frame] of mockClient.sendFrame.mock.calls) {
    const [id, index] = header(frame)
    const body = frame.slice(frame.indexOf("~", 1) + 1)
    texts.set(id!, (index === 0 ? "" : texts.get(id!)) + body)
  }
  return [...texts.values()].map((text) => JSON.parse(text) as SyncMessage)
}

const sentPlans = () => sentMessages().filter((message) => message.t === "plan")

test("only the first frame of a message waits for the watch's answer", async () => {
  const link = await sendPlan()

  const plan = mockClient.sendFrame.mock.calls.filter(([frame]) => header(frame)[0] === 2)
  expect(plan.length).toBeGreaterThan(2)
  for (const [frame, answered] of mockClient.sendFrame.mock.calls) {
    expect(answered).toBe(header(frame)[1] === 0)
  }
  link.destroy()
})

test("resends in small answered frames when the watch rejects the big ones", async () => {
  // A watch that missed the larger MTU: big answered writes fail, unanswered ones vanish unseen.
  // The plan's last frame is short enough to pass, so it cannot be what proves the size.
  mockClient.sendFrame.mockImplementation(
    async (frame, answered) => !answered || frame.length <= 20,
  )
  const link = await sendPlan()

  const small = mockClient.sendFrame.mock.calls.filter(
    ([frame]) => header(frame)[0] === 2 && frame.length <= 20,
  )
  expect(small.every(([, answered]) => answered)).toBe(true)
  const text = small.map(([frame]) => frame.slice(frame.indexOf("~", 1) + 1)).join("")
  expect(JSON.parse(text)).toEqual({ t: "plan", plan: toWirePlan(routine) })
  link.destroy()
})

test("sends compact plans with their key only to watches that read them", async () => {
  const plan = toWirePlan(routine)
  let link = await sendPlan({ v: 2 })
  expect(sentPlans()).toEqual([{ t: "plan", plan: compactPlan(plan), key: planKey(plan) }])
  link.destroy()

  mockClient.sendFrame.mockClear()
  resetWatchSession()
  link = await sendPlan({ v: 1 })
  expect(sentPlans()).toEqual([{ t: "plan", plan }])
  link.destroy()
})

test("does not send again a plan the watch says it holds", async () => {
  const link = await sendPlan({ v: 2, key: planKey(toWirePlan(routine)) })
  expect(sentPlans()).toEqual([])

  useWatchStore.setState({ routine: { ...routine, name: "Full Body B" } })
  await jest.advanceTimersByTimeAsync(0)
  expect(sentPlans().map((message) => message.t === "plan" && message.plan.name)).toEqual([
    "Full Body B",
  ])
  link.destroy()
})

const session: SharedSession = {
  id: "s1",
  rev: 1,
  plan: routine.name,
  status: "active",
  at: 1000,
  end: 0,
  pos: 0,
  rest: 0,
  log: [],
  skip: [],
}

test("sends everything again when a send fails on a link that stays up", async () => {
  const link = await sendPlan({ v: 2 })
  mockClient.sendFrame.mockImplementation(async () => false)
  useWatchStore.setState({ session, outbox: useWatchStore.getState().outbox + 1 })
  await jest.advanceTimersByTimeAsync(0)

  mockClient.sendFrame.mockClear()
  mockClient.sendFrame.mockImplementation(async () => true)
  await jest.advanceTimersByTimeAsync(2000)

  expect(sentMessages().map((message) => message.t)).toEqual(["plan", "session"])
  link.destroy()
})

test("reads nutrition one at a time, so an older read is never the last one sent", async () => {
  const reads: ((day: WireDay) => void)[] = []
  const nutrition: WatchNutrition = {
    day: jest.fn(() => new Promise<WireDay>((resolve) => reads.push(resolve))),
    save: jest.fn(async () => {}),
  }
  const link = new WatchLink("phone-1", nutrition)
  link.start()
  mockClient.listener.onStatus("connected")
  for (const frame of encodeFrames({ t: "welcome", v: 2, ok: true }, 180, 1)) {
    mockClient.listener.onMessage("watch-to-phone", frame, frame.length)
  }
  void link.sendDay()
  void link.sendDay()
  expect(nutrition.day).toHaveBeenCalledTimes(1)

  reads[0]!({ kcalEaten: 100 } as WireDay)
  await jest.advanceTimersByTimeAsync(0)
  expect(nutrition.day).toHaveBeenCalledTimes(2)
  reads[1]!({ kcalEaten: 425 } as WireDay)
  await jest.advanceTimersByTimeAsync(0)

  const eaten = sentMessages().flatMap((message) =>
    message.t === "day" ? [message.day.kcalEaten] : [],
  )
  expect(eaten).toEqual([100, 425])
  link.destroy()
})

/** Connects and is welcomed by a watch of the given version. */
async function connected(welcome: { v: number }, nutrition?: WatchNutrition) {
  const link = new WatchLink("phone-1", nutrition)
  link.start()
  mockClient.listener.onStatus("connected")
  fromWatch({ t: "welcome", ok: true, ...welcome }, 1)
  await jest.advanceTimersByTimeAsync(0)
  return link
}

function fromWatch(message: SyncMessage, id: number) {
  for (const frame of encodeFrames(message, 180, id)) {
    mockClient.listener.onMessage("watch-to-phone", frame, frame.length)
  }
}

/** Frame IDs of the messages of type `t` the phone sent, oldest first. */
const idsOf = (t: string) =>
  mockClient.sendFrame.mock.calls
    .map(([frame]) => frame)
    .filter((frame) => frame.includes(`~{"t":"${t}"`))
    .map((frame) => header(frame)[0]!)

test("sends the current session again until a watch that acks confirms it", async () => {
  const link = await connected({ v: 3 })
  useWatchStore.setState({ session, outbox: useWatchStore.getState().outbox + 1 })
  await jest.advanceTimersByTimeAsync(0)
  expect(idsOf("session")).toHaveLength(1)

  // No ack: sent again after 2 s, then after 4 s more.
  await jest.advanceTimersByTimeAsync(2000)
  expect(idsOf("session")).toHaveLength(2)
  await jest.advanceTimersByTimeAsync(2000)
  expect(idsOf("session")).toHaveLength(2)
  await jest.advanceTimersByTimeAsync(2000)
  expect(idsOf("session")).toHaveLength(3)

  fromWatch({ t: "ack", id: idsOf("session").at(-1)! }, 9)
  await jest.advanceTimersByTimeAsync(60_000)
  expect(idsOf("session")).toHaveLength(3)
  link.destroy()
})

test("acks what a watch that acks sends, and says it acks in its hello", async () => {
  let link = await connected({ v: 3 })
  expect(sentMessages()[0]).toMatchObject({ t: "hello", v: 1, app: PHONE_VERSION })
  fromWatch({ t: "session", session }, 42)
  await jest.advanceTimersByTimeAsync(0)
  expect(sentMessages()).toContainEqual({ t: "ack", id: 42 })
  link.destroy()

  // An older watch would not know the message.
  mockClient.sendFrame.mockClear()
  resetWatchSession()
  link = await connected({ v: 2 })
  fromWatch({ t: "session", session: { ...session, id: "s2" } }, 43)
  await jest.advanceTimersByTimeAsync(0)
  expect(idsOf("ack")).toEqual([])
  link.destroy()
})

test("leaves unchanged favorites out of the day for a watch that keeps them", async () => {
  let eaten = 100
  const favorites = [{ ref: "m1", name: "Rice", kcal: 500, protein: 10, carbs: 20, fat: 5 }]
  const nutrition: WatchNutrition = {
    day: jest.fn(async () => ({ kcalEaten: eaten, favorites }) as unknown as WireDay),
    save: jest.fn(async () => {}),
  }
  const link = await connected({ v: 3 }, nutrition)
  eaten = 425
  await link.sendDay()
  await jest.advanceTimersByTimeAsync(0)

  const days = sentMessages().flatMap((message) => (message.t === "day" ? [message.day] : []))
  expect(days).toEqual([{ kcalEaten: 100, favorites }, { kcalEaten: 425 }])
  link.destroy()
})

test("reports how a welcomed link went once it ends", async () => {
  const link = await connected({ v: 3 })
  useWatchStore.setState({ session, outbox: useWatchStore.getState().outbox + 1 })
  await jest.advanceTimersByTimeAsync(0)
  fromWatch({ t: "ack", id: idsOf("session")[0]! }, 9)
  mockClient.listener.onStatus("disconnected")

  expect(reportSync).toHaveBeenCalledWith(
    "watch_sync_connected",
    expect.objectContaining({ watch_version: 3 }),
  )
  expect(reportSync).toHaveBeenCalledWith(
    "watch_sync_link_ended",
    expect.objectContaining({ reason: "dropped", acked: 1, resent: 0, failed: 0 }),
  )
  link.destroy()
})

test("writes rows to a watch that reads them, and keeps the hello named", async () => {
  const link = await connected({ v: 4 })
  useWatchStore.setState({ session, outbox: useWatchStore.getState().outbox + 1 })
  await jest.advanceTimersByTimeAsync(0)

  const frames = mockClient.sendFrame.mock.calls.map(([frame]) => frame)
  expect(frames[0]).toContain('~{"t":"hello"')
  expect(frames.some((frame) => /~\["s","s1",/.test(frame))).toBe(true)
  link.destroy()
})
