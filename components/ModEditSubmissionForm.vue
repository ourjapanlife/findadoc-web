<!-- eslint-disable vue/no-spaces-around-equal-signs-in-attribute -->
<template>
    <Loader />
    <div v-if="isEditSubmissionFormInitialized">
        <Modal
            data-testid="submission-form-modal"
            @modal-closed="resetModalRefs"
        >
            <div
                v-if="moderationSubmissionStore.approvingSubmissionFromTopBar"
                class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
            >
                <span class="font-bold text-3xl">
                    {{ $t('modSubmissionForm.submissionConfirmationMessage') }}
                </span>
                <button
                    type="button"
                    class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                    @click="submitCompletedForm"
                >
                    {{ $t('modSubmissionForm.submissionConfirmationAcceptanceButton') }}
                </button>
            </div>
            <div
                v-if="moderationSubmissionStore.showRejectSubmissionConfirmation"
                data-testid="reject-confirmation"
                class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
            >
                <span class="font-bold text-3xl">
                    {{ $t('modSubmissionForm.rejectSubmissionConfirmationMessage') }}
                </span>
                <button
                    data-testid="reject-submission-confirmation-btn"
                    type="button"
                    class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                    @click="rejectSubmission"
                >
                    {{ $t('modSubmissionForm.rejectSubmissionConfirmationButton') }}
                </button>
            </div>
            <div
                v-if="formHasUnsavedChanges"
                class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
            >
                <span class="font-bold text-3xl">{{ $t('modSubmissionForm.hasUnsavedChanges') }}</span>
                <button
                    type="button"
                    data-testid="submission-unsaved-confirmation-btn"
                    class="bg-secondary p-4 rounded-full my-8 font-semibold text-xl hover:bg-primary"
                    @click="handleNavigateToModerationScreen"
                >
                    {{ $t('modSubmissionForm.confirmationButton') }}
                </button>
            </div>
        </Modal>
    </div>
    <div class="flex">
        <div class="flex flex-col mr-8">
            <label
                for="mod-edit-submission-form-facilities"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t('modSubmissionForm.searchExistingFacilities') }}
            </label>
            <ModSearchBar
                v-model="currentFacilityRelations"
                :place-holder-text="$t('modHealthcareProfessionalSection.placeholderTextFacilitySearchBar')"
                :no-match-text="$t('modHealthcareProfessionalSection.noFacilitiesWereFound')"
                :fields-to-display-callback="facilitiesFieldsToDisplayCallback"
                :default-suggestions="facilitiesStore.facilityData"
                @search-input-change="handleFacilitySearchInputChange"
            />
            <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2 ">
                <li
                    v-for="facility in currentFacilityRelations"
                    :key="facility.id"
                    class="py-1"
                >
                    {{ `${facility.id} / ${facility.nameEn} / ${facility.nameJa}` }}
                </li>
            </ol>
            <div
                v-show="!currentFacilityRelations.length"
                class="mod-edit-facility-section"
            >
                <h1
                    class="mb-3.5 text-start text-primary-text text-3xl font-bold font-sans leading-normal"
                >
                    {{ $t('modFacilitySection.facilityHeading') }}
                </h1>
                <ModEditFacilitySection />
            </div>
        </div>
        <div class="flex flex-col">
            <label
                for="mod-edit-submission-form-healthcare-professionals"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t('modSubmissionForm.searchExistingHealthcareProfessionals') }}
            </label>
            <ModSearchBar
                v-model="currentExistingHealthcareProfessionals"
                data-testid="mod-facility-section-doctor-search"
                :place-holder-text="$t('modFacilitySection.placeholderTextHealthcareProfessionalSearchbar')"
                :no-match-text="$t('modFacilitySection.noHealthcareProfessionalFound')"
                :fields-to-display-callback="healthcareProfessionalsToDisplayCallback"
                :default-suggestions="healthcareProfessionalsStore.healthcareProfessionalsData"
                @search-input-change="handleHealthcareProfessionalsInputChange"
            />
            <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2 ">
                <li
                    v-for="healthcareProfessional in currentExistingHealthcareProfessionals"
                    :key="healthcareProfessional.id"
                    class="py-1"
                >
                    {{ `${healthcareProfessional.id} / ${healthcareProfessional.names[0].lastName}
                    / ${healthcareProfessional.names[0].firstName}` }}
                </li>
            </ol>
            <div
                v-show="!currentExistingHealthcareProfessionals.length"
                class="mod-edit-healthcare-professional-section"
            >
                <ModEditHealthcareProfessionalSection />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast, type ToastInterface } from 'vue-toastification'
import ModSearchBar from './ModSearchBar.vue'
import { Locale,
    type Submission,
    type MutationUpdateSubmissionArgs,
    type LocalizedNameInput,
    type Insurance,
    type Degree,
    type Specialty,
    type Facility,
    type HealthcareProfessional } from '~/typedefs/gqlTypes'
