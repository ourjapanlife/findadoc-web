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
import type { Contact, ContactInput, Facility, HealthcareProfessional,
    MutationUpdateFacilityArgs, PhysicalAddress, PhysicalAddressInput } from '~/typedefs/gqlTypes'
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

function mapFacilityAddressToInput(address: PhysicalAddress): PhysicalAddressInput {
    return {
        postalCode: address.postalCode ?? '',
        prefectureEn: address.prefectureEn ?? '',
        cityEn: address.cityEn ?? '',
        addressLine1En: address.addressLine1En ?? '',
        addressLine2En: address.addressLine2En ?? '',
        prefectureJa: address.prefectureJa ?? '',
        cityJa: address.cityJa ?? '',
        addressLine1Ja: address.addressLine1Ja ?? '',
        addressLine2Ja: address.addressLine2Ja ?? ''
    }
}

function mapFacilityContactToInput(contact: Contact): ContactInput {
    return {
        phone: contact.phone ?? '',
        email: contact.email ?? '',
        website: contact.website ?? '',
        googleMapsUrl: contact.googleMapsUrl ?? '',
        address: mapFacilityAddressToInput(contact.address ?? {} as PhysicalAddress)
    }
}

const facilityHasUnsavedChanges = (): boolean => {
    if (!originalFacilityRefsValue.value) return false

    const currentFacilityFields = facilitiesStore.facilitySectionFields
    const originalFacilityData = originalFacilityRefsValue.value

    const changedFields = getChangedFacilityFieldsForUpdate(currentFacilityFields, originalFacilityData)

    return Object.keys(changedFields).length > 0
}

function getChangedFacilityFieldsForUpdate(
  current: typeof facilitiesStore.facilitySectionFields,
  original: Facility
): MutationUpdateFacilityArgs['input'] {
    const updatedFields: MutationUpdateFacilityArgs['input'] = {}

    if (current.nameEn !== original.nameEn) updatedFields.nameEn = current.nameEn
    if (current.nameJa !== original.nameJa) updatedFields.nameJa = current.nameJa

    const currentLatitude = parseFloat(current.mapLatitude)
    if (currentLatitude !== original.mapLatitude) updatedFields.mapLatitude = currentLatitude

    const currentLongitude = parseFloat(current.mapLongitude)
    if (currentLongitude !== original.mapLongitude) updatedFields.mapLongitude = currentLongitude

    if (current.healthProfessionalsRelations.length > 0) {
        updatedFields.healthcareProfessionalIds = current.healthProfessionalsRelations
    }

    const originalContactInput = mapFacilityContactToInput(original.contact as Contact)

    const updatedContact: ContactInput = {
        phone: current.phone || originalContactInput.phone,
        email: current.email || originalContactInput.email,
        website: current.website || originalContactInput.website,
        googleMapsUrl: current.googlemapsURL || originalContactInput.googleMapsUrl,
        address: { ...originalContactInput.address }
    }

    const facilityAddressKeys: (keyof PhysicalAddressInput)[] = [
        'postalCode', 'prefectureEn', 'cityEn', 'addressLine1En', 'addressLine2En',
        'prefectureJa', 'cityJa', 'addressLine1Ja', 'addressLine2Ja'
    ]

    for (const addressKey of facilityAddressKeys) {
        if (current[addressKey] && current[addressKey] !== originalContactInput.address[addressKey]) {
            updatedContact.address[addressKey] = current[addressKey]
        }
    }

    const contactWasModified
        = updatedContact.phone !== originalContactInput.phone
          || updatedContact.email !== originalContactInput.email
          || updatedContact.website !== originalContactInput.website
          || updatedContact.googleMapsUrl !== originalContactInput.googleMapsUrl
          || facilityAddressKeys.some(key => updatedContact.address[key] !== originalContactInput.address[key])

    if (contactWasModified) {
        updatedFields.contact = updatedContact
    }

    return updatedFields
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
        if (!originalFacilityRefsValue.value) return

        const facilityHasChanges = getChangedFacilityFieldsForUpdate(
            facilitiesStore.facilitySectionFields, originalFacilityRefsValue.value
        )

        if (Object.keys(facilityHasChanges).length === 0) return

        const response = await facilitiesStore.updateFacility(facilityHasChanges)

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
