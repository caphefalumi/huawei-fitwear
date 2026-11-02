import { apiRequest } from "@/lib/api";
import type {
  AuthUser,
  AuthenticationSessionResponse,
  SignInBody,
  SignUpBody,
  UpdateUserBody,
} from "../types";

export const AUTH_ENDPOINTS = {
  session: "/auth/session",
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  passwordReset: "/auth/password-reset",
  signOut: "/auth/sign-out",
  updateUser: "/auth/update-user",
} as const;

export function getSession(): Promise<AuthenticationSessionResponse> {
  return apiRequest(AUTH_ENDPOINTS.session);
}

export function sendSignIn(body: SignInBody): Promise<AuthenticationSessionResponse> {
  return apiRequest(AUTH_ENDPOINTS.signIn, {
    method: "POST",
    body: { ...body, email: body.email.trim() },
  });
}

export function sendSignUp(body: SignUpBody): Promise<AuthenticationSessionResponse> {
  return apiRequest(AUTH_ENDPOINTS.signUp, {
    method: "POST",
    body: { ...body, name: body.name.trim(), email: body.email.trim() },
  });
}

export async function sendPasswordReset(email: string): Promise<string> {
  const result = await apiRequest<{ message: string }>(AUTH_ENDPOINTS.passwordReset, {
    method: "POST",
    body: { email: email.trim() },
  });
  return result.message;
}

export function sendSignOut(): Promise<unknown> {
  return apiRequest(AUTH_ENDPOINTS.signOut, { method: "POST" });
}

export function sendUpdateUser(body: UpdateUserBody): Promise<AuthUser> {
  return apiRequest(AUTH_ENDPOINTS.updateUser, { method: "PUT", body });
}
