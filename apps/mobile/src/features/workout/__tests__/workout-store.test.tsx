import type { QueryClient } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react-native"

import {
  WorkoutProvider,
  useWorkouts,
  workoutQueryKeys,
  type WorkoutSession,
} from "@/features/workout"
import { apiRequest } from "@/lib/api/client"
import { createQueryWrapper } from "@/test-utils/query-wrapper"

let serverSessions: WorkoutSession[]

jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  apiRequest: jest.fn(),
}))
jest.mock("@/features/auth/hooks/auth-hooks", () => ({
  useAuth: () => ({ user: { id: "member-a" } }),
}))

const request = apiRequest as jest.MockedFunction<typeof apiRequest>

function session(id: string): WorkoutSession {
  return {
    id,
    userId: "member-a",
    sessionTitle: id,
    workoutSplit: "Full body",
    startedAt: "2026-01-01T00:00:00.000Z",
    completedAt: null,
    avgHeartRateBpm: null,
    maxHeartRateBpm: null,
  }
}

test("failed concurrent cancellation does not restore a successful cancellation", async () => {
  const deleteA = Promise.withResolvers<unknown>()
  const deleteB = Promise.withResolvers<unknown>()
  const workoutA = session("workout-a")
  const workoutB = session("workout-b")
  serverSessions = [workoutA, workoutB]
  request.mockImplementation(async (path, options) => {
    if (path === "/workouts?limit=20&offset=0") {
      return { sessions: serverSessions, count: serverSessions.length }
    }
    if (path === "/exercises?limit=200") return { exercises: [], count: 0 }
    if (path === "/workouts/workout-a" && options?.method === "DELETE") return deleteA.promise
    if (path === "/workouts/workout-b" && options?.method === "DELETE") return deleteB.promise
    throw new Error(`Unexpected request: ${options?.method} ${path}`)
  })

  const client = { current: null as QueryClient | null }
  const wrapper = createQueryWrapper(WorkoutProvider, (queryClient) => {
    client.current = queryClient
    queryClient.setQueryData(workoutQueryKeys.history("member-a"), {
      pages: [{ sessions: serverSessions, count: serverSessions.length }],
      pageParams: [0],
    })
  })
  const { result } = await renderHook(() => useWorkouts(), { wrapper })
  await waitFor(() => expect(result.current.loading).toBe(false))

  let cancelA!: Promise<void>
  let cancelB!: Promise<void>
  await act(async () => {
    cancelA = result.current.cancelSession("workout-a")
    cancelB = result.current.cancelSession("workout-b")
  })
  await waitFor(() => expect(result.current.sessions).toHaveLength(0))

  serverSessions = [workoutA]
  await act(async () => {
    deleteB.resolve({ success: true })
    await cancelB
  })
  await act(async () => {
    deleteA.reject(new Error("Delete failed"))
    await expect(cancelA).rejects.toThrow("Delete failed")
  })

  await waitFor(() => expect(result.current.sessions.map(({ id }) => id)).toEqual(["workout-a"]))
})
