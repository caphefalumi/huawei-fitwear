import { useLocalSearchParams } from 'expo-router';

import { MealResultScreen } from '@/features/meals/meal-result-screen';
import { useMeals } from '@/features/meals/meals-store';

export default function MealRoute() {
  const { log } = useLocalSearchParams<{ log?: string }>();
  const { history } = useMeals();
  return <MealResultScreen log={history.find((item) => item.id === log)} />;
}
