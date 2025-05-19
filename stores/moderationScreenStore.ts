import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export enum ModerationScreen {
    CreateHealthcareProfessional = 'CREATE_HEALTHCARE_PROFESSIONAL',
    Dashboard = 'DASHBOARD',
    EditSubmission = 'EDIT_SUBMISSION',
    CreateFacility = 'CREATE_FACILITY',
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

export enum ModHealthcareProfessionalsLeftNavbarSections {
    HealthcareProfessionalIds = 'HEALTHCARE_PROFESSIONAL_IDS',
    HealthcareProfessionalMedicalInfo = 'HEALTHCARE_PROFESSIONAL_MEDICAL_INFO',
    HealthcareProfessionalName = 'HEALTHCARE_PROFESSIONAL_NAME',
    HealthcareProfessionalFacilities = 'HEALTHCARE_PROFESSIONAL_FACILITIES'
}

export const useModerationScreenStore = defineStore(
    'moderationScreenStore',
    () => {
        const activeScreen: Ref<ModerationScreen> = ref(ModerationScreen.Dashboard)

        function setActiveScreen(newValue: ModerationScreen) {
            activeScreen.value = newValue
        }

        function createHealthcareProfessionalScreenIsActive() {
            return activeScreen.value === ModerationScreen.CreateHealthcareProfessional
        }

        function dashboardScreenIsActive() {
            return activeScreen.value === ModerationScreen.Dashboard
        }

        function createFacilityScreenIsActive() {
            return activeScreen.value === ModerationScreen.CreateFacility
        }

        function editSubmissionScreenIsActive() {
            return activeScreen.value === ModerationScreen.EditSubmission
        }

        function editHealthcareProfessionalScreenIsActive() {
            return activeScreen.value === ModerationScreen.EditHealthcareProfessional
        }

        function editFacilityScreenIsActive() {
            return activeScreen.value === ModerationScreen.EditFacility
        }

        return {
            activeScreen,
            ModerationScreen,
            setActiveScreen,
            createHealthcareProfessionalScreenIsActive,
            dashboardScreenIsActive,
            createFacilityScreenIsActive,
            editSubmissionScreenIsActive,
            editHealthcareProfessionalScreenIsActive,
            editFacilityScreenIsActive
        }
    }
)
