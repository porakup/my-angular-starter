module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup-jest.ts'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text-summary', 'html'],
  collectCoverageFrom: [
    'src/app/app.component.ts',
    'src/app/app.interceptor.ts',
    'src/app/app.translate.ts',
    'src/components/**/*.ts',
    'src/router/**/*.ts',
    '!src/router/main.route.ts',
    'src/services/**/*.ts',
    'src/utils/**/*.ts',
    'src/pages/**/*.ts',
  ],
};
