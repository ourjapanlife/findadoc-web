<template>
    <Loader />
    <div v-if="isEditSubmissionFormInitialized">
        <Modal
            data-testid="submission-form-modal"
            @modal-closed="resetModalRefs"
        >
            <div
                v-if="showApproveSubmissionConfirmation"
                class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
            >
                <span class="font-bold text-3xl">
                    {{ t('modSubmissionForm.submissionConfirmationMessage') }}
                </span>
                <button
                    type="button"
                    class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                    @click="confirmAndApproveSubmission"
                >
                    {{ t('modSubmissionForm.submissionConfirmationAcceptanceButton') }}
                </button>
            </div>
            <div
                v-else-if="showRejectSubmissionConfirmation"
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
                    v-model="selectedFacilityRelationsModel"
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
                    v-model="selectedHealthcareProfessionalsModel"
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
                        {{ `${healthcareProfessional.id} / ${healthcareProfessional.names[0]?.lastName}
                    / ${healthcareProfessional.names[0]?.firstName}` }}
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
                :text-size="'text-2xl'"
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
import { useI18n } from '#imports'
import { stableStringify } from '~/utils/stableStringify'
import { returnWithSuccessToast } from '~/composables/useModerationActionFeedback'
import { guardWithErrorToastAndEffect } from '~/composables/useModerationGuardFeedback'
import { handleModerationResponseErrors } from '~/composables/useModerationResponseHandling'
import { ModerationSubmissionActionType, useModerationSubmissionActions } from '~/composables/useModerationSubmissionActions'
import { mapIdsToEntities, matchesFacilitySearch, matchesHealthcareProfessionalSearch } from '~/utils/moderationSearchUtils'
import { formatFirstLocalizedFullName, hasEnglishLocalizedName } from '~/utils/nameUtils'
import { navigateToModerationDashboard as goToModerationDashboard } from '~/utils/moderationUtils'
import {
    hasRequiredHealthcareProfessionalSelections,
    validateModerationFacilityFields
} from '~/utils/moderationFormValidationUtils'

const toast = useToast()
const { t } = useI18n()
const router = useRouter()

const moderationSubmissionStore = useModerationSubmissionsStore()
const { moderationSubmissionAction } = useModerationSubmissionActions()
const modalStore = useModalStore()
const screenStore = useModerationScreenStore()
const loadingStore = useLoadingStore()
const facilitiesStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()

const currentSubmissionNotes = ref('')

// Single reactive snapshot for useUnsavedChanges (plugin shows confirmation on browser back / router leave).
const formState = computed(() => ({
    facility: JSON.parse(stableStringify(facilitiesStore.facilitySectionFields)),
    hp: JSON.parse(stableStringify(healthcareProfessionalsStore.healthcareProfessionalSectionFields)),
    notes: currentSubmissionNotes.value
}))
const { makeNonDirty } = useUnsavedChanges({
    data: { source: formState },
    mode: 'update',
    onClose: () => navigateToModerationDashboard()
})

const isEditSubmissionFormInitialized: Ref<boolean> = ref(false)
const showApproveSubmissionConfirmation: Ref<boolean> = ref(false)
const showRejectSubmissionConfirmation: Ref<boolean> = ref(false)
const lastHandledActionId: Ref<number> = ref(0)
const submissionBeforeChanges: Ref<Submission | undefined> = ref(undefined)

// Keeps track of existing facilities related to new healthcare professional submission
const currentFacilityRelations: Ref<Facility[]> = ref([])
// Keeps track of existing healthcare professionals related to new facility submission
const currentExistingHealthcareProfessionals: Ref<HealthcareProfessional[]> = ref([])
const selectedFacilityRelationsModel = computed({
    get: () => currentFacilityRelations.value,
    set: (newValue: Facility[]) => {
        currentFacilityRelations.value = newValue
        if (isEditSubmissionFormInitialized.value) {
            healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds = newValue.map(facility => facility.id)
        }
    }
})
const selectedHealthcareProfessionalsModel = computed({
    get: () => currentExistingHealthcareProfessionals.value,
    set: (newValue: HealthcareProfessional[]) => {
        currentExistingHealthcareProfessionals.value = newValue
        if (isEditSubmissionFormInitialized.value) {
            facilitiesStore.facilitySectionFields.healthcareProfessionalIds = newValue.map(
                healthcareProfessional => healthcareProfessional.id
            )
        }
    }
})