import { validateAddressLineEn,
    validateAddressLineJa,
    validateNameEn,
    validateNameJa,
    validatePhoneNumber,
    validateCityEn,
    validateEmail,
    validateFloat,
    validatePostalCode,
    validateWebsite,
    validateCityJa } from '~/utils/formValidations'
import { onBeforeRouteLeave } from '#app'
import { useI18n } from '#imports'
import { triggerFormValidationErrorMessages } from '~/utils/triggerFormValidationErrorMessages'
import { arraysAreEqual } from '~/utils/arrayUtils'
import { handleServerErrorMessaging } from '~/utils/handleServerErrorMessaging'

/**
This initalizes the variable that needs to be set on mount.
If this is set as a const the build will fail since the plugin
for vue-toastification is only available onMounted of the component
through Nuxt
 */
let toast: ToastInterface

const { t } = useI18n()
const router = useRouter()

const moderationSubmissionStore = useModerationSubmissionsStore()
const modalStore = useModalStore()
const screenStore = useModerationScreenStore()
const loadingStore = useLoadingStore()
const facilitiesStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()

const isEditSubmissionFormInitialized: Ref<boolean> = ref(false)

//Keeps of existing facilities related to new healthcare professional submission
const currentFacilityRelations: Ref<Facility[]> = ref([])
//Keeps of existing healthcare professionals related to new facility submission
const currentExistingHealthcareProfessionals: Ref<HealthcareProfessional[]> = ref([])

// Flag to indicate if an existing facility has been selected from the search bar
const isExistingFacilitySelected: Ref<boolean> = ref(false)
// Flag to indicate if an existing healthcare professional has been selected from the search bar
const isExistingHealthcareProfessionalSelected: Ref<boolean> = ref(false)

/* This is used as an exact copy and not updated. This is to allow for change checks in values.
We can then provide a better user experience based on if they change the values or not
This is necessary because setting a variable directly in vue to the same as a reactive object
may not always work as intended*/
const submissionFormFieldsBeforeChanges = reactive({
    // contactFields
    nameEn: '' as string,
    nameJa: '' as string,
    phone: '' as string,
    website: '' as string,
    email: '' as string,
    // addressesFields
    postalCode: '' as string,
    prefectureEn: '' as string,
    cityEn: '' as string,
    addressLine1En: '' as string,
    addressLine2En: '' as string,
    prefectureJa: '' as string,
    cityJa: '' as string,
    addressLine1Ja: '' as string,
    addressLine2Ja: '' as string,
    // googleMapsFields
    googlemapsURL: '' as string,
    mapLatitude: '' as string,
    mapLongitude: '' as string,
    //healthcareProfessionalFields
    healthCareProfessionalNameArray: [] as LocalizedNameInput[],
    healthcareProfessionalIDs: [] as string[],
    localizedFirstName: '' as string,
    localizedLastName: '' as string,
    localizedMiddleName: '' as string,
    nameLocale: Locale.EnUs as Locale,
    healthcareProfessionalAcceptedInsurances: [] as Insurance[],
    healthcareProfessionalDegrees: [] as Degree[],
    healthcareProfessionalSpecialties: [] as Specialty[],
    spokenLanguages: [] as Locale[]
})

const formHasUnsavedChanges: Ref<boolean> = ref(false)

const handleFacilitySearchInputChange = (filteredItems: Ref<Facility[]>, inputValue: string) => {
    filteredItems.value = facilitiesStore.facilityData.filter(({ nameEn, nameJa, id }) => {
        const isMatch
            = nameEn.toLowerCase().includes(inputValue)
              || nameJa.toLowerCase().includes(inputValue)
              || id.toLowerCase().includes(inputValue)
        return isMatch
    })
    /*
    if (currentFacilityRelations.value.length) {
        facilitiesStore.resetFacilitySectionFields()
        return
    }

    if (!currentFacilityRelations.value.length) {
        initializeSubmissionFormValues(moderationSubmissionStore.selectedSubmissionData)
        return
    }
    */
}

const facilitiesFieldsToDisplayCallback = (item: Facility) => [item.nameEn, item.nameJa]

