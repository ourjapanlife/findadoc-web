import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export enum ModerationScreen {
    Dashboard = 'DASHBOARD',
    EditSubmission = 'EDIT_SUBMISSION',
    EditHealthcareProfessional = 'EDIT_HEALTHCARE_PROFESSIONAL',
    EditFacility = 'EDIT_FACILITIY'
}

export const useModerationScreenStore = defineStore(
    'moderationScreenStore',
    () => {
        const activeScreen: Ref<ModerationScreen> = ref(ModerationScreen.Dashboard)

        function setActiveScreen(newValue: ModerationScreen) {
            activeScreen.value = newValue
        }

        return { activeScreen, ModerationScreen, setActiveScreen }
    }
)
