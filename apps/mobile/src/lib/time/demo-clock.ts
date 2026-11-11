import { create } from "zustand"

type DemoClockState = {
  /** Days added to the real date for planner demos; 0 means today. */
  offsetDays: number
  setOffsetDays: (offsetDays: number) => void
}

/** Session-scoped developer override so the planner can be shown on any day. */
export const useDemoClock = create<DemoClockState>((set) => ({
  offsetDays: 0,
  setOffsetDays: (offsetDays) => set({ offsetDays }),
}))

const shifted = (offsetDays: number) => {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date
}

/** The planner's "now": the real time, moved by the developer demo offset. */
export const planNow = () => shifted(useDemoClock.getState().offsetDays)

/** Same as `planNow`, and re-renders when the demo offset changes. */
export function usePlanNow() {
  return shifted(useDemoClock((state) => state.offsetDays))
}
