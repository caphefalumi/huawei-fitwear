import { onlineManager } from "@tanstack/react-query"
import { Image } from "expo-image"
import { useIsFocused } from "expo-router/react-navigation"
import { useEffect, useRef, useState } from "react"
import { AccessibilityInfo, Platform, StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

import { loadExerciseLoop } from "../utils/exercise-loop-cache"

export function ExerciseLoop({
  title,
  media: [id, poster],
}: {
  title: string
  media: readonly [id: string, poster: number]
}) {
  const focused = useIsFocused()
  const [wantsPlayback, setWantsPlayback] = useState<boolean>()
  const [animationUri, setAnimationUri] = useState<string | null>()
  const [attempt, setAttempt] = useState(0)
  const refreshFile = useRef(false)
  const image = useRef<Image>(null)
  const playing = focused && wantsPlayback === true
  const web = Platform.OS === "web"
  // Web has no GIF pause API; show the bundled poster when playback is paused.
  const animation = animationUri && (!web || playing) ? { uri: animationUri } : undefined

  useEffect(() => {
    let active = true
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (reduced) =>
      setWantsPlayback(!reduced),
    )
    void AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => true)
      .then((reduced) => {
        if (active) setWantsPlayback((requested) => requested ?? !reduced)
      })
    return () => {
      active = false
      subscription?.remove()
    }
  }, [])

  useEffect(() => {
    if (!focused) {
      setAnimationUri(undefined)
      return
    }
    let active = true
    const download = refreshFile.current ? loadExerciseLoop(id, true) : loadExerciseLoop(id)
    refreshFile.current = false
    void download.then(
      (uri) => {
        if (active) setAnimationUri(uri)
      },
      () => {
        if (active) setAnimationUri(null)
      },
    )
    return () => {
      active = false
    }
  }, [focused, id, attempt])

  useEffect(() => {
    if (!focused || animationUri !== null) return
    return onlineManager.subscribe((online) => {
      if (online) {
        setAnimationUri(undefined)
        setAttempt((value) => value + 1)
      }
    })
  }, [focused, animationUri])

  useEffect(() => {
    if (!web) {
      if (playing) void image.current?.startAnimating()
      else void image.current?.stopAnimating()
    }
  }, [playing, web])

  const action = wantsPlayback ? "Pause" : "Play"
  return (
    <View style={styles.slot}>
      <Image
        ref={image}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`${title} demonstration`}
        autoplay={playing}
        contentFit="contain"
        loading="eager"
        cachePolicy={web ? undefined : "none"}
        source={animation ?? poster}
        placeholder={animation ? poster : undefined}
        placeholderContentFit="contain"
        onError={
          animation
            ? () => {
                refreshFile.current = true
                setAnimationUri(null)
              }
            : undefined
        }
        style={StyleSheet.absoluteFill}
      />
      {animationUri && wantsPlayback !== undefined ? (
        <Pressable
          style={styles.control}
          accessibilityLabel={`${action} ${title} animation`}
          onPress={() => setWantsPlayback(!wantsPlayback)}
        >
          <Text style={styles.controlLabel}>{action}</Text>
        </Pressable>
      ) : animationUri === null ? (
        <Pressable
          style={styles.control}
          accessibilityLabel={`Retry ${title} animation`}
          onPress={() => {
            setAnimationUri(undefined)
            setAttempt((value) => value + 1)
          }}
        >
          <Text style={styles.controlLabel}>Animation unavailable · Retry</Text>
        </Pressable>
      ) : animationUri === undefined && focused ? (
        <View style={styles.control}>
          <Text accessibilityLiveRegion="polite" style={styles.controlLabel}>
            Loading animation…
          </Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  slot: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 18,
    backgroundColor: C.video,
    overflow: "hidden",
  },
  control: {
    position: "absolute",
    right: 8,
    bottom: 8,
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: C.video,
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.onAccent,
  },
})
