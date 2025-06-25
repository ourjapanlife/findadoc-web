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
                    {{ t('modSubmissionForm.submissionConfirmationMessage') }}
                </span>
                <button
                    type="button"
                    class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                    @click="submitCompletedForm"
                >
                    {{ t('modSubmissionForm.submissionConfirmationAcceptanceButton') }}
                </button>
            </div>
            <div
                v-else-if="moderationSubmissionStore.showRejectSubmissionConfirmation"
                data-testid="reject-confirmation"
                class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
            >
                <span class="font-bold text-3xl">
                    {{ t('modSubmissionForm.rejectSubmissionConfirmationMessage') }}
                </span>
                <button
                    data-testid="reject-submission-confirmation-btn"
                    type="button"
                    class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                    @click="rejectSubmission"
                >
                    {{ t('modSubmissionForm.rejectSubmissionConfirmationButton') }}
                </button>
            </div>
            <div
                v-else-if="formHasUnsavedChanges()"
                class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
            >
                <span class="font-bold text-3xl">{{ t('modSubmissionForm.hasUnsavedChanges') }}</span>
                <button
                    type="button"
                    data-testid="submission-unsaved-confirmation-btn"
                    class="bg-secondary p-4 rounded-full my-8 font-semibold text-xl hover:bg-primary"
                    @click="handleNavigateToModerationScreen"
                >
                    {{ t('modSubmissionForm.confirmationButton') }}
                </button>
            </div>
        </Modal>
    </div>
    <div class="flex">
        <div

            class="flex flex-col mr-8"
        >
            <div v-if="!currentExistingHealthcareProfessionals.length">
                <label
                    for="mod-edit-submission-form-facilities"
                    class="my-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ t('modSubmissionForm.searchExistingFacilities') }}
                </label>
                <ModSearchBar
                    v-model="currentFacilityRelations"
                    :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextFacilitySearchBar')"
                    :no-match-text="t('modHealthcareProfessionalSection.noFacilitiesWereFound')"
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
            </div>
            <div
                v-show="!currentFacilityRelations.length"
                class="mod-edit-facility-section"
            >
                <h1
                    class="mb-3.5 text-start text-primary-text text-3xl font-bold font-sans leading-normal"
                >
                    {{ t('modFacilitySection.facilityHeading') }}
                </h1>
                <ModEditFacilitySection />
            </div>
        </div>
        <div
            class="flex flex-col"
        >
            <div v-if="!currentFacilityRelations.length">
                <label
                    for="mod-edit-submission-form-healthcare-professionals"
                    class="my-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ t('modSubmissionForm.searchExistingHealthcareProfessionals') }}
                </label>
                <ModSearchBar
                    v-model="currentExistingHealthcareProfessionals"
                    data-testid="mod-facility-section-doctor-search"
                    :place-holder-text="t('modFacilitySection.placeholderTextHealthcareProfessionalSearchbar')"
                    :no-match-text="t('modFacilitySection.noHealthcareProfessionalFound')"
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
            </div>
            <div
                v-show="!currentExistingHealthcareProfessionals.length"
                class="mod-edit-healthcare-professional-section"
            >
                <ModEditHealthcareProfessionalSection />
            </div>
            <NoteInputField
                v-model="currentSubmissionNotes"
                data-testid="submission-form-notes"
                :label="t('modSubmissionForm.labelModNoteInput')"
                :placeholder="t('modSubmissionForm.placeholderTextNoteInput')"
                :required="false"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { Locale,
    type Submission,
    type MutationUpdateSubmissionArgs,
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
import { handleServerErrorMessaging } from '~/composables/handleServerErrorMessaging'

const toast = useToast()
const { t } = useI18n()
const router = useRouter()

const moderationSubmissionStore = useModerationSubmissionsStore()
const modalStore = useModalStore()
const screenStore = useModerationScreenStore()
const loadingStore = useLoadingStore()
const facilitiesStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()

const currentSubmissionNotes = ref('')

const syntheticEvent = new Event('submit', { bubbles: false, cancelable: true })

const isEditSubmissionFormInitialized: Ref<boolean> = ref(false)
const submissionBeforeChanges: Ref<Submission | undefined> = computed(() => moderationSubmissionStore.selectedSubmissionData
    ? {
        ...moderationSubmissionStore.selectedSubmissionData
    }
    : undefined)

// Keeps track of existing facilities related to new healthcare professional submission
const currentFacilityRelations: Ref<Facility[]> = ref([])
// Keeps track of existing healthcare professionals related to new facility submission
const currentExistingHealthcareProfessionals: Ref<HealthcareProfessional[]> = ref([])

const handleFacilitySearchInputChange = (filteredItems: Ref<Facility[]>, inputValue: string) => {
    filteredItems.value = facilitiesStore.facilityData.filter(({ nameEn, nameJa, id }) => {
        const isMatch
            = nameEn.toLowerCase().includes(inputValue)
              || nameJa.toLowerCase().includes(inputValue)
              || id.toLowerCase().includes(inputValue)
        return isMatch
    })

    if (currentFacilityRelations.value.length) {
        facilitiesStore.resetFacilitySectionFields()
        return
    }

    if (!currentFacilityRelations.value.length) {
        initializeSubmissionFormValues(moderationSubmissionStore.selectedSubmissionData)
        return
    }
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

    if (currentExistingHealthcareProfessionals.value.length) {
        healthcareProfessionalsStore.resetHealthcareProfessionalSectionFields()
        return
    }

    if (!currentExistingHealthcareProfessionals.value.length) {
        initializeSubmissionFormValues(moderationSubmissionStore.selectedSubmissionData)
        return
    }
}
const healthcareProfessionalsToDisplayCallback = (healthcareProfessional: HealthcareProfessional) =>
    [healthcareProfessional.names[0].firstName + ' ' + healthcareProfessional.names[0].lastName]

const validateFacilityFields = () => {
    const facilitySections = facilitiesStore.facilitySectionFields
    // Required fields
    const isNameEnValid: boolean = validateNameEn(facilitySections.nameEn)
    const isNameJaValid: boolean = validateNameJa(facilitySections.nameJa)
    const isPhoneValid: boolean = validatePhoneNumber(facilitySections.phone)
    const isAddressLine1EnValid: boolean = validateAddressLineEn(facilitySections.addressLine1En)
    const isAddressLine1JaValid: boolean = validateAddressLineJa(facilitySections.addressLine1Ja)
    const isCityEnValid: boolean = validateCityEn(facilitySections.cityEn)
    const isCityJaValid: boolean = validateCityJa(facilitySections.cityJa)
    const isPostalCodeValid: boolean = validatePostalCode(facilitySections.postalCode)
    const isLatitudeValid: boolean = validateFloat(facilitySections.mapLatitude)
    const isLongitudeValid: boolean = validateFloat(facilitySections.mapLongitude)

    // Optional fields: only validate if present
    const isEmailValid: boolean = !facilitySections.email || validateEmail(facilitySections.email)
    const isWebsiteValid: boolean = !facilitySections.website || validateWebsite(facilitySections.website)
    const isAddressLine2EnValid: boolean = !facilitySections.addressLine2En
      || validateAddressLineEn(facilitySections.addressLine2En)
    const isAddressLine2JaValid: boolean = !facilitySections.addressLine2Ja
      || validateAddressLineJa(facilitySections.addressLine2Ja)

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
    const healthcareProfessionalFields = healthcareProfessionalsStore.healthcareProfessionalSectionFields
    const facilitySectionFields = facilitiesStore.facilitySectionFields

    const areNamesSelectedToFacility: boolean
        = healthcareProfessionalFields.names.length > 0
          || facilitySectionFields.healthcareProfessionalIds.length > 0
    const areInsurancesSelected: boolean = healthcareProfessionalFields.acceptedInsurance.length > 0
    const areDegreesSelected: boolean = healthcareProfessionalFields.degrees.length > 0
    const areSpecialtiesSelected: boolean = healthcareProfessionalFields.spokenLanguages.length > 0
    const areLocalesSelected: boolean = healthcareProfessionalFields.spokenLanguages.length > 0

    const areAllFieldsValid = areNamesSelectedToFacility
      && areInsurancesSelected && areDegreesSelected
      && areSpecialtiesSelected && areLocalesSelected

    return areAllFieldsValid
}

function initializeSubmissionFormValues(submissionData: Submission | undefined) {
    const submittedHealthcareProfessionalName
    = submissionData?.healthcareProfessionalName?.split(' ') ?? []

    if (submissionData && submissionData.notes) {
        currentSubmissionNotes.value = submissionData.notes
    }

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

    facilitySectionFields.googlemapsURL
    = submissionData?.facility?.contact?.googleMapsUrl
      ?? submissionData?.googleMapsUrl
      ?? ''

    facilitySectionFields.healthcareProfessionalIds = submissionData?.facility?.healthcareProfessionalIds ?? []
    currentExistingHealthcareProfessionals.value
    = facilitySectionFields.healthcareProfessionalIds
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
}

// Assume you already have:
// • isEditSubmissionFormInitialized
// • submissionFormFieldsBeforeChanges (“before” snapshot)
// • facilitiesStore.facilitySectionFields → facility
// • healthcareProfessionalsStore.healthcareProfessionalSectionFields → hp
// • arraysAreEqual
const formHasUnsavedChanges = () => {
    const facilitySectionFields = facilitiesStore.facilitySectionFields
    const hpSectionFields = healthcareProfessionalsStore.healthcareProfessionalSectionFields
    const submissionBeforeChangesComparison = submissionBeforeChanges.value

    if (!submissionBeforeChangesComparison) {
        return false
    }

    // Check the diffs in the facility section
    const facilityChanged = (
        submissionBeforeChangesComparison?.facility?.nameEn !== facilitySectionFields.nameEn
        || submissionBeforeChangesComparison?.facility?.nameJa !== facilitySectionFields.nameJa
        || submissionBeforeChangesComparison?.facility?.contact?.phone !== facilitySectionFields.phone
        || (submissionBeforeChangesComparison?.facility?.contact?.email
          && submissionBeforeChangesComparison?.facility?.contact?.email !== facilitySectionFields.email)
        || (submissionBeforeChangesComparison?.facility?.contact?.website
          && submissionBeforeChangesComparison?.facility?.contact?.website !== facilitySectionFields.website)
        || submissionBeforeChangesComparison?.facility?.contact?.address?.postalCode !== facilitySectionFields.postalCode
        || !arraysAreEqual(submissionBeforeChangesComparison?.facility?.healthcareProfessionalIds,
                           facilitySectionFields.healthcareProfessionalIds)
    )

    // Check the diffs in the healthcare professional section
    const hpChanged = (
        (submissionBeforeChangesComparison?.healthcareProfessionals?.[0]?.names
            ? !arraysAreEqual(
                submissionBeforeChangesComparison?.healthcareProfessionals?.[0]?.names,
                hpSectionFields.names
            )
            : false)
          || (submissionBeforeChangesComparison?.healthcareProfessionals?.[0]?.acceptedInsurance
              ? !arraysAreEqual(
                  submissionBeforeChangesComparison?.healthcareProfessionals?.[0]?.acceptedInsurance,
                  hpSectionFields.acceptedInsurance
              )
              : false)
            || (submissionBeforeChangesComparison?.healthcareProfessionals?.[0]?.degrees
                ? !arraysAreEqual(
                    submissionBeforeChangesComparison?.healthcareProfessionals?.[0]?.degrees,
                    hpSectionFields.degrees
                )
                : false)
              || (submissionBeforeChangesComparison?.healthcareProfessionals?.[0]?.specialties
                  ? !arraysAreEqual(submissionBeforeChangesComparison?.healthcareProfessionals?.[0]?.specialties,
                                    hpSectionFields.specialties)
                  : false)
                || (submissionBeforeChangesComparison?.healthcareProfessionals?.[0]?.spokenLanguages
                    ? !arraysAreEqual(submissionBeforeChangesComparison?.healthcareProfessionals?.[0]?.spokenLanguages,
                                      hpSectionFields.spokenLanguages)
                    : false)
    )

    return facilityChanged || hpChanged
}

async function submitUpdatedSubmission(e: Event) {
    // Prevent form submission before validation is completed.
    e.preventDefault()

    const id = moderationSubmissionStore.selectedSubmissionId || ''

    if (!id) {
        toast.error(t('modSubmissionForm.errorMessageFacilityId'))
        console.error(t('modSubmissionForm.errorMessageFacilityId'))
        await resetModalRefs()
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
            healthcareProfessionals: healthcareProfessionalUpdate,
            notes: currentSubmissionNotes.value
        }
    }

    const result = await moderationSubmissionStore.updateSubmission(submissionInputVariables)
    // This is used in the component and not graphQL call as it is user messaging and needs the mounted toast library
    if (result?.errors?.length) {
        handleServerErrorMessaging(result.errors, toast, t)
        await resetModalRefs()
        return
    }

    const submissionResult = result.data

    // This updates the submission in the form with the values stored in the db on success
    if (submissionResult) initializeSubmissionFormValues(submissionResult)
    toast.success(t('modSubmissionForm.successMessageUpdated'))
    if (moderationSubmissionStore.updatingSubmissionFromTopBarAndExiting) {
        // reset all modal refs to prevent unintended side effects
        router.push('/moderation')
        return
    }

    if (moderationSubmissionStore.updatingSubmissionFromTopBar) {
        await resetModalRefs()
    }
}

