import axios, { AxiosError, CanceledError, type AxiosResponse } from "axios"

import { ApiError, apiErrorMessage, apiRequest, onSessionExpired, setApiToken } from "@/lib/api"

import { request } from "./http-adapter"

jest.mock("axios", () => {
  const actual = jest.requireActual("axios")
  actual.default.defaults.adapter = jest.requireActual("./http-adapter").httpAdapter
  return actual
})
const response = (status: number, data: unknown, headers = {}) =>
  ({ status, data, headers }) as AxiosResponse<unknown>

beforeEach(() => {
  request.mockReset()
  setApiToken(null)
})

afterEach(() => {
  setApiToken(null)
})

test("normalizes server validation responses without discarding status or code", async () => {
  request.mockResolvedValue(
    response(422, { message: "Weight must be positive", code: "VALIDATION" }),
  )
  await expect(
    apiRequest("/health/weight", { method: "PUT", body: { weightKg: -1 } }),
  ).rejects.toMatchObject({ status: 422, code: "VALIDATION", message: "Weight must be positive" })
})

test("expires the active bearer session on unauthorized data access", async () => {
  setApiToken("expired-session")
  const expired = jest.fn()
  const unsubscribe = onSessionExpired(expired)
  request.mockResolvedValueOnce(response(401, { message: "Session expired" }))
  await expect(apiRequest("/meals")).rejects.toBeInstanceOf(ApiError)
  expect(expired).toHaveBeenCalledTimes(1)
  request.mockResolvedValueOnce(response(200, { meals: [] }))
  await apiRequest("/meals")
  expect(request.mock.calls[1][0]).toMatchObject({
    url: "/meals",
    headers: { Accept: "application/json" },
  })
  expect(request.mock.calls[1][0]?.headers).not.toHaveProperty("Authorization")
  unsubscribe()
})

test("an old request cannot expire a newly signed-in account", async () => {
  const { promise, resolve: finish } = Promise.withResolvers<AxiosResponse<unknown>>()
  request.mockReturnValueOnce(promise)
  setApiToken("old-account")
  const expired = jest.fn()
  const unsubscribe = onSessionExpired(expired)
  const pending = apiRequest("/meals")
  setApiToken("new-account")
  finish(response(401, { message: "Old session expired" }))
  await expect(pending).rejects.toMatchObject({ status: 401 })
  expect(expired).not.toHaveBeenCalled()
  request.mockResolvedValueOnce(response(200, { meals: [] }))
  await apiRequest("/meals")
  expect(request.mock.calls[1][0]?.headers).toHaveProperty("Authorization", "Bearer new-account")
  unsubscribe()
})

test("maps network and timeout errors to user-safe retryable error types", async () => {
  request.mockRejectedValueOnce(new AxiosError("offline", "ERR_NETWORK"))
  await expect(apiRequest("/meals")).rejects.toMatchObject({ code: "NETWORK_ERROR", status: 0 })
  request.mockRejectedValueOnce(new AxiosError("timeout", "ETIMEDOUT"))
  const failure = await apiRequest("/meals").catch((error: unknown) => error)
  expect(failure).toMatchObject({ code: "TIMEOUT", retryable: true })
  expect(apiErrorMessage(failure, "your meals")).toBe(
    "Loading your meals took too long. Try again.",
  )
})

test("rejects non-API destinations before sending a request", async () => {
  await expect(apiRequest("//example.com/steal")).rejects.toMatchObject({ code: "INVALID_PATH" })
  expect(request).not.toHaveBeenCalled()
})

test("an anonymous 401 cannot expire a session created while it was in flight", async () => {
  const { promise, resolve } = Promise.withResolvers<AxiosResponse<unknown>>()
  request.mockReturnValueOnce(promise)
  const expired = jest.fn()
  const unsubscribe = onSessionExpired(expired)
  try {
    const pending = apiRequest("/auth/sign-in", { method: "POST" })
    setApiToken("new-session")
    resolve(response(401, { message: "Invalid credentials" }))
    await expect(pending).rejects.toMatchObject({ status: 401 })
    expect(expired).not.toHaveBeenCalled()
    request.mockResolvedValueOnce(response(200, {}))
    await apiRequest("/auth/session")
    expect(request.mock.calls[1][0].headers.get("Authorization")).toBe("Bearer new-session")
  } finally {
    unsubscribe()
  }
})

test("cancellation remains distinguishable from a retryable network failure", async () => {
  const canceled = new CanceledError("Navigation changed")
  request.mockRejectedValueOnce(canceled)
  const failure = await apiRequest("/meals").catch((cause: unknown) => cause)
  expect(failure).toBe(canceled)
  expect(axios.isCancel(failure)).toBe(true)
  expect(failure).not.toBeInstanceOf(ApiError)

  request.mockClear()
  const controller = new AbortController()
  controller.abort()
  const beforeDispatch = await apiRequest("/meals", { signal: controller.signal }).catch(
    (cause: unknown) => cause,
  )
  expect(axios.isCancel(beforeDispatch)).toBe(true)
  expect(request).not.toHaveBeenCalled()
})

test.each([
  [{ retryAfterSec: 30 }, "60", 30],
  [{ retryAfterSec: 0 }, undefined, 0],
  [{ retryAfterSec: 1.2 }, undefined, 2],
  [{ retryAfterSec: -1 }, "60", 60],
  [{ retryAfterSec: Infinity }, "60", 60],
  [{ retryAfterSec: "30" }, "15", 15],
  [{}, "invalid", undefined],
  [{}, undefined, undefined],
])("normalizes server retry delays: body %j header %s", async (data, header, seconds) => {
  request.mockResolvedValueOnce(response(429, data, { "retry-after": header }))
  const failure = await apiRequest("/auth/sign-in").catch((cause: unknown) => cause)
  expect(failure).toBeInstanceOf(ApiError)
  expect((failure as ApiError).retryAfterSec).toBe(seconds)
})

test("Retry-After HTTP dates use wall-clock time and expired dates allow immediate retry", async () => {
  const clock = jest.spyOn(Date, "now").mockReturnValue(Date.parse("2026-11-04T12:00:00Z"))
  try {
    request.mockResolvedValueOnce(
      response(429, {}, { "retry-after": "Wed, 04 Nov 2026 12:02:00 GMT" }),
    )
    await expect(apiRequest("/auth/sign-in")).rejects.toMatchObject({ retryAfterSec: 120 })
    request.mockResolvedValueOnce(
      response(429, {}, { "retry-after": "Wed, 04 Nov 2026 11:59:00 GMT" }),
    )
    await expect(apiRequest("/auth/sign-in")).rejects.toMatchObject({ retryAfterSec: 0 })
  } finally {
    clock.mockRestore()
  }
})
