import { onlineManager, QueryClient } from "@tanstack/react-query"
import { act, cleanup, render, renderHook, waitFor } from "@testing-library/react-native"
import { AxiosError, type AxiosResponse } from "axios"
import { addNetworkStateListener, getNetworkStateAsync, NetworkStateType } from "expo-network"
import * as SecureStore from "expo-secure-store"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { NetworkStatusBanner } from "@/components/feedback/network-status"
import {
  AuthProvider,
  useAuth,
  type AuthUser,
  type AuthenticationSessionResponse,
} from "@/features/auth"
import { validatedIdentity, writeOfflineIdentity } from "@/features/auth/utils/offline-session"
import { apiRequest, setApiToken } from "@/lib/api/client"
import { openOfflineCache } from "@/lib/query/offline-cache"
import { sessionStorage } from "@/lib/storage"
import { createQueryWrapper } from "@/test-utils/query-wrapper"

jest.mock("@/lib/storage", () => ({
  sessionStorage: { getToken: jest.fn(), setToken: jest.fn(), clearToken: jest.fn() },
}))

jest.mock("expo-network", () => ({
  addNetworkStateListener: jest.fn(() => ({ remove: jest.fn() })),
  getNetworkStateAsync: jest.fn(),
  useNetworkState: () => ({ isConnected: true, isInternetReachable: true }),
  NetworkStateType: { WIFI: "WIFI", NONE: "NONE" },
}))

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
}))

jest.mock("expo-file-system", () => {
  const disk = { files: new Map<string, string>(), failDeletion: false }
  return {
    disk,
    Paths: { cache: "private-cache" },
    File: class {
      uri: string
      constructor(directory: string, name: string) {
        this.uri = `${directory}/${name}`
      }
      get exists() {
        return disk.files.has(this.uri)
      }
      get size() {
        return Buffer.byteLength(this.textSync())
      }
      create() {
        disk.files.set(this.uri, "")
      }
      textSync() {
        return disk.files.get(this.uri) ?? ""
      }
      writeSync(contents: string) {
        disk.files.set(this.uri, contents)
      }
      moveSync(target: { uri: string }) {
        const contents = this.textSync()
        disk.files.delete(this.uri)
        this.uri = target.uri
        disk.files.set(this.uri, contents)
      }
      delete() {
        if (disk.failDeletion) throw new Error("Cache directory unavailable")
        disk.files.delete(this.uri)
      }
    },
  }
})

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
  actual.default.defaults.adapter = jest.requireActual("@/test-utils/http-adapter").httpAdapter
  return actual
})
import { request } from "@/test-utils/http-adapter"
const saved = jest.mocked(sessionStorage)
const user = mockAuthenticationUser
const authenticated = () => mockAuthenticationSession()
const json = (status: number, data: unknown) => ({ status, data }) as AxiosResponse<unknown>
const secure = jest.mocked(SecureStore)
const leases = new Map<string, string>()
const { disk } = jest.requireMock<{ disk: { files: Map<string, string>; failDeletion: boolean } }>(
  "expo-file-system",
)
const weightKey = ["health", "member-a", "weights"] as const
const mealKey = ["meals", "member-a", "history"] as const
const workoutKey = ["workouts", "member-a", "history"] as const
const weights = [{ id: "weight-a", loggedDate: "2026-01-01", weightKg: 72.5 }]
const wifi = { isConnected: true, isInternetReachable: true, type: NetworkStateType.WIFI }
const airplane = { isConnected: false, isInternetReachable: false, type: NetworkStateType.NONE }
const clients = new Set<QueryClient>()

function accountWrapper(onClient?: (client: QueryClient) => void) {
  return createQueryWrapper(AuthProvider, (client) => {
    client.setDefaultOptions({
      queries: { gcTime: Infinity, retry: false },
      mutations: { gcTime: Infinity, retry: false },
    })
    clients.add(client)
    onClient?.(client)
  })
}

