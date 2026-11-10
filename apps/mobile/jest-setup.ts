require("react-native-reanimated").setUpTests()

jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
  wrap: (component: unknown) => component,
  captureException: jest.fn(),
  appLoaded: jest.fn(),
  expoRouterIntegration: () => ({}),
  GlobalErrorBoundary: ({ children }: { children: unknown }) => children,
}))

// The native keyboard module is not linked under Jest; sheets only need a plain View.
jest.mock("react-native-keyboard-controller", () => {
  const { View } = require("react-native")
  return { KeyboardAvoidingView: View }
})
