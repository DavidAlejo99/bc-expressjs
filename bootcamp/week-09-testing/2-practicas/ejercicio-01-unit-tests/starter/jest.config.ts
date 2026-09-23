import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
  clearMocks: true,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // Este ejercicio testea únicamente auth.service.ts (README, criterio de
  // éxito). users.repository.ts se mockea a propósito (nunca corre su
  // implementación real) y jwt.ts tiene funciones fuera de alcance aquí.
  collectCoverageFrom: [
    'src/services/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;
