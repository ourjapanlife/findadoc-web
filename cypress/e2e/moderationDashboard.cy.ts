import 'cypress-real-events'
import 'cypress-plugin-tab'
import enUS from '../../i18n/locales/en.json'

const mockedSubmissionResponse = {
    data: {
        submissions: [
            {
                id: '1',
                googleMapsUrl: 'https://maps.google.com/?q=custom1',
                healthcareProfessionalName: 'Dr. John Doe',
                spokenLanguages: ['English', 'Japanese'],
                facility: {
                    id: '1',
                    nameEn: 'Custom Facility EN',
                    nameJa: 'カスタム施設 JA',
                    contact: {
                        googleMapsUrl: 'https://maps.google.com/?q=facility1',
                        email: 'contact@facility.com',
                        phone: '123-456-7890',
                        website: 'https://facility.com',
                        address: {
                            postalCode: '123-4567',
                            prefectureEn: 'Tokyo',
                            cityEn: 'Shibuya',
                            addressLine1En: '1-2-3 Custom St',
                            addressLine2En: 'Apt 456',
                            prefectureJa: '東京都',
                            cityJa: '渋谷区',
                            addressLine1Ja: 'カスタム通り1-2-3',
                            addressLine2Ja: '456号室'
                        }
                    },
                    healthcareProfessionalIds: ['1']
                },
                healthcareProfessionals: [
                    {
                        id: '1',
                        names: [
                            {
                                firstName: 'John',
                                middleName: '',
                                lastName: 'Doe',
                                locale: 'en'
                            }
                        ],
                        spokenLanguages: ['English'],
                        degrees: ['MD'],
                        specialties: ['General Practice'],
                        acceptedInsurance: ['Insurance1'],
                        facilityIds: ['1']
                    }
                ],
                isUnderReview: false,
                isApproved: true,
                isRejected: false,
                createdDate: '2023-01-01T00:00:00Z',
                updatedDate: '2023-01-02T00:00:00Z',
                notes: 'This is a custom note.'
            },
            {
                id: '2',
                googleMapsUrl: 'https://maps.google.com/?q=flannigan2',
                healthcareProfessionalName: 'Dr. Farnsworth McFlannigan',
                spokenLanguages: ['English', 'Japanese'],
                facility: {
                    id: '1',
                    nameEn: 'Cork EN',
                    nameJa: 'カスタム JA2',
                    contact: {
                        googleMapsUrl:
                            'https://maps.google.com/?q=mcflannigan2',
                        email: 'mcFlannigan@mcflannigan.com',
                        phone: '243-867-5309',
                        website: 'https://mcflannigan.com',
                        address: {
                            postalCode: '123-4567',
                            prefectureEn: 'Tokyo',
                            cityEn: 'Shibuya',
                            addressLine1En: '1-2-3 Flannigan St',
                            addressLine2En: 'Apt 456',
                            prefectureJa: '東京都',
                            cityJa: '渋谷区',
                            addressLine1Ja: 'カスタム通り1-2-3',
                            addressLine2Ja: '456号室'
                        }
                    },
                    healthcareProfessionalIds: ['2']
                },
                healthcareProfessionals: [
                    {
                        id: '2',
                        names: [
                            {
                                firstName: 'Farnsworth',
                                middleName: '',
                                lastName: 'McFlannigan',
                                locale: 'en'
                            }
                        ],
                        spokenLanguages: ['English', 'Japanese'],
                        degrees: ['MD'],
                        specialties: ['Radiology'],
                        acceptedInsurance: ['Insurance2'],
                        facilityIds: ['2']
                    }
                ],
                isUnderReview: true,
                isApproved: false,
                isRejected: false,
                createdDate: '2023-01-01T00:00:00Z',
                updatedDate: '2023-01-02T00:00:00Z',
                notes: 'This is a custom note.'
            }
        ]
    },
    facilities: [
        {
            id: '1',
            nameEn: 'Tokyo Medical Center',
            nameJa: '東京医療センター',
            contact: {
                googleMapsUrl:
                    'https://maps.google.com/?q=Tokyo+Medical+Center',
                email: 'contact@tokyomedicalcenter.jp',
                phone: '+81-3-1234-5678',
                website: 'https://www.tokyomedicalcenter.jp',
                address: {
                    postalCode: '100-0001',
                    prefectureEn: 'Tokyo',
                    cityEn: 'Chiyoda',
                    addressLine1En: '1-1-1 Chiyoda',
                    addressLine2En: 'Building A',
                    prefectureJa: '東京都',
                    cityJa: '千代田区',
                    addressLine1Ja: '千代田1-1-1',
                    addressLine2Ja: 'Aビル'
                }
            },
            mapLatitude: 35.6895,
            mapLongitude: 139.6917,
            healthcareProfessionalIds: ['101', '102', '103'],
            createdDate: '2023-01-01T12:00:00Z',
            updatedDate: '2024-01-01T12:00:00Z'
        }
    ]
}

