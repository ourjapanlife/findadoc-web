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

            <fieldset class="m-0 min-w-0 border-0 p-0">
                <legend class="field-label">
                    {{ t('submitPage.spokenLanguages') }}
                </legend>
                <p
                    id="submit-languages-hint"
                    class="field-hint mb-2"
                >
                    {{ t('submitPage.spokenLanguagesHint') }}
                </p>
                <div
                    class="mb-2 flex flex-wrap gap-2"
                    aria-describedby="submit-languages-hint"
                >
                    <span
                        class="chip chip-primary"
                        data-testid="submit-language-ja"
                    >
                        {{ japaneseLabel }}
                    </span>
                    <span
                        v-for="code in extraLanguages"
                        :key="code"
                        class="chip gap-2"
                    >
                        {{ languageLabel(code) }}
                        <button
                            type="button"
                            class="text-primary-text-muted"
                            :aria-label="t('submitPage.removeLanguage', { language: languageLabel(code) })"
                            @click="removeLanguage(code)"
                        >
                            ×
                        </button>
                    </span>
                </div>
                <label
                    for="submit-add-language"
                    class="sr-only"
                >{{ t('submitPage.addLanguage') }}</label>
                <select
                    id="submit-add-language"
                    v-model="languageToAdd"
                    data-testid="submit-add-language"
                    class="field"
                    :aria-invalid="hasVisibleError('spokenLanguages') ? 'true' : undefined"
                    :aria-describedby="hasVisibleError('spokenLanguages') ? 'submit-languages-error' : undefined"
                    @change="addLanguage"
                >
                    <option value="">
                        {{ t('submitPage.addLanguage') }}
                    </option>
                    <option
                        v-for="languageOption in languagesAvailableToAdd"
                        :key="languageOption.code"
                        :value="languageOption.code"
                    >
                        {{ languageOption.displayText }}
                    </option>
                </select>
                <p
                    v-if="hasVisibleError('spokenLanguages')"
                    id="submit-languages-error"
                    role="alert"
                    class="field-error"
                >
                    {{ t('submitPage.spokenLanguageValidation') }}
                </p>
            </fieldset>

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

            <div
                v-if="mapsLinkIsValid"
                data-testid="submit-preview"
                class="flex flex-col gap-3 rounded-lg border border-accent-bg p-4"
            >
                <h2 class="text-base font-semibold text-primary-text">
                    {{ t('submitPage.previewHeading') }}
                </h2>
                <p
                    v-if="existingFacility"
                    data-testid="submit-existing-place"
                    class="rounded-md bg-secondary-bg p-3 text-sm text-primary-text"
                    role="status"
                >
                    {{ t('submitPage.existingPlace') }}
                    <a
                        :href="existingFacilityHref"
                        class="text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >{{ existingFacilityLabel }}</a>
                    <a
                        :href="CONTACT_MAILTO"
                        class="text-primary"
                    >{{ t('submitPage.existingPlaceContact') }}</a>
                </p>
                <dl class="grid gap-3 text-sm">
                    <div v-if="placeLabel">
                        <dt class="font-semibold text-primary-text">
                            {{ t('submitPage.previewPlace') }}
                        </dt>
                        <dd class="text-primary-text-muted">
                            {{ placeLabel }}
                        </dd>
                    </div>
                    <div v-else-if="mapsPlaceLoading">
                        <dd class="text-primary-text-muted">
                            {{ t('submitPage.previewLookingUp') }}
                        </dd>
                    </div>
                    <div v-if="placePin">
                        <dt class="font-semibold text-primary-text">
                            {{ t('submitPage.previewPin') }}
                        </dt>
                        <dd class="text-primary-text-muted">
                            {{ placePin }}
                        </dd>
                    </div>
                    <div>
                        <dt class="font-semibold text-primary-text">
                            {{ t('submitPage.previewLocation') }}
                        </dt>
                        <dd>
                            <a
                                :href="location.trim()"
                                class="text-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >{{ t('submitPage.previewOpenMap') }}</a>
                        </dd>
                    </div>
                    <div v-if="submittedName">
                        <dt class="font-semibold text-primary-text">
                            {{ t('submitPage.previewName') }}
                        </dt>
                        <dd class="text-primary-text-muted">
                            {{ submittedName }}
                        </dd>
                    </div>
                    <div>
                        <dt class="font-semibold text-primary-text">
                            {{ t('submitPage.previewLanguages') }}
                        </dt>
                        <dd class="text-primary-text-muted">
                            {{ submittedLanguageLabels }}
                        </dd>
                    </div>
                    <div v-if="otherNotes.trim()">
                        <dt class="font-semibold text-primary-text">
                            {{ t('submitPage.previewNotes') }}
                        </dt>
                        <dd class="whitespace-pre-wrap text-primary-text-muted">
                            {{ otherNotes.trim() }}
                        </dd>
                    </div>
                </dl>
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
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppToast } from '~/composables/useAppToast'
import * as validations from '~/utils/formValidations'
import { useSubmissionStore } from '~/stores/submissionStore'
import { Locale, type MutationCreateSubmissionArgs } from '~/typedefs/gqlTypes'
import { spokenLanguageSortKey, useLocaleStore } from '~/stores/localeStore'
import { handleServerErrorMessaging } from '~/composables/handleServerErrorMessaging'
import { facilityPath } from '~/utils/clinicPath'
import { CONTACT_MAILTO } from '~/utils/site'
import { isJapaneseLocale } from '~/utils/activeLocale'
import { fetchFacilityByGooglePlaceId, type ExistingFacilityMatch } from '~/utils/existingFacility'

