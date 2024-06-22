describe('Visits the home page', () => {
    const googleForm = 'https://forms.gle/4E763qfaq46kEsn99'
    const netlify = 'https://www.netlify.com/'

    context('Landscape mode', () => {
        before(() => {
            cy.visit('/')
            // This wait time is to give the page time to load from Prod when ran in CI.
            cy.wait(3000)
        })

        beforeEach(() => {
            // The resolution is in the beforeEach() instead of before() to
            // prevent Cypress from defaulting to other screen sizes between tests.
            cy.viewport(1920, 1080)
            cy.wait(500)
        })

        it('Displays the Logo', () => {
            cy.get('[data-testid="landscape-logo"]')
                .should('be.visible')
                .contains('Find a Doc Japan')
        })

        it('renders the map', () => {
            cy.get('[data-testid="map-of-japan"]').should('be.visible')
        })

        it('allows setting search fields', () => {
            cy.wait(5000)
            cy.get('[data-testid="search-button"]').should('be.visible')

            cy.get('.search-specialty select').select('Dermatology')
            cy.get('.search-specialty select').should('be.visible', 'Dermatology')

            cy.get('.search-location select').select('Shinagawa')
            cy.get('.search-location select').should('be.visible', 'Shinagawa')

            cy.get('.search-language select').select('English')
            cy.get('.search-language select').should('be.visible', 'English')
        })

        it('can select "select a language"', () => {
            cy.get('[data-testid="search-bar-language"]').trigger('click')
        })

        it('can select "English" from the language bar', () => {
            cy.get('[data-testid="search-bar-language"]').should('be.visible')

            cy.get('[data-testid="search-bar-language"]').select('English')

            cy.get('[data-testid="search-bar-language"]').should(
                'have.value',
                'en_US'
            )
        })

        it('can select "Japanese" from the language bar', () => {
            cy.get('[data-testid="search-bar-language"]').should('be.visible')

            cy.get('[data-testid="search-bar-language"]').select('日本語')

            cy.get('[data-testid="search-bar-language"]').should(
                'have.value',
                'ja_JP'
            )
        })

        it('does not show the hamburger component', () => {
            cy.get('[data-testid="hamburger-menu-icon"]').should('not.be.visible')
        })

        it('shows doctors nearby', () => {
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

            // privacy
            it('naviagtes to private policy', () => {
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
            cy.visit('/')
            // This wait time is to give the page time to load from Prod when ran in CI.
            cy.wait(3000)
        })

        beforeEach(() => {
            // The resolution is in the beforeEach() instead of before() to
            // prevent Cypress from defaulting to other screen sizes between tests.

            // An iPhone 5 screen resolution is used to test portrait mode.
            cy.viewport(640, 1136)
            cy.wait(500)
        })

        it('shows the logo', () => {
            cy.get('[data-testid="portrait-logo"]').should('exist').should('be.visible')
        })

        it('does not show the landscape searchbar', () => {
            cy.get('[data-testid="landscape-searchbar"]').should('not.be.visible')
        })

        it('renders the map', () => {
            cy.get('[data-testid="map-of-japan"]').should('be.visible')
        })

        it('shows doctors nearby', () => {
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
            it('navigates to privacy policy', () => {
                // Open the hamburger menu
                cy.get('[data-testid="hamburger-menu-icon"]').click()
                cy.get('[data-testid="hamburger-menu-footer-legal-privacy"]').should('be.visible')
                cy.get('[data-testid="hamburger-menu-footer-legal-privacy').click()
                // Verify navigation
                cy.url().should('include', '/privacypolicy')
            })

            // terms
            it('navigates to the terms page', () => {
                // Open the hamburger menu
                cy.get('[data-testid="hamburger-menu-icon"]').click()
                cy.get('[data-testid="hamburger-menu-footer-legal-terms"]').should('be.visible')
                cy.get('[data-testid="hamburger-menu-footer-legal-terms').click()
                // Verify navigation
                cy.url().should('include', '/terms')
            })

            // copyright
            it('copyright is visible', () => {
                // Open the hamburger menu
                cy.get('[data-testid="hamburger-menu-icon"]').click()
                cy.get('[data-testid="hamburger-menu-footer-copyright"]').should('exist').should('be.visible')
                cy.get('[data-testid="hamburger-menu-close-button"]').should('exist').click()
            })
        })
    })
})
