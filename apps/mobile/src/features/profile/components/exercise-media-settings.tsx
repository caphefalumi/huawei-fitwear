import { useState, useSyncExternalStore } from "react"
import { Platform, StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/ui/pressable"
import {
  clearExerciseLoopCache,
  exerciseLoopCacheBytes,
  subscribeToExerciseLoopCache,
} from "@/features/workout/utils/exercise-loop-cache"
import { Palette as C } from "@/theme"

function readCacheBytes() {
  try {
    return exerciseLoopCacheBytes()
  } catch {
    return null
  }
}

function NativeCacheSettings() {
  const bytes = useSyncExternalStore(subscribeToExerciseLoopCache, readCacheBytes)
  const [clearFailed, setClearFailed] = useState(false)
  const clear = () => {
    try {
      clearExerciseLoopCache()
      setClearFailed(false)
    } catch {
      setClearFailed(true)
    }
  }

  return (
    <>
      <Text style={styles.copy}>
        Exercise animations are saved for offline use as you open guides.
      </Text>
      <Text accessibilityLiveRegion="polite" style={styles.copy}>
        {bytes === null ? "Cache size unavailable" : `${(bytes / 1_000_000).toFixed(2)} MB cached`}
      </Text>
      <Pressable style={styles.action} onPress={clear}>
        <Text style={styles.actionLabel}>Clear exercise cache</Text>
      </Pressable>
      {clearFailed ? (
        <Text accessibilityRole="alert" style={styles.copy}>
          Could not clear exercise animations.
        </Text>
      ) : null}
    </>
  )
}

export function ExerciseMediaSettings() {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.heading}>
        Exercise media
      </Text>
      {Platform.OS === "web" ? (
        <Text style={styles.copy}>
          Your browser manages its cache. Offline animations aren’t guaranteed on web.
        </Text>
      ) : (
        <NativeCacheSettings />
      )}
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
