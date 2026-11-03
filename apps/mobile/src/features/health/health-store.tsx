import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/features/auth/auth-store";
import { apiRequest } from "@/lib/api";

export type Sex = "Male" | "Female" | "Rather not say";
export type PlanPreferences = {
  goal: string;
  activity: string;
  sessions: number | null;
  targetWeightKg: number | null;
};
export type WeightLog = { id: string; loggedDate: string; weightKg: number };
export type RecoveryPlan = {
  area: string;
  note: string;
  restDays: number;
  lightDays: number;
  startDate: string;
  start: string;
  returnDate: string;
};
type RecoveryRow = Omit<RecoveryPlan, "start" | "returnDate" | "note"> & { note: string | null };

export const PERIOD_AREA = "In period";
const PERIOD_REST_DAYS = 3;
const PERIOD_LIGHT_DAYS = 4;
export const INJURY_AREAS = ["Right shoulder", "Left shoulder", "Lower back", "Right knee"];
export const GOALS = {
  weight_loss: "Lose fat",
  maintenance: "Maintain",
  muscle_gain: "Build muscle",
} as const;
export const ACTIVITIES = {
  sedentary: "Sedentary",
  lightly_active: "Light",
  moderately_active: "Moderate",
  very_active: "High",
  extra_active: "Very high",
} as const;

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dateLabel(value: string, days = 0) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  if (Number.isNaN(date.getTime())) return "Enter a valid date";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function recoveryFromRow(row: RecoveryRow): RecoveryPlan {
  return {
    ...row,
    note: row.note ?? "",
    start: dateLabel(row.startDate),
    returnDate: dateLabel(row.startDate, row.restDays + row.lightDays),
  };
}

export function createRecovery(area: string): RecoveryPlan {
  const period = area === PERIOD_AREA;
  return recoveryFromRow({
    area,
    note: "",
    restDays: period ? PERIOD_REST_DAYS : 0,
    lightDays: period ? PERIOD_LIGHT_DAYS : 0,
    startDate: dateKey(),
  });
}

export function recoveryRanges(recovery: RecoveryPlan) {
  const range = (offset: number, count: number) =>
    count === 0
      ? "None"
      : count === 1
        ? dateLabel(recovery.startDate, offset)
        : `${dateLabel(recovery.startDate, offset)} – ${dateLabel(recovery.startDate, offset + count - 1)}`;
  return { rest: range(0, recovery.restDays), light: range(recovery.restDays, recovery.lightDays) };
}

/** Fill (0–1) of the rest, rehab and return stages, measured in days since the plan started. */
export function recoveryProgress(recovery: RecoveryPlan, now = new Date()) {
  const [year, month, day] = recovery.startDate.split("-").map(Number);
  const dayNumber = (date: Date) =>
    Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  const elapsed = dayNumber(now) - dayNumber(new Date(year, month - 1, day));
  const stage = (start: number, length: number) =>
    length === 0 ? (elapsed >= start ? 1 : 0) : Math.max(0, Math.min(1, (elapsed - start) / length));
  const total = recovery.restDays + recovery.lightDays;
  return [
    stage(0, recovery.restDays),
    stage(recovery.restDays, recovery.lightDays),
    elapsed >= total ? 1 : 0,
  ];
}

export const recoveryTitle = (recovery: RecoveryPlan) =>
  recovery.area === PERIOD_AREA ? "Period recovery" : `${recovery.area} recovery`;

type HealthContextValue = {
  weightKg: number | null;
  weights: WeightLog[];
  weightUpdated: boolean;
  saveWeight: (kg: number) => Promise<void>;
  heightCm: number | null;
  saveHeight: (cm: number) => Promise<void>;
  sex: Sex | null;
  saveSex: (next: Sex) => Promise<void>;
  plan: PlanPreferences;
  savePlan: (next: PlanPreferences) => Promise<void>;
  recovery: RecoveryPlan | null;
  saveRecovery: (next: RecoveryPlan | null) => Promise<void>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};
