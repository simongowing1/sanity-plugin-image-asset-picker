export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.test.json',
            jsx: 'react-jsx',
            isolatedModules: true
        }]
    },
    transformIgnorePatterns: [
        'node_modules/(?!(sanity)/)'
    ],
    testEnvironmentOptions: {
        customExportConditions: ['react-native']
    }
}; 