async function seedSnapshot() {
  const client = new QueryClient({
    defaultOptions: { queries: { gcTime: Infinity, retry: false } },
  })
  const stop = openOfflineCache(client, { accountId: "member-a", sessionId: "session-a" })
  try {
    await client.fetchQuery({ queryKey: weightKey, queryFn: () => Promise.resolve(weights) })
    client.setQueryData(weightKey, [{ ...weights[0], weightKg: -1 }])
    await client.fetchQuery({
      queryKey: mealKey,
      queryFn: () =>
        Promise.resolve([
          {
            id: "meal-a",
            name: "Lunch",
            items: [],
            macros: { protein: 15, carbs: 24, fat: 10 },
            imageUrl: "https://private.example/meal",
            photoId: "private-photo",
          },
        ]),
    })
    await client.fetchQuery({
      queryKey: workoutKey,
      queryFn: () =>
        Promise.resolve({
          pages: [{ count: 1, sessions: [{ id: "workout-a", sets: ["raw-attempt"] }] }],
          pageParams: [0],
        }),
    })
    await client.fetchQuery({
      queryKey: ["meals", "member-a", "photo", "meal-a"],
      queryFn: () => Promise.resolve("https://private.example/signed"),
    })
    await waitFor(() => expect([...disk.files.values()][0]).toContain("workout-a"))
  } finally {
    stop()
    client.clear()
  }
}

async function seedLease(response = authenticated()) {
  const identity = validatedIdentity(response)
  if (!identity) throw new Error("Test requires an unexpired server response")
  await writeOfflineIdentity(response.session.token, identity)
}

function renderAccount() {
  const client = { current: null as QueryClient | null }
  const wrapper = accountWrapper((queryClient) => {
    client.current = queryClient
  })
  return renderHook(() => useAuth(), { wrapper }).then((view) => ({
    ...view,
    client: client.current!,
  }))
}

beforeEach(() => {
  disk.files.clear()
  disk.failDeletion = false
  leases.clear()
  secure.getItemAsync.mockImplementation(async (key) => leases.get(key) ?? null)
  secure.setItemAsync.mockImplementation(async (key, value) => {
    leases.set(key, value)
  })
  secure.deleteItemAsync.mockImplementation(async (key) => {
    leases.delete(key)
  })
  jest.mocked(getNetworkStateAsync).mockResolvedValue(wifi)
  request.mockReset()
  saved.getToken.mockResolvedValue(null)
  saved.setToken.mockResolvedValue(undefined)
  saved.clearToken.mockResolvedValue(undefined)
  setApiToken(null)
})

afterEach(async () => {
  await cleanup()
  for (const client of clients) client.clear()
  clients.clear()
  onlineManager.setOnline(true)
  setApiToken(null)
})

test("restores a saved session only after the server validates it", async () => {
  saved.getToken.mockResolvedValue("secret-a")
  request.mockResolvedValue(json(200, authenticated()))
  const { result } = await renderHook(() => useAuth(), {
    wrapper: accountWrapper(),
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
    wrapper: accountWrapper(),
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
    wrapper: accountWrapper(),
  })
  await waitFor(() => expect(restored.result.current.loading).toBe(false))
  expect(restored.result.current.user?.id).toBe(user.id)
})

test("revoked credentials cannot restore private account state", async () => {
  saved.getToken.mockResolvedValue("revoked-token")
  request.mockResolvedValue(json(401, { message: "Session expired" }))
  const { result } = await renderHook(() => useAuth(), {
    wrapper: accountWrapper(),
  })
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.user).toBeNull()
  expect(saved.clearToken).toHaveBeenCalled()
})

