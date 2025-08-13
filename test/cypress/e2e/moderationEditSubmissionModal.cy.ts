import fakeSubmissionResponse from '../../fake_data/moderation_dashboard/fakeSubmissionResponse.json'
import { aliasQuery } from '../utils'

before(() => {
    cy.skipOnboardingFlow()
    cy.login()
})

describe('Moderation Edit Submission Modal', () => {
    before(() => {
        cy.viewport('macbook-16')

        cy.intercept('POST', '**/', req => {
            aliasQuery(req, 'query Submissions', fakeSubmissionResponse)
        })

        cy.visit('/moderation')
        cy.wait('@query Submissions')
    })

    context('Landscape mode', () => {
        it('should display modal if user navigates back with unsaved changes', () => {
            cy.get('[data-testid="mod-submission-list-item-1"]').click()

            // When the user clicks the back button on their browser with unsaved changes...
            cy.get('[data-testid="mod-facility-section-nameEn"]').find('input').type('Hospital')
            cy.go('back')
            // ...the modal with the confirmation button should be visible.
            cy.get('[data-testid="submission-form-modal"]').should('be.visible')
            // When the user clicks the confirmation button on the modal...
            cy.get('[data-testid="submission-unsaved-confirmation-btn"]').click()
            // ...they should be navigated back to the moderation screen.
            cy.location('pathname').should('eq', '/moderation')
        })

        it.skip('should not display modal if user navigates back without making changes', () => {
            cy.get('[data-testid="mod-submission-list-item-1"]').click()

            // When the user clicks the back button on their browser without making changes...
            cy.go('back')
            // ...the modal with the confirmation button should not exist...
            cy.get('[data-testid="submission-form-modal"]').should('not.exist')
            // ... and they should be navigated back to the moderation screen.
            cy.location('pathname').should('eq', '/moderation')
        })
    })
})
