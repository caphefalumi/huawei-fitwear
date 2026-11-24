import { useMemo, useRef, useState } from "react"
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native"
import { useReducedMotion } from "react-native-reanimated"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

import { mealTypeLabel, type MealLog } from "../hooks/meals-hooks"
import { mealTitle } from "../utils/meal-journal"
import { MealPhoto } from "./meal-photo"

const ACTION_WIDTH = 88

/** A logged meal: tap to open it, swipe left to reveal Delete when `onDelete` is set. */
export function MealHistoryCard({
  meal,
  onPress,
  onDelete,
}: {
  meal: MealLog
  onPress: () => void
  onDelete?: () => void
}) {
  // The Delete action is mounted only while a swipe shows it, so a tap's press
  // feedback never lets it show through the card.
  const [revealed, setRevealed] = useState(false)
  const [open, setOpen] = useState(false)
  const translateX = useRef(new Animated.Value(0)).current
  const reducedMotion = useReducedMotion()
  const title = mealTitle(meal)
  const type = mealTypeLabel(meal.mealType)

  const settle = (next: boolean) => {
    setOpen(next)
    const toValue = next ? -ACTION_WIDTH : 0
    const done = () => {
      if (!next) setRevealed(false)
    }
    if (reducedMotion) {
      translateX.setValue(toValue)
      done()
    } else
      Animated.timing(translateX, { toValue, duration: 160, useNativeDriver: true }).start(done)
  }

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderGrant: () => setRevealed(true),
        onPanResponderMove: (_, gesture) => {
          translateX.setValue(Math.max(-ACTION_WIDTH, Math.min(0, gesture.dx)))
        },
        onPanResponderRelease: (_, gesture) => settle(gesture.dx < -ACTION_WIDTH / 2),
        onPanResponderTerminate: () => settle(false),
      }),
    // settle and translateX are stable for the lifetime of the card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <View style={styles.wrap} testID={`meal-card-${meal.id}`}>
      {onDelete && revealed ? (
        <View style={styles.actions}>
          <Pressable
            style={styles.deleteAction}
            accessibilityLabel={`Delete ${title}`}
            onPress={() => {
              settle(false)
              onDelete()
            }}
          >
            <Text style={styles.deleteLabel}>Delete</Text>
          </Pressable>
        </View>
      ) : null}

      <Animated.View
        style={[styles.surface, { transform: [{ translateX }] }]}
        {...(onDelete ? panResponder.panHandlers : {})}
      >
        <Pressable
          style={styles.card}
          accessibilityRole="button"
          accessibilityLabel={`${title}, ${type} at ${meal.time}, ${meal.kcal} kilocalories`}
          accessibilityHint="Opens the meal"
          accessibilityActions={onDelete ? [{ name: "delete", label: "Delete meal" }] : undefined}
          onAccessibilityAction={({ nativeEvent }) => {
            if (nativeEvent.actionName === "delete") onDelete?.()
          }}
          onPress={() => {
            if (open) settle(false)
            else onPress()
          }}
        >
          <MealPhoto
            mealId={meal.id}
            mealName={title}
            imageUrl={meal.imageUrl}
            photoUnavailableOffline={meal.photoUnavailableOffline}
            style={styles.photo}
            compact
            interactive={false}
          />
          <View style={styles.copy}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.meta}>
              {meal.time} - {type}
            </Text>
          </View>
          <View style={styles.energy}>
            <Text style={styles.kcal}>{meal.kcal}</Text>
            <Text style={styles.kcalUnit}>kcal</Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 18,
    overflow: "hidden",
  },
  actions: {
    ...StyleSheet.absoluteFill,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deleteAction: {
    width: ACTION_WIDTH,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.onAccent,
  },
  surface: {
    zIndex: 1,
    borderRadius: 18,
    backgroundColor: C.background,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 92,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: C.card,
  },
  copy: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: C.text,
  },
  meta: {
    fontSize: 12,
    color: C.textMuted,
  },
  energy: {
    alignItems: "flex-end",
    minWidth: 48,
  },
  kcal: {
    fontSize: 17,
    fontWeight: "600",
    color: C.text,
  },
  kcalUnit: {
    fontSize: 11,
    color: C.textMuted,
  },
})
