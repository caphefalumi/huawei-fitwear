import { onlineManager, type QueryClient } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react-native"
import { AxiosError, type AxiosResponse } from "axios"

import {
  AuthProvider,
  useAuth,
  type AuthUser,
  type AuthenticationSessionResponse,
} from "@/features/auth"
import { setApiToken } from "@/lib/api"
import { sessionStorage } from "@/lib/storage"

import { createQueryWrapper } from "./query-wrapper"

jest.mock("@/lib/storage", () => ({
  sessionStorage: { getToken: jest.fn(), setToken: jest.fn(), clearToken: jest.fn() },
}))

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
}

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
  }
}

jest.mock("axios", () => {
  const actual = jest.requireActual("axios")
  actual.default.defaults.adapter = jest.requireActual("./http-adapter").httpAdapter
  return actual
})
import { request } from "./http-adapter"
const saved = jest.mocked(sessionStorage)
const user = mockAuthenticationUser
const authenticated = () => mockAuthenticationSession()
const json = (status: number, data: unknown) => ({ status, data }) as AxiosResponse<unknown>

beforeEach(() => {
  request.mockReset()
  saved.getToken.mockResolvedValue(null)
  saved.setToken.mockResolvedValue(undefined)
  saved.clearToken.mockResolvedValue(undefined)
  setApiToken(null)
})

afterEach(() => {
  onlineManager.setOnline(true)
  setApiToken(null)
})

test("restores a saved session only after the server validates it", async () => {
  saved.getToken.mockResolvedValue("secret-a")
  request.mockResolvedValue(json(200, authenticated()))
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  })
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.user?.id).toBe("member-a")
  expect(request.mock.calls[0][0]?.headers).toHaveProperty("Authorization", "Bearer secret-a")
})

test("offline saved-session validation releases startup without trusting or deleting the token", async () => {
  saved.getToken.mockResolvedValue("secret-a")
  onlineManager.setOnline(false)
  request.mockRejectedValue(new AxiosError("Network Error", "ERR_NETWORK"))
  const first = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  })
  await waitFor(() => expect(first.result.current.loading).toBe(false))
  expect(first.result.current.user).toBeNull()
  expect(saved.clearToken).not.toHaveBeenCalled()

  await act(async () => {
    onlineManager.setOnline(true)
  })
  expect(request).toHaveBeenCalledTimes(1)
  await first.unmount()

  request.mockResolvedValue(json(200, authenticated()))
  const restored = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  })
  await waitFor(() => expect(restored.result.current.loading).toBe(false))
  expect(restored.result.current.user?.id).toBe(user.id)
})

test("revoked credentials cannot restore private account state", async () => {
  saved.getToken.mockResolvedValue("revoked-token")
  request.mockResolvedValue(json(401, { message: "Session expired" }))
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  })
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.user).toBeNull()
  expect(saved.clearToken).toHaveBeenCalled()
})

test("failed login stays signed out and surfaces server error", async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  })
  await waitFor(() => expect(result.current.loading).toBe(false))
  request.mockResolvedValue(json(401, { message: "Invalid email or password" }))
  await act(async () => {
    await expect(result.current.signIn("member@example.com", "wrong")).rejects.toMatchObject({
      status: 401,
    })
  })
  expect(result.current.user).toBeNull()
  expect(result.current.error).toBe("Invalid email or password")
  expect(saved.setToken).not.toHaveBeenCalled()
})

test.each(["sign-in", "sign-up", "request reset", "verify reset", "complete reset"] as const)(
  "offline %s rejects and releases the form instead of queuing until reconnect",
  async (action) => {
    const { result } = await renderHook(() => useAuth(), {
      wrapper: createQueryWrapper(AuthProvider),
    })
    await waitFor(() => expect(result.current.loading).toBe(false))
    const actions = {
      "sign-in": () => result.current.signIn("member@example.com", "secret"),
      "sign-up": () =>
        result.current.signUp({
          name: "Member",
          email: "member@example.com",
          password: "secret-password",
          birthDate: "2000-01-01",
        }),
      "request reset": () => result.current.requestPasswordReset("member@example.com"),
      "verify reset": () => result.current.verifyPasswordReset("member@example.com", "1234"),
      "complete reset": () => result.current.completePasswordReset("reset-token", "new-password"),
    }
    onlineManager.setOnline(false)
    request.mockRejectedValue(new AxiosError("Network Error", "ERR_NETWORK"))
    let failure: unknown
    await act(async () => {
      void actions[action]().catch((error: unknown) => {
        failure = error
      })
    })
    await waitFor(() => expect(failure).toMatchObject({ status: 0, code: "NETWORK_ERROR" }))
    expect(result.current.pending).toBe(false)
    expect(result.current.user).toBeNull()
    expect(saved.setToken).not.toHaveBeenCalled()
    await act(async () => {
      onlineManager.setOnline(true)
    })
    expect(request).toHaveBeenCalledTimes(1)
  },
)

test("sign-out clears local private state before server revocation completes", async () => {
  const client = { current: null as QueryClient | null }
  const wrapper = createQueryWrapper(AuthProvider, (queryClient) => {
    client.current = queryClient
  })
  const { result } = await renderHook(() => useAuth(), { wrapper })
  await waitFor(() => expect(result.current.loading).toBe(false))
  request.mockResolvedValueOnce(json(200, authenticated()))
  await act(async () => {
    await result.current.signIn("member@example.com", "correct")
  })
  expect(result.current.user?.id).toBe(user.id)
  const { promise: revocation, resolve: resolveRevocation } =
    Promise.withResolvers<AxiosResponse<unknown>>()
  request.mockReturnValueOnce(revocation)
  await act(async () => {
    await result.current.signOut()
  })
  expect(result.current.user).toBeNull()
  expect(saved.clearToken).toHaveBeenCalled()
  await act(async () => {
    resolveRevocation(json(200, {}))
    await revocation
    const { promise: notification, resolve } = Promise.withResolvers<void>()
    setTimeout(resolve, 0)
    await notification
  })
  expect(request.mock.calls[1][0]?.headers).toHaveProperty("Authorization", "Bearer secret-a")
})

test("deleteAccount deletes user on server and clears local private state", async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  })
  await waitFor(() => expect(result.current.loading).toBe(false))
  request.mockResolvedValueOnce(json(200, authenticated()))
  await act(async () => {
    await result.current.signIn("member@example.com", "correct")
  })
  expect(result.current.user?.id).toBe(user.id)
  request.mockResolvedValueOnce(json(200, { success: true }))
  await act(async () => {
    await result.current.deleteAccount()
  })
  expect(result.current.user).toBeNull()
  expect(saved.clearToken).toHaveBeenCalled()
})

test("failed account deletion keeps the signed-in user and local session", async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: createQueryWrapper(AuthProvider),
  })
  await waitFor(() => expect(result.current.loading).toBe(false))
  request.mockResolvedValueOnce(json(200, authenticated()))
  await act(async () => {
    await result.current.signIn("member@example.com", "correct")
  })
  request.mockResolvedValueOnce(json(500, { message: "Server unavailable" }))

  await act(async () => {
    await expect(result.current.deleteAccount()).rejects.toMatchObject({ status: 500 })
  })

  expect(result.current.user?.id).toBe(user.id)
  expect(saved.clearToken).not.toHaveBeenCalled()
  expect(result.current.pending).toBe(false)
})
