import {
  UserDoc,
  BodyMeasurementDoc,
  MealDoc,
  WorkoutSessionDoc,
  PlanDoc,
  ExerciseDoc,
  FoodDoc,
  DeviceDoc,
  DailySummaryDoc,
  GoalType,
  MuscleGroup,
  ConnectionStatus
} from '../types/types';

export interface IUserRepository {
  getProfile(): Promise<UserDoc>;
  updateProfile(updates: Partial<UserDoc>): Promise<UserDoc>;
  getMeasurements(): Promise<BodyMeasurementDoc[]>;
  addMeasurement(measurement: Omit<BodyMeasurementDoc, 'id' | 'userId'>): Promise<BodyMeasurementDoc>;
  reset(): void;
}

export interface IMealRepository {
  getMealsByDate(date: string): Promise<MealDoc[]>;
  getAllMeals(): Promise<MealDoc[]>;
  saveMeal(meal: Omit<MealDoc, 'id' | 'createdAt' | 'syncedToWatch'>): Promise<MealDoc>;
  updateMeal(id: string, updates: Partial<MealDoc>): Promise<MealDoc>;
  deleteMeal(id: string): Promise<void>;
  reset(): void;
}

export interface IWorkoutRepository {
  getHistory(): Promise<WorkoutSessionDoc[]>;
  getById(id: string): Promise<WorkoutSessionDoc | null>;
  saveSession(session: Omit<WorkoutSessionDoc, 'id'>): Promise<WorkoutSessionDoc>;
  reset(): void;
}

export interface IPlanRepository {
  getActivePlan(): Promise<PlanDoc | null>;
  generatePlan(goal: GoalType): Promise<PlanDoc>;
  updatePlan(updates: Partial<PlanDoc>): Promise<PlanDoc>;
  incrementCycle(): Promise<PlanDoc>;
  advanceDay(): Promise<PlanDoc>;
  reset(): void;
}

export interface IExerciseRepository {
  getAllExercises(): Promise<ExerciseDoc[]>;
  getByMuscleGroup(group: MuscleGroup): Promise<ExerciseDoc[]>;
  searchExercises(query: string): Promise<ExerciseDoc[]>;
  getAllFoods(): Promise<FoodDoc[]>;
  searchFoods(query: string): Promise<FoodDoc[]>;
}

export interface IDeviceRepository {
  getDevices(): Promise<DeviceDoc[]>;
  syncDevice(id: string): Promise<DeviceDoc>;
  pairDevice(name: string, model: string): Promise<DeviceDoc>;
  setStatus(id: string, status: ConnectionStatus): Promise<DeviceDoc>;
  reset(): void;
}

export interface ISummaryRepository {
  getTodaySummary(): Promise<DailySummaryDoc>;
  getSummaries(days?: number): Promise<DailySummaryDoc[]>;
  updateTodaySummary(updates: Partial<DailySummaryDoc>): Promise<DailySummaryDoc>;
  reset(): void;
}
