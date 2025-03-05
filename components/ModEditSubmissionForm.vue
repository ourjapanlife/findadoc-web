<template>
    <Loader />
    <div v-if="isSubmissionFormInitialized">
        <form
            class="p-4 h-full overflow-y-auto"
        >
            <ModEditFacilitySection />
            <ModEditHealthcareProfessionalSection />
        </form>
    </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, onMounted } from 'vue'
import { type ToastInterface, useToast } from 'vue-toastification'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useI18n } from '#imports'
import { type Submission, Locale } from '~/typedefs/gqlTypes'

let toast: ToastInterface

const { t } = useI18n()

const moderationSubmissionsStore = useModerationSubmissionsStore()
const facilitiesStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const loadingStore = useLoadingStore()

loadingStore.setIsLoading(true)

const isSubmissionFormInitialized: Ref<boolean> = ref(false)

function initializeSubmissionFormValues(submissionData: Submission | undefined) {
    const submittedHealthcareProfessionalName = submissionData?.healthcareProfessionalName?.split(' ')

    if (submissionData?.facility) {
        facilitiesStore
            .mapFacilitySubmissionDataToFacilitySectionFields(
                submissionData.facility
            )
    }

    if (submissionData?.healthcareProfessionals) {
        if (submittedHealthcareProfessionalName && submittedHealthcareProfessionalName.length === 2) {
            healthcareProfessionalsStore.healthcareProfessionalSectionFields.names
                            = submissionData?.healthcareProfessionals?.[0]?.names ?? [{
                    firstName: submittedHealthcareProfessionalName[0] || '',
                    lastName: submittedHealthcareProfessionalName[1] || '',
                    locale: submissionData.spokenLanguages[0] || Locale.Und
                }]
        }
    }
    if (submittedHealthcareProfessionalName && submittedHealthcareProfessionalName.length === 3) {
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.names
                        = submissionData?.healthcareProfessionals?.[0]?.names ?? [{
                firstName: submittedHealthcareProfessionalName[0] || '',
                middleName: submittedHealthcareProfessionalName[1] || '',
                lastName: submittedHealthcareProfessionalName[2] || '',
                locale: submissionData?.spokenLanguages[0] || Locale.Und
            }]
    }
    healthcareProfessionalsStore.healthcareProfessionalSectionFields.acceptedInsurance
                        = submissionData?.healthcareProfessionals?.[0]?.acceptedInsurance
                          ?? []
    healthcareProfessionalsStore.healthcareProfessionalSectionFields.degrees
                        = submissionData?.healthcareProfessionals?.[0]?.degrees
                          ?? []
    healthcareProfessionalsStore.healthcareProfessionalSectionFields.specialties
                        = submissionData?.healthcareProfessionals?.[0]?.specialties
                          ?? []
    healthcareProfessionalsStore.healthcareProfessionalSectionFields.spokenLanguages
                        = submissionData?.spokenLanguages ?? []
    facilitiesStore.facilitySectionFields.healthcareProfessionalIds
                    = submissionData?.facility?.healthcareProfessionalIds ?? []
}

onMounted(() => {
    isSubmissionFormInitialized.value = false

    /**
    Set the variable to useToast when the before the component mounts
    since vue-taostification is only available on the client.
    If not done this way the build fails
     */
    toast = useToast()

    if (!moderationSubmissionsStore.selectedSubmissionId) {
        console.error(t('modSubmissionForm.errorMessageSubmissionId'))
        toast.error(t('modSubmissionForm.errorMessageSubmissionId'))
        return
    }

    moderationSubmissionsStore.filterSelectedSubmission(moderationSubmissionsStore.selectedSubmissionId)

    if (!moderationSubmissionsStore.selectedSubmissionData) {
        console.error(t('modSubmissionForm.errorMessageNoSubmissionDataFound'))
        toast.error(t('modSubmissionForm.errorMessageNoSubmissionDataFound'))
        return
    }

    initializeSubmissionFormValues(moderationSubmissionsStore.selectedSubmissionData)

    loadingStore.setIsLoading(true)
    isSubmissionFormInitialized.value = true
})
</script>
