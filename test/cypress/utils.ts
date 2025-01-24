import type { CyHttpMessages } from 'cypress/types/net-stubbing'

export type IncomingHttpRequest = CyHttpMessages.IncomingHttpRequest

// https://docs.cypress.io/app/guides/authentication-testing/auth0-authentication
export const auth0Login = () => {
    cy.visit('/login')
    cy.origin(Cypress.env('AUTH0_DOMAIN'), () => {
        const auth0UserName = Cypress.env('AUTH0_USERNAME')
        const auth0Password = Cypress.env('AUTH0_PASSWORD')

        cy.get('input#username').type(auth0UserName)
        cy.get('[data-action-button-primary]').click()
        cy.get('input#password').type(auth0Password)
        cy.get('[data-action-button-primary]').click()
    })

    const baseUrl = `${Cypress.config().baseUrl}/`

    cy.url().should('equal', baseUrl)
}

// https://docs.cypress.io/api/commands/intercept#Interception-lifecycle
export const requestHandler = (req: IncomingHttpRequest) => {
    req.on('before:response', res => {
        // force all API responses to not be cached
        res.headers['cache-control'] = 'no-store'
    })
}

// https://docs.cypress.io/app/guides/network-requests#Working-with-GraphQL
export const aliasQuery = (req: IncomingHttpRequest, operation: string, responseBody: unknown) => {
    requestHandler(req)

    if (!hasOperation(req, operation)) {
        req.continue()
        return
    }

    req.alias = operation

    req.reply({
        statusCode: 200,
        body: responseBody
    })
}

export const hasOperation = (req: IncomingHttpRequest, operation) => {
    const { query } = req.body
    return query && query.includes(operation)
}
