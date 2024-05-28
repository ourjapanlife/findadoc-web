describe('Privacy Policy page', () => {
    context('Desktop resolution', () => {
        before(() => {
            cy.viewport(1920, 1080)
            cy.visit('/privacypolicy')
        })

        it('shows the desktop nav', () => {
            cy.get('[data-testid="desktop-nav"]').should('exist')
        });

        it('does not show the hamburger component', () => {
            cy.get('[data-testid="hamburger-component"]').should('not.exist')
        });

        it('has a heading', () => {
            cy.get('[data-testid="privacy-heading"]').should('exist')
        });

        it('has a subheading', () => {
            cy.get('[data-testid="privacy-subheading"]').should('exist')
        });

        it('shows the footer without scrolling', () => {
            cy.isInViewport('[data-testid="footer"]')
        });


    })

    context('iphone-5 resolution', () => {
        before(() => {
            cy.viewport('iphone-5')
            cy.visit('/privacypolicy')
        })

        it('shows the hamburger component', () => {
            cy.get('[data-testid="hamburger-component"]').should('exist')
        });

        it('does not show the desktop nav', () => {
            cy.get('[data-testid="desktop-nav"]').should('not.exist')
        });

        it('does not show the footer', () => {
            cy.get('[data-testid="footer"]').should('not.exist')
        });

    })
})