test("airplane-mode cold start restores successful reads immediately, then validates before reconnect", async () => {
  await seedSnapshot()
  await seedLease()
  saved.getToken.mockResolvedValue("secret-a")
  jest.mocked(getNetworkStateAsync).mockResolvedValue(airplane)
  const { result, client } = await renderAccount()
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(request).not.toHaveBeenCalled()
  expect(result.current.user).toMatchObject({ id: "member-a" })
  expect(result.current.user?.email).toBeUndefined()
  expect(result.current.offline).toBe(true)
  expect(client.getQueryData(weightKey)).toEqual(weights)
  expect(client.getQueryData(mealKey)).toMatchObject([
    { id: "meal-a", imageUrl: null, photoUnavailableOffline: true },
  ])
  expect(client.getQueryData(workoutKey)).toMatchObject({
    pages: [{ count: 1, sessions: [{ id: "workout-a" }] }],
    pageParams: [0],
  })
  const serialized = [...disk.files.values()][0]
  for (const excluded of ["secret-a", "private.example", "private-photo", "raw-attempt"]) {
    expect(serialized).not.toContain(excluded)
  }

  const validation = Promise.withResolvers<AxiosResponse<unknown>>()
  request.mockReturnValueOnce(validation.promise)
  await act(async () => {
    jest.mocked(addNetworkStateListener).mock.lastCall?.[0](wifi)
  })
  expect(request.mock.calls[0][0]?.url).toBe("/auth/session")
  expect(result.current.offline).toBe(true)
  expect(onlineManager.isOnline()).toBe(false)
  await expect(apiRequest("/health/weight", { method: "PUT" })).rejects.toMatchObject({
    code: "OFFLINE",
  })
  expect(request).toHaveBeenCalledTimes(1)

  await act(async () => {
    validation.resolve(json(200, authenticated()))
  })
  await waitFor(() => expect(result.current.offline).toBe(false))
  expect(result.current.user?.email).toBe(user.email)
  expect(onlineManager.isOnline()).toBe(true)

  request.mockResolvedValueOnce(json(401, { message: "Revoked" }))
  await act(async () => {
    jest.mocked(addNetworkStateListener).mock.lastCall?.[0](airplane)
    jest.mocked(addNetworkStateListener).mock.lastCall?.[0](wifi)
  })
  await waitFor(() => expect(result.current.user).toBeNull())
  await waitFor(() => expect(disk.files.size).toBe(0))
  expect(client.getQueryData(weightKey)).toBeUndefined()
  expect(saved.clearToken).toHaveBeenCalled()
  expect(leases.size).toBe(0)
})

test("shows offline mode if Wi-Fi is connected but the API cannot be reached", async () => {
  await seedLease()
  saved.getToken.mockResolvedValue("secret-a")
  request.mockRejectedValue(new AxiosError("Network Error", "ERR_NETWORK"))
  const Wrapper = accountWrapper()
  const screen = await render(
    <Wrapper>
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, height: 640, width: 320 },
          insets: { top: 0, right: 0, bottom: 0, left: 0 },
        }}
      >
        <NetworkStatusBanner />
      </SafeAreaProvider>
    </Wrapper>,
  )
  await screen.findByText(/Offline mode/)
  expect(request.mock.calls[0][0]?.url).toBe("/auth/session")
})

test.each([401, 403, 500])("HTTP %s cannot use a valid offline lease", async (status) => {
  await seedLease()
  saved.getToken.mockResolvedValue("secret-a")
  request.mockResolvedValue(json(status, { code: "NETWORK_ERROR" }))
  const { result } = await renderAccount()
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.user).toBeNull()
  if (status < 500) {
    await waitFor(() => expect(leases.size).toBe(0))
    expect(saved.clearToken).toHaveBeenCalled()
  }
})

test.each(["expired", "another token", "unreadable lease"])(
  "%s cannot restore offline",
  async (kind) => {
    await seedLease()
    if (kind === "expired") {
      const [key, value] = [...leases][0]
      leases.set(key, JSON.stringify({ ...JSON.parse(value), expiresAt: "2000-01-01" }))
    } else if (kind === "unreadable lease") {
      secure.getItemAsync.mockRejectedValueOnce(new Error("SecureStore unavailable"))
    }
    saved.getToken.mockResolvedValue(kind === "another token" ? "secret-b" : "secret-a")
    request.mockRejectedValue(new AxiosError("Network Error", "ERR_NETWORK"))
    const { result } = await renderAccount()
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()
  },
)

