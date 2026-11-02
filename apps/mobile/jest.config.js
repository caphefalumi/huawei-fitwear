module.exports = {
  preset: "jest-expo",
  testTimeout: 15000,
  testMatch: ["<rootDir>/tests/**/*.test.[jt]s?(x)"],
  transformIgnorePatterns: [
    "node_modules/(?!(.bun|(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg))",
  ],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  clearMocks: true,
  restoreMocks: true,
};
