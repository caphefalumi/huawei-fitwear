import { act, renderHook, waitFor } from "@testing-library/react-native";
import { apiRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import {
  MealsProvider,
  useMeals,
  useFoodSearch,
  estimatePortion,
  fromApiMeal,
  localDate,
  mealsQueryKeys,
  rescaleItem,
  splitDetail,
  sumItems,
  type MealItem,
} from "@/features/meals/meals-store";
import { createQueryWrapper } from "./query-wrapper";
import { useMealClientStore } from "@/features/meals/meal-client.store";
let mockUserId = "member-a";

jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  apiRequest: jest.fn(),
}));
jest.mock("@/features/auth/auth-store", () => ({
  useAuth: () => ({ user: { id: mockUserId, updatedAt: "2026-11-01T00:00:00Z" } }),
}));
const request = apiRequest as jest.MockedFunction<
  (path: string, options?: { method?: string; body?: unknown }) => Promise<unknown>
>;
const item: MealItem = {
  id: "draft-item",
  name: "Rice",
  detail: "200g",
  kcal: 260,
  macros: { protein: 5, carbs: 57, fat: 1 },
  glyph: "wheat",
};
const summary = {
  targetDate: localDate(),
  targets: {
    calorieTargetKcal: 2100,
    proteinTargetG: 130,
    carbsTargetG: 250,
    fatTargetG: 60,
    source: "derived",
  },
  consumed: { caloriesKcal: 260, proteinG: 5, carbsG: 57, fatG: 1 },
  remaining: { caloriesKcal: 1840, proteinG: 125, carbsG: 193, fatG: 59 },
  mealCount: 1,
};
const savedMeal = {
  id: "meal-a",
  mealType: "lunch" as const,
  targetDate: localDate(),
  loggedAt: new Date().toISOString(),
  imageUrl: null,
  items: [
    {
      id: "saved-item",
      foodName: "Rice",
      estimatedWeightG: 200,
      caloriesKcal: 260,
      proteinG: 5,
      carbsG: 57,
      fatG: 1,
    },
  ],
};

beforeEach(() => {
  request.mockReset();
  mockUserId = "member-a";
  useMealClientStore.setState({
    accountId: null,
    items: [],
    mealType: "lunch",
    draftImage: null,
    draftImageData: null,
    tutorialSeen: false,
    summaryDate: localDate(),
  });
  request.mockImplementation(async (path) =>
    path.startsWith("/meals/summary") ? summary : { meals: [] },
  );
});

test("portion math and corrections preserve per-portion nutrition", () => {
  expect(
    estimatePortion(
      {
        id: "rice",
        name: "Rice",
        serving: "Per 100 g",
        unit: "g",
        glyph: "wheat",
        per100: { kcal: 130, protein: 2.5, carbs: 28.5, fat: 0.5 },
      },
      200,
    ),
  ).toEqual({ kcal: 260, protein: 5, carbs: 57, fat: 1 });
  expect(rescaleItem(item, 100)).toMatchObject({
    detail: "100g",
    kcal: 130,
    macros: { protein: 2.5, carbs: 28.5, fat: 0.5 },
  });
  expect(splitDetail("250ml · measured")).toEqual({ amount: 250, unit: "ml", note: "measured" });
  expect(sumItems([item, item])).toEqual({ kcal: 520, protein: 10, carbs: 114, fat: 2 });
});

test("API adapters use corrected portions and real timestamps, not seeded history", () => {
  const mapped = fromApiMeal({
    ...savedMeal,
    items: [{ ...savedMeal.items[0], correctedWeightG: 175 }],
  });
  expect(mapped).toMatchObject({
    id: "meal-a",
    name: "Lunch",
    targetDate: savedMeal.targetDate,
    items: [{ detail: "175g" }],
    kcal: 260,
  });
  expect(mapped.date).not.toBe("Oct 8");
  const drink = fromApiMeal({
    ...savedMeal,
    items: [{ ...savedMeal.items[0], servingUnit: "ml", correctedWeightG: 250 }],
  });
  expect(drink.items[0].detail).toBe("250ml");
});

