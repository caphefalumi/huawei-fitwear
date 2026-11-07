import { create } from "zustand"

export type DeveloperFeature = "testError" | "bleTest"

type DeveloperModeState = {
  enabled: boolean
  features: Record<DeveloperFeature, boolean>
  toggle: () => void
  toggleFeature: (feature: DeveloperFeature) => void
}

/** Session-scoped developer mode: resets when the app process restarts. */
export const useDeveloperMode = create<DeveloperModeState>((set) => ({
  enabled: false,
  features: { testError: false, bleTest: false },
  toggle: () => set((state) => ({ enabled: !state.enabled })),
  toggleFeature: (feature) =>
    set((state) => ({ features: { ...state.features, [feature]: !state.features[feature] } })),
}))
