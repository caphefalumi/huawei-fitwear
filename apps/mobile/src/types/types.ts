/**
 * AI FitWear - Domain Data Types & Document Contracts
 * Strictly typed interfaces matching the mock database schema.
 */

export type GoalType = 'lose_fat' | 'build_muscle' | 'maintain';
export type SexType = 'male' | 'female' | 'other';
export type ActivityLevel = 'low' | 'moderate' | 'high';
export type UnitSystem = 'metric' | 'imperial';
export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Abs';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'bodyweight' | 'dumbbell' | 'barbell' | 'cable' | 'machine';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type AdherenceStatus = 'ON_TRACK' | 'ALMOST_THERE' | 'OVER_TARGET';
export type ConnectionStatus = 'connected' | 'syncing' | 'offline' | 'not_paired' | 'error';

export interface UserDoc {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: string; // YYYY-MM-DD
  sex: SexType;
  heightCm: number;
  weightKg: number;
  goal: GoalType;
  activityLevel: ActivityLevel;
  bmr: number;
  tdee: number;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbsTarget: number;
  dailyFatTarget: number;
  unitSystem: UnitSystem;
  repWindow: {
    min: number;
    max: number;
  };
  defaultRestSeconds: number;
  hapticRestBuzz: boolean;
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface MealItem {
  id: string;
  foodId?: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence?: ConfidenceLevel;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface MealDoc {
  id: string;
  userId: string;
  type: MealType;
  time: string; // HH:mm format
  date: string; // YYYY-MM-DD
  imageUrl?: string;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  syncedToWatch: boolean;
  createdAt: number;
}

export interface FoodDoc {
  id: string;
  name: string;
  nameVi?: string;
  servingGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'protein' | 'carbs' | 'fat' | 'produce' | 'dairy' | 'dish';
}

export interface SetDoc {
  id: string;
  setNumber: number;
  targetReps: number;
  completedReps: number;
  weightKg: number;
  restSeconds: number;
  completed: boolean;
  countedBy: 'watch' | 'manual';
  completedAt?: number;
}

export interface PlanExercise {
  id: string;
  exerciseId: string;
  sets: number;
  repRange: {
    min: number;
    max: number;
  };
  restSeconds: number;
  targetWeightKg: number;
}

export interface PlanDay {
  id: string;
  dayNumber: number;
  muscleGroup: MuscleGroup;
  title: string;
  exercises: PlanExercise[];
  estimatedDurationMin: number;
}

export interface PlanDoc {
  id: string;
  userId: string;
  title: string;
  goal: GoalType;
  days: PlanDay[];
  currentCycle: number;
  currentDayIndex: number;
  isActive: boolean;
  syncedToWatch: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ExerciseDoc {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  equipment: Equipment;
  description: string;
  formCues: string[];
  commonMistakes: string[];
  videoPlaceholderUrl?: string;
  watchAnimationPlaceholder?: string;
}

export interface WorkoutSessionExercise {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  sets: SetDoc[];
}

export interface WorkoutSessionDoc {
  id: string;
  userId: string;
  planId?: string;
  planDayId?: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: number;
  endTime?: number;
  durationSeconds: number;
  exercises: WorkoutSessionExercise[];
  totalVolumeKg: number;
  totalSets: number;
  totalReps: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  isCompleted: boolean;
  syncedToWatch: boolean;
}

export interface DailySummaryDoc {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  caloriesConsumed: number;
  calorieTarget: number;
  proteinConsumed: number;
  proteinTarget: number;
  carbsConsumed: number;
  carbsTarget: number;
  fatConsumed: number;
  fatTarget: number;
  status: AdherenceStatus;
  workoutsCompleted: number;
  totalVolumeKg: number;
  currentStreak: number;
}

export interface DeviceDoc {
  id: string;
  name: string;
  type: 'watch' | 'phone';
  model: string;
  appVersion: string;
  batteryLevel: number;
  lastSyncTime: number;
  connectionStatus: ConnectionStatus;
  pendingSyncCount: number;
}

export interface BodyMeasurementDoc {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  notes?: string;
}

/**
 * Timestamp utilities for mock dates and relative freshness
 */
export const Timestamp = {
  now(): number {
    return Date.now();
  },
  fromDate(date: Date | string): number {
    return new Date(date).getTime();
  },
  toDateString(timestamp: number = Date.now()): string {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  getRelativeDate(daysOffset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return Timestamp.toDateString(d.getTime());
  },
  formatTime(timestamp: number = Date.now()): string {
    const d = new Date(timestamp);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
};
