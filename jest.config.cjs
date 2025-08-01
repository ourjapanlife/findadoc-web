Object.defineProperty(exports, '__esModule', { value: true })
const config = {
    preset: 'ts-jest/presets/js-with-ts-esm',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\.(ts|js)$': ['ts-jest', { useESM: true }],
        '^.+\\.(svg|png|jpg|jpeg|gif)$': 'jest-transform-stub'
    },
    transformIgnorePatterns: [
        'node_modules/(?!vue-i18n)'
    ],
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/$1',
        '^@/(.*)$': '<rootDir>/$1'
    },
    moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
    snapshotSerializers: ['jest-serializer-vue'],
    extensionsToTreatAsEsm: ['.ts', '.vue'],
    testMatch: ['**/*.jest.test.ts'],
    globals: {
        'ts-jest': {
            useESM: true,
            tsconfig: './tsconfig.json'
        }
    },
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons']
    }
}
exports.default = config
