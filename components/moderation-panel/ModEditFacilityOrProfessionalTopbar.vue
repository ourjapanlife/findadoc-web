<template>
    <div class="flex justify-between w-full">
        <div>
            <button
                data-testid="mod-edit-facility-hp-topbar-copy-id"
                class="flex w-90 bg-neutral p-2 m-2 border-2 border-inverted rounded hover"
                @click="copyFacilityOrHealthcareProfessionalId"
            >
                ID: {{ selectedId }}
                <SVGSuccessCheckMark
                    v-if="showCopySuccessIcon"
                    role="img"
                    title="clipboard copy"
                    class="ml-2 w-6"
                />
                <SVGCopyContent
                    v-if="!showCopySuccessIcon"
                    role="img"
                    title="successful copy"
                    class="ml-2 w-6"
                />
            </button>
        </div>
        <div class="facility-hp-topbar-actions flex justify p-2 font-bold ">
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="mod-edit-facility-hp-topbar-delete"
                @click="navigateBackToDashboard"
            >
                {{
                    t('modEditFacilityOrHPTopbar.back') }}
            </button>
            <button
                type="button"
                :disabled="!hasPendingChanges"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="mod-edit-facility-hp-topbar-update"
                @click="saveChanges"
            >
                <span>
                    {{ t('modEditFacilityOrHPTopbar.update') }}
                </span>
            </button>
            <button
                type="button"
                :disabled="!hasPendingChanges"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="mod-edit-facility-hp-topbar-update-and-exit"
                @click="saveChangesAndExit"
            >
                <span>
                    {{ t('modEditFacilityOrHPTopbar.updateAndExit') }}
                </span>
            </button>
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary border-2 w-28 text-sm mr-2 "
                data-testid="mod-edit-facility-hp-topbar-delete"
                @click="openDeleteConfirmation"
            >
                {{
                    t('modEditFacilityOrHPTopbar.delete') }}
            </button>
        </div>
        <div
            v-show="modalStore.isOpen"
            class="fixed top-0 left-0 flex items-center justify-center h-full w-full z-10 bg-secondary/40"
        >
            <Modal>
                <div
                    class="flex flex-col aspect-square h-96 items-center justify-center bg-primary-inverted p-10 rounded"
                >
                    <div
                        v-if="modalType === ModalType.DeleteConfirmation && moderationScreenStore.editFacilityScreenIsActive()"
                        class="flex flex-col items-center"
                    >
                        <div class="font-bold text-3xl">
                            {{ t('modEditFacilityOrHPTopbar.deleteConfirmationFacility', {
                                id: selectedId,
                                facility: facilitiesStore.selectedFacilityData?.nameEn,
                            }) }}
                        </div>
                        <button
                            class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                            type="button"
                            @click="deleteFacilityOrHealthcareProfessional"
                        >
                            {{ t('modEditFacilityOrHPTopbar.deleteButtonText') }}
                        </button>
                    </div>

                    <div
                        v-if="modalType === ModalType.DeleteConfirmation
                            && moderationScreenStore.editHealthcareProfessionalScreenIsActive()"
                        class="flex flex-col items-center"
                    >
                        <div class="font-bold text-3xl">
                            {{ t('modEditFacilityOrHPTopbar.deleteConfirmationHealthcareProfessional', {
                                id: selectedId,
                                healthcareProfessional: `${healthcareProfessionalsStore.selectedHealthcareProfessionalData
                                    ?.names[0]?.firstName} ${healthcareProfessionalsStore.selectedHealthcareProfessionalData
                                    ?.names[0]?.lastName}`,
                            }) }}
                        </div>
                        <button
                            class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                            type="button"
                            @click="deleteFacilityOrHealthcareProfessional"
                        >
                            {{ t('modEditFacilityOrHPTopbar.deleteButtonText') }}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useI18n } from '#imports'
import SVGCopyContent from '~/assets/icons/content-copy.svg'
import SVGSuccessCheckMark from '~/assets/icons/checkmark-square.svg'
import { useFacilitiesStore, getChangedFacilityFieldsForUpdate } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import { useModalStore, ModalType } from '~/stores/modalStore'
import { returnWithSuccessToast } from '~/composables/useModerationActionFeedback'
import { guardWithErrorToast } from '~/composables/useModerationGuardFeedback'
import { handleModerationResponseErrors } from '~/composables/useModerationResponseHandling'
import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'
import { arraysAreEqual } from '~/utils/arrayUtils'
import { hasEnglishLocalizedName } from '~/utils/nameUtils'
import { navigateToModerationDashboard } from '~/utils/moderationUtils'

