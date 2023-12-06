import { defineStore } from "pinia"
import { ref } from 'vue'

export const useSubmissionStore = defineStore('submissionStore', () => {
    const location = ref('')
    const firstName = ref('')
    const lastName = ref('')
    const selectLanguage1 = ref('')
    const selectLanguage2 = ref('')
    const otherNotes = ref('')

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


    async function submit() {
        const spokenLanguages = []

        if (selectLanguage1.value !== 'none') {
            spokenLanguages.push(selectLanguage1.value)
        }

        if (selectLanguage2.value !== 'none') {
            spokenLanguages.push(selectLanguage2.value)
        }

        const submission = {
            "googleMapsUrl": location.value,
            "healthcareProfessionalName": `${firstName.value} ${lastName.value}`,
            "spokenLanguages": spokenLanguages,
            "notes": otherNotes.value
        }

        const createSubmissionRequest = {
            query: createSubmissionMutation,
            variables: {
                input: submission
            }
        }

        // Write a request using createSubmissionRequest to the GraphQL API https://findadoc-api-9brq4.ondigitalocean.app/api

        const response = await fetch('https://findadoc-api-9brq4.ondigitalocean.app/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(createSubmissionRequest)
        })
        //



        console.log('response =', response)
    }

    return { location, firstName, lastName, selectLanguage1, selectLanguage2, otherNotes, submit }
})
