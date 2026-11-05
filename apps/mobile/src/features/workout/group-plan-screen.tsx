import { router, useLocalSearchParams } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Button, Card, PageHeading, Screen, SectionHeading } from "@/components/ui"
import { Palette as C } from "@/theme"
import { GROUP_ROUTINES } from "@/features/workout/routines"

export function GroupPlanScreen() {
  const { group } = useLocalSearchParams<{ group?: string }>()
  const routine = GROUP_ROUTINES[group ?? ""] ?? GROUP_ROUTINES.chest

  return (
    <Screen contentStyle={styles.content}>
      <BackHeader label="Workout plan" onPress={() => router.back()} />

      <PageHeading
        eyebrow={`${routine.name} plan`}
        title={routine.name}
        subtitle={`${routine.exercises.length} exercises · ${routine.sets} sets · ${routine.minutes} min`}
      />

      <View style={styles.section}>
        <SectionHeading title="Exercises" actionLabel={`${routine.exercises.length} moves`} />
        <Card>
          <View style={styles.exerciseList}>
            {routine.exercises.map((exercise) => (
              <View key={exercise.name} style={styles.exerciseRow}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exercisePrescription}>{exercise.prescription}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <Button label="Start workout" onPress={() => router.push("/session")} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
  },
  section: {
    gap: 8,
  },
  exerciseList: {
    gap: 8,
    paddingTop: 4,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseName: {
    fontSize: 12,
    color: C.text,
  },
  exercisePrescription: {
    fontSize: 12,
    color: C.textMuted,
  },
})
