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
  MockUserRepository,
  MockMealRepository,
  MockWorkoutRepository,
  MockPlanRepository,
  MockExerciseRepository,
  MockDeviceRepository,
  MockSummaryRepository
} from './mockRepositories';
import {
  FirebaseUserRepository,
  FirebaseMealRepository,
  FirebaseWorkoutRepository,
  FirebasePlanRepository,
  FirebaseExerciseRepository,
  FirebaseDeviceRepository,
  FirebaseSummaryRepository
} from './firebaseRepositories';

export type DataSourceType = 'mock' | 'firebase';

export let activeDataSource: DataSourceType = 'mock';

export function setDataSource(source: DataSourceType) {
  activeDataSource = source;
}

const mockRepos = {
  user: new MockUserRepository(),
  meal: new MockMealRepository(),
  workout: new MockWorkoutRepository(),
  plan: new MockPlanRepository(),
  exercise: new MockExerciseRepository(),
  device: new MockDeviceRepository(),
  summary: new MockSummaryRepository()
};

const firebaseRepos = {
  user: new FirebaseUserRepository(),
  meal: new FirebaseMealRepository(),
  workout: new FirebaseWorkoutRepository(),
  plan: new FirebasePlanRepository(),
  exercise: new FirebaseExerciseRepository(),
  device: new FirebaseDeviceRepository(),
  summary: new FirebaseSummaryRepository()
};

export const userRepository: IUserRepository = new Proxy({} as IUserRepository, {
  get: (_, prop) => (activeDataSource === 'firebase' ? (firebaseRepos.user as any)[prop] : (mockRepos.user as any)[prop])
});

export const mealRepository: IMealRepository = new Proxy({} as IMealRepository, {
  get: (_, prop) => (activeDataSource === 'firebase' ? (firebaseRepos.meal as any)[prop] : (mockRepos.meal as any)[prop])
});

export const workoutRepository: IWorkoutRepository = new Proxy({} as IWorkoutRepository, {
  get: (_, prop) => (activeDataSource === 'firebase' ? (firebaseRepos.workout as any)[prop] : (mockRepos.workout as any)[prop])
});

export const planRepository: IPlanRepository = new Proxy({} as IPlanRepository, {
  get: (_, prop) => (activeDataSource === 'firebase' ? (firebaseRepos.plan as any)[prop] : (mockRepos.plan as any)[prop])
});

export const exerciseRepository: IExerciseRepository = new Proxy({} as IExerciseRepository, {
  get: (_, prop) => (activeDataSource === 'firebase' ? (firebaseRepos.exercise as any)[prop] : (mockRepos.exercise as any)[prop])
});

export const deviceRepository: IDeviceRepository = new Proxy({} as IDeviceRepository, {
  get: (_, prop) => (activeDataSource === 'firebase' ? (firebaseRepos.device as any)[prop] : (mockRepos.device as any)[prop])
});

export const summaryRepository: ISummaryRepository = new Proxy({} as ISummaryRepository, {
  get: (_, prop) => (activeDataSource === 'firebase' ? (firebaseRepos.summary as any)[prop] : (mockRepos.summary as any)[prop])
});

export * from './interfaces';
