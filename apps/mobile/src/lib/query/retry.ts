import type { QueryObserverResult } from "@tanstack/react-query"

export function throwIfRefetchFailed<TData, TError>(
  result: QueryObserverResult<TData, TError>,
): void {
  if (result.isError) {
    throw result.error ?? new Error("Could not refresh this data. Try again.")
  }
}

export async function refetchThrowing<TData, TError>(
  refetch: () => Promise<QueryObserverResult<TData, TError>>,
): Promise<void> {
  throwIfRefetchFailed(await refetch())
}

export async function refetchAllThrowing(
  ...refetchers: Array<() => Promise<QueryObserverResult<unknown, unknown>>>
): Promise<void> {
  const results = await Promise.all(refetchers.map((refetch) => refetch()))
  for (const result of results) {
    throwIfRefetchFailed(result)
  }
}
