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
  ConnectionStatus,
  Timestamp
} from '../types/types';
import {
  initialUser,
  initialMeasurements,
  initialMeals,
  initialPastSessions,
  initialPlan,
  initialExercises,
  initialFoods,
  initialDevices,
  initialDailySummaries
} from '../mocks/mockData';

const delay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

let userDb: UserDoc = { ...initialUser };
let measurementsDb: BodyMeasurementDoc[] = [...initialMeasurements];

export class MockUserRepository implements IUserRepository {
  async getProfile(): Promise<UserDoc> {
    await delay(50);
    return { ...userDb };
  }

  async updateProfile(updates: Partial<UserDoc>): Promise<UserDoc> {
    await delay(80);
    userDb = { ...userDb, ...updates, updatedAt: Timestamp.now() };
    return { ...userDb };
  }

  async getMeasurements(): Promise<BodyMeasurementDoc[]> {
    await delay(50);
    return [...measurementsDb].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async addMeasurement(measurement: Omit<BodyMeasurementDoc, 'id' | 'userId'>): Promise<BodyMeasurementDoc> {
    await delay(100);
    const newDoc: BodyMeasurementDoc = {
      ...measurement,
      id: `bm_${Date.now()}`,
      userId: userDb.id
    };
    measurementsDb.push(newDoc);
    userDb = { ...userDb, weightKg: measurement.weightKg, updatedAt: Timestamp.now() };
    return { ...newDoc };
  }

  reset(): void {
    userDb = { ...initialUser };
    measurementsDb = [...initialMeasurements];
  }
}

let mealsDb: MealDoc[] = [...initialMeals];

export class MockMealRepository implements IMealRepository {
  async getMealsByDate(date: string): Promise<MealDoc[]> {
    await delay(50);
    return mealsDb.filter((m) => m.date === date);
  }

  async getAllMeals(): Promise<MealDoc[]> {
    await delay(50);
    return [...mealsDb];
  }

  async saveMeal(meal: Omit<MealDoc, 'id' | 'createdAt' | 'syncedToWatch'>): Promise<MealDoc> {
    await delay(120);
    const newDoc: MealDoc = {
      ...meal,
      id: `meal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      syncedToWatch: true,
      createdAt: Timestamp.now()
    };
    mealsDb.unshift(newDoc);
    return { ...newDoc };
  }

  async updateMeal(id: string, updates: Partial<MealDoc>): Promise<MealDoc> {
    await delay(80);
    const index = mealsDb.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Meal ${id} not found`);
    mealsDb[index] = { ...mealsDb[index], ...updates };
    return { ...mealsDb[index] };
  }

  async deleteMeal(id: string): Promise<void> {
    await delay(50);
    mealsDb = mealsDb.filter((m) => m.id !== id);
  }

  reset(): void {
    mealsDb = [...initialMeals];
  }
}

let sessionsDb: WorkoutSessionDoc[] = [...initialPastSessions];

export class MockWorkoutRepository implements IWorkoutRepository {
  async getHistory(): Promise<WorkoutSessionDoc[]> {
    await delay(50);
    return [...sessionsDb].sort((a, b) => b.startTime - a.startTime);
  }

  async getById(id: string): Promise<WorkoutSessionDoc | null> {
    await delay(50);
    const s = sessionsDb.find((item) => item.id === id);
    return s ? { ...s } : null;
  }

  async saveSession(session: Omit<WorkoutSessionDoc, 'id'>): Promise<WorkoutSessionDoc> {
    await delay(120);
    const newDoc: WorkoutSessionDoc = {
      ...session,
      id: `session_${Date.now()}`
    };
    sessionsDb.unshift(newDoc);
    return { ...newDoc };
  }

  reset(): void {
    sessionsDb = [...initialPastSessions];
  }
}

let planDb: PlanDoc | null = { ...initialPlan };

export class MockPlanRepository implements IPlanRepository {
  async getActivePlan(): Promise<PlanDoc | null> {
    await delay(50);
    return planDb ? { ...planDb } : null;
  }

