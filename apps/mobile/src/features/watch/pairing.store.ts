import * as Crypto from "expo-crypto"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"
import { create } from "zustand"

import { captureException } from "@/lib/analytics/posthog"

const ENABLED_KEY = "watch.enabled"
const PHONE_ID_KEY = "watch.phone-id"

type PairingState = {
  /** The user asked to use a watch, now or after an earlier successful connection. */
  enabled: boolean
  load: () => Promise<void>
  setEnabled: (enabled: boolean) => void
  /** Called once connected, so that later launches connect on their own. */
  remember: () => void
}

export const usePairing = create<PairingState>((set) => ({
  enabled: false,
  load: async () => {
    if (Platform.OS === "web") return
    try {
      set({ enabled: (await SecureStore.getItemAsync(ENABLED_KEY)) === "1" })
    } catch {
      captureException(new Error("Could not read the watch setting."))
    }
  },
  setEnabled: (enabled) => {
    set({ enabled })
    if (enabled || Platform.OS === "web") return
    void SecureStore.deleteItemAsync(ENABLED_KEY).catch(() =>
      captureException(new Error("Could not forget the watch.")),
    )
  },
  remember: () => {
    if (Platform.OS === "web") return
    void SecureStore.setItemAsync(ENABLED_KEY, "1").catch(() =>
      captureException(new Error("Could not remember the watch.")),
    )
  },
}))

/** Stable per-install ID the watch uses to remember which phone it allowed. */
export async function phoneId(): Promise<string> {
  const stored = await SecureStore.getItemAsync(PHONE_ID_KEY)
  if (stored) return stored
  const created = Crypto.randomUUID()
  await SecureStore.setItemAsync(PHONE_ID_KEY, created)
  return created
}
