import enUS from '../../../i18n/locales/en.json'
import fakeFacilityResult from '../../fake_data/moderation_dashboard/fakeModFacilityData.json'
import { aliasQuery } from '../utils'

before(() => {
    cy.login()
})

describe('Moderation edit facility form', () => {
    context('Landscape mode', () => {
        before(() => {
            cy.intercept('POST', '**/', req => {
                aliasQuery(req, 'query Facilities', fakeFacilityResult)
            })

            cy.visit('/moderation')

            cy.wait('@query Facilities')

            cy.get('[data-testid="submission-type-select"]').select('FACILITIES')
            cy.get('[data-testid="mod-facility-list-item-1"]').click()
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

        it('should be able to type in all input fields', () => {
            cy.get('[data-testid="mod-facility-section-nameEn"]').find('input').type('Hospital')
            cy.get('[data-testid="mod-facility-section-nameJa"]').find('input').type('立川中央病院')
            cy.get('[data-testid="mod-facility-section-phone"]').find('input').type('08080939393')
            cy.get('[data-testid="mod-facility-section-email"]').find('input').type('example@mail.com')
            cy.get('[data-testid="mod-facility-section-website"]').find('input').type('http://example.com')
            cy.get('[data-testid="mod-facility-section-postalCode"]').find('input').type('180-0000')
            cy.get('[data-testid="mod-facility-section-cityEn"]').find('input').type('Shibuya')
            cy.get('[data-testid="mod-facility-section-addressLine1En"]').find('input').type('some address line 1')
            cy.get('[data-testid="mod-facility-section-addressLine2En"]').find('input').type('some address line 2')
            cy.get('[data-testid="mod-facility-section-cityJa"]').find('input').type('渋谷区')
            cy.get('[data-testid="mod-facility-section-addressLine1Ja"]').find('input').type('道の駅')
            cy.get('[data-testid="mod-facility-section-addressLine2Ja"]').find('input').type('道の')
            //The typing is split into three due to our linting rules of length
            cy.get('[data-testid="mod-facility-section-google-maps"]')
                .find('input')
                .type('www.google.com/maps/place/82+Yamatech%C5%8D,+Naka+Ward,+Yokohama,+Kanagawa+231-0862,')
                .type('+Japan/@35.437123,139.651471,16z/data=!4m6!3m5!1s0x60185d201648e7c1:0x8f37d37bb381e29!8m2!3d35')
                .type('.4371228!4d139.6514712!16s%2Fg%2F11clpxxvx5?hl=en-US&entry=ttu')
            cy.get('[data-testid="mod-facility-section-doctor-search"]').find('input').type('Aya Yumino')
        })

        it('should be able to select a field', () => {
            cy.get('[data-testid="mod-facility-section-prefectureEn"]').select('Hokkaido')
            cy.get('[data-testid="mod-facility-section-prefectureJa"]').select('北海道')
        })

        it('should be display error messages', () => {
            cy.get('[data-testid="mod-facility-section-nameEn"]').find('input').clear().type('立川中央病院').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-nameEn"]').find('p')
                .should('exist')
                .contains('Invalid English Name')

            cy.get('[data-testid="mod-facility-section-nameJa"]')
                .find('input').clear().type('Tachikawa Hospital').realPress('Tab')
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

            cy.get('[data-testid="mod-facility-section-addressLine2En"]').find('input').clear().type('道の駅').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-addressLine2En"]')
                .find('p').should('exist').contains('Invalid English Address')

            cy.get('[data-testid=mod-facility-section-cityJa]').find('input').clear().type('Shibuya').realPress('Tab')
            cy.get('[data-testid=mod-facility-section-cityJa]')
                .find('p').should('exist').contains('Invalid Japanese City Name')

            cy.get('[data-testid="mod-facility-section-addressLine1Ja"]')
                .find('input').clear().type('Peanutbutter street').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-addressLine1Ja"]').should('exist').contains('Invalid Japanese Address')

            cy.get('[data-testid="mod-facility-section-addressLine2Ja"]')
                .find('input').clear().type('Jelly street').realPress('Tab')
            cy.get('[data-testid="mod-facility-section-addressLine2Ja"]').should('exist').contains('Invalid Japanese Address')

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
