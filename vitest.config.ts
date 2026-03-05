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
            'tests/vitest/**/*.spec.ts'
        ],
        exclude: ['node_modules']
    }
})
