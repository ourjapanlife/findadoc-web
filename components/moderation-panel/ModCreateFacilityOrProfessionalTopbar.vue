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
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import { useModalStore } from '~/stores/modalStore'
import { useModerationSubmissionsStore, SelectedModerationListView } from '~/stores/moderationSubmissionsStore'
import { handleServerErrorMessaging } from '~/composables/handleServerErrorMessaging'
import { Locale } from '~/typedefs/gqlTypes'

const router = useRouter()

// Initialize the stores in use
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()
const moderationScreenStore = useModerationScreenStore()
const modalStore = useModalStore()
const moderationSubmissionsStore = useModerationSubmissionsStore()

const toast = useToast()

const { t } = useI18n()

const validateFacilityFields = () => {
    const createFacilitySections = facilitiesStore.createFacilityFields
    // Required fields
    const isNameEnValid: boolean = validateNameEn(createFacilitySections.nameEn)
    const isNameJaValid: boolean = validateNameJa(createFacilitySections.nameJa)
    const isPhoneValid: boolean = validatePhoneNumber(createFacilitySections.contact.phone)
    const isAddressLine1EnValid: boolean = validateAddressLineEn(createFacilitySections.contact.address.addressLine1En)
    const isAddressLine1JaValid: boolean = validateAddressLineJa(createFacilitySections.contact.address.addressLine1Ja)
    const isCityEnValid: boolean = validateCityEn(createFacilitySections.contact.address.cityEn)
    const isCityJaValid: boolean = validateCityJa(createFacilitySections.contact.address.cityJa)
    const isPostalCodeValid: boolean = validatePostalCode(createFacilitySections.contact.address.postalCode)
    const isLatitudeValid: boolean = validateFloat(createFacilitySections.mapLatitude)
    const isLongitudeValid: boolean = validateFloat(createFacilitySections.mapLongitude)

    // Optional fields: only validate if present
    const isEmailValid: boolean = !createFacilitySections.contact.email || validateEmail(createFacilitySections.contact.email)
    const isWebsiteValid: boolean = !createFacilitySections.contact.website
      || validateWebsite(createFacilitySections.contact.website)
    const isAddressLine2EnValid: boolean = !createFacilitySections.contact.address.addressLine2En
      || validateAddressLineEn(createFacilitySections.contact.address.addressLine2En)
    const isAddressLine2JaValid: boolean = !createFacilitySections.contact.address.addressLine2Ja
      || validateAddressLineJa(createFacilitySections.contact.address.addressLine2Ja)

    triggerFormValidationErrorMessages('mod-input-field')

    // Only required fields are strictly validated; optional fields only if present
    const areAllTheFacilityFieldsValid
        = isNameEnValid
          && isNameJaValid
          && isPhoneValid
          && isAddressLine1EnValid
          && isAddressLine1JaValid
          && isCityEnValid
          && isCityJaValid
          && isPostalCodeValid
          && isLatitudeValid
          && isLongitudeValid
          && isEmailValid
          && isWebsiteValid
          && isAddressLine2EnValid
          && isAddressLine2JaValid
            ? true
            : false

    return areAllTheFacilityFieldsValid
}

const validateHealthcareProfessionalFields = () => {
    const healthcareProfessionalFields = healthcareProfessionalsStore.createHealthcareProfessionalSectionFields

    const areFacilityIdsAdded = !!healthcareProfessionalFields.facilityIds.length
    const areInsurancesSelected = !!healthcareProfessionalFields.acceptedInsurance!.length
    const areDegreesSelected = !!healthcareProfessionalFields.degrees!.length
    const areSpecialtiesSelected = !!healthcareProfessionalFields.spokenLanguages!.length
    const areLocalesSelected = !!healthcareProfessionalFields.spokenLanguages!.length

    const areAllFieldsValid = areFacilityIdsAdded
      && areInsurancesSelected && areDegreesSelected
      && areSpecialtiesSelected && areLocalesSelected

    return areAllFieldsValid
}

const createFacilityOrHealthcareProfessional = async () => {
    if (moderationScreenStore.createHealthcareProfessionalScreenIsActive()) {
        const healthcareProfessionalCreationSectionFields = healthcareProfessionalsStore.createHealthcareProfessionalSectionFields
        const hasEnglishName
            = healthcareProfessionalCreationSectionFields.names.some(name => name.locale === Locale.EnUs)

        const hasEmptyRequiredFields = validateHealthcareProfessionalFields()

        if (!hasEnglishName) {
            toast.error(t('modCreateFacilityOrHPTopbar.healthcareProfessionalEnglishNameRequired'))
            return
        }

        if (!hasEmptyRequiredFields) {
            toast.error(t('modCreateFacilityOrHPTopbar.hasEmptyFieldsHealthcareProfessional'))
            return
        }

        const response = await healthcareProfessionalsStore.createHealthcareProfessional()

        if (response.errors?.length) {
            handleServerErrorMessaging(response.errors, toast, t)
            return response
        }

        toast.success(t('modCreateFacilityOrHPTopbar.heathcareProfessionalCreatedSuccessfully'))
        router.push('/moderation')
        moderationSubmissionsStore.setSelectedModerationListViewChosen(SelectedModerationListView.HealthcareProfessionals)
        healthcareProfessionalsStore.resetCreateHealthcareProfessionalFields()
        return response
    }

    if (moderationScreenStore.createFacilityScreenIsActive()) {
        const validateCreateFacilityFields = validateFacilityFields()
        if (!validateCreateFacilityFields) {
            toast.error(t('modCreateFacilityOrHPTopbar.hasEmptyFieldsFacility'))
            return
        }
        const response = await facilitiesStore.createFacility()

        if (response.errors?.length) {
            handleServerErrorMessaging(response.errors, toast, t)
            return response
        }

        toast.success(t('modCreateFacilityOrHPTopbar.facilityCreatedSuccessfully'))
        router.push('/moderation')
        moderationSubmissionsStore.setSelectedModerationListViewChosen(
            SelectedModerationListView.Facilities
        )
        facilitiesStore.resetCreateFacilityFields()
        return response
    }
}

const navigateBackToDashboardWithoutCreation = async () => {
    router.push('/moderation')
    if (moderationScreenStore.createHealthcareProfessionalScreenIsActive()) {
        healthcareProfessionalsStore.resetCreateHealthcareProfessionalFields()
    }
    if (moderationScreenStore.createFacilityScreenIsActive()) {
        facilitiesStore.resetCreateFacilityFields()
    }
    moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
    modalStore.hideModal()
}

const openExitConfirmation = () => {
    modalStore.showModal()
}
</script>
