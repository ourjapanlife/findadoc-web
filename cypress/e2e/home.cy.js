describe('Visits the home page', () => {
    before(() => {
        cy.visit('/')
    })
    it('Displays the Hero Section', () => {
        cy.get('.h-full ').contains('The open-source project that\'s helping Japan get vaccinated')
    })
})
