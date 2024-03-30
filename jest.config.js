module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^@root/(.*)$": "<rootDir>/src/$1",
    "^@test/(.*)$": "<rootDir>/tests/$1",
  },
};
