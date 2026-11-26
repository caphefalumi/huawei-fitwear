/** Keeps one connection to the watch alive and mirrors the store over it. */
import { BLE_MAX_MESSAGE_BYTES, WatchBleClient, type WatchBleStatus } from "@/features/ble"

import { usePairing } from "./pairing.store"
import {
  encodeFrames,
  FrameAssembler,
  PROTOCOL_VERSION,
  type SyncMessage,
  type WireDay,
  type WireFoodLog,
} from "./protocol"
import { toWirePlan, useWatchStore } from "./store"

const RETRY_MS = 6000
/** A link that just dropped is usually still within reach. */
const RECONNECT_MS = 1000
const HELLO_MS = 1000
/** Payload of the smallest ATT MTU, accepted by every link. */
const MIN_PAYLOAD = 20

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
  private sentPlan = ""
  private sentDay = ""
  private food: Promise<void> = Promise.resolve()
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
    void this.client.disconnect()
    useWatchStore.setState({ status: "off", error: null })
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
    }
  }

  destroy() {
    this.stop()
    this.client.destroy()
  }

  private clearTimers() {
    if (this.retry) clearTimeout(this.retry)
    if (this.hello) clearInterval(this.hello)
    this.retry = null
    this.hello = null
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
      this.sentDay = ""
      this.greet()
      // Repeated until the watch answers, in case it was not yet subscribed.
      this.hello = setInterval(() => this.greet(), HELLO_MS)
      return
    }
    useWatchStore.setState(
      status === "connecting" ? { status: "connecting", error: null } : { status: "searching" },
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
        usePairing.getState().remember()
        this.sendSession()
        void this.sendDay()
      }
    } else if (useWatchStore.getState().status !== "connected") {
      return
    } else if (message.t === "session") {
      useWatchStore.getState().receive(message.session)
    } else if (message.t === "food") {
      this.saveFood(message.logs)
    }
  }

  /** Sends today's nutrition if it differs from what the watch last got. */
  async sendDay() {
    if (!this.nutrition || useWatchStore.getState().status !== "connected") return
    const day = await this.nutrition.day().catch(() => null)
    if (!day || this.stopped || useWatchStore.getState().status !== "connected") return
    const key = JSON.stringify(day)
    if (key === this.sentDay) return
    this.sentDay = key
    this.send({ t: "day", day })
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
    const key = JSON.stringify(plan)
    if (key === this.sentPlan) return
    this.sentPlan = key
    this.send({ t: "plan", plan })
  }

  /** The plan always goes first, so the watch can show the session it is given. */
  private sendSession() {
    this.sendPlan()
    const { session, status } = useWatchStore.getState()
    if (session && status === "connected") this.send({ t: "session", session })
  }

  private send(message: SyncMessage) {
    const id = ++this.messageId
    this.queue = this.queue.then(async () => {
      const payload = Math.min(BLE_MAX_MESSAGE_BYTES, this.client.maxPayload())
      for (const frame of encodeFrames(message, payload, id)) {
        if (await this.client.sendFrame(frame)) continue
        // The watch may not have seen the larger MTU; retry the message in small frames.
        for (const small of encodeFrames(message, MIN_PAYLOAD, id)) {
          if (!(await this.client.sendFrame(small))) return
        }
        return
      }
    })
  }
}
