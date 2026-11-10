module.exports = {
  preset: "jest-expo",
  resolver: "react-native-reanimated/jest/resolver",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  testTimeout: 15000,
  testMatch: ["<rootDir>/src/**/*.test.[jt]s?(x)", "<rootDir>/tests/**/*.test.[jt]s?(x)"],
  transformIgnorePatterns: [
    "node_modules/(?!(.bun|(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg))",
  ],
  moduleNameMapper: {
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
    "^@/tests/(.*)$": "<rootDir>/tests/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  clearMocks: true,
  restoreMocks: true,
}
