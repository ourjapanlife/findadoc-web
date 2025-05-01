import fakeHealthcareProfessionalResult from '../../fake_data/moderation_dashboard/fakeModHealthcareProfessionalData.json'
import { aliasQuery } from '../utils'
import enUS from '../../../i18n/locales/en.json'

before(() => {
    cy.login()
})

describe('Moderation edit professional healthcare form', () => {
    context('Landscape mode', () => {
        before(() => {
            cy.viewport('macbook-16')

            cy.intercept('POST', '**/', req => {
                aliasQuery(req, 'HealthcareProfessionalSearchFilters', fakeHealthcareProfessionalResult)
            })

            cy.visit('/moderation')

            cy.wait('@HealthcareProfessionalSearchFilters')

            cy.get('[data-testid="submission-type-select"]').select('HEALTHCARE_PROFESSIONALS')
            cy.get('[data-testid="mod-healthcare-professional-list-item-1"]').click()
        })

        beforeEach(() => {
            cy.viewport('macbook-16')
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

        it('contains the following fields and buttons in the topbar', () => {
            cy.get('[data-testid="mod-edit-facility-hp-topbar-update"]').should('exist')
                .contains(enUS.modEditFacilityOrHPTopbar.updateAndExit)
            cy.get('[data-testid="mod-edit-facility-hp-topbar-delete"]').should('exist')
                .contains(enUS.modEditFacilityOrHPTopbar.delete)
            cy.get('[data-testid="mod-edit-facility-hp-topbar-copy-id"]').should('exist')
        })

        it('should disable topbar update button when no changes have been made', () => {
            cy.get('[data-testid="mod-edit-facility-hp-topbar-update"]').should('be.disabled')
        })

        it('should disable topbar update button when changes have been reverted', () => {
            cy.get('[data-testid="mod-healthcare-professional-section-degrees"]').clear().type('DVM')
            cy.get('[data-testid="mod-search-bar-search-result"]').first().click()
            cy.get('[data-testid="mod-edit-facility-hp-topbar-update"]').should('be.enabled')
            cy.get('[data-testid="mod-healthcare-professional-section-degrees"]').clear().type('DVM')
            cy.get('[data-testid="mod-search-bar-search-result"]').first().click()
            cy.get('[data-testid="mod-edit-facility-hp-topbar-update"]').should('be.disabled')
        })

        it('should enable topbar update button when changes have been made', () => {
            cy.get('[data-testid="mod-healthcare-professional-section-degrees"]').clear().type('DVM')
            cy.get('[data-testid="mod-search-bar-search-result"]').first().click()
            cy.get('[data-testid="mod-edit-facility-hp-topbar-update"]').should('be.enabled')
        })
    })
})
