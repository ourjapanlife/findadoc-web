import { defineConfig } from 'cypress'

export default defineConfig({
    projectId: 'findadoc-web',
    e2e: {
        setupNodeEvents() { },
        baseUrl: 'http://localhost:3000',
        testIsolation: false,
        env: {
            ENABLE_MODERATION_PANEL: true,
        },
    },
    viewportHeight: 927,
    viewportWidth: 1600
})
