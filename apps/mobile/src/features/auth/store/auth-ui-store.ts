import { create } from "zustand"

type AuthUiState = {
  pending: boolean
  error: string | null
  setPending: (pending: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useAuthUiStore = create<AuthUiState>((set) => ({
  pending: false,
  error: null,
  setPending: (pending) => set({ pending }),
  setError: (error) => set({ error }),
  reset: () => set({ pending: false, error: null }),
}))