const handleFacilitySearchInputChange = (filteredItems: Ref<Facility[]>, inputValue: string) => {
    filteredItems.value = facilitiesStore.facilityData.filter(facility => matchesFacilitySearch(facility, inputValue))

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
        .filter((healthcareProfessional: HealthcareProfessional) =>
            matchesHealthcareProfessionalSearch(healthcareProfessional, inputValue))

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
    [formatFirstLocalizedFullName(healthcareProfessional.names)]

const validateFacilityFields = () =>
    validateModerationFacilityFields(facilitiesStore.facilitySectionFields)

const validateHealthcareProfessionalFields = () => {
    const healthcareProfessionalFields = healthcareProfessionalsStore.healthcareProfessionalSectionFields
    const facilitySectionFields = facilitiesStore.facilitySectionFields

    const areNamesSelectedToFacility: boolean
        = healthcareProfessionalFields.names.length > 0
          || facilitySectionFields.healthcareProfessionalIds.length > 0
    return areNamesSelectedToFacility
      && hasRequiredHealthcareProfessionalSelections(healthcareProfessionalFields)
}

const validateHealthcareProfessionalEnglishName = () => {
    const healthcareProfessionalFields = healthcareProfessionalsStore.healthcareProfessionalSectionFields
    return hasEnglishLocalizedName(healthcareProfessionalFields.names)
}

// Manual deep copy function for submission data
function createSubmissionDeepCopy(submissionData: Submission): Submission {
    return {
        ...submissionData,
        facility: submissionData.facility
            ? {
                ...submissionData.facility,
                contact: submissionData.facility.contact
                    ? {
                        ...submissionData.facility.contact,
                        address: {
                            ...submissionData.facility.contact.address
                        }
                    }
                    : undefined,
                healthcareProfessionalIds: [...submissionData.facility.healthcareProfessionalIds]
            }
            : undefined,
        healthcareProfessionals: submissionData.healthcareProfessionals?.map(hp => ({
            ...hp,
            names: hp.names.map(name => ({ ...name })),
            acceptedInsurance: hp.acceptedInsurance ? [...hp.acceptedInsurance] : [],
            degrees: hp.degrees ? [...hp.degrees] : [],
            specialties: hp.specialties ? [...hp.specialties] : [],
            spokenLanguages: hp.spokenLanguages ? [...hp.spokenLanguages] : [],
            facilityIds: hp.facilityIds ? [...hp.facilityIds] : []
        })) || []
    }
}

function initializeSubmissionFormValues(submissionData: Submission | undefined) {
    // Create a deep copy of the submission data to preserve the original state
    if (submissionData) {
        submissionBeforeChanges.value = createSubmissionDeepCopy(submissionData)
    }

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
    currentExistingHealthcareProfessionals.value = mapIdsToEntities(
        facilitySectionFields.healthcareProfessionalIds,
        healthcareProfessionalsStore.healthcareProfessionalsData
    )

    // Healthcare Professionals fields
    const hp = submissionData?.healthcareProfessionals?.[0]

    healthcareProfessionalSections.names
        = hp?.names
          ?? (submittedHealthcareProfessionalName.length === 2
              ? [
                  {
                      firstName: submittedHealthcareProfessionalName[0] || '',
                      lastName: submittedHealthcareProfessionalName[1] || '',
                      locale: Locale.Und
                  }
              ]
              : submittedHealthcareProfessionalName.length === 3
                  ? [
                      {
                          firstName: submittedHealthcareProfessionalName[0] || '',
                          middleName: submittedHealthcareProfessionalName[1] || '',
                          lastName: submittedHealthcareProfessionalName[2] || '',
                          locale: Locale.Und
                      }
                  ]
                  : [])

    healthcareProfessionalSections.facilityIds = [...(hp?.facilityIds ?? [])]
    currentFacilityRelations.value = mapIdsToEntities(
        healthcareProfessionalSections.facilityIds,
        facilitiesStore.facilityData
    )

    if (submissionData?.healthcareProfessionals?.[0]?.acceptedInsurance) {
        healthcareProfessionalSections.acceptedInsurance
            = submissionData.healthcareProfessionals[0].acceptedInsurance
    }

    if (submissionData?.healthcareProfessionals?.[0]?.additionalInfoForPatients) {
        healthcareProfessionalSections.additionalInfoForPatients
            = submissionData.healthcareProfessionals[0].additionalInfoForPatients
    }

    if (submissionData?.healthcareProfessionals?.[0]?.degrees) {
        healthcareProfessionalSections.degrees
            = submissionData.healthcareProfessionals[0].degrees
    }
    if (submissionData?.healthcareProfessionals?.[0]?.specialties) {
        healthcareProfessionalSections.specialties
            = submissionData.healthcareProfessionals[0].specialties
    }

    // Always include submissionData.spokenLanguages, append hp.spokenLanguages, remove duplicates
    healthcareProfessionalSections.spokenLanguages = [
        ...(submissionData?.spokenLanguages ?? []),
        ...(hp?.spokenLanguages ?? [])
    ].filter((value, index, self) => self.indexOf(value) === index)
}

// •
// • submissionFormFieldsBeforeChanges (“before” snapshot)
// • facilitiesStore.facilitySectionFields → facility
// • healthcareProfessionalsStore.healthcareProfessionalSectionFields → hp
async function saveSubmissionDraft(
    e: Event,
    options: {
        showSuccessToast?: boolean
        shouldExitAfterUpdate?: boolean
        shouldResetModalRefsAfterUpdate?: boolean
    } = {}
) {
    e.preventDefault()

    const id = moderationSubmissionStore.selectedSubmissionId || ''
    if (!id) {
        toast.error(t('modSubmissionForm.errorMessageFacilityId'))
        console.error(t('modSubmissionForm.errorMessageFacilityId'))
        await resetModalRefs()
        return
    }

    const facilitySubmissionUpdate = {
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

    const healthcareProfessionalUpdate = [
        {
            acceptedInsurance: healthcareProfessionalsStore.healthcareProfessionalSectionFields.acceptedInsurance,
            additionalInfoForPatients: healthcareProfessionalsStore.healthcareProfessionalSectionFields.additionalInfoForPatients,
            degrees: healthcareProfessionalsStore.healthcareProfessionalSectionFields.degrees,
            specialties: healthcareProfessionalsStore.healthcareProfessionalSectionFields.specialties,
            spokenLanguages: healthcareProfessionalsStore.healthcareProfessionalSectionFields.spokenLanguages,
            names: healthcareProfessionalsStore.healthcareProfessionalSectionFields.names,
            facilityIds: healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds
        }
    ]

    const submissionInputVariables: MutationUpdateSubmissionArgs = {
        id,
        input: {
            isUnderReview: true,
            facility: facilitySubmissionUpdate,
            healthcareProfessionals: healthcareProfessionalUpdate,
            notes: currentSubmissionNotes.value
        }
    }

    const result = await moderationSubmissionStore.updateSubmission(submissionInputVariables)
    if (handleModerationResponseErrors(result, toast, t)) {
        await resetModalRefs()
        return
    }

    const submissionResult = result.data
    if (submissionResult) initializeSubmissionFormValues(submissionResult.updateSubmission)

    if (options.showSuccessToast ?? true) {
        returnWithSuccessToast(result, toast, t, 'modSubmissionForm.successMessageUpdated')
    }
    if (options.shouldExitAfterUpdate) {
        await goToModerationDashboard(router, screenStore)
        return
    }

    if (options.shouldResetModalRefsAfterUpdate) {
        await resetModalRefs()
    }
}

async function confirmAndApproveSubmission(e: Event) {
    // stop the form submitting before we validate
    e.preventDefault()

    const selectedSubmissionData = moderationSubmissionStore.selectedSubmissionData
    // This prevents submission of an already approved submission the backend does this but as an extra visual and check
    if (selectedSubmissionData && selectedSubmissionData.isApproved) {
        toast.info(t('modSubmissionForm.infoMessageAlreadyApproved'))
        await resetModalRefs()
        return
    }

    const faciliyAlreadyExistsInOurDatabase = currentFacilityRelations.value.length
    const healthcareProfessionalAlreadyExistsInOurDatabase = currentExistingHealthcareProfessionals.value.length

    // This shows a toast and returns if the facility fields arent valid
    if (!faciliyAlreadyExistsInOurDatabase) {
        const isValidFacility = validateFacilityFields()
        if (await guardWithErrorToastAndEffect(
            !isValidFacility,
            toast,
            t,
            'modSubmissionForm.errorMessageFacilityInputsInvalid',
            resetModalRefs
        )) {
            return
        }
    }

    if (!healthcareProfessionalAlreadyExistsInOurDatabase) {
        const isValidHealthcareProfessional = validateHealthcareProfessionalFields()
        if (await guardWithErrorToastAndEffect(
            !isValidHealthcareProfessional,
            toast,
            t,
            'modSubmissionForm.errorMessageHealthcareInputsInvalid',
            resetModalRefs
        )) {
            return
        }
        const hasEnglishName = validateHealthcareProfessionalEnglishName()
        if (await guardWithErrorToastAndEffect(
            !hasEnglishName,
            toast,
            t,
            'modSubmissionForm.errorMessageEnglishNameRequired',
            resetModalRefs
        )) {
            return
        }
    }

    try {
        // This updates submission before approving since moderators might not think to update first
        await saveSubmissionDraft(
            new Event('submit', { bubbles: false, cancelable: true }),
            { showSuccessToast: false }
        )
        const result = await moderationSubmissionStore.approveSubmission()
        if (handleModerationResponseErrors(result, toast, t)) {
            await resetModalRefs()
            return
        }
        await resetModalRefs()
        returnWithSuccessToast(result, toast, t, 'modSubmissionForm.successMessageApproved')
        await goToModerationDashboard(router, screenStore)
    } catch {
        toast.error(t('modSubmissionForm.errorMessageCompletedForm'))
        await resetModalRefs()
    }
}

const resetModalRefs = async () => {
    await nextTick()
    showRejectSubmissionConfirmation.value = false
    showApproveSubmissionConfirmation.value = false
    modalStore.hideModal()
}

const rejectSubmission = async () => {
    await moderationSubmissionStore.rejectSubmission()
    await resetModalRefs()
    toast.success(t('modSubmissionForm.facilitySuccessfullyRejected'))
    navigateToModerationDashboard()
}

watch(
    moderationSubmissionAction,
    action => {
        if (!action || action.id === lastHandledActionId.value) {
            return
        }

        lastHandledActionId.value = action.id

        switch (action.type) {
            case ModerationSubmissionActionType.Approve:
                showApproveSubmissionConfirmation.value = true
                showRejectSubmissionConfirmation.value = false
                modalStore.showModal()
                return
            case ModerationSubmissionActionType.Reject:
                showRejectSubmissionConfirmation.value = true
                showApproveSubmissionConfirmation.value = false
                modalStore.showModal()
                return
            case ModerationSubmissionActionType.UpdateAndExit:
                saveSubmissionDraft(new Event('submit', { bubbles: false, cancelable: true }), {
                    shouldExitAfterUpdate: true
                })
                return
            case ModerationSubmissionActionType.Update:
                saveSubmissionDraft(new Event('submit', { bubbles: false, cancelable: true }), {
                    shouldResetModalRefsAfterUpdate: true
                })
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
    makeNonDirty()

    await nextTick()

    isEditSubmissionFormInitialized.value = true
    loadingStore.setIsLoading(false)
})

const navigateToModerationDashboard = () => {
    goToModerationDashboard(router, screenStore, modalStore)
}

// Unsaved changes on browser back / router leave are handled by useUnsavedChanges + unsaved-changes-plugin (router.beforeEach).
</script>