const handleHealthcareProfessionalsInputChange = (filteredItems: Ref<HealthcareProfessional[]>, inputValue: string) => {
    filteredItems.value = healthcareProfessionalsStore.healthcareProfessionalsData
        .filter((healthcareProfessional: HealthcareProfessional) => {
            const idMatches = healthcareProfessional.id
                .toLowerCase()
                .startsWith(inputValue.toLowerCase().trim())
            const nameMatches = healthcareProfessional.names.some(name => {
                const firstNameMatch = name.firstName
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                const middleNameMatch = name.middleName
                  && name.middleName
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                const lastNameMatch = name.lastName
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                return firstNameMatch || middleNameMatch || lastNameMatch
            })
            return idMatches || nameMatches
        })
    /*
    // REASON FOR REMOVAL:
    // This logic is being removed because it directly manipulates the global `facilitiesStore.facilitySectionFields`
    // and `moderationSubmissionStore.selectedSubmissionData`.
    // In our new state management approach, the `ModEditSubmissionForm` (parent) component
    // is responsible for holding the `currentFacilityData` and `currentHealthcareProfessionalData` refs,
    // which represent the editable state of the form.
    // When a user interacts with the search bar and selects an existing facility (which updates `currentFacilityRelations`),
    // the parent's `watch(currentFacilityRelations, ...)` handler will now take care of:
    // 1. Updating `currentFacilityData.value` (by cloning the selected facility).
    // 2. Setting `isExistingFacilitySelected.value = true`.
    */
    // if (currentFacilityRelations.value.length) {
    //     facilitiesStore.resetFacilitySectionFields()
    //     return
    // }

    // if (!currentFacilityRelations.value.length) {
    //     initializeSubmissionFormValues(moderationSubmissionStore.selectedSubmissionData)
    //     return
    // }
}
const healthcareProfessionalsToDisplayCallback = (healthcareProfessional: HealthcareProfessional) =>
    [healthcareProfessional.names[0].firstName + ' ' + healthcareProfessional.names[0].lastName]

const validateFacilityFields = () => {
    const facilitySections = facilitiesStore.facilitySectionFields
    const isNameEnValid: boolean = validateNameEn(facilitySections.nameEn)
    const isNameJaValid: boolean = validateNameJa(facilitySections.nameJa)
    const isPhoneValid: boolean = validatePhoneNumber(facilitySections.phone)
    // This validates the email only if it exists or skips the check returning false since optional
    const isEmailValid: boolean = facilitySections.email ? validateEmail(facilitySections.email) : false
    // This validates the website only if it exists or skips the check returning false since optional
    const isWebsiteValid: boolean = facilitySections.website ? validateWebsite(facilitySections.website) : true
    const isAddressLine1EnValid: boolean = validateAddressLineEn(facilitySections.addressLine1En)
    const isAddressLine2EnValid: boolean = validateAddressLineEn(facilitySections.addressLine2En)
    const isAddressLine1JaValid: boolean = validateAddressLineJa(facilitySections.addressLine1Ja)
    const isAddressLine2JaValid: boolean = validateAddressLineJa(facilitySections.addressLine2Ja)
    const isCityEnValid: boolean = validateCityEn(facilitySections.cityEn)
    const isCityJaValid: boolean = validateCityJa(facilitySections.cityJa)
    const isPostalCodeValid: boolean = validatePostalCode(facilitySections.postalCode)
    const isLatitudeValid: boolean = validateFloat(facilitySections.mapLatitude)
    const isLongitudeValid: boolean = validateFloat(facilitySections.mapLongitude)

    //this will populate error messages if a field is not valid
    triggerFormValidationErrorMessages('mod-input-field')

    //This checks to make sure all the facility fields are valid.
    // If they are we can return true and manipulate other parts of the code based on this value
    const areAllTheFacilityFieldsValid = isNameEnValid && isNameJaValid && isPhoneValid && isEmailValid && isWebsiteValid
      && isAddressLine1EnValid && isAddressLine2EnValid && isAddressLine1JaValid && isAddressLine2JaValid && isCityEnValid
      && isCityJaValid && isPostalCodeValid && isLatitudeValid && isLongitudeValid
        ? true
        : false

    return areAllTheFacilityFieldsValid
}

const validateHealthcareProfessionalFields = () => {
    const healthcareProfessionalFields = healthcareProfessionalsStore.healthcareProfessionalSectionFields
    const facilitySectionFields = facilitiesStore.facilitySectionFields

    const areNamesSelectedToFacility: boolean
        = healthcareProfessionalFields.names.length > 0
          || facilitySectionFields.healthcareProfessionalIds.length > 0
    const areInsurancesSelected: boolean = healthcareProfessionalFields.acceptedInsurance.length > 0
    const areDegreesSelected: boolean = healthcareProfessionalFields.degrees.length > 0
    const areSpecialtiesSelected: boolean = healthcareProfessionalFields.specialties.length > 0
    const areLocalesSelected: boolean = healthcareProfessionalFields.spokenLanguages.length > 0

    const areAllFieldsValid = areNamesSelectedToFacility
      && areInsurancesSelected && areDegreesSelected
      && areSpecialtiesSelected && areLocalesSelected

    return areAllFieldsValid
}

