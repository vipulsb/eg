module.exports = {
  displayName: "client",
  testEnvironment: "jsdom",
  rootDir: "./",
  testMatch: ["<rootDir>/src/client/**/*.spec.(ts|tsx)"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ['<rootDir>/src/client/setupTests.ts']
  // moduleNameMapper: {
  //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  //   '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  // },
};
