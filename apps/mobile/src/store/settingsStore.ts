import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light' | 'system';
export type DevPreviewState = 'normal' | 'loading' | 'empty' | 'error' | 'offline';

interface SettingsState {
  themeMode: ThemeMode;
  previewState: DevPreviewState;
  simulateWatchActive: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setPreviewState: (state: DevPreviewState) => void;
  setSimulateWatchActive: (active: boolean) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: 'light',
  previewState: 'normal',
  simulateWatchActive: false,
  setThemeMode: (themeMode) => set({ themeMode }),
  setPreviewState: (previewState) => set({ previewState }),
  setSimulateWatchActive: (simulateWatchActive) => set({ simulateWatchActive }),
  resetSettings: () =>
    set({
      themeMode: 'light',
      previewState: 'normal',
      simulateWatchActive: false
    })
}));
