import { onlineManager, useMutation, useQueryClient } from "@tanstack/react-query"
import { addNetworkStateListener, getNetworkStateAsync, type NetworkState } from "expo-network"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react"
import { AppState, Platform } from "react-native"

import { captureException, posthog } from "@/lib/analytics/posthog"
import {
  ApiError,
  apiErrorMessage,
  onSessionExpired,
  pauseAccountRequests,
  setApiToken,
  userFacingAccountDeleteError,
  userFacingAuthError,
  userFacingSessionError,
} from "@/lib/api/client"
import { clearOfflineCache, openOfflineCache } from "@/lib/query/offline-cache"
import { sessionStorage } from "@/lib/storage"
import { clearMealPhotoCache } from "@/lib/storage/meal-photo-cache"

import {
  getSession,
  sendSignIn,
  sendDeleteAccount,
  sendPasswordReset,
  sendVerifyPasswordReset,
  sendCompletePasswordReset,
  sendSignOut,
  sendSignUp,
  sendUpdateUser,
} from "../api/auth-api"
import type {
  AuthUser,
  AuthenticationSession,
  AuthenticationSessionResponse,
  SignUpBody,
  UpdateUserBody,
} from "../types"
export type {
  AuthUser,
  AuthenticationSession,
  AuthenticationSessionResponse,
  SignUpBody,
  UpdateUserBody,
}
import { useAuthUiStore } from "../store/auth-ui-store"
import {
  clearOfflineIdentity,
  readOfflineIdentity,
  validatedIdentity,
  writeOfflineIdentity,
  type OfflineIdentity,
  type SessionUser,
} from "../utils/offline-session"

export const APP_ROUTES = {
  welcome: "/",
  login: "/login",
  signUp: "/sign-up",
  home: "/home",
} as const

type AuthContextValue = {
  user: SessionUser | null
  offline?: boolean
  loading: boolean
  pending: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (body: SignUpBody) => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ message: string; resendAfterSeconds: number }>
  verifyPasswordReset: (email: string, code: string) => Promise<string>
  completePasswordReset: (resetToken: string, password: string) => Promise<string>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
  updateUser: (body: UpdateUserBody) => Promise<void>
}
const AuthContext = createContext<AuthContextValue | null>(null)

function identifyUser(user: AuthUser) {
  posthog?.identify(user.id, {
    $set: {
      email: user.email,
      ...(user.name ? { name: user.name } : {}),
    },
  })
}

