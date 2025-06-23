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
                @click="exitWithoutSavingUpdates"
            >
                {{
                    t('modEditFacilityOrHPTopbar.back') }}
            </button>
            <button
                type="button"
                :disabled="!enableUpdateButtons"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="mod-edit-facility-hp-topbar-update"
                @click="updateFacilityOrHealthcareProfessional"
            >
                <span>
                    {{ t('modEditFacilityOrHPTopbar.update') }}
                </span>
            </button>
            <button
                type="button"
                :disabled="!enableUpdateButtons"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="mod-edit-facility-hp-topbar-update"
                @click="updateFacilityOrHealthcareProfessionalAndExit"
            >
                <span>
                    {{ t('modEditFacilityOrHPTopbar.updateAndExit') }}
                </span>
            </button>
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary border-2 w-28 text-sm mr-2 "
                data-testid="mod-edit-facility-hp-topbar-delete"
                @click="openDeletionConfirmation"
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
                    class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
                >
                    <div v-if="modalType === ModalType.UnsavedChanges">
                        <div class="font-bold text-3xl">
                            {{ t('modEditFacilityOrHPTopbar.hasUnsavedChanges') }}
                        </div>
                        <button
                            class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                            type="button"
                            @click="handleNavigateToModerationScreen"
                        >
                            {{ t('modSubmissionForm.confirmationButton') }}
                        </button>
                    </div>
                    <div v-if="modalType === ModalType.DeleteConfirmation">
                        <div
                            v-show="moderationScreenStore.editFacilityScreenIsActive()"
                            class="font-bold text-3xl"
                        >
                            {{ t('modEditFacilityOrHPTopbar.deleteConfirmationFacility',
                                 { id: selectedId, facility: facilitiesStore.selectedFacilityData?.nameEn }) }}
                        </div>
                        <div
                            v-show="moderationScreenStore.editHealthcareProfessionalScreenIsActive()"
                            class="font-bold text-3xl"
                        >
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
                            {{
                                t('modEditFacilityOrHPTopbar.deleteButtonText') }}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { type ToastInterface, useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useI18n } from '#imports'
import SVGCopyContent from '~/assets/icons/content-copy.svg'
import SVGSuccessCheckMark from '~/assets/icons/checkmark-square.svg'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import { useModalStore, ModalType } from '~/stores/modalStore'
import { handleServerErrorMessaging } from '~/composables/handleServerErrorMessaging'
import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'
import { arraysAreEqual } from '~/utils/arrayUtils'
import { onBeforeRouteLeave } from '#app'

const router = useRouter()

// Initialize the stores in use
const facilitiesStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const moderationScreenStore = useModerationScreenStore()
const modalStore = useModalStore()

// Initialize the value of the selected Id based off of Moderation Screen
const selectedId: ComputedRef<string> = computed(() => setSelectedId())
const originalFacilityRefsValue: Ref<Facility | undefined> = ref()
const originalHealthcareProfessionalRefsValue: Ref<HealthcareProfessional | undefined> = ref()
const modalType = ref<ModalType.UnsavedChanges | ModalType.DeleteConfirmation | null>(null)

// Disable the buttons if there are no changes
const enableUpdateButtons = computed(() => hasUnsavedChanges())

let toast: ToastInterface

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

const facilityHasUnsavedChanges = () => {
    if (!originalFacilityRefsValue.value) return false

    const facilityBeforeChange = originalFacilityRefsValue.value

    /** This needs to be converted because to access the values of this object we do not need value.
    But to keep their reactivity in the store we keep them as Refs **/
    const facilitySections = facilitiesStore.facilitySectionFields

    const areThereUnsavedFacilityChanges
        = facilityBeforeChange.nameEn !== facilitySections.nameEn
          || facilityBeforeChange.nameJa !== facilitySections.nameJa
          || facilityBeforeChange.contact.phone !== facilitySections.phone
          || facilityBeforeChange.contact.website !== facilitySections.website
          || facilityBeforeChange.contact.email !== facilitySections.email
          || facilityBeforeChange.contact.address.postalCode !== facilitySections.postalCode
          || facilityBeforeChange.contact.address.prefectureEn !== facilitySections.prefectureEn
          || facilityBeforeChange.contact.address.cityEn !== facilitySections.cityEn
          || facilityBeforeChange.contact.address.addressLine1En !== facilitySections.addressLine1En
          || facilityBeforeChange.contact.address.addressLine2En !== facilitySections.addressLine2En
          || facilityBeforeChange.contact.address.prefectureJa !== facilitySections.prefectureJa
          || facilityBeforeChange.contact.address.cityJa !== facilitySections.cityJa
          || facilityBeforeChange.contact.address.addressLine1Ja !== facilitySections.addressLine1Ja
          || facilityBeforeChange.contact.address.addressLine2Ja !== facilitySections.addressLine2Ja
          || facilityBeforeChange.contact.googleMapsUrl !== facilitySections.googlemapsURL
          || facilityBeforeChange.mapLatitude.toString() !== facilitySections.mapLatitude
          || facilityBeforeChange.mapLongitude.toString() !== facilitySections.mapLongitude
          || JSON.stringify(facilityBeforeChange.healthcareProfessionalIds)
          !== JSON.stringify(facilitySections.healthcareProfessionalIds)
          || facilitySections.healthProfessionalsRelations.length > 0

    return areThereUnsavedFacilityChanges
}

