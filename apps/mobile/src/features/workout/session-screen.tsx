import { router } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/pressable"
import { Palette as C } from "@/constants/palette"
import { useHealth } from "@/features/health/health-store"
import { BackHeader, Card } from "@/features/home/ui"
import { routinesFor } from "@/features/workout/routines"

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function SessionScreen() {
  const insets = useSafeAreaInsets()
  const { recovery } = useHealth()
  const { today } = routinesFor(recovery)
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const doneCount = today.exercises.filter((exercise) => done[exercise.name]).length
  const allDone = doneCount === today.exercises.length

  function toggle(name: string) {
    setDone((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}
    >
      <BackHeader label="Workout plan" onPress={() => router.back()} />

      <View style={styles.heading}>
        <Text style={styles.title}>{today.name} session</Text>
        <Text style={styles.subtitle}>
          {formatElapsed(seconds)} · {doneCount}/{today.exercises.length} done
        </Text>
      </View>

      <Card>
        <View style={styles.exerciseList}>
          {today.exercises.map((exercise) => {
            const checked = !!done[exercise.name]
            return (
              <Pressable
                key={exercise.name}
                style={styles.exerciseRow}
                onPress={() => toggle(exercise.name)}
              >
                <View style={[styles.check, checked && styles.checkDone]}>
                  {checked ? <View style={styles.checkMark} /> : null}
                </View>
                <Text style={[styles.exerciseName, checked && styles.exerciseDone]}>
                  {exercise.name}
                </Text>
                <Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
              </Pressable>
            )
          })}
        </View>
      </Card>

      <Pressable
        style={[styles.primaryButton, !allDone && styles.primaryButtonIdle]}
        onPress={() => router.replace("/workout")}
      >
        <Text style={styles.primaryLabel}>{allDone ? "Finish workout" : "End session"}</Text>
      </Pressable>
      {/* ponytail: session completion is not persisted; wire to a store when history matters. */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 14,
  },
  heading: {
    gap: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: C.text,
  },
  subtitle: {
    fontSize: 13,
    color: C.textMuted,
  },
  exerciseList: {
    gap: 4,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  checkMark: {
    width: 10,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: C.onAccent,
    transform: [{ rotate: "-45deg" }, { translateY: -1 }],
  },
  exerciseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  exerciseDone: {
    color: C.textMuted,
    textDecorationLine: "line-through",
  },
  exercisePrescription: {
    fontSize: 12,
    color: C.textMuted,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonIdle: {
    opacity: 0.85,
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: C.onAccent,
  },
})