const toast = useAppToast()
const { t, locale } = useI18n()

const submissionStore = useSubmissionStore()
const localeStore = useLocaleStore()

const location = ref('')
const firstName = ref('')
const lastName = ref('')
const extraLanguages = ref<Locale[]>([])
const languageToAdd = ref('')
const otherNotes = ref('')
const isSubmitting = ref(false)

const japaneseLabel = computed(() => languageLabel(Locale.JaJp))
const languagesAvailableToAdd = computed(() =>
    localeStore.localeDisplayOptions
        .filter(locale =>
            locale.code !== Locale.JaJp && !extraLanguages.value.includes(locale.code as Locale))
        .sort((left, right) => spokenLanguageSortKey(left).localeCompare(
            spokenLanguageSortKey(right), 'en', { sensitivity: 'base' }
        )))
const mapsLinkIsValid = computed(() => validations.validateGoogleMapsUrlInput(location.value))
const mapsPlace = ref<validations.MapsPlacePreview | null>(null)
const mapsPlaceLoading = ref(false)
let mapsPlaceRequest = 0
let mapsPlaceTimer: ReturnType<typeof setTimeout> | undefined
const placeLabel = computed(() => mapsPlace.value?.name ?? null)
const existingFacility = ref<ExistingFacilityMatch | null>(null)
let existingFacilityRequest = 0
const existingFacilityLabel = computed(() => {
    const facility = existingFacility.value
    if (!facility) return ''
    return isJapaneseLocale(locale.value) ? facility.nameJa : facility.nameEn
})
const existingFacilityHref = computed(() => {
    const facility = existingFacility.value
    if (!facility) return ''
    return facilityPath({
        id: facility.id,
        nameEn: facility.nameEn,
        contact: {
            address: {
                prefectureEn: facility.prefectureEn,
                cityEn: facility.cityEn
            }
        }
    })
})
const placePin = computed(() => {
    const latitude = mapsPlace.value?.latitude
    const longitude = mapsPlace.value?.longitude
    if (latitude == null || longitude == null) return null
    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
})
const submittedName = computed(() => [firstName.value, lastName.value].map(part => part.trim()).filter(Boolean).join(' '))
const submittedLanguageLabels = computed(() =>
    [Locale.JaJp, ...extraLanguages.value].map(code => languageLabel(code)).join(', '))

function languageLabel(code: string): string {
    return localeStore.localeDisplayOptions.find(locale => locale.code === code)?.displayText ?? code
}

function addLanguage() {
    const code = languageToAdd.value as Locale
    languageToAdd.value = ''
    if (!code || code === Locale.JaJp || extraLanguages.value.includes(code)) return
    extraLanguages.value = [...extraLanguages.value, code]
    void initialValidationCheck('', 'spokenLanguages')
}

