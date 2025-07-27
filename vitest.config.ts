import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test: {
        globals: true,
        setupFiles: './test/setup.ts',
        environment: 'nuxt',
        environmentOptions: {
            nuxt: {
                domEnvironment: 'jsdom'
            }
        },
        exclude: ['**/*.jest.test.ts', 'node_modules']
    }
})
