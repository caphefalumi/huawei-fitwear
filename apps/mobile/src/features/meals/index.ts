/** Public API. Screens are composed by route files directly. */
export { fetchMeal, fetchMealSummary, writeMeal } from "./api/meals-api"
export type { ApiMeal } from "./api/meals-api"
export { mealTitle } from "./utils/meal-journal"
export {
  estimatePortion,
  fromApiItem,
  fromApiMeal,
  localDate,
  mealTypeLabel,
  MealsProvider,
  mealsQueryKeys,
  rescaleItem,
  splitDetail,
  sumItems,
  useDaySummary,
  useFoodSearch,
  useMeals,
} from "./hooks/meals-hooks"
export type {
  ApiMealItem,
  FoodEntry,
  Macros,
  MealEstimate,
  MealGlyph,
  MealImage,
  MealItem,
  MealLog,
  MealType,
  NutritionSummary,
  ProfileField,
} from "./hooks/meals-hooks"
export { MealHistoryCard } from "./components/meal-history-card"
export { MealPhoto } from "./components/meal-photo"
export {
  Box,
  Field,
  Glyph,
  icons,
  NutrientGrid,
  SearchInput,
  ValueInput,
} from "./components/meals-ui"
