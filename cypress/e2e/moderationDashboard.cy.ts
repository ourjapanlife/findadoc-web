import { useModerationScreenStore } from "../../stores/moderationScreenStore"
import { createPinia, setActivePinia } from 'pinia'
import "cypress-real-events";

describe('Moderation dashboard', {
    env: {
        ENABLE_MODERATION_PANEL: true,
    },
}, () => {
    beforeEach(() => {
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
                cy.get('[data-testid="mod-submission-list-item-1"]').wait(500).realClick().then(() => {
                    console.log('Active screen:', store.activeScreen);
                    // expect(store.activeScreen).to.equal(1);
                });
                cy.get('[data-testid="mod-edit-submission-copy-submission-id"]').wait(500).realClick()

                // check that the value copied to the clipboard is the same that's displayed
                console.log("store id ", store.selectedSubmissionId)
                cy.window().its('navigator.clipboard').invoke('readText').wait(4000).should('equal', store.selectedSubmissionId)
            });

        })
})
