import * as Haptics from "expo-haptics"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import ReanimatedSwipeable, {
  SwipeDirection,
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BackHeader, PageHeading, Screen, SectionHeading } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { Palette as C } from "@/theme"

import { usePlanPreferences } from "../store/plan-preferences.store"
import { CATALOG, type CatalogExercise, type MuscleGroup } from "../utils/catalog"

const GROUPS: { group: MuscleGroup; icon: number }[] = [
  { group: "Chest", icon: require("@/assets/images/recovery/body-chest.svg") },
  { group: "Back", icon: require("@/assets/images/recovery/body-back.svg") },
  { group: "Shoulders", icon: require("@/assets/images/recovery/body-shoulders.svg") },
  { group: "Arms", icon: require("@/assets/images/recovery/body-arms.svg") },
  { group: "Legs", icon: require("@/assets/images/recovery/body-legs.svg") },
  { group: "Core", icon: require("@/assets/images/recovery/body-core.svg") },
]

const UNDO_MS = 5000

type Status = "liked" | "disliked" | "neutral"

function ExerciseRow({ exercise, status }: { exercise: CatalogExercise; status: Status }) {
  const swipeable = useRef<SwipeableMethods>(null)
  const toggleLike = usePlanPreferences((state) => state.toggleLike)
  const toggleDislike = usePlanPreferences((state) => state.toggleDislike)
  const like = () => {
    void Haptics.selectionAsync()
    toggleLike(exercise.key)
  }
  const dislike = () => {
    void Haptics.selectionAsync()
    toggleDislike(exercise.key)
  }
  const label = status === "liked" ? "Liked" : status === "disliked" ? "Not in your plan" : null

  return (
    <ReanimatedSwipeable
      ref={swipeable}
      friction={1.6}
      leftThreshold={72}
      rightThreshold={72}
      overshootFriction={8}
      renderLeftActions={() => (
        <View style={[styles.action, styles.likeAction]}>
          <Text style={styles.actionLabel}>{status === "liked" ? "♡ Remove like" : "♥ Like"}</Text>
        </View>
      )}
      renderRightActions={() => (
        <View style={[styles.action, styles.dislikeAction]}>
          <Text style={styles.actionLabel}>{status === "disliked" ? "Undo" : "✕ Dislike"}</Text>
        </View>
      )}
      onSwipeableWillOpen={(direction) => {
        if (direction === SwipeDirection.RIGHT) like()
        else dislike()
        swipeable.current?.close()
      }}
    >
      <Pressable
        style={[
          styles.row,
          status === "liked" && styles.rowLiked,
          status === "disliked" && styles.rowDisliked,
        ]}
        accessibilityLabel={`${exercise.name}${label ? `, ${label}` : ""}`}
        accessibilityHint="Opens the exercise guide"
        accessibilityActions={[
          { name: "like", label: status === "liked" ? "Remove like" : "Like" },
          { name: "dislike", label: status === "disliked" ? "Remove dislike" : "Dislike" },
        ]}
        onAccessibilityAction={({ nativeEvent }) =>
          nativeEvent.actionName === "like" ? like() : dislike()
        }
        onPress={() => router.push(`/exercise-guide?name=${exercise.key}`)}
      >
        <View style={styles.rowCopy}>
          <Text
            style={[styles.rowTitle, status === "disliked" && styles.rowTitleDisliked]}
            numberOfLines={1}
          >
            {exercise.name}
          </Text>
          <Text style={styles.rowSub}>{label ?? exercise.equipment}</Text>
        </View>
        <Pressable
          hitSlop={10}
          accessibilityLabel={status === "liked" ? "Remove like" : "Like"}
          onPress={like}
        >
          <Text style={[styles.heart, status === "liked" && styles.heartOn]}>
            {status === "liked" ? "♥" : status === "disliked" ? "✕" : "♡"}
          </Text>
        </Pressable>
      </Pressable>
    </ReanimatedSwipeable>
  )
}

