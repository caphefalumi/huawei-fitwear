import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { AppState } from "react-native";

import { ApiError, onSessionExpired, setApiToken } from "@/lib/api";
import { sessionStorage } from "../session-storage";
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
} from "../api/auth.api";
import type {
  AuthUser,
  AuthenticationSession,
  AuthenticationSessionResponse,
  SignUpBody,
  UpdateUserBody,
} from "../types";
export type {
  AuthUser,
  AuthenticationSession,
  AuthenticationSessionResponse,
  SignUpBody,
  UpdateUserBody,
};
import { isLoggedIn } from "../utils/is-logged-in";

export const APP_ROUTES = {
  login: "/",
  signUp: "/sign-up",
  home: "/home",
} as const;

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  pending: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (body: SignUpBody) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string>;
  verifyPasswordReset: (email: string, code: string) => Promise<string>;
  completePasswordReset: (resetToken: string, password: string) => Promise<string>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateUser: (body: UpdateUserBody) => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthenticationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const revision = useRef(0);
  const busy = useRef(false);

  const clearSession = useCallback(async () => {
    revision.current += 1;
    setApiToken(null);
    setUser(null);
    setSession(null);
    await sessionStorage.clearToken();
  }, []);

  useEffect(() => {
    let active = true;
    const hydrateRevision = revision.current;
    async function hydrate() {
      try {
        const token = await sessionStorage.getToken();
        if (!active || revision.current !== hydrateRevision || !token) return;
        setApiToken(token);
        const result = await getSession();
        if (!active || revision.current !== hydrateRevision) return;
        if (!isLoggedIn(result.session)) {
          await clearSession();
          setError("Your session expired. Please sign in again.");
          return;
        }
        setSession(result.session);
        setUser(result.user);
      } catch (cause) {
        if (active) {
          setApiToken(null);
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to restore your session. Please sign in again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    const unsubscribe = onSessionExpired(() => {
      if (!active) return;
      setError("Your session expired. Please sign in again.");
      void clearSession().catch(() =>
        setError(
          "Session expired, but saved credentials could not be removed. Please sign in again.",
        ),
      );
    });
    void hydrate();
    return () => {
      active = false;
      unsubscribe();
    };
  }, [clearSession]);

  useEffect(() => {
    if (!session) return;
    let timer: ReturnType<typeof setTimeout>;
    const checkExpiration = () => {
      const remaining = Date.parse(session.expiresAt) - Date.now();
      if (remaining <= 0) {
        setError("Your session expired. Please sign in again.");
        void clearSession().catch(() =>
          setError("Could not remove expired saved credentials. Please sign in again."),
        );
      } else {
        clearTimeout(timer);
        timer = setTimeout(checkExpiration, Math.min(remaining, 2_147_483_647));
      }
    };
    checkExpiration();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") checkExpiration();
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, [session, clearSession]);

  const authenticate = useCallback(
    async (sendRequest: () => Promise<AuthenticationSessionResponse>) => {
      if (busy.current) throw new Error("An authentication request is already running.");
      busy.current = true;
      setPending(true);
      setError(null);
      const currentRevision = ++revision.current;
      try {
        const result = await sendRequest();
        if (!isLoggedIn(result.session)) {
          throw new ApiError("The server returned an invalid session.", 0, "INVALID_SESSION");
        }
        await sessionStorage.setToken(result.session.token);
        if (currentRevision !== revision.current) return;
        setApiToken(result.session.token);
        setSession(result.session);
        setUser(result.user);
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Authentication failed. Please try again.",
        );
        throw cause;
      } finally {
        busy.current = false;
        setPending(false);
      }
    },
    [],
  );

  const signIn = useCallback(
    (email: string, password: string) => authenticate(() => sendSignIn({ email, password })),
    [authenticate],
  );
  const signUp = useCallback(
    (body: SignUpBody) => authenticate(() => sendSignUp(body)),
    [authenticate],
  );

  const requestPasswordReset = useCallback((email: string) => sendPasswordReset(email), []);
  const verifyPasswordReset = useCallback(
    (email: string, code: string) => sendVerifyPasswordReset(email, code),
    [],
  );
  const completePasswordReset = useCallback(
    (resetToken: string, password: string) => sendCompletePasswordReset(resetToken, password),
    [],
  );

  const signOut = useCallback(() => {
    setError(null);
    revision.current += 1;
    const localRevision = revision.current;
    void sendSignOut().catch((cause) => {
      if (revision.current !== localRevision) return;
      if (!(cause instanceof ApiError && cause.status === 401)) {
        setError(
          "Signed out on this device. The server session could not be revoked; check your connection.",
        );
      }
    });
    return clearSession().catch(() => {
      if (revision.current === localRevision)
        setError("Signed out on this device, but saved credentials could not be removed.");
    });
  }, [clearSession]);
  const deleteAccount = useCallback(async () => {
    setError(null);
    setPending(true);
    try {
      await sendDeleteAccount();
    } catch (cause) {
      if (!(cause instanceof ApiError && cause.status === 401)) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to delete your account. Please try again.",
        );
        throw cause;
      }
    } finally {
      await clearSession();
      setPending(false);
    }
  }, [clearSession]);

  const updateUser = useCallback(async (body: UpdateUserBody) => {
    const currentRevision = revision.current;
    try {
      const result = await sendUpdateUser(body);
      if (currentRevision === revision.current) setUser(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update your profile.");
      throw cause;
    }
  }, []);

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
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