  async generatePlan(goal: GoalType): Promise<PlanDoc> {
    await delay(200);
    const days = [
      {
        id: 'day_1',
        dayNumber: 1,
        muscleGroup: 'Chest' as MuscleGroup,
        title: 'Chest & Pec Power',
        estimatedDurationMin: 45,
        exercises: [
          { id: 'pe_1', exerciseId: 'ex_bench_press', sets: 4, repRange: { min: 8, max: 10 }, restSeconds: 90, targetWeightKg: 60 },
          { id: 'pe_2', exerciseId: 'ex_incline_dumbbell_press', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60, targetWeightKg: 20 },
          { id: 'pe_3', exerciseId: 'ex_cable_crossover', sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60, targetWeightKg: 15 }
        ]
      },
      {
        id: 'day_2',
        dayNumber: 2,
        muscleGroup: 'Back' as MuscleGroup,
        title: 'Back & Lats Hypertrophy',
        estimatedDurationMin: 45,
        exercises: [
          { id: 'pe_4', exerciseId: 'ex_barbell_bent_over_row', sets: 4, repRange: { min: 8, max: 10 }, restSeconds: 90, targetWeightKg: 65 },
          { id: 'pe_5', exerciseId: 'ex_lat_pulldown', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60, targetWeightKg: 50 },
          { id: 'pe_6', exerciseId: 'ex_pull_ups', sets: 3, repRange: { min: 6, max: 10 }, restSeconds: 90, targetWeightKg: 0 }
        ]
      },
      {
        id: 'day_3',
        dayNumber: 3,
        muscleGroup: 'Legs' as MuscleGroup,
        title: 'Legs & Quads Foundation',
        estimatedDurationMin: 50,
        exercises: [
          { id: 'pe_7', exerciseId: 'ex_barbell_back_squat', sets: 4, repRange: { min: 8, max: 10 }, restSeconds: 120, targetWeightKg: 80 },
          { id: 'pe_8', exerciseId: 'ex_romanian_deadlift', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 90, targetWeightKg: 70 },
          { id: 'pe_9', exerciseId: 'ex_dumbbell_walking_lunge', sets: 3, repRange: { min: 12, max: 14 }, restSeconds: 60, targetWeightKg: 16 }
        ]
      },
      {
        id: 'day_4',
        dayNumber: 4,
        muscleGroup: 'Shoulders' as MuscleGroup,
        title: 'Shoulders & Deltoid Width',
        estimatedDurationMin: 40,
        exercises: [
          { id: 'pe_10', exerciseId: 'ex_overhead_dumbbell_press', sets: 4, repRange: { min: 8, max: 10 }, restSeconds: 90, targetWeightKg: 22 },
          { id: 'pe_11', exerciseId: 'ex_dumbbell_lateral_raise', sets: 4, repRange: { min: 12, max: 15 }, restSeconds: 45, targetWeightKg: 10 }
        ]
      },
      {
        id: 'day_5',
        dayNumber: 5,
        muscleGroup: 'Arms' as MuscleGroup,
        title: 'Arms (Biceps & Triceps)',
        estimatedDurationMin: 40,
        exercises: [
          { id: 'pe_12', exerciseId: 'ex_barbell_biceps_curl', sets: 3, repRange: { min: 10, max: 12 }, restSeconds: 60, targetWeightKg: 25 },
          { id: 'pe_13', exerciseId: 'ex_triceps_rope_pushdown', sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 60, targetWeightKg: 20 }
        ]
      },
      {
        id: 'day_6',
        dayNumber: 6,
        muscleGroup: 'Abs' as MuscleGroup,
        title: 'Core & Kinetic Stability',
        estimatedDurationMin: 30,
        exercises: [
          { id: 'pe_14', exerciseId: 'ex_hanging_knee_raise', sets: 3, repRange: { min: 12, max: 15 }, restSeconds: 45, targetWeightKg: 0 },
          { id: 'pe_15', exerciseId: 'ex_plank_hold', sets: 3, repRange: { min: 45, max: 60 }, restSeconds: 45, targetWeightKg: 0 }
        ]
      }
    ];

    planDb = {
      id: `plan_${Date.now()}`,
      userId: 'user_default',
      title: goal === 'build_muscle' ? 'Hypertrophy 6-Day Split' : goal === 'lose_fat' ? 'Conditioning 6-Day Split' : 'Maintenance 6-Day Split',
      goal,
      days,
      currentCycle: 1,
      currentDayIndex: 0,
      isActive: true,
      syncedToWatch: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    return { ...planDb };
  }

  async updatePlan(updates: Partial<PlanDoc>): Promise<PlanDoc> {
    await delay(80);
    if (!planDb) throw new Error('No active plan');
    planDb = { ...planDb, ...updates, updatedAt: Timestamp.now() };
    return { ...planDb };
  }

  async incrementCycle(): Promise<PlanDoc> {
    await delay(80);
    if (!planDb) throw new Error('No active plan found');
    planDb = {
      ...planDb,
      currentCycle: planDb.currentCycle + 1,
      currentDayIndex: 0,
      updatedAt: Timestamp.now()
    };
    return { ...planDb };
  }

  async advanceDay(): Promise<PlanDoc> {
    await delay(80);
    if (!planDb) throw new Error('No active plan found');
    const nextIdx = (planDb.currentDayIndex + 1) % planDb.days.length;
    const nextCycle = nextIdx === 0 ? planDb.currentCycle + 1 : planDb.currentCycle;
    planDb = {
      ...planDb,
      currentDayIndex: nextIdx,
      currentCycle: nextCycle,
      updatedAt: Timestamp.now()
    };
    return { ...planDb };
  }

  reset(): void {
    planDb = { ...initialPlan };
  }
}

export class MockExerciseRepository implements IExerciseRepository {
  async getAllExercises(): Promise<ExerciseDoc[]> {
    await delay(30);
    return [...initialExercises];
  }