test("expired query data is not restored even while the same device session is valid", async () => {
  await seedLease()
  await seedSnapshot()
  const [file, contents] = [...disk.files][0]
  const snapshot = JSON.parse(contents) as { entries: { at: number }[] }
  for (const entry of snapshot.entries) entry.at = Date.now() - 8 * 86_400_000
  disk.files.set(file, JSON.stringify(snapshot))
  saved.getToken.mockResolvedValue("secret-a")
  jest.mocked(getNetworkStateAsync).mockResolvedValue(airplane)
  const { result, client } = await renderAccount()
  await waitFor(() => expect(result.current.user?.id).toBe("member-a"))
  expect(client.getQueryData(weightKey)).toBeUndefined()
})

test("clears local state on sign-out and cannot restore another account's file after cleanup fails", async () => {
  await seedLease()
  await seedSnapshot()
  saved.getToken.mockResolvedValue("secret-a")
  request.mockResolvedValueOnce(json(200, authenticated()))
  const first = await renderAccount()
  await waitFor(() => expect(first.result.current.user?.id).toBe("member-a"))
  expect(first.client.getQueryData(weightKey)).toEqual(weights)
  disk.failDeletion = true
  request.mockResolvedValueOnce(json(200, {}))
  await act(async () => {
    await first.result.current.signOut()
  })
  expect(first.result.current.user).toBeNull()
  expect(first.client.getQueryData(weightKey)).toBeUndefined()
  expect(first.result.current.error).toMatch(/some saved account data could not be removed/)
  expect(disk.files.size).toBe(1)
  expect(leases.size).toBe(0)
  await first.unmount()

  const separate = authenticated()
  separate.user = { ...separate.user, id: "member-b" }
  separate.session = { ...separate.session, id: "session-b", token: "secret-b", userId: "member-b" }
  await seedLease(separate)
  saved.getToken.mockResolvedValue("secret-b")
  jest.mocked(getNetworkStateAsync).mockResolvedValue(airplane)
  const second = await renderAccount()
  await waitFor(() => expect(second.result.current.user?.id).toBe("member-b"))
  expect(second.client.getQueryData(weightKey)).toBeUndefined()
  expect(second.client.getQueryData(["health", "member-b", "weights"])).toBeUndefined()
})

test("failed login stays signed out and surfaces server error", async () => {
  const { result } = await renderHook(() => useAuth(), {
    wrapper: accountWrapper(),
  })
  await waitFor(() => expect(result.current.loading).toBe(false))
  request.mockResolvedValue(json(401, { message: "Invalid email or password" }))
  await act(async () => {
    await expect(result.current.signIn("member@example.com", "wrong")).rejects.toMatchObject({
      status: 401,
    })
  })
  expect(result.current.user).toBeNull()
  expect(result.current.error).toBe(
    "We could not sign you in. Check your email and password and try again.",
  )
  expect(saved.setToken).not.toHaveBeenCalled()
})

test.each(["sign-in", "sign-up", "request reset", "verify reset", "complete reset"] as const)(
  "offline %s rejects and releases the form instead of queuing until reconnect",
  async (action) => {
    const { result } = await renderHook(() => useAuth(), {
      wrapper: accountWrapper(),
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
    await act(async () => {
      await expect(actions[action]()).rejects.toMatchObject({ status: 0, code: "NETWORK_ERROR" })
      const { promise, resolve } = Promise.withResolvers<void>()
      setTimeout(resolve, 0)
      await promise
    })
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
  const wrapper = accountWrapper()
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
    wrapper: accountWrapper(),
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
    wrapper: accountWrapper(),
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
