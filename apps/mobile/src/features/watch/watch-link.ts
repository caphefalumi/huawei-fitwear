/** Keeps one connection to the watch alive and mirrors the store over it. */
import { BLE_MAX_MESSAGE_BYTES, WatchBleClient, type WatchBleStatus } from "@/features/ble"

import { usePairing } from "./pairing.store"
import {
  ACK_VERSION,
  COMPACT_PLAN_VERSION,
  compactPlan,
  encodeFrames,
  FrameAssembler,
  PHONE_VERSION,
  planKey,
  PROTOCOL_VERSION,
  PROTOBUF_VERSION,
  ROW_VERSION,
  type SyncMessage,
  type WireDay,
  type WireFoodLog,
} from "./protocol"
import { toWirePlan, useWatchStore } from "./store"
import { LinkStats, reportSync } from "./telemetry"

const RETRY_MS = 6000
/** A link that just dropped is usually still within reach. */
const RECONNECT_MS = 1000
const HELLO_MS = 1000
/** Payload of the smallest ATT MTU, accepted by every link. */
const MIN_PAYLOAD = 20
/** After a send fails on a link that stays up, everything is sent again this much later. */
const RESYNC_MS = 2000
/** How long a message waits for the watch's ack before it is sent again, doubling each time. */
const ACK_MS = 2000
const ACK_MAX_MS = 30_000

/** The messages the watch acks, from ACK_VERSION on. */
type Confirmed = "plan" | "session" | "day"
const isConfirmed = (t: SyncMessage["t"]): t is Confirmed =>
  t === "plan" || t === "session" || t === "day"

type Awaiting = { id: number; sentAt: number; due: number; tries: number }

export type WatchNutrition = {
  /** Today's nutrition, freshly read; null when it cannot be read. */
  day: () => Promise<WireDay | null>
  /** Saves the watch's quick logs. Ones that fail stay on the watch and come again. */
  save: (logs: WireFoodLog[]) => Promise<void>
}

export class WatchLink {
  private client: WatchBleClient
  private assembler = new FrameAssembler()
  private state: WatchBleStatus = "disconnected"
  private retry: ReturnType<typeof setTimeout> | null = null
  private hello: ReturnType<typeof setInterval> | null = null
  private unsubscribe: (() => void) | null = null
  private queue: Promise<void> = Promise.resolve()
  private messageId = 0
  /** `planKey` of the plan the watch holds. */
  private sentPlan = ""
  /** What the watch reads, from its welcome. */
  private watchVersion = 1
  private sentDay = ""
  /** The favorites the watch holds, as JSON; days leave them out while they are the same. */
  private sentFavorites = ""
  /** The latest message of each kind the watch has not acked yet. */
  private awaiting = new Map<Confirmed, Awaiting>()
  /** Tries so far for a kind being sent again, so the wait keeps doubling. */
  private retryTries = new Map<Confirmed, number>()
  private ackTimer: ReturnType<typeof setTimeout> | null = null
  /** Set once the watch welcomes this phone, until the link ends. */
  private stats: LinkStats | null = null
  private connectingAt = 0
  /** The nutrition read and send in progress, if any. */
  private dayRun: Promise<void> | null = null
  /** Asked for again while `dayRun` was reading, so it reads once more. */
  private dayAgain = false
  private food: Promise<void> = Promise.resolve()
  /** A send failed on a link that stayed up. */
  private resyncDue = false
  private resync: ReturnType<typeof setTimeout> | null = null
  private stopped = true

  constructor(
    private readonly phone: string,
    private readonly nutrition?: WatchNutrition,
    /** Shown on the watch while it is connected to this phone. */
    private readonly phoneName?: string,
  ) {
    this.client = new WatchBleClient({
      onStatus: (status) => this.onStatus(status),
      onDeviceName: (name) => {
        if (name !== "None") usePairing.getState().setName(name)
      },
      onError: (error) => this.onError(error),
      onMessage: (direction, text) => {
        if (direction === "watch-to-phone") this.onFrame(text)
      },
    })
  }

