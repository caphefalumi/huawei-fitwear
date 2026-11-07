require("react-native-reanimated").setUpTests()

jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
  wrap: (component: unknown) => component,
  captureException: jest.fn(),
  appLoaded: jest.fn(),
  expoRouterIntegration: () => ({}),
  GlobalErrorBoundary: ({ children }: { children: unknown }) => children,
}))
