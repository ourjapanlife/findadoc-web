import enUS from '../../../i18n/locales/en.json'
import fakeSubmissionResponse from '../../fake_data/moderation_dashboard/fakeSubmissionResponse.json'
import { aliasQuery } from '../utils'

before(() => {
    cy.skipOnboardingFlow()
    // Avoid real Auth0 login during CI runs unless explicitly enabled.
    if (Cypress.env('RUN_MODERATION') === 'true') {
        cy.login()
    }
})

describe.skip('Moderation dashboard', () => {
    before(() => {
        cy.intercept('POST', '**/', req => {
            aliasQuery(req, 'query Submissions', fakeSubmissionResponse)
        })

        cy.visit('/moderation')
        cy.wait('@query Submissions')
    })

    context('Landscape mode', () => {
        beforeEach(() => {
            cy.skipOnboardingFlow()
            cy.viewport('macbook-16')
        })

        /* TO DO: This needs to be updated due to the way we return data now and the fact that we do not have these actual counts.
          We currently only send total count*/
        it.skip('shows mod dashboard left navbar buttons with correct counts and functionality', () => {
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
