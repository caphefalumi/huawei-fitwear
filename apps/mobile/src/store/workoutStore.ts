import { create } from 'zustand';
import {
  PlanDoc,
  WorkoutSessionDoc,
  SetDoc,
  ExerciseDoc,
  GoalType,
  Timestamp
} from '../types/types';
import { initialPlan, initialPastSessions, initialExercises } from '../mocks/mockData';
import { planService } from '../services/planService';
import { workoutService } from '../services/workoutService';

interface WorkoutState {
  plan: PlanDoc | null;
  history: WorkoutSessionDoc[];
  exercises: ExerciseDoc[];
  activeSession: WorkoutSessionDoc | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restSecondsRemaining: number;
  loading: boolean;

  loadPlanAndHistory: () => Promise<void>;
  generatePlan: (goal: GoalType) => Promise<PlanDoc>;
  updatePlan: (updates: Partial<PlanDoc>) => Promise<void>;
  startWorkout: (dayIndex?: number) => void;
  incrementRep: (isWatch?: boolean) => void;
  updateSet: (reps: number, weightKg: number) => void;
  completeCurrentSet: () => void;
  skipRest: () => void;
  addRestSeconds: (seconds: number) => void;
  tickRest: () => void;
  endWorkout: () => Promise<WorkoutSessionDoc | null>;
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  plan: { ...initialPlan },
  history: [...initialPastSessions],
  exercises: [...initialExercises],
  activeSession: null,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  isResting: false,
  restSecondsRemaining: 90,
  loading: false,

