import 'cypress-real-events'
import 'cypress-plugin-tab'
import enUS from '../../../i18n/locales/en.json'

const FAKE_SUBMISSION_RESPONSE_PATH = 'moderation_dashboard/fakeSubmissionResponse.json'

describe(
    'Moderation dashboard',
    () => {
        // Before starting the execution, we need to load the fixture data using "this" context of the
        // test object. We need to use regular function() callbacks instead of arrow functions when
        // we need to access the "this" context.
        before(function() {
            cy.fixture(FAKE_SUBMISSION_RESPONSE_PATH).then(fakeSubmissionResponse => {
                this.fakeSubmissionResponse = fakeSubmissionResponse
            })
        })

        context('Landscape mode', () => {
            beforeEach(function() {
                // The resolution is in the beforeEach() instead of before() to
                // prevent Cypress from defaulting to other screen sizes between tests.
                cy.viewport('macbook-16')
                cy.visit('/login')
                Cypress.session.clearCurrentSessionData()

                // This intercepts the call to the GraphQL API in order to use fake data in the tests to protect the real data.
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

                /* Chaining of visit was used here to make sure the user was logged in and that it would
                 100 percent visit moderation */
                cy.get('[data-testid=top-nav-mod-link]').click().visit('/moderation')

                cy.url({ timeout: 10000 }).should('include', '/moderation')

                cy.wait('@getSubmissions')
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

            it.skip('it shows the moderation top nav', () => {
                cy.get('[data-testid="mod-submission-list-item-1"]').click()
                cy.get('[data-testid="mod-edit-submission-copy-submission-id"]').click()

                // Check that the value copied to the clipboard is the same that's displayed.
                const clipboardResult = cy.window().then(win => win.navigator.clipboard.readText())

                // The timeout is to give time for the clipboard to be read.
                clipboardResult.should('exist', 10000)
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

            after(() => {
                Cypress.session.clearCurrentSessionData()
            })
        })
    }
)

describe('Moderation Edit Submission Form', () => {
    before(function() {
        cy.fixture(FAKE_SUBMISSION_RESPONSE_PATH).then(fakeSubmissionResponse => {
            this.fakeSubmissionResponse = fakeSubmissionResponse
        })
    })

    context('Landscape mode', () => {
        before(function() {
            cy.viewport('macbook-16')

            cy.visit('/login')
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

            /* Chaining of visit was used here to make sure the user was logged in and that it would
                 100 percent visit moderation */
            cy.get('[data-testid=top-nav-mod-link]').click().visit('/moderation')

            cy.url({ timeout: 10000 }).should('include', '/moderation')

            cy.wait('@getSubmissions')

            cy.get('[data-testid="mod-submission-list-item-1"]').click()
        })

        after(() => {
            Cypress.session.clearCurrentSessionData()
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

        it('should contain the following select field', () => {
            cy.get('[data-testid="submission-form-prefectureEn"]').should('exist')
            cy.get('[data-testid="submission-form-prefectureJa"]').should('exist')
            cy.get('[data-testid="submission-form-accepted-insurances"]').should('exist')
            cy.get('[data-testid="submission-form-degrees"]').should('exist')
            cy.get('[data-testid="submission-form-specialties"]').should('exist')
            cy.get('[data-testid="submission-form-locales"]').should('exist')
        })

        it('should autofill the form', function() {
            const submission = this.fakeSubmissionResponse.data.submissions[1].facility

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

describe('Moderation Edit Submission Modal', () => {
    before(function() {
        cy.fixture(FAKE_SUBMISSION_RESPONSE_PATH).then(fakeSubmissionResponse => {
            console.log(fakeSubmissionResponse)
            this.fakeSubmissionResponse = fakeSubmissionResponse
        })
    })

    context('Landscape mode', () => {
        before(function() {
            cy.viewport('macbook-16')

            cy.visit('/login')
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

            cy.get('[data-testid=top-nav-mod-link]').click().visit('/moderation')

            cy.url({ timeout: 10000 }).should('include', '/moderation')

            cy.wait('@getSubmissions')

            cy.get('[data-testid="mod-submission-list-item-1"]').click()
        })

        after(() => {
            Cypress.session.clearCurrentSessionData()
        })

        it('should display modal if user navigates back with unsaved changes', () => {
            // When the user clicks the back button on their browser with unsaved changes...
            cy.get('[data-testid="submission-form-nameEn"]').find('input').type('Hospital')
            cy.go('back')
            // ...the modal with the confirmation button should be visible.
            cy.get('[data-testid="submission-form-modal"]').should('be.visible')
            // When the user clicks the confirmation button on the modal...
            cy.get('[data-testid="submission-form-modal-confirmation-btn"]').click()
            // ...they should be navigated back to the moderation screen.
            cy.location('pathname').should('eq', '/moderation')
        })

        it('should not display modal if user navigates back without making changes', () => {
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
