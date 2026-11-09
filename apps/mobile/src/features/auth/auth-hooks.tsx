import * as Sentry from "@sentry/react-native"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react"
import { AppState } from "react-native"

import {
  ApiError,
  apiErrorMessage,
  onSessionExpired,
  setApiToken,
  userFacingAccountDeleteError,
  userFacingAuthError,
  userFacingSessionError,
} from "@/lib/api"
import { sessionStorage } from "@/lib/storage"

import {
  authQueryKeys,
  authSessionQueryOptions,
  sendSignIn,
  sendDeleteAccount,
  sendPasswordReset,
  sendVerifyPasswordReset,
  sendCompletePasswordReset,
  sendSignOut,
  sendSignUp,
  sendUpdateUser,
} from "./auth-api"
import type {
  AuthUser,
  AuthenticationSession,
  AuthenticationSessionResponse,
  SignUpBody,
  UpdateUserBody,
} from "./types"
export type {
  AuthUser,
  AuthenticationSession,
  AuthenticationSessionResponse,
  SignUpBody,
  UpdateUserBody,
}
import { useAuthUiStore } from "./auth-ui-store"
import { isLoggedIn } from "./is-logged-in"

export const APP_ROUTES = {
  welcome: "/",
  login: "/login",
  signUp: "/sign-up",
  home: "/home",
} as const

type AuthContextValue = {
  user: AuthUser | null
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

export function AuthProvider({ children }: PropsWithChildren) {
  const sessionQuery = useQuery({ ...authSessionQueryOptions(), enabled: false })
  const authenticated = useAuthUiStore((state) => state.authenticated)
  const setAuthenticated = useAuthUiStore((state) => state.setAuthenticated)
  const user = authenticated ? (sessionQuery.data?.user ?? null) : null
  const session = authenticated ? (sessionQuery.data?.session ?? null) : null
  const [loading, setLoading] = useState(true)
  const pending = useAuthUiStore((state) => state.pending)
  const setPending = useAuthUiStore((state) => state.setPending)
  const error = useAuthUiStore((state) => state.error)
  const setError = useAuthUiStore((state) => state.setError)
  const revision = useRef(0)
  const busy = useRef(false)
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
    mutationFn: (request: Promise<unknown>) => request,
  })
  const deleteAccountMutation = useMutation({
    mutationKey: ["auth", "delete-account"],
    mutationFn: sendDeleteAccount,
  })
  const updateUserMutation = useMutation({
    mutationKey: ["auth", "update-user"],
    mutationFn: sendUpdateUser,
  })
  const { mutateAsync: authenticateAsync } = authenticateMutation
  const { mutateAsync: signOutAsync } = signOutMutation
  const { mutateAsync: deleteAccountAsync } = deleteAccountMutation
  const { mutateAsync: updateUserAsync } = updateUserMutation

  const clearSession = useCallback(async () => {
    revision.current += 1
    setApiToken(null)
    setAuthenticated(false)
    queryClient.clear()
    await sessionStorage.clearToken()
  }, [queryClient, setAuthenticated])
  useEffect(() => {
    useAuthUiStore.getState().reset()
  }, [])

  useEffect(() => {
    let active = true
    const hydrateRevision = revision.current
    async function hydrate() {
      try {
        const token = await sessionStorage.getToken()
        if (!active || revision.current !== hydrateRevision || !token) return
        setApiToken(token)
        const result = await queryClient.fetchQuery({
          ...authSessionQueryOptions(),
          // Startup must settle offline without trusting an unvalidated token.
          networkMode: "always",
          retry: false,
          staleTime: 0,
        })
        if (!active || revision.current !== hydrateRevision) return
        if (!isLoggedIn(result.session)) {
          await clearSession()
          setError("Your session expired. Sign in again.")
          return
        }
        setAuthenticated(true)
      } catch (cause) {
        Sentry.captureException(cause)
        if (active) {
          setApiToken(null)
          setAuthenticated(false)
          setError(userFacingSessionError(cause))
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    const unsubscribe = onSessionExpired(() => {
      if (!active) return
      setError("Your session expired. Please sign in again.")
      void clearSession().catch((cause) => {
        Sentry.captureException(cause)
        setError("Session expired, but saved credentials could not be removed. Sign in again.")
      })
    })
    void hydrate()
    return () => {
      active = false
      unsubscribe()
    }
  }, [clearSession, queryClient, setAuthenticated, setError])

  useEffect(() => {
    if (!session) return
    let timer: ReturnType<typeof setTimeout>
    const checkExpiration = () => {
      const remaining = Date.parse(session.expiresAt) - Date.now()
      if (remaining <= 0) {
        setError("Your session expired. Please sign in again.")
        void clearSession().catch((cause) => {
          Sentry.captureException(cause)
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
        if (!isLoggedIn(result.session)) {
          throw new ApiError("The server returned an invalid session.", 0, "INVALID_SESSION")
        }
        await sessionStorage.setToken(result.session.token)
        if (currentRevision !== revision.current) return
        queryClient.removeQueries()
        setApiToken(result.session.token)
        queryClient.setQueryData(authQueryKeys.session, result)
        setAuthenticated(true)
      } catch (cause) {
        if (!(cause instanceof ApiError && cause.status < 500)) Sentry.captureException(cause)
        setError(userFacingAuthError(cause))
        throw cause
      } finally {
        busy.current = false
        setPending(false)
      }
    },
    [authenticateAsync, queryClient, setAuthenticated, setError, setPending],
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
    revision.current += 1
    const localRevision = revision.current
    void signOutAsync(sendSignOut()).catch((cause) => {
      if (revision.current !== localRevision) return
      if (!(cause instanceof ApiError && cause.status === 401)) {
        Sentry.captureException(cause)
        setError(
          "Signed out on this device. The server session could not be revoked; check your connection.",
        )
      }
    })
    return clearSession().catch((cause) => {
      Sentry.captureException(cause)
      if (revision.current === localRevision)
        setError("Signed out on this device, but saved credentials could not be removed.")
    })
  }, [clearSession, signOutAsync, setError])
  const deleteAccount = useCallback(async () => {
    if (busy.current) return
    busy.current = true
    setError(null)
    setPending(true)
    try {
      await deleteAccountAsync()
      await clearSession()
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        await clearSession()
        return
      }
      Sentry.captureException(cause)
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
        if (currentRevision === revision.current) {
          queryClient.setQueryData<AuthenticationSessionResponse>(
            authQueryKeys.session,
            (previous) => (previous ? { ...previous, user: result } : previous),
          )
        }
        await queryClient.invalidateQueries({ queryKey: ["meals", result.id, "summary"] })
      } catch (cause) {
        Sentry.captureException(cause)
        setError(apiErrorMessage(cause, "your profile", "save"))
        throw cause
      }
    },
    [queryClient, updateUserAsync, setError],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
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
