export { }

declare global {
    namespace Cypress {
        interface Chainable {
            isInViewport(args?: string): Chainable<JQuery<HTMLElement>>,
            isNotInViewport(args?: string): Chainable<JQuery<HTMLElement>>,
        }
    }
}
