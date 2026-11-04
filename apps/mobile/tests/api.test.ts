import axios, { AxiosError, type AxiosResponse } from "axios";

import { ApiError, apiErrorMessage, apiRequest, onSessionExpired, setApiToken } from "@/lib/api";

jest.mock("axios", () => {
  const actual = jest.requireActual("axios");
  const instance = Object.assign({}, actual.default, { request: jest.fn() });
  return { __esModule: true, default: instance, AxiosError: actual.AxiosError };
});
const request = jest.mocked(axios.request);
const response = (status: number, data: unknown) => ({ status, data }) as AxiosResponse<unknown>;

beforeEach(() => {
  request.mockReset();
  setApiToken(null);
});

afterEach(() => {
  setApiToken(null);
});

test("normalizes server validation responses without discarding status or code", async () => {
  request.mockResolvedValue(response(422, { message: "Weight must be positive", code: "VALIDATION" }));
  await expect(
    apiRequest("/health/weight", { method: "PUT", body: { weightKg: -1 } }),
  ).rejects.toMatchObject({ status: 422, code: "VALIDATION", message: "Weight must be positive" });
});

test("expires the active bearer session on unauthorized data access", async () => {
  setApiToken("expired-session");
  const expired = jest.fn();
  const unsubscribe = onSessionExpired(expired);
  request.mockResolvedValueOnce(response(401, { message: "Session expired" }));
  await expect(apiRequest("/meals")).rejects.toBeInstanceOf(ApiError);
  expect(expired).toHaveBeenCalledTimes(1);
  request.mockResolvedValueOnce(response(200, { meals: [] }));
  await apiRequest("/meals");
  expect(request.mock.calls[1][0]).toMatchObject({ url: "/meals", headers: { Accept: "application/json" } });
  expect(request.mock.calls[1][0]?.headers).not.toHaveProperty("Authorization");
  unsubscribe();
});

test("an old request cannot expire a newly signed-in account", async () => {
  const { promise, resolve: finish } = Promise.withResolvers<AxiosResponse<unknown>>();
  request.mockReturnValueOnce(promise);
  setApiToken("old-account");
  const expired = jest.fn();
  const unsubscribe = onSessionExpired(expired);
  const pending = apiRequest("/meals");
  setApiToken("new-account");
  finish(response(401, { message: "Old session expired" }));
  await expect(pending).rejects.toMatchObject({ status: 401 });
  expect(expired).not.toHaveBeenCalled();
  request.mockResolvedValueOnce(response(200, { meals: [] }));
  await apiRequest("/meals");
  expect(request.mock.calls[1][0]?.headers).toHaveProperty("Authorization", "Bearer new-account");
  unsubscribe();
});

test("maps network and timeout errors to user-safe retryable error types", async () => {
  request.mockRejectedValueOnce(new AxiosError("offline", "ERR_NETWORK"));
  await expect(apiRequest("/meals")).rejects.toMatchObject({ code: "NETWORK_ERROR", status: 0 });
  request.mockRejectedValueOnce(new AxiosError("timeout", "ETIMEDOUT"));
  const failure = await apiRequest("/meals").catch((error: unknown) => error);
  expect(failure).toMatchObject({ code: "TIMEOUT", retryable: true });
  expect(apiErrorMessage(failure, "your meals")).toBe("Loading your meals took too long. Try again.");
});

test("rejects non-API destinations before sending a request", async () => {
  await expect(apiRequest("//example.com/steal")).rejects.toMatchObject({ code: "INVALID_PATH" });
  expect(request).not.toHaveBeenCalled();
});

test("maps common response statuses to specific plain-language guidance", () => {
  expect(apiErrorMessage(new ApiError("private", 404), "this meal")).toBe("This item no longer exists.");
  expect(apiErrorMessage(new ApiError("throttled", 429))).toBe("Too many requests. Wait a moment, then try again.");
  expect(apiErrorMessage(new ApiError("oops", 503))).toBe("Something went wrong on our end. Try again.");
});