function initializeSubmissionFormValues(submissionData: Submission | undefined) {
    const submittedHealthcareProfessionalName
    = submissionData?.healthcareProfessionalName?.split(' ') ?? []

    const facilitySectionFields = facilitiesStore.facilitySectionFields
    const healthcareProfessionalSections
    = healthcareProfessionalsStore.healthcareProfessionalSectionFields

    // Facility fields
    facilitySectionFields.nameEn = submissionData?.facility?.nameEn ?? ''
    facilitySectionFields.nameJa = submissionData?.facility?.nameJa ?? ''
    facilitySectionFields.phone = submissionData?.facility?.contact?.phone ?? ''
    facilitySectionFields.email = submissionData?.facility?.contact?.email ?? ''
    facilitySectionFields.website = submissionData?.facility?.contact?.website ?? ''
    facilitySectionFields.postalCode
    = submissionData?.facility?.contact?.address.postalCode ?? ''
    facilitySectionFields.prefectureEn
    = submissionData?.facility?.contact?.address.prefectureEn ?? ''
    facilitySectionFields.cityEn
    = submissionData?.facility?.contact?.address.cityEn ?? ''
    facilitySectionFields.addressLine1En
    = submissionData?.facility?.contact?.address.addressLine1En ?? ''
    facilitySectionFields.addressLine2En
    = submissionData?.facility?.contact?.address.addressLine2En ?? ''
    facilitySectionFields.prefectureJa
    = submissionData?.facility?.contact?.address.prefectureJa ?? ''
    facilitySectionFields.cityJa
    = submissionData?.facility?.contact?.address.cityJa ?? ''
    facilitySectionFields.addressLine1Ja
    = submissionData?.facility?.contact?.address.addressLine1Ja ?? ''
    facilitySectionFields.addressLine2Ja
    = submissionData?.facility?.contact?.address.addressLine2Ja ?? ''
    facilitySectionFields.mapLatitude
    = submissionData?.facility?.mapLatitude?.toString() ?? ''
    facilitySectionFields.mapLongitude
    = submissionData?.facility?.mapLongitude?.toString() ?? ''

    submissionFormFieldsBeforeChanges.nameEn
    = submissionData?.facility?.nameEn ?? ''
    submissionFormFieldsBeforeChanges.nameJa
    = submissionData?.facility?.nameJa ?? ''
    submissionFormFieldsBeforeChanges.phone
    = submissionData?.facility?.contact?.phone ?? ''
    submissionFormFieldsBeforeChanges.email
    = submissionData?.facility?.contact?.email ?? ''
    submissionFormFieldsBeforeChanges.website
    = submissionData?.facility?.contact?.website ?? ''
    submissionFormFieldsBeforeChanges.postalCode
    = submissionData?.facility?.contact?.address.postalCode ?? ''
    submissionFormFieldsBeforeChanges.prefectureEn
    = submissionData?.facility?.contact?.address.prefectureEn ?? ''
    submissionFormFieldsBeforeChanges.cityEn
    = submissionData?.facility?.contact?.address.cityEn ?? ''
    submissionFormFieldsBeforeChanges.addressLine1En
    = submissionData?.facility?.contact?.address.addressLine1En ?? ''
    submissionFormFieldsBeforeChanges.addressLine2En
    = submissionData?.facility?.contact?.address.addressLine2En ?? ''
    submissionFormFieldsBeforeChanges.prefectureJa
    = submissionData?.facility?.contact?.address.prefectureJa ?? ''
    submissionFormFieldsBeforeChanges.cityJa
    = submissionData?.facility?.contact?.address.cityJa ?? ''
    submissionFormFieldsBeforeChanges.addressLine1Ja
    = submissionData?.facility?.contact?.address.addressLine1Ja ?? ''
    submissionFormFieldsBeforeChanges.addressLine2Ja
    = submissionData?.facility?.contact?.address.addressLine2Ja ?? ''
    submissionFormFieldsBeforeChanges.mapLatitude
    = submissionData?.facility?.mapLatitude?.toString() ?? ''
    submissionFormFieldsBeforeChanges.mapLongitude
    = submissionData?.facility?.mapLongitude?.toString() ?? ''

    facilitySectionFields.googlemapsURL
    = submissionData?.facility?.contact?.googleMapsUrl
      ?? submissionData?.googleMapsUrl
      ?? ''
    submissionFormFieldsBeforeChanges.googlemapsURL
    = submissionData?.facility?.contact?.googleMapsUrl
      ?? submissionData?.googleMapsUrl
      ?? ''

    const hpIds = submissionData?.facility?.healthcareProfessionalIds ?? []
    facilitySectionFields.healthcareProfessionalIds = [...hpIds]
    currentExistingHealthcareProfessionals.value
    = hpIds
            .map(healthcareProfessionalId =>
                healthcareProfessionalsStore.healthcareProfessionalsData.find(
                    hp => hp.id === healthcareProfessionalId
                ))
            .filter((hp): hp is NonNullable<typeof hp> => hp !== undefined)

    // Healthcare Professionals fields
    healthcareProfessionalSections.names
    = submissionData?.healthcareProfessionals?.[0]?.names
      ?? (submittedHealthcareProfessionalName.length === 2
          ? [
              {
                  firstName: submittedHealthcareProfessionalName[0] || '',
                  lastName: submittedHealthcareProfessionalName[1] || '',
                  locale: submissionData?.spokenLanguages?.[0] ?? Locale.Und
              }
          ]
          : submittedHealthcareProfessionalName.length === 3
              ? [
                  {
                      firstName: submittedHealthcareProfessionalName[0] || '',
                      middleName: submittedHealthcareProfessionalName[1] || '',
                      lastName: submittedHealthcareProfessionalName[2] || '',
                      locale: submissionData?.spokenLanguages?.[0] ?? Locale.Und
                  }
              ]
              : [])

    submissionFormFieldsBeforeChanges.healthCareProfessionalNameArray
    = healthcareProfessionalSections.names

    const hpFacilityIds
    = submissionData?.healthcareProfessionals?.[0]?.facilityIds ?? []
    healthcareProfessionalSections.facilityIds = [...hpFacilityIds]
    currentFacilityRelations.value
    = hpFacilityIds
            .map(facilityId =>
                facilitiesStore.facilityData.find(facility => facility.id === facilityId))
            .filter((facility): facility is NonNullable<typeof facility> => facility !== undefined)

    healthcareProfessionalSections.acceptedInsurance
    = submissionData?.healthcareProfessionals?.[0]?.acceptedInsurance ?? []
    healthcareProfessionalSections.degrees
    = submissionData?.healthcareProfessionals?.[0]?.degrees ?? []
    healthcareProfessionalSections.specialties
    = submissionData?.healthcareProfessionals?.[0]?.specialties ?? []
    healthcareProfessionalSections.spokenLanguages
    = submissionData?.spokenLanguages ?? []

    submissionFormFieldsBeforeChanges.healthcareProfessionalAcceptedInsurances
    = submissionData?.healthcareProfessionals?.[0]?.acceptedInsurance ?? []
    submissionFormFieldsBeforeChanges.healthcareProfessionalDegrees
    = submissionData?.healthcareProfessionals?.[0]?.degrees ?? []
    submissionFormFieldsBeforeChanges.healthcareProfessionalSpecialties
    = submissionData?.healthcareProfessionals?.[0]?.specialties ?? []
    submissionFormFieldsBeforeChanges.spokenLanguages
    = submissionData?.spokenLanguages ?? []
}

