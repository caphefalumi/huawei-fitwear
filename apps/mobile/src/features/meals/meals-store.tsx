import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Macros = { protein: number; carbs: number; fat: number };

export type MealItem = {
  id: string;
  name: string;
  detail: string;
  kcal: number;
  macros: Macros;
  glyph: MealGlyph;
};

export type MealGlyph = 'wheat' | 'drumstick' | 'carrot' | 'droplet';

export type FoodEntry = {
  id: string;
  name: string;
  serving: string;
  per100: Macros & { kcal: number };
  glyph: MealGlyph;
  unit: 'g' | 'ml';
};

export type MealEstimate = Macros & { kcal: number };

/** Demo food database lifted from the Figma "Add Item · Database Search" results. */
export const FOOD_DB: FoodEntry[] = [
  {
    id: 'white-rice',
    name: 'Cooked White Rice',
    serving: 'Standard serving · per 100 g',
    per100: { kcal: 130, protein: 2.5, carbs: 28.5, fat: 0.5 },
    glyph: 'wheat',
    unit: 'g',
  },
  {
    id: 'brown-rice',
    name: 'Cooked Brown Rice',
    serving: 'Standard serving · per 100 g',
    per100: { kcal: 123, protein: 2.7, carbs: 25.6, fat: 1 },
    glyph: 'wheat',
    unit: 'g',
  },
  {
    id: 'rice-noodles',
    name: 'Cooked Rice Noodles',
    serving: 'Standard serving · per 100 g',
    per100: { kcal: 109, protein: 1.8, carbs: 24.9, fat: 0.2 },
    glyph: 'wheat',
    unit: 'g',
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    serving: 'Standard serving · per 100 g',
    per100: { kcal: 165, protein: 28.7, carbs: 0, fat: 6 },
    glyph: 'drumstick',
    unit: 'g',
  },
  {
    id: 'steamed-veggies',
    name: 'Steamed Veggies',
    serving: 'Standard serving · per 100 g',
    per100: { kcal: 40, protein: 2, carbs: 9, fat: 0 },
    glyph: 'carrot',
    unit: 'g',
  },
  {
    id: 'olive-oil',
    name: 'Olive Oil',
    serving: 'Standard serving · per 100 g',
    per100: { kcal: 900, protein: 0, carbs: 0, fat: 100 },
    glyph: 'droplet',
    unit: 'g',
  },
  {
    id: 'oat-milk-latte',
    name: 'Oat Milk Latte',
    serving: 'Standard serving · per 100 ml',
    per100: { kcal: 60, protein: 1.2, carbs: 8.4, fat: 2.4 },
    glyph: 'droplet',
    unit: 'ml',
  },
  {
    id: 'greek-yogurt',
    name: 'Greek Yogurt',
    serving: 'Standard serving · per 100 g',
    per100: { kcal: 97, protein: 9, carbs: 3.9, fat: 5 },
    glyph: 'droplet',
    unit: 'g',
  },
];

export const BASELINE_MEAL_NAME = "Sam’s Lunch";

export const BASELINE_ITEMS: MealItem[] = [
  {
    id: 'rice',
    name: 'White Rice',
    detail: '200g · cooked',
    kcal: 260,
    macros: { protein: 5, carbs: 57, fat: 1 },
    glyph: 'wheat',
  },
  {
    id: 'chicken',
    name: 'Chicken Breast',
    detail: '150g · cooked',
    kcal: 250,
    macros: { protein: 43, carbs: 0, fat: 9 },
    glyph: 'drumstick',
  },
  {
    id: 'veggies',
    name: 'Steamed Veggies',
    detail: '200g',
    kcal: 80,
    macros: { protein: 4, carbs: 18, fat: 0 },
    glyph: 'carrot',
  },
  {
    id: 'oil',
    name: 'Olive Oil',
    detail: '10g · used',
    kcal: 90,
    macros: { protein: 0, carbs: 0, fat: 10 },
    glyph: 'droplet',
  },
];

