/**
 * Jest Configuration for The Hobbit Store UI
 * Optimized for DDD architecture and React components
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Test environment
  testEnvironment: 'jest-environment-jsdom',

  // Module name mapping for absolute imports and path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@/application/(.*)$': '<rootDir>/src/application/$1',
    '^@/infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@/store/(.*)$': '<rootDir>/src/store/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/tests/(.*)$': '<rootDir>/src/tests/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
  },

  // Test file patterns
  testMatch: [
    '<rootDir>/src/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/tests/**/*',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],

  // Coverage thresholds for quality gates
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Domain layer should have high coverage
    './src/domain/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    // Application services should have good coverage
    './src/application/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Test timeout
  testTimeout: 10000,

  // Parallel execution
  maxWorkers: '50%',

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Verbose output for better debugging
  verbose: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
