import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, type ReactNode } from "react";

import { useAuth } from "@/features/auth/auth-store";
import { apiRequest } from "@/lib/api";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  cadenceAnimationUrl: string | null;
  cues: { title: string; detail: string }[];
  defaultSets: number;
  defaultReps: number;
  repetitionUnit: "reps" | "seconds" | "minutes";
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
export type SetInput = {
  exerciseId: string;
  weightKg: number;
  userConfirmedReps: number;
  targetReps?: number;
};

export type WorkoutState = {
  exercises: Exercise[];
  sessions: WorkoutSession[];
  loading: boolean;
  refreshing: boolean;
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
export const workoutQueryKeys = {
  all: (userId: string) => ["workouts", userId] as const,
  catalog: (userId: string) => [...workoutQueryKeys.all(userId), "exercises"] as const,
  history: (userId: string) => [...workoutQueryKeys.all(userId), "history"] as const,
  progress: (userId: string) => [...workoutQueryKeys.all(userId), "stats"] as const,
  detail: (userId: string, sessionId: string) =>
    [...workoutQueryKeys.all(userId), "session", sessionId] as const,
};

function useWorkoutState(): WorkoutState {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const catalogQuery = useQuery({
    queryKey: workoutQueryKeys.catalog(userId ?? "signed-out"),
    enabled: Boolean(userId),
    queryFn: async ({ signal }) => {
      const initial = await apiRequest<{ exercises: Exercise[]; count: number }>(
        "/exercises?limit=200",
        { signal },
      );
      const exercises = [...initial.exercises];
      while (exercises.length < initial.count) {
        const next = await apiRequest<{ exercises: Exercise[] }>(
          `/exercises?limit=200&offset=${exercises.length}`,
          { signal },
        );
        if (!next.exercises.length)
          throw new Error("The exercise catalog could not be fully loaded.");
        exercises.push(...next.exercises);
      }
      return exercises;
    },
  });
  const historyQuery = useInfiniteQuery({
    queryKey: workoutQueryKeys.history(userId ?? "signed-out"),
    enabled: Boolean(userId),
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      apiRequest<{ sessions: WorkoutSession[]; count: number }>(
        `/workouts?limit=20&offset=${pageParam}`,
        { signal },
      ),
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((total, page) => total + page.sessions.length, 0);
      return loaded < lastPage.count && lastPage.sessions.length ? loaded : undefined;
    },
  });
  const sessions = historyQuery.data?.pages.flatMap((page) => page.sessions) ?? [];
  const count = historyQuery.data?.pages[0]?.count ?? 0;
  const activeSessionId = sessions.find((session) => !session.completedAt)?.id ?? null;
  const upsert = (session: SessionWithSets) => {
    if (!userId) return;
    queryClient.setQueryData(workoutQueryKeys.detail(userId, session.id), session);
    queryClient.setQueryData(
      workoutQueryKeys.history(userId),
      (previous: typeof historyQuery.data) => {
        if (!previous?.pages.length) return previous;
        const allSessions = previous.pages.flatMap((page) => page.sessions);
        const sessionsWithUpdate = [
          session,
          ...allSessions.filter((entry) => entry.id !== session.id),
        ];
        let offset = 0;
        return {
          ...previous,
          pages: previous.pages.map((page) => {
            const nextSessions = sessionsWithUpdate.slice(offset, offset + page.sessions.length);
            offset += page.sessions.length;
            return { ...page, sessions: nextSessions };
          }),
        };
      },
    );
  };
  const writeMutation = useMutation({
    mutationKey: [...workoutQueryKeys.all(userId ?? "signed-out"), "write"],
    mutationFn: ({ path, method, body }: { path: string; method: string; body?: unknown }) =>
      apiRequest<unknown>(path, { method, ...(body === undefined ? {} : { body }) }),
    onMutate: async ({ path, method }) => {
      if (!userId || method !== "DELETE") return undefined;
      const match = /^\/workouts\/([^/]+)$/.exec(path);
      if (!match) return undefined;
      const key = workoutQueryKeys.history(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);
      queryClient.setQueryData(key, (data: typeof historyQuery.data) =>
        data
          ? {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                sessions: page.sessions.filter((session) => session.id !== match[1]),
              })),
            }
          : data,
      );
      return { key, previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
    },
    onSuccess: async (result, variables) => {
      if (!userId) return;
      const match = /^\/workouts\/([^/]+)$/.exec(variables.path);
      if (match && variables.method === "DELETE") {
        queryClient.removeQueries({ queryKey: workoutQueryKeys.detail(userId, match[1]) });
      } else if (result && typeof result === "object" && "id" in result && "sets" in result) {
        upsert(result as SessionWithSets);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workoutQueryKeys.history(userId) }),
        queryClient.invalidateQueries({ queryKey: workoutQueryKeys.progress(userId) }),
      ]);
    },
  });
  const refresh = async () => {
    await Promise.all([catalogQuery.refetch(), historyQuery.refetch()]);
  };
  const loadMore = async () => {
    if (historyQuery.hasNextPage) await historyQuery.fetchNextPage();
  };
  const loadSession = async (id: string) => {
    if (!userId) throw new Error("Sign in to load workouts.");
    const session = await queryClient.fetchQuery({
      queryKey: workoutQueryKeys.detail(userId, id),
      queryFn: ({ signal }) =>
        apiRequest<SessionWithSets>(`/workouts/${encodeURIComponent(id)}`, { signal }),
    });
    upsert(session);
    return session;
  };
  const write = async <T,>(path: string, method: string, body?: unknown): Promise<T> =>
    (await writeMutation.mutateAsync({ path, method, body })) as T;
  const startSession = (title: string, split: string) =>
    write<SessionWithSets>("/workouts", "POST", { sessionTitle: title, workoutSplit: split });
  const finishSession = (id: string) =>
    write<SessionWithSets>(`/workouts/${encodeURIComponent(id)}/complete`, "POST", {});
  const cancelSession = async (id: string) => {
    await write(`/workouts/${encodeURIComponent(id)}`, "DELETE");
  };
  const saveSet = (sessionId: string, input: SetInput, setId?: string) => {
    const { exerciseId: _exerciseId, ...metrics } = input;
    return write<SessionWithSets>(
      `/workouts/${encodeURIComponent(sessionId)}/sets${setId ? `/${encodeURIComponent(setId)}` : ""}`,
      setId ? "PATCH" : "POST",
      setId ? metrics : input,
    );
  };
  const deleteSet = (sessionId: string, setId: string) =>
    write<SessionWithSets>(
      `/workouts/${encodeURIComponent(sessionId)}/sets/${encodeURIComponent(setId)}`,
      "DELETE",
    );
  const loading = catalogQuery.isLoading || historyQuery.isLoading;
  const error =
    [catalogQuery.error, historyQuery.error, writeMutation.error].find(
      (cause) => cause instanceof Error,
    )?.message ?? null;
  return {
    exercises: catalogQuery.data ?? [],
    sessions,
    loading,
    refreshing: (catalogQuery.isFetching || historyQuery.isFetching) && !loading,
    error,
    refresh,
    loadMore,
    hasMore: sessions.length < count,
    activeSessionId,
    startSession,
    loadSession,
    finishSession,
    cancelSession,
    saveSet,
    deleteSet,
  };
}

const WorkoutContext = createContext<WorkoutState | null>(null);
export function WorkoutProvider({ children }: { children: ReactNode }) {
  return <WorkoutContext.Provider value={useWorkoutState()}>{children}</WorkoutContext.Provider>;
}
export function useWorkouts() {
  const value = useContext(WorkoutContext);
  if (!value) throw new Error("useWorkouts must be used within WorkoutProvider.");
  return value;
}
