/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  moduleNameMapper: {
    '^context(.*)$': '<rootDir>/src/context$1',
    '^hooks(.*)$': '<rootDir>/src/hooks$1',
    '^hocs(.*)$': '<rootDir>/src/hocs$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',
  },
};
