import { Image } from "expo-image"
import { useEffect, useRef, useState } from "react"
import { Animated, Easing, Modal, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

const icons = {
  play: require("@/assets/images/workout/play.svg"),
}

const CLIP_MS = 30_000

/** Full-screen player stand-in until the real demo clips exist. */
function Player({ title, onClose }: { title: string; onClose: () => void }) {
  const insets = useSafeAreaInsets()
  const [paused, setPaused] = useState(false)
  const progress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (paused) return
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: CLIP_MS,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    )
    loop.start()
    return () => loop.stop()
  }, [paused, progress])

  return (
    <View
      style={[styles.player, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
    >
      <View style={styles.playerTop}>
        <Text style={styles.playerTitle} numberOfLines={1}>
          {title}
        </Text>
        <Pressable style={styles.close} accessibilityLabel="Close video" onPress={onClose}>
          <Text style={styles.closeLabel}>✕</Text>
        </Pressable>
      </View>
      <View style={styles.stage}>
        <Text style={styles.stageTitle}>Demo video placeholder</Text>
        <Text style={styles.stageSub}>A 30 second clip will play here.</Text>
      </View>
      <View style={styles.bar}>
        <Animated.View
          style={[
            styles.barFill,
            { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) },
          ]}
        />
      </View>
      <View style={styles.controls}>
        <Pressable
          style={styles.playPause}
          accessibilityLabel={paused ? "Play" : "Pause"}
          onPress={() => setPaused((value) => !value)}
        >
          <Text style={styles.playPauseLabel}>{paused ? "▶" : "❚❚"}</Text>
        </Pressable>
      </View>
    </View>
  )
}

/** 16:9 video slot at the top of a technique guide; tapping opens the player. */
export function VideoPlaceholder({ title }: { title: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Pressable
        style={styles.slot}
        accessibilityLabel={`Play ${title} video`}
        onPress={() => setOpen(true)}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Video</Text>
        </View>
        <View style={styles.play}>
          <Image
            accessible={false}
            source={icons.play}
            style={styles.playIcon}
            contentFit="contain"
          />
        </View>
        <View style={[styles.badge, styles.duration]}>
          <Text style={styles.badgeLabel}>0:30</Text>
        </View>
      </Pressable>
      <Modal
        visible={open}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        {open ? <Player title={title} onClose={() => setOpen(false)} /> : null}
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  slot: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 18,
    backgroundColor: C.video,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  play: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    width: 22,
    height: 22,
    marginLeft: 3,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  duration: {
    top: undefined,
    left: undefined,
    bottom: 10,
    right: 10,
  },
  badgeLabel: {
    fontSize: 11,
    color: C.onAccent,
  },
  player: {
    flex: 1,
    backgroundColor: C.videoDeep,
    paddingHorizontal: 20,
    gap: 16,
  },
  playerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  playerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: C.onAccent,
  },
  close: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeLabel: {
    fontSize: 16,
    color: C.onAccent,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  stageTitle: {
    fontSize: 15,
    color: C.onAccent,
  },
  stageSub: {
    fontSize: 12,
    color: C.track,
  },
  bar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: C.onAccent,
  },
  controls: {
    alignItems: "center",
  },
  playPause: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  playPauseLabel: {
    fontSize: 18,
    color: C.text,
  },
})
