import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test: {
        globals: true,
        environmentOptions: {
            nuxt: {
                domEnvironment: 'jsdom'
            }
        },
        exclude: ['**/*.jest.test.ts', 'node_modules']
    }
})
