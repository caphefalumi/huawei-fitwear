import { DayTotals, Food } from '../quicklog/FoodDay';
import { WorkoutPlan } from '../workout/WorkoutSession';

/**
 * Placeholder values from the wireframe. The phone does not send these yet;
 * replace this file's exports with synced data when it does.
 */
export const SAMPLE_PLAN: WorkoutPlan = {
  group: 'Chest',
  minutes: 40,
  exercises: [
    { name: 'Chest press', sets: 3, reps: 12, restSeconds: 60 },
    { name: 'Push-up', sets: 3, reps: 10, restSeconds: 60 },
    { name: 'Chest fly', sets: 3, reps: 12, restSeconds: 60 },
    { name: 'Incline press', sets: 3, reps: 10, restSeconds: 90 },
    { name: 'Cable crossover', sets: 3, reps: 12, restSeconds: 60 },
  ],
};

export const SAMPLE_DAY: DayTotals = {
  kcalTarget: 2000,
  kcalEaten: 760,
  target: { protein: 120, carbs: 220, fat: 65 },
  eaten: { protein: 66, carbs: 154, fat: 23 },
};

export const SAMPLE_FAVORITES: Food[] = [
  { name: 'Chicken rice with broccoli', kcal: 520, macros: { protein: 35, carbs: 60, fat: 12 } },
  { name: 'Oatmeal with banana', kcal: 340, macros: { protein: 11, carbs: 62, fat: 6 } },
  { name: 'Beef pho', kcal: 450, macros: { protein: 30, carbs: 55, fat: 11 } },
  { name: 'Greek yogurt', kcal: 150, macros: { protein: 15, carbs: 12, fat: 4 } },
  { name: 'Protein shake', kcal: 180, macros: { protein: 30, carbs: 8, fat: 3 } },
];
