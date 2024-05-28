import enUS from '../../i18n/locales/en.json'

describe('Submit page', () => {
    context('Desktop resolution', () => {
        before(() => {
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

        it('has an input field for notes', () => {
            cy.get('[data-testid="submit-input-notes"]').should('have.match', 'input')
        });

        it('has a submit button', () => {
            cy.get('[data-testid="submit-submitbutton"]').should('have.match', 'button')
        });

        it('shows the footer without scrolling', () => {
            cy.isInViewport('[data-testid="footer"]')
        });


    })

    context('iphone-5 resolution', () => {
        before(() => {
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
})
