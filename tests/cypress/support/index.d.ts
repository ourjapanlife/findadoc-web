/// <reference types="cypress" />

// https://docs.cypress.io/app/tooling/typescript-support#Types-for-Custom-Commands
declare namespace Cypress {
    interface Chainable {
        login(): Chainable<void>
        skipOnboardingFlow(): Chainable<void>
    }
}
