export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['<rootDir>/auto-qa/'],
    testMatch: ['**/src/**/*.test.ts'],
};