// Checks if form fields have unsaved changes
function submissionHasUnsavedChanges() {
    const facilityFields = facilitiesStore.facilitySectionFields
    const healthcareProfessionalFields = healthcareProfessionalsStore.healthcareProfessionalSectionFields

    // Compare each relevant field against its initial value
    const hasFacilityChanges = (
        submissionFormFieldsBeforeChanges.nameEn !== facilityFields.nameEn
        || submissionFormFieldsBeforeChanges.nameJa !== facilityFields.nameJa
        || submissionFormFieldsBeforeChanges.phone !== facilityFields.phone
        || submissionFormFieldsBeforeChanges.email !== facilityFields.email
        || submissionFormFieldsBeforeChanges.website !== facilityFields.website
        || submissionFormFieldsBeforeChanges.postalCode !== facilityFields.postalCode
        || submissionFormFieldsBeforeChanges.prefectureEn !== facilityFields.prefectureEn
        || submissionFormFieldsBeforeChanges.cityEn !== facilityFields.cityEn
        || submissionFormFieldsBeforeChanges.addressLine1En !== facilityFields.addressLine1En
        || submissionFormFieldsBeforeChanges.addressLine2En !== facilityFields.addressLine2En
        || submissionFormFieldsBeforeChanges.prefectureJa !== facilityFields.prefectureJa
        || submissionFormFieldsBeforeChanges.cityJa !== facilityFields.cityJa
        || submissionFormFieldsBeforeChanges.addressLine1Ja !== facilityFields.addressLine1Ja
        || submissionFormFieldsBeforeChanges.addressLine2Ja !== facilityFields.addressLine2Ja
        || submissionFormFieldsBeforeChanges.mapLatitude !== facilityFields.mapLatitude
        || submissionFormFieldsBeforeChanges.mapLongitude !== facilityFields.mapLongitude
        || !arraysAreEqual(submissionFormFieldsBeforeChanges.healthcareProfessionalIDs, facilityFields.healthcareProfessionalIds)
    )

    const hasProfessionalChanges = (
        !arraysAreEqual(submissionFormFieldsBeforeChanges.healthCareProfessionalNameArray, healthcareProfessionalFields.names)
        || !arraysAreEqual(submissionFormFieldsBeforeChanges.healthcareProfessionalAcceptedInsurances,
                           healthcareProfessionalFields.acceptedInsurance)
                         || !arraysAreEqual(submissionFormFieldsBeforeChanges
                             .healthcareProfessionalDegrees, healthcareProfessionalFields.degrees)
                           || !arraysAreEqual(submissionFormFieldsBeforeChanges.healthcareProfessionalSpecialties,
                                              healthcareProfessionalFields.specialties)
                                            || !arraysAreEqual(submissionFormFieldsBeforeChanges.spokenLanguages,
                                                               healthcareProfessionalFields.spokenLanguages)
    )

    // This determins the overall state of the changes
    const hasChanges = hasFacilityChanges || hasProfessionalChanges
    formHasUnsavedChanges.value = hasChanges
    return hasChanges
}

