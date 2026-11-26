import { DayInfo, WorkoutPlan } from '../link/SyncProtocol';

/** Shown until the phone sends its plan. */
export const NO_PLAN: WorkoutPlan = { name: '', minutes: 0, exercises: [] };

/** Lets debug builds be tried without a phone. Release builds start with NO_PLAN. */
export const SAMPLE_PLAN: WorkoutPlan = {
  name: 'Chest',
  minutes: 40,
  exercises: [
    {
      key: 'machine-chest-press',
      name: 'Chest press',
      sets: 3,
      reps: 12,
      unit: 'reps',
      rest: 60,
      superset: '',
    },
    { key: 'push-up', name: 'Push-up', sets: 3, reps: 10, unit: 'reps', rest: 60, superset: '' },
    {
      key: 'cable-chest-fly',
      name: 'Chest fly',
      sets: 3,
      reps: 12,
      unit: 'reps',
      rest: 60,
      superset: '',
    },
    {
      key: 'incline-dumbbell-press',
      name: 'Incline press',
      sets: 3,
      reps: 10,
      unit: 'reps',
      rest: 90,
      superset: '',
    },
    { key: 'pec-deck', name: 'Pec deck', sets: 3, reps: 12, unit: 'reps', rest: 60, superset: '' },
  ],
};

/** Debug builds only, like SAMPLE_PLAN. The date is filled in when it is used. */
export const SAMPLE_DAY: DayInfo = {
  date: '',
  owner: 'sample',
  kcalTarget: 2000,
  kcalEaten: 760,
  target: { protein: 120, carbs: 220, fat: 65 },
  eaten: { protein: 66, carbs: 154, fat: 23 },
  favorites: [
    { ref: 'sample-1', name: 'Chicken rice', kcal: 520, protein: 35, carbs: 60, fat: 12 },
    { ref: 'sample-2', name: 'Beef pho', kcal: 450, protein: 30, carbs: 55, fat: 11 },
  ],
  applied: [],
};
