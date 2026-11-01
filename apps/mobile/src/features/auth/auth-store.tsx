import { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';

import { ApiError, apiRequest, onSessionExpired, setApiToken } from '@/lib/api';
import { sessionStorage } from './session-storage';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  image?: string | null;
  gender: 'male' | 'female' | 'other' | null;
  birthDate: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  targetWeightKg: number | null;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active' | null;
  fitnessGoal: 'weight_loss' | 'maintenance' | 'muscle_gain' | null;
  weeklySessions: number;
  createdAt: string;
  updatedAt: string;
};
export type UpdateUserBody = Partial<Pick<AuthUser, 'name' | 'gender' | 'birthDate' | 'heightCm' | 'currentWeightKg' | 'targetWeightKg' | 'activityLevel' | 'fitnessGoal' | 'weeklySessions'>>;
export type SignUpBody = { name: string; email: string; password: string; birthDate: string };
type AuthSession = { token: string; expiresAt: string; userId: string; id: string };
type SessionResponse = { user: AuthUser; session: AuthSession };
type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  pending: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (body: SignUpBody) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string>;
  signOut: () => Promise<void>;
  updateUser: (body: UpdateUserBody) => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
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
        const result = await apiRequest<SessionResponse>('/auth/session');
        if (!active || revision.current !== hydrateRevision) return;
        if (!Number.isFinite(Date.parse(result.session.expiresAt)) || Date.parse(result.session.expiresAt) <= Date.now()) {
          await clearSession();
          setError('Your session expired. Please sign in again.');
          return;
        }
        setSession(result.session);
        setUser(result.user);
      } catch (cause) {
        if (active) {
          setApiToken(null);
          setError(cause instanceof Error ? cause.message : 'Unable to restore your session. Please sign in again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    const unsubscribe = onSessionExpired(() => {
      if (!active) return;
      setError('Your session expired. Please sign in again.');
      void clearSession().catch(() => setError('Session expired, but saved credentials could not be removed. Please sign in again.'));
    });
    void hydrate();
    return () => { active = false; unsubscribe(); };
  }, [clearSession]);

  useEffect(() => {
    if (!session) return;
    let timer: ReturnType<typeof setTimeout>;
    const checkExpiration = () => {
      const remaining = Date.parse(session.expiresAt) - Date.now();
      if (remaining <= 0) {
        setError('Your session expired. Please sign in again.');
        void clearSession().catch(() => setError('Could not remove expired saved credentials. Please sign in again.'));
      } else {
        clearTimeout(timer);
        timer = setTimeout(checkExpiration, Math.min(remaining, 2_147_483_647));
      }
    };
    checkExpiration();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') checkExpiration();
    });
    return () => { clearTimeout(timer); subscription.remove(); };
  }, [session, clearSession]);

  const authenticate = useCallback(async (path: string, body: unknown) => {
    if (busy.current) throw new Error('An authentication request is already running.');
    busy.current = true;
    setPending(true);
    setError(null);
    const currentRevision = ++revision.current;
    try {
      const result = await apiRequest<SessionResponse>(path, { method: 'POST', body });
      if (!result.session?.token || !Number.isFinite(Date.parse(result.session.expiresAt)) || Date.parse(result.session.expiresAt) <= Date.now()) {
        throw new ApiError('The server returned an invalid session.', 0, 'INVALID_SESSION');
      }
      await sessionStorage.setToken(result.session.token);
      if (currentRevision !== revision.current) return;
      setApiToken(result.session.token);
      setSession(result.session);
      setUser(result.user);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Authentication failed. Please try again.');
      throw cause;
    } finally {
      busy.current = false;
      setPending(false);
    }
  }, []);

  const signIn = useCallback((email: string, password: string) => authenticate('/auth/sign-in', { email: email.trim(), password }), [authenticate]);
  const signUp = useCallback((body: SignUpBody) => authenticate('/auth/sign-up', { ...body, name: body.name.trim(), email: body.email.trim() }), [authenticate]);

  const requestPasswordReset = useCallback(async (email: string) => {
    const result = await apiRequest<{ message: string }>('/auth/password-reset', {
      method: 'POST',
      body: { email: email.trim() },
    });
    return result.message;
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await apiRequest('/auth/sign-out', { method: 'POST' });
    } catch (cause) {
      if (!(cause instanceof ApiError && cause.status === 401)) {
        setError('Signed out on this device. The server session could not be revoked; check your connection.');
        throw cause;
      }
    } finally {
      await clearSession();
    }
  }, [clearSession]);

  const updateUser = useCallback(async (body: UpdateUserBody) => {
    const currentRevision = revision.current;
    try {
      const result = await apiRequest<AuthUser>('/auth/update-user', { method: 'PUT', body });
      if (currentRevision === revision.current) setUser(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update your profile.');
      throw cause;
    }
  }, []);

  return <AuthContext.Provider value={{ user, loading, pending, error, signIn, signUp, requestPasswordReset, signOut, updateUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