async function submitUpdatedSubmission(e: Event) {
    // Prevent form submission before validation is completed.
    e.preventDefault()

    const id = moderationSubmissionStore.selectedSubmissionId || ''

    if (!id) {
        toast.error(t('modSubmissionForm.errorMessageFacilityId'))
        console.error(t('modSubmissionForm.errorMessageFacilityId'))
        return
    }

    const facilitySubmissionUpdate = currentFacilityRelations.value.length
        ? undefined
        : {
            nameEn: facilitiesStore.facilitySectionFields.nameEn,
            nameJa: facilitiesStore.facilitySectionFields.nameJa,
            contact: {
                googleMapsUrl: facilitiesStore.facilitySectionFields.googlemapsURL,
                email: facilitiesStore.facilitySectionFields.email,
                phone: facilitiesStore.facilitySectionFields.phone,
                website: facilitiesStore.facilitySectionFields.website,
                address: {
                    postalCode: facilitiesStore.facilitySectionFields.postalCode,
                    prefectureEn: facilitiesStore.facilitySectionFields.prefectureEn,
                    cityEn: facilitiesStore.facilitySectionFields.cityEn,
                    addressLine1En: facilitiesStore.facilitySectionFields.addressLine1En,
                    addressLine2En: facilitiesStore.facilitySectionFields.addressLine2En,
                    prefectureJa: facilitiesStore.facilitySectionFields.prefectureJa,
                    cityJa: facilitiesStore.facilitySectionFields.cityJa,
                    addressLine1Ja: facilitiesStore.facilitySectionFields.addressLine1Ja,
                    addressLine2Ja: facilitiesStore.facilitySectionFields.addressLine2Ja
                }
            },
            healthcareProfessionalIds: facilitiesStore.facilitySectionFields.healthcareProfessionalIds,
            mapLatitude: parseFloat(facilitiesStore.facilitySectionFields.mapLatitude) || 0,
            mapLongitude: parseFloat(facilitiesStore.facilitySectionFields.mapLongitude) || 0
        }

    const healthcareProfessionalUpdate = currentExistingHealthcareProfessionals.value.length
        ? undefined
        : [
            {
                acceptedInsurance: healthcareProfessionalsStore.healthcareProfessionalSectionFields
                    .acceptedInsurance,
                degrees: healthcareProfessionalsStore.healthcareProfessionalSectionFields
                    .degrees,
                specialties: healthcareProfessionalsStore.healthcareProfessionalSectionFields
                    .specialties,
                spokenLanguages: healthcareProfessionalsStore.healthcareProfessionalSectionFields
                    .spokenLanguages,
                names: healthcareProfessionalsStore.healthcareProfessionalSectionFields
                    .names,
                facilityIds: healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds
            }
        ]

    const submissionInputVariables: MutationUpdateSubmissionArgs = {
        id: moderationSubmissionStore.selectedSubmissionId,
        input: {
            isUnderReview: true,
            facility: facilitySubmissionUpdate,
            healthcareProfessionals: healthcareProfessionalUpdate
        }
    }

    const result = await moderationSubmissionStore.updateSubmission(submissionInputVariables)
    // This is used in the component and not graphQL call as it is user messaging and needs the mounted toast library
    if (result?.errors?.length) {
        handleServerErrorMessaging(result.errors, toast, t)
        return
    }

    const submissionResult = result.data

    // This updates the submission in the form with the values stored in the db on success
    if (submissionResult) initializeSubmissionFormValues(submissionResult)
    toast.success(t('modSubmissionForm.successMessageUpdated'))
    if (moderationSubmissionStore.updatingSubmissionFromTopBarAndExiting) {
        // reset all modal refs to prevent unintended side effects
        router.push('/moderation')
        await nextTick()
    }

    if (moderationSubmissionStore.updatingSubmissionFromTopBar) {
        await resetModalRefs()
    }
}

