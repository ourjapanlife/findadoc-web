import { gql } from 'graphql-request'
import { defineStore } from "pinia"
import { ref, type Ref } from 'vue'
import { Locale, type CreateSubmissionInput, type Submission } from "~/typedefs/gqlTypes"
import { gqlClient } from '../utils/graphql.js'

export const useSubmissionStore = defineStore('submissionStore', () => {
    const location: Ref = ref('')
    const firstName: Ref = ref('')
    const lastName: Ref = ref('')
    const selectLanguage1: Ref = ref('')
    const selectLanguage2: Ref = ref('')
    const otherNotes: Ref = ref('')
    const submissionCompleted: Ref = ref(false)

    async function submit() {
        const spokenLanguages: Locale[] = []

        if (selectLanguage1.value !== '') {
            spokenLanguages.push(selectLanguage1.value as Locale)
        }

        if (selectLanguage2.value !== '') {
            spokenLanguages.push(selectLanguage2.value as Locale)
        }

        const submission = {
            "googleMapsUrl": location.value,
            "healthcareProfessionalName": `${firstName.value} ${lastName.value}`,
            "spokenLanguages": spokenLanguages,
            "notes": otherNotes.value
        } satisfies CreateSubmissionInput

        try {
            await gqlClient.request<Submission>(createSubmissionMutation, {
                input: submission
            })
            submissionCompleted.value = true
        }
        catch (e) {
            console.error(`There was an error creating the submission ${e}`)
        }

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

const createSubmissionMutation = gql`mutation CreateSubmission($input: CreateSubmissionInput!) {
    createSubmission(input: $input) {
        id
    }
}`