const RECONNECT_RETRY_MS = 2_000
const RECONNECT_RETRY_MAX_MS = 30_000

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<{ user: SessionUser; expiresAt: string } | null>(null)
  const [offline, setOffline] = useState(false)
  const [loading, setLoading] = useState(true)
  const pending = useAuthUiStore((state) => state.pending)
  const setPending = useAuthUiStore((state) => state.setPending)
  const error = useAuthUiStore((state) => state.error)
  const setError = useAuthUiStore((state) => state.setError)
  const revision = useRef(0)
  const busy = useRef(false)
  const credential = useRef<{ token: string; identity: OfflineIdentity | null } | null>(null)
  const reachable = useRef<boolean | undefined>(undefined)
  const cloudAvailable = useRef(false)
  const stopSnapshot = useRef<(() => void) | null>(null)
  const storageWork = useRef(Promise.resolve())
  const queryClient = useQueryClient()
  const authenticateMutation = useMutation({
    mutationKey: ["auth", "authenticate"],
    // Interactive auth must report offline failures, not queue until reconnect.
    networkMode: "always",
    mutationFn: (send: () => Promise<AuthenticationSessionResponse>) => send(),
  })
  const passwordResetMutation = useMutation({
    mutationKey: ["auth", "password-reset"],
    networkMode: "always",
    mutationFn: sendPasswordReset,
  })
  const verifyResetMutation = useMutation({
    mutationKey: ["auth", "password-reset-verify"],
    networkMode: "always",
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      sendVerifyPasswordReset(email, code),
  })
  const completeResetMutation = useMutation({
    mutationKey: ["auth", "password-reset-complete"],
    networkMode: "always",
    mutationFn: ({ resetToken, password }: { resetToken: string; password: string }) =>
      sendCompletePasswordReset(resetToken, password),
  })
  const signOutMutation = useMutation({
    mutationKey: ["auth", "sign-out"],
    networkMode: "always",
    mutationFn: (request: Promise<unknown>) => request,
  })
  const deleteAccountMutation = useMutation({
    mutationKey: ["auth", "delete-account"],
    networkMode: "always",
    mutationFn: sendDeleteAccount,
  })
  const updateUserMutation = useMutation({
    mutationKey: ["auth", "update-user"],
    networkMode: "always",
    mutationFn: sendUpdateUser,
  })
  const { mutateAsync: authenticateAsync } = authenticateMutation
  const { mutateAsync: signOutAsync } = signOutMutation
  const { mutateAsync: deleteAccountAsync } = deleteAccountMutation
  const { mutateAsync: updateUserAsync } = updateUserMutation

  const queueStorage = useCallback((work: () => Promise<void>) => {
    const next = storageWork.current.then(work)
    storageWork.current = next.catch(() => {})
    return next
  }, [])

  const setCloudAvailable = useCallback((available: boolean) => {
    cloudAvailable.current = available
    if (Platform.OS === "web") return
    pauseAccountRequests(!available)
    onlineManager.setOnline(available)
    setOffline(!available)
  }, [])

  const dropSession = useCallback(() => {
    revision.current += 1
    credential.current = null
    stopSnapshot.current?.()
    stopSnapshot.current = null
    posthog?.reset()
    setApiToken(null)
    setCloudAvailable(false)
    setSession(null)
    queryClient.clear()
  }, [queryClient, setCloudAvailable])

  const clearSession = useCallback(() => {
    dropSession()
    return queueStorage(async () => {
      const results = await Promise.allSettled([
        sessionStorage.clearToken(),
        clearOfflineIdentity(),
        Promise.resolve().then(clearOfflineCache),
        clearMealPhotoCache(),
      ])
      if (results.some((result) => result.status === "rejected")) {
        throw new Error("Could not remove all saved account data.")
      }
    })
  }, [dropSession, queueStorage])

  const showSession = useCallback(
    (identity: OfflineIdentity, user: SessionUser) => {
      stopSnapshot.current ??= openOfflineCache(queryClient, {
        accountId: identity.user.id,
        sessionId: identity.sessionId,
      })
      setSession({ user, expiresAt: identity.expiresAt })
      setError(null)
    },
    [queryClient, setError],
  )

  const saveLease = useCallback(
    (token: string, identity: OfflineIdentity) =>
      queueStorage(() => writeOfflineIdentity(token, identity)).catch(() => {
        // Storage failure cannot turn a successful server sign-in into an error.
        captureException(new Error("Could not save the offline session."))
      }),
    [queueStorage],
  )
  useEffect(() => {
    useAuthUiStore.getState().reset()
  }, [])

  useEffect(() => {
    let active = true
    let validation: AbortController | null = null
    // A network change that arrives while a check is in flight. Reconnecting
    // often comes up on cellular and moves to Wi-Fi seconds later, which can
    // fail the check started on cellular; check again after it ends.
    let revalidate = false
    // A check that fails while the device still reports a connection is tried
    // again with backoff: no further network event may come to trigger it.
    let retryTimer: ReturnType<typeof setTimeout> | null = null
    let retryDelay = RECONNECT_RETRY_MS
    function cancelRetry() {
      if (retryTimer) clearTimeout(retryTimer)
      retryTimer = null
    }
    function scheduleRetry() {
      if (!active || retryTimer || reachable.current === false) return
      retryTimer = setTimeout(() => {
        retryTimer = null
        if (active && !cloudAvailable.current && reachable.current !== false) void validate()
      }, retryDelay)
      retryDelay = Math.min(retryDelay * 2, RECONNECT_RETRY_MAX_MS)
    }
    let networkVersion = 0
    const native = Platform.OS !== "web"
    const startRevision = revision.current

    function showSavedSession() {
      const saved = credential.current
      if (!saved?.identity || !(Date.parse(saved.identity.expiresAt) > Date.now())) return false
      setApiToken(saved.token)
      // A warm session already has its full user; only a cold restore needs the projection.
      if (!stopSnapshot.current) showSession(saved.identity, saved.identity.user)
      return true
    }

    const clearSavedOfflineData = () =>
      queueStorage(async () => {
        await Promise.allSettled([
          clearOfflineIdentity(),
          Promise.resolve().then(clearOfflineCache),
          clearMealPhotoCache(),
        ])
      })

    async function validate() {
      const saved = credential.current
      if (validation) {
        revalidate = true
        return
      }
      if (!active || !saved) return
      revalidate = false
      cancelRetry()
      const currentRevision = revision.current
      const controller = new AbortController()
      const stillCurrent = () =>
        active && !controller.signal.aborted && revision.current === currentRevision
      validation = controller
      const { token, identity: previous } = saved
      setApiToken(token)
      try {
        const response = await getSession(controller.signal)
        if (!stillCurrent()) return
        const identity = validatedIdentity(response, token)
        if (
          !identity ||
          (previous &&
            (previous.user.id !== identity.user.id || previous.sessionId !== identity.sessionId))
        ) {
          throw new ApiError("The server returned an invalid session.", 0, "INVALID_SESSION")
        }
        await saveLease(token, identity)
        if (!stillCurrent()) return
        credential.current = { token, identity }
        showSession(identity, response.user)
        identifyUser(response.user)
        retryDelay = RECONNECT_RETRY_MS
        setCloudAvailable(reachable.current !== false)
      } catch (cause) {
        if (!stillCurrent()) return
        if (
          native &&
          cause instanceof ApiError &&
          cause.status === 0 &&
          (cause.code === "NETWORK_ERROR" || cause.code === "TIMEOUT")
        ) {
          setCloudAvailable(false)
          if (showSavedSession()) {
            scheduleRetry()
            return
          }
          if (previous) {
            setError("Your session expired. Please sign in again.")
            await clearSession().catch(() => {
              setError("Session expired, but saved account data could not be removed.")
            })
            return
          }
          setApiToken(null)
          setError(userFacingSessionError(cause))
          await clearSavedOfflineData()
        } else if (
          cause instanceof ApiError &&
          (cause.status === 401 || cause.status === 403 || cause.code === "INVALID_SESSION")
        ) {
          setError("Your session expired. Please sign in again.")
          await clearSession().catch(() => {
            setError("Session expired, but saved account data could not be removed.")
          })
        } else {
          dropSession()
          captureException(cause)
          setError(userFacingSessionError(cause))
        }
      } finally {
        if (validation === controller) {
          validation = null
          if (revalidate && active && !cloudAvailable.current && reachable.current !== false) {
            void validate()
          }
        }
      }
    }

    async function hydrate() {
      try {
        const token = await sessionStorage.getToken()
        if (!active || revision.current !== startRevision) return
        if (!token) {
          await clearSavedOfflineData()
          return
        }
        const identity = await readOfflineIdentity(token).catch(() => null)
        if (!active || revision.current !== startRevision) return
        credential.current = { token, identity }
        if (native && reachable.current === false) {
          if (!showSavedSession()) {
            setError("Could not restore your session. Sign in again when you're back online.")
            await clearSavedOfflineData()
          }
          return
        }
        await validate()
      } catch (cause) {
        if (active && revision.current === startRevision) {
          captureException(cause)
          setError(userFacingSessionError(cause))
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    const unsubscribe = onSessionExpired(() => {
      if (!active) return
      setError("Your session expired. Please sign in again.")
      void clearSession().catch(() => {
        setError("Session expired, but saved account data could not be removed.")
      })
    })

    function updateNetwork(state: NetworkState) {
      const wasReachable = reachable.current
      const available = state.isConnected !== false && state.isInternetReachable !== false
      reachable.current = available
      if (!available) {
        cancelRetry()
        setCloudAvailable(false)
        if (credential.current) {
          if (!showSavedSession()) {
            setError("Could not restore your session. Sign in again when you're back online.")
          }
          setLoading(false)
        }
      } else if (!cloudAvailable.current) {
        if (wasReachable === false && validation) {
          validation.abort()
          validation = null
        }
        void validate()
      }
    }

    setCloudAvailable(false)
    const network = native
      ? addNetworkStateListener((state) => {
          networkVersion += 1
          updateNetwork(state)
        })
      : undefined
    function readNetwork() {
      const version = networkVersion
      void getNetworkStateAsync()
        .then((state) => {
          if (active && networkVersion === version) updateNetwork(state)
        })
        .catch(() => {})
    }
    if (native) readNetwork()
    const foreground = native
      ? AppState.addEventListener("change", (state) => {
          if (state === "active" && !cloudAvailable.current) readNetwork()
        })
      : undefined
    void hydrate()
    return () => {
      active = false
      cancelRetry()
      validation?.abort()
      network?.remove()
      foreground?.remove()
      unsubscribe()
      stopSnapshot.current?.()
      stopSnapshot.current = null
      if (native) pauseAccountRequests(false)
    }
  }, [clearSession, dropSession, queueStorage, saveLease, setCloudAvailable, setError, showSession])

  useEffect(() => {
    if (!session) return
    let timer: ReturnType<typeof setTimeout>
    const checkExpiration = () => {
      const remaining = Date.parse(session.expiresAt) - Date.now()
      if (remaining <= 0) {
        setError("Your session expired. Please sign in again.")
        void clearSession().catch((cause) => {
          captureException(cause)
          setError("Could not remove expired saved credentials. Sign in again.")
        })
      } else {
        clearTimeout(timer)
        timer = setTimeout(checkExpiration, Math.min(remaining, 2_147_483_647))
      }
    }
    checkExpiration()
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") checkExpiration()
    })
    return () => {
      clearTimeout(timer)
      subscription.remove()
    }
  }, [session, clearSession, setError])

  const authenticate = useCallback(
    async (sendRequest: () => Promise<AuthenticationSessionResponse>) => {
      if (busy.current) throw new Error("An authentication request is already running.")
      busy.current = true
      setPending(true)
      setError(null)
      const currentRevision = ++revision.current
      try {
        const result = await authenticateAsync(sendRequest)
        const identity = validatedIdentity(result)
        if (!identity) {
          throw new ApiError("The server returned an invalid session.", 0, "INVALID_SESSION")
        }
        if (currentRevision !== revision.current) return
        if (credential.current) {
          await clearSession().catch(() => {
            captureException(new Error("Could not remove the previous account's saved data."))
          })
        } else {
          dropSession()
        }
        const installRevision = currentRevision + 1
        if (revision.current !== installRevision) return
        const { token } = result.session
        await queueStorage(() => sessionStorage.setToken(token))
        if (revision.current !== installRevision) return
        await saveLease(token, identity)
        if (revision.current !== installRevision) return
        credential.current = { token, identity }
        setApiToken(token)
        showSession(identity, result.user)
        identifyUser(result.user)
        setCloudAvailable(reachable.current !== false)
      } catch (cause) {
        if (!(cause instanceof ApiError && cause.status < 500)) captureException(cause)
        setError(userFacingAuthError(cause))
        throw cause
      } finally {
        busy.current = false
        setPending(false)
      }
    },
    [
      authenticateAsync,
      clearSession,
      dropSession,
      queueStorage,
      saveLease,
      setCloudAvailable,
      setError,
      setPending,
      showSession,
    ],
  )

  const signIn = useCallback(
    (email: string, password: string) => authenticate(() => sendSignIn({ email, password })),
    [authenticate],
  )
  const signUp = useCallback(
    (body: SignUpBody) => authenticate(() => sendSignUp(body)),
    [authenticate],
  )

  const requestPasswordReset = (email: string) => passwordResetMutation.mutateAsync(email)
  const verifyPasswordReset = (email: string, code: string) =>
    verifyResetMutation.mutateAsync({ email, code })
  const completePasswordReset = (resetToken: string, password: string) =>
    completeResetMutation.mutateAsync({ resetToken, password })

  const signOut = useCallback(() => {
    setError(null)
    const request = sendSignOut()
    const clearing = clearSession()
    const localRevision = revision.current
    void signOutAsync(request).catch((cause) => {
      if (revision.current !== localRevision) return
      if (!(cause instanceof ApiError && cause.status === 401)) {
        captureException(cause)
        setError(
          "Signed out on this device. The server session could not be revoked; check your connection.",
        )
      }
    })
    return clearing.catch((cause) => {
      captureException(cause)
      if (revision.current === localRevision)
        setError("Signed out on this device, but some saved account data could not be removed.")
    })
  }, [clearSession, signOutAsync, setError])
  const deleteAccount = useCallback(async () => {
    if (busy.current) return
    busy.current = true
    setError(null)
    setPending(true)
    try {
      await deleteAccountAsync()
      posthog?.capture("account_deleted")
      await clearSession()
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        await clearSession()
        return
      }
      captureException(cause)
      setError(userFacingAccountDeleteError(cause))
      throw cause
    } finally {
      busy.current = false
      setPending(false)
    }
  }, [clearSession, deleteAccountAsync, setError, setPending])

  const updateUser = useCallback(
    async (body: UpdateUserBody) => {
      const currentRevision = revision.current
      try {
        const result = await updateUserAsync(body)
        if (
          currentRevision === revision.current &&
          result.id === credential.current?.identity?.user.id
        ) {
          setSession((previous) => (previous ? { ...previous, user: result } : null))
          await queryClient.invalidateQueries({ queryKey: ["meals", result.id, "summary"] })
        }
      } catch (cause) {
        captureException(cause)
        setError(apiErrorMessage(cause, "your profile", "save"))
        throw cause
      }
    },
    [queryClient, updateUserAsync, setError],
  )

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        offline: offline && Boolean(session),
        loading,
        pending,
        error,
        signIn,
        signUp,
        requestPasswordReset,
        verifyPasswordReset,
        completePasswordReset,
        signOut,
        deleteAccount,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider.")
  return context
}
