import { router, useLocalSearchParams } from "expo-router";

import { MealDetailScreen } from "@/features/meals";

export default function MealRoute() {
  const { log } = useLocalSearchParams<{ log?: string }>();
  return <MealDetailScreen logId={log} onBack={() => router.back()} />;
}
