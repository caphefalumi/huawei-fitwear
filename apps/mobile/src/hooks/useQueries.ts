import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  userRepository,
  mealRepository,
  workoutRepository,
  planRepository,
  exerciseRepository,
  deviceRepository,
  summaryRepository
} from '../repositories';
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
  ConnectionStatus
} from '../types/types';

export const queryKeys = {
  userProfile: ['user', 'profile'] as const,
  measurements: ['user', 'measurements'] as const,
  mealsByDate: (date: string) => ['meals', date] as const,
  allMeals: ['meals', 'all'] as const,
  todaySummary: ['summary', 'today'] as const,
  summaries: (days: number) => ['summary', 'history', days] as const,
  activePlan: ['plan', 'active'] as const,
  workoutHistory: ['workout', 'history'] as const,
  workoutDetail: (id: string) => ['workout', id] as const,
  allExercises: ['exercises', 'all'] as const,
  allFoods: ['foods', 'all'] as const,
  devices: ['devices', 'all'] as const
};

export function useUserProfileQuery() {
  return useQuery<UserDoc>({
    queryKey: queryKeys.userProfile,
    queryFn: () => userRepository.getProfile()
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<UserDoc>) => userRepository.updateProfile(updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.userProfile, updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    }
  });
}

export function useMeasurementsQuery() {
  return useQuery<BodyMeasurementDoc[]>({
    queryKey: queryKeys.measurements,
    queryFn: () => userRepository.getMeasurements()
  });
}

export function useAddMeasurementMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<BodyMeasurementDoc, 'id' | 'userId'>) => userRepository.addMeasurement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.measurements });
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    }
  });
}

export function useMealsByDateQuery(date: string) {
  return useQuery<MealDoc[]>({
    queryKey: queryKeys.mealsByDate(date),
    queryFn: () => mealRepository.getMealsByDate(date)
  });
}

export function useAddMealMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (meal: Omit<MealDoc, 'id' | 'createdAt' | 'syncedToWatch'>) => mealRepository.saveMeal(meal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.todaySummary });
    }
  });
}

export function useDeleteMealMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mealRepository.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.todaySummary });
    }
  });
}

export function useTodaySummaryQuery() {
  return useQuery<DailySummaryDoc>({
    queryKey: queryKeys.todaySummary,
    queryFn: () => summaryRepository.getTodaySummary()
  });
}

export function useUpdateTodaySummaryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<DailySummaryDoc>) => summaryRepository.updateTodaySummary(updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.todaySummary, updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.todaySummary });
    }
  });
}

export function usePlanQuery() {
  return useQuery<PlanDoc | null>({
    queryKey: queryKeys.activePlan,
    queryFn: () => planRepository.getActivePlan()
  });
}

export function useGeneratePlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goal: GoalType) => planRepository.generatePlan(goal),
    onSuccess: (newPlan) => {
      queryClient.setQueryData(queryKeys.activePlan, newPlan);
      queryClient.invalidateQueries({ queryKey: queryKeys.activePlan });
    }
  });
}

export function useUpdatePlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<PlanDoc>) => planRepository.updatePlan(updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.activePlan, updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.activePlan });
    }
  });
}

export function useWorkoutHistoryQuery() {
  return useQuery<WorkoutSessionDoc[]>({
    queryKey: queryKeys.workoutHistory,
    queryFn: () => workoutRepository.getHistory()
  });
}

export function useSaveWorkoutSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (session: Omit<WorkoutSessionDoc, 'id'>) => workoutRepository.saveSession(session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workoutHistory });
      queryClient.invalidateQueries({ queryKey: queryKeys.todaySummary });
    }
  });
}

export function useExercisesQuery() {
  return useQuery<ExerciseDoc[]>({
    queryKey: queryKeys.allExercises,
    queryFn: () => exerciseRepository.getAllExercises()
  });
}

export function useFoodsQuery() {
  return useQuery<FoodDoc[]>({
    queryKey: queryKeys.allFoods,
    queryFn: () => exerciseRepository.getAllFoods()
  });
}

export function useDevicesQuery() {
  return useQuery<DeviceDoc[]>({
    queryKey: queryKeys.devices,
    queryFn: () => deviceRepository.getDevices()
  });
}

export function useSyncDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deviceRepository.syncDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
    }
  });
}

export function usePairWatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, model }: { name: string; model: string }) =>
      deviceRepository.pairDevice(name, model),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
    }
  });
}

export function useSetDeviceStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ConnectionStatus }) =>
      deviceRepository.setStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.devices });
    }
  });
}