async function submitCompletedForm(e: Event) {
    // stop the form submitting before we validate
    e.preventDefault()

    const selectedSubmissionData = moderationSubmissionStore.selectedSubmissionData
    //This prevents submission of an already approved submission the backend does this but as an extra visual and check
    if (selectedSubmissionData && selectedSubmissionData.isApproved) {
        toast.info(t('modSubmissionForm.infoMessageAlreadyApproved'))
        return
    }

    if (selectedSubmissionData && !selectedSubmissionData.isUnderReview) {
        toast.info(t('modSubmissionForm.infoMessageUpdateNeeded'))
        return
    }

    // Validate facility fields ONLY if no existing facility is selected (i.e., a new one is being created/edited)
    const isValidFacility = isExistingFacilitySelected.value ? true : validateFacilityFields()
    // Validate healthcare professional fields ONLY if no existing HP is selected (i.e., a new one is being created/edited)
    const isValidHealthcareProfessional
        = isExistingHealthcareProfessionalSelected.value ? true : validateHealthcareProfessionalFields()

    // If a new facility is being added AND its fields are not valid, show error
    if (!isExistingFacilitySelected.value && !isValidFacility) {
        toast.error(t('modSubmissionForm.errorMessageFacilityInputsInvalid'))
        return
    }

    // If a new healthcare professional is being added AND its fields are not valid, show error
    if (!isExistingHealthcareProfessionalSelected.value && !isValidHealthcareProfessional) {
        toast.error(t('modSubmissionForm.errorMessageHealthcareInputsInvalid'))
        return
    }

    try {
        const result = await moderationSubmissionStore.approveSubmission()
        console.log(result)
        if (result?.errors?.length) {
            handleServerErrorMessaging(result.errors, toast, t)
            return
        }
        modalStore.hideModal()
        toast.success(t('modSubmissionForm.successMessageApproved'))
        // reset healthcareProfessionalSections
        healthcareProfessionalsStore.resetHealthcareProfessionalSectionFields()
        // reset facilitySectionFields
        facilitiesStore.resetFacilitySectionFields()
        // reset all modal refs to prevent unintended side effects
        router.push('/moderation')
        await resetModalRefs()
    } catch {
        toast.error(t('modSubmissionForm.errorMessageCompletedForm'))
    }
}

const syntheticEvent = new Event('submit', { bubbles: false, cancelable: true })

const resetModalRefs = async () => {
    moderationSubmissionStore.setShowRejectSubmissionConfirmation(false)
    moderationSubmissionStore.setApprovingSubmissionFromTopBar(false)
    moderationSubmissionStore.setUpdatingSubmissionFromTopBarAndExiting(false)
    moderationSubmissionStore.setUpdatingSubmissionFromTopBar(false)
    formHasUnsavedChanges.value = false
}

const rejectSubmission = async () => {
    await moderationSubmissionStore.rejectSubmission()
    await resetModalRefs()
    toast.success(t('modSubmissionForm.facilitySuccessfullyRejected'))
    handleNavigateToModerationScreen()
}

watch(moderationSubmissionStore, newValue => {
    //saves the submission by updating it and then going to the main
    if (newValue.updatingSubmissionFromTopBarAndExiting || newValue.updatingSubmissionFromTopBar) {
        submitUpdatedSubmission(syntheticEvent)
    }
})

onMounted(async () => {
    isEditSubmissionFormInitialized.value = false
    /**
    Set the variable to useToast when the compoenet mounts
    since vue-taostification is only available on the client.
    If not done this way the build fails
     */
    toast = useToast()
    loadingStore.setIsLoading(true)

    if (!moderationSubmissionStore.submissionsData.length) {
        await moderationSubmissionStore.getSubmissions()
    }

    // This will fetch the facilities if sent here by link or a page is refreshed
    if (!facilitiesStore.facilityData.length) {
        await facilitiesStore.getFacilities()
    }

    // This will fetch the healthcare professionals if sent here by link or a page is refreshed
    if (!healthcareProfessionalsStore.healthcareProfessionalsData) {
        await healthcareProfessionalsStore.getHealthcareProfessionals()
    }

    moderationSubmissionStore.filterSelectedSubmission(moderationSubmissionStore.selectedSubmissionId)

    await nextTick()

    initializeSubmissionFormValues(moderationSubmissionStore.selectedSubmissionData)

    await nextTick()

    isEditSubmissionFormInitialized.value = true
    loadingStore.setIsLoading(false)
})

const handleNavigateToModerationScreen = () => {
    modalStore.hideModal()
    screenStore.setActiveScreen(ModerationScreen.Dashboard)
    router.push('/moderation')
}

