import { WorkoutSessionDoc } from '../types/types';
import { workoutRepository } from '../repositories';

export const workoutService = {
  getWorkoutHistory: (): Promise<WorkoutSessionDoc[]> => workoutRepository.getHistory(),
  getWorkoutById: (id: string): Promise<WorkoutSessionDoc | null> => workoutRepository.getById(id),
  saveWorkoutSession: (session: Omit<WorkoutSessionDoc, 'id'>): Promise<WorkoutSessionDoc> =>
    workoutRepository.saveSession(session),
  reset: (): void => workoutRepository.reset()
};
