/** How the watch link behaves in use. Counts and timings only, never workout or food content. */
import { posthog } from "@/lib/analytics/posthog"

export type SyncEvent =
  /** The watch welcomed this phone. */
  | "watch_sync_connected"
  /** A welcomed link ended, with what happened on it. */
  | "watch_sync_link_ended"

export function reportSync(event: SyncEvent, properties: Record<string, number | string>) {
  posthog?.capture(event, properties)
}

/** What one welcomed link did, for watch_sync_link_ended. */
export class LinkStats {
  private since = Date.now()
  private sent = 0
  private failed = 0
  private resent = 0
  private smallFrames = 0
  private ackMs: number[] = []

  sentOne() {
    this.sent++
  }
  failedOne() {
    this.failed++
  }
  resentOne() {
    this.resent++
  }
  fellBackToSmallFrames() {
    this.smallFrames++
  }
  acked(ms: number) {
    // Enough for the median and the worst case of a long workout.
    if (this.ackMs.length < 500) this.ackMs.push(ms)
  }

  summary(reason: "dropped" | "stopped", watchVersion: number) {
    const sorted = [...this.ackMs].sort((a, b) => a - b)
    return {
      reason,
      watch_version: watchVersion,
      connected_s: Math.round((Date.now() - this.since) / 1000),
      sent: this.sent,
      failed: this.failed,
      resent: this.resent,
      small_frames: this.smallFrames,
      acked: sorted.length,
      ack_p50_ms: sorted[Math.floor(sorted.length / 2)] ?? -1,
      ack_max_ms: sorted.at(-1) ?? -1,
    }
  }
}
