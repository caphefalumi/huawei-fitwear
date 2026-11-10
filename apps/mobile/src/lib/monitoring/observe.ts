import * as Sentry from "@sentry/react-native"
import { useEffect } from "react"

/** Records time to interactive when the first entry screen mounts. Later calls are ignored. */
export function useMarkInteractive() {
  useEffect(() => {
    Sentry.appLoaded()
  }, [])
}
