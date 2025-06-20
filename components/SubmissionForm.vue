<template>
    <div>
        <Loader v-show="!isFormInitialized" />
        <form
            v-show="isFormInitialized"
            class="flex flex-col items-center"
        >
            <h1
                data-testid="submit-heading"
                class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal"
            >
                {{ t('submitPage.heading') }}
            </h1>
            <p
                data-testid="submit-subheading"
                class="mb-10 w-96 text-center text-primary-text-muted text-sm font-normal font-sans"
            >
                {{ t('submitPage.subheading') }}
            </p>
            <span
                class="mb-2 text-primary-text text-sm font-normal font-sans"
            >{{ t('submitPage.googleMaps') }}</span>

            <input
                v-model="location"
                data-testid="submit-input-googlemaps"
                type="text"
                required
                class="px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                :placeholder="t('submitPage.location')"
                @blur="initialValidationCheck(location, 'googleMaps')"
            >
            <div class="google-maps-validation-container flex text-error text-xs font-sans h-3 mt-1 mb-3">
                <span
                    v-show="!isValidInput.googleMapsUrl.value"
                    class="text-error text-xs font-sans"
                >
                    {{ t('submitPage.googleMapsValidation') }}
                </span>
            </div>
            <span
                class="mb-2 text-primary-text text-sm font-normal font-sans"
            >{{ t('submitPage.healthcareProfessionalName') }}</span>

            <div>
                <input
                    v-model="lastName"
                    data-testid="submit-input-lastname"
                    class="mr-1 px-3 py-3.5 w-48 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                    type="text"
                    required
                    maxlength="30"
                    :placeholder="t('submitPage.lastName')"
                    @blur="initialValidationCheck(lastName, 'lastName')"
                >
                <input
                    v-model="firstName"
                    data-testid="submit-input-firstname"
                    class="px-3 py-3.5 w-48 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                    type="text"
                    maxlength="30"
                    :placeholder="t('submitPage.firstName')"
                    @blur="initialValidationCheck(firstName, 'firstName')"
                >
            </div>
            <div class="name-validation-container flex text-error text-xs font-sans h-3 mt-1 mb-3">
                <div class="last-name-validation-container w-44 mr-5">
                    <span
                        v-show="!isValidInput.lastName.value"
                    >
                        {{ t('submitPage.lastNameValidation') }}
                    </span>
                </div>

                <div class="last-name-validation-container w-44">
                    <span
                        v-show="!isValidInput.firstName.value"
                    >   {{ t('submitPage.firstNameValidation') }}
                    </span>
                </div>
            </div>
            <span
                class="mb-2 text-primary-text text-sm font-normal font-sans"
            >{{ t('submitPage.spokenLanguage1') }}</span>
            <p
                v-show="!isValidInput.primarySpokenLangauge.value"
                class="text-error text-xs font-sans"
            >
                {{ t('submitPage.spokenLanguageValidation') }}
            </p>
            <select
                v-model="selectLanguage1"
                data-testid="submit-select-language1"
                class="mb-5 px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                :placeholder="t('submitPage.selectLanguage1')"
                @change="initialValidationCheck(selectLanguage1, 'primaryLanguage')"
            >
                <option
                    v-for="(locale, index) in localeStore.localeDisplayOptions"
                    :key="index"
                    :value="locale.code"
                >
                    {{ locale.displayText }}
                </option>
            </select>
            <span
                class="mb-2 text-primary-text text-sm font-normal font-sans"
            >{{ t('submitPage.spokenLanguage2') }}</span>
            <p
                v-show="!isValidInput.secondarySpokenLanguage.value"
                class="text-error text-xs font-sans"
            >
                {{ t('submitPage.invalidOption') }}
            </p>
            <select
                v-model="selectLanguage2"
                data-testid="submit-select-language2"
                class="mb-5 px-3 py-3.5 w-96 h-12 bg-primary-text-inverted rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                :placeholder="t('submitPage.selectLanguage2')"
                @change="initialValidationCheck(selectLanguage1, 'secondaryLanguage')"
            >
                <option
                    v-for="(locale, index) in localeStore.localeDisplayOptions"
                    :key="index"
                    :value="locale.code"
                >
                    {{ locale.displayText }}
                </option>
            </select>
            <span
                class="mb-2 text-primary-text text-sm font-normal font-sans"
            >{{ t('submitPage.otherNotes') }}({{ t('submitPage.optional') }})</span>
            <textarea
                v-model="otherNotes"
                data-testid="submit-input-notes"
                class="mb-5 landscape:mb-20 px-3 py-3.5 w-96 h-28 bg-secondary-bg rounded-lg border border-primary-text-muted"
                maxlength="300"
            />
            <button
                data-testid="submit-submitbutton"
                type="submit"
                class="px-20 py-3 mb-40 landscape:mb-0 rounded-full bg-primary w-96 text-center
                 text-primary-inverted font-medium font-sans"
                @click="submitNewSubmission"
            >
                {{ t('submitPage.submitButton') }}
            </button>
        </form>
        <div />
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, type Ref, onMounted } from 'vue'
import { type ToastInterface, useToast } from 'vue-toastification'
import * as validations from '../utils/formValidations'
import { useSubmissionStore } from '~/stores/submissionStore'
import type { Locale, MutationCreateSubmissionArgs } from '~/typedefs/gqlTypes'
import { useLocaleStore } from '~/stores/localeStore'
import { useI18n } from '#imports'
import { handleServerErrorMessaging } from '~/composables/handleServerErrorMessaging'

