// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// https://github.com/dmtrKovalenko/cypress-real-events#readme
import 'cypress-real-events'

// https://www.npmjs.com/package/cypress-plugin-tab
import 'cypress-plugin-tab'

// https://docs.cypress.io/api/cypress-api/screenshot-api
// ! Be careful ! Enabling --record (Test Replay) hides the runner UI !
Cypress.Screenshot.defaults({
    capture: 'runner'
})
