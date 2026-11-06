import { useObserve } from "expo-observe"
import { useEffect } from "react"

/** Records time to interactive when an entry screen mounts. */
export function useMarkInteractive() {
  const { markInteractive } = useObserve()
  useEffect(() => {
    markInteractive()
  }, [markInteractive])
}
