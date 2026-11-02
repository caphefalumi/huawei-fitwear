import type { AuthenticationSession } from "./auth-store";

export function isLoggedIn(
  session: AuthenticationSession | null | undefined,
  now = Date.now(),
): session is AuthenticationSession {
  const expiration = Date.parse(session?.expiresAt ?? "");
  return Boolean(session?.token) && Number.isFinite(expiration) && expiration > now;
}
