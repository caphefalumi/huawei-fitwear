import { render, type RenderOptions } from "@testing-library/react-native"
import { DefaultTheme, ThemeProvider } from "expo-router"
import type { ReactElement, ReactNode } from "react"

import { createQueryWrapper } from "@/test-utils/query-wrapper"

type Options = Omit<RenderOptions, "wrapper"> & { theme?: typeof DefaultTheme }

export function renderWithProviders(
  ui: ReactElement,
  { theme = DefaultTheme, ...options }: Options = {},
) {
  const QueryWrapper = createQueryWrapper()
  return render(ui, {
    ...options,
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider value={theme}>
        <QueryWrapper>{children}</QueryWrapper>
      </ThemeProvider>
    ),
  })
}
