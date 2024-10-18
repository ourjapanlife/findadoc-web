import 'cypress-real-events'
import 'cypress-plugin-tab'

const FAKE_FACILITY_RESPONSE_PATH = 'moderation_dashboard/fakeModFacilityData.json'

describe('Moderation edit facility form', () => {
    context('Landscape mode', () => {
        // Before starting the execution, we need to load the fixture data using "this" context of the
        // test object. We need to use regular function() callbacks instead of arrow functions when
        // we need to access the "this" context.
        before(function() {
            cy.fixture(FAKE_FACILITY_RESPONSE_PATH).then(fakeFacilityResult => {
                this.fakeFacilityResult = fakeFacilityResult
            })

            cy.viewport('macbook-16')
            cy.visit('/login', { timeout: 10000 })
            Cypress.session.clearCurrentSessionData()

            // This intercepts the call to the GraphQL API in order to use fake data in the tests to protect the real data.
            cy.intercept('POST', '**/', req => {
                if (req.body.query && req.body.query.includes('query Facilities')) {
                    req.reply({
                        statusCode: 200,
                        body: this.fakeFacilityResult
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
            cy.get('[data-testid="mod-facility-section-mapLatitude"]').find('input').type('35.437123')
            cy.get('[data-testid="mod-facility-section-mapLongitude"]').find('input').type('139.651471')
            cy.get('[data-testid="mod-facility-section-doctor-search"]').find('input').type('Aya Yumino')
        })

        it('should be able to select a field', () => {
            cy.get('[data-testid="mod-facility-section-prefectureEn"]').select('Hokkaido')
            cy.get('[data-testid="mod-facility-section-prefectureJa"]').select('北海道')
        })
    })
})
