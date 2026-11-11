import { create } from "zustand"

import { dateKey } from "@/features/health"

import { routineOn, type PlanInput } from "../utils/routines"

export type FinishedWorkout = { date: string; routine: string }

type WorkoutLogState = {
  finished: FinishedWorkout[]
  add: (workout: FinishedWorkout) => void
}

/** Session-scoped mock of finished workouts until history is stored on the server. */
export const useWorkoutLog = create<WorkoutLogState>((set) => ({
  finished: [],
  add: (workout) => set((state) => ({ finished: [...state.finished, workout] })),
}))

const isFullBody = (routine: string) => routine.startsWith("Full Body")

const shift = (date: Date, days: number) => {
  const shifted = new Date(date)
  shifted.setDate(date.getDate() + days)
  return shifted
}

/**
 * True when starting this full-body routine today would mean full body on two days in a row:
 * one was finished yesterday, or tomorrow's plan is full body too.
 */
export function backToBackFullBody(
  routine: string,
  today: Date,
  input: PlanInput,
  finished: FinishedWorkout[],
) {
  if (!isFullBody(routine)) return false
  const yesterday = dateKey(shift(today, -1))
  return (
    finished.some((workout) => workout.date === yesterday && isFullBody(workout.routine)) ||
    isFullBody(routineOn(shift(today, 1), input).name)
  )
}
