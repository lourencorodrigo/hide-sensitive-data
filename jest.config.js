module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'd.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!<rootDir>/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/src/@types/'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
}