export function ExercisePreferencesScreen() {
  useMarkInteractive()
  const insets = useSafeAreaInsets()
  const { likes, dislikes, hintDismissed, dismissHint, reset, restore } = usePlanPreferences()
  const [group, setGroup] = useState<MuscleGroup>("Chest")
  const [undo, setUndo] = useState<ReturnType<typeof reset> | null>(null)

  useEffect(() => {
    if (!undo) return
    const timer = setTimeout(() => setUndo(null), UNDO_MS)
    return () => clearTimeout(timer)
  }, [undo])

  const status = (key: string): Status =>
    likes.includes(key) ? "liked" : dislikes.includes(key) ? "disliked" : "neutral"
  const exercises = CATALOG.filter((exercise) => exercise.group === group)
  const hasChoices = likes.length + dislikes.length > 0

  return (
    <View style={styles.container}>
      <Screen>
        <BackHeader
          label="Back"
          onPress={() => router.back()}
          actionLabel={hasChoices ? "↺ Reset" : undefined}
          onAction={() => setUndo(reset())}
        />
        <PageHeading
          title="Exercise preferences"
          subtitle="Liked exercises come first. Disliked ones stay out of your plan."
        />

        {hintDismissed ? null : (
          <View style={styles.hint}>
            <Text style={styles.hintText}>Swipe right to like, left to dislike</Text>
            <Pressable hitSlop={10} accessibilityLabel="Dismiss tip" onPress={dismissHint}>
              <Text style={styles.hintClose}>✕</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.groups}>
          {GROUPS.map((item) => {
            const keys = CATALOG.filter((exercise) => exercise.group === item.group).map(
              (exercise) => exercise.key,
            )
            const liked = keys.filter((key) => likes.includes(key)).length
            const disliked = keys.filter((key) => dislikes.includes(key)).length
            const selected = item.group === group
            return (
              <Pressable
                key={item.group}
                style={[styles.group, selected && styles.groupSelected]}
                accessibilityState={{ selected }}
                accessibilityLabel={`${item.group}, ${liked} liked, ${disliked} disliked`}
                onPress={() => setGroup(item.group)}
              >
                <Image source={item.icon} style={styles.groupImage} contentFit="contain" />
                <Text style={styles.groupLabel}>{item.group}</Text>
                <Text style={styles.groupCount}>
                  {liked || disliked ? `♥ ${liked}  ✕ ${disliked}` : " "}
                </Text>
              </Pressable>
            )
          })}
        </View>

        <View style={styles.section}>
          <SectionHeading title={group} actionLabel={`${exercises.length} exercises`} />
          <View style={styles.list}>
            {exercises.map((exercise) => (
              <ExerciseRow key={exercise.key} exercise={exercise} status={status(exercise.key)} />
            ))}
          </View>
        </View>
      </Screen>

      {undo ? (
        <View
          style={[styles.toast, { bottom: 20 + insets.bottom }]}
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.toastText}>Preferences reset</Text>
          <Pressable
            hitSlop={10}
            onPress={() => {
              restore(undo)
              setUndo(null)
            }}
          >
            <Text style={styles.toastAction}>UNDO</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.accentTint,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: C.text,
  },
  hintClose: {
    fontSize: 12,
    color: C.textMuted,
  },
  groups: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  group: {
    width: "31%",
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },
  groupSelected: {
    borderColor: C.accent,
  },
  groupImage: {
    width: 26,
    height: 34,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  groupCount: {
    fontSize: 10,
    color: C.accent,
  },
  section: {
    gap: 8,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 58,
    backgroundColor: C.surface,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  rowLiked: {
    backgroundColor: C.accentTint,
    borderLeftColor: C.accent,
  },
  rowDisliked: {
    backgroundColor: C.card,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  rowTitleDisliked: {
    color: C.textMuted,
    textDecorationLine: "line-through",
  },
  rowSub: {
    fontSize: 11,
    color: C.textMuted,
  },
  heart: {
    fontSize: 20,
    color: C.textMuted,
  },
  heartOn: {
    color: C.accent,
  },
  action: {
    flex: 1,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  likeAction: {
    backgroundColor: C.accent,
    alignItems: "flex-start",
  },
  dislikeAction: {
    backgroundColor: C.textMuted,
    alignItems: "flex-end",
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.onAccent,
  },
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.text,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toastText: {
    fontSize: 13,
    color: C.onAccent,
  },
  toastAction: {
    fontSize: 13,
    fontWeight: "700",
    color: C.onAccent,
  },
})
