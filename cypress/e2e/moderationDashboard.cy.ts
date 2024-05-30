import "cypress-real-events";
import { useModerationScreenStore } from "../../stores/moderationScreenStore"
import { createPinia, setActivePinia } from 'pinia'

describe('Moderation dashboard', {
    env: {
        ENABLE_MODERATION_PANEL: true,
    },
}, () => {
    before(() => {
        setActivePinia(
            createPinia()
        )

    }),
        context('Desktop resolution', () => {
            before(() => {
                cy.viewport(1920, 1080)
                cy.visit('/moderation')

            })

            it('it shows the moderation top nav', () => {
                const store = useModerationScreenStore();
                cy.get('[data-testid="mod-submission-list-item-1"]').contains('1').click().then(() => {
                    cy.log('Active screen:', store.activeScreen);
                    expect(store.activeScreen).to.equal(1);
                });
                cy.get('[data-testid="mod-edit-submission-copy-submission-id"]').click()


                let submissionId: string | number | string[]

                cy.get('[data-testid="mod-edit-submission-copy-submission-id"]').invoke('val').then(text => submissionId = text)

                // check that the value copied to the clipboard is the same that's displayed
                cy.window().its('navigator.clipboard').invoke('readText').should('equal', submissionId)
            });

        })
})
