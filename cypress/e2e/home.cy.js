describe('Visits the home page', () => {
    before(() => {
        //cy.catchNuxtProxyError()
        cy.visit('/')
        cy.on('uncaught:exception', err => {
            // eslint-disable-next-line no-console
            console.log(err)

            return false
        })
    })
    it('Displays the Hero Section', () => {
        cy.get('.h-full ').contains('The open-source project that\'s helping Japan get vaccinated')
    })
})
