import { create } from "zustand";

type AuthUiState = {
  authenticated: boolean;
  pending: boolean;
  error: string | null;
  setAuthenticated: (authenticated: boolean) => void;
  setPending: (pending: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useAuthUiStore = create<AuthUiState>((set) => ({
  authenticated: false,
  pending: false,
  error: null,
  setAuthenticated: (authenticated) => set({ authenticated }),
  setPending: (pending) => set({ pending }),
  setError: (error) => set({ error }),
  reset: () => set({ authenticated: false, pending: false, error: null }),
}));
