import 'cypress-real-events'
import enUS from '../../../i18n/locales/en.json'

describe('Submit page', () => {
    context('Desktop resolution', () => {
        before(() => {
            cy.visit('/submit', { timeout: 10000 })
        })

        beforeEach(() => {
            // The resolution is in the beforeEach() instead of before() to
            // prevent Cypress from defaulting to other screen sizes between tests.

            cy.viewport('macbook-16')
        })

        it('shows the desktop top nav', () => {
            cy.get('[data-testid="landscape-searchbar"]', { timeout: 10000 }).should('exist').should('be.visible')
        })

        it('does not show the hamburger component', () => {
            cy.get('[data-testid="hamburger-menu-icon"]', { timeout: 10000 }).should('not.be.visible')
        })

        it('has a heading', () => {
            cy.get('h1', { timeout: 10000 })
                .should('have.attr', 'data-testid', 'submit-heading').contains(enUS.submitPage.heading)
        })

        it('has a subheading', () => {
            cy.get('[data-testid="submit-subheading"]', { timeout: 10000 }).contains(enUS.submitPage.subheading)
        })

        it('has an input field for Google Maps', () => {
            cy.get('[data-testid="submit-input-googlemaps"]', { timeout: 10000 }).should('have.match', 'input')
        })

        it('has an input field for last name', () => {
            cy.get('[data-testid="submit-input-lastname"]', { timeout: 10000 }).should('have.match', 'input')
        })

        it('has an input field for first name', () => {
            cy.get('[data-testid="submit-input-firstname"]', { timeout: 10000 }).should('have.match', 'input')
        })

        it('has a select field for language 1', () => {
            cy.get('[data-testid="submit-select-language1"]', { timeout: 10000 }).should('have.match', 'select')
        })

        it('has a select field for language 2', () => {
            cy.get('[data-testid="submit-select-language2"]', { timeout: 10000 }).should('have.match', 'select')
        })

        it('has a textarea for notes', () => {
            cy.get('[data-testid="submit-input-notes"]', { timeout: 10000 }).should('have.match', 'textarea')
        })

        it('has a submit button', () => {
            cy.get('[data-testid="submit-submitbutton"]', { timeout: 10000 }).should('have.match', 'button')
        })

        it('shows the footer without scrolling', () => {
            cy.get('[data-testid="footer"]', { timeout: 10000 }).should('be.visible')
        })

        it('does not submit an incomplete form', () => {
            cy.get('[data-testid="submit-submitbutton"]', { timeout: 10000 }).click()
            cy.get('[data-testid="submit-completed"]', { timeout: 10000 }).should('not.be.visible')
        })

        it.skip('submits a complete form', () => {
            cy.get('[data-testid="submit-input-googlemaps"]', { timeout: 10000 }).type('https://example.com')
            cy.get('[data-testid="submit-input-lastname"]', { timeout: 10000 }).type('some last name')
            cy.get('[data-testid="submit-select-language1"]', { timeout: 10000 }).select('日本語 (Japan)')
            cy.get('[data-testid="submit-submitbutton"]', { timeout: 10000 }).click()
            cy.get('[data-testid="submit-completed"]', { timeout: 10000 }).should('be.visible')
        })

        it('requires a URL starting with https://', () => {
            cy.get('[data-testid="submit-input-googlemaps"]', { timeout: 10000 }).type('http://example.com').blur()
            cy.contains(enUS.submitPage.googleMapsValidation).should('be.visible')
        })

        it('requires a last name of 30 characters or less', () => {
            const lastNameField = cy.get('[data-testid="submit-input-lastname"]', { timeout: 10000 })
            const firstNameField = cy.get('[data-testid="submit-input-firstname"]', { timeout: 10000 })

            lastNameField.type(' ').blur()
            cy.contains(enUS.submitPage.lastNameValidation, { timeout: 10000 }).should('be.visible')

            lastNameField.clear().type('The Frog').blur()
            firstNameField.type('Kermy').blur()
            cy.contains(enUS.submitPage.firstNameValidation, { timeout: 10000 }).should('not.be.visible')

            lastNameField.clear().type('a'.repeat(80), { delay: 0 })
            lastNameField.invoke('val').should('have.length', 30)
        })

        it('requires Spoken Language 1 to be selected', () => {
            cy.contains(enUS.submitPage.spokenLanguageValidation, { timeout: 10000 }).should('be.visible')
            cy.get('[data-testid="submit-select-language1"]', { timeout: 10000 }).select('日本語 (Japan)')
            cy.contains(enUS.submitPage.spokenLanguageValidation, { timeout: 10000 }).should('not.be.visible')
        })
    })

    context('Portrait mode', () => {
        before(() => {
            cy.visit('/submit', { timeout: 10000 })
        })

        beforeEach(() => {
            cy.viewport('iphone-5')
        })

        it('shows the hamburger component', () => {
            cy.get('[data-testid="hamburger-menu-icon"]', { timeout: 10000 }).should('exist').should('be.visible')
        })

        it('does not show the landscape searchbar', () => {
            cy.get('[data-testid="landscape-searchbar"]', { timeout: 10000 }).should('not.be.visible')
        })

        it('does not show the footer', () => {
            cy.get('[data-testid="footer"]').should('exist', { timeout: 10000 }).should('not.be.visible')
        })
    })
})
