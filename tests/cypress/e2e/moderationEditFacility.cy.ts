import type { StateTree } from 'pinia'
import enUS from '../../../i18n/locales/en.json'
import fakeFacilityResult from '../../fake_data/moderation_dashboard/fakeModFacilityData.json'
import fakeHealthcareProfessionalResult from '../../fake_data/moderation_dashboard/fakeModHealthcareProfessionalData.json'
import { aliasQuery } from '../utils'

let facilitiesStore: StateTree

before(() => {
    cy.skipOnboardingFlow()
    // Avoid performing Auth0 login by default to prevent remote failures.
    if (Cypress.env('RUN_MODERATION') === 'true') {
        cy.login()
    }
})

describe.skip('Moderation edit facility form', () => {
    context('Landscape mode', () => {
        before(() => {
            cy.intercept('POST', '**/', req => {
                aliasQuery(req, 'query Facilities', fakeFacilityResult)
            })

            cy.visit('/moderation')

            cy.wait('@query Facilities')

            cy.get('[data-testid="submission-type-select"]').select('FACILITIES')
            cy.get('[data-testid="mod-facility-list-item-1"]').click()

            /* This will set the facilities stores or any other stores you need to access for testings.
                This NEEDS to be in the describe and not the login before*/
            cy.window().then(win => {
                facilitiesStore = win.$pinia.state.value.facilitiesStore
            })
        })

        beforeEach(() => {
            cy.viewport('macbook-16')
        })

        it('contains the following fields and buttons in the topbar', () => {
            cy.get('[data-testid="mod-edit-facility-hp-topbar-update"]').should('exist')
                .contains(enUS.modEditFacilityOrHPTopbar.updateAndExit)
            cy.get('[data-testid="mod-edit-facility-hp-topbar-delete"]').should('exist')
                .contains(enUS.modEditFacilityOrHPTopbar.delete)
            cy.get('[data-testid="mod-edit-facility-hp-topbar-copy-id"]').should('exist')
        })

        it('it copies the selected id', () => {
            cy.get('[data-testid="mod-edit-facility-hp-topbar-copy-id"]').click()

            // Check that the value copied to the clipboard is the same that's displayed.
            const clipboardResult = cy.window().then(win => win.navigator.clipboard.readText())

            // The timeout is to give time for the clipboard to be read.
            clipboardResult.should('exist', 10000)
        })

        it('contains the following input fields', () => {
            cy.get('[data-testid="mod-facility-section-nameEn"]').should('exist')
            cy.get('[data-testid="mod-facility-section-nameJa"]').should('exist')
            cy.get('[data-testid="mod-facility-section-phone"]').should('exist')
            cy.get('[data-testid="mod-facility-section-email"]').should('exist')
            cy.get('[data-testid="mod-facility-section-website"]').should('exist')
            cy.get('[data-testid="mod-facility-section-postalCode"]').should('exist')
            cy.get('[data-testid="mod-facility-section-cityEn"]').should('exist')
            cy.get('[data-testid="mod-facility-section-addressLine1En"]').should('exist')
            cy.get('[data-testid="mod-facility-section-addressLine2En"]').should('exist')
            cy.get('[data-testid="mod-facility-section-cityJa"]').should('exist')
            cy.get('[data-testid="mod-facility-section-addressLine1Ja"]').should('exist')
            cy.get('[data-testid="mod-facility-section-addressLine2Ja"]').should('exist')
            cy.get('[data-testid="mod-facility-section-google-maps"]').should('exist')
            cy.get('[data-testid="mod-facility-section-mapLatitude"]').should('exist')
            cy.get('[data-testid="mod-facility-section-mapLongitude"]').should('exist')
            cy.get('[data-testid="mod-facility-section-doctor-search"]').should('exist')
        })

        it('should contain the following select field', () => {
            cy.get('[data-testid="mod-facility-section-prefectureEn"]').should('exist')
            cy.get('[data-testid="mod-facility-section-prefectureJa"]').should('exist')
        })

        it('should autofill all the form fields for an existing facility', () => {
            cy.get('[data-testid="mod-facility-section-nameEn"]')
                .find('input').should('have.value', fakeFacilityResult.data.facilities[0].nameEn)
            cy.get('[data-testid="mod-facility-section-nameJa"]')
                .find('input').should('have.value', fakeFacilityResult.data.facilities[0].nameJa)
            cy.get('[data-testid="mod-facility-section-phone"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.phone)
            cy.get('[data-testid="mod-facility-section-email"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.email)
            cy.get('[data-testid="mod-facility-section-website"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.website)
            cy.get('[data-testid="mod-facility-section-postalCode"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.address.postalCode)
            cy.get('[data-testid="mod-facility-section-cityEn"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.address.cityEn)
            cy.get('[data-testid="mod-facility-section-addressLine1En"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.address.addressLine1En)
            cy.get('[data-testid="mod-facility-section-addressLine2En"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.address.addressLine2En)
            cy.get('[data-testid="mod-facility-section-cityJa"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.address.cityJa)
            cy.get('[data-testid="mod-facility-section-addressLine1Ja"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.address.addressLine1Ja)
            cy.get('[data-testid="mod-facility-section-addressLine2Ja"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.address.addressLine2Ja)
            cy.get('[data-testid="mod-facility-section-google-maps"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].contact.googleMapsUrl)
            cy.get('[data-testid="mod-facility-section-mapLatitude"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].mapLatitude)
            cy.get('[data-testid="mod-facility-section-mapLongitude"]').find('input')
                .should('have.value', fakeFacilityResult.data.facilities[0].mapLongitude)
        })

        it('should be able to type in all input fields and update the store values', () => {
            cy.get('[data-testid="mod-facility-section-nameEn"]').find('input').clear().type('Hospital')
            cy.get('[data-testid="mod-facility-section-nameJa"]').find('input').clear().type('ヒー 荒美 Sakura-3')
            cy.get('[data-testid="mod-facility-section-phone"]').find('input').clear().type('08080939393')
            cy.get('[data-testid="mod-facility-section-email"]').find('input').clear().type('example@mail.com')
            cy.get('[data-testid="mod-facility-section-website"]').find('input').clear().type('http://example.com')
            cy.get('[data-testid="mod-facility-section-postalCode"]').find('input').clear().type('180-0000')
            cy.get('[data-testid="mod-facility-section-cityEn"]').find('input').clear().type('Shibuya')
            cy.get('[data-testid="mod-facility-section-addressLine1En"]').find('input').clear().type('some address line 1')
            cy.get('[data-testid="mod-facility-section-addressLine2En"]').find('input').clear().type('some address line 2')
            cy.get('[data-testid="mod-facility-section-cityJa"]').find('input').clear().type('渋谷区')
            cy.get('[data-testid="mod-facility-section-addressLine1Ja"]').find('input').clear().type('道の駅')
            cy.get('[data-testid="mod-facility-section-addressLine2Ja"]').find('input').clear().type('道の')
            //The typing is split into three due to our linting rules of length
            cy.get('[data-testid="mod-facility-section-google-maps"]')
                .find('input').clear()
                .type('www.google.com/maps/place/82+Yamatech%C5%8D,+Naka+Ward,+Yokohama,+Kanagawa+231-0862,')
                .type('+Japan/@35.437123,139.651471,16z/data=!4m6!3m5!1s0x60185d201648e7c1:0x8f37d37bb381e29!8m2!3d35')
                .type('.4371228!4d139.6514712!16s%2Fg%2F11clpxxvx5?hl=en-US&entry=ttu')
            cy.get('[data-testid="mod-facility-section-doctor-search"]').find('input').clear().type('Aya Yumino')
        })

        it('should have updated the store values', () => {
            expect(facilitiesStore.facilitySectionFields.nameEn).to.equal('Hospital')
            expect(facilitiesStore.facilitySectionFields.nameJa).to.equal('ヒー 荒美 Sakura-3')
            expect(facilitiesStore.facilitySectionFields.phone).to.equal('08080939393')
            expect(facilitiesStore.facilitySectionFields.email).to.equal('example@mail.com')
            expect(facilitiesStore.facilitySectionFields.website).to.equal('http://example.com')
            expect(facilitiesStore.facilitySectionFields.postalCode).to.equal('180-0000')
            expect(facilitiesStore.facilitySectionFields.cityEn).to.equal('Shibuya')
            expect(facilitiesStore.facilitySectionFields.addressLine1En).to.equal('some address line 1')
            expect(facilitiesStore.facilitySectionFields.addressLine2En).to.equal('some address line 2')
            expect(facilitiesStore.facilitySectionFields.cityJa).to.equal('渋谷区')
            expect(facilitiesStore.facilitySectionFields.addressLine1Ja).to.equal('道の駅')
            expect(facilitiesStore.facilitySectionFields.addressLine2Ja).to.equal('道の')
        })

        it('should be able to select a field', () => {
            cy.get('[data-testid="mod-facility-section-prefectureEn"]').select('Hokkaido')
            cy.get('[data-testid="mod-facility-section-prefectureJa"]').select('北海道')
        })

        it('should be able to add a professional that matches by id', () => {
            cy.window().then(win => {
                win.$pinia.state.value.healthcareProfessionalsStore.healthcareProfessionalsData
                    = fakeHealthcareProfessionalResult.data.healthcareProfessionals
            })
            cy.get('[data-testid="mod-facility-section-doctor-search"]').find('input').clear().type('UTF8YaYa')
            cy.get('[data-testid="mod-search-bar-search-result"]').click()
            cy.get('[data-testid="healthcare-professional-card-0"]').should('exist')
        })

        it('should be able to add a professional that matches by name', () => {
            cy.get('[data-testid="mod-facility-section-doctor-search"]').find('input').clear().type('Bert')
            cy.get('[data-testid="mod-search-bar-search-result"]').click()
            cy.get('[data-testid="healthcare-professional-card-1"]').should('exist')
        })

        it('should be able to remove just one professional that was added out of 2 added', () => {
            cy.get('[data-testid="mod-facility-section-doctor-search"]').find('input').clear().type('Bert')
            cy.get('[data-testid="mod-search-bar-search-result"]').click()
            cy.get('[data-testid="healthcare-professional-card-0"]').should('exist')
            cy.get('[data-testid="healthcare-professional-card-1"]').should('not.exist')
        })

        it('should display message for no healthcareprofessional found', () => {
            cy.get('[data-testid="mod-facility-section-doctor-search"]').find('input').clear().type('aaa'.repeat(50))
            cy.get('[data-testid="mod-search-bar-search-no-match"]').should('exist')
            cy.get('[data-testid="mod-search-bar-search-no-match"]')
                .contains(enUS.modFacilitySection.noHealthcareProfessionalFound)
        })

        it('should be display error messages', () => {
            cy.get('[data-testid="mod-facility-section-nameEn"]').find('input').clear().type('立川中央病院').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-nameEn"]').find('p')
                .should('exist')
                .contains('Invalid English Name')

            cy.get('[data-testid="mod-facility-section-nameJa"]')
                .find('input').clear().type('Tachikawa Hospital!').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-nameJa"]')
                .find('p').should('exist').contains('Invalid Japanese Name')

            cy.get('[data-testid="mod-facility-section-phone"]').find('input').clear().type('Hello').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-phone"]')
                .find('p').should('exist').contains('Invalid Phone Number')

            cy.get('[data-testid="mod-facility-section-email"]').find('input').clear().type('example').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-email"]')
                .find('p').should('exist').contains('Invalid Email Address')

            cy.get('[data-testid="mod-facility-section-website"]').find('input').clear().type('example').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-website"]')
                .find('p').should('exist').contains('Invalid Website URL')

            cy.get('[data-testid="mod-facility-section-postalCode"]').find('input').clear().type('180-0').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-postalCode"]')
                .find('p').should('exist').contains('Invalid Postal Code')

            cy.get('[data-testid="mod-facility-section-cityEn"]').find('input').clear().type('渋谷区').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-cityEn"]')
                .find('p').should('exist').contains('Invalid English City Name')

            cy.get('[data-testid="mod-facility-section-addressLine1En"]').find('input').clear().type('道の駅').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-addressLine1En"]')
                .find('p').should('exist').contains('Invalid English Address')

            cy.get('[data-testid=mod-facility-section-cityJa]').find('input').clear().type('Shibuya').realPress('Tab')
            cy.get('[data-testid=mod-facility-section-cityJa]')
                .find('p').should('exist').contains('Invalid Japanese City Name')

            cy.get('[data-testid="mod-facility-section-mapLatitude"]')
                .find('input').clear().type('Not Number Latitude').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-mapLatitude"]')
                .find('p').should('exist').contains('Invalid Latitude')

            cy.get('[data-testid="mod-facility-section-mapLongitude"]')
                .find('input').clear().type('Not Number Longitude').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-mapLongitude"]')
                .find('p').should('exist').contains('Invalid Longitude')
        })
    })
})
