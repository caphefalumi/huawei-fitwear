import { apiRequest } from "@/lib/api";
import { AUTH_ENDPOINTS } from "../constants/endpoints";
import type { AuthenticationSessionResponse } from "../models/authentication";

export function getSession(): Promise<AuthenticationSessionResponse> {
  return apiRequest(AUTH_ENDPOINTS.session);
}
