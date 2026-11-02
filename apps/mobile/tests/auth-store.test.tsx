import { act, renderHook, waitFor } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "@/features/auth/auth-store";
import { sessionStorage } from "@/features/auth/services/session-storage";
import { setApiToken } from "@/lib/api";
import { mockAuthenticationSession, mockAuthenticationUser } from "@/features/auth/mocks/api";

jest.mock("@/features/auth/services/session-storage", () => ({
  sessionStorage: { getToken: jest.fn(), setToken: jest.fn(), clearToken: jest.fn() },
}));

const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
const saved = jest.mocked(sessionStorage);
const user = mockAuthenticationUser;
const authenticated = () => mockAuthenticationSession();
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });

beforeEach(() => {
  global.fetch = fetchMock;
  fetchMock.mockReset();
  saved.getToken.mockResolvedValue(null);
  saved.setToken.mockResolvedValue(undefined);
  saved.clearToken.mockResolvedValue(undefined);
  setApiToken(null);
});

afterEach(() => {
  setApiToken(null);
});

test("restores a saved session only after the server validates it", async () => {
  saved.getToken.mockResolvedValue("secret-a");
  fetchMock.mockResolvedValue(json(200, authenticated()));
  const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.user?.id).toBe("member-a");
  expect(fetchMock.mock.calls[0][1]?.headers).toHaveProperty("Authorization", "Bearer secret-a");
});

test("revoked credentials cannot restore private account state", async () => {
  saved.getToken.mockResolvedValue("revoked-token");
  fetchMock.mockResolvedValue(json(401, { message: "Session expired" }));
  const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.user).toBeNull();
  expect(saved.clearToken).toHaveBeenCalled();
});

test("failed login stays signed out and surfaces server error", async () => {
  const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });
  await waitFor(() => expect(result.current.loading).toBe(false));
  fetchMock.mockResolvedValue(json(401, { message: "Invalid email or password" }));
  await act(async () => {
    await expect(result.current.signIn("member@example.com", "wrong")).rejects.toMatchObject({
      status: 401,
    });
  });
  expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/auth\/sign-in$/);
  expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
    email: "member@example.com",
    password: "wrong",
  });
  expect(result.current.user).toBeNull();
  expect(result.current.error).toBe("Invalid email or password");
  expect(saved.setToken).not.toHaveBeenCalled();
});

test("sign-out clears local private state even when server revocation fails", async () => {
  const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });
  await waitFor(() => expect(result.current.loading).toBe(false));
  fetchMock.mockResolvedValueOnce(json(200, authenticated()));
  await act(async () => {
    await result.current.signIn("member@example.com", "correct");
  });
  expect(result.current.user?.id).toBe(user.id);
  fetchMock.mockRejectedValueOnce(new TypeError("offline"));
  await act(async () => {
    await expect(result.current.signOut()).rejects.toThrow();
  });
  expect(result.current.user).toBeNull();
  expect(saved.clearToken).toHaveBeenCalled();
});
