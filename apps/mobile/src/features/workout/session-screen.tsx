import { router } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { Pressable } from "@/components/pressable"
import { BackHeader, Button, Card, PageHeading, Screen } from "@/components/ui"
import { useHealth } from "@/features/health"
import { useMarkInteractive } from "@/lib/observe"
import { Palette as C } from "@/theme"

import { routinesFor } from "./routines"

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function SessionScreen() {
  useMarkInteractive()
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
    <Screen contentStyle={styles.content}>
      <BackHeader label="Workout plan" onPress={() => router.back()} />

      <PageHeading
        title={`${today.name} session`}
        subtitle={`${formatElapsed(seconds)} · ${doneCount}/${today.exercises.length} done`}
      />

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

      <Button
        label={allDone ? "Finish workout" : "End session"}
        onPress={() => router.replace("/workout")}
        style={!allDone && styles.primaryButtonIdle}
      />
      {/* ponytail: session completion is not persisted; wire to a store when history matters. */}
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
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
  primaryButtonIdle: {
    opacity: 0.85,
  },
})
