import { defineConfig } from 'cypress'

export default defineConfig({
    e2e: {
        // eslint-disable-next-line no-unused-vars
        setupNodeEvents(on, config) {},
        baseUrl: 'http://localhost:3000'
    }
})