/**
This initalizes the variable that needs to be set on mount.
If this is set as a const the build will fail since the plugin
for vue-toastification is only available onMounted of the component
through Nuxt
 */
let toast: ToastInterface
const { t } = useI18n()

const submissionStore = useSubmissionStore()
const localeStore = useLocaleStore()

// This variable makes sure everything is ready before displaying the form
const isFormInitialized: Ref<boolean> = ref(false)

const location: Ref = ref('')
const firstName: Ref = ref('')
const lastName: Ref = ref('')
const selectLanguage1: Ref = ref('')
const selectLanguage2: Ref = ref('')
const otherNotes: Ref = ref('')

const validationCheckedPreviously = {
    googleMapsUrl: ref(false),
    lastName: ref(false),
    firstName: ref(false),
    primarySpokenLangauge: ref(false),
    secondarySpokenLanguage: ref(false)
}

const isValidInput = {
    googleMapsUrl: ref(true),
    lastName: ref(true),
    firstName: ref(true),
    primarySpokenLangauge: ref(true),
    secondarySpokenLanguage: ref(true)
}

const validateFields = () => {
    validationCheckedPreviously.googleMapsUrl.value = true
    isValidInput.googleMapsUrl.value = validations.validateGoogleMapsUrlInput(location.value)
    validationCheckedPreviously.lastName.value = true
    isValidInput.lastName.value = validations.validateUserSubmittedLastName(lastName.value)
    validationCheckedPreviously.firstName.value = true
    isValidInput.firstName.value = validations.validateUserSubmittedFirstName(firstName.value)
    validationCheckedPreviously.primarySpokenLangauge.value = true
    isValidInput.primarySpokenLangauge.value = validations.validateFirstSpokenLanguage(selectLanguage1.value)
    validationCheckedPreviously.secondarySpokenLanguage.value = true
    isValidInput.secondarySpokenLanguage.value
        = validations.validateUserSubmittedLastName(selectLanguage2.value)

    if (
        !isValidInput.googleMapsUrl.value
        || !isValidInput.lastName.value
        || !isValidInput.firstName.value
        || !isValidInput.primarySpokenLangauge.value
        || !isValidInput.secondarySpokenLanguage.value
    ) {
        return
    }
}

async function submitNewSubmission(e: Event) {
    e.preventDefault()

    validateFields()

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

    const response = await submissionStore.createNewSubmission(newSubmission)
    // This is used in the component and not graphQL call as it is user messaging and needs the mounted toast library
    if (response?.errors?.length) {
        handleServerErrorMessaging(response.errors, toast, t)
        return
    }

    submissionStore.submissionCompleted = true
    toast.success(t('submitPage.submissionSuccessful'))
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
            validationCheckedPreviously.primarySpokenLangauge.value = true
            await nextTick()
            isValidInput.primarySpokenLangauge.value = validations.validateFirstSpokenLanguage(inputValue)
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
    if (validationCheckedPreviously.primarySpokenLangauge.value) {
        isValidInput.primarySpokenLangauge.value = validations.validateFirstSpokenLanguage(newValue)
    }
})
watch(() => selectLanguage2.value, newValue => {
    if (validationCheckedPreviously.secondarySpokenLanguage.value) {
        isValidInput.secondarySpokenLanguage.value = validations.validateSecondSpokenLanguage(newValue)
    }
})

onMounted(async () => {
    /**
    Set the variable to useToast when the compoenet mounts
    since vue-taostification is only available on the client.
    If not done this way the build fails
     */
    toast = useToast()

    resetForm()

    /**  `await nextTick()` waits until the next DOM update cycle, allowing any changes made to reactive data to be applied
     before the code execution continues. */
    await nextTick()

    isFormInitialized.value = true
})
</script>