describe(
    'Moderation dashboard',
    () => {
        context('Landscape mode', () => {
            beforeEach(() => {
                // The resolution is in the beforeEach() instead of before() to
                // prevent Cypress from defaulting to other screen sizes between tests.
                cy.viewport('macbook-16')
                cy.visit('/login', { timeout: 10000 })
                Cypress.session.clearCurrentSessionData()

                cy.origin('https://findadoc.jp.auth0.com/', () => {
                    cy.get('input#username').should('be.visible').type('findadoctest@proton.me')
                    cy.get('[data-action-button-primary]').should('be.visible').click()
                    cy.get('input#password').should('be.visible').type('vCnL5J8agHg6m2f')
                    cy.get('[data-action-button-primary]').should('be.visible').click()
                })

                cy.url({ timeout: 10000 }).should('equal', 'http://localhost:3000/')

                cy.intercept('POST', '**/', req => {
                    req.continue(res => {
                        if (req.body.query && req.body.query.includes('query Submissions')) {
                            res.send({
                                statusCode: 200,
                                body: mockedSubmissionResponse
                            })
                        }
                    })
                }).as('getSubmissions')

                cy.url({ timeout: 10000 }).should('equal', 'http://localhost:3000/')

                /* chaining of visit was used here to make sure the user was logged in and that it would
                 100 percent visit moderation */
                cy.get('[data-testid=top-nav-mod-link]', { timeout: 10000 }).click().visit('/moderation')

                cy.wait('@getSubmissions', { timeout: 10000 })
            })

            it('shows mod dashboard left navbar buttons with correct counts and functionality', () => {
                //The number for include text is for the status in the mock data
                cy.get('[data-testid=mod-dashboard-leftnav-for-review]', { timeout: 10000 })
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

                cy.get('[data-testid="mod-submission-list-item-1"]', { timeout: 10000 }).should('exist')

                cy.get('[data-testid=mod-dashboard-leftnav-approved]')
                    .click()

                cy.get('[data-testid="mod-submission-list-item-1"]', { timeout: 10000 }).should('exist')

                cy.get('[data-testid=mod-dashboard-leftnav-rejected]')
                    .click()

                cy.get('[data-testid="mod-submission-list-item-1"]', { timeout: 10000 }).should('not.exist')

                cy.get('[data-testid=mod-dashboard-leftnav-for-review]')
                    .click()

                cy.get('[data-testid="mod-submission-list-item-1"]', { timeout: 10000 }).should('exist')
            })

            it.skip('it shows the moderation top nav', () => {
                cy.get('[data-testid="mod-submission-list-item-1"]').click()
                cy.get('[data-testid="mod-edit-submission-copy-submission-id"]').click()

                // check that the value copied to the clipboard is the same that's displayed
                const clipboardResult = cy.window().then(win => win.navigator.clipboard.readText())

                // the timeout is to give time for the clipboard to be read
                clipboardResult.should('exist', 10000)
            })

            it('toggle between submissions and healthcare professionals submissions', () => {
                cy.get('[data-testid="mod-healthcare-professional-list-item-1"]').should('not.exist')
                cy.get('[data-testid="mod-facility-list-item-1"]').should('not.exist')
                cy.get('[data-testid="mod-submission-list-item-1').should('exist')

                cy.get('[data-testid="submission-type-select"]', { timeout: 10000 }).select('FACILITIES')
                cy.get('[data-testid="mod-healthcare-professional-list-item-1"]').should('not.exist')
                cy.get('[data-testid="mod-facility-list-item-1"]').should('exist')
                cy.get('[data-testid="mod-submission-list-item-1').should('not.exist')

                cy.get('[data-testid="submission-type-select"]', { timeout: 10000 }).select('HEALTHCARE_PROFESSIONALS')
                cy.get('[data-testid="mod-healthcare-professional-list-item-1"]').should('exist')
                cy.get('[data-testid="mod-facility-list-item-1"]').should('not.exist')
                cy.get('[data-testid="mod-submission-list-item-1').should('not.exist')

                cy.get('[data-testid="submission-type-select"]', { timeout: 10000 }).select('SUBMISSIONS')
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

describe('Moderation Facility Submission Form', () => {
    context('Landscape mode', () => {
        before(() => {
            // The resolution is in the beforeEach() instead of before() to
            // prevent Cypress from defaulting to other screen sizes between tests.
            cy.viewport('macbook-16')

            cy.visit('/login', { timeout: 10000 })
            Cypress.session.clearCurrentSessionData()

            cy.origin('https://findadoc.jp.auth0.com/', () => {
                cy.get('input#username').should('be.visible').type('findadoctest@proton.me')
                cy.get('[data-action-button-primary]').should('be.visible').click()
                cy.get('input#password').should('be.visible').type('vCnL5J8agHg6m2f')
                cy.get('[data-action-button-primary]').should('be.visible').click()
            })

            cy.url({ timeout: 10000 }).should('equal', 'http://localhost:3000/')

            cy.intercept('POST', '**/', req => {
                req.continue(res => {
                    console.log(req.body.query)
                    if (req.body.query && req.body.query.includes('query Submissions')) {
                        res.send({
                            statusCode: 200,
                            body: mockedSubmissionResponse
                        })
                    }
                })
            }).as('getSubmissions')

            cy.url({ timeout: 10000 }).should('equal', 'http://localhost:3000/')

            /* chaining of visit was used here to make sure the user was logged in and that it would
                 100 percent visit moderation */
            cy.get('[data-testid=top-nav-mod-link]', { timeout: 10000 }).click().visit('/moderation')

            cy.wait('@getSubmissions', { timeout: 10000 })

            cy.get('[data-testid="mod-submission-list-item-1"]', { timeout: 10000 }).click()
        })

        after(() => {
            Cypress.session.clearCurrentSessionData()
        })

        it('contains the following input fields', () => {
            cy.get('[data-testid="submission-form-nameEn"]').should('exist')
            cy.get('[data-testid="submission-form-nameJp"]').should('exist')
            cy.get('[data-testid="submission-form-phone"]').should('exist')
            cy.get('[data-testid="submission-form-email"]').should('exist')
            cy.get('[data-testid="submission-form-website"]').should('exist')
            cy.get('[data-testid="submission-form-postalCode"]').should('exist')
            cy.get('[data-testid="submission-form-cityEn"]').should('exist')
            cy.get('[data-testid="submission-form-addressLine1En"]').should('exist')
            cy.get('[data-testid="submission-form-addressLine2En"]').should('exist')
            cy.get('[data-testid=submission-form-cityJp]').should('exist')
            cy.get('[data-testid="submission-form-addressLine1Jp"]').should('exist')
            cy.get('[data-testid="submission-form-addressLine2Jp"]').should('exist')
            cy.get('[data-testid="submission-form-google-maps"]').should('exist')
            cy.get('[data-testid="submission-form-mapLatitude"]').should('exist')
            cy.get('[data-testid="submission-form-mapLongitude"]').should('exist')
            cy.get('[data-testid="submission-form-doctor-search"]').should('exist')
        })

        it('should contain the following select field', () => {
            cy.get('[data-testid="submission-form-prefectureEn"]').should('exist')
            cy.get('[data-testid="submission-form-prefectureJp"]').should('exist')
        })

        it('should autofill the form', () => {
            const submission = mockedSubmissionResponse.data.submissions[1].facility

            cy.get('[data-testid="submission-form-nameEn"]').find('input', { timeout: 10000 })
                .should('have.value', submission.nameEn)

            cy.get('[data-testid="submission-form-nameJp"]').find('input', { timeout: 10000 })
                .should('have.value', submission.nameJa)

            cy.get('[data-testid="submission-form-phone"]').find('input', { timeout: 10000 })
                .should('have.value', submission.contact.phone)
        })

        it('should be able to type in all input fields', () => {
            cy.get('[data-testid="submission-form-nameEn"]').find('input').type('Hospital')
            cy.get('[data-testid="submission-form-nameJp"]').find('input').type('立川中央病院')
            cy.get('[data-testid="submission-form-phone"]').find('input').type('08080939393')
            cy.get('[data-testid="submission-form-email"]').find('input').type('example@mail.com')
            cy.get('[data-testid="submission-form-website"]').find('input').type('http://example.com')
            cy.get('[data-testid="submission-form-postalCode"]').find('input').type('180-0000')
            cy.get('[data-testid="submission-form-cityEn"]').find('input').type('Shibuya')
            cy.get('[data-testid="submission-form-addressLine1En"]').find('input').type('some address line 1')
            cy.get('[data-testid="submission-form-addressLine2En"]').find('input').type('some address line 2')
            cy.get('[data-testid=submission-form-cityJp]').find('input').type('渋谷区')
            cy.get('[data-testid="submission-form-addressLine1Jp"]').find('input').type('道の駅')
            cy.get('[data-testid="submission-form-addressLine2Jp"]').find('input').type('道の')
            cy.get('[data-testid="submission-form-google-maps"]').find('input').type('www.google.com/maps/place/82+Yamatech%C5%8D,+Naka+Ward,+Yokohama,+Kanagawa+231-0862,+Japan/@35.437123,139.651471,16z/data=!4m6!3m5!1s0x60185d201648e7c1:0x8f37d37bb381e29!8m2!3d35.4371228!4d139.6514712!16s%2Fg%2F11clpxxvx5?hl=en-US&entry=ttu')
            cy.get('[data-testid="submission-form-mapLatitude"]').find('input').type('35.437123')
            cy.get('[data-testid="submission-form-mapLongitude"]').find('input').type('139.651471')
            cy.get('[data-testid="submission-form-doctor-search"]').find('input').type('Aya Yumino')
        })

        it('should be able to select a field', () => {
            cy.get('[data-testid="submission-form-prefectureEn"]').select('Hokkaido')
            cy.get('[data-testid="submission-form-prefectureJp"]').select('北海道')
        })

        it('should be display error messages', () => {
            cy.get('[data-testid="submission-form-nameEn"]').find('input').clear().type('立川中央病院').realPress('Tab')
            cy.get('[data-testid="submission-form-nameEn"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid English Name')

            cy.get('[data-testid="submission-form-nameJp"]').find('input').clear().type('Tachikawa Hospital').realPress('Tab')
            cy.get('[data-testid="submission-form-nameJp"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid Japanese Name')

            cy.get('[data-testid="submission-form-phone"]').find('input').clear().type('Hello').realPress('Tab')
            cy.get('[data-testid="submission-form-phone"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid Phone Number')

            cy.get('[data-testid="submission-form-email"]').find('input').clear().type('example').realPress('Tab')
            cy.get('[data-testid="submission-form-email"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid Email Address')

            cy.get('[data-testid="submission-form-website"]').find('input').clear().type('example').realPress('Tab')
            cy.get('[data-testid="submission-form-website"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid Website URL')

            cy.get('[data-testid="submission-form-postalCode"]').find('input').clear().type('180-0').realPress('Tab')
            cy.get('[data-testid="submission-form-postalCode"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid Postal Code')

            cy.get('[data-testid="submission-form-cityEn"]').find('input').clear().type('渋谷区').realPress('Tab')
            cy.get('[data-testid="submission-form-cityEn"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid English City Name')

            cy.get('[data-testid="submission-form-addressLine1En"]').find('input').clear().type('道の駅').realPress('Tab')
            cy.get('[data-testid="submission-form-addressLine1En"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid English Address')

            cy.get('[data-testid="submission-form-addressLine2En"]').find('input').clear().type('道の駅').realPress('Tab')
            cy.get('[data-testid="submission-form-addressLine2En"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid English Address')

            cy.get('[data-testid=submission-form-cityJp]').find('input').clear().type('Shibuya').realPress('Tab')
            cy.get('[data-testid=submission-form-cityJp]').find('p', { timeout: 10000 }).should('exist').contains('Invalid Japanese City Name')

            cy.get('[data-testid="submission-form-addressLine1Jp"]').find('input').clear().type('Peanutbutter street').realPress('Tab')
            cy.get('[data-testid="submission-form-addressLine1Jp"]').should('exist').contains('Invalid Japanese Address')

            cy.get('[data-testid="submission-form-addressLine2Jp"]').find('input').clear().type('Jelly street').realPress('Tab')
            cy.get('[data-testid="submission-form-addressLine2Jp"]').should('exist').contains('Invalid Japanese Address')

            cy.get('[data-testid="submission-form-mapLatitude"]').find('input').clear().type('Not Number Latitude').realPress('Tab')
            cy.get('[data-testid="submission-form-mapLatitude"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid Latitude')

            cy.get('[data-testid="submission-form-mapLongitude"]').find('input').clear().type('Not Number Longitude').realPress('Tab')
            cy.get('[data-testid="submission-form-mapLongitude"]').find('p', { timeout: 10000 }).should('exist').contains('Invalid Longitude')
        })
    })
})
