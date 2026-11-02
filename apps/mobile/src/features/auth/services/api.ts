import { apiRequest } from "@/lib/api";
import { AUTH_ENDPOINTS } from "../constants/endpoints";
import type {
  AuthUser,
  AuthenticationSessionResponse,
  SignInBody,
  SignUpBody,
  UpdateUserBody,
} from "../models/authentication";

export function signIn(body: SignInBody): Promise<AuthenticationSessionResponse> {
  return apiRequest(AUTH_ENDPOINTS.signIn, {
    method: "POST",
    body: { ...body, email: body.email.trim() },
  });
}

export function signUp(body: SignUpBody): Promise<AuthenticationSessionResponse> {
  return apiRequest(AUTH_ENDPOINTS.signUp, {
    method: "POST",
    body: { ...body, name: body.name.trim(), email: body.email.trim() },
  });
}

export async function requestPasswordReset(email: string): Promise<string> {
  const result = await apiRequest<{ message: string }>(AUTH_ENDPOINTS.passwordReset, {
    method: "POST",
    body: { email: email.trim() },
  });
  return result.message;
}

export function signOut(): Promise<unknown> {
  return apiRequest(AUTH_ENDPOINTS.signOut, { method: "POST" });
}

export function updateUser(body: UpdateUserBody): Promise<AuthUser> {
  return apiRequest(AUTH_ENDPOINTS.updateUser, { method: "PUT", body });
}
