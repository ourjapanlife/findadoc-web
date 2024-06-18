describe('Privacy Policy page', () => {
    context('Landscape resolution', () => {
        beforeEach(() => {
            cy.viewport(1920, 1080)
            cy.visit('/privacypolicy')
        })

        it('shows the landscape top nav', () => {
            cy.get('[data-testid="landscape-searchbar"]').should('exist').should('be.visible')
        })

        it('does not show the hamburger component', () => {
            cy.get('[data-testid="hamburger-menu-icon"]').should("not.be.visible")
        })

        it('has a heading', () => {
            cy.get('[data-testid="privacy-heading"]').should('exist')
        })

        it('has a subheading', () => {
            cy.get('[data-testid="privacy-subheading"]').should('exist')
        })

        it('shows the footer without scrolling', () => {
            cy.get('[data-testid="footer"]').should('be.visible')
        })


    })

    context('Portrait mode', () => {
        beforeEach(() => {
            cy.viewport('iphone-5')
            cy.visit('/privacypolicy')
        })

        it('shows the hamburger component', () => {
            cy.get('[data-testid="hamburger-menu-icon"]').should('exist').should('be.visible')
        })

        it('does not show the landscape searchbar', () => {
            cy.get('[data-testid="landscape-searchbar"]').should("not.be.visible")
        })

        it('does not show the footer', () => {
            cy.get('[data-testid="footer"]').should('not.exist')
        })

    })
})
