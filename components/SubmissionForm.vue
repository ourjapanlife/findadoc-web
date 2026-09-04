<template>
    <div class="flex flex-col gap-6">
        <h1
            data-testid="submit-heading"
            class="page-title-sm"
        >
            {{ t('submitPage.heading') }}
        </h1>
        <p
            data-testid="submit-subheading"
            class="text-lg text-primary-text-muted"
        >
            {{ t('submitPage.subheading') }}
        </p>

        <form
            novalidate
            class="card flex flex-col gap-5 p-6"
            @submit.prevent="submitNewSubmission"
        >
            <div>
                <label
                    for="submit-googlemaps"
                    class="field-label"
                >{{ t('submitPage.googleMaps') }}</label>
                <input
                    id="submit-googlemaps"
                    v-model="location"
                    data-testid="submit-input-googlemaps"
                    type="url"
                    class="field"
                    autocomplete="off"
                    :placeholder="t('submitPage.location')"
                    :aria-invalid="hasVisibleError('googleMapsUrl') ? 'true' : undefined"
                    :aria-describedby="hasVisibleError('googleMapsUrl') ? 'submit-googlemaps-error' : undefined"
                    @blur="initialValidationCheck(location, 'googleMaps')"
                >
                <p
                    v-if="hasVisibleError('googleMapsUrl')"
                    id="submit-googlemaps-error"
                    class="field-error"
                >
                    {{ t('submitPage.googleMapsValidation') }}
                </p>
            </div>

            <fieldset class="m-0 min-w-0 border-0 p-0">
                <legend class="field-label">
                    {{ t('submitPage.healthcareProfessionalName') }}
                </legend>
                <div class="grid grid-cols-1 gap-3 landscape:grid-cols-2">
                    <div>
                        <label
                            for="submit-lastname"
                            class="sr-only"
                        >{{ t('submitPage.lastName') }}</label>
                        <input
                            id="submit-lastname"
                            v-model="lastName"
                            data-testid="submit-input-lastname"
                            type="text"
                            class="field"
                            maxlength="30"
                            :placeholder="t('submitPage.lastName')"
                            :aria-invalid="hasVisibleError('lastName') ? 'true' : undefined"
                            :aria-describedby="hasVisibleError('lastName') ? 'submit-lastname-error' : undefined"
                            @blur="initialValidationCheck(lastName, 'lastName')"
                        >
                        <p
                            v-if="hasVisibleError('lastName')"
                            id="submit-lastname-error"
                            class="field-error"
                        >
                            {{ t('submitPage.lastNameValidation') }}
                        </p>
                    </div>
                    <div>
                        <label
                            for="submit-firstname"
                            class="sr-only"
                        >{{ t('submitPage.firstName') }}</label>
                        <input
                            id="submit-firstname"
                            v-model="firstName"
                            data-testid="submit-input-firstname"
                            type="text"
                            class="field"
                            maxlength="30"
                            :placeholder="t('submitPage.firstName')"
                            :aria-invalid="hasVisibleError('firstName') ? 'true' : undefined"
                            :aria-describedby="hasVisibleError('firstName') ? 'submit-firstname-error' : undefined"
                            @blur="initialValidationCheck(firstName, 'firstName')"
                        >
                        <p
                            v-if="hasVisibleError('firstName')"
                            id="submit-firstname-error"
                            class="field-error"
                        >
                            {{ t('submitPage.firstNameValidation') }}
                        </p>
                    </div>
                </div>
            </fieldset>

            <div>
                <label
                    for="submit-language1"
                    class="field-label"
                >{{ t('submitPage.spokenLanguage1') }}</label>
                <select
                    id="submit-language1"
                    v-model="selectLanguage1"
                    data-testid="submit-select-language1"
                    class="field"
                    :aria-invalid="hasVisibleError('primarySpokeLangauge') ? 'true' : undefined"
                    :aria-describedby="hasVisibleError('primarySpokeLangauge') ? 'submit-language1-error' : undefined"
                    @change="initialValidationCheck(selectLanguage1, 'primaryLanguage')"
                >
                    <option
                        value=""
                        disabled
                    >
                        {{ t('submitPage.selectLanguage1') }}
                    </option>
                    <option
                        v-for="locale in localeStore.localeDisplayOptions"
                        :key="locale.code"
                        :value="locale.code"
                    >
                        {{ locale.displayText }}
                    </option>
                </select>
                <p
                    v-if="hasVisibleError('primarySpokeLangauge')"
                    id="submit-language1-error"
                    role="alert"
                    class="field-error"
                >
                    {{ t('submitPage.spokenLanguageValidation') }}
                </p>
            </div>

            <div>
                <label
                    for="submit-language2"
                    class="field-label"
                >
                    {{ t('submitPage.spokenLanguage2') }}
                    <span class="font-normal text-primary-text-muted">({{ t('submitPage.optional') }})</span>
                </label>
                <select
                    id="submit-language2"
                    v-model="selectLanguage2"
                    data-testid="submit-select-language2"
                    class="field"
                    :aria-invalid="hasVisibleError('secondarySpokenLanguage') ? 'true' : undefined"
                    :aria-describedby="hasVisibleError('secondarySpokenLanguage') ? 'submit-language2-error' : undefined"
                    @change="initialValidationCheck(selectLanguage2, 'secondaryLanguage')"
                >
                    <option value="">
                        {{ t('submitPage.selectLanguage2') }}
                    </option>
                    <option
                        v-for="locale in localeStore.localeDisplayOptions"
                        :key="locale.code"
                        :value="locale.code"
                    >
                        {{ locale.displayText }}
                    </option>
                </select>
                <p
                    v-if="hasVisibleError('secondarySpokenLanguage')"
                    id="submit-language2-error"
                    class="field-error"
                >
                    {{ t('submitPage.invalidOption') }}
                </p>
            </div>

            <div>
                <label
                    for="submit-notes"
                    class="field-label"
                >
                    {{ t('submitPage.otherNotes') }}
                    <span class="font-normal text-primary-text-muted">({{ t('submitPage.optional') }})</span>
                </label>
                <textarea
                    id="submit-notes"
                    v-model="otherNotes"
                    data-testid="submit-input-notes"
                    class="field field-textarea"
                    maxlength="300"
                    aria-describedby="submit-notes-hint"
                />
                <p
                    id="submit-notes-hint"
                    class="field-hint"
                >
                    {{ otherNotes.length }}/300
                </p>
            </div>

            <button
                type="submit"
                data-testid="submit-submitbutton"
                class="btn btn-primary w-full"
                :disabled="isSubmitting"
            >
                {{ t('submitPage.submitButton') }}
            </button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppToast } from '~/composables/useAppToast'
