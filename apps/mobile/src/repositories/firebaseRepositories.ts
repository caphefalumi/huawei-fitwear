import {
  IUserRepository,
  IMealRepository,
  IWorkoutRepository,
  IPlanRepository,
  IExerciseRepository,
  IDeviceRepository,
  ISummaryRepository
} from './interfaces';
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
import { MockUserRepository, MockMealRepository, MockWorkoutRepository, MockPlanRepository, MockExerciseRepository, MockDeviceRepository, MockSummaryRepository } from './mockRepositories';

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  MEASUREMENTS: 'measurements',
  MEALS: 'meals',
  WORKOUT_SESSIONS: 'workout_sessions',
  PLANS: 'plans',
  EXERCISES: 'exercises',
  FOODS: 'foods',
  DEVICES: 'devices',
  SUMMARIES: 'daily_summaries'
} as const;

export class FirebaseUserRepository implements IUserRepository {
  private fallback = new MockUserRepository();

  async getProfile(): Promise<UserDoc> {
    return this.fallback.getProfile();
  }

  async updateProfile(updates: Partial<UserDoc>): Promise<UserDoc> {
    return this.fallback.updateProfile(updates);
  }

  async getMeasurements(): Promise<BodyMeasurementDoc[]> {
    return this.fallback.getMeasurements();
  }

  async addMeasurement(measurement: Omit<BodyMeasurementDoc, 'id' | 'userId'>): Promise<BodyMeasurementDoc> {
    return this.fallback.addMeasurement(measurement);
  }

  reset(): void {
    this.fallback.reset();
  }
}

export class FirebaseMealRepository implements IMealRepository {
  private fallback = new MockMealRepository();

  async getMealsByDate(date: string): Promise<MealDoc[]> {
    return this.fallback.getMealsByDate(date);
  }

  async getAllMeals(): Promise<MealDoc[]> {
    return this.fallback.getAllMeals();
  }

  async saveMeal(meal: Omit<MealDoc, 'id' | 'createdAt' | 'syncedToWatch'>): Promise<MealDoc> {
    return this.fallback.saveMeal(meal);
  }

  async updateMeal(id: string, updates: Partial<MealDoc>): Promise<MealDoc> {
    return this.fallback.updateMeal(id, updates);
  }

  async deleteMeal(id: string): Promise<void> {
    return this.fallback.deleteMeal(id);
  }

  reset(): void {
    this.fallback.reset();
  }
}

export class FirebaseWorkoutRepository implements IWorkoutRepository {
  private fallback = new MockWorkoutRepository();

  async getHistory(): Promise<WorkoutSessionDoc[]> {
    return this.fallback.getHistory();
  }

  async getById(id: string): Promise<WorkoutSessionDoc | null> {
    return this.fallback.getById(id);
  }

  async saveSession(session: Omit<WorkoutSessionDoc, 'id'>): Promise<WorkoutSessionDoc> {
    return this.fallback.saveSession(session);
  }

  reset(): void {
    this.fallback.reset();
  }
}

export class FirebasePlanRepository implements IPlanRepository {
  private fallback = new MockPlanRepository();

  async getActivePlan(): Promise<PlanDoc | null> {
    return this.fallback.getActivePlan();
  }

  async generatePlan(goal: GoalType): Promise<PlanDoc> {
    return this.fallback.generatePlan(goal);
  }

  async updatePlan(updates: Partial<PlanDoc>): Promise<PlanDoc> {
    return this.fallback.updatePlan(updates);
  }

  async incrementCycle(): Promise<PlanDoc> {
    return this.fallback.incrementCycle();
  }

  async advanceDay(): Promise<PlanDoc> {
    return this.fallback.advanceDay();
  }

  reset(): void {
    this.fallback.reset();
  }
}

export class FirebaseExerciseRepository implements IExerciseRepository {
  private fallback = new MockExerciseRepository();

  async getAllExercises(): Promise<ExerciseDoc[]> {
    return this.fallback.getAllExercises();
  }

  async getByMuscleGroup(group: MuscleGroup): Promise<ExerciseDoc[]> {
    return this.fallback.getByMuscleGroup(group);
  }

  async searchExercises(query: string): Promise<ExerciseDoc[]> {
    return this.fallback.searchExercises(query);
  }

  async getAllFoods(): Promise<FoodDoc[]> {
    return this.fallback.getAllFoods();
  }

  async searchFoods(query: string): Promise<FoodDoc[]> {
    return this.fallback.searchFoods(query);
  }
}

export class FirebaseDeviceRepository implements IDeviceRepository {
  private fallback = new MockDeviceRepository();

  async getDevices(): Promise<DeviceDoc[]> {
    return this.fallback.getDevices();
  }

  async syncDevice(id: string): Promise<DeviceDoc> {
    return this.fallback.syncDevice(id);
  }

  async pairDevice(name: string, model: string): Promise<DeviceDoc> {
    return this.fallback.pairDevice(name, model);
  }

  async setStatus(id: string, status: ConnectionStatus): Promise<DeviceDoc> {
    return this.fallback.setStatus(id, status);
  }

  reset(): void {
    this.fallback.reset();
  }
}

export class FirebaseSummaryRepository implements ISummaryRepository {
  private fallback = new MockSummaryRepository();

  async getTodaySummary(): Promise<DailySummaryDoc> {
    return this.fallback.getTodaySummary();
  }

  async getSummaries(days?: number): Promise<DailySummaryDoc[]> {
    return this.fallback.getSummaries(days);
  }

  async updateTodaySummary(updates: Partial<DailySummaryDoc>): Promise<DailySummaryDoc> {
    return this.fallback.updateTodaySummary(updates);
  }

  reset(): void {
    this.fallback.reset();
  }
}
