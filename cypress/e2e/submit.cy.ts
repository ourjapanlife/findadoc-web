import enUS from '../../i18n/locales/en.json'

describe('Submit page', () => {
    context('Desktop resolution', () => {
        beforeEach(() => {
            cy.viewport(1920, 1080)
            cy.visit('/submit')
        })

        it('shows the desktop nav', () => {
            cy.get('[data-testid="desktop-nav"]').should('exist')
        });

        it('does not show the hamburger component', () => {
            cy.get('[data-testid="hamburger-component"]').should('not.exist')
        });

        it('has a heading', () => {
            cy.get('h1').should('have.attr', 'data-testid', 'submit-heading').contains(enUS.submitPage.heading)
        });

        it('has a subheading', () => {
            cy.get('[data-testid="submit-subheading"]').contains(enUS.submitPage.subheading)
        });

        it('has an input field for Google Maps', () => {
            cy.get('[data-testid="submit-input-googlemaps"]').should('have.match', 'input')
        });

        it('has an input field for last name', () => {
            cy.get('[data-testid="submit-input-lastname"]').should('have.match', 'input')
        });

        it('has an input field for first name', () => {
            cy.get('[data-testid="submit-input-firstname"]').should('have.match', 'input')
        });

        it('has a select field for language 1', () => {
            cy.get('[data-testid="submit-select-language1"]').should('have.match', 'select')
        });

        it('has a select field for language 2', () => {
            cy.get('[data-testid="submit-select-language2"]').should('have.match', 'select')
        });

        it('has a textarea for notes', () => {
            cy.get('[data-testid="submit-input-notes"]').should('have.match', 'textarea')
        });

        it('has a submit button', () => {
            cy.get('[data-testid="submit-submitbutton"]').should('have.match', 'button')
        });

        it('shows the footer without scrolling', () => {
            cy.isInViewport('[data-testid="footer"]')
        });

        it('shows the footer without scrolling', () => {
            cy.isInViewport('[data-testid="footer"]')
        });


    })

    context('iphone-5 resolution', () => {
        beforeEach(() => {
            cy.viewport('iphone-5')
            cy.visit('/submit')
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

    context('form validation', () => {
        beforeEach(() => {
            cy.visit('/submit')
            cy.wait(500) // wait for the vue components to actually load
        })

        it('does not submit an incomplete form', () => {
            cy.get('[data-testid="submit-submitbutton"]').click()
            cy.get('[data-testid="submit-completed"]').should('not.be.visible')
        });

        it('submits a complete form', () => {
            cy.get('[data-testid="submit-input-googlemaps"]').type('https://example.com')
            cy.get('[data-testid="submit-input-lastname"]').type('some last name')
            cy.get('[data-testid="submit-select-language1"]').select('日本語 (Japan)')
            cy.get('[data-testid="submit-submitbutton"]').click()
            cy.get('[data-testid="submit-completed"]').should('be.visible')
        });

        it('requires a URL starting with https://', () => {
            cy.get('[data-testid="submit-input-googlemaps"]').type('http://example.com')
            cy.contains(enUS.submitPage.googleMapsValidation).should('be.visible')
        });

        it.only('requires a last name of 75 characters or less', () => {
            cy.get('[data-testid="submit-input-lastname"]').type(' ')
            cy.contains(enUS.submitPage.lastNameValidation).should('be.visible')
            cy.get('[data-testid="submit-input-lastname"]').type('some last name under 75 characters')
            cy.contains(enUS.submitPage.lastNameValidation).should('not.be.visible')
            cy.get('[data-testid="submit-input-lastname"]').type('a'.repeat(80), { delay: 0 }).invoke('val').should('have.length', 75)
        });

        it('requires Spoken Language 1 to be selected', () => {
            cy.contains(enUS.submitPage.spokenLanguageValidation).should('be.visible')
            cy.get('[data-testid="submit-select-language1"]').select('日本語 (Japan)')
            cy.contains(enUS.submitPage.spokenLanguageValidation).should('not.be.visible')
        });

    })
})
