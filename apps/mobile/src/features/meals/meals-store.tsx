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

export type MealLog = {
  id: string;
  name: string;
  date: string;
  time: string;
  items: MealItem[];
  kcal: number;
  macros: Macros;
};

const sumItems = (items: MealItem[]): MealEstimate =>
  items.reduce<MealEstimate>(
    (acc, item) => ({
      kcal: acc.kcal + item.kcal,
      protein: round1(acc.protein + item.macros.protein),
      carbs: round1(acc.carbs + item.macros.carbs),
      fat: round1(acc.fat + item.macros.fat),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );

const makeLog = (
  id: string,
  name: string,
  date: string,
  time: string,
  items: MealItem[],
): MealLog => {
  const { kcal, protein, carbs, fat } = sumItems(items);
  return { id, name, date, time, items, kcal, macros: { protein, carbs, fat } };
};

const seedItem = (
  id: string,
  name: string,
  detail: string,
  kcal: number,
  protein: number,
  carbs: number,
  fat: number,
  glyph: MealGlyph,
): MealItem => ({ id, name, detail, kcal, macros: { protein, carbs, fat }, glyph });

/** Demo meal history, newest first. */
export const HISTORY_SEED: MealLog[] = [
  makeLog('h12', 'Greek yogurt & berries', 'Oct 8', '10:05', [
    seedItem('h12-1', 'Greek Yogurt', '150g', 146, 13.5, 5.9, 7.5, 'droplet'),
    seedItem('h12-2', 'Mixed Berries', '80g', 40, 0.6, 9.6, 0.3, 'carrot'),
    seedItem('h12-3', 'Honey', '10g', 30, 0, 8, 0, 'droplet'),
  ]),
  makeLog('h11', 'Avocado egg toast', 'Oct 8', '07:40', [
    seedItem('h11-1', 'Whole-grain Toast', '60g', 150, 6, 26, 2, 'wheat'),
    seedItem('h11-2', 'Avocado', '70g', 112, 1.4, 6, 10, 'carrot'),
    seedItem('h11-3', 'Fried Egg', '50g', 90, 6, 0.4, 7, 'drumstick'),
  ]),
  makeLog('h10', 'Salmon & steamed veggies', 'Oct 7', '19:10', [
    seedItem('h10-1', 'Grilled Salmon', '150g · cooked', 310, 33, 0, 19, 'drumstick'),
    seedItem('h10-2', 'Steamed Veggies', '200g', 80, 4, 18, 0, 'carrot'),
    seedItem('h10-3', 'Olive Oil', '10g · used', 90, 0, 0, 10, 'droplet'),
  ]),
  makeLog('h9', 'Chicken rice bowl', 'Oct 7', '12:25', [
    seedItem('h9-1', 'White Rice', '200g · cooked', 260, 5, 57, 1, 'wheat'),
    seedItem('h9-2', 'Chicken Breast', '150g · cooked', 250, 43, 0, 9, 'drumstick'),
    seedItem('h9-3', 'Steamed Veggies', '150g', 60, 3, 13, 0, 'carrot'),
  ]),
  makeLog('h8', 'Pho bo', 'Oct 7', '08:05', [
    seedItem('h8-1', 'Rice Noodles', '250g · cooked', 270, 4.5, 62, 0.5, 'wheat'),
    seedItem('h8-2', 'Sliced Beef', '80g · cooked', 160, 18, 0, 10, 'drumstick'),
    seedItem('h8-3', 'Beef Broth', '400ml', 40, 4, 2, 1, 'droplet'),
  ]),
  makeLog('h7', 'Grilled shrimp salad', 'Oct 6', '18:45', [
    seedItem('h7-1', 'Grilled Shrimp', '150g · cooked', 150, 30, 1, 2, 'drumstick'),
    seedItem('h7-2', 'Mixed Greens', '120g', 25, 2, 4, 0, 'carrot'),
    seedItem('h7-3', 'Olive Oil', '15g · used', 135, 0, 0, 15, 'droplet'),
  ]),
  makeLog('h6', 'Beef banh mi', 'Oct 6', '12:40', [
    seedItem('h6-1', 'Baguette', '100g', 270, 9, 52, 3, 'wheat'),
    seedItem('h6-2', 'Grilled Beef', '80g · cooked', 200, 20, 0, 13, 'drumstick'),
    seedItem('h6-3', 'Pickled Veggies', '60g', 30, 1, 7, 0, 'carrot'),
  ]),
  makeLog('h5', 'Oatmeal with banana', 'Oct 6', '07:30', [
    seedItem('h5-1', 'Rolled Oats', '60g', 230, 8, 40, 4, 'wheat'),
    seedItem('h5-2', 'Banana', '100g', 89, 1, 23, 0, 'carrot'),
    seedItem('h5-3', 'Milk', '100ml', 60, 3.4, 5, 3.3, 'droplet'),
  ]),
  makeLog('h4', 'Tofu stir-fry with rice', 'Oct 5', '19:00', [
    seedItem('h4-1', 'White Rice', '200g · cooked', 260, 5, 57, 1, 'wheat'),
    seedItem('h4-2', 'Firm Tofu', '150g', 144, 15, 3, 8, 'drumstick'),
    seedItem('h4-3', 'Stir-fried Veggies', '150g', 90, 3, 14, 3, 'carrot'),
  ]),
  makeLog('h3', 'Scrambled eggs & toast', 'Oct 5', '08:15', [
    seedItem('h3-1', 'Scrambled Eggs', '120g · cooked', 190, 12, 2, 14, 'drumstick'),
    seedItem('h3-2', 'Whole-grain Toast', '60g', 150, 5, 26, 2, 'wheat'),
  ]),
  makeLog('h2', 'Pasta with tomato sauce', 'Oct 4', '19:20', [
    seedItem('h2-1', 'Cooked Pasta', '250g · cooked', 390, 14, 78, 2, 'wheat'),
    seedItem('h2-2', 'Tomato Sauce', '120g', 70, 2, 12, 2, 'carrot'),
    seedItem('h2-3', 'Olive Oil', '10g · used', 90, 0, 0, 10, 'droplet'),
    seedItem('h2-4', 'Parmesan', '15g', 60, 5, 0, 4, 'droplet'),
  ]),
  makeLog('h1', 'Protein smoothie', 'Oct 4', '15:30', [
    seedItem('h1-1', 'Whey Protein', '30g', 120, 24, 3, 2, 'droplet'),
    seedItem('h1-2', 'Banana', '100g', 89, 1, 23, 0, 'carrot'),
    seedItem('h1-3', 'Almond Milk', '250ml', 40, 1, 1, 3, 'droplet'),
  ]),
];

const TODAY_LOG_ID = 'today-logged';

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
  history: MealLog[];
  tutorialSeen: boolean;
  dismissTutorial: () => void;
  addItem: (item: MealItem) => void;
  updateItem: (id: string, item: MealItem) => void;
  removeItem: (id: string) => void;
  deleteMeal: () => void;
  logMeal: () => void;
  deleteLog: (id: string) => void;
};

const MealsContext = createContext<MealsContextValue | null>(null);

export function MealsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MealItem[]>(BASELINE_ITEMS);
  const [tutorialSeen, setTutorialSeen] = useState(false);
  const [logged, setLogged] = useState<MealEstimate | null>(null);
  const [history, setHistory] = useState<MealLog[]>(HISTORY_SEED);

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

  const logMeal = useCallback(() => {
    setLogged(totals);
    const entry = makeLog(TODAY_LOG_ID, BASELINE_MEAL_NAME, 'Oct 8', '12:30', items);
    setHistory((prev) => [entry, ...prev.filter((item) => item.id !== TODAY_LOG_ID)]);
  }, [totals, items]);

  const deleteLog = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (id === TODAY_LOG_ID) setLogged(null);
  }, []);

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
        history,
        tutorialSeen,
        dismissTutorial: () => setTutorialSeen(true),
        addItem,
        updateItem,
        removeItem,
        deleteMeal,
        logMeal,
        deleteLog,
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
