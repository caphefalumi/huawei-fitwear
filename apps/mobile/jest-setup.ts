require("react-native-reanimated").setUpTests()

// The native keyboard module is not linked under Jest; sheets only need a plain View.
jest.mock("react-native-keyboard-controller", () => {
  const { View } = require("react-native")
  return { KeyboardAvoidingView: View }
})

// Gesture worklets require a native UI runtime; photo tests exercise viewer state, not touch input.
jest.mock("react-native-gesture-handler", () => {
  const { View } = require("react-native")
  return {
    GestureHandlerRootView: View,
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    usePanGesture: jest.fn(),
    usePinchGesture: jest.fn(),
    useSimultaneousGestures: jest.fn(),
  }
})
