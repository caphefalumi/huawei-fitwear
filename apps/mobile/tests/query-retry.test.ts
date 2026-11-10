import type { QueryObserverResult } from "@tanstack/react-query"

import { refetchAllThrowing, refetchThrowing, throwIfRefetchFailed } from "@/lib/query/retry"

function refetchResult(isError: boolean, error?: Error): QueryObserverResult<unknown, Error> {
  return { isError, error } as QueryObserverResult<unknown, Error>
}

test("throwIfRefetchFailed rejects failed React Query refetch results", () => {
  expect(() => throwIfRefetchFailed(refetchResult(true, new Error("offline")))).toThrow("offline")
})

test("refetchThrowing propagates failed refetches to retry handlers", async () => {
  const refetch = jest.fn().mockResolvedValue(refetchResult(true, new Error("still failing")))
  await expect(refetchThrowing(refetch)).rejects.toThrow("still failing")
})

test("refetchAllThrowing fails when any parallel refetch stays in error", async () => {
  const ok = jest.fn().mockResolvedValue(refetchResult(false))
  const bad = jest.fn().mockResolvedValue(refetchResult(true, new Error("summary down")))
  await expect(refetchAllThrowing(ok, bad)).rejects.toThrow("summary down")
  expect(ok).toHaveBeenCalled()
  expect(bad).toHaveBeenCalled()
})
