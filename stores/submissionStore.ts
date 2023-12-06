import { defineStore } from "pinia"
import { ref } from 'vue'

export const useSubmissionStore = defineStore('submissionStore', () => {
    const location = ref('')
    const firstName = ref('')
    const lastName = ref('')
    const selectLanguage1 = ref('')
    const selectLanguage2 = ref('')
    const otherNotes = ref('')
    const submissionCompleted = ref(false)

    const createSubmissionMutation = gql`mutation CreateSubmission($input: CreateSubmissionInput!) {
        createSubmission(input: $input) {
            id
            googleMapsUrl
            healthcareProfessionalName
            spokenLanguages
            isApproved
            isRejected
            isUnderReview
            createdDate
            updatedDate
        }
    }`


    function submit() {
        const spokenLanguages = []

        if (selectLanguage1.value !== '') {
            console.log('selectLanguage1 =', selectLanguage1)
            spokenLanguages.push(selectLanguage1.value)
        }

        if (selectLanguage2.value !== '') {
            spokenLanguages.push(selectLanguage2.value)
        }

        const submission = {
            "googleMapsUrl": location.value,
            "healthcareProfessionalName": `${firstName.value} ${lastName.value}`,
            "spokenLanguages": spokenLanguages,
            "notes": otherNotes.value
        }
        console.log('submission =', submission)

        const createSubmissionRequest = {
            query: createSubmissionMutation,
            variables: {
                input: submission
            }
        }

        submissionCompleted.value = true
    }

    function resetForm() {
        submissionCompleted.value = false
        location.value = ''
        firstName.value = ''
        lastName.value = ''
        selectLanguage1.value = ''
        selectLanguage2.value = ''
        otherNotes.value = ''
    }

    return { location, firstName, lastName, selectLanguage1, selectLanguage2, otherNotes, submissionCompleted, submit, resetForm }
})
