require("react-native-reanimated").setUpTests()

jest.mock("expo-observe", () => ({
  Observe: { reportError: jest.fn() },
  useObserve: () => ({ markInteractive: jest.fn() }),
}))