const round1 = (value: number): number => Math.round(value * 10) / 10;

/** Scales a per-100 g/ml entry to the requested portion. */
export function estimatePortion(food: FoodEntry, amount: number): MealEstimate {
  const factor = amount / 100;
  return {
    kcal: Math.round(food.per100.kcal * factor),
    protein: round1(food.per100.protein * factor),
    carbs: round1(food.per100.carbs * factor),
    fat: round1(food.per100.fat * factor),
  };
}

type MealsContextValue = {
  mealName: string;
  items: MealItem[];
  totals: MealEstimate;
  loggedKcal: number;
  loggedMacros: Macros;
  loggedMealName: string | null;
  tutorialSeen: boolean;
  dismissTutorial: () => void;
  addItem: (item: MealItem) => void;
  updateItem: (id: string, item: MealItem) => void;
  removeItem: (id: string) => void;
  deleteMeal: () => void;
  logMeal: () => void;
};

const MealsContext = createContext<MealsContextValue | null>(null);

export function MealsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MealItem[]>(BASELINE_ITEMS);
  const [tutorialSeen, setTutorialSeen] = useState(false);
  const [logged, setLogged] = useState<MealEstimate | null>(null);

  const totals = useMemo<MealEstimate>(
    () =>
      items.reduce<MealEstimate>(
        (acc, item) => ({
          kcal: acc.kcal + item.kcal,
          protein: round1(acc.protein + item.macros.protein),
          carbs: round1(acc.carbs + item.macros.carbs),
          fat: round1(acc.fat + item.macros.fat),
        }),
        { kcal: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [items],
  );

  const addItem = useCallback((item: MealItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: string, item: MealItem) => {
    setItems((prev) => prev.map((entry) => (entry.id === id ? item : entry)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const deleteMeal = useCallback(() => setItems([]), []);

  const logMeal = useCallback(() => setLogged(totals), [totals]);

  return (
    <MealsContext.Provider
      value={{
        mealName: BASELINE_MEAL_NAME,
        items,
        totals,
        loggedKcal: logged?.kcal ?? 0,
        loggedMacros: {
          protein: logged?.protein ?? 0,
          carbs: logged?.carbs ?? 0,
          fat: logged?.fat ?? 0,
        },
        loggedMealName: logged ? BASELINE_MEAL_NAME : null,
        tutorialSeen,
        dismissTutorial: () => setTutorialSeen(true),
        addItem,
        updateItem,
        removeItem,
        deleteMeal,
        logMeal,
      }}>
      {children}
    </MealsContext.Provider>
  );
}

export function useMeals(): MealsContextValue {
  const value = useContext(MealsContext);
  if (!value) throw new Error('useMeals must be used inside MealsProvider');
  return value;
}

/** Splits a detail label like "200g · cooked" into amount, unit and note. */
export function splitDetail(detail: string): { amount: number; unit: string; note: string } {
  const match = /(\d+(?:\.\d+)?)\s*(g|ml)\b/i.exec(detail);
  if (!match) return { amount: 0, unit: 'g', note: detail };
  const rest = detail.replace(match[0], '').replace(/^\s*·\s*/, '');
  return { amount: Number(match[1]), unit: match[2].toLowerCase(), note: rest };
}

/** Rescales an item's nutrition proportionally to a new portion weight. */
export function rescaleItem(item: MealItem, amount: number): MealItem {
  const { amount: previous, unit, note } = splitDetail(item.detail);
  if (previous <= 0) return item;
  const factor = amount / previous;
  return {
    ...item,
    detail: `${amount}${unit}${note ? ` · ${note}` : ''}`,
    kcal: Math.round(item.kcal * factor),
    macros: {
      protein: round1(item.macros.protein * factor),
      carbs: round1(item.macros.carbs * factor),
      fat: round1(item.macros.fat * factor),
    },
  };
}
