import enUS from '../../i18n/locales/en.json'

describe('Submit page', () => {
    context('Desktop resolution', () => {
        before(() => {
            cy.visit('/submit')
            // This wait time is to give the page time to load from Prod when ran in CI.
            cy.wait(3000)
        })

        beforeEach(() => {
            // The resolution is in the beforeEach() instead of before() to
            // prevent Cypress from defaulting to other screen sizes between tests.
            cy.viewport(1920, 1080)
            cy.wait(500)
        })

        it('shows the desktop top nav', () => {
            cy.get('[data-testid="landscape-searchbar"]').should('exist').should('be.visible')
        })

        it('does not show the hamburger component', () => {
            cy.get('[data-testid="hamburger-menu-icon"]').should('not.be.visible')
        })

        it('has a heading', () => {
            cy.get('h1').should('have.attr', 'data-testid', 'submit-heading').contains(enUS.submitPage.heading)
        })

        it('has a subheading', () => {
            cy.get('[data-testid="submit-subheading"]').contains(enUS.submitPage.subheading)
        })

        it('has an input field for Google Maps', () => {
            cy.get('[data-testid="submit-input-googlemaps"]').should('have.match', 'input')
        })

        it('has an input field for last name', () => {
            cy.get('[data-testid="submit-input-lastname"]').should('have.match', 'input')
        })

        it('has an input field for first name', () => {
            cy.get('[data-testid="submit-input-firstname"]').should('have.match', 'input')
        })

        it('has a select field for language 1', () => {
            cy.get('[data-testid="submit-select-language1"]').should('have.match', 'select')
        })

        it('has a select field for language 2', () => {
            cy.get('[data-testid="submit-select-language2"]').should('have.match', 'select')
        })

        it('has a textarea for notes', () => {
            cy.get('[data-testid="submit-input-notes"]').should('have.match', 'textarea')
        })

        it('has a submit button', () => {
            cy.get('[data-testid="submit-submitbutton"]').should('have.match', 'button')
        })

        it('shows the footer without scrolling', () => {
            cy.get('[data-testid="footer"]').should('be.visible')
        })

        it('does not submit an incomplete form', () => {
            cy.get('[data-testid="submit-submitbutton"]').click()
            cy.get('[data-testid="submit-completed"]').should('not.be.visible')
        })

        it.skip('submits a complete form', () => {
            cy.get('[data-testid="submit-input-googlemaps"]').type('https://example.com')
            cy.get('[data-testid="submit-input-lastname"]').type('some last name')
            cy.get('[data-testid="submit-select-language1"]').select('日本語 (Japan)')
            cy.get('[data-testid="submit-submitbutton"]').click()
            cy.get('[data-testid="submit-completed"]').should('be.visible')
        })

        it('requires a URL starting with https://', () => {
            cy.get('[data-testid="submit-input-googlemaps"]').type('http://example.com')
            cy.contains(enUS.submitPage.googleMapsValidation).should('be.visible')
        })

        it('requires a last name of 30 characters or less', () => {
            cy.get('[data-testid="submit-input-lastname"]').type(' ')
            cy.contains(enUS.submitPage.lastNameValidation).should('be.visible')
            cy.get('[data-testid="submit-input-lastname"]').type('some last name under 30 characters')
            cy.contains(enUS.submitPage.lastNameValidation).should('not.be.visible')
            cy.get('[data-testid="submit-input-lastname"]').type('a'.repeat(80), { delay: 0 }).invoke('val').should('have.length', 30)
        })

        it('requires Spoken Language 1 to be selected', () => {
            cy.contains(enUS.submitPage.spokenLanguageValidation).should('be.visible')
            cy.get('[data-testid="submit-select-language1"]').select('日本語 (Japan)')
            cy.contains(enUS.submitPage.spokenLanguageValidation).should('not.be.visible')
        })
    })

    context('Portrait mode', () => {
        before(() => {
            cy.visit('/submit')
            // This wait time is to give the page time to load from Prod when ran in CI.
            cy.wait(3000)
        })

        beforeEach(() => {
            // The resolution is in the beforeEach() instead of before() to
            // prevent Cypress from defaulting to other screen sizes between tests.

            // An iPhone 5 screen resolution is used to test portrait mode.
            cy.viewport(640, 1136)
        })

        it('shows the hamburger component', () => {
            cy.get('[data-testid="hamburger-menu-icon"]').should('exist').should('be.visible')
        })

        it('does not show the landscape searchbar', () => {
            cy.get('[data-testid="landscape-searchbar"]').should('not.be.visible')
        })

        it('does not show the footer', () => {
            cy.get('[data-testid="footer"]').should('exist').should('not.be.visible')
        })
    })
})
