import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { useAuth } from '@/features/auth/auth-store';
import { apiRequest } from '@/lib/api';

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  cadenceAnimationUrl: string | null;
  cues: { title: string; detail: string }[];
  defaultSets: number;
  defaultReps: number;
  repetitionUnit: 'reps' | 'seconds' | 'minutes';
};

export type WorkoutSet = {
  id: string;
  exerciseId: string;
  setIndex: number;
  weightKg: number;
  targetReps: number;
  userConfirmedReps: number;
  detectedReps: number | null;
  restDurationSeconds: number | null;
  avgHrBpm: number | null;
  exercise: Exercise;
};

export type WorkoutSession = {
  id: string;
  userId: string;
  sessionTitle: string;
  workoutSplit: string;
  startedAt: string;
  completedAt: string | null;
  avgHeartRateBpm: number | null;
  maxHeartRateBpm: number | null;
  sets?: WorkoutSet[];
};
export type SessionWithSets = WorkoutSession & { sets: WorkoutSet[] };
export type SetInput = { exerciseId: string; weightKg: number; userConfirmedReps: number; targetReps?: number };

export type WorkoutState = {
  exercises: Exercise[];
  sessions: WorkoutSession[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  activeSessionId: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  startSession: (title: string, split: string) => Promise<SessionWithSets>;
  loadSession: (id: string) => Promise<SessionWithSets>;
  finishSession: (id: string) => Promise<SessionWithSets>;
  cancelSession: (id: string) => Promise<void>;
  saveSet: (sessionId: string, input: SetInput, setId?: string) => Promise<SessionWithSets>;
  deleteSet: (sessionId: string, setId: string) => Promise<SessionWithSets>;
};

function useWorkoutState() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const userId = user?.id;
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const generation = useRef(0);
  const revision = useRef(0);
  const mutating = useRef(false);
  const fetching = useRef(false);
  const owner = useRef(user?.id);
  owner.current = user?.id;

  const upsert = useCallback((session: WorkoutSession) => {
    setSessions((previous) => [session, ...previous.filter((entry) => entry.id !== session.id)]
      .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt)));
  }, []);

  const refresh = useCallback(async () => {
    if (!userId || fetching.current || mutating.current) return;
    fetching.current = true;
    const version = generation.current;
    setLoading(true);
    setError(null);
    try {
      const [catalog, history] = await Promise.all([
        apiRequest<{ exercises: Exercise[]; count: number }>('/exercises?limit=200'),
        apiRequest<{ sessions: WorkoutSession[]; count: number }>('/workouts?limit=20&offset=0'),
      ]);
      const allExercises = [...catalog.exercises];
      while (allExercises.length < catalog.count) {
        const page = await apiRequest<{ exercises: Exercise[] }>('/exercises?limit=200&offset=' + allExercises.length);
        if (!page.exercises.length) throw new Error('The exercise catalog could not be fully loaded.');
        allExercises.push(...page.exercises);
      }
      if (version !== generation.current) return;
      setExercises(allExercises);
      setSessions((previous) => history.sessions.map((session) => ({
        ...session,
        sets: previous.find((entry) => entry.id === session.id)?.sets,
      })));
      setCount(history.count);
      setActiveSessionId(history.sessions.find((session) => !session.completedAt)?.id ?? null);
    } catch (cause) {
      if (version === generation.current) setError(cause instanceof Error ? cause.message : 'Unable to load workouts.');
    } finally {
      if (version === generation.current) { setLoading(false); fetching.current = false; }
    }
  }, [userId]);

  useEffect(() => {
    generation.current += 1;
    fetching.current = false;
    mutating.current = false;
    setExercises([]);
    setSessions([]);
    setCount(0);
    setActiveSessionId(null);
    void refresh();
    return () => { generation.current += 1; };
  }, [userId, refresh]);

  async function loadMore() {
    if (!user || fetching.current || mutating.current || sessions.length >= count) return;
    fetching.current = true;
    const version = generation.current;
    setLoading(true);
    setError(null);
    try {
      const page = await apiRequest<{ sessions: WorkoutSession[]; count: number }>(`/workouts?limit=20&offset=${sessions.length}`);
      if (version !== generation.current) return;
      setSessions((previous) => [...previous, ...page.sessions.filter((session) => !previous.some((entry) => entry.id === session.id))]);
      setCount(page.count);
    } catch (cause) {
      if (version === generation.current) setError(cause instanceof Error ? cause.message : 'Unable to load history.');
    } finally {
      if (version === generation.current) { setLoading(false); fetching.current = false; }
    }
  }

  const loadSession = useCallback(async (id: string) => {
    const version = generation.current;
    const requestRevision = revision.current;
    const session = await apiRequest<SessionWithSets>(`/workouts/${encodeURIComponent(id)}`);
    if (version !== generation.current || session.userId !== owner.current) throw new Error('Your account changed. Reopen the workout.');
    if (requestRevision === revision.current) upsert(session);
    return session;
  }, [upsert]);

  async function mutate<T>(request: () => Promise<T>): Promise<T> {
    if (!owner.current) throw new Error('Sign in to manage workouts.');
    if (mutating.current || fetching.current) throw new Error('Workout data is still being saved or loaded. Please wait.');
    const version = generation.current;
    mutating.current = true;
    try {
      const result = await request();
      if (version !== generation.current) throw new Error('Your account changed. Reopen the workout.');
      revision.current += 1;
      return result;
    } finally {
      if (version === generation.current) mutating.current = false;
    }
  }

  async function startSession(sessionTitle: string, workoutSplit: string) {
    const session = await mutate(() => apiRequest<SessionWithSets>('/workouts', { method: 'POST', body: { sessionTitle, workoutSplit } }));
    upsert(session);
    setCount((previous) => previous + 1);
    setActiveSessionId(session.id);
    return session;
  }

  async function finishSession(id: string) {
    const session = await mutate(() => apiRequest<SessionWithSets>(`/workouts/${encodeURIComponent(id)}/complete`, { method: 'POST', body: {} }));
    upsert(session);
    setActiveSessionId((previous) => previous === id ? null : previous);
    return session;
  }

  async function cancelSession(id: string) {
    await mutate(() => apiRequest(`/workouts/${encodeURIComponent(id)}`, { method: 'DELETE' }));
    setSessions((previous) => previous.filter((session) => session.id !== id));
    setCount((previous) => Math.max(0, previous - 1));
    setActiveSessionId((previous) => previous === id ? null : previous);
  }

  async function saveSet(sessionId: string, input: SetInput, setId?: string) {
    const { exerciseId, ...metrics } = input;
    const session = await mutate(() => apiRequest<SessionWithSets>(
      `/workouts/${encodeURIComponent(sessionId)}/sets${setId ? '/' + encodeURIComponent(setId) : ''}`,
      { method: setId ? 'PATCH' : 'POST', body: setId ? metrics : input },
    ));
    upsert(session);
    return session;
  }

  async function deleteSet(sessionId: string, setId: string) {
    const session = await mutate(() => apiRequest<SessionWithSets>(`/workouts/${encodeURIComponent(sessionId)}/sets/${encodeURIComponent(setId)}`, { method: 'DELETE' }));
    upsert(session);
    return session;
  }

  return { exercises, sessions, loading, error, refresh, loadMore, hasMore: sessions.length < count, activeSessionId, startSession, loadSession, finishSession, cancelSession, saveSet, deleteSet };
}
const WorkoutContext = createContext<WorkoutState | null>(null);
export function WorkoutProvider({ children }: { children: ReactNode }) {
  return <WorkoutContext.Provider value={useWorkoutState()}>{children}</WorkoutContext.Provider>;
}
export function useWorkouts() {
  const value = useContext(WorkoutContext);
  if (!value) throw new Error('useWorkouts must be used within WorkoutProvider.');
  return value;
}
