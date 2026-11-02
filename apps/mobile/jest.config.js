module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/tests/**/*.test.[jt]s?(x)"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  clearMocks: true,
  restoreMocks: true,
};
