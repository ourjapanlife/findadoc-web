// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getElement', (element: string) => {
    cy.get(`[data-testid="${element}"]`)
})

Cypress.Commands.add('moderationLogin', (clearSessionData = false) => {
    if (clearSessionData) {
        // Clear all Session data for a fresh login
        Cypress.session.clearCurrentSessionData()
        Cypress.session.clearAllSavedSessions()
    }

    cy.session('Moderation Login Session', () => {
        cy.visit('/login')

        cy.origin('https://findadoc.jp.auth0.com/', () => {
            cy.get('input#username').type('findadoctest@proton.me')
            cy.get('[data-action-button-primary]').click()
            cy.get('input#password').type('vCnL5J8agHg6m2f')
            cy.get('[data-action-button-primary]').click()
        })
        cy.get('[data-testid=top-nav-mod-link]').click()
        // Save the session across specs
    }, { cacheAcrossSpecs: true })

    cy.visit('moderation')
})