watch(currentFacilityRelations, newValue => {
    // If one or more existing Facilities have been selected (i.e., the search bar is not empty)
    if (newValue.length > 0) {
        // 1. Associate the IDs of the selected Facilities to the Healthcare Professional (correct association)
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds = newValue.map(facility => facility.id)
        // Set the flag to true, indicating an existing facility is selected
        isExistingFacilitySelected.value = true

        // 2. Populate the Facility form fields with the data of the selected Facility.
        //    We assume you are selecting a single Facility from the search bar for editing.
        //    If multi-selection and modification are allowed, the logic would be more complex.
        //    Here, we take the first selected item:
        const selectedFacility = newValue[0]
        if (selectedFacility) {
            facilitiesStore.facilitySectionFields.nameEn = selectedFacility.nameEn ?? ''
            facilitiesStore.facilitySectionFields.nameJa = selectedFacility.nameJa ?? ''
            facilitiesStore.facilitySectionFields.phone = selectedFacility.contact?.phone ?? ''
            facilitiesStore.facilitySectionFields.email = selectedFacility.contact?.email ?? ''
            facilitiesStore.facilitySectionFields.website = selectedFacility.contact?.website ?? ''
            facilitiesStore.facilitySectionFields.postalCode = selectedFacility.contact?.address?.postalCode ?? ''
            facilitiesStore.facilitySectionFields.prefectureEn = selectedFacility.contact?.address?.prefectureEn ?? ''
            facilitiesStore.facilitySectionFields.cityEn = selectedFacility.contact?.address?.cityEn ?? ''
            facilitiesStore.facilitySectionFields.addressLine1En = selectedFacility.contact?.address?.addressLine1En ?? ''
            facilitiesStore.facilitySectionFields.addressLine2En = selectedFacility.contact?.address?.addressLine2En ?? ''
            facilitiesStore.facilitySectionFields.prefectureJa = selectedFacility.contact?.address?.prefectureJa ?? ''
            facilitiesStore.facilitySectionFields.cityJa = selectedFacility.contact?.address?.cityJa ?? ''
            facilitiesStore.facilitySectionFields.addressLine1Ja = selectedFacility.contact?.address?.addressLine1Ja ?? ''
            facilitiesStore.facilitySectionFields.addressLine2Ja = selectedFacility.contact?.address?.addressLine2Ja ?? ''
            facilitiesStore.facilitySectionFields.mapLatitude = selectedFacility.mapLatitude?.toString() ?? ''
            facilitiesStore.facilitySectionFields.mapLongitude = selectedFacility.mapLongitude?.toString() ?? ''
            facilitiesStore.facilitySectionFields.googlemapsURL = selectedFacility.contact?.googleMapsUrl ?? ''
        }
    } else { // If NO existing Facility is selected (or has been deselected from the search bar)
        // Reset the fields to allow entering a NEW Facility
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds = [] // Remove IDs from the HP
        isExistingFacilitySelected.value = false // Set the flag to false
        facilitiesStore.resetFacilitySectionFields() // Clear the Facility form fields
    }
}, { deep: true })

watch(currentExistingHealthcareProfessionals, newValue => {
    // If healthcare professionals data is loaded and one or more existing HPs have been selected
    if (healthcareProfessionalsStore.healthcareProfessionalsData && newValue.length > 0) {
        // 1. Associate the IDs of the selected HPs to the Facility
        facilitiesStore.facilitySectionFields.healthcareProfessionalIds = newValue.map(
            healthcareProfessional => healthcareProfessional.id
        )
        // Set the flag to true, indicating an existing HP is selected
        isExistingHealthcareProfessionalSelected.value = true

        // 2. Populate the Healthcare Professional form fields with the data of the selected HP.
        //    We assume you are selecting a single HP from the search bar for editing.
        const selectedHp = newValue[0]
        if (selectedHp) {
            // Get the primary name available for the HP
            const primaryName = selectedHp.names?.[0]
            if (primaryName) {
                healthcareProfessionalsStore.healthcareProfessionalSectionFields.names = [{
                    firstName: primaryName.firstName ?? '',
                    middleName: primaryName.middleName ?? '',
                    lastName: primaryName.lastName ?? '',
                    locale: primaryName.locale ?? Locale.Und // Ensure Locale.Und is handled correctly
                }]
            } else {
                healthcareProfessionalsStore.healthcareProfessionalSectionFields.names = []
            }

            healthcareProfessionalsStore.healthcareProfessionalSectionFields.acceptedInsurance
                = selectedHp.acceptedInsurance ?? []
            healthcareProfessionalsStore.healthcareProfessionalSectionFields.degrees = selectedHp.degrees ?? []
            healthcareProfessionalsStore.healthcareProfessionalSectionFields.specialties = selectedHp.specialties ?? []
            healthcareProfessionalsStore.healthcareProfessionalSectionFields.spokenLanguages = selectedHp.spokenLanguages ?? []
        }
    } else { // If NO existing HP is selected (or has been deselected from the search bar)
        // Reset the fields to allow entering a NEW HP
        facilitiesStore.facilitySectionFields.healthcareProfessionalIds = []// Remove IDs from the Facility
        isExistingHealthcareProfessionalSelected.value = false// Set the flag to false
        healthcareProfessionalsStore.resetHealthcareProfessionalSectionFields()// Clear the HP form fields
    }
}, { deep: true })

onBeforeRouteLeave(async (to, from, next) => {
    if (!moderationSubmissionStore.updatingSubmissionFromTopBarAndExiting && submissionHasUnsavedChanges()) {
        modalStore.showModal()
        next(false)
        return
    }
    await resetModalRefs()
    // reset healthcareProfessionalSections
    healthcareProfessionalsStore.resetHealthcareProfessionalSectionFields()
    // reset facilitySectionFields
    facilitiesStore.resetFacilitySectionFields()
    next()
})
</script>