import * as validations from '~/utils/formValidations'
import { useSubmissionStore } from '~/stores/submissionStore'
import type { Locale, MutationCreateSubmissionArgs } from '~/typedefs/gqlTypes'
import { useLocaleStore } from '~/stores/localeStore'
import { handleServerErrorMessaging } from '~/composables/handleServerErrorMessaging'

const toast = useAppToast()
const { t } = useI18n()

const submissionStore = useSubmissionStore()
const localeStore = useLocaleStore()

const location = ref('')
const firstName = ref('')
const lastName = ref('')
const selectLanguage1 = ref('')
const selectLanguage2 = ref('')
const otherNotes = ref('')
const isSubmitting = ref(false)

const validationCheckedPreviously = {
    googleMapsUrl: ref(false),
    lastName: ref(false),
    firstName: ref(false),
    primarySpokeLangauge: ref(false),
    secondarySpokenLanguage: ref(false)
}

const isValidInput = {
    googleMapsUrl: ref(true),
    lastName: ref(true),
    firstName: ref(true),
    primarySpokeLangauge: ref(false),
    secondarySpokenLanguage: ref(true)
}

type ValidatedField = keyof typeof isValidInput

/*
 * An error is only shown once the field has been blurred/changed or a submit was attempted.
 * The page is prerendered, so anything shown on first render would flash on every visit.
 */
const hasVisibleError = (field: ValidatedField) =>
    validationCheckedPreviously[field].value && !isValidInput[field].value

const validateFields = () => {
    validationCheckedPreviously.googleMapsUrl.value = true
    isValidInput.googleMapsUrl.value = validations.validateGoogleMapsUrlInput(location.value)
    validationCheckedPreviously.lastName.value = true
    isValidInput.lastName.value = validations.validateUserSubmittedLastName(lastName.value)
    validationCheckedPreviously.firstName.value = true
    isValidInput.firstName.value = validations.validateUserSubmittedFirstName(firstName.value)
    validationCheckedPreviously.primarySpokeLangauge.value = true
    isValidInput.primarySpokeLangauge.value = validations.validateFirstSpokenLanguage(selectLanguage1.value)
    validationCheckedPreviously.secondarySpokenLanguage.value = true
    isValidInput.secondarySpokenLanguage.value = selectLanguage2.value
        ? validations.validateSecondSpokenLanguage(selectLanguage2.value)
        : true

    if (
        !isValidInput.googleMapsUrl.value
        || !isValidInput.lastName.value
        || !isValidInput.firstName.value
        || !isValidInput.primarySpokeLangauge.value
        || !isValidInput.secondarySpokenLanguage.value
    ) {
        return false
    }

    return true
}

