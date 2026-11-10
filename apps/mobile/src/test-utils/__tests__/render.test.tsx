import { useQueryClient } from "@tanstack/react-query"
import { DarkTheme, useTheme } from "expo-router"
import { Text } from "react-native"

import { renderWithProviders } from "@/test-utils/render"

test("provides the selected theme and a query client to components", async () => {
  function Probe() {
    const theme = useTheme()
    const queryClient = useQueryClient()
    return <Text>{`${theme.dark}:${queryClient.getDefaultOptions().queries?.retry}`}</Text>
  }

  const screen = await renderWithProviders(<Probe />, { theme: DarkTheme })
  expect(screen.getByText("true:false")).toBeTruthy()
})
