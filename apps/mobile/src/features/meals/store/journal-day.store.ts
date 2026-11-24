import { create } from "zustand"

type JournalDayState = {
  /** The day the Meals tab shows; null follows the current date. */
  selectedDate: string | null
  selectDate: (dateKey: string | null) => void
}

export const useJournalDay = create<JournalDayState>((set) => ({
  selectedDate: null,
  selectDate: (selectedDate) => set({ selectedDate }),
}))
