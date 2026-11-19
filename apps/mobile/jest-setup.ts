require("react-native-reanimated").setUpTests()

// The native keyboard module is not linked under Jest; sheets only need a plain View.
jest.mock("react-native-keyboard-controller", () => {
  const { View } = require("react-native")
  return { KeyboardAvoidingView: View }
})
