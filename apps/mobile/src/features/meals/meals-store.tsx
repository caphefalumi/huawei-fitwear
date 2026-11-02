import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";
import { useAuth } from "@/features/auth/auth-store";
import { apiRequest } from "@/lib/api";

export type Macros = { protein: number; carbs: number; fat: number };
export type MealGlyph = "wheat" | "drumstick" | "carrot" | "droplet";
export type MealItem = {
  id: string;
  name: string;
  detail: string;
  kcal: number;
  macros: Macros;
  glyph: MealGlyph;
  aiConfidence?: number;
};
export type FoodEntry = {
  id: string;
  name: string;
  serving: string;
  per100: Macros & { kcal: number };
  glyph: MealGlyph;
  unit: "g" | "ml";
};
export type MealEstimate = Macros & { kcal: number };
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type MealImage = { data: string; mimeType: "image/jpeg" | "image/png" };
export type MealLog = {
  id: string;
  name: string;
  date: string;
  time: string;
  targetDate: string;
  loggedAt: string;
  mealType: MealType;
  imageUrl: string | null;
  items: MealItem[];
  kcal: number;
  macros: Macros;
};
export type NutritionSummary = {
  targetDate: string;
  targets: {
    calorieTargetKcal: number;
    proteinTargetG: number;
    carbsTargetG: number;
    fatTargetG: number;
    source: "stored" | "derived";
  };
  consumed: { caloriesKcal: number; proteinG: number; carbsG: number; fatG: number };
  remaining: { caloriesKcal: number; proteinG: number; carbsG: number; fatG: number };
  mealCount: number;
};
export type ApiMealItem = {
  id?: string;
  foodName: string;
  estimatedWeightG: number;
  servingUnit?: "g" | "ml";
  correctedWeightG?: number | null;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  aiConfidence?: number | null;
};
type ApiMeal = {
  id: string;
  mealType: MealType;
  targetDate: string;
  loggedAt: string;
  imageUrl: string | null;
  items: ApiMealItem[];
};
const round1 = (value: number) => Math.round(value * 10) / 10;
export const localDate = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const mealTypeLabel = (type: MealType) => type.charAt(0).toUpperCase() + type.slice(1);
export const sumItems = (items: MealItem[]): MealEstimate =>
  items.reduce(
    (sum, item) => ({
      kcal: round1(sum.kcal + item.kcal),
      protein: round1(sum.protein + item.macros.protein),
      carbs: round1(sum.carbs + item.macros.carbs),
      fat: round1(sum.fat + item.macros.fat),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
export function estimatePortion(food: FoodEntry, amount: number): MealEstimate {
  const factor = amount / 100;
  return {
    kcal: Math.round(food.per100.kcal * factor),
    protein: round1(food.per100.protein * factor),
    carbs: round1(food.per100.carbs * factor),
    fat: round1(food.per100.fat * factor),
  };
}
export function splitDetail(detail: string): { amount: number; unit: string; note: string } {
  const match = /(\d+(?:\.\d+)?)\s*(g|ml)\b/i.exec(detail);
  if (!match) return { amount: 0, unit: "g", note: detail };
  return {
    amount: Number(match[1]),
    unit: match[2].toLowerCase(),
    note: detail.replace(match[0], "").replace(/^\s*·\s*/, ""),
  };
}
export function rescaleItem(item: MealItem, amount: number): MealItem {
  const { amount: previous, unit, note } = splitDetail(item.detail);
  if (previous <= 0) return item;
  const factor = amount / previous;
  return {
    ...item,
    detail: `${amount}${unit}${note ? ` · ${note}` : ""}`,
    kcal: Math.round(item.kcal * factor),
    macros: {
      protein: round1(item.macros.protein * factor),
      carbs: round1(item.macros.carbs * factor),
      fat: round1(item.macros.fat * factor),
    },
  };
}
export function fromApiItem(item: ApiMealItem, index = 0): MealItem {
  return {
    id: item.id ?? `analysis-${index}`,
    name: item.foodName,
    detail: `${item.correctedWeightG ?? item.estimatedWeightG}${item.servingUnit ?? "g"}`,
    kcal: item.caloriesKcal,
    macros: { protein: item.proteinG, carbs: item.carbsG, fat: item.fatG },
    glyph: "wheat",
    aiConfidence: item.aiConfidence ?? undefined,
  };
}
export function fromApiMeal(meal: ApiMeal): MealLog {
  const items = meal.items.map(fromApiItem);
  const { kcal, ...macros } = sumItems(items);
  const date = new Date(meal.loggedAt);
  return {
    ...meal,
    name: mealTypeLabel(meal.mealType),
    date: date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    items,
    kcal,
    macros,
  };
}
const toApiItem = (item: MealItem) => ({
  foodName: item.name,
  estimatedWeightG: splitDetail(item.detail).amount,
  servingUnit: splitDetail(item.detail).unit,
  caloriesKcal: item.kcal,
  proteinG: item.macros.protein,
  carbsG: item.macros.carbs,
  fatG: item.macros.fat,
  ...(item.aiConfidence !== undefined ? { aiConfidence: item.aiConfidence } : {}),
});
const validateItem = (item: MealItem) => {
  if (
    !item.name.trim() ||
    splitDetail(item.detail).amount <= 0 ||
    [item.kcal, ...Object.values(item.macros)].some((value) => !Number.isFinite(value) || value < 0)
  )
    throw new Error("Enter a name, positive portion and non-negative nutrition values.");
};

type MealsContextValue = {
  mealName: string;
  mealType: MealType;
  setMealType: (type: MealType) => void;
  items: MealItem[];
  totals: MealEstimate;
  draftImage: string | null;
  setAnalysis: (items: ApiMealItem[], imageUri: string, image: MealImage) => void;
  setDraftPhoto: (imageUri: string, image: MealImage) => void;
  loggedKcal: number;
  loggedMacros: Macros;
  loggedMealName: string | null;
  history: MealLog[];
  summary: NutritionSummary | null;
  loading: boolean;
  busy: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  tutorialSeen: boolean;
  dismissTutorial: () => void;
  addItem: (item: MealItem, mealId?: string) => Promise<void>;
  updateItem: (id: string, item: MealItem, mealId?: string) => Promise<void>;
  removeItem: (id: string, mealId?: string) => Promise<void>;
  deleteMeal: () => void;
  logMeal: () => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  updateMealType: (id: string, type: MealType) => Promise<void>;
};
const MealsContext = createContext<MealsContextValue | null>(null);
export function MealsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<MealItem[]>([]);
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const [draftImageData, setDraftImageData] = useState<MealImage | null>(null);
  const [tutorialSeen, setTutorialSeen] = useState(false);
  const [history, setHistory] = useState<MealLog[]>([]);
  const [summary, setSummary] = useState<NutritionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const active = useRef(true);
  const mutation = useRef(false);
  const generation = useRef(0);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      generation.current++;
    };
  }, []);
  const refresh = useCallback(async () => {
    if (!active.current) return;
    const request = ++generation.current;
    try {
      const all: MealLog[] = [];
      let offset = 0;
      while (true) {
        const result = await apiRequest<{ meals: ApiMeal[] }>(`/meals?limit=100&offset=${offset}`);
        if (!active.current || request !== generation.current) return;
        all.push(...result.meals.map(fromApiMeal));
        if (result.meals.length < 100) break;
        offset += result.meals.length;
      }
      if (active.current && request === generation.current) setHistory(all);
      const nextSummary = await apiRequest<NutritionSummary>(`/meals/summary?date=${localDate()}`);
      if (active.current && request === generation.current) {
        setSummary(nextSummary);
        setError(null);
      }
    } catch (cause) {
      if (active.current && request === generation.current)
        setError(cause instanceof Error ? cause.message : "Could not load meals.");
    } finally {
      if (active.current && request === generation.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [
    refresh,
    user?.updatedAt,
    user?.heightCm,
    user?.currentWeightKg,
    user?.birthDate,
    user?.gender,
    user?.activityLevel,
    user?.fitnessGoal,
  ]);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    let midnight: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const next = new Date();
      next.setHours(24, 0, 0, 0);
      midnight = setTimeout(() => {
        void refresh();
        schedule();
      }, next.getTime() - Date.now());
    };
    schedule();
    return () => {
      subscription.remove();
      clearTimeout(midnight);
    };
  }, [refresh]);
  const mutate = async (work: () => Promise<void>) => {
    if (mutation.current) throw new Error("A meal change is already being saved.");
    mutation.current = true;
    setBusy(true);
    setError(null);
    try {
      await work();
    } catch (cause) {
      if (active.current) setError(cause instanceof Error ? cause.message : "Could not save meal.");
      throw cause;
    } finally {
      mutation.current = false;
      if (active.current) setBusy(false);
    }
  };
  const replaceSaved = (meal: ApiMeal) => {
    if (!active.current) return;
    const saved = fromApiMeal(meal);
    setHistory((prev) =>
      prev.some((entry) => entry.id === meal.id)
        ? prev.map((entry) => (entry.id === meal.id ? saved : entry))
        : [saved, ...prev],
    );
  };
  const addItem = async (item: MealItem, mealId?: string) => {
    validateItem(item);
    if (!mealId) {
      setItems((prev) => [...prev, item]);
      return;
    }
    await mutate(async () => {
      replaceSaved(
        await apiRequest<ApiMeal>(`/meals/${mealId}/items`, {
          method: "POST",
          body: toApiItem(item),
        }),
      );
      await refresh();
    });
  };
  const updateItem = async (id: string, item: MealItem, mealId?: string) => {
    validateItem(item);
    if (!mealId) {
      setItems((prev) => prev.map((entry) => (entry.id === id ? item : entry)));
      return;
    }
    await mutate(async () => {
      const { estimatedWeightG, aiConfidence: _confidence, ...body } = toApiItem(item);
      replaceSaved(
        await apiRequest<ApiMeal>(`/meals/${mealId}/items/${id}`, {
          method: "PATCH",
          body: { ...body, correctedWeightG: estimatedWeightG },
        }),
      );
      await refresh();
    });
  };
  const removeItem = async (id: string, mealId?: string) => {
    if (!mealId) {
      setItems((prev) => prev.filter((entry) => entry.id !== id));
      return;
    }
    await mutate(async () => {
      const result = await apiRequest<ApiMeal | { success: true }>(`/meals/${mealId}/items/${id}`, {
        method: "DELETE",
      });
      if ("items" in result) replaceSaved(result);
      else if (active.current) setHistory((prev) => prev.filter((entry) => entry.id !== mealId));
      await refresh();
    });
  };
  const deleteMeal = () => {
    setItems([]);
    setDraftImage(null);
    setDraftImageData(null);
  };
  const logMeal = async () => {
    if (!items.length) throw new Error("Add at least one item before logging.");
    items.forEach(validateItem);
    await mutate(async () => {
      const result = await apiRequest<ApiMeal>("/meals", {
        method: "POST",
        body: {
          mealType,
          targetDate: localDate(),
          loggedAt: new Date().toISOString(),
          scaleReferenceType: "none",
          items: items.map(toApiItem),
          ...(draftImageData ? { image: draftImageData } : {}),
        },
      });
      if (active.current) {
        setHistory((prev) => [fromApiMeal(result), ...prev]);
        deleteMeal();
      }
      await refresh();
    });
  };
  const deleteLog = async (id: string) => {
    await mutate(async () => {
      await apiRequest(`/meals/${id}`, { method: "DELETE" });
      if (active.current) setHistory((prev) => prev.filter((entry) => entry.id !== id));
      await refresh();
    });
  };
  const updateMealType = async (id: string, type: MealType) => {
    await mutate(async () => {
      replaceSaved(
        await apiRequest<ApiMeal>(`/meals/${id}`, { method: "PATCH", body: { mealType: type } }),
      );
      await refresh();
    });
  };
  const totals = useMemo(() => sumItems(items), [items]);
  return (
    <MealsContext.Provider
      value={{
        mealName: mealTypeLabel(mealType),
        mealType,
        setMealType,
        items,
        totals,
        draftImage,
        setDraftPhoto: (imageUri, image) => {
          setDraftImage(imageUri);
          setDraftImageData(image);
        },
        setAnalysis: (next, imageUri, image) => {
          setItems(next.map(fromApiItem));
          setDraftImage(imageUri);
          setDraftImageData(image);
        },
        history,
        summary,
        loading,
        busy,
        error,
        refresh,
        loggedKcal: summary?.consumed.caloriesKcal ?? 0,
        loggedMacros: {
          protein: summary?.consumed.proteinG ?? 0,
          carbs: summary?.consumed.carbsG ?? 0,
          fat: summary?.consumed.fatG ?? 0,
        },
        loggedMealName: history.find((meal) => meal.targetDate === localDate())?.name ?? null,
        tutorialSeen,
        dismissTutorial: () => setTutorialSeen(true),
        addItem,
        updateItem,
        removeItem,
        deleteMeal,
        logMeal,
        deleteLog,
        updateMealType,
      }}
    >
      {children}
    </MealsContext.Provider>
  );
}
export function useMeals(): MealsContextValue {
  const value = useContext(MealsContext);
  if (!value) throw new Error("useMeals must be used inside MealsProvider");
  return value;
}

export function useFoodSearch(query: string) {
  const [matches, setMatches] = useState<FoodEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let current = true;
    setMatches([]);
    setError(null);
    if (!query.trim()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      apiRequest<{
        foods: {
          id: string;
          name: string;
          servingUnit: "g" | "ml";
          glyph: MealGlyph;
          caloriesPer100: number;
          proteinPer100G: number;
          carbsPer100G: number;
          fatPer100G: number;
        }[];
      }>(`/foods?q=${encodeURIComponent(query.trim())}`)
        .then((result) => {
          if (current)
            setMatches(
              result.foods.map((food) => ({
                id: food.id,
                name: food.name,
                serving: `Per 100 ${food.servingUnit}`,
                unit: food.servingUnit,
                glyph: food.glyph,
                per100: {
                  kcal: food.caloriesPer100,
                  protein: food.proteinPer100G,
                  carbs: food.carbsPer100G,
                  fat: food.fatPer100G,
                },
              })),
            );
        })
        .catch((cause) => {
          if (current) setError(cause instanceof Error ? cause.message : "Food search failed.");
        })
        .finally(() => {
          if (current) setLoading(false);
        });
    }, 250);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [query]);
  return { matches, error, loading };
}
