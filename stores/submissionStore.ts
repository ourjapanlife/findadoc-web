import { defineStore } from "pinia"
import { ref } from 'vue'

export const useSubmissionStore = defineStore('submissionStore', () => {
    const location = ref('')
    const firstName = ref('')
    const lastName = ref('')
    const selectLanguage1 = ref('')
    const selectLanguage2 = ref('')
    const otherNotes = ref('')

    function submit() {
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
        console.log('submission =', submission)
    }

    return { location, firstName, lastName, selectLanguage1, selectLanguage2, otherNotes, submit }
})