async function submitCompletedForm(e: Event) {
    // stop the form submitting before we validate
    e.preventDefault()

    const selectedSubmissionData = moderationSubmissionStore.selectedSubmissionData
    // This prevents submission of an already approved submission the backend does this but as an extra visual and check
    if (selectedSubmissionData && selectedSubmissionData.isApproved) {
        toast.info(t('modSubmissionForm.infoMessageAlreadyApproved'))
        await resetModalRefs()
        return
    }

    if (selectedSubmissionData && !selectedSubmissionData.isUnderReview) {
        toast.info(t('modSubmissionForm.infoMessageUpdateNeeded'))
        await resetModalRefs()
        return
    }

    const isValidFacility = validateFacilityFields()
    const isValidHealthcareProfessional = validateHealthcareProfessionalFields()

    // This shows a toast and returns if the facility fields arent valid
    if (!isValidFacility && !currentFacilityRelations.value.length) {
        toast.error(t('modSubmissionForm.errorMessageFacilityInputsInvalid'))
        await resetModalRefs()
        return
    }

    if (!isValidHealthcareProfessional && !currentExistingHealthcareProfessionals.value.length) {
        toast.error(t('modSubmissionForm.errorMessageHealthcareInputsInvalid'))
        await resetModalRefs()
        return
    }

    try {
        // This updates submission before approving since moderators might not think to update first
        await submitUpdatedSubmission(syntheticEvent)
        const result = await moderationSubmissionStore.approveSubmission()
        if (result?.errors?.length) {
            handleServerErrorMessaging(result.errors, toast, t)
            await resetModalRefs()
            return
        }
        await resetModalRefs()
        toast.success(t('modSubmissionForm.successMessageApproved'))
        await router.push('/moderation')
    } catch {
        toast.error(t('modSubmissionForm.errorMessageCompletedForm'))
        await resetModalRefs()
    }
}

