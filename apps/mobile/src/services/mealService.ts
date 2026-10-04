import { MealDoc } from '../types/types';
import { mealRepository } from '../repositories';

export const mealService = {
  getMealsByDate: (date: string): Promise<MealDoc[]> => mealRepository.getMealsByDate(date),
  getAllMeals: (): Promise<MealDoc[]> => mealRepository.getAllMeals(),
  saveMeal: (meal: Omit<MealDoc, 'id' | 'createdAt' | 'syncedToWatch'>): Promise<MealDoc> =>
    mealRepository.saveMeal(meal),
  updateMeal: (id: string, updates: Partial<MealDoc>): Promise<MealDoc> =>
    mealRepository.updateMeal(id, updates),
  deleteMeal: (id: string): Promise<void> => mealRepository.deleteMeal(id),
  reset: (): void => mealRepository.reset()
};
