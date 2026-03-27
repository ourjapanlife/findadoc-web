<template>
    <div class="mod-create-facility-hp-topbar flex justify-end h-full w-full">
        <div class="facility-hp-topbar-actions flex justify p-2 font-bold ">
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary hover:bg-currentColor
              border-2 w-28 text-lg mr-2"
                data-testid="mod-create-facility-hp-topbar-create"
                @click="createFacilityOrHealthcareProfessional"
            >
                <span>
                    {{ t('modCreateFacilityOrHPTopbar.create') }}
                </span>
            </button>
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
              border-2 w-28 text-lg mr-2"
                data-testid="mod-create-facility-hp-topbar-exit"
                @click="openExitConfirmation"
            >
                <span>
                    {{ t('modCreateFacilityOrHPTopbar.exit') }}
                </span>
            </button>
        </div>
        <div
            v-show="modalStore.isOpen"
            class="fixed top-0 left-0 flex items-center justify-center h-full w-full z-10 bg-secondary/40"
        >
            <Modal>
                <div
                    class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
                >
                    <span
                        class="font-bold text-3xl"
                    >
                        {{ t('modCreateFacilityOrHPTopbar.unsavedChangesMessage') }}
                    </span>
                    <button
                        class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                        type="button"
                        @click="navigateBackToDashboardWithoutCreation"
                    >
                        {{
                            t('modCreateFacilityOrHPTopbar.confirmExit') }}
                    </button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useI18n } from '#imports'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'
import { useModalStore } from '~/stores/modalStore'
import { useModerationSubmissionsStore, SelectedModerationListView } from '~/stores/moderationSubmissionsStore'
import { handleModerationResponseErrors } from '~/composables/useModerationResponseHandling'
import { returnWithSuccessToast } from '~/composables/useModerationActionFeedback'
import { guardWithErrorToast } from '~/composables/useModerationGuardFeedback'
import { hasEnglishLocalizedName } from '~/utils/nameUtils'
import { navigateToModerationDashboard } from '~/utils/moderationUtils'
import {
    hasRequiredHealthcareProfessionalSelections,
    validateModerationFacilityFields
} from '~/utils/moderationFormValidationUtils'

const router = useRouter()

// Initialize the stores in use
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()
const moderationScreenStore = useModerationScreenStore()
const modalStore = useModalStore()
const moderationSubmissionsStore = useModerationSubmissionsStore()

const toast = useToast()

const { t } = useI18n()

const validateFacilityFields = () => validateModerationFacilityFields(facilitiesStore.createFacilityFields)

const validateHealthcareProfessionalFields = () => {
    const healthcareProfessionalFields = healthcareProfessionalsStore.createHealthcareProfessionalSectionFields

    const areFacilityIdsAdded = !!healthcareProfessionalFields.facilityIds.length
    return areFacilityIdsAdded
      && hasRequiredHealthcareProfessionalSelections(healthcareProfessionalFields)
}

const createFacilityOrHealthcareProfessional = async () => {
    if (moderationScreenStore.createHealthcareProfessionalScreenIsActive()) {
        const healthcareProfessionalCreationSectionFields = healthcareProfessionalsStore.createHealthcareProfessionalSectionFields
        const hasEnglishName = hasEnglishLocalizedName(healthcareProfessionalCreationSectionFields.names)

        const hasEmptyRequiredFields = validateHealthcareProfessionalFields()

        if (guardWithErrorToast(
            !hasEnglishName,
            toast,
            t,
            'modCreateFacilityOrHPTopbar.healthcareProfessionalEnglishNameRequired'
        )) {
            return
        }

        if (guardWithErrorToast(
            !hasEmptyRequiredFields,
            toast,
            t,
            'modCreateFacilityOrHPTopbar.hasEmptyFieldsHealthcareProfessional'
        )) {
            return
        }

        const response = await healthcareProfessionalsStore.createHealthcareProfessional()

        if (handleModerationResponseErrors(response, toast, t)) {
            return response
        }

        returnWithSuccessToast(
            response,
            toast,
            t,
            'modCreateFacilityOrHPTopbar.heathcareProfessionalCreatedSuccessfully'
        )
        await navigateToModerationDashboard(router, moderationScreenStore)
        moderationSubmissionsStore.setSelectedModerationListViewChosen(SelectedModerationListView.HealthcareProfessionals)
        healthcareProfessionalsStore.resetCreateHealthcareProfessionalFields()
        return response
    }

    if (moderationScreenStore.createFacilityScreenIsActive()) {
        const validateCreateFacilityFields = validateFacilityFields()
        if (guardWithErrorToast(
            !validateCreateFacilityFields,
            toast,
            t,
            'modCreateFacilityOrHPTopbar.hasEmptyFieldsFacility'
        )) {
            return
        }
        const response = await facilitiesStore.createFacility()

        if (handleModerationResponseErrors(response, toast, t)) {
            return response
        }

        returnWithSuccessToast(
            response,
            toast,
            t,
            'modCreateFacilityOrHPTopbar.facilityCreatedSuccessfully'
        )
        await navigateToModerationDashboard(router, moderationScreenStore)
        moderationSubmissionsStore.setSelectedModerationListViewChosen(
            SelectedModerationListView.Facilities
        )
        facilitiesStore.resetCreateFacilityFields()
        return response
    }
}

const navigateBackToDashboardWithoutCreation = async () => {
    if (moderationScreenStore.createHealthcareProfessionalScreenIsActive()) {
        healthcareProfessionalsStore.resetCreateHealthcareProfessionalFields()
    }
    if (moderationScreenStore.createFacilityScreenIsActive()) {
        facilitiesStore.resetCreateFacilityFields()
    }
    await navigateToModerationDashboard(router, moderationScreenStore, modalStore)
}

const openExitConfirmation = () => {
    modalStore.showModal()
}
</script>
