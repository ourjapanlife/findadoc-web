import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export enum ModerationScreen {
    Dashboard = 'DASHBOARD',
    EditSubmission = 'EDIT_SUBMISSION',
    EditHealthcareProfessional = 'EDIT_HEALTHCARE_PROFESSIONAL',
    EditFacility = 'EDIT_FACILITIY'
}

export enum ModSubmissionLeftNavbarSectionIDs {
    Addresses = 'ADDRESSES',
    ChangeLog = 'CHANGE_LOG',
    ContactInformation = 'CONTACT_INFORMATION',
    GoogleMapsInformation = 'GOOGLE_MAPS_INFORMATION',
    HealthcareProfessionalIds = 'HEALTHCARE_PROFESSIONAL_IDS'
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
