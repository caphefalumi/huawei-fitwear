import { useEffect, useState } from "react"
import { AppState } from "react-native"

export type LoginLockoutKind = "rate" | "locked"

export function useLoginLockout() {
  const [deadline, setDeadline] = useState<number | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [kind, setKind] = useState<LoginLockoutKind | null>(null)

  useEffect(() => {
    if (deadline === null) return
    const update = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setSeconds(remaining)
      if (remaining === 0) {
        setDeadline(null)
        setKind(null)
      }
    }
    update()
    const timer = setInterval(update, 1000)
    const foregroundListener = AppState.addEventListener("change", (state) => {
      if (state === "active") update()
    })
    return () => {
      clearInterval(timer)
      foregroundListener.remove()
    }
  }, [deadline])

  function lock(nextKind: LoginLockoutKind, retryAfterSec?: number) {
    setKind(nextKind)
    setSeconds(retryAfterSec ?? 0)
    setDeadline(retryAfterSec === undefined ? null : Date.now() + retryAfterSec * 1000)
  }

  function clear() {
    setKind(null)
    setDeadline(null)
    setSeconds(0)
  }

  const message =
    kind === null
      ? null
      : seconds > 0
        ? `${kind === "locked" ? "Account temporarily locked" : "Too many attempts"}. Try again in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}.`
        : kind === "locked"
          ? "Account locked. Reset your password to regain access."
          : "Too many attempts. Reset your password or try again later."

  return { kind, message, lock, clear }
}
