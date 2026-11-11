import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Button, PageHeading, Screen } from "@/components/ui"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Pressable } from "@/components/ui/pressable"
import { dateKey } from "@/features/health"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { usePlanNow } from "@/lib/time/demo-clock"
import { Palette as C } from "@/theme"

import { usePlanInput } from "../store/plan-preferences.store"
import { formatLoad, loadUnit, useLoads } from "../store/training-weights.store"
import { backToBackFullBody, useWorkoutLog } from "../store/workout-log.store"
import { findExercise } from "../utils/catalog"
import { fromDateKey, routineOn, type RoutineExercise } from "../utils/routines"

export const formatRest = (seconds: number) =>
  seconds % 60
    ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
    : `${seconds / 60} min`

function ExerciseRow({ exercise, index }: { exercise: RoutineExercise; index: number }) {
  const { loadFor } = useLoads()
  const catalog = findExercise(exercise.key)
  const load = catalog ? loadFor(catalog) : null
  const weight = load && catalog ? `${formatLoad(load.kg)} ${loadUnit(catalog)}` : "Body weight"
  const target = exercise.prescription.split("x")[1]
  const reps = exercise.unit === "seconds" ? target : `${target} reps`

  return (
    <Pressable
      style={[styles.row, index > 0 && styles.rowDivider]}
      accessibilityLabel={`${exercise.name}, ${exercise.sets} sets of ${reps}, ${weight}`}
      accessibilityHint="Opens the technique guide"
      onPress={() => router.push(`/exercise-guide?name=${exercise.key}`)}
    >
      <Text style={styles.index}>{String(index + 1).padStart(2, "0")}</Text>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>
          {exercise.name}
          {exercise.liked ? <Text style={styles.liked}> ♥</Text> : null}
        </Text>
        <Text style={styles.rowSub}>
          {exercise.sets} sets x {reps}
        </Text>
        <Text style={styles.rowSub}>
          {weight} - Rest {formatRest(exercise.rest)}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  )
}

/** One day's routine, with Start workout. Any training day can start, with a warning for back-to-back full body. */
export function RoutineScreen() {
  useMarkInteractive()
  const { date: param } = useLocalSearchParams<{ date?: string }>()
  const now = usePlanNow()
  const date = fromDateKey(param) ?? now
  const input = usePlanInput()
  const routine = routineOn(date, input)
  const finished = useWorkoutLog((state) => state.finished)
  const [warning, setWarning] = useState(false)
  const isToday = dateKey(date) === dateKey(now)
  const key = dateKey(date)
  const day = isToday
    ? "Today"
    : date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })

  const start = () => router.push(`/session?date=${key}`)

  return (
    <View style={styles.container}>
      <Screen contentStyle={styles.content}>
        <BackHeader label="Workout plan" onPress={() => router.back()} />
        <PageHeading
          eyebrow={day}
          title={routine.name}
          subtitle={routine.exercises.length ? `About ${routine.minutes} min` : undefined}
        />

        {routine.exercises.length ? (
          <>
            <View style={styles.list}>
              {routine.exercises.map((exercise, index) => (
                <ExerciseRow key={exercise.key} exercise={exercise} index={index} />
              ))}
            </View>
            <Text style={styles.hint}>Tap an exercise to see how it's done.</Text>
            <Button
              label="Start workout"
              onPress={() =>
                backToBackFullBody(routine.name, now, input, finished) ? setWarning(true) : start()
              }
            />
          </>
        ) : (
          <View style={styles.rest}>
            <Text style={styles.restText}>Rest and recover.</Text>
          </View>
        )}
      </Screen>

      <ConfirmDialog
        visible={warning}
        title="Full body two days in a row?"
        message="Muscles need about 48 hours to recover. Training full body on back-to-back days raises the risk of injury."
        cancelLabel="Not today"
        confirmLabel="Start anyway"
        onCancel={() => setWarning(false)}
        onConfirm={() => {
          setWarning(false)
          start()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
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
    minHeight: 72,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  index: {
    fontSize: 12,
    color: C.textMuted,
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
  liked: {
    color: C.accent,
  },
  rowSub: {
    fontSize: 12,
    color: C.textMuted,
  },
  chevron: {
    fontSize: 20,
    color: C.track,
  },
  hint: {
    fontSize: 12,
    color: C.textMuted,
    textAlign: "center",
  },
  rest: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 20,
  },
  restText: {
    fontSize: 14,
    color: C.text,
  },
})
