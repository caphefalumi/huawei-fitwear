export type ExerciseProgression = {
  exerciseId: string
  latestSessionId: string
  completedAt: string
  sets: { setIndex: number; weightKg: number; targetReps: number; userConfirmedReps: number }[]
  maxWeightKg: number
}

/** Add load only after completing every planned set at its target. */
export function nextLoad(history: ExerciseProgression, plannedSets: number, step: number): number {
  const sets = history.sets
  const last = sets[sets.length - 1]
  if (!last) return 0
  const succeeded =
    sets.length >= plannedSets && sets.every((set) => set.userConfirmedReps >= set.targetReps)
  return Math.min(1000, last.weightKg + (succeeded ? step : 0))
}
