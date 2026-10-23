import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/** Demo baseline matching the Figma "Home" frame (node 4:3836). */
export const BASELINE_WEIGHT_KG = 72.0;

type HealthContextValue = {
  weightKg: number;
  weightUpdated: boolean;
  saveWeight: (kg: number) => void;
};

const HealthContext = createContext<HealthContextValue | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [weightKg, setWeightKg] = useState(BASELINE_WEIGHT_KG);
  const [weightUpdated, setWeightUpdated] = useState(false);

  const saveWeight = useCallback((next: number) => {
    setWeightKg(next);
    setWeightUpdated(true);
  }, []);

  const value = useMemo(
    () => ({ weightKg, weightUpdated, saveWeight }),
    [weightKg, weightUpdated, saveWeight],
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const value = useContext(HealthContext);
  if (!value) throw new Error('useHealth must be used inside HealthProvider');
  return value;
}
