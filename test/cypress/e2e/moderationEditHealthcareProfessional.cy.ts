import 'cypress-real-events'
import 'cypress-plugin-tab'

const FAKE_HEALTHCARE_PROFESSIONAL_RESPONSE_PATH = 'moderation_dashboard/fakeModHealthcareprofessionalData.json'
const AUTH_URL = 'https://findadoc.jp.auth0.com/'
const SITE_URL = 'http://localhost:3000/'

describe('Moderation edit professional healthcare form', () => {
    context('Landscape mode', () => {
    // Before starting the execution, we need to load the fixture data using "this" context of the
    // test object. We need to use regular function() callbacks instead of arrow functions when
    // we need to access the "this" context.
        before(function() {
            cy.fixture(FAKE_HEALTHCARE_PROFESSIONAL_RESPONSE_PATH).then(fakeHealthcareprofessionalResult => {
                this.fakeHealthcareprofessionalResult = fakeHealthcareprofessionalResult
            })

            cy.viewport('macbook-16')
            cy.visit('/login', { timeout: 10000 })
            Cypress.session.clearCurrentSessionData()

            // This intercepts the call to the GraphQL API in order to use fake data in the tests to protect the real data.
            cy.intercept('POST', '**/', req => {
                if (req.body.query && req.body.query.includes('query HealthcareProfessionals')) {
                    req.reply({
                        statusCode: 200,
                        body: this.fakeHealthcareprofessionalResult
                    })
                } else {
                    req.continue()
                }
            }).as('getHealthcareProfessionals')

            cy.origin(AUTH_URL, () => {
                cy.get('input#username').should('be.visible').type('findadoctest@proton.me')
                cy.get('[data-action-button-primary]').should('be.visible').click()
                cy.get('input#password').should('be.visible').type('vCnL5J8agHg6m2f')
                cy.get('[data-action-button-primary]').should('be.visible').click()
            })

            cy.url({ timeout: 10000 }).should('equal', SITE_URL)

            /* Chaining of visit was used here to make sure the user was logged in and that it would
            100 percent visit moderation */
            cy.get('[data-testid=top-nav-mod-link]', { timeout: 10000 }).click().visit('/moderation')

            cy.url({ timeout: 10000 }).should('include', '/moderation')

            cy.wait('@getHealthcareProfessionals', { timeout: 10000 })
            cy.get('[data-testid="submission-type-select"]', { timeout: 10000 }).select('HEALTHCARE_PROFESSIONALS')

            cy.get('[data-testid="mod-healthcare-professional-list-item-1"]', { timeout: 10000 }).click()
        })

        after(() => {
            Cypress.session.clearCurrentSessionData()
        })

        it('contains the following input and select fields', () => {
            cy.get('[data-testid="mod-healthcare-professional-section-lastName"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-firstName"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-middleName"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-name-locale"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-accepted-insurances"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-degrees"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-specialties"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-spoken-locales"]').should('exist')
        })

        it('should be able to type in all input fields', () => {
            cy.get('[data-testid="mod-healthcare-add-name-button"]').click()
            cy.get('[data-testid="mod-healthcare-professional-section-lastName"]').find('input').type('Doe')
            cy.get('[data-testid="mod-healthcare-professional-section-firstName"]').find('input').type('John')
            cy.get('[data-testid="mod-healthcare-professional-section-middleName"]').find('input').type('Johnny')
            cy.get('[data-testid="mod-healthcare-professional-section-name-locale"]').select('en_US')
        })
    })
})
