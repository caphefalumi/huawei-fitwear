import { create } from 'zustand';
import { MealDoc, DailySummaryDoc, Timestamp } from '../types/types';
import { initialMeals, initialDailySummaries } from '../mocks/mockData';
import { mealService } from '../services/mealService';
import { summaryService } from '../services/summaryService';

interface NutritionState {
  selectedDate: string;
  meals: MealDoc[];
  todaySummary: DailySummaryDoc;
  loading: boolean;
  error: string | null;
  setSelectedDate: (date: string) => void;
  loadNutrition: (date?: string) => Promise<void>;
  addMeal: (meal: Omit<MealDoc, 'id' | 'createdAt' | 'syncedToWatch'>) => Promise<MealDoc>;
  deleteMeal: (id: string) => Promise<void>;
  resetNutrition: () => void;
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  selectedDate: Timestamp.toDateString(),
  meals: [...initialMeals],
  todaySummary: { ...initialDailySummaries[initialDailySummaries.length - 1] },
  loading: false,
  error: null,

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
    get().loadNutrition(date);
  },

  loadNutrition: async (dateToLoad?: string) => {
    const date = dateToLoad || get().selectedDate;
    set({ loading: true, error: null });
    try {
      const [meals, summary] = await Promise.all([
        mealService.getMealsByDate(date),
        summaryService.getTodaySummary()
      ]);
      set({ meals, todaySummary: summary, loading: false });
    } catch {
      set({ error: 'Failed to load nutrition data', loading: false });
    }
  },

  addMeal: async (mealData) => {
    const newMeal = await mealService.saveMeal(mealData);

    // Update daily summary
    const current = get().todaySummary;
    const caloriesConsumed = current.caloriesConsumed + newMeal.totalCalories;
    const proteinConsumed = current.proteinConsumed + newMeal.totalProtein;
    const carbsConsumed = current.carbsConsumed + newMeal.totalCarbs;
    const fatConsumed = current.fatConsumed + newMeal.totalFat;

    let status = current.status;
    if (caloriesConsumed > current.calorieTarget * 1.1) {
      status = 'OVER_TARGET';
    } else if (caloriesConsumed >= current.calorieTarget * 0.9) {
      status = 'ON_TRACK';
    } else {
      status = 'ALMOST_THERE';
    }

    const updatedSummary = await summaryService.updateTodaySummary({
      caloriesConsumed,
      proteinConsumed,
      carbsConsumed,
      fatConsumed,
      status
    });

    const currentMeals = get().meals;
    set({
      meals: [newMeal, ...currentMeals],
      todaySummary: updatedSummary
    });

    return newMeal;
  },

  deleteMeal: async (id: string) => {
    await mealService.deleteMeal(id);
    const updatedMeals = get().meals.filter((m) => m.id !== id);
    set({ meals: updatedMeals });
  },

  resetNutrition: () => {
    mealService.reset();
    summaryService.reset();
    set({
      selectedDate: Timestamp.toDateString(),
      meals: [...initialMeals],
      todaySummary: { ...initialDailySummaries[initialDailySummaries.length - 1] }
    });
  }
}));