const router = useRouter()

// Initialize the stores in use
const facilitiesStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const moderationScreenStore = useModerationScreenStore()
const modalStore = useModalStore()

// Initialize the value of the selected Id based off of Moderation Screen
const selectedId: ComputedRef<string> = computed(() => setSelectedId())
const originalFacilityData = computed(() => facilitiesStore.selectedFacilityData)
const originalHealthcareProfessionalData = computed<HealthcareProfessional | undefined>(() => {
    const selectedHealthcareProfessionalData = healthcareProfessionalsStore.selectedHealthcareProfessionalData
    if (!selectedHealthcareProfessionalData) {
        return undefined
    }

    // Keep an immutable snapshot for dirty-checking.
    return JSON.parse(JSON.stringify(selectedHealthcareProfessionalData))
})
const modalType = ref<ModalType.UnsavedChanges | ModalType.DeleteConfirmation | null>(null)

// Disable the buttons if there are no changes
const hasPendingChanges = computed(() => hasPendingFormChanges())

const toast = useToast()

const { t } = useI18n()

const showCopySuccessIcon: Ref<boolean> = ref(false)

const copyFacilityOrHealthcareProfessionalId = async () => {
    try {
        await navigator.clipboard.writeText(selectedId.value)
        showCopySuccessIcon.value = true
        setTimeout(() => {
            showCopySuccessIcon.value = false
        }, 2000)
    } catch (err: unknown) {
        toast.error(`${t('modEditFacilityOrHPTopbar.copyFailure')} ${selectedId.value}: ${err}`)
        console.error(`Failed to copy ID ${selectedId.value}: ${err}`)
    }
}

function setSelectedId() {
    switch (moderationScreenStore.activeScreen) {
        case ModerationScreen.EditFacility:
            return facilitiesStore.selectedFacilityId
        case ModerationScreen.EditHealthcareProfessional:
            return healthcareProfessionalsStore.selectedHealthcareProfessionalId
        default:
            return ''
    }
}

const hasFacilityFormChanges = (): boolean => {
    if (!originalFacilityData.value) return false

    const updatedFields = getChangedFacilityFieldsForUpdate(
        facilitiesStore.facilitySectionFields,
        originalFacilityData.value
    )

    return !!Object.keys(updatedFields).length
}

const hasHealthcareProfessionalFormChanges = () => {
    if (!originalHealthcareProfessionalData.value) return false // No match found, no changes to compare.

    const originalHealthcareProfessional = originalHealthcareProfessionalData.value

    const healthcareProfessionalSections = healthcareProfessionalsStore.healthcareProfessionalSectionFields

    // Compare each field in the `healthcareProfessionalSectionFields` object with the original data.
    const areThereUnsavedHealthcareProfessionalChanges
        = !arraysAreEqual(
            healthcareProfessionalSections.names,
            originalHealthcareProfessional.names
        )
        || !arraysAreEqual(
            healthcareProfessionalSections.acceptedInsurance,
            originalHealthcareProfessional.acceptedInsurance
        )
        || healthcareProfessionalSections.additionalInfoForPatients !== originalHealthcareProfessional.additionalInfoForPatients
        || healthcareProfessionalSections.createdDate
        !== originalHealthcareProfessional.createdDate
        || !arraysAreEqual(
            healthcareProfessionalSections.degrees,
            originalHealthcareProfessional.degrees
        )
        || healthcareProfessionalSections.id
        !== originalHealthcareProfessional.id
        || !arraysAreEqual(
            healthcareProfessionalSections.specialties,
            originalHealthcareProfessional.specialties
        )
        || !arraysAreEqual(
            healthcareProfessionalSections.spokenLanguages,
            originalHealthcareProfessional.spokenLanguages
        )
        || !arraysAreEqual(
            healthcareProfessionalSections.facilityIds,
            originalHealthcareProfessional.facilityIds
        )
        || healthcareProfessionalSections.updatedDate
        !== originalHealthcareProfessional.updatedDate
    return areThereUnsavedHealthcareProfessionalChanges
}

