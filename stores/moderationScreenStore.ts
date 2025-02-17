import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export enum ModerationScreen {
    Dashboard = 'DASHBOARD',
    EditSubmission = 'EDIT_SUBMISSION',
    EditHealthcareProfessional = 'EDIT_HEALTHCARE_PROFESSIONAL',
    EditFacility = 'EDIT_FACILITY'
}

export enum ModSubmissionLeftNavbarSectionIDs {
    Addresses = 'ADDRESSES',
    ChangeLog = 'CHANGE_LOG',
    ContactInformation = 'CONTACT_INFORMATION',
    GoogleMapsInformation = 'GOOGLE_MAPS_INFORMATION',
    HealthcareProfessionalIds = 'HEALTHCARE_PROFESSIONAL_IDS',
    HealthcareProfessionalMedicalInfo = 'HEALTHCARE_PROFESSIONAL_MEDICAL_INFO',
    HealthcareProfessionalName = 'HEALTHCARE_PROFESSIONAL_NAME'
}

export enum ModEditFacilityLeftBarSectionIDs {
    Addresses = 'ADDRESSES',
    ContactInformation = 'CONTACT_INFORMATION',
    GoogleMapsInformation = 'GOOGLE_MAPS_INFORMATION',
    HealthcareProfessionalIds = 'HEALTHCARE_PROFESSIONAL_IDS',
    HealthcareProfessionalToAdd = 'HEALTHCARE_PROFESSIONAL_TO_ADD',
    CurrentHealthcareProfessionalsAtFacility = 'CURRENT_HEALTHCARE_PROFESSIONALS_AT_FACILITY'
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
