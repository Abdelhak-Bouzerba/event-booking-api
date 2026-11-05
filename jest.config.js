/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",

  testMatch: ["**/tests/**/*.test.ts"],

  clearMocks: true,

  setupFiles: ["<rootDir>/tests/setup.ts"],

  setupFilesAfterEnv: ["<rootDir>/tests/setupAfterEnv.ts"],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: false,
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "Node",
          isolatedModules: true,
        },
      },
    ],
  },
};
