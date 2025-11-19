import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test: {
        globals: true,
        setupFiles: './tests/setup.ts',
        environment: 'nuxt',
        environmentOptions: {
            nuxt: {
                domEnvironment: 'jsdom'
            }
        },
        include: [
            'tests/vitest/storeTests/**/*.spec.ts',
            'tests/vitest/snapshotTests/**/*.spec.ts'
        ],
        exclude: ['node_modules']
    }
})
