import type { RecoveryPlan } from "@/features/health/health-store";
import type { Exercise } from "@/features/workout/workout-store";

export type RoutineExercise = Exercise & { prescription: string };
export type Routine = {
  id: string;
  name: string;
  sets: number;
  exercises: RoutineExercise[];
};

export const RECOVERY_ROUTINE = "Recovery";
const GROUP_ORDER = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core"];
const EQUIPMENT_RANK = ["bodyweight", "machine", "cable", "dumbbell", "barbell"];
const MAX_RECOVERY_EXERCISES = 4;
/** Muscle groups an injury area loads, so recovery routines leave them out. */
const AREA_GROUPS: Record<string, string[]> = {
  "Right shoulder": ["Shoulders", "Chest", "Back", "Arms"],
  "Left shoulder": ["Shoulders", "Chest", "Back", "Arms"],
  "Lower back": ["Back", "Legs"],
  "Right knee": ["Legs"],
};

export type RecoveryPhase = "rest" | "light" | "normal";

const dayNumber = (date: Date) =>
  Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);

/** Rest days come first, then light days; before the start or after the return it is normal. */
export function recoveryPhase(recovery: RecoveryPlan, now = new Date()): RecoveryPhase {
  const [year, month, day] = recovery.startDate.split("-").map(Number);
  const elapsed = dayNumber(now) - dayNumber(new Date(year, month - 1, day));
  if (!(elapsed >= 0)) return "normal";
  if (elapsed < recovery.restDays) return "rest";
  return elapsed < recovery.restDays + recovery.lightDays ? "light" : "normal";
}

/** Existing catalogue exercises at reduced volume, skipping muscle groups the injury loads. */
function recoveryRoutine(recovery: RecoveryPlan, catalog: Exercise[]): Routine | null {
  const skipped = (AREA_GROUPS[recovery.area] ?? []).map((group) => group.toLowerCase());
  const rank = (exercise: Exercise) =>
    Math.max(0, EQUIPMENT_RANK.indexOf(exercise.equipment.toLowerCase()));
  const exercises = GROUP_ORDER.filter((group) => !skipped.includes(group.toLowerCase()))
    .flatMap((group) => {
      const [easiest] = catalog
        .filter((exercise) => exercise.muscleGroup.toLowerCase() === group.toLowerCase())
        .sort((a, b) => rank(a) - rank(b));
      if (!easiest) return [];
      const defaultSets = Math.max(1, Math.ceil(easiest.defaultSets / 2));
      return [
        {
          ...easiest,
          defaultSets,
          prescription: `${defaultSets} × ${easiest.defaultReps} ${easiest.repetitionUnit} · easy effort`,
        },
      ];
    })
    .slice(0, MAX_RECOVERY_EXERCISES);
  if (!exercises.length) return null;
  return {
    id: RECOVERY_ROUTINE.toLowerCase(),
    name: RECOVERY_ROUTINE,
    sets: exercises.reduce((total, exercise) => total + exercise.defaultSets, 0),
    exercises,
  };
}

/** Plans use catalogue prescriptions, never seeded personal loads or measured durations. */
export function routineForGroup(
  group: string,
  catalog: Exercise[],
  recovery: RecoveryPlan | null = null,
): Routine | null {
  if (group.toLowerCase() === RECOVERY_ROUTINE.toLowerCase())
    return recovery ? recoveryRoutine(recovery, catalog) : null;
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

export type RoutinePair = { today: Routine | null; next: Routine | null; rest?: true };

export function routinesFor(
  recovery: RecoveryPlan | null,
  catalog: Exercise[],
  now = new Date(),
): RoutinePair {
  const phase = recovery ? recoveryPhase(recovery, now) : "normal";
  if (recovery && phase === "rest") return { today: null, next: null, rest: true };
  if (recovery && phase === "light")
    return { today: recoveryRoutine(recovery, catalog), next: null };
  return {
    today: routineForGroup("Chest", catalog),
    next: routineForGroup("Back", catalog),
  };
}
