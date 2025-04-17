import enUS from '../../../i18n/locales/en.json'
import { aliasQuery } from '../utils'
import fakeSubmissionResponse from '../../fake_data/moderation_dashboard/fakeSubmissionResponse.json'

before(() => {
    cy.login()
})

describe('Moderation Edit Submission Form', () => {
    context('Landscape mode', () => {
        before(() => {
            cy.intercept('POST', '**/', req => {
                aliasQuery(req, 'query Submissions', fakeSubmissionResponse)
            })

            cy.visit('/moderation')
            cy.wait('@query Submissions')
            cy.get('[data-testid="mod-submission-list-item-1"]').click()
        })

        beforeEach(() => {
            cy.viewport('macbook-16')
        })

        it('contains the following input fields', () => {
            cy.get('[data-testid="submission-form-nameEn"]').should('exist')
            cy.get('[data-testid="submission-form-nameJa"]').should('exist')
            cy.get('[data-testid="submission-form-phone"]').should('exist')
            cy.get('[data-testid="submission-form-email"]').should('exist')
            cy.get('[data-testid="submission-form-website"]').should('exist')
            cy.get('[data-testid="submission-form-postalCode"]').should('exist')
            cy.get('[data-testid="submission-form-cityEn"]').should('exist')
            cy.get('[data-testid="submission-form-addressLine1En"]').should('exist')
            cy.get('[data-testid="submission-form-addressLine2En"]').should('exist')
            cy.get('[data-testid=submission-form-cityJa]').should('exist')
            cy.get('[data-testid="submission-form-addressLine1Ja"]').should('exist')
            cy.get('[data-testid="submission-form-addressLine2Ja"]').should('exist')
            cy.get('[data-testid="submission-form-google-maps"]').should('exist')
            cy.get('[data-testid="submission-form-mapLatitude"]').should('exist')
            cy.get('[data-testid="submission-form-mapLongitude"]').should('exist')
        })

        it('contains the following left nav buttons for navigation', () => {
            cy.get('[data-testid="submission-form-leftnav-contact-information"]').should('exist')
                .should('contain', enUS.modPanelSubmissionLeftNavbar.contactInformation)
            cy.get('[data-testid="submission-form-leftnav-addresses"]').should('exist')
                .should('contain', enUS.modPanelSubmissionLeftNavbar.addresses)
            cy.get('[data-testid="submission-form-leftnav-google-maps-information"]').should('exist')
                .should('contain', enUS.modPanelSubmissionLeftNavbar.googleMapsInformation)
            cy.get('[data-testid="submission-form-leftnav-healthcare-professional-ids"]').should('exist')
                .should('contain', enUS.modPanelSubmissionLeftNavbar.healthcareProfessionalIds)
            cy.get('[data-testid="submission-form-leftnav-change-log"]').should('exist')
                .should('contain', enUS.modPanelSubmissionLeftNavbar.changeLog)
            cy.get('[data-testid="submission-form-leftnav-healthcare-professional-name"]').should('exist')
                .should('contain', enUS.modPanelSubmissionLeftNavbar.healthcareProfessionalName)
            cy.get('[data-testid="submission-form-leftnav-healthcare-professional-medical-info"]').should('exist')
                .should('contain', enUS.modPanelSubmissionLeftNavbar.healthcareProfessionalMedicalInfo)
        })

        it('should contain the following search bars and select fields', () => {
            cy.get('[data-testid="submission-form-prefectureEn"]').should('exist')
            cy.get('[data-testid="submission-form-prefectureJa"]').should('exist')
            cy.get('[data-testid="submission-form-accepted-insurances"]').should('exist')
            cy.get('[data-testid="submission-form-degrees"]').should('exist')
            cy.get('[data-testid="submission-form-specialties"]').should('exist')
            cy.get('[data-testid="submission-form-locales"]').should('exist')
        })

        it('should autofill the form', () => {
            const submission = fakeSubmissionResponse.data.submissions[1].facility

            cy.get('[data-testid="submission-form-nameEn"]').find('input')
                .should('have.value', submission.nameEn)

            cy.get('[data-testid="submission-form-nameJa"]').find('input')
                .should('have.value', submission.nameJa)

            cy.get('[data-testid="submission-form-phone"]').find('input')
                .should('have.value', submission.contact.phone)
        })

        it('should be able to type in all input fields', () => {
            cy.get('[data-testid="submission-form-nameEn"]').find('input').type('Hospital')
            cy.get('[data-testid="submission-form-nameJa"]').find('input').type('立川中央病院')
            cy.get('[data-testid="submission-form-phone"]').find('input').type('08080939393')
            cy.get('[data-testid="submission-form-email"]').find('input').type('example@mail.com')
            cy.get('[data-testid="submission-form-website"]').find('input').type('http://example.com')
            cy.get('[data-testid="submission-form-postalCode"]').find('input').type('180-0000')
            cy.get('[data-testid="submission-form-cityEn"]').find('input').type('Shibuya')
            cy.get('[data-testid="submission-form-addressLine1En"]').find('input').type('some address line 1')
            cy.get('[data-testid="submission-form-addressLine2En"]').find('input').type('some address line 2')
            cy.get('[data-testid=submission-form-cityJa]').find('input').type('渋谷区')
            cy.get('[data-testid="submission-form-addressLine1Ja"]').find('input').type('道の駅')
            cy.get('[data-testid="submission-form-addressLine2Ja"]').find('input').type('道の')
            cy.get('[data-testid="submission-form-google-maps"]')
                .find('input')
                .type('www.google.com/maps/place/82+Yamatech%C5%8D,+Naka+Ward,+Yokohama'
                  + ',+Kanagawa+231-0862,+Japan/@35.437123,139.651471,16z/data=!4m6!3m5!1s'
                  + '0x60185d201648e7c1:0x8f37d37bb381e29!8m2!3d35.4371228!4d139.6514712!16s%2Fg%2F11clpxxvx5?hl=en-US&entry=ttu')
            cy.get('[data-testid="submission-form-mapLatitude"]').find('input').type('35.437123')
            cy.get('[data-testid="submission-form-mapLongitude"]').find('input').type('139.651471')
        })

        it('should be able to select a field', () => {
            cy.get('[data-testid="submission-form-prefectureEn"]').select('Hokkaido')
            cy.get('[data-testid="submission-form-prefectureJa"]').select('北海道')
        })

        it('should be display error messages', () => {
            cy.get('[data-testid="submission-form-nameEn"]').find('input').clear().type('立川中央病院').realPress('Tab')
            cy.get('[data-testid="submission-form-nameEn"]')
                .find('p').should('exist').contains('Invalid English Name')

            cy.get('[data-testid="submission-form-nameJa"]').find('input').clear().type('Tachikawa Hospital').realPress('Tab')
            cy.get('[data-testid="submission-form-nameJa"]')
                .find('p').should('exist').contains('Invalid Japanese Name')

            cy.get('[data-testid="submission-form-phone"]').find('input').clear().type('Hello').realPress('Tab')
            cy.get('[data-testid="submission-form-phone"]')
                .find('p').should('exist').contains('Invalid Phone Number')

            cy.get('[data-testid="submission-form-email"]').find('input').clear().type('example').realPress('Tab')
            cy.get('[data-testid="submission-form-email"]')
                .find('p').should('exist').contains('Invalid Email Address')

            cy.get('[data-testid="submission-form-website"]').find('input').clear().type('example').realPress('Tab')
            cy.get('[data-testid="submission-form-website"]')
                .find('p').should('exist').contains('Invalid Website URL')

            cy.get('[data-testid="submission-form-postalCode"]').find('input').clear().type('180-0').realPress('Tab')
            cy.get('[data-testid="submission-form-postalCode"]')
                .find('p').should('exist').contains('Invalid Postal Code')

            cy.get('[data-testid="submission-form-cityEn"]').find('input').clear().type('渋谷区').realPress('Tab')
            cy.get('[data-testid="submission-form-cityEn"]')
                .find('p').should('exist').contains('Invalid English City Name')

            cy.get('[data-testid="submission-form-addressLine1En"]').find('input').clear().type('道の駅').realPress('Tab')
            cy.get('[data-testid="submission-form-addressLine1En"]')
                .find('p').should('exist').contains('Invalid English Address')

            cy.get('[data-testid="submission-form-addressLine2En"]').find('input').clear().type('道の駅').realPress('Tab')
            cy.get('[data-testid="submission-form-addressLine2En"]')
                .find('p').should('exist').contains('Invalid English Address')

            cy.get('[data-testid=submission-form-cityJa]').find('input').clear().type('Shibuya').realPress('Tab')
            cy.get('[data-testid=submission-form-cityJa]')
                .find('p').should('exist').contains('Invalid Japanese City Name')

            cy.get('[data-testid="submission-form-addressLine1Ja"]')
                .find('input').clear().type('Peanutbutter street').realPress('Tab')
            cy.get('[data-testid="submission-form-addressLine1Ja"]').should('exist').contains('Invalid Japanese Address')

            cy.get('[data-testid="submission-form-addressLine2Ja"]').find('input').clear().type('Jelly street').realPress('Tab')
            cy.get('[data-testid="submission-form-addressLine2Ja"]').should('exist').contains('Invalid Japanese Address')

            cy.get('[data-testid="submission-form-mapLatitude"]')
                .find('input').clear().type('Not Number Latitude').realPress('Tab')
            cy.get('[data-testid="submission-form-mapLatitude"]')
                .find('p').should('exist').contains('Invalid Latitude')

            cy.get('[data-testid="submission-form-mapLongitude"]')
                .find('input').clear().type('Not Number Longitude').realPress('Tab')
            cy.get('[data-testid="submission-form-mapLongitude"]')
                .find('p').should('exist').contains('Invalid Longitude')
        })
    })
})
