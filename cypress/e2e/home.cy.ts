describe('Visits the home page', () => {
    before(() => {
        cy.visit('/')
    })

    it('Displays the Logo', () => {
        cy.get('[data-testid="logo"]')
            .should('be.visible')
            .contains('Find a Doc Japan')
        // TODO: clicking it should take us to '/'
    })

    it('allows setting search fields', () => {
        cy.get('[data-testid="search-button"]').should('be.visible')
        // TODO
    })

    it.skip('selects a language', () => {
        // TODO
    })

    it.skip('renders the map', () => {
        // TODO
    })

    it.skip('shows doctors nearby', () => {

    })

    it.skip('displays the footer', () => {
        // TODO

        // verify link to GitHub

        // verify feedback link

        // verify Netlify citation

        // privacy

        // terms
    })
})
