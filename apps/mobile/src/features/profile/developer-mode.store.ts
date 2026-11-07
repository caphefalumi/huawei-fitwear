import { create } from "zustand"

type DeveloperModeState = {
  enabled: boolean
  toggle: () => void
}

/** Session-scoped developer mode: resets when the app process restarts. */
export const useDeveloperMode = create<DeveloperModeState>((set) => ({
  enabled: false,
  toggle: () => set((state) => ({ enabled: !state.enabled })),
}))
