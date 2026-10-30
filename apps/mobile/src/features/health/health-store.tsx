import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/** Demo baseline matching the Figma "Home" frame (node 4:3836). */
export const BASELINE_WEIGHT_KG = 72.0;
export const BASELINE_HEIGHT_CM = 175;

export type Sex = 'Male' | 'Female' | 'Rather not say';

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

export const PERIOD_AREA = 'In period';
export const INJURY_AREAS = ['Right shoulder', 'Left shoulder', 'Lower back', 'Right knee'];

const DEMO_START_DAY = 8;
const AREA_NOTES: Record<string, string> = {
  'Right shoulder': 'Sore when pressing',
  'Left shoulder': 'Sore when pressing',
  'Lower back': 'Tight when bending',
  'Right knee': 'Sore when squatting',
  [PERIOD_AREA]: 'Lower intensity while on your period',
};

const dayRange = (from: number, count: number) =>
  count <= 1 ? `Oct ${from}` : `Oct ${from}–${from + count - 1}`;

/** Builds a demo recovery plan (starting Oct 8) for an injury area or the period option. */
export function createRecovery(area: string): RecoveryPlan {
  const isPeriod = area === PERIOD_AREA;
  const restDays = isPeriod ? 1 : 2;
  const lightDays = isPeriod ? 2 : 3;
  return {
    area,
    note: AREA_NOTES[area] ?? '',
    restDays,
    lightDays,
    start: `Oct ${DEMO_START_DAY}, 2026`,
    returnDate: `Oct ${DEMO_START_DAY + restDays + lightDays}`,
  };
}

export function recoveryRanges(recovery: RecoveryPlan) {
  return {
    rest: dayRange(DEMO_START_DAY, recovery.restDays),
    light: dayRange(DEMO_START_DAY + recovery.restDays, recovery.lightDays),
  };
}

export const recoveryTitle = (recovery: RecoveryPlan) =>
  recovery.area === PERIOD_AREA ? 'Period recovery' : `${recovery.area} recovery`;

type HealthContextValue = {
  weightKg: number;
  weightUpdated: boolean;
  saveWeight: (kg: number) => void;
  heightCm: number;
  saveHeight: (cm: number) => void;
  sex: Sex;
  saveSex: (next: Sex) => void;
  plan: PlanPreferences;
  savePlan: (next: PlanPreferences) => void;
  recovery: RecoveryPlan | null;
  saveRecovery: (next: RecoveryPlan | null) => void;
};

const HealthContext = createContext<HealthContextValue | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [weightKg, setWeightKg] = useState(BASELINE_WEIGHT_KG);
  const [weightUpdated, setWeightUpdated] = useState(false);
  const [heightCm, setHeightCm] = useState(BASELINE_HEIGHT_CM);
  const [sex, setSex] = useState<Sex>('Male');
  const [plan, setPlan] = useState<PlanPreferences>(BASELINE_PLAN);
  const [recovery, setRecovery] = useState<RecoveryPlan | null>(null);

  const saveWeight = useCallback((next: number) => {
    setWeightKg(next);
    setWeightUpdated(true);
  }, []);

  const saveHeight = useCallback((next: number) => {
    setHeightCm(next);
  }, []);

  const saveSex = useCallback((next: Sex) => {
    setSex(next);
    if (next !== 'Female') {
      setRecovery((prev) => (prev?.area === PERIOD_AREA ? null : prev));
    }
  }, []);

  const value = useMemo(
    () => ({
      weightKg,
      weightUpdated,
      saveWeight,
      heightCm,
      saveHeight,
      sex,
      saveSex,
      plan,
      savePlan: setPlan,
      recovery,
      saveRecovery: setRecovery,
    }),
    [weightKg, weightUpdated, saveWeight, heightCm, saveHeight, sex, saveSex, plan, recovery],
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const value = useContext(HealthContext);
  if (!value) throw new Error('useHealth must be used inside HealthProvider');
  return value;
}
