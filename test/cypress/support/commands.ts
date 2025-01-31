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

// https://docs.cypress.io/app/guides/authentication-testing/auth0-authentication
import { auth0Login } from '../utils'

Cypress.Commands.add('login', () => {
    const auth0UserName = Cypress.env('AUTH0_USERNAME')

    const log = Cypress.log({
        displayName: 'AUTH0_LOGIN',
        message: [`🔐 Authenticating | ${auth0UserName}`],
        autoEnd: false
    })

    log.snapshot('before')

    cy.session(`auth0-${auth0UserName}`, () => {
        auth0Login()
    }, {
        validate: () => {
            // https://auth0.com/docs/manage-users/cookies/authentication-api-cookies
            // https://docs.cypress.io/api/commands/getcookie
            cy.getCookie('auth0', { domain: 'findadoc.jp.auth0.com' }).should('exist')
        },
        cacheAcrossSpecs: true
    })

    log.snapshot('after')
    log.end()
})
