import type { AuthUser, AuthenticationSessionResponse } from "../models/authentication";

export const mockAuthenticationUser: AuthUser = {
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
};

export function mockAuthenticationSession(
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
  };
}
