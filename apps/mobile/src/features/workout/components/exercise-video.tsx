import { Image } from "expo-image"
import { useVideoPlayer, VideoView } from "expo-video"
import { useEffect, useState } from "react"
import { Modal, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

const icons = {
  play: require("@/assets/images/workout/play.svg"),
}

function Player({
  title,
  source,
  onClose,
}: {
  title: string
  source: number
  onClose: () => void
}) {
  const insets = useSafeAreaInsets()
  const player = useVideoPlayer(source, (video) => {
    video.loop = true
    video.muted = true
  })

  // On web, play() needs the VideoView to have attached its media element.
  useEffect(() => {
    player.play()
  }, [player])

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
      <VideoView player={player} style={styles.stage} contentFit="contain" nativeControls />
    </View>
  )
}

export function ExerciseVideo({ title, source }: { title: string; source: number }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Pressable
        style={styles.slot}
        accessibilityRole="button"
        accessibilityLabel={`Play ${title} video`}
        onPress={() => setOpen(true)}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Technique loop</Text>
        </View>
        <View style={styles.play}>
          <Image
            accessible={false}
            source={icons.play}
            style={styles.playIcon}
            contentFit="contain"
          />
        </View>
      </Pressable>
      <Modal
        visible={open}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        {open ? <Player title={title} source={source} onClose={() => setOpen(false)} /> : null}
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
  stage: { flex: 1 },
})
