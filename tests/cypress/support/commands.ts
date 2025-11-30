// ***********************************************
// docs for this file
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to set onboarding state to completed
import { auth0Login } from '../utils'

Cypress.Commands.add('skipOnboardingFlow', () => {
    cy.window().then(win => {
        win.localStorage.setItem('onboardingState', '"completed"')
    })
})

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

    // Clear session and cookies
    cy.clearAllSessionStorage()
    cy.clearAllCookies()

    cy.session(sessionId, () => {
        auth0Login()
    }, {
        validate: () => {
            // Wait for and validate the auth token
            cy.getCookies().then(cookies => {
                const cookieNames = cookies.map(cookie => cookie.name)
                expect(cookieNames).to.include('auth_token', 'Auth token not found in cookies')
                expect(cookieNames).to.include('authToken', 'Auth token flag not found in cookies')
            })
        },
        cacheAcrossSpecs: true
    })
    log.snapshot('Successfully logged in')
    log.end()
})
