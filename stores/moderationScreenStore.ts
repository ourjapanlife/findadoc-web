import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export enum ModerationScreen {
    'dashboard',
    'editSubmission'
}

export const useModerationScreenStore = defineStore('moderationScreenStore', () => {
    const activeScreen: Ref<ModerationScreen> = ref(ModerationScreen.dashboard)
    const enableModerationPanel: Ref<boolean> = ref(false)
    const fakeData = [
        { "id": "13243214", "name": "Name 1", "status": "forReview", "modified": "Modified 1", "submitted": "Submitted 1" },
        { "id": "252ewwe", "name": "Name 2", "status": "accepted", "modified": "Modified 2", "submitted": "Submitted 2" },
        { "id": "3dfdanns", "name": "Name 3", "status": "rejected", "modified": "Modified 3", "submitted": "Submitted 3" }
    ]
    const selectedSubmissionId = ''

    function setActiveScreen(newValue: ModerationScreen) {
        activeScreen.value = newValue
        console.log(`activeScreen set to: ${activeScreen.value}`)
    }

    function setEnableModerationPanelToTrue(currentPath: string) {
        process.env.ENABLE_MODERATION_PANEL && currentPath.includes("moderation") ? enableModerationPanel.value = true : null
    }

    return { activeScreen, enableModerationPanel, fakeData, ModerationScreen, selectedSubmissionId, setActiveScreen, setEnableModerationPanelToTrue }
})
