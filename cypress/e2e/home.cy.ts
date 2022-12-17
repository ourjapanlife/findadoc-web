describe('Visits the home page', () => {
    before(() => {
        cy.visit('/')
    })
    it('Displays the Hero Section', () => {
        cy.get('h1').contains('Connecting people in Japan to the healthcare services they need, in the languages they need.')
    })
})
