describe("Visits the home page", () => {
    const googleForm = "https://forms.gle/4E763qfaq46kEsn99"
    const netlify = "https://www.netlify.com/"

    context('Landscape mode', () => {
        before(() => {
            cy.viewport(1920, 1080)
            cy.visit("/")
        })

        it("Displays the Logo", () => {
            cy.get('[data-testid="landscape-logo"]')
                .should("be.visible")
                .contains("Find a Doc Japan")
            // TODO: clicking it should take us to '/'
        })

        it("Displays loading SVG on visit", () => {
            cy.get('[data-testid="svg-loading-icon"]').should("be.visible")
        })

        it("renders the map", () => {
            cy.get('[data-testid="map-of-japan"]').should("be.visible")
        })

        it("allows setting search fields", () => {
            cy.wait(5000)
            cy.get('[data-testid="search-button"]').should("be.visible")

            cy.get(".search-specialty select").select("Dermatology")
            cy.get(".search-specialty select").should("be.visible", "Dermatology")

            cy.get(".search-location select").select("Shinagawa")
            cy.get(".search-location select").should("be.visible", "Shinagawa")

            cy.get(".search-language select").select("English")
            cy.get(".search-language select").should("be.visible", "English")
        })

        it('can select "select a language"', () => {
            cy.get('[data-testid="search-bar-language"]').trigger("click")
        })

        it('can select "English" from the language bar', () => {
            cy.get('[data-testid="search-bar-language"]').should("be.visible")

            cy.get('[data-testid="search-bar-language"]').select("English")

            cy.get('[data-testid="search-bar-language"]').should(
                "have.value",
                "en_US"
            )
        })

        it('can select "Japanese" from the language bar', () => {
            cy.get('[data-testid="search-bar-language"]').should("be.visible")

            cy.get('[data-testid="search-bar-language"]').select("日本語")

            cy.get('[data-testid="search-bar-language"]').should(
                "have.value",
                "ja_JP"
            )
        })

        it('does not show the hamburger component', () => {
            cy.get('[data-testid="hamburger-menu-icon"]').should("not.be.visible")
        })


        it("shows doctors nearby", () => {
            cy.contains("Doctors Nearby").should("be.visible")
        })

        describe("Checks footer links", () => {
            it("navigates to github", () => {
                // TODO

                // verify link to GitHub
                cy.get('[data-testid="github-link"]').should("be.visible")
                cy.get('[data-testid="github-link"]').should(
                    "have.attr",
                    "href",
                    "https://github.com/ourjapanlife/findadoc-web/"
                )
            })

            // verify feedback link
            it("navigates to the feedback page", () => {
                cy.get('[data-testid="feedback-link"]').should("be.visible")
                cy.get('[data-testid="feedback-link"]').should(
                    "have.attr",
                    "href",
                    googleForm
                )
            })

            // verify Netlify citation
            it("navigates to the netlify page", () => {
                cy.get('[data-testid="netlify-link"]').should("be.visible")
                cy.get('[data-testid="netlify-link"]').should(
                    "have.attr",
                    "href",
                    netlify
                )
            })

            // privacy
            it("naviagtes to private policy", () => {
                cy.get('[data-testid="privacy-link"]').should("be.visible")
                cy.get('[data-testid="privacy-link').click()
                cy.url().should("include", "/privacypolicy")
            })

            // terms
            it("navigates to the terms page", () => {
                cy.get('[data-testid="terms-link"]').should("be.visible")
                cy.get('[data-testid="terms-link').click()
                cy.url().should("include", "/terms")
            })
        })


        describe("Visits the about page", () => {
            before(() => {
                cy.visit("/about")
            })

            it("Displays the main content", () => {
                cy.get('[data-testid="about-heading"]').should("be.visible")
                cy.get('[data-testid="about-subheading"]').should("be.visible")
            })

            it("Displays the members section", () => {
                cy.get('[data-testid="members-header"]').should("be.visible")
                cy.get('[data-testid="member"]').should("have.length.gte", 5)
            })

            it("Allows navigating to external links", () => {
                cy.get('[data-testid="member-linkedin"]')
                    .first()
                    .should("have.attr", "href")
                    .and("include", "linkedin.com")
                cy.get('[data-testid="member-github"]')
                    .first()
                    .should("have.attr", "href")
                    .and("include", "github.com")
            })
        })
    })

    // Portrait mode tests - usually for mobile and tablet
    context('Portrait mode', () => {
        beforeEach(() => {
            cy.viewport('iphone-5')
            cy.visit('/')

            //need to wait for the page+data to load so the menu will open properly
            cy.wait(500)
        })

        it('shows the logo', () => {
            cy.get('[data-testid="portrait-logo"]').should('exist').should('be.visible')
        })

        it('does not show the landscape searchbar', () => {
            cy.get('[data-testid="landscape-searchbar"]').should("not.be.visible")
        })

        it("renders the map", () => {
            cy.get('[data-testid="map-of-japan"]').should("be.visible")
        })

        it("shows doctors nearby", () => {
            cy.contains("Doctors Nearby").should("be.visible")
        })

        describe("Hamburger Menu tests", () => {
            it('shows the hamburger icon', () => {
                //this conditionally renders based on screen orientation
                cy.get('[data-testid="hamburger-menu-icon"]').should('exist').should('be.visible')
            })

            it('can open the hamburger component', () => {
                cy.get('[data-testid="hamburger-menu-icon"]').should('exist').click()
                cy.get('[data-testid="hamburger-menu"]').should('exist').should('be.visible')
            })

            // netlify link
            it("navigates to netlify", () => {
                // This link is required by netlify for our open source license. make sure it shows

                //open the hamburger menu
                cy.get('[data-testid="hamburger-menu-icon"]').click()

                // verify link shows and has the right url generated
                cy.get('[data-testid="hamburger-menu-footer-dev-links-netlify"]').should("be.visible")
                cy.get('[data-testid="hamburger-menu-footer-dev-links-netlify"]').should(
                    "have.attr",
                    "href",
                    "https://www.netlify.com"
                )
            })

            // privacy
            it("navigates to privacy policy", () => {
                //open the hamburger menu
                cy.get('[data-testid="hamburger-menu-icon"]').click()

                cy.get('[data-testid="hamburger-menu-footer-legal-privacy"]').should("be.visible")
                cy.get('[data-testid="hamburger-menu-footer-legal-privacy').click()
                // verify navigation
                cy.url().should("include", "/privacypolicy")
            })

            // terms
            it("navigates to the terms page", () => {
                //open the hamburger menu
                cy.get('[data-testid="hamburger-menu-icon"]').click()

                cy.get('[data-testid="hamburger-menu-footer-legal-terms"]').should("be.visible")
                cy.get('[data-testid="hamburger-menu-footer-legal-terms').click()
                // verify navigation
                cy.url().should("include", "/terms")
            })

            // copyright
            it('copyright is visible', () => {
                //open the hamburger menu
                cy.get('[data-testid="hamburger-menu-icon"]').click()

                cy.get('[data-testid="hamburger-menu-footer-copyright"]').should('exist').should('be.visible')
            })
        })
    })

})
