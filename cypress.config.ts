import { defineConfig } from 'cypress'

export default defineConfig({
    projectId: 'brkojt',
    e2e: {
        setupNodeEvents() { },
        baseUrl: 'http://localhost:3000'
    }
})