  async getByMuscleGroup(group: MuscleGroup): Promise<ExerciseDoc[]> {
    await delay(30);
    return initialExercises.filter((e) => e.muscleGroup.toLowerCase() === group.toLowerCase());
  }

  async searchExercises(query: string): Promise<ExerciseDoc[]> {
    await delay(40);
    const q = query.toLowerCase();
    return initialExercises.filter(
      (e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
    );
  }

  async getAllFoods(): Promise<FoodDoc[]> {
    await delay(30);
    return [...initialFoods];
  }

  async searchFoods(query: string): Promise<FoodDoc[]> {
    await delay(40);
    const q = query.toLowerCase();
    return initialFoods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.nameVi && f.nameVi.toLowerCase().includes(q))
    );
  }
}

let devicesDb: DeviceDoc[] = [...initialDevices];

export class MockDeviceRepository implements IDeviceRepository {
  async getDevices(): Promise<DeviceDoc[]> {
    await delay(50);
    return [...devicesDb];
  }

  async syncDevice(id: string): Promise<DeviceDoc> {
    await delay(300);
    const index = devicesDb.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Device not found');
    devicesDb[index] = {
      ...devicesDb[index],
      lastSyncTime: Timestamp.now(),
      connectionStatus: 'connected',
      pendingSyncCount: 0
    };
    return { ...devicesDb[index] };
  }

  async pairDevice(name: string, model: string): Promise<DeviceDoc> {
    await delay(400);
    const newDevice: DeviceDoc = {
      id: `dev_${Date.now()}`,
      name,
      type: 'watch',
      model,
      appVersion: 'v1.4.2-harmonyOS',
      batteryLevel: 98,
      lastSyncTime: Timestamp.now(),
      connectionStatus: 'connected',
      pendingSyncCount: 0
    };
    devicesDb.push(newDevice);
    return { ...newDevice };
  }

  async setStatus(id: string, status: ConnectionStatus): Promise<DeviceDoc> {
    await delay(50);
    const index = devicesDb.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Device not found');
    devicesDb[index] = { ...devicesDb[index], connectionStatus: status };
    return { ...devicesDb[index] };
  }

  reset(): void {
    devicesDb = [...initialDevices];
  }
}

let summariesDb: DailySummaryDoc[] = [...initialDailySummaries];

export class MockSummaryRepository implements ISummaryRepository {
  async getTodaySummary(): Promise<DailySummaryDoc> {
    await delay(50);
    const today = Timestamp.toDateString();
    let found = summariesDb.find((s) => s.date === today);
    if (!found) {
      found = {
        id: `ds_${today}`,
        userId: 'user_default',
        date: today,
        caloriesConsumed: 0,
        calorieTarget: 2200,
        proteinConsumed: 0,
        proteinTarget: 140,
        carbsConsumed: 0,
        carbsTarget: 250,
        fatConsumed: 0,
        fatTarget: 70,
        status: 'ON_TRACK',
        workoutsCompleted: 0,
        totalVolumeKg: 0,
        currentStreak: 7
      };
      summariesDb.push(found);
    }
    return { ...found };
  }

  async getSummaries(days: number = 30): Promise<DailySummaryDoc[]> {
    await delay(50);
    return [...summariesDb].slice(-days);
  }

  async updateTodaySummary(updates: Partial<DailySummaryDoc>): Promise<DailySummaryDoc> {
    await delay(60);
    const today = Timestamp.toDateString();
    const index = summariesDb.findIndex((s) => s.date === today);
    if (index !== -1) {
      summariesDb[index] = { ...summariesDb[index], ...updates };
      return { ...summariesDb[index] };
    }
    const created: DailySummaryDoc = {
      id: `ds_${today}`,
      userId: 'user_default',
      date: today,
      caloriesConsumed: 0,
      calorieTarget: 2200,
      proteinConsumed: 0,
      proteinTarget: 140,
      carbsConsumed: 0,
      carbsTarget: 250,
      fatConsumed: 0,
      fatTarget: 70,
      status: 'ON_TRACK',
      workoutsCompleted: 0,
      totalVolumeKg: 0,
      currentStreak: 7,
      ...updates
    };
    summariesDb.push(created);
    return { ...created };
  }

  reset(): void {
    summariesDb = [...initialDailySummaries];
  }
}
