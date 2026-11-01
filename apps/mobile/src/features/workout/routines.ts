import type { RecoveryPlan } from '@/features/health/health-store';
import type { Exercise } from '@/features/workout/workout-store';

export type RoutineExercise = Exercise & { prescription: string };
export type Routine = {
  id: string;
  name: string;
  sets: number;
  exercises: RoutineExercise[];
};

/** Plans use catalogue prescriptions, never seeded personal loads or measured durations. */
export function routineForGroup(group: string, catalog: Exercise[]): Routine | null {
  const exercises = catalog
    .filter((exercise) => exercise.muscleGroup.toLowerCase() === group.toLowerCase())
    .map((exercise) => ({
      ...exercise,
      prescription: `${exercise.defaultSets} × ${exercise.defaultReps} ${exercise.repetitionUnit}`,
    }));
  if (!exercises.length) return null;
  return {
    id: group.toLowerCase(),
    name: exercises[0].muscleGroup,
    sets: exercises.reduce((total, exercise) => total + exercise.defaultSets, 0),
    exercises,
  };
}

export type RoutinePair = { today: Routine | null; next: Routine | null };

export function routinesFor(recovery: RecoveryPlan | null, catalog: Exercise[]): RoutinePair {
  return {
    today: routineForGroup(recovery ? 'Recovery' : 'Chest', catalog),
    next: routineForGroup(recovery ? 'Core' : 'Back', catalog),
  };
}
