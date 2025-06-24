import enUS from '../../../i18n/locales/en.json'
import fakeHealthcareProfessionalResult from '../../fake_data/moderation_dashboard/fakeModHealthcareProfessionalData.json'
import { aliasQuery } from '../utils'

before(() => {
    cy.skipOnboardingFlow()
    cy.login()
})

describe('Moderation create healthcare professional button', () => {
    context('Landscape mode', () => {
        before(() => {
            cy.visit('/moderation')
        })

        it('does not appear when not in the healthcare professional section', () => {
            cy.get('[data-testid="submission-type-select"]').select('FACILITIES')
            cy.get('[data-testid="add-hp-button"]').should('not.exist')
        })

        it('does appear when in the healthcare professional section', () => {
            cy.get('[data-testid="submission-type-select"]').select('HEALTHCARE_PROFESSIONALS')
            cy.get('[data-testid="add-hp-button"]').should('exist')
        })
    })
})

describe('Moderation create healthcare professional form', () => {
    context('Landscape mode', () => {
        beforeEach(() => {
            cy.skipOnboardingFlow()
            cy.intercept('POST', '**/', req => {
                if (req.body.operationName === 'HealthcareProfessionalSearchFilters') {
                    aliasQuery(req, 'HealthcareProfessionalSearchFilters', fakeHealthcareProfessionalResult)
                }
            }).as('HealthcareProfessionalSearchFilters')

            cy.viewport('macbook-16')

            cy.visit('/moderation')

            cy.get('[data-testid="submission-type-select"]').select('HEALTHCARE_PROFESSIONALS')

            cy.get('[data-testid="add-hp-button"]').should('exist').click()
        })

        it('contains the following buttons and text in the topbar', () => {
            cy.get('[data-testid="mod-create-facility-hp-topbar-create"]').should('exist')
                .contains(enUS.modCreateFacilityOrHPTopbar.create)
            cy.get('[data-testid="mod-create-facility-hp-topbar-exit"]').should('exist')
                .contains(enUS.modCreateFacilityOrHPTopbar.exit)
        })

        it('contains the following input fields', () => {
            cy.get('[data-testid="mod-healthcare-add-name-button"]').click()
            cy.get('[data-testid="mod-healthcare-professional-section-lastName"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-firstName"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-middleName"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-name-locale"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-close-name-section"]').click()
            cy.get('[data-testid="mod-healthcare-professional-section-accepted-insurances"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-degrees"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-specialties"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-spoken-locales"]').should('exist')
            cy.get('[data-testid="mod-healthcare-professional-section-facilities"]').should('exist')
        })

        it('should be able to create names for multiple locales', () => {
            cy.get('[data-testid="mod-healthcare-add-name-button"]').click()
            cy.get('[data-testid="mod-healthcare-professional-section-lastName"]').find('input').type('Doe')
            cy.get('[data-testid="mod-healthcare-professional-section-firstName"]').find('input').type('John')
            cy.get('[data-testid="mod-healthcare-professional-section-middleName"]').find('input').type('Jack')
            cy.get('[data-testid="mod-healthcare-professional-section-name-locale"]').select('en_US')
            cy.get('[data-testid="mod-healthcare-professional-section-save-name"]').click()
            cy.get('[data-testid="mod-healthcare-add-name-button"]').click()
            cy.get('[data-testid="mod-healthcare-professional-section-lastName"]').find('input').clear().type('ドー')
            cy.get('[data-testid="mod-healthcare-professional-section-firstName"]').find('input').clear().type('ジョン')
            cy.get('[data-testid="mod-healthcare-professional-section-middleName"]').find('input').clear().type('ジャック')
            cy.get('[data-testid="mod-healthcare-professional-section-name-locale"]').select('ja_JP')
            cy.get('[data-testid="mod-healthcare-professional-section-save-name"]').click()
            cy.get('[data-testid="healthcare-professional-card-last-name"]').eq(0).should('have.text', 'Doe')
            cy.get('[data-testid="healthcare-professional-card-last-name"]').eq(1).should('have.text', 'ドー')
            cy.get('[data-testid="healthcare-professional-name-card-locale"]').eq(0).should('have.text', 'English')
            cy.get('[data-testid="healthcare-professional-name-card-locale"]').eq(1).should('have.text', '日本語')
        })

        it('should update the store when fields are selected', () => {
            cy.get('[data-testid="mod-healthcare-professional-section-accepted-insurances"]').find('input')
                .type('INSURANCE_NOT_ACCEPTED')
            cy.get('[data-testid="mod-search-bar-search-result"]').eq(0).click()
            cy.get('[data-testid="mod-healthcare-professional-section-degrees"]').find('input').type('PharmD')
            cy.get('[data-testid="mod-search-bar-search-result"]').eq(0).click()
            cy.get('[data-testid="mod-healthcare-professional-section-specialties"]').find('input').type('ANESTHESIOLOGY')
            cy.get('[data-testid="mod-search-bar-search-result"]').eq(0).click()
            cy.get('[data-testid="mod-healthcare-professional-section-spoken-locales"]').find('input').type('English')
            cy.get('[data-testid="mod-search-bar-search-result"]').eq(0).click()
            cy.window().then(win => {
                const store = win.$pinia.state.value.healthcareProfessionalsStore
                expect(store.createHealthcareProfessionalSectionFields.acceptedInsurance as [])
                    .to.include('INSURANCE_NOT_ACCEPTED')
                expect(store.createHealthcareProfessionalSectionFields.degrees)
                    .to.include('PharmD')
                expect(store.createHealthcareProfessionalSectionFields.specialties)
                    .to.include('ANESTHESIOLOGY')
                expect(store.createHealthcareProfessionalSectionFields.spokenLanguages)
                    .to.include('en_US')
            })
        })
    })
})
