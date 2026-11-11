import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, PageHeading, Screen } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { Palette as C } from "@/theme"

import { capitalize, EQUIPMENT_LABELS, exercisesIn, groupFromParam } from "../utils/muscle-groups"

const icons = {
  play: require("@/assets/images/workout/play.svg"),
}

/** Every exercise in one muscle group, as a library to learn from. */
export function GroupPlanScreen() {
  useMarkInteractive()
  const { group: param } = useLocalSearchParams<{ group?: string }>()
  const group = groupFromParam(param)
  const exercises = exercisesIn(group)

  return (
    <Screen contentStyle={styles.content}>
      <BackHeader label="Workout plan" onPress={() => router.back()} />
      <PageHeading
        title={group}
        subtitle={`${exercises.length} exercises. Tap one to see how it's done.`}
      />

      <View style={styles.list}>
        {exercises.map((exercise, index) => (
          <Pressable
            key={exercise.key}
            style={[styles.row, index > 0 && styles.rowDivider]}
            accessibilityLabel={exercise.name}
            accessibilityHint="Opens the technique guide"
            onPress={() => router.push(`/exercise-guide?name=${exercise.key}`)}
          >
            <View style={styles.thumb}>
              <Image
                accessible={false}
                source={icons.play}
                style={styles.thumbIcon}
                contentFit="contain"
                tintColor={C.onAccent}
              />
            </View>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>{exercise.name}</Text>
              <Text style={styles.rowSub}>
                {capitalize(exercise.muscles[0] ?? group)} - {EQUIPMENT_LABELS[exercise.equipment]}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
  },
  list: {
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  thumb: {
    width: 56,
    height: 42,
    borderRadius: 10,
    backgroundColor: C.video,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbIcon: {
    width: 14,
    height: 14,
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
  rowSub: {
    fontSize: 12,
    color: C.textMuted,
  },
  chevron: {
    fontSize: 20,
    color: C.track,
  },
})
