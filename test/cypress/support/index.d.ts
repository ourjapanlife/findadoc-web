/* eslint-disable @typescript-eslint/no-unused-vars */
/*
Reference:
https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense
*/
declare namespace Cypress {
    interface Chainable<Subject> {
        moderationLogin(): Chainable<unknown>
        getElement(testId: string): Chainable<unknown>
    }
}
