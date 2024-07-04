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
            cy.get('[data-testid="map-of-japan"]').should('not.exist')
        })
    })
})
