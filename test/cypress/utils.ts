/* eslint-disable */
import type { CyHttpMessages } from 'cypress/types/net-stubbing'

export type IncomingHttpRequest = CyHttpMessages.IncomingHttpRequest

// https://docs.cypress.io/app/guides/authentication-testing/auth0-authentication
export const auth0Login = () => {
  const options = {
      method: 'POST',
      url: `https://findadoc.jp.auth0.com/oauth/token`,
      body: {
          grant_type: 'password',
          connection: 'Username-Password-Authentication',
          audience: 'findadoc',
          username: Cypress.env('AUTH0_USERNAME'),
          password: Cypress.env('AUTH0_PASSWORD'),
          scope: 'openid profile email',
          client_id: Cypress.env('AUTH0_CLIENTID'),
          client_secret: Cypress.env('AUTH0_CLIENTSECRET'),
      },
  }

  cy.request(options).then((response) => {
      const { body } = response
      const { access_token, id_token } = body

      // Set auth tokens as cookies
      cy.setCookie('auth_token', access_token, {
          domain: 'localhost', // Set explicitly for Cypress
          path: '/',
          httpOnly: false,
          secure: false, // Set to false for local development
          sameSite: 'lax',
          expiry: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
      })

      cy.setCookie('id_token', id_token, {
          domain: 'localhost',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'lax',
          expiry: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
      })

      // Set auth flag
      cy.setCookie('authToken', 'true', {
          domain: 'localhost',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'lax',
          expiry: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
      })

      // Verify cookies were set
      cy.getCookie('auth_token').should('exist')
      cy.getCookie('id_token').should('exist')
      cy.getCookie('authToken').should('exist')

      // Wait a bit to ensure cookies are properly set
      cy.wait(200)
  })
}


  export const aliasQuery = (req: IncomingHttpRequest, operation: string, responseBody: unknown) => {
    /**
    * Check if the GraphQL operation is included in the request body
    **/
  const hasOperation = (req: IncomingHttpRequest, operation: string): boolean => {
    const { query } = req.body
    return query && query.includes(operation)
  }
    /**
     * https://docs.cypress.io/api/commands/intercept#Interception-lifecycle
     *
     * https://docs.cypress.io/api/commands/intercept#cyintercept-and-request-caching
     *
     * Sometimes Cypress.intercept() cannot intercept a request due to the request being cached and not hitting the
     * network layer (where Cypress.intercept() works).
     *
     * To prevent this, we set 'cache-control' to 'no-store', this prevents all the requests to be cached.
     **/
  const preventRequestCache = (req: IncomingHttpRequest) => {
    req.on('before:response', res => {
      // force all API responses to not be cached
      res.headers['cache-control'] = 'no-store'
    })
  }

  preventRequestCache(req)

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
