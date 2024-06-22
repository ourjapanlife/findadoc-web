import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export enum ModerationScreen {
    dashboard = 'dashboard',
    editSubmission = 'editSubmission'
}

export const useModerationScreenStore = defineStore('moderationScreenStore', () => {
    const activeScreen: Ref<ModerationScreen> = ref(ModerationScreen.dashboard)
    const enableModerationPanel: Ref<boolean> = ref(false)

    const selectedSubmissionId = ref('')

    function setActiveScreen(newValue: ModerationScreen) {
        activeScreen.value = newValue
    }

    function setEnableModerationPanelToTrue(currentPath: string) {
        process.env.ENABLE_MODERATION_PANEL && currentPath.includes('moderation') ? enableModerationPanel.value = true : null
    }

    return {
        activeScreen,
        enableModerationPanel,
        ModerationScreen,
        selectedSubmissionId,
        setActiveScreen,
        setEnableModerationPanelToTrue
    }
})