test("new account has an empty draft and uses the server daily summary", async () => {
  const { result } = await renderHook(() => useMeals(), {
    wrapper: createQueryWrapper(MealsProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.items).toEqual([]);
  expect(result.current.history).toEqual([]);
  expect(result.current.loggedKcal).toBe(260);
  expect(result.current.summary).toEqual(summary);
});

test("draft CRUD is local until awaited logging persists the complete meal", async () => {
  const { result } = await renderHook(() => useMeals(), {
    wrapper: createQueryWrapper(MealsProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () => {
    await result.current.addItem(item);
  });
  await act(async () => {
    await result.current.updateItem(item.id, rescaleItem(item, 100));
  });
  expect(result.current.totals.kcal).toBe(130);
  request.mockImplementation(async (path, options) =>
    options?.method === "POST"
      ? savedMeal
      : path.startsWith("/meals/summary")
        ? summary
        : { meals: [savedMeal] },
  );
  await act(async () => {
    await result.current.logMeal();
  });
  expect(request).toHaveBeenCalledWith(
    "/meals",
    expect.objectContaining({
      method: "POST",
      body: expect.objectContaining({
        targetDate: localDate(),
        mealType: "lunch",
        items: [
          expect.objectContaining({ foodName: "Rice", estimatedWeightG: 100, caloriesKcal: 130 }),
        ],
      }),
    }),
  );
  expect(result.current.items).toEqual([]);
  expect(result.current.history[0].id).toBe("meal-a");
});

test("failed logging preserves the editable draft and surfaces the error", async () => {
  const { result } = await renderHook(() => useMeals(), {
    wrapper: createQueryWrapper(MealsProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () => {
    await result.current.addItem(item);
  });
  request.mockRejectedValueOnce(new Error("Network unavailable"));
  await act(async () => {
    await expect(result.current.logMeal()).rejects.toThrow("Network unavailable");
  });
  expect(result.current.items).toEqual([item]);
  await waitFor(() =>
    expect(result.current.actionError).toBe("Couldn't save your change. Try again."),
  );
  expect(result.current.busy).toBe(false);

  await act(async () => {
    await result.current.retryAction();
  });

  expect(result.current.items).toEqual([]);
  expect(result.current.actionError).toBeNull();
  expect(request.mock.calls.filter(([path]) => path === "/meals")).toHaveLength(2);
});
test("persisted correction uses the item endpoint and awaits the new server result", async () => {
  request.mockImplementation(async (path) =>
    path.startsWith("/meals/summary") ? summary : { meals: [savedMeal] },
  );
  const { result } = await renderHook(() => useMeals(), {
    wrapper: createQueryWrapper(MealsProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  request.mockImplementation(async (path, options) =>
    options?.method === "PATCH"
      ? savedMeal
      : path.startsWith("/meals/summary")
        ? summary
        : { meals: [savedMeal] },
  );
  await act(async () => {
    await result.current.updateItem("saved-item", rescaleItem(item, 150), "meal-a");
  });
  expect(request).toHaveBeenCalledWith("/meals/meal-a/items/saved-item", {
    method: "PATCH",
    body: {
      foodName: "Rice",
      servingUnit: "g",
      correctedWeightG: 150,
      caloriesKcal: 195,
      proteinG: 3.8,
      carbsG: 42.8,
      fatG: 0.8,
    },
  });
});
test("deleting a meal item invalidates its cached parent detail", async () => {
  request.mockImplementation(async (path) => {
    if (path.startsWith("/meals/summary")) return summary;
    if (path.startsWith("/meals?")) return { meals: [savedMeal] };
    return { success: true };
  });
  const client = { current: null as QueryClient | null };
  const wrapper = createQueryWrapper(MealsProvider, (queryClient) => {
    client.current = queryClient;
  });
  const detailKey = mealsQueryKeys.detail("member-a", "meal-a");
  const { result } = await renderHook(
    () => {
      const meals = useMeals();
      useQuery({
        queryKey: detailKey,
        queryFn: async () => fromApiMeal(savedMeal),
        enabled: false,
      });
      return meals;
    },
    { wrapper },
  );
  await waitFor(() => expect(result.current.loading).toBe(false));

  client.current!.setQueryData(detailKey, fromApiMeal(savedMeal));
  await act(async () => result.current.removeItem("saved-item", "meal-a"));

  expect(client.current!.getQueryState(detailKey)?.isInvalidated).toBe(true);
});

test("late responses for a previous account never populate the current account cache", async () => {
  const pending = Promise.withResolvers<{ meals: (typeof savedMeal)[] }>();
  request.mockImplementation(async (path) => {
    if (path.startsWith("/meals/summary")) return summary;
    return mockUserId === "member-a" ? pending.promise : { meals: [] };
  });
  const view = await renderHook(() => useMeals(), { wrapper: createQueryWrapper(MealsProvider) });

  mockUserId = "member-b";
  view.rerender(undefined);
  await waitFor(() => expect(view.result.current.loading).toBe(false));
  await act(async () => pending.resolve({ meals: [savedMeal] }));
  expect(view.result.current.history).toEqual([]);
});

test("failed history deletion leaves the saved meal available", async () => {
  request.mockImplementation(async (path) =>
    path.startsWith("/meals/summary") ? summary : { meals: [savedMeal] },
  );
  const { result } = await renderHook(() => useMeals(), {
    wrapper: createQueryWrapper(MealsProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  request.mockRejectedValueOnce(new Error("Delete unavailable"));
  await act(async () => {
    await expect(result.current.deleteLog("meal-a")).rejects.toThrow("Delete unavailable");
  });
  expect(result.current.history.map((meal) => meal.id)).toEqual(["meal-a"]);
  await waitFor(() =>
    expect(result.current.actionError).toBe("Couldn't save your change. Try again."),
  );
});

test("food search maps backend catalogue units and nutrients", async () => {
  request.mockResolvedValue({
    foods: [
      {
        id: "milk",
        name: "Milk",
        servingUnit: "ml",
        glyph: "droplet",
        caloriesPer100: 60,
        proteinPer100G: 3.4,
        carbsPer100G: 5,
        fatPer100G: 3.3,
      },
    ],
  });
  const { result } = await renderHook(() => useFoodSearch("Milk"), {
    wrapper: createQueryWrapper(),
  });
  await waitFor(() => expect(result.current.matches).toHaveLength(1));
  expect(request).toHaveBeenCalledWith(
    "/foods?q=Milk",
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
  expect(result.current.matches).toEqual([
    {
      id: "milk",
      name: "Milk",
      serving: "Per 100 ml",
      unit: "ml",
      glyph: "droplet",
      per100: { kcal: 60, protein: 3.4, carbs: 5, fat: 3.3 },
    },
  ]);
});

test("captured photo stays with failed drafts and is uploaded with the logged meal", async () => {
  const { result } = await renderHook(() => useMeals(), {
    wrapper: createQueryWrapper(MealsProvider),
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  const image = { data: "/9j/actual-selected-image-bytes", mimeType: "image/jpeg" as const };
  await act(async () => {
    result.current.setDraftPhoto("file:///meal.jpeg", image);
    await result.current.addItem(item);
  });
  request.mockRejectedValueOnce(new Error("Photo storage unavailable"));
  await act(async () => {
    await expect(result.current.logMeal()).rejects.toThrow("Photo storage unavailable");
  });
  expect(result.current.draftImage).toBe("file:///meal.jpeg");
  expect(result.current.items).toEqual([item]);
  request.mockImplementation(async (path, options) =>
    options?.method === "POST"
      ? savedMeal
      : path.startsWith("/meals/summary")
        ? summary
        : { meals: [savedMeal] },
  );
  await act(async () => {
    await result.current.logMeal();
  });
  expect(request).toHaveBeenCalledWith(
    "/meals",
    expect.objectContaining({ method: "POST", body: expect.objectContaining({ image }) }),
  );
  expect(result.current.draftImage).toBeNull();
});
