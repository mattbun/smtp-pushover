// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  // Reset mocks between tests
  clearMocks: true,

  // We no longer collect coverage by default; use `--coverage` CLI flag when you want it
  coverageProvider: 'v8',

  // Look for tests in any .test.ts/.spec.ts or __tests__ folder
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],

  // Ignore dependencies and build outputs
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],

  // Transform TypeScript via ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // File extensions Jest will resolve
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Run in Node.js environment
  testEnvironment: 'node',

  // Show each test file’s results
  verbose: true,
};

export default config;
