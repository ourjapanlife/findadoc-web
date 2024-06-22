import 'cypress-real-events'
import 'cypress-plugin-tab'
import enUS from '../../i18n/locales/en.json'

describe(
    'Moderation dashboard',
    () => {
        context('Landscape mode', () => {
            before(() => {
                cy.visit('/moderation')
                // This wait time is to give the page time to load from Prod when ran in CI.
                cy.wait(3000)
            })
            beforeEach(() => {
                // The resolution is in the beforeEach() instead of before() to
                // prevent Cypress from defaulting to other screen sizes between tests.
                cy.viewport(1920, 1080)
                cy.wait(500)
            })

            it('shows mod dashboard left navbar buttons', () => {
                cy.get('[data-testid=mod-dashboard-leftnav-for-review]')
                    .should('exist')
                    .should(
                        'include.text',
                        enUS.modDashboardLeftNav.forReview
                    )

                cy.get('[data-testid=mod-dashboard-leftnav-approved]')
                    .should('exist')
                    .should(
                        'include.text',
                        enUS.modDashboardLeftNav.approved
                    )

                cy.get('[data-testid=mod-dashboard-leftnav-rejected]')
                    .should('exist')
                    .should(
                        'include.text',
                        enUS.modDashboardLeftNav.rejected
                    )
            })

            it.skip('it shows the moderation top nav', () => {
                cy.get('[data-testid="mod-submission-list-item-1"]').click()
                cy.get('[data-testid="mod-edit-submission-copy-submission-id"]').click()

                // check that the value copied to the clipboard is the same that's displayed
                const clipboardResult = cy.window().then(win => win.navigator.clipboard.readText())

                // the timeout is to give time for the clipboard to be read
                clipboardResult.should('exist', 10000)
            })
        })
    }
)

describe('Moderation Facility Submission Form', () => {
    const findADocJapanAPIEndpoint = 'https://api.findadoc.jp/'
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
                }
            ]
        }
    }
    context('Landscape mode', () => {
        beforeEach(() => {
            // The resolution is in the beforeEach() instead of before() to
            // prevent Cypress from defaulting to other screen sizes between tests.
            cy.viewport(1920, 1080)
            cy.visit('/moderation')
            cy.intercept('POST', findADocJapanAPIEndpoint, req => {
                if (req.body.query && req.body.query.includes('query Submissions')) {
                    req.reply({
                        statusCode: 200,
                        body: mockedSubmissionResponse
                    })
                }
            }).as('getSubmissions')
            cy.wait('@getSubmissions')
            // This wait time is to give the page elements time to load.
            cy.wait(2000)
            cy.get('[data-testid="mod-submission-list-item-1"]').click()
            cy.wait(2000)
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
            cy.get('[data-testid="submission-form-nameEn"]').find('input').type('立川中央病院').tab()
            cy.get('[data-testid="submission-form-nameEn"]').find('p').should('exist').contains('Invalid English Name')

            cy.get('[data-testid="submission-form-nameJp"]').find('input').type('Tachikawa Hospital').tab()
            cy.get('[data-testid="submission-form-nameJp"]').find('p').should('exist').contains('Invalid Japanese Name')

            cy.get('[data-testid="submission-form-phone"]').find('input').type('Hello').tab()
            cy.get('[data-testid="submission-form-phone"]').find('p').should('exist').contains('Invalid Phone Number')

            cy.get('[data-testid="submission-form-email"]').find('input').type('example').tab()
            cy.get('[data-testid="submission-form-email"]').find('p').should('exist').contains('Invalid Email Address')

            cy.get('[data-testid="submission-form-website"]').find('input').type('example').tab()
            cy.get('[data-testid="submission-form-website"]').find('p').should('exist').contains('Invalid Website URL')

            cy.get('[data-testid="submission-form-postalCode"]').find('input').type('180-0').tab()
            cy.get('[data-testid="submission-form-postalCode"]').find('p').should('exist').contains('Invalid Postal Code')

            cy.get('[data-testid="submission-form-cityEn"]').find('input').type('渋谷区').tab()
            cy.get('[data-testid="submission-form-cityEn"]').find('p').should('exist').contains('Invalid English City Name')

            cy.get('[data-testid="submission-form-addressLine1En"]').find('input').type('道の駅').tab()
            cy.get('[data-testid="submission-form-addressLine1En"]').find('p').should('exist').contains('Invalid English Address')

            cy.get('[data-testid="submission-form-addressLine2En"]').find('input').type('道の駅').tab()
            cy.get('[data-testid="submission-form-addressLine2En"]').find('p').should('exist').contains('Invalid English Address')

            cy.get('[data-testid=submission-form-cityJp]').find('input').type('Shibuya').tab()
            cy.get('[data-testid=submission-form-cityJp]').find('p').should('exist').contains('Invalid Japanese City Name')

            cy.get('[data-testid="submission-form-addressLine1Jp"]').find('input').type('Peanutbutter street').tab()
            cy.get('[data-testid="submission-form-addressLine1Jp"]').should('exist').contains('Invalid Japanese Address')

            cy.get('[data-testid="submission-form-addressLine2Jp"]').find('input').type('Jelly street').tab()
            cy.get('[data-testid="submission-form-addressLine2Jp"]').should('exist').contains('Invalid Japanese Address')

            cy.get('[data-testid="submission-form-mapLatitude"]').find('input').type('Not Number Latitude').tab()
            cy.get('[data-testid="submission-form-mapLatitude"]').find('p').should('exist').contains('Invalid Latitude')

            cy.get('[data-testid="submission-form-mapLongitude"]').find('input').type('Not Number Longitude').tab()
            cy.get('[data-testid="submission-form-mapLongitude"]').find('p').should('exist').contains('Invalid Longitude')
        })
    })
})