const hasPendingFormChanges = () => {
    if (moderationScreenStore.editFacilityScreenIsActive()) {
        return hasFacilityFormChanges()
    }

    if (moderationScreenStore.editHealthcareProfessionalScreenIsActive()) {
        return hasHealthcareProfessionalFormChanges()
    }
    return false
}

const saveChanges = async () => {
    if (moderationScreenStore.editFacilityScreenIsActive()) {
        if (!originalFacilityData.value) return

        if (!hasFacilityFormChanges()) return

        const response = await facilitiesStore.updateFacility()

        if (handleModerationResponseErrors(response, toast, t)) {
            return response
        }

        // Updates the facility section values with the data saved in the database
        facilitiesStore.initializeFacilitySectionValues(response.data as Facility)
        return returnWithSuccessToast(
            response,
            toast,
            t,
            'modEditFacilityOrHPTopbar.facilityUpdatedSuccessfully'
        )
    }
    // This makes the on click update the facility if the screen is EditFacility
    if (moderationScreenStore.editHealthcareProfessionalScreenIsActive()) {
        // This prevents us from sending a requested unnecessarily if the user has not made changes
        if (!hasHealthcareProfessionalFormChanges()) return

        const hasEnglishName = hasEnglishLocalizedName(
            healthcareProfessionalsStore.healthcareProfessionalSectionFields.names
        )

        if (guardWithErrorToast(
            !hasEnglishName,
            toast,
            t,
            'modEditFacilityOrHPTopbar.healthcareProfessionalEnglishNameRequired'
        )) {
            return
        }

        const response = await healthcareProfessionalsStore.updateHealthcareProfessional()

        if (handleModerationResponseErrors(response, toast, t)) {
            return response
        }

        return returnWithSuccessToast(
            response,
            toast,
            t,
            'modEditFacilityOrHPTopbar.healthcareProfessionalUpdatedSuccessfully'
        )
    }
}

const saveChangesAndExit = async () => {
    if (moderationScreenStore.editFacilityScreenIsActive()) {
        const response = await saveChanges()

        if (response === undefined) {
            return
        }

        if (handleModerationResponseErrors(response, toast, t)) {
            return response
        }

        await navigateToModerationDashboard(router, moderationScreenStore)
    }
    if (moderationScreenStore.editHealthcareProfessionalScreenIsActive()) {
        const response = await saveChanges()

        if (response === undefined) {
            return
        }

        if (handleModerationResponseErrors(response, toast, t)) {
            return response
        }

        await navigateToModerationDashboard(router, moderationScreenStore)
    }
}

const openDeleteConfirmation = () => {
    modalType.value = ModalType.DeleteConfirmation
    modalStore.showModal()
}

const deleteFacilityOrHealthcareProfessional = async () => {
    if (moderationScreenStore.editFacilityScreenIsActive()) {
        const deleteFacilityArgs = {
            id: selectedId.value
        }
        const response = await facilitiesStore.deleteFacility(deleteFacilityArgs)

        if (handleModerationResponseErrors(response, toast, t)) {
            return response
        }
        returnWithSuccessToast(
            response,
            toast,
            t,
            'modEditFacilityOrHPTopbar.facilityDeletedSuccessfully'
        )
        // Redirect to the dashboard since the facility no longer exists
        await navigateToModerationDashboard(router, moderationScreenStore)
        modalType.value = null
        modalStore.hideModal()
        return response
    }

    if (moderationScreenStore.editHealthcareProfessionalScreenIsActive()) {
        const deleteHealthcareProfessionalArgs = {
            id: selectedId.value
        }

        const response = await healthcareProfessionalsStore.deleteHealthcareProfessional(deleteHealthcareProfessionalArgs)

        if (handleModerationResponseErrors(response, toast, t)) {
            return response
        }

        returnWithSuccessToast(
            response,
            toast,
            t,
            'modEditFacilityOrHPTopbar.healthcareProfessionalDeletedSuccessfully'
        )
        // Redirect to the dashboard since the healthcare professional no longer exists
        await navigateToModerationDashboard(router, moderationScreenStore)
        modalType.value = null
        modalStore.hideModal()
        return response
    }
}

const navigateBackToDashboard = async () => {
    await navigateToModerationDashboard(router, moderationScreenStore)
}
</script>
