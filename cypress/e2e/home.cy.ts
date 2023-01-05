describe('Visits the home page', () => {
    before(() => {
        cy.visit('/')
    })
    it('Displays the Hero Section', () => {
        cy.get('#search-button').contains('Search')
    })
})
