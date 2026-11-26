import { useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { AppState, Platform } from "react-native"

import { useAuth } from "@/features/auth"
import { mealsQueryKeys, useMeals } from "@/features/meals"
import { useRoutines } from "@/features/workout"
import { captureException } from "@/lib/analytics/posthog"

import { createWatchNutrition } from "./nutrition"
import { phoneId, usePairing } from "./pairing.store"
import { resetWatchSession, useWatchStore } from "./store"
import { WatchLink } from "./watch-link"

/**
 * Mounted once for a signed-in user: connects to the watch whenever the app is in
 * the foreground, and opens the workout screen when the watch starts one.
 */
export function WatchBridge() {
  const { enabled, load } = usePairing()
  const [foreground, setForeground] = useState(AppState.currentState !== "background")
  const link = useRef<WatchLink | null>(null)
  const [ready, setReady] = useState(false)
  const today = useRoutines().today
  const owner = useAuth().user?.id
  const queryClient = useQueryClient()
  const { history, summary } = useMeals()
  const meals = useRef(history)
  meals.current = history

  useEffect(() => {
    void load()
    const subscription = AppState.addEventListener("change", (state) =>
      setForeground(state !== "background"),
    )
    return () => {
      subscription?.remove()
      link.current?.destroy()
      link.current = null
      resetWatchSession()
    }
  }, [load])

  useEffect(() => {
    if (!enabled || Platform.OS === "web" || link.current) return
    let cancelled = false
    void phoneId().then(
      (id) => {
        if (cancelled) return
        link.current = new WatchLink(
          id,
          owner
            ? createWatchNutrition({
                owner,
                history: () => meals.current,
                onSaved: () =>
                  void queryClient.invalidateQueries({ queryKey: mealsQueryKeys.all(owner) }),
              })
            : undefined,
        )
        setReady(true)
      },
      () => captureException(new Error("Could not prepare the watch connection.")),
    )
    return () => {
      cancelled = true
    }
  }, [enabled, owner, queryClient])

  useEffect(() => {
    if (enabled && foreground) link.current?.start()
    else link.current?.stop()
  }, [enabled, foreground, ready])

  // The watch gets new totals and favorites whenever the meals here change.
  useEffect(() => {
    void link.current?.sendDay()
  }, [history, summary])

  // Offer today's routine to the watch while no workout is running.
  const routineKey = JSON.stringify(today)
  const latest = useRef(today)
  latest.current = today
  const session = useWatchStore((state) => state.session)
  const idle = !session || session.status === "closed"
  useEffect(() => {
    if (idle) useWatchStore.setState({ routine: latest.current })
  }, [routineKey, idle])

  // A workout started or finished on the watch brings up the workout screen here.
  const remoteSeq = useWatchStore((state) => state.remoteSeq)
  const opened = useRef("")
  useEffect(() => {
    const { session: shared, sessionOpen, routine } = useWatchStore.getState()
    if (!remoteSeq || !shared || shared.status === "closed" || shared.id === opened.current) return
    opened.current = shared.id
    if (!sessionOpen && routine?.name === shared.plan) router.push("/session?watch=1")
  }, [remoteSeq])

  return null
}
