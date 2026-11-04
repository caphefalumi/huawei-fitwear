import { act, renderHook, waitFor } from "@testing-library/react-native";
import {
  AuthProvider,
  useAuth,
  type AuthUser,
  type AuthenticationSessionResponse,
} from "@/features/auth/auth-store";
import { sessionStorage } from "@/features/auth/session-storage";
import { setApiToken } from "@/lib/api";
import { createQueryWrapper } from "./query-wrapper";

jest.mock("@/features/auth/session-storage", () => ({
  sessionStorage: { getToken: jest.fn(), setToken: jest.fn(), clearToken: jest.fn() },
}));

const mockAuthenticationUser: AuthUser = {
  id: "member-a",
  email: "member@example.com",
  name: "Member",
  emailVerified: false,
  image: null,
  gender: null,
  birthDate: null,
  heightCm: null,
  currentWeightKg: null,
  targetWeightKg: null,
  activityLevel: null,
  fitnessGoal: null,
  weeklySessions: 3,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function mockAuthenticationSession(
  expiresAt = new Date(Date.now() + 86_400_000).toISOString(),
): AuthenticationSessionResponse {
  return {
    user: mockAuthenticationUser,
    session: {
      id: "session-a",
      token: "secret-a",
      userId: mockAuthenticationUser.id,
      expiresAt,
    },
  };
}

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
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.user?.id).toBe("member-a");
  expect(fetchMock.mock.calls[0][1]?.headers).toHaveProperty("Authorization", "Bearer secret-a");
});

test("revoked credentials cannot restore private account state", async () => {
  saved.getToken.mockResolvedValue("revoked-token");
  fetchMock.mockResolvedValue(json(401, { message: "Session expired" }));
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.user).toBeNull();
  expect(saved.clearToken).toHaveBeenCalled();
});

test("failed login stays signed out and surfaces server error", async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  });
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

test("sign-out clears local private state before server revocation completes", async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  fetchMock.mockResolvedValueOnce(json(200, authenticated()));
  await act(async () => {
    await result.current.signIn("member@example.com", "correct");
  });
  expect(result.current.user?.id).toBe(user.id);
  fetchMock.mockReturnValueOnce(new Promise<Response>(() => {}));
  await act(async () => {
    await result.current.signOut();
  });
  expect(result.current.user).toBeNull();
  expect(saved.clearToken).toHaveBeenCalled();
  expect(fetchMock.mock.calls[1][1]?.headers).toHaveProperty("Authorization", "Bearer secret-a");
});

test("deleteAccount deletes user on server and clears local private state", async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  fetchMock.mockResolvedValueOnce(json(200, authenticated()));
  await act(async () => {
    await result.current.signIn("member@example.com", "correct");
  });
  expect(result.current.user?.id).toBe(user.id);
  fetchMock.mockResolvedValueOnce(json(200, { success: true }));
  await act(async () => {
    await result.current.deleteAccount();
  });
  expect(result.current.user).toBeNull();
  expect(saved.clearToken).toHaveBeenCalled();
});

test("failed account deletion keeps the signed-in user and local session", async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  fetchMock.mockResolvedValueOnce(json(200, authenticated()));
  await act(async () => {
    await result.current.signIn("member@example.com", "correct");
  });
  fetchMock.mockResolvedValueOnce(json(500, { message: "Server unavailable" }));

  await act(async () => {
    await expect(result.current.deleteAccount()).rejects.toMatchObject({ status: 500 });
  });

  expect(result.current.user?.id).toBe(user.id);
  expect(saved.clearToken).not.toHaveBeenCalled();
  expect(result.current.pending).toBe(false);
});
