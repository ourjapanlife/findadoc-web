// ***********************************************
// docs for this file
// https://on.cypress.io/custom-commands
// ***********************************************

import { auth0Login } from '../utils'

Cypress.Commands.add('login', () => {
    const auth0UserName = Cypress.env('AUTH0_USERNAME')
    const log = Cypress.log({
        displayName: 'AUTH0_LOGIN',
        message: [`🔐 Authenticating | ${auth0UserName}`],
        autoEnd: false
    })

    log.snapshot('Connecting to auth0')

    // Generate a unique session ID using timestamp
    const sessionId = `auth0-${auth0UserName}-${Date.now()}`

    // Clear session and localStorage
    cy.clearAllSessionStorage()
    cy.clearAllLocalStorage()

    cy.session(sessionId, () => {
        auth0Login()
    }, {
        validate: () => {
            // Wait for and validate the auth token
            cy.getAllLocalStorage().should(localStorage => {
                const localStorageKeys = Object.values(localStorage).map(store => Object.keys(store)).flat()
                expect(localStorageKeys).to.include('auth_token', 'Auth token not found in localStorage')
            })
        },
        cacheAcrossSpecs: true
    })
    log.snapshot('Successfully logged in')
    log.end()
})
