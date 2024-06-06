import "cypress-real-events";
import enUS from "../../i18n/locales/en.json";

describe(
    "Moderation dashboard",
    {
        env: {
            ENABLE_MODERATION_PANEL: true,
        },
    },
    () => {
        beforeEach(() => {}),
        context("Landscape mode", () => {
            before(() => {
                cy.viewport(1920, 1080);
                cy.visit("/moderation");
            })

            it("shows mod dashboard left navbar buttons", () => {
                cy.wait(500);

                cy.get("[data-testid=mod-dashboard-leftnav-for-review]")
                    .should("exist")
                    .should(
                        "include.text",
                        enUS.modDashboardLeftNav.forReview
                    );

                cy.get("[data-testid=mod-dashboard-leftnav-approved]")
                    .should("exist")
                    .should(
                        "include.text",
                        enUS.modDashboardLeftNav.approved
                    );

                cy.get("[data-testid=mod-dashboard-leftnav-rejected]")
                    .should("exist")
                    .should(
                        "include.text",
                        enUS.modDashboardLeftNav.rejected
                    )
            });

            it("it shows the moderation top nav", () => {
                // wait for the vue components to actually load
                cy.wait(500)

                cy.get('[data-testid="mod-submission-list-item-1"]').click()
                cy.get('[data-testid="mod-edit-submission-copy-submission-id"]').click()

                    // check that the value copied to the clipboard is the same that's displayed
                    const clipboardResult = cy.window().then((win) => {
                        return win.navigator.clipboard.readText();
                    })

                    // the timeout is to give time for the clipboard to be read
                    clipboardResult.should("exist", 10000);
                })
            })
    }
)

describe('Moderation Facility Submission Form', () => {
    context('Landscape mode', () => {
        beforeEach(() => {
            cy.viewport(1920, 1080)
            cy.visit('/moderation')
            cy.wait(500)
            cy.get('[data-testid="mod-submission-list-item-1"]').click()
        })

        it('contains the following input fields', () => {

            cy.get('[data-testid="submission-form-nameEn"]').should('exist')
            cy.get('[data-testid="submission-form-nameJp"]').should('exist')
            cy.get('[data-testid="submission-form-phone"]').should('exist')
            cy.get('[data-testid="submission-form-email"]').should('exist')
            cy.get('[data-testid="submission-form-website"]').should('exist')
            cy.get('[data-testid="submission-form-postalCode"]').should('exist')
            cy.get( '[data-testid="submission-form-cityEn"]').should('exist')
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
            cy.get( '[data-testid="submission-form-cityEn"]').find('input').type('Shibuya')
            cy.get('[data-testid="submission-form-addressLine1En"]').find('input').type('some address line 1')
            cy.get('[data-testid="submission-form-addressLine2En"]').find('input').type('some address line 2')
            cy.get('[data-testid=submission-form-cityJp]').find('input').type('渋谷区')
            cy.get('[data-testid="submission-form-addressLine1Jp"]').find('input').type('道の駅')
            cy.get('[data-testid="submission-form-addressLine2Jp"]').find('input').type('道の')
            cy.get('[data-testid="submission-form-google-maps"]').find('input').type('www.google.com/maps/place/82+Yamatech%C5%8D,+Naka+Ward,+Yokohama,+Kanagawa+231-0862,+Japan/@35.437123,139.651471,16z/data=!4m6!3m5!1s0x60185d201648e7c1:0x8f37d37bb381e29!8m2!3d35.4371228!4d139.6514712!16s%2Fg%2F11clpxxvx5?hl=en-US&entry=ttu')
            cy.get('[data-testid="submission-form-mapLatitude"]').find('input').type('35.437123')
            cy.get('[data-testid="submission-form-mapLongitude"]').find('input').type('139.651471')
            cy.get('[data-testid="submission-form-doctor-search"]').type('Aya Yumino')
        })

        it('should be able to select a field', () => {
            cy.get('[data-testid="submission-form-prefectureEn"]').select('Hokkaido')
            cy.get('[data-testid="submission-form-prefectureJp"]').select('北海道')
        })

        it('should be display error messages', () => {

            cy.get('[data-testid="submission-form-nameEn"]').find('input').type('立川中央病院').blur()
            cy.get('[data-testid="submission-form-nameEn"]').find('p').should('exist').contains('Invalid English Name')

            cy.get('[data-testid="submission-form-nameJp"]').find('input').type('Tachikawa Hospital').blur()
            cy.get('[data-testid="submission-form-nameJp"]').find('p').should('exist').contains('Invalid Japanese Name')

            cy.get('[data-testid="submission-form-phone"]').find('input').type('Hello').blur()
            cy.get('[data-testid="submission-form-phone"]').find('p').should('exist').contains('Invalid Phone Number')

            cy.get('[data-testid="submission-form-email"]').find('input').type('example').blur()
            cy.get('[data-testid="submission-form-email"]').find('p').should('exist').contains('Invalid Email Address')

            cy.get('[data-testid="submission-form-website"]').find('input').type('example').blur()
            cy.get('[data-testid="submission-form-website"]').find('p').should('exist').contains('Invalid Website URL')

            cy.get('[data-testid="submission-form-postalCode"]').find('input').type('180-0').blur()
            cy.get('[data-testid="submission-form-postalCode"]').find('p').should('exist').contains('Invalid Zip Code')

            cy.get('[data-testid="submission-form-cityEn"]').find('input').type('渋谷区').blur()
            cy.get('[data-testid="submission-form-cityEn"]').find('p').should('exist').contains('Invalid English City Name')

            cy.get('[data-testid="submission-form-addressLine1En"]').find('input').type('道の駅').blur()
            cy.get('[data-testid="submission-form-addressLine1En"]').find('p').should('exist').contains('Invalid English Address')

            cy.get('[data-testid="submission-form-addressLine2En"]').find('input').type('道の駅').blur()
            cy.get('[data-testid="submission-form-addressLine2En"]').find('p').should('exist').contains('Invalid English Address')

            cy.get('[data-testid=submission-form-cityJp]').find('input').type('Shibuya').blur()
            cy.get('[data-testid=submission-form-cityJp]').find('p').should('exist').contains('Invalid Japanese City Name')


            cy.get('[data-testid="submission-form-addressLine1Jp"]').find('input').type('Peanutbutter street').blur()
            cy.get('[data-testid="submission-form-addressLine1Jp"]').should('exist').contains('Invalid Japanese Address')

            cy.get('[data-testid="submission-form-addressLine2Jp"]').find('input').type('Jelly street').blur()
            cy.get('[data-testid="submission-form-addressLine2Jp"]').should('exist').contains('Invalid Japanese Address')

            cy.get('[data-testid="submission-form-mapLatitude"]').find('input').type('Not Number Latitude').blur()
             cy.get('[data-testid="submission-form-mapLatitude"]').find('p').should('exist').contains('Invalid Latitude')

            cy.get('[data-testid="submission-form-mapLongitude"]').find('input').type('Not Number Longitude').blur()
            cy.get('[data-testid="submission-form-mapLongitude"]').find('p').should('exist').contains('Invalid Longitude')
        })
    })
})
