import { useMemo, useRef, useState } from "react"
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native"
import { useReducedMotion } from "react-native-reanimated"

import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

import type { MealItem } from "../hooks/meals-hooks"
import { Glyph } from "./meals-ui"

const ACTION_WIDTH = 88

type SwipeState = "edit" | "delete" | null

export function MealRow({
  item,
  last,
  onPress,
  onEdit,
  onDelete,
}: {
  item: MealItem
  last: boolean
  onPress: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const [state, setState] = useState<SwipeState>(null)
  const translateX = useRef(new Animated.Value(0)).current
  const reducedMotion = useReducedMotion()

  const settle = (next: SwipeState) => {
    setState(next)
    if (reducedMotion) {
      translateX.setValue(next === "edit" ? -ACTION_WIDTH : next === "delete" ? ACTION_WIDTH : 0)
      return
    }
    Animated.timing(translateX, {
      toValue: next === "edit" ? -ACTION_WIDTH : next === "delete" ? ACTION_WIDTH : 0,
      duration: 160,
      useNativeDriver: true,
    }).start()
  }

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderMove: (_, gesture) => {
          translateX.setValue(Math.max(-ACTION_WIDTH, Math.min(ACTION_WIDTH, gesture.dx)))
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -ACTION_WIDTH / 2) settle("edit")
          else if (gesture.dx > ACTION_WIDTH / 2) settle("delete")
          else settle(null)
        },
      }),
    // settle/translateX are stable for the lifetime of the row
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const content = (
    <>
      <Glyph glyph={item.glyph} />
      <View style={styles.rowText}>
        <View style={styles.rowTop}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemKcal}>{item.kcal} kcal</Text>
        </View>
        <Text style={styles.itemDetail}>{item.detail}</Text>
        <Text style={styles.itemMacros}>
          Protein {item.macros.protein}g · Carbs {item.macros.carbs}g · Fat {item.macros.fat}g
        </Text>
      </View>
    </>
  )

  return (
    <View style={[styles.rowWrap, !last && styles.rowDivider]}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.rowActions}
      >
        <Pressable
          style={styles.deleteAction}
          onPress={() => {
            settle(null)
            onDelete()
          }}
        >
          <Text style={styles.deleteActionLabel}>Delete</Text>
        </Pressable>
        <Pressable
          style={styles.editAction}
          onPress={() => {
            settle(null)
            onEdit()
          }}
        >
          <Text style={styles.editActionLabel}>Edit</Text>
        </Pressable>
      </View>

      <Animated.View
        style={[styles.rowSurface, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Pressable
          style={styles.row}
          accessibilityLabel={`${item.name}, ${item.detail}, ${item.kcal} kilocalories, protein ${item.macros.protein} grams, carbs ${item.macros.carbs} grams, fat ${item.macros.fat} grams`}
          accessibilityHint="Opens food options"
          accessibilityActions={[
            { name: "edit", label: `Edit ${item.name}` },
            { name: "delete", label: `Delete ${item.name}` },
          ]}
          onAccessibilityAction={({ nativeEvent }) => {
            if (nativeEvent.actionName === "edit") onEdit()
            if (nativeEvent.actionName === "delete") onDelete()
          }}
          onPress={() => {
            if (state) settle(null)
            else onPress()
          }}
        >
          {content}
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  rowWrap: {
    overflow: "hidden",
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowActions: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteAction: {
    width: ACTION_WIDTH,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteActionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.onAccent,
  },
  editAction: {
    width: ACTION_WIDTH,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
  },
  editActionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.accent,
  },
  rowSurface: {
    backgroundColor: C.surface,
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 13,
    flexShrink: 1,
    fontWeight: "600",
    color: C.text,
  },
  itemKcal: {
    fontSize: 12,
    fontWeight: "600",
    color: C.text,
  },
  itemDetail: {
    fontSize: 10,
    color: C.textMuted,
  },
  itemMacros: {
    fontSize: 10,
    color: C.textMuted,
    marginTop: 4,
  },
})
