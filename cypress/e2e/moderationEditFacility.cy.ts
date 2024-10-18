import 'cypress-real-events'
import 'cypress-plugin-tab'

const mockedFacilityResponse = {
    data: {
        facilities: [
            {
            address: {
                addressLine1En: "1649 Octavia Parkways",
                addressLine1Ja: "3581 蒼空Route",
                addressLine2En: "Suite 869",
                addressLine2Ja: "Apt. 110",
                cityEn: "East Linnea",
                cityJa: "南菜摘市",
                postalCode: "27629",
                prefectureEn: "Kentucky",
                prefectureJa: "秋田県"
            },
            email: "KarelleKoss22@hotmail.com",
            googleMapsUrl: "https://usable-flung.net",
            phone: "920.452.4490 x40878",
            website: "https://amused-appetite.com",
            createdDate: "2024-10-18T05:45:37.282Z",
            healthcareProfessionalIds: [
                "FUVTHAW5azp3q29J6H2X",
                "ce9vMQ4N5Xi8euDdJNRt",
                "FpGOjx829xqNTvHZ2CGE",
                "IHOV1jXu9iSM0rKHaSNY",
                "TNFpQ9QmC1Was0zCi9qq"
            ],
            id: "BaKDfiBzr9FoMYa3IpU2",
            mapLatitude: -22.5781,
            mapLongitude: -105.9409,
            nameEn: "Karelle Koss",
            nameJa: "山本 山本",
            updatedDate: "2024-10-18T05:45:37.572Z"
            }
        ]
    }
}

describe('Moderation edit facility form', () => {
    context('Landscape mode', () => {
        before(() => {
            // The resolution is in the beforeEach() instead of before() to
            // prevent Cypress from defaulting to other screen sizes between tests.
            cy.viewport('macbook-16')
            cy.visit('/login', { timeout: 10000 })
            Cypress.session.clearCurrentSessionData()

            // This intercepts the call to the GraphQL API in order to use fake data in the tests to protect the real data.
            cy.intercept('POST', '**/', req => {
                if (req.body.query && req.body.query.includes('query Facilities')) {
                    req.reply({
                        statusCode: 200,
                        body: mockedFacilityResponse
                    })
                } else {
                    req.continue()
                }
            }).as('getFacilities')

            cy.origin('https://findadoc.jp.auth0.com/', () => {
                cy.get('input#username').should('be.visible').type('findadoctest@proton.me')
                cy.get('[data-action-button-primary]').should('be.visible').click()
                cy.get('input#password').should('be.visible').type('vCnL5J8agHg6m2f')
                cy.get('[data-action-button-primary]').should('be.visible').click()
            })

            cy.url({ timeout: 10000 }).should('equal', 'http://localhost:3000/')

            /* Chaining of visit was used here to make sure the user was logged in and that it would
                100 percent visit moderation */
            cy.get('[data-testid=top-nav-mod-link]', { timeout: 10000 }).click().visit('/moderation')

            cy.url({ timeout: 10000 }).should('include', '/moderation')

            cy.wait('@getFacilities', { timeout: 10000 })
            cy.get('[data-testid="submission-type-select"]', { timeout: 10000 }).select('FACILITIES')
    
            cy.get('[data-testid="mod-facility-list-item-1"]', { timeout: 10000 }).click()
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
            cy.get('[data-testid="submission-form-doctor-search"]').should('exist')
        })

        it('should contain the following select field', () => {
            cy.get('[data-testid="submission-form-prefectureEn"]').should('exist')
            cy.get('[data-testid="submission-form-prefectureJa"]').should('exist')
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
            cy.get('[data-testid="submission-form-google-maps"]').find('input').type('www.google.com/maps/place/82+Yamatech%C5%8D,+Naka+Ward,+Yokohama,+Kanagawa+231-0862,+Japan/@35.437123,139.651471,16z/data=!4m6!3m5!1s0x60185d201648e7c1:0x8f37d37bb381e29!8m2!3d35.4371228!4d139.6514712!16s%2Fg%2F11clpxxvx5?hl=en-US&entry=ttu')
            cy.get('[data-testid="submission-form-mapLatitude"]').find('input').type('35.437123')
            cy.get('[data-testid="submission-form-mapLongitude"]').find('input').type('139.651471')
            cy.get('[data-testid="submission-form-doctor-search"]').find('input').type('Aya Yumino')
        })

        it('should be able to select a field', () => {
            cy.get('[data-testid="submission-form-prefectureEn"]').select('Hokkaido')
            cy.get('[data-testid="submission-form-prefectureJa"]').select('北海道')
        })
    })
})