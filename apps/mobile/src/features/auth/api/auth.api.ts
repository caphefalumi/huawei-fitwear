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
  passwordResetVerify: "/auth/password-reset/verify",
  passwordResetConfirm: "/auth/reset-password",
  signOut: "/auth/sign-out",
  deleteAccount: "/auth/account",
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

export async function sendPasswordReset(
  email: string,
): Promise<{ message: string; resendAfterSeconds: number }> {
  return apiRequest<{ message: string; resendAfterSeconds: number }>(AUTH_ENDPOINTS.passwordReset, {
    method: "POST",
    body: { email: email.trim() },
  });
}

export async function sendVerifyPasswordReset(email: string, code: string): Promise<string> {
  const result = await apiRequest<{ resetToken: string }>(AUTH_ENDPOINTS.passwordResetVerify, {
    method: "POST",
    body: { email: email.trim(), code },
  });
  return result.resetToken;
}

export async function sendCompletePasswordReset(
  resetToken: string,
  password: string,
): Promise<string> {
  const result = await apiRequest<{ message: string }>(AUTH_ENDPOINTS.passwordResetConfirm, {
    method: "POST",
    body: { resetToken, password },
  });
  return result.message;
}

export function sendSignOut(): Promise<unknown> {
  return apiRequest(AUTH_ENDPOINTS.signOut, { method: "POST" });
}

export function sendDeleteAccount(): Promise<unknown> {
  return apiRequest(AUTH_ENDPOINTS.deleteAccount, { method: "DELETE" });
}

export function sendUpdateUser(body: UpdateUserBody): Promise<AuthUser> {
  return apiRequest(AUTH_ENDPOINTS.updateUser, { method: "PUT", body });
}
