import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"

import type { AuthenticationSessionResponse, AuthUser } from "../types"
import { isLoggedIn } from "./is-logged-in"

const LEASE_KEY = "fitwear.offline-session.v1"

type OfflineUser = Pick<
  AuthUser,
  | "id"
  | "gender"
  | "heightCm"
  | "currentWeightKg"
  | "targetWeightKg"
  | "activityLevel"
  | "fitnessGoal"
  | "weeklySessions"
>

export type SessionUser = OfflineUser &
  Partial<Pick<AuthUser, "email" | "name" | "birthDate" | "updatedAt">>

export type OfflineIdentity = {
  user: OfflineUser
  sessionId: string
  expiresAt: string
}

type Lease = OfflineIdentity & { token: string }

export function validatedIdentity(
  response: AuthenticationSessionResponse | null | undefined,
  token?: string,
): OfflineIdentity | null {
  const session = response?.session
  const user = response?.user
  if (
    !isLoggedIn(session) ||
    typeof session.token !== "string" ||
    (token !== undefined && token !== session.token) ||
    typeof session.id !== "string" ||
    !session.id ||
    typeof user?.id !== "string" ||
    !user.id ||
    session.userId !== user.id
  ) {
    return null
  }

  return {
    sessionId: session.id,
    expiresAt: session.expiresAt,
    user: {
      id: user.id,
      gender: user.gender,
      heightCm: user.heightCm,
      currentWeightKg: user.currentWeightKg,
      targetWeightKg: user.targetWeightKg,
      activityLevel: user.activityLevel,
      fitnessGoal: user.fitnessGoal,
      weeklySessions: user.weeklySessions,
    },
  }
}

export async function readOfflineIdentity(token: string): Promise<OfflineIdentity | null> {
  if (Platform.OS === "web") return null
  const stored = await SecureStore.getItemAsync(LEASE_KEY)
  if (!stored) return null
  const lease = JSON.parse(stored) as Partial<Lease> | null
  if (
    lease?.token !== token ||
    typeof lease.user?.id !== "string" ||
    !lease.user.id ||
    typeof lease.sessionId !== "string" ||
    !lease.sessionId ||
    typeof lease.expiresAt !== "string" ||
    !(Date.parse(lease.expiresAt) > Date.now())
  ) {
    return null
  }
  return { user: lease.user, sessionId: lease.sessionId, expiresAt: lease.expiresAt }
}

export async function writeOfflineIdentity(token: string, identity: OfflineIdentity) {
  if (Platform.OS === "web") return
  // Bind to the legacy token without changing its key or putting a credential in the cache file.
  await SecureStore.setItemAsync(
    LEASE_KEY,
    JSON.stringify({ ...identity, token } satisfies Lease),
    {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    },
  )
}

export async function clearOfflineIdentity() {
  if (Platform.OS !== "web") await SecureStore.deleteItemAsync(LEASE_KEY)
}
