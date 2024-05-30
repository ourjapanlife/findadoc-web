import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export enum ModerationScreen {
    'dashboard',
    'editSubmission'
}

export const useModerationScreenStore = defineStore('moderationScreenStore', () => {
    const activeScreen: Ref<ModerationScreen> = ref(ModerationScreen.dashboard)
    const enableModerationPanel: Ref<boolean> = ref(false)

    function setActiveScreen(newValue: ModerationScreen) {
        activeScreen.value = newValue
    }

    function setEnableModerationPanelToTrue ( currentPath:string){  
        process.env.ENABLE_MODERATION_PANEL && currentPath.includes("moderation") ? enableModerationPanel.value = true : null
    }

    return { activeScreen, enableModerationPanel, setActiveScreen, setEnableModerationPanelToTrue }
})