async function submitNewSubmission() {
    if (isSubmitting.value) return

    const isValid = validateFields()
    if (!isValid) return

    const spokenLanguages: Locale[] = []

    if (selectLanguage1.value !== '') {
        spokenLanguages.push(selectLanguage1.value as Locale)
    }

    if (selectLanguage2.value !== '') {
        spokenLanguages.push(selectLanguage2.value as Locale)
    }

    const newSubmission: MutationCreateSubmissionArgs
        = { input: {
            googleMapsUrl: location.value,
            healthcareProfessionalName: `${firstName.value} ${lastName.value}`,
            spokenLanguages: spokenLanguages,
            notes: otherNotes.value
        } }

    isSubmitting.value = true
    try {
        const response = await submissionStore.createNewSubmission(newSubmission)
        // This is used in the component and not graphQL call as it is user messaging and needs the mounted toast library
        if (response?.hasErrors || response?.errors?.length) {
            handleServerErrorMessaging(response.errors ?? [], toast, t)
            return
        }

        submissionStore.submissionCompleted = true
        toast.success(t('submitPage.submissionSuccessful'))
    } finally {
        isSubmitting.value = false
    }
}

function resetForm() {
    submissionStore.submissionCompleted = false
    location.value = ''
    firstName.value = ''
    lastName.value = ''
    selectLanguage1.value = ''
    selectLanguage2.value = ''
    otherNotes.value = ''
}

// nextTick is used to ensure that the model value is updated before doing the validation check
const initialValidationCheck = async (inputValue: string, field: string) => {
    switch (field) {
        case 'googleMaps':
            validationCheckedPreviously.googleMapsUrl.value = true
            await nextTick()
            isValidInput.googleMapsUrl.value = validations.validateGoogleMapsUrlInput(inputValue)
            break
        case 'lastName':
            validationCheckedPreviously.lastName.value = true
            await nextTick()
            isValidInput.lastName.value = validations.validateUserSubmittedLastName(inputValue)
            break
        case 'firstName':
            validationCheckedPreviously.firstName.value = true
            await nextTick()
            isValidInput.firstName.value = validations.validateUserSubmittedFirstName(inputValue)
            break
        case 'primaryLanguage':
            validationCheckedPreviously.primarySpokeLangauge.value = true
            await nextTick()
            isValidInput.primarySpokeLangauge.value = validations.validateFirstSpokenLanguage(inputValue)
            break
        case 'secondaryLanguage':
            validationCheckedPreviously.secondarySpokenLanguage.value = true
            await nextTick()
            isValidInput.secondarySpokenLanguage.value = validations.validateSecondSpokenLanguage(inputValue)
            break
    }
}

watch(() => location.value, newValue => {
    if (validationCheckedPreviously.googleMapsUrl.value) {
        isValidInput.googleMapsUrl.value = validations.validateGoogleMapsUrlInput(newValue)
    }
})
watch(() => lastName.value, newValue => {
    if (validationCheckedPreviously.lastName.value) {
        isValidInput.lastName.value = validations.validateUserSubmittedLastName(newValue)
    }
})
watch(() => firstName.value, newValue => {
    if (validationCheckedPreviously.firstName.value) {
        isValidInput.firstName.value = validations.validateUserSubmittedFirstName(newValue)
    }
})
watch(() => selectLanguage1.value, newValue => {
    if (validationCheckedPreviously.primarySpokeLangauge.value) {
        isValidInput.primarySpokeLangauge.value = validations.validateFirstSpokenLanguage(newValue)
    }
})
watch(() => selectLanguage2.value, newValue => {
    if (validationCheckedPreviously.secondarySpokenLanguage.value) {
        isValidInput.secondarySpokenLanguage.value = validations.validateSecondSpokenLanguage(newValue)
    }
})

onMounted(() => {
    resetForm()
})
</script>
