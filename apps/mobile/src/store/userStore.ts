import { create } from 'zustand';
import { UserDoc } from '../types/types';
import { initialUser } from '../mocks/mockData';
import { profileService } from '../services/profileService';

interface UserState {
  user: UserDoc;
  loading: boolean;
  loadUser: () => Promise<void>;
  updateUser: (updates: Partial<UserDoc>) => Promise<void>;
  completeOnboarding: (data: Partial<UserDoc>) => Promise<void>;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: { ...initialUser },
  loading: false,

  loadUser: async () => {
    set({ loading: true });
    try {
      const user = await profileService.getUserProfile();
      set({ user, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updateUser: async (updates: Partial<UserDoc>) => {
    const updated = await profileService.updateProfile(updates);
    set({ user: updated });
  },

  completeOnboarding: async (data: Partial<UserDoc>) => {
    const updated = await profileService.updateProfile({
      ...data,
      onboardingCompleted: true
    });
    set({ user: updated });
  },

  resetUser: () => {
    profileService.reset();
    set({ user: { ...initialUser } });
  }
}));
