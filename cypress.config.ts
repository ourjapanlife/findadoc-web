import { defineConfig } from 'cypress'

const config = defineConfig({
    projectId: 'brkojt',
    e2e: {
        setupNodeEvents() { },
        // Path to e2e specs folder
        specPattern: './test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        // Path to the fake data
        fixturesFolder: './test/fake_data',
        supportFolder: './test/cypress/support',
        supportFile: './test/cypress/support/e2e.js',
        baseUrl: 'http://localhost:3000',
        testIsolation: false,
        experimentalRunAllSpecs: true,
        requestTimeout: 10000,
        responseTimeout: 30000,
        pageLoadTimeout: 60000
    }
})

export default config
