/* eslint-disable no-restricted-properties */

// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// import { generateSubmissions, generateFacilities, generateProfessionals } from '../../fake_data/moderation_dashboard'
// import type { QueryOrUrl } from './types'
// import { updateSubmissionInput } from './utils'

// const queryOrUrl: QueryOrUrl = {
//     'query Facilities': { data: { facilities } },
//     'query Submissions': { data: { submissions } },
//     'healthcareProfessionals(filters: $filters)': { data: { healthcareProfessionals: professionals } },
//     'mutation Mutation($id: ID!, $input: UpdateSubmissionInput!)': updateSubmissionInput
// }

// beforeEach(() => cy.interceptQueryOrUrl(queryOrUrl))

import type { StartOptions } from 'msw/browser'
import { worker } from '~/test/fake_backend/browser'
import routines from '~/test/fake_backend/routines'

const startWorker = () => {
    Cypress.on('test:before:run', () => {
        // Worker configuration
        const options: StartOptions = {
            onUnhandledRequest(request, print) {
                // Disable console warning for assets requests
                if (request.url.includes('/_nuxt')) return

                // Console log warning for unhandled requests
                print.warning()
            }
        }
        worker.start(options)
        routines.submission.populate.underReview(5)
    })

    // Disable get fetch logging for the spec run
    before(() => {
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
    })
}

if (Cypress.env('FAKE_DATA')) startWorker()

