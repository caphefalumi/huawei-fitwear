import { useState, useSyncExternalStore } from "react"
import { Platform, StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/ui/pressable"
import {
  clearExerciseLoopCache,
  exerciseLoopCacheBytes,
  subscribeToExerciseLoopCache,
} from "@/features/workout/utils/exercise-loop-cache"
import { queryClient } from "@/lib/query/client"
import { clearOfflineCache } from "@/lib/query/offline-cache"
import {
  clearMealPhotoCache,
  mealPhotoCacheBytes,
  subscribeToMealPhotoCache,
} from "@/lib/storage/meal-photo-cache"
import { Palette as C } from "@/theme"

function readCacheBytes() {
  if (Platform.OS === "web") return null
  try {
    return exerciseLoopCacheBytes() + (mealPhotoCacheBytes() ?? 0)
  } catch {
    return null
  }
}

function subscribeToMediaCache(listener: () => void) {
  const unsubscribeExercise = subscribeToExerciseLoopCache(listener)
  const unsubscribeMeal = subscribeToMealPhotoCache(listener)
  return () => {
    unsubscribeExercise()
    unsubscribeMeal()
  }
}

export function AppCacheSettings() {
  const native = Platform.OS !== "web"
  const bytes = useSyncExternalStore(subscribeToMediaCache, readCacheBytes)
  const [clearing, setClearing] = useState(false)
  const [clearFailed, setClearFailed] = useState(false)
  const clear = async () => {
    if (clearing) return
    setClearing(true)
    const photoQueries = {
      predicate: ({ queryKey }: { queryKey: readonly unknown[] }) =>
        queryKey[0] === "meals" && queryKey[2] === "photo",
    }
    await queryClient.cancelQueries(photoQueries)
    queryClient.removeQueries(photoQueries)
    if (native) {
      const results = await Promise.allSettled([
        clearMealPhotoCache(),
        Promise.resolve().then(clearExerciseLoopCache),
        Promise.resolve().then(clearOfflineCache),
      ])
      setClearFailed(results.some((result) => result.status === "rejected"))
    }
    setClearing(false)
  }

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>
        App cache
      </Text>
      <Text style={styles.copy}>
        {native
          ? "Clears downloaded meal photos, exercise animations, and offline copies. Saved workouts and drafts are kept."
          : "Clears meal photos cached for this browser session."}
      </Text>
      {native && (
        <Text accessibilityLiveRegion="polite" style={styles.copy}>
          {bytes === null
            ? "Cache size unavailable"
            : `${(bytes / 1_000_000).toFixed(2)} MB of media cached`}
        </Text>
      )}
      <Pressable style={styles.action} disabled={clearing} onPress={() => void clear()}>
        <Text style={styles.actionLabel}>{clearing ? "Clearing…" : "Clear cache"}</Text>
      </Pressable>
      {clearFailed ? (
        <Text accessibilityRole="alert" style={styles.copy}>
          Could not clear all cached files. Try again.
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  section: { gap: 6 },
  heading: { fontSize: 17, fontWeight: "600", color: C.text },
  copy: { fontSize: 13, color: C.textMuted },
  action: { alignSelf: "flex-start" },
  actionLabel: { fontSize: 13, fontWeight: "600", color: C.accent },
})
