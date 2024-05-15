import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { useRuntimeConfig } from "#imports"

export enum ModerationScreen {
    'dashboard',
    'editSubmission'
}

export const useModerationScreenStore = defineStore('moderationScreenStore', () => {
    const runtimeConfig = useRuntimeConfig();
    const activeScreen: Ref<ModerationScreen> = ref(ModerationScreen.dashboard)
    const enableModerationPanel: Ref<boolean> = ref(runtimeConfig.public.ENABLE_MODERATION_PANEL || false)

    function setActiveScreen(newValue: ModerationScreen) {
        activeScreen.value = newValue
    }

    return { activeScreen, enableModerationPanel, setActiveScreen }
})