  start() {
    if (!this.stopped) return
    this.stopped = false
    this.unsubscribe = useWatchStore.subscribe((state, previous) => {
      if (state.outbox !== previous.outbox) this.sendSession()
      else if (state.routine !== previous.routine) this.sendPlan()
    })
    useWatchStore.setState({ status: "searching", error: null })
    void this.client.connect()
  }

  stop() {
    if (this.stopped) return
    this.stopped = true
    this.clearTimers()
    this.unsubscribe?.()
    this.unsubscribe = null
    this.endLink("stopped")
    void this.client.disconnect()
    useWatchStore.setState({ status: "off", error: null, live: null })
  }

  setForeground(foreground: boolean) {
    this.client.setForeground(foreground)
  }

  /** Stands in for the timers below, which do not run while Android is in the background. */
  tick() {
    if (this.stopped) return
    if (this.state === "disconnected") {
      this.clearTimers()
      void this.client.connect()
    } else if (this.state === "connected" && this.hello) {
      this.greet()
    } else if (this.state === "connected") {
      this.resendAll()
      this.checkAcks()
    }
  }

  destroy() {
    this.stop()
    this.client.destroy()
  }

  private clearTimers() {
    if (this.retry) clearTimeout(this.retry)
    if (this.hello) clearInterval(this.hello)
    if (this.resync) clearTimeout(this.resync)
    if (this.ackTimer) clearTimeout(this.ackTimer)
    this.retry = null
    this.hello = null
    this.resync = null
    this.ackTimer = null
  }

  private scheduleRetry(delay = RETRY_MS) {
    if (this.stopped || this.retry) return
    this.retry = setTimeout(() => {
      this.retry = null
      if (!this.stopped && this.state === "disconnected") void this.client.connect()
    }, delay)
  }

  private onStatus(status: WatchBleStatus) {
    const dropped = this.state === "connected" && status === "disconnected"
    this.state = status
    if (this.stopped) return
    if (status === "connected") {
      this.assembler = new FrameAssembler()
      this.sentPlan = ""
      this.watchVersion = 1
      this.sentDay = ""
      this.sentFavorites = ""
      // The welcome sends everything anyway.
      this.resyncDue = false
      this.awaiting.clear()
      this.retryTries.clear()
      this.greet()
      // Repeated until the watch answers, in case it was not yet subscribed.
      this.hello = setInterval(() => this.greet(), HELLO_MS)
      return
    }
    if (status === "connecting") this.connectingAt = Date.now()
    if (status === "disconnected") this.endLink("dropped")
    // A count from a watch that is gone would go stale on screen.
    useWatchStore.setState(
      status === "connecting"
        ? { status: "connecting", error: null, live: null }
        : { status: "searching", live: null },
    )
    if (status === "disconnected") {
      this.clearTimers()
      this.scheduleRetry(dropped ? RECONNECT_MS : RETRY_MS)
    }
  }

  private greet() {
    this.send({
      t: "hello",
      v: PROTOCOL_VERSION,
      phone: this.phone,
      name: this.phoneName?.slice(0, 40),
      app: PHONE_VERSION,
    })
  }

  private onError(error: string | null) {
    if (this.stopped || !error || error.startsWith("Warning")) return
    if (error.startsWith("Scan timed out")) {
      useWatchStore.setState({ error: "Watch not found. Open VoocHealth on the watch." })
    } else {
      useWatchStore.setState({ error })
    }
    // Errors before a scan starts do not report a status, so retry from here too.
    if (this.state === "disconnected" && !/permissions denied|Native BLE/.test(error)) {
      this.scheduleRetry()
    }
  }

  private onFrame(text: string) {
    const message = this.assembler.push(text)
    if (!message || this.stopped) return
    if (message.t === "welcome") {
      if (this.hello) clearInterval(this.hello)
      this.hello = null
      useWatchStore.setState({ status: message.ok ? "connected" : "approval", error: null })
      if (message.ok) {
        this.watchVersion = message.v
        this.stats = new LinkStats()
        reportSync("watch_sync_connected", {
          watch_version: message.v,
          handshake_ms: this.connectingAt ? Date.now() - this.connectingAt : -1,
        })
        // A plan the watch still holds from before the link dropped is not sent again.
        if (message.key) this.sentPlan = message.key
        usePairing.getState().remember()
        this.sendSession()
        void this.sendDay()
      }
    } else if (useWatchStore.getState().status !== "connected") {
      return
    } else if (message.t === "ack") {
      this.onAck(message.id)
    } else if (message.t === "session") {
      this.ack()
      useWatchStore.getState().receive(message.session)
    } else if (message.t === "reps") {
      useWatchStore.setState({ live: message.live })
    } else if (message.t === "food") {
      this.ack()
      this.saveFood(message.logs)
    }
  }

  /** Tells a watch that acks that the message just put together arrived. */
  private ack() {
    if (this.watchVersion >= ACK_VERSION) this.send({ t: "ack", id: this.assembler.lastId })
  }

  private onAck(id: number) {
    for (const [kind, entry] of this.awaiting) {
      if (entry.id !== id) continue
      this.awaiting.delete(kind)
      this.retryTries.delete(kind)
      this.stats?.acked(Date.now() - entry.sentAt)
    }
  }

  /** Waits for the watch to ack the message just written, if it is one the watch acks. */
  private awaitAck(t: SyncMessage["t"], id: number) {
    if (!isConfirmed(t) || this.watchVersion < ACK_VERSION) return
    const tries = this.retryTries.get(t) ?? 0
    this.retryTries.delete(t)
    const now = Date.now()
    const due = now + Math.min(ACK_MAX_MS, ACK_MS * 2 ** tries)
    this.awaiting.set(t, { id: id % 1000, sentAt: now, due, tries })
    this.scheduleAckCheck()
  }

  private scheduleAckCheck() {
    if (this.ackTimer) clearTimeout(this.ackTimer)
    this.ackTimer = null
    const due = Math.min(...[...this.awaiting.values()].map((entry) => entry.due))
    if (Number.isFinite(due)) {
      this.ackTimer = setTimeout(() => this.checkAcks(), Math.max(0, due - Date.now()))
    }
  }

  /** Sends again whatever the watch has not acked in time: the current state, not the old one. */
  private checkAcks() {
    if (this.stopped || useWatchStore.getState().status !== "connected") return
    const now = Date.now()
    for (const [kind, entry] of this.awaiting) {
      if (entry.due > now) continue
      this.awaiting.delete(kind)
      this.retryTries.set(kind, entry.tries + 1)
      this.stats?.resentOne()
      if (kind === "plan") {
        this.sentPlan = ""
        this.sendPlan()
      } else if (kind === "session") {
        this.sendSession()
      } else {
        this.sentDay = ""
        this.sentFavorites = ""
        void this.sendDay()
      }
    }
    this.scheduleAckCheck()
  }

  /** Reports what a welcomed link did, once, when it ends. */
  private endLink(reason: "dropped" | "stopped") {
    if (!this.stats) return
    reportSync("watch_sync_link_ended", this.stats.summary(reason, this.watchVersion))
    this.stats = null
  }

  /**
   * Sends today's nutrition if it differs from what the watch last got. Reads run one at a time,
   * and a call during one makes it read again, so an older read is never the last one sent.
   */
  sendDay(): Promise<void> {
    if (this.dayRun) {
      this.dayAgain = true
      return this.dayRun
    }
    const run = async () => {
      try {
        do {
          this.dayAgain = false
          await this.readAndSendDay()
        } while (this.dayAgain && !this.stopped)
      } finally {
        // Cleared in the same step as the last check, so no call can slip between them.
        this.dayRun = null
      }
    }
    this.dayRun = run()
    return this.dayRun
  }

