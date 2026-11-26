import { usePairing } from "./pairing.store"
import { useWatchStore, type WatchStatus } from "./store"

const LABELS: Record<WatchStatus, string> = {
  off: "Not connected",
  searching: "Searching…",
  connecting: "Connecting…",
  approval: "Approve on watch",
  connected: "Connected",
}

/** One wording for the watch connection everywhere it is shown. */
export function useWatchStatus() {
  const enabled = usePairing((state) => state.enabled)
  const status = useWatchStore((state) => state.status)
  const error = useWatchStore((state) => state.error)
  const name = usePairing((state) => state.name)
  const label = enabled ? LABELS[status] : "Not set up"
  return {
    enabled,
    status,
    error: status === "connected" ? null : error,
    connected: status === "connected",
    label,
    /** The watch's own name; empty until one has connected. */
    name,
    /** The name once connected, otherwise the state. For one-line mentions. */
    summary: status === "connected" && name ? name : label,
  }
}