  loadPlanAndHistory: async () => {
    set({ loading: true });
    try {
      const [plan, history] = await Promise.all([
        planService.getActivePlan(),
        workoutService.getWorkoutHistory()
      ]);
      set({ plan, history, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  generatePlan: async (goal: GoalType) => {
    set({ loading: true });
    const generated = await planService.generatePlan(goal);
    set({ plan: generated, loading: false });
    return generated;
  },

  updatePlan: async (updates) => {
    const updated = await planService.updatePlan(updates);
    set({ plan: updated });
  },

  startWorkout: (dayIndex?: number) => {
    const plan = get().plan;
    const targetDayIndex = dayIndex !== undefined ? dayIndex : (plan?.currentDayIndex || 0);
    const day = plan?.days[targetDayIndex];

    const exerciseDocs = get().exercises;
    const sessionExercises = (day?.exercises || []).map((pe) => {
      const doc = exerciseDocs.find((e) => e.id === pe.exerciseId);
      const sets: SetDoc[] = Array.from({ length: pe.sets }).map((_, i) => ({
        id: `set_${pe.exerciseId}_${i + 1}`,
        setNumber: i + 1,
        targetReps: pe.repRange.min,
        completedReps: 0,
        weightKg: pe.targetWeightKg,
        restSeconds: pe.restSeconds,
        completed: false,
        countedBy: 'watch'
      }));

      return {
        exerciseId: pe.exerciseId,
        exerciseName: doc?.name || 'Exercise',
        muscleGroup: day?.muscleGroup || 'Chest',
        sets
      };
    });

    const newSession: WorkoutSessionDoc = {
      id: `session_live_${Date.now()}`,
      userId: plan?.userId || 'user_default',
      planId: plan?.id,
      planDayId: day?.id,
      title: day?.title || 'Workout Session',
      date: Timestamp.toDateString(),
      startTime: Timestamp.now(),
      durationSeconds: 0,
      exercises: sessionExercises,
      totalVolumeKg: 0,
      totalSets: sessionExercises.reduce((acc, curr) => acc + curr.sets.length, 0),
      totalReps: 0,
      isCompleted: false,
      syncedToWatch: true
    };

    set({
      activeSession: newSession,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      isResting: false,
      restSecondsRemaining: 90
    });
  },

  incrementRep: (isWatch = true) => {
    const session = get().activeSession;
    if (!session) return;

    const { currentExerciseIndex, currentSetIndex } = get();
    const exercises = [...session.exercises];
    const currentEx = exercises[currentExerciseIndex];
    if (!currentEx) return;

    const sets = [...currentEx.sets];
    const currentSet = { ...sets[currentSetIndex] };
    if (!currentSet || currentSet.completed) return;

    currentSet.completedReps += 1;
    currentSet.countedBy = isWatch ? 'watch' : 'manual';
    sets[currentSetIndex] = currentSet;
    exercises[currentExerciseIndex] = { ...currentEx, sets };

    // Auto-completion if rep window reached (e.g., 10 reps)
    if (currentSet.completedReps >= currentSet.targetReps) {
      currentSet.completed = true;
      currentSet.completedAt = Timestamp.now();
      sets[currentSetIndex] = currentSet;
      exercises[currentExerciseIndex] = { ...currentEx, sets };

      const totalReps = session.totalReps + 1;
      const totalVolumeKg = session.totalVolumeKg + currentSet.weightKg;

      set({
        activeSession: { ...session, exercises, totalReps, totalVolumeKg },
        isResting: true,
        restSecondsRemaining: currentSet.restSeconds || 90
      });
      return;
    }

    set({
      activeSession: {
        ...session,
        exercises,
        totalReps: session.totalReps + 1,
        totalVolumeKg: session.totalVolumeKg + currentSet.weightKg
      }
    });
  },

  updateSet: (reps: number, weightKg: number) => {
    const session = get().activeSession;
    if (!session) return;

    const { currentExerciseIndex, currentSetIndex } = get();
    const exercises = [...session.exercises];
    const currentEx = exercises[currentExerciseIndex];
    if (!currentEx) return;

    const sets = [...currentEx.sets];
    const currentSet = { ...sets[currentSetIndex], completedReps: reps, weightKg };
    sets[currentSetIndex] = currentSet;
    exercises[currentExerciseIndex] = { ...currentEx, sets };

    const totalReps = exercises.reduce(
      (acc, ex) => acc + ex.sets.reduce((sAcc, s) => sAcc + s.completedReps, 0),
      0
    );
    const totalVolumeKg = exercises.reduce(
      (acc, ex) =>
        acc + ex.sets.reduce((sAcc, s) => sAcc + s.completedReps * s.weightKg, 0),
      0
    );

    set({ activeSession: { ...session, exercises, totalReps, totalVolumeKg } });
  },

  completeCurrentSet: () => {
    const session = get().activeSession;
    if (!session) return;

    const { currentExerciseIndex, currentSetIndex } = get();
    const exercises = [...session.exercises];
    const currentEx = exercises[currentExerciseIndex];
    if (!currentEx) return;

    const sets = [...currentEx.sets];
    const currentSet = { ...sets[currentSetIndex] };
    currentSet.completed = true;
    currentSet.completedAt = Timestamp.now();
    if (currentSet.completedReps === 0) {
      currentSet.completedReps = currentSet.targetReps;
    }
    sets[currentSetIndex] = currentSet;
    exercises[currentExerciseIndex] = { ...currentEx, sets };

    const totalVolumeKg =
      session.totalVolumeKg + currentSet.completedReps * currentSet.weightKg;

    set({
      activeSession: { ...session, exercises, totalVolumeKg },
      isResting: true,
      restSecondsRemaining: currentSet.restSeconds || 90
    });
  },

  skipRest: () => {
    const session = get().activeSession;
    if (!session) return;

    const { currentExerciseIndex, currentSetIndex } = get();
    const exercises = session.exercises;
    const currentEx = exercises[currentExerciseIndex];

    let nextExIndex = currentExerciseIndex;
    let nextSetIndex = currentSetIndex + 1;

    if (currentEx && nextSetIndex >= currentEx.sets.length) {
      nextExIndex += 1;
      nextSetIndex = 0;
    }

    set({
      isResting: false,
      currentExerciseIndex: nextExIndex,
      currentSetIndex: nextSetIndex
    });
  },

  addRestSeconds: (seconds: number) => {
    set((state) => ({
      restSecondsRemaining: state.restSecondsRemaining + seconds
    }));
  },

  tickRest: () => {
    const current = get().restSecondsRemaining;
    if (current <= 1) {
      get().skipRest();
    } else {
      set({ restSecondsRemaining: current - 1 });
    }
  },

  endWorkout: async () => {
    const session = get().activeSession;
    if (!session) return null;

    const endTime = Timestamp.now();
    const durationSeconds = Math.max(
      Math.round((endTime - session.startTime) / 1000),
      300
    );

    const completedSession: WorkoutSessionDoc = {
      ...session,
      endTime,
      durationSeconds,
      isCompleted: true,
      syncedToWatch: true
    };

    const saved = await workoutService.saveWorkoutSession(completedSession);
    await planService.advanceDay();
    const updatedPlan = await planService.getActivePlan();

    set({
      activeSession: null,
      history: [saved, ...get().history],
      plan: updatedPlan,
      isResting: false
    });

    return saved;
  },

  resetWorkout: () => {
    workoutService.reset();
    planService.reset();
    set({
      plan: { ...initialPlan },
      history: [...initialPastSessions],
      exercises: [...initialExercises],
      activeSession: null,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      isResting: false,
      restSecondsRemaining: 90
    });
  }
}));