const resetModalRefs = async () => {
    await nextTick()
    moderationSubmissionStore.setShowRejectSubmissionConfirmation(false)
    moderationSubmissionStore.setApprovingSubmissionFromTopBar(false)
    moderationSubmissionStore.setUpdatingSubmissionFromTopBarAndExiting(false)
    moderationSubmissionStore.setUpdatingSubmissionFromTopBar(false)
    modalStore.hideModal()
}

const rejectSubmission = async () => {
    await moderationSubmissionStore.rejectSubmission()
    await resetModalRefs()
    toast.success(t('modSubmissionForm.facilitySuccessfullyRejected'))
    handleNavigateToModerationScreen()
}

watch(
    () => [
        moderationSubmissionStore.updatingSubmissionFromTopBarAndExiting,
        moderationSubmissionStore.updatingSubmissionFromTopBar,
        moderationSubmissionStore.approvingSubmissionFromTopBar,
        moderationSubmissionStore.showRejectSubmissionConfirmation
    ],
    ([updatingSubmissionAndExiting, updatingSubmission, approvingSubmission, showRejectSubmissionConfirmation]) => {
        if (approvingSubmission || showRejectSubmissionConfirmation) {
            modalStore.showModal()
            return
        }
        if (updatingSubmissionAndExiting || updatingSubmission) {
            submitUpdatedSubmission(syntheticEvent)
        }
    }
)