const healthcareProfessionalHasUnsavedChanges = () => {
    if (!originalHealthcareProfessionalRefsValue.value) return false // No match found, no changes to compare.

    const originalHealthcareProfessional = originalHealthcareProfessionalRefsValue.value

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
|| healthcareProfessionalSections.createdDate
!== originalHealthcareProfessional.createdDate
|| !arraysAreEqual(
    healthcareProfessionalSections.degrees,
    originalHealthcareProfessional.degrees
)
|| !arraysAreEqual(
    healthcareProfessionalSections.facilityIds,
    originalHealthcareProfessional.facilityIds
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
|| healthcareProfessionalsStore.selectedFacilities.length

    return areThereUnsavedHealthcareProfessionalChanges
}

const hasUnsavedChanges = () => {
    if (moderationScreenStore.editFacilityScreenIsActive()) {
        return facilityHasUnsavedChanges()
    }

    if (moderationScreenStore.editHealthcareProfessionalScreenIsActive()) {
        return healthcareProfessionalHasUnsavedChanges()
    }
    return false
}

const updateFacilityOrHealthcareProfessional = async () => {
    if (moderationScreenStore.editFacilityScreenIsActive()) {
        // Prevent sending an unnecessary request if the user has not made changes
        if (!facilityHasUnsavedChanges()) return

        const response = await facilitiesStore.updateFacility()

        if (response.errors?.length) {
            handleServerErrorMessaging(response.errors, toast, t)
            return response
        }

        // Updates the facility section values with the data saved in the database
        facilitiesStore.initializeFacilitySectionValues(response.data as Facility)
        toast.success(t('modEditFacilityOrHPTopbar.facilityUpdatedSuccessfully'))
        return response
    }
    // This makes the on click update the facility if the screen is EditFacility
    if (moderationScreenStore.editHealthcareProfessionalScreenIsActive()) {
        // This prevents us from sending a requested unnecessarily if the user has not made changes
        if (!healthcareProfessionalHasUnsavedChanges()) return

        const response = await healthcareProfessionalsStore.updateHealthcareProfessional()

        if (response.errors?.length) {
            handleServerErrorMessaging(response.errors, toast, t)
            return response
        }

        toast.success(t('modEditFacilityOrHPTopbar.healthcareProfessionalUpdatedSuccessfully'))
        return response
    }
}

const updateFacilityOrHealthcareProfessionalAndExit = async () => {
    if (moderationScreenStore.editFacilityScreenIsActive()) {
        const response = await updateFacilityOrHealthcareProfessional()

        if (response && response.errors?.length) {
            handleServerErrorMessaging(response.errors, toast, t)
            return response
        }

        router.push('/moderation')
        moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
    }
    if (moderationScreenStore.editHealthcareProfessionalScreenIsActive()) {
        const response = await updateFacilityOrHealthcareProfessional()

        if (response && response.errors?.length) {
            handleServerErrorMessaging(response.errors, toast, t)
            return response
        }

        router.push('/moderation')
        moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
    }
}

const openDeletionConfirmation = () => {
    modalType.value = ModalType.DeleteConfirmation
    modalStore.showModal()
}

const deleteFacilityOrHealthcareProfessional = async () => {
    if (moderationScreenStore.editFacilityScreenIsActive()) {
        const deleteFacilityArgs = {
            id: selectedId.value
        }
        const response = await facilitiesStore.deleteFacility(deleteFacilityArgs)

        if (response.errors?.length) {
            handleServerErrorMessaging(response.errors, toast, t)
            return response
        }

        toast.success(t('modEditFacilityOrHPTopbar.facilityDeletedSuccessfully'))
        // Redirect to the dashboard since the facility no longer exists
        router.push('/moderation')
        modalType.value = null
        modalStore.hideModal()
        return response
    }

    if (moderationScreenStore.editHealthcareProfessionalScreenIsActive()) {
        const deleteHealthcareProfessionalArgs = {
            id: selectedId.value
        }

        const response = await healthcareProfessionalsStore.deleteHealthcareProfessional(deleteHealthcareProfessionalArgs)

        if (response.errors?.length) {
            handleServerErrorMessaging(response.errors, toast, t)
            return response
        }

        toast.success(t('modEditFacilityOrHPTopbar.healthcareProfessionalDeletedSuccessfully'))
        // Redirect to the dashboard since the healthcare professional no longer exists
        router.push('/moderation')
        modalType.value = null
        modalStore.hideModal()
        return response
    }
}

const exitWithoutSavingUpdates = () => {
    if (!hasUnsavedChanges()) {
        router.push('/moderation')
        moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
        return
    }
    modalType.value = ModalType.UnsavedChanges
    modalStore.showModal()
}

onMounted(() => {
    toast = useToast()
})

watch(() => facilitiesStore.selectedFacilityData, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        originalFacilityRefsValue.value = newValue
    }
}, { deep: true })

// using stringify and then parsing was the only working solution to stop
// originalHealthcareProfessionalRefsValue from being assigned a reference to
// healthcareProfessionalsStore.selectedHealthcareProfessionalData; all other methods
// had originalHealthcareProfessionalRefsValue updating with healthcareProfessionalsStore.healthcareProfessionalSectionFields
watch(() => healthcareProfessionalsStore.selectedHealthcareProfessionalData, newValue => {
    originalHealthcareProfessionalRefsValue.value = JSON.parse(JSON.stringify(newValue))
})

const handleNavigateToModerationScreen = () => {
    modalType.value = null
    modalStore.hideModal()
    router.push('/moderation')
    moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
}

onBeforeRouteLeave(async (to, from, next) => {
    if (hasUnsavedChanges()) {
        modalType.value = ModalType.UnsavedChanges
        modalStore.showModal()
        next(false)
        return
    }
    next()
})
</script>
