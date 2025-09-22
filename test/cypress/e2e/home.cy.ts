import { Locale, Specialty } from '../../../typedefs/gqlTypes'

describe('Visits the home page', () => {
    const googleForm = 'https://forms.gle/4E763qfaq46kEsn99'
    const netlify = 'https://www.netlify.com/'

    context('Landscape mode', () => {
        before(() => {
            cy.skipOnboardingFlow()
            cy.visit('/')
        })

        beforeEach(() => {
            // The resolution is in the beforeEach() instead of before() to
            // prevent Cypress from defaulting to other screen sizes between tests.
            cy.viewport('macbook-16')
        })

        it('Displays the Logo', () => {
            cy.get('[data-testid="landscape-logo"]')
                .should('be.visible')
                .contains('Find a Doc Japan')
        })

        it('renders the map', () => {
            cy.get('[data-testid="map-of-japan"]').should('be.visible')
        })

        it.skip('allows setting search fields', () => {
            cy.get('[data-testid="filters-panel-summary"]').should('be.visible')

            cy.get('.search-specialty select').select(Specialty.Dermatology)
            cy.get('.search-specialty select').should('be.visible', 'Dermatology')

            cy.get('.search-language select').select(Locale.EnUs)
            cy.get('.search-language select').should('be.visible', 'English')
        })

        it('can select "select a display language"', () => {
            cy.get('[data-testid="locale-selector"]:visible').trigger('click')
        })

        it('can select "English" from the language bar', () => {
            cy.get('[data-testid="locale-selector"]:visible select')
                .should('exist')
                .select('en_US') // Select by value

            cy.get('[data-testid="locale-selector"]:visible select')
                .should('have.value', 'en_US')
        })

        it('can select "Japanese" from the language bar', () => {
            cy.get('[data-testid="locale-selector"]:visible select')
                .should('exist')
                .select('ja_JP') // Select by value

            cy.get('[data-testid="locale-selector"]:visible select')
                .should('have.value', 'ja_JP')
        })

        it('does not show the hamburger component', () => {
            cy.get('[data-testid="hamburger-menu-icon"]').should('not.be.visible')
        })

        it.skip('shows doctors nearby', () => {
            cy.contains('Doctors Nearby').should('be.visible')
        })

        describe('Checks footer links', () => {
            // verify link to GitHub
            it('navigates to github', () => {
                cy.get('[data-testid="github-link"]').should('be.visible')
                cy.get('[data-testid="github-link"]').should(
                    'have.attr',
                    'href',
                    'https://github.com/ourjapanlife/findadoc-web/'
                )
            })

            // verify feedback link
            it('navigates to the feedback page', () => {
                cy.get('[data-testid="feedback-link"]').should('be.visible')
                cy.get('[data-testid="feedback-link"]').should(
                    'have.attr',
                    'href',
                    googleForm
                )
            })

            // verify Netlify citation
            it('navigates to the netlify page', () => {
                cy.get('[data-testid="netlify-link"]').should('be.visible')
                cy.get('[data-testid="netlify-link"]').should(
                    'have.attr',
                    'href',
                    netlify
                )
            })

            // privacy - this link is being covered in the UI
            it.skip('naviagtes to private policy', () => {
                cy.get('[data-testid="privacy-link"]').should('be.visible')
                cy.get('[data-testid="privacy-link').click()
                cy.url().should('include', '/privacypolicy')
            })

            // terms
            it('navigates to the terms page', () => {
                cy.get('[data-testid="terms-link"]').should('be.visible')
                cy.get('[data-testid="terms-link').click()
                cy.url().should('include', '/terms')
            })
        })
    })
    // Portrait mode tests - usually for mobile and tablet
    context('Portrait mode', () => {
        before(() => {
            cy.skipOnboardingFlow()
            cy.visit('/')
        })

        beforeEach(() => {
            // The resolution is in the beforeEach() instead of before() to
            // prevent Cypress from defaulting to other screen sizes between tests.

            cy.viewport('iphone-5')
        })

        it('shows the logo', () => {
            cy.get('[data-testid="portrait-logo"]').should('exist').should('be.visible')
        })

        it('does not show the landscape searchbar', () => {
            cy.get('[data-testid="search-landscape"]').should('not.exist')
        })

        it('renders the map', () => {
            cy.get('[data-testid="map-of-japan"]').should('be.visible')
        })

        //
        it.skip('shows doctors nearby', () => {
            cy.contains('Doctors Nearby').should('be.visible')
        })

        describe('Hamburger Menu tests', () => {
            it('shows the hamburger icon', () => {
                // The hamburger menu conditionally renders based on screen orientation
                cy.get('[data-testid="hamburger-menu-icon"]').should('exist').should('be.visible')
            })

            it('can open and close the hamburger component', () => {
                cy.get('[data-testid="hamburger-menu-icon"]').should('exist').click()
                cy.get('[data-testid="hamburger-menu"]').should('exist').should('be.visible')
                cy.get('[data-testid="hamburger-menu-close-button"]').should('exist').click()
            })

            it('navigates to netlify', () => {
                // This link is required by Netlify for our open source license.
                cy.get('[data-testid="hamburger-menu-icon"]').click()

                // Verify that the link shows and has the right url generated.
                cy.get('[data-testid="hamburger-menu-footer-dev-links-netlify"]').should('be.visible')
                cy.get('[data-testid="hamburger-menu-footer-dev-links-netlify"]').should(
                    'have.attr',
                    'href',
                    'https://www.netlify.com'
                )
                cy.get('[data-testid="hamburger-menu-close-button"]').should('exist').click()
            })

            // privacy
            it.skip('navigates to privacy policy', () => {
                // Open the hamburger menu
                cy.get('[data-testid="hamburger-menu-icon"]').click()
                cy.get('[data-testid="hamburger-menu-footer-legal-privacy"]').should('be.visible')
                cy.get('[data-testid="hamburger-menu-footer-legal-privacy').click()
                // Verify navigation
                cy.url().should('include', '/privacypolicy')
            })

            // terms
            it.skip('navigates to the terms page', () => {
                // Open the hamburger menu
                cy.get('[data-testid="hamburger-menu-icon"]').click()
                cy.get('[data-testid="hamburger-menu-footer-legal-terms"]').should('be.visible')
                cy.get('[data-testid="hamburger-menu-footer-legal-terms').click()
                // Verify navigation
                cy.url().should('include', '/terms')
                cy.get('[data-testid="hamburger-menu-close-button"]').should('exist').click()
            })

            // copyright
            it.skip('copyright is visible', () => {
                cy.get('[data-testid="hamburger-menu-icon"]').click()
                cy.get('[data-testid="hamburger-menu"]').should('be.visible')
                cy.get('[data-testid="hamburger-menu-footer-copyright"]').should('exist').should('be.visible')
                cy.get('[data-testid="hamburger-menu-close-button"]').should('exist').click()
            })

            // theme switcher
            it.skip('shows the theme switcher', () => {
                // Open the hamburger menu
                cy.get('[data-testid="hamburger-menu-icon"]').click()
                cy.get('[data-testid="hamburger-menu-theme-switcher"]').should('exist').should('be.visible')
                cy.get('[data-testid="hamburger-menu-close-button"]').should('exist').click()
            })
        })
    })
})
