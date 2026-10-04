import { WorkoutSessionDoc, Timestamp } from '../types/types';
import { initialPastSessions } from '../mocks/mockData';

let sessionsDb: WorkoutSessionDoc[] = [...initialPastSessions];

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const workoutService = {
  // TODO(api): GET /api/v1/workouts
  async getWorkoutHistory(): Promise<WorkoutSessionDoc[]> {
    await delay(150);
    return [...sessionsDb].sort((a, b) => b.startTime - a.startTime);
  },

  // TODO(api): GET /api/v1/workouts/{id}
  async getWorkoutById(id: string): Promise<WorkoutSessionDoc | null> {
    await delay(100);
    const session = sessionsDb.find((s) => s.id === id);
    return session ? { ...session } : null;
  },

  // TODO(api): POST /api/v1/workouts
  async saveWorkoutSession(session: Omit<WorkoutSessionDoc, 'id'>): Promise<WorkoutSessionDoc> {
    await delay(250);
    const newSession: WorkoutSessionDoc = {
      ...session,
      id: `session_${Date.now()}`
    };
    sessionsDb.unshift(newSession);
    return { ...newSession };
  },

  reset(): void {
    sessionsDb = [...initialPastSessions];
  }
};
