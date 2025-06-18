import { defineConfig } from 'cypress'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const config = defineConfig({
    projectId: 'brkojt',
    e2e: {
        env: {
            AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
            AUTH0_USERNAME: process.env.AUTH0_USERNAME,
            AUTH0_PASSWORD: process.env.AUTH0_PASSWORD,
            AUTH0_CLIENTID: process.env.AUTH0_CLIENTID,
            AUTH0_CLIENTSECRET: process.env.AUTH0_CLIENTSECRET,
            NUXT_IS_TESTING_MODE: process.env.NUXT_IS_TESTING_MODE
        },
        setupNodeEvents() { },
        // Path to e2e specs folder
        specPattern: './test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        // Path to the fake data
        fixturesFolder: './test/fake_data',
        supportFile: './test/cypress/support/e2e.ts',
        baseUrl: 'http://localhost:3000',
        testIsolation: false,
        experimentalRunAllSpecs: true,
        requestTimeout: 10000,
        responseTimeout: 30000,
        pageLoadTimeout: 60000,
        defaultCommandTimeout: 10000
    }
})

export default config
