import enUS from '../../../i18n/locales/en.json'
import fakeSubmissionResponse from '../../fake_data/moderation_dashboard/fakeSubmissionResponse.json'
import { aliasQuery } from '../utils'

before(() => {
    cy.login()
})

describe('Moderation dashboard', () => {
    before(() => {
        cy.intercept('POST', '**/', req => {
            aliasQuery(req, 'query Submissions', fakeSubmissionResponse)
        })

        cy.visit('/moderation')
        cy.wait('@query Submissions')
    })

    context('Landscape mode', () => {
        beforeEach(() => {
            cy.viewport('macbook-16')
        })

        it('shows mod dashboard left navbar buttons with correct counts and functionality', () => {
            // The number for include text is for the status in the fake data.
            cy.get('[data-testid=mod-dashboard-leftnav-for-review]')
                .should('exist')
                .should(
                    'include.text',
                    enUS.modDashboardLeftNav.forReview
                )
                .should(
                    'include.text',
                    '1'
                )

            cy.get('[data-testid=mod-dashboard-leftnav-approved]')
                .should('exist')
                .should(
                    'include.text',
                    enUS.modDashboardLeftNav.approved
                )
                .should(
                    'include.text',
                    '1'
                )

            cy.get('[data-testid=mod-dashboard-leftnav-rejected]')
                .should('exist')
                .should(
                    'include.text',
                    enUS.modDashboardLeftNav.rejected
                )
                .should(
                    'include.text',
                    '0'
                )

            cy.get('[data-testid="mod-submission-list-item-1"]').should('exist')

            cy.get('[data-testid=mod-dashboard-leftnav-approved]')
                .click()

            cy.get('[data-testid="mod-submission-list-item-1"]').should('exist')

            cy.get('[data-testid=mod-dashboard-leftnav-rejected]')
                .click()

            cy.get('[data-testid="mod-submission-list-item-1"]').should('not.exist')

            cy.get('[data-testid=mod-dashboard-leftnav-for-review]')
                .click()

            cy.get('[data-testid="mod-submission-list-item-1"]').should('exist')
        })

        it('toggle between submissions and healthcare professionals submissions', () => {
            cy.get('[data-testid="mod-healthcare-professional-list-item-1"]').should('not.exist')
            cy.get('[data-testid="mod-facility-list-item-1"]').should('not.exist')
            cy.get('[data-testid="mod-submission-list-item-1').should('exist')

            cy.get('[data-testid="submission-type-select"]').select('FACILITIES')
            cy.get('[data-testid="mod-healthcare-professional-list-item-1"]').should('not.exist')
            cy.get('[data-testid="mod-facility-list-item-1"]').should('exist')
            cy.get('[data-testid="mod-submission-list-item-1').should('not.exist')

            cy.get('[data-testid="submission-type-select"]').select('HEALTHCARE_PROFESSIONALS')
            cy.get('[data-testid="mod-healthcare-professional-list-item-1"]').should('exist')
            cy.get('[data-testid="mod-facility-list-item-1"]').should('not.exist')
            cy.get('[data-testid="mod-submission-list-item-1').should('not.exist')

            cy.get('[data-testid="submission-type-select"]').select('SUBMISSIONS')
            cy.get('[data-testid="mod-healthcare-professional-list-item-1"]').should('not.exist')
            cy.get('[data-testid="mod-facility-list-item-1"]').should('not.exist')
            cy.get('[data-testid="mod-submission-list-item-1').should('exist')
        })

        it('it shows the moderation top nav', () => {
            cy.get('[data-testid="mod-submission-list-item-1"]').click()
            cy.get('[data-testid="mod-edit-submission-copy-submission-id"]').click()

            // Check that the value copied to the clipboard is the same that's displayed.
            const clipboardResult = cy.window().then(win => win.navigator.clipboard.readText())

            // The timeout is to give time for the clipboard to be read.
            clipboardResult.should('exist', 10000)
        })
    })
})

describe('Moderation Reject Submission', () => {
    before(function() {
        cy.fixture(FAKE_SUBMISSION_RESPONSE_PATH).then(fakeSubmissionResponse => {
            this.fakeSubmissionResponse = fakeSubmissionResponse
        })
    })

    context('Landscape mode', () => {
        before(function() {
            cy.viewport('macbook-16')

            cy.visit('/login', { timeout: 10000 })
            Cypress.session.clearCurrentSessionData()

            // This intercepts the call to the graphQL api in order to use fake data in the tests to protect
            // the real data.
            cy.intercept('POST', '**/', req => {
                if (req.body.query && req.body.query.includes('query Submissions')) {
                    req.reply({
                        statusCode: 200,
                        body: this.fakeSubmissionResponse
                    })
                } else {
                    req.continue()
                }
            }).as('getSubmissions')

            cy.origin('https://findadoc.jp.auth0.com/', () => {
                cy.get('input#username').should('be.visible').type('findadoctest@proton.me')
                cy.get('[data-action-button-primary]').should('be.visible').click()
                cy.get('input#password').should('be.visible').type('vCnL5J8agHg6m2f')
                cy.get('[data-action-button-primary]').should('be.visible').click()
            })

            cy.url({ timeout: 10000 }).should('equal', 'http://localhost:3000/')

            cy.get('[data-testid=top-nav-mod-link]', { timeout: 10000 }).click().visit('/moderation')

            cy.url({ timeout: 10000 }).should('include', '/moderation')

            cy.wait('@getSubmissions', { timeout: 10000 })

            cy.get('[data-testid="mod-submission-list-item-1"]', { timeout: 10000 }).click()
        })

        after(() => {
            // Session data is cleared again so it does not affect following tests.
            Cypress.session.clearCurrentSessionData()
        })

        it('should display confirmation modal if user clicks the reject button', () => {
            // When the user clicks the reject button for a submission...
            cy.get('[data-testid="mod-edit-submission-reject-button"]').click()
            // ...the modal with the confirmation button should be visible.
            cy.get('[data-testid="reject-confirmation"]').should('be.visible')
            // When the user clicks the confirmation button on the modal...
            cy.get('[data-testid="reject-submission-confirmation-btn"]').click()
            // ...they should be navigated back to the moderation screen.
            cy.location('pathname').should('eq', '/moderation')
        })
    })
})
