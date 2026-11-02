import { ApiError, apiRequest, onSessionExpired, setApiToken } from "@/lib/api";

const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
const response = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

beforeEach(() => {
  global.fetch = fetchMock;
  fetchMock.mockReset();
  setApiToken(null);
});

afterEach(() => {
  setApiToken(null);
});

test("returns structured validation errors without treating rejected changes as saved", async () => {
  fetchMock.mockResolvedValue(
    response(422, { message: "Weight must be positive", code: "VALIDATION" }),
  );
  await expect(
    apiRequest("/health/weight", { method: "PUT", body: { weightKg: -1 } }),
  ).rejects.toMatchObject({ status: 422, code: "VALIDATION", message: "Weight must be positive" });
});

test("expires the active bearer session on unauthorized data access", async () => {
  setApiToken("expired-session");
  const expired = jest.fn();
  const unsubscribe = onSessionExpired(expired);
  fetchMock.mockResolvedValue(response(401, { message: "Session expired" }));
  await expect(apiRequest("/meals")).rejects.toBeInstanceOf(ApiError);
  expect(expired).toHaveBeenCalledTimes(1);
  fetchMock.mockResolvedValue(response(200, { meals: [] }));
  await apiRequest("/meals");
  expect(fetchMock.mock.calls[1][1]?.headers).not.toHaveProperty("Authorization");
  unsubscribe();
});

test("an old request cannot expire a newly signed-in account", async () => {
  const { promise, resolve: finish } = Promise.withResolvers<Response>();
  fetchMock.mockImplementationOnce(() => promise);
  setApiToken("old-account");
  const expired = jest.fn();
  const unsubscribe = onSessionExpired(expired);
  const pending = apiRequest("/meals");
  setApiToken("new-account");
  finish(response(401, { message: "Old session expired" }));
  await expect(pending).rejects.toMatchObject({ status: 401 });
  expect(expired).not.toHaveBeenCalled();
  fetchMock.mockResolvedValue(response(200, { meals: [] }));
  await apiRequest("/meals");
  expect(fetchMock.mock.calls[1][1]?.headers).toHaveProperty("Authorization", "Bearer new-account");
  unsubscribe();
});

test("reports network failures and rejects non-API destinations", async () => {
  fetchMock.mockRejectedValue(new TypeError("offline"));
  await expect(apiRequest("/meals")).rejects.toMatchObject({ code: "NETWORK_ERROR", status: 0 });
  fetchMock.mockClear();
  await expect(apiRequest("//example.com/steal")).rejects.toMatchObject({ code: "INVALID_PATH" });
  expect(fetchMock).not.toHaveBeenCalled();
});

test("rejects a successful non-JSON response instead of fabricating data", async () => {
  fetchMock.mockResolvedValue(new Response("<html>gateway</html>", { status: 200 }));
  await expect(apiRequest("/meals")).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
});
