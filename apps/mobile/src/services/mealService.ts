import { MealDoc, MealItem, Timestamp } from '../types/types';
import { initialMeals } from '../mocks/mockData';

// Simulated database storage
let mealsDb: MealDoc[] = [...initialMeals];

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const mealService = {
  // TODO(api): GET /api/v1/meals?date={date}
  async getMealsByDate(date: string): Promise<MealDoc[]> {
    await delay(150);
    return mealsDb.filter((meal) => meal.date === date);
  },

  // TODO(api): GET /api/v1/meals
  async getAllMeals(): Promise<MealDoc[]> {
    await delay(150);
    return [...mealsDb];
  },

  // TODO(api): POST /api/v1/meals
  async saveMeal(meal: Omit<MealDoc, 'id' | 'createdAt' | 'syncedToWatch'>): Promise<MealDoc> {
    await delay(250);
    const newMeal: MealDoc = {
      ...meal,
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      syncedToWatch: true,
      createdAt: Timestamp.now()
    };
    mealsDb.unshift(newMeal);
    return newMeal;
  },

  // TODO(api): PUT /api/v1/meals/{id}
  async updateMeal(id: string, updates: Partial<MealDoc>): Promise<MealDoc> {
    await delay(200);
    const index = mealsDb.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Meal with id ${id} not found`);
    }
    const updated = { ...mealsDb[index], ...updates };
    mealsDb[index] = updated;
    return updated;
  },

  // TODO(api): DELETE /api/v1/meals/{id}
  async deleteMeal(id: string): Promise<void> {
    await delay(150);
    mealsDb = mealsDb.filter((m) => m.id !== id);
  },

  // Reset to initial seed
  reset(): void {
    mealsDb = [...initialMeals];
  }
};
