import { defineConfig } from 'cypress'

export default defineConfig({
    projectId: 'brkojt',
    e2e: {
        setupNodeEvents() { },
        baseUrl: 'http://localhost:3000',
        testIsolation: false,
        experimentalRunAllSpecs: true,
        requestTimeout: 10000,
        responseTimeout: 30000,
        pageLoadTimeout: 60000
    }
})
