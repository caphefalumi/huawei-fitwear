import { PERIOD_AREA, type RecoveryPlan } from '@/features/health/health-store';

export type Routine = {
  name: string;
  sets: number;
  minutes: number;
  exercises: { name: string; prescription: string }[];
};

const CHEST: Routine = {
  name: 'Chest',
  sets: 9,
  minutes: 35,
  exercises: [
    { name: 'Bench press', prescription: '3x10' },
    { name: 'Incline dumbbell', prescription: '3x12' },
    { name: 'Cable fly', prescription: '3x12' },
  ],
};

const BACK: Routine = {
  name: 'Back',
  sets: 12,
  minutes: 40,
  exercises: [
    { name: 'Lat pulldown', prescription: '3x10' },
    { name: 'Seated cable row', prescription: '3x12' },
    { name: 'One-arm dumbbell row', prescription: '3x10' },
    { name: 'Face pull', prescription: '3x15' },
  ],
};

const LEGS: Routine = {
  name: 'Legs',
  sets: 12,
  minutes: 45,
  exercises: [
    { name: 'Goblet squat', prescription: '3x12' },
    { name: 'Romanian deadlift', prescription: '3x10' },
    { name: 'Leg press', prescription: '3x12' },
    { name: 'Calf raise', prescription: '3x15' },
  ],
};

const CORE: Routine = {
  name: 'Core',
  sets: 9,
  minutes: 20,
  exercises: [
    { name: 'Plank', prescription: '3x40s' },
    { name: 'Dead bug', prescription: '3x10' },
    { name: 'Bird dog', prescription: '3x10' },
  ],
};

const ARMS: Routine = {
  name: 'Arms',
  sets: 12,
  minutes: 30,
  exercises: [
    { name: 'Cable curl', prescription: '3x12' },
    { name: 'Triceps pushdown', prescription: '3x12' },
    { name: 'Hammer curl', prescription: '3x12' },
    { name: 'Rope pushdown', prescription: '3x15' },
  ],
};

const SEATED_CHEST: Routine = {
  name: 'Chest · seated & supported',
  sets: 9,
  minutes: 30,
  exercises: [
    { name: 'Machine chest press', prescription: '3x12' },
    { name: 'Seated incline press', prescription: '3x12' },
    { name: 'Pec deck', prescription: '3x12' },
  ],
};

const SEATED_BACK: Routine = {
  name: 'Back · seated machines',
  sets: 12,
  minutes: 35,
  exercises: [
    { name: 'Lat pulldown', prescription: '3x10' },
    { name: 'Seated cable row', prescription: '3x12' },
    { name: 'Machine row', prescription: '3x12' },
    { name: 'Face pull', prescription: '3x15' },
  ],
};

const LIGHT_MOVEMENT: Routine = {
  name: 'Light movement',
  sets: 6,
  minutes: 25,
  exercises: [
    { name: 'Easy walk', prescription: '15 min' },
    { name: 'Cat-cow', prescription: '2x10' },
    { name: 'Hip mobility', prescription: '2x8/side' },
  ],
};

const LIGHT_FULL_BODY: Routine = {
  name: 'Full body · light',
  sets: 6,
  minutes: 30,
  exercises: [
    { name: 'Goblet squat', prescription: '2x12' },
    { name: 'Dumbbell press', prescription: '2x12' },
    { name: 'Seated cable row', prescription: '2x12' },
  ],
};

export type RoutinePair = { today: Routine; next: Routine; adjustedFor: string | null };

/** Static routine set; swaps in routines that avoid the area recovering. */
export function routinesFor(recovery: RecoveryPlan | null): RoutinePair {
  if (!recovery) return { today: CHEST, next: BACK, adjustedFor: null };

  const adjustedFor = recovery.area.toLowerCase();
  switch (recovery.area) {
    case PERIOD_AREA:
      return { today: LIGHT_MOVEMENT, next: LIGHT_FULL_BODY, adjustedFor };
    case 'Lower back':
      return { today: SEATED_CHEST, next: ARMS, adjustedFor };
    case 'Right knee':
      return { today: SEATED_BACK, next: ARMS, adjustedFor };
    default:
      return { today: LEGS, next: CORE, adjustedFor };
  }
}
