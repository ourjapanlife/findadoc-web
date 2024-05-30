import  {useModerationScreenStore} from "../../stores/moderationScreenStore"

describe('Privacy Policy page', () => {
    context('Desktop resolution', () => {
        before(() => {
            cy.viewport(1920, 1080)
            cy.visit('/moderation')
        })

        it('shows the moderation topbar', () => {
            cy.get('[data-testid="mod-topbar"]').should('exist')
        });

        it('finds the item submission container', () => {
            cy.get('[data-testid="submission-item-container"]').should('exist')
        });

        it('finds and clicks the first button in the container', () =>{ 
            cy.get('[data-testid="submission-item-container"]').should('exist').find('button').first().click().then(()=>{useModerationScreenStore().setActiveScreen(1)})
        });
       
       it('find the edit submission topbar', ()=>{
        cy.get('[data-testid="mod-edit-submission-topbar"]').should("be.visible")
       })


    })

 
})
