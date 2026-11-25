import { usePairing } from "./pairing.store"
import { useWatchStore, type WatchStatus } from "./store"

const LABELS: Record<WatchStatus, string> = {
  off: "Not connected",
  searching: "Searching…",
  approval: "Approve on watch",
  connected: "Connected",
}

/** One wording for the watch connection everywhere it is shown. */
export function useWatchStatus() {
  const enabled = usePairing((state) => state.enabled)
  const status = useWatchStore((state) => state.status)
  const error = useWatchStore((state) => state.error)
  return {
    enabled,
    status,
    error: status === "connected" ? null : error,
    connected: status === "connected",
    label: enabled ? LABELS[status] : "Not set up",
  }
}
