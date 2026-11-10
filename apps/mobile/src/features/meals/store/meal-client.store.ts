import { create } from "zustand"

import type { MealImage, MealItem, MealType } from "../hooks/meals-hooks"

type MealClientState = {
  accountId: string | null
  items: MealItem[]
  mealType: MealType
  draftImage: string | null
  draftImageData: MealImage | null
  tutorialSeen: boolean
  summaryDate: string
  setAccountId: (accountId: string | null, date: string) => void
  setItems: (update: MealItem[] | ((items: MealItem[]) => MealItem[])) => void
  setMealType: (mealType: MealType) => void
  setDraftPhoto: (imageUri: string, image: MealImage) => void
  setAnalysis: (items: MealItem[], imageUri: string, image: MealImage) => void
  clearDraft: () => void
  setSummaryDate: (date: string) => void
  dismissTutorial: () => void
}

export const useMealClientStore = create<MealClientState>((set) => ({
  accountId: null,
  items: [],
  mealType: "lunch",
  draftImage: null,
  draftImageData: null,
  tutorialSeen: false,
  summaryDate: "",
  setAccountId: (accountId, date) =>
    set((state) =>
      state.accountId === accountId
        ? state
        : {
            accountId,
            items: [],
            mealType: "lunch",
            draftImage: null,
            draftImageData: null,
            summaryDate: date,
          },
    ),
  setItems: (update) =>
    set((state) => ({
      items: typeof update === "function" ? update(state.items) : update,
    })),
  setMealType: (mealType) => set({ mealType }),
  setDraftPhoto: (draftImage, draftImageData) => set({ draftImage, draftImageData }),
  setAnalysis: (items, draftImage, draftImageData) => set({ items, draftImage, draftImageData }),
  clearDraft: () => set({ items: [], draftImage: null, draftImageData: null }),
  setSummaryDate: (summaryDate) => set({ summaryDate }),
  dismissTutorial: () => set({ tutorialSeen: true }),
}))