onMounted(async () => {
    isEditSubmissionFormInitialized.value = false

    loadingStore.setIsLoading(true)

    if (!moderationSubmissionStore.submissionsData.length) {
        await moderationSubmissionStore.getSubmissions()
    }

    // This will fetch the facilities if sent here by link or a page is refreshed
    if (!facilitiesStore.facilityData.length) {
        await facilitiesStore.getFacilities()
    }

    // This will fetch the healthcare professionals if sent here by link or a page is refreshed
    if (!healthcareProfessionalsStore.healthcareProfessionalsData.length) {
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

/* This updates the healthcare professional with existing facilities in order to update
 the healthcare professional section fields to include the existing facility ids
 and help prevent adding duplicate of the same facility */
watch(currentFacilityRelations, newValue => {
    if (isEditSubmissionFormInitialized.value) {
        const newIds = newValue.map(facility => facility.id)
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds = newIds
    }
}, { deep: true })

/* This updates the fcaility with existing healthcare professionals in order to update
 the facility section fields to include the existing healthcare professional ids
 and help prevent adding duplicate of the same healthcareprofessional */
watch(currentExistingHealthcareProfessionals, newValue => {
    if (isEditSubmissionFormInitialized.value) {
        facilitiesStore.facilitySectionFields.healthcareProfessionalIds = newValue.map(
            healthcareProfessional => healthcareProfessional.id
        )
    }
}, { deep: true })

onBeforeRouteLeave(async (_, __, next) => {
    if (formHasUnsavedChanges()
      && !moderationSubmissionStore.updatingSubmissionFromTopBarAndExiting
      && !moderationSubmissionStore.approvingSubmissionFromTopBar) {
        modalStore.showModal()
        next(false)
        return
    }
    await resetModalRefs()
    next()
})
</script>