  private async readAndSendDay() {
    if (!this.nutrition || useWatchStore.getState().status !== "connected") return
    const day = await this.nutrition.day().catch(() => null)
    if (!day || this.stopped || useWatchStore.getState().status !== "connected") return
    const key = JSON.stringify(day)
    if (key === this.sentDay) return
    this.sentDay = key
    if (this.watchVersion < ACK_VERSION) return this.send({ t: "day", day })
    // The favorites rarely change, and leaving them out keeps a new total to a frame or two.
    const favorites = JSON.stringify(day.favorites)
    const { favorites: _, ...totals } = day
    this.send({ t: "day", day: favorites === this.sentFavorites ? totals : day })
    this.sentFavorites = favorites
  }

  /** One batch at a time, so a repeated message cannot save a meal twice. */
  private saveFood(logs: WireFoodLog[]) {
    this.food = this.food.then(async () => {
      await this.nutrition?.save(logs).catch(() => undefined)
      // The watch asked, so answer even if the day is unchanged.
      this.sentDay = ""
      await this.sendDay()
    })
  }

  private sendPlan() {
    const { routine, status } = useWatchStore.getState()
    if (!routine || status !== "connected") return
    const plan = toWirePlan(routine)
    const key = planKey(plan)
    if (key === this.sentPlan) return
    this.sentPlan = key
    this.send(
      this.watchVersion >= COMPACT_PLAN_VERSION
        ? { t: "plan", plan: compactPlan(plan), key }
        : { t: "plan", plan },
    )
  }

  /** The plan always goes first, so the watch can show the session it is given. */
  private sendSession() {
    this.sendPlan()
    const { session, status } = useWatchStore.getState()
    if (session && status === "connected") this.send({ t: "session", session })
  }

  private send(message: SyncMessage) {
    const id = ++this.messageId
    const queuedAt = Date.now()
    this.queue = this.queue.then(async () => {
      const startedAt = Date.now()
      const sent = await this.write(message, id)
      if (__DEV__ && process.env.NODE_ENV !== "test") {
        console.info(
          `[watch] ${message.t} ${sent ? "sent" : "failed"} in ${Date.now() - startedAt} ms` +
            ` after ${startedAt - queuedAt} ms queued`,
        )
      }
      if (sent) {
        this.stats?.sentOne()
        this.awaitAck(message.t, id)
      } else {
        this.stats?.failedOne()
        this.scheduleResync()
      }
    })
  }

  /** A dropped link sends everything again once it is back; one that stays up does it here. */
  private scheduleResync() {
    if (this.stopped || this.state !== "connected") return
    this.resyncDue = true
    this.resync ??= setTimeout(() => this.resendAll(), RESYNC_MS)
  }

  private resendAll() {
    if (this.resync) clearTimeout(this.resync)
    this.resync = null
    if (!this.resyncDue || this.stopped || this.state !== "connected") return
    this.resyncDue = false
    // Before the welcome, the hello is repeated anyway and the welcome sends the rest.
    if (useWatchStore.getState().status !== "connected") return
    this.sentPlan = ""
    this.sentDay = ""
    this.sentFavorites = ""
    this.sendSession()
    void this.sendDay()
  }

  /** Writes one message as frames; false if even small frames fail. */
  private async write(message: SyncMessage, id: number): Promise<boolean> {
    const payload = Math.min(BLE_MAX_MESSAGE_BYTES, this.client.maxPayload())
    const format =
      this.watchVersion >= PROTOBUF_VERSION
        ? "protobuf"
        : this.watchVersion >= ROW_VERSION
          ? "rows"
          : "named"
    const frames = encodeFrames(message, payload, id, format)
    for (const [index, frame] of frames.entries()) {
      // Only the first frame, always the full size, waits for an answer: it shows the watch takes
      // frames this big. The rest share connection events; a link that drops meanwhile sends
      // everything again once it is back.
      if (await this.client.sendFrame(frame, index === 0)) continue
      // A watch that missed the larger MTU rejects the first frame; retry the message in small
      // frames, each answered.
      this.stats?.fellBackToSmallFrames()
      for (const small of encodeFrames(message, MIN_PAYLOAD, id, format)) {
        if (!(await this.client.sendFrame(small, true))) return false
      }
      return true
    }
    return true
  }
}