const HealthContext = createContext<HealthContextValue | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [weightUpdated, setWeightUpdated] = useState(false);
  const [recovery, setRecovery] = useState<RecoveryPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);
  const request = useRef(0);
  const weightRevision = useRef(0);
  const recoveryRevision = useRef(0);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      request.current++;
    };
  }, []);

  const refresh = useCallback(async () => {
    const version = ++request.current;
    const loadedWeightRevision = weightRevision.current;
    const loadedRecoveryRevision = recoveryRevision.current;
    setLoading(true);
    setError(null);
    try {
      const [logs, active] = await Promise.all([
        apiRequest<{ weights: WeightLog[] }>("/health/weights"),
        apiRequest<{ recovery: RecoveryRow | null }>("/health/recovery"),
      ]);
      if (!alive.current || version !== request.current) return;
      setWeights((previous) =>
        loadedWeightRevision === weightRevision.current
          ? logs.weights
          : [
              ...logs.weights.filter(
                (row) => !previous.some((saved) => saved.loggedDate === row.loggedDate),
              ),
              ...previous,
            ].sort((a, b) => a.loggedDate.localeCompare(b.loggedDate)),
      );
      if (loadedRecoveryRevision === recoveryRevision.current)
        setRecovery(active.recovery ? recoveryFromRow(active.recovery) : null);
    } catch (cause) {
      if (alive.current && version === request.current)
        setError(cause instanceof Error ? cause.message : "Could not load health data. Try again.");
    } finally {
      if (alive.current && version === request.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveWeight = async (weightKg: number) => {
    const { weight } = await apiRequest<{ weight: WeightLog }>("/health/weight", {
      method: "PUT",
      body: { weightKg, date: dateKey() },
    });
    if (!alive.current) return;
    weightRevision.current++;
    setWeights((previous) =>
      [...previous.filter((row) => row.loggedDate !== weight.loggedDate), weight].sort((a, b) =>
        a.loggedDate.localeCompare(b.loggedDate),
      ),
    );
    setWeightUpdated(true);
    await updateUser({});
  };
  const saveRecovery = async (next: RecoveryPlan | null) => {
    const result = await apiRequest<{ recovery?: RecoveryRow }>(
      "/health/recovery",
      next
        ? {
            method: "PUT",
            body: {
              area: next.area,
              note: next.note,
              restDays: next.restDays,
              lightDays: next.lightDays,
              startDate: next.startDate,
            },
          }
        : { method: "DELETE" },
    );
    if (!alive.current) return;
    recoveryRevision.current++;
    setRecovery(result.recovery ? recoveryFromRow(result.recovery) : null);
  };
  const saveSex = async (next: Sex) => {
    await updateUser({ gender: next === "Male" ? "male" : next === "Female" ? "female" : "other" });
    if (alive.current && next !== "Female" && recovery?.area === PERIOD_AREA)
      await saveRecovery(null);
  };
  const savePlan = async (next: PlanPreferences) => {
    const fitnessGoal = (Object.keys(GOALS) as (keyof typeof GOALS)[]).find(
      (key) => GOALS[key] === next.goal,
    );
    const activityLevel = (Object.keys(ACTIVITIES) as (keyof typeof ACTIVITIES)[]).find(
      (key) => ACTIVITIES[key] === next.activity,
    );
    await updateUser({
      ...(fitnessGoal ? { fitnessGoal } : {}),
      ...(activityLevel ? { activityLevel } : {}),
      ...(next.sessions !== null ? { weeklySessions: next.sessions } : {}),
      ...(next.targetWeightKg !== null ? { targetWeightKg: next.targetWeightKg } : {}),
    });
  };
  const plan: PlanPreferences = {
    goal: user?.fitnessGoal ? GOALS[user.fitnessGoal] : "Not set",
    activity: user?.activityLevel ? ACTIVITIES[user.activityLevel] : "Not set",
    sessions: user?.weeklySessions ?? null,
    targetWeightKg: user?.targetWeightKg ?? null,
  };
  return (
    <HealthContext.Provider
      value={{
        weightKg: weights.at(-1)?.weightKg ?? user?.currentWeightKg ?? null,
        weights,
        weightUpdated,
        saveWeight,
        heightCm: user?.heightCm ?? null,
        saveHeight: async (heightCm) => {
          await updateUser({ heightCm });
        },
        sex:
          user?.gender === "male"
            ? "Male"
            : user?.gender === "female"
              ? "Female"
              : user?.gender === "other"
                ? "Rather not say"
                : null,
        saveSex,
        plan,
        savePlan,
        recovery,
        saveRecovery,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const value = useContext(HealthContext);
  if (!value) throw new Error("useHealth must be used inside HealthProvider");
  return value;
}
