describe('Visits the home page', () => {
    const googleForm = 'https://forms.gle/4E763qfaq46kEsn99'
    const netlify = 'https://www.netlify.com/'

    before(() => {
        cy.visit('/')
    })

    it('Displays the Logo', () => {
        cy.get('[data-testid="logo"]')
            .should('be.visible')
            .contains('Find a Doc Japan')
        // TODO: clicking it should take us to '/'
    })

    it('renders the map', () => {
        // TODO
        cy.get('[data-testid="map-of-japan"]')
            .should('have.attr', 'src')
            .and('not.be.empty')
    })

    it('allows setting search fields', () => {
        cy.get('[data-testid="search-button"]').should('be.visible')
        // TODO
    })

    it('can select "select a language"', () => {
        cy.get('[data-testid="search-bar-language"]').trigger('click')
        // TODO
    })

    it('can select "English" from the language bar', () => {
        cy.get('[data-testid="search-bar-language"]').should('be.visible')

        cy.get('[data-testid="search-bar-language"]').select('English')

        cy.get('[data-testid="search-bar-language"]').should('have.value', 'English')
    })

    it('can select "Japanese" from the language bar', () => {
        cy.get('[data-testid="search-bar-language"]').should('be.visible')

        cy.get('[data-testid="search-bar-language"]').select('Japanese')

        cy.get('[data-testid="search-bar-language"]').should('have.value', 'Japanese')
    })

    it('shows doctors nearby', () => {
        cy.contains('Doctors Nearby').should('be.visible')
    })

    describe('Checks footer links', () => {
        it('navigates to github', () => {
        // TODO

            // verify link to GitHub
            cy.get('[data-testid="github-link"]').should('be.visible')
            cy.get('[data-testid="github-link"]').should('have.attr', 'href', 'https://github.com/ourjapanlife/findadoc-web/')
        })

        // verify feedback link
        it('navigates to the feedback page', () => {
            cy.get('[data-testid="feedback-link"]').should('be.visible')
            cy.get('[data-testid="feedback-link"]').should('have.attr', 'href', googleForm)
        })

        // verify Netlify citation
        it('navigates to the netlify page', () => {
            cy.get('[data-testid="netlify-link"]').should('be.visible')
            cy.get('[data-testid="netlify-link"]').should('have.attr', 'href', netlify)
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
