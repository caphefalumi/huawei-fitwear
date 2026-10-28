import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/** Demo baseline matching the Figma "Home" frame (node 4:3836). */
export const BASELINE_WEIGHT_KG = 72.0;
export const BASELINE_HEIGHT_CM = 175;

export type PlanPreferences = {
  goal: string;
  activity: string;
  sessions: number;
  targetWeightKg: number;
};

export const BASELINE_PLAN: PlanPreferences = {
  goal: 'Lose fat',
  activity: 'Moderate',
  sessions: 3,
  targetWeightKg: 70,
};

export type RecoveryPlan = {
  area: string;
  note: string;
  restDays: number;
  lightDays: number;
  start: string;
  returnDate: string;
};

/** Matches Figma "Recovery" frame (node 4:4237). */
export const BASELINE_RECOVERY: RecoveryPlan = {
  area: 'Right shoulder',
  note: 'Sore when pressing',
  restDays: 2,
  lightDays: 3,
  start: 'Oct 8, 2026',
  returnDate: 'Oct 13',
};

type HealthContextValue = {
  weightKg: number;
  weightUpdated: boolean;
  saveWeight: (kg: number) => void;
  heightCm: number;
  saveHeight: (cm: number) => void;
  plan: PlanPreferences;
  savePlan: (next: PlanPreferences) => void;
  recovery: RecoveryPlan;
  saveRecovery: (next: RecoveryPlan) => void;
};

const HealthContext = createContext<HealthContextValue | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [weightKg, setWeightKg] = useState(BASELINE_WEIGHT_KG);
  const [weightUpdated, setWeightUpdated] = useState(false);
  const [heightCm, setHeightCm] = useState(BASELINE_HEIGHT_CM);
  const [plan, setPlan] = useState<PlanPreferences>(BASELINE_PLAN);
  const [recovery, setRecovery] = useState<RecoveryPlan>(BASELINE_RECOVERY);

  const saveWeight = useCallback((next: number) => {
    setWeightKg(next);
    setWeightUpdated(true);
  }, []);

  const saveHeight = useCallback((next: number) => {
    setHeightCm(next);
  }, []);

  const value = useMemo(
    () => ({
      weightKg,
      weightUpdated,
      saveWeight,
      heightCm,
      saveHeight,
      plan,
      savePlan: setPlan,
      recovery,
      saveRecovery: setRecovery,
    }),
    [weightKg, weightUpdated, saveWeight, heightCm, saveHeight, plan, recovery],
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const value = useContext(HealthContext);
  if (!value) throw new Error('useHealth must be used inside HealthProvider');
  return value;
}
