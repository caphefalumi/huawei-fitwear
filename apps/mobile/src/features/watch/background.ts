/** Decides whether the watch link may stay up once the app leaves the foreground. */
import { useEffect, useRef, useState } from "react"
import { Platform } from "react-native"

import { watchService } from "./background-service"
import { useWatchStore } from "./store"

/** How long the phone keeps looking for a lost watch from the background. */
export const GIVE_UP_MS = 5 * 60_000

export function useBackgroundLink(
  enabled: boolean,
  foreground: boolean,
  onTick: () => void,
): boolean {
  const connected = useWatchStore((state) => state.status === "connected")
  const [serving, setServing] = useState(false)
  const lostAt = useRef(0)
  const latest = useRef({ foreground, onTick })
  latest.current = { foreground, onTick }

  // Android only allows this to start while the app is in front.
  useEffect(() => {
    if (enabled && foreground && connected && !serving) setServing(watchService.start())
  }, [enabled, foreground, connected, serving])

  useEffect(() => {
    if (enabled || !serving) return
    watchService.stop()
    setServing(false)
  }, [enabled, serving])

  useEffect(() => {
    lostAt.current = connected ? 0 : Date.now()
  }, [connected, foreground])

  useEffect(() => {
    if (!serving) return
    const subscription = watchService.onTick(() => {
      const lost = lostAt.current && Date.now() - lostAt.current >= GIVE_UP_MS
      if (lost && !latest.current.foreground) {
        watchService.stop()
        setServing(false)
      } else {
        latest.current.onTick()
      }
    })
    return () => subscription?.remove()
  }, [serving])

  useEffect(() => () => void watchService.stop(), [])

  // iOS keeps the connection itself, through the Bluetooth background mode.
  return Platform.OS === "ios" || serving
}
