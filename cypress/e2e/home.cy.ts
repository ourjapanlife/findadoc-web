describe('Visits the home page', () => {
    before(() => {
        cy.visit('/')
    })
    it('Displays the Hero Section', () => {
        cy.get('[data-testid="searchbutton"]').should('be.visible')
    })
})
