import { act, fireEvent, render, waitFor } from "@testing-library/react-native";

import { MealDetailScreen } from "@/features/meals/meal-detail-screen";
import { useMeals } from "@/features/meals/meals-store";
import { apiRequest } from "@/lib/api";

jest.mock("@/features/meals/meals-store", () => ({
  fromApiMeal: (meal: unknown) => meal,
  useMeals: jest.fn(),
}));
jest.mock("@/lib/api", () => ({ apiRequest: jest.fn() }));
jest.mock("@/features/meals/meal-result-screen", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    MealResultScreen: ({ log }: { log?: { name?: string } }) =>
      React.createElement(Text, null, log?.name ?? "Draft meal"),
  };
});

const request = jest.mocked(apiRequest);
const useMealsMock = jest.mocked(useMeals);

beforeEach(() => {
  request.mockReset();
  useMealsMock.mockReturnValue({ history: [], loading: false } as never);
});

test("loads a meal by encoded route ID and retries a failed request", async () => {
  const initialRequest = Promise.withResolvers<never>();
  request
    .mockImplementationOnce(() => initialRequest.promise)
    .mockResolvedValueOnce({ name: "Saved meal" } as never);
  const onBack = jest.fn();
  const screen = await render(<MealDetailScreen logId="meal/42" onBack={onBack} />);

  expect(screen.getByText("Loading meal…")).toBeTruthy();
  await act(async () => {
    initialRequest.reject(new Error("Could not reach meal service."));
  });
  await waitFor(() => expect(screen.getByText("Could not reach meal service.")).toBeTruthy());
  expect(screen.getByRole("alert")).toBeTruthy();
  expect(request).toHaveBeenNthCalledWith(1, "/meals/meal%2F42");

  await fireEvent.press(screen.getByRole("button", { name: "Retry" }));
  await waitFor(() => expect(screen.getByText("Saved meal")).toBeTruthy());
  expect(request).toHaveBeenNthCalledWith(2, "/meals/meal%2F42");
  expect(onBack).not.toHaveBeenCalled();
});
