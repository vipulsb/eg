module.exports = {
  displayName: "client",
  testEnvironment: "jsdom",
  rootDir: "./",
  testMatch: ["<rootDir>/src/client/**/*.spec.(ts|tsx)"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/src/client/setupTests.ts"],
};