function removeLanguage(code: Locale) {
    if (code === Locale.JaJp) return
    extraLanguages.value = extraLanguages.value.filter(language => language !== code)
    void initialValidationCheck('', 'spokenLanguages')
}

const validationCheckedPreviously = {
    googleMapsUrl: ref(false),
    lastName: ref(false),
    firstName: ref(false),
    spokenLanguages: ref(false)
}

const isValidInput = {
    googleMapsUrl: ref(true),
    lastName: ref(true),
    firstName: ref(true),
    spokenLanguages: ref(false)
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
    validationCheckedPreviously.spokenLanguages.value = true
    isValidInput.spokenLanguages.value = validations.validateSubmittedSpokenLanguages(extraLanguages.value)

    if (
        !isValidInput.googleMapsUrl.value
        || !isValidInput.lastName.value
        || !isValidInput.firstName.value
        || !isValidInput.spokenLanguages.value
    ) {
        return false
    }

    return true
}

async function submitNewSubmission() {
    if (isSubmitting.value) return

    const isValid = validateFields()
    if (!isValid) return

    const spokenLanguages = [Locale.JaJp, ...extraLanguages.value]

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
    extraLanguages.value = []
    languageToAdd.value = ''
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
        case 'spokenLanguages':
            validationCheckedPreviously.spokenLanguages.value = true
            await nextTick()
            isValidInput.spokenLanguages.value = validations.validateSubmittedSpokenLanguages(extraLanguages.value)
            break
    }
}

watch(() => location.value, newValue => {
    if (validationCheckedPreviously.googleMapsUrl.value) {
        isValidInput.googleMapsUrl.value = validations.validateGoogleMapsUrlInput(newValue)
    }
    scheduleMapsPlace(newValue)
})

watch(() => mapsPlace.value?.placeId ?? null, placeId => {
    void lookupExistingFacility(placeId)
})

async function lookupExistingFacility(placeId: string | null) {
    const request = ++existingFacilityRequest
    existingFacility.value = null
    if (!placeId) return

    try {
        const match = await fetchFacilityByGooglePlaceId(placeId)
        if (request !== existingFacilityRequest) return
        existingFacility.value = match
    } catch (error) {
        if (request !== existingFacilityRequest) return
        console.error('Checking for an existing clinic failed', error)
        existingFacility.value = null
    }
}

function scheduleMapsPlace(value: string) {
    if (mapsPlaceTimer) clearTimeout(mapsPlaceTimer)
    const trimmed = value.trim()
    const parsed = validations.parseMapsPlace(trimmed)
    if (!parsed) {
        mapsPlace.value = null
        mapsPlaceLoading.value = false
        return
    }
    if (!validations.isResolvableShortMapsUrl(trimmed)) {
        mapsPlace.value = parsed
        mapsPlaceLoading.value = false
        return
    }

    mapsPlaceLoading.value = true
    const request = ++mapsPlaceRequest
    mapsPlaceTimer = setTimeout(() => {
        void loadMapsPlace(trimmed, request)
    }, 400)
}

async function loadMapsPlace(url: string, request: number) {
    try {
        const preview = await $fetch<validations.MapsPlacePreview>('/api/maps-preview', { query: { url } })
        if (request !== mapsPlaceRequest) return
        mapsPlace.value = preview
    } catch (error) {
        if (request !== mapsPlaceRequest) return
        console.error('Reading a Maps link failed', error)
        mapsPlace.value = validations.parseMapsPlace(url)
    } finally {
        if (request === mapsPlaceRequest) mapsPlaceLoading.value = false
    }
}
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
watch(extraLanguages, () => {
    if (validationCheckedPreviously.spokenLanguages.value) {
        isValidInput.spokenLanguages.value = validations.validateSubmittedSpokenLanguages(extraLanguages.value)
    }
}, { deep: true })

onUnmounted(() => {
    if (mapsPlaceTimer) clearTimeout(mapsPlaceTimer)
})

onMounted(() => {
    resetForm()
})
</script>
