<template>
    <form class="flex flex-col place-self-center">
        <h1
            data-testid="submit-heading"
            class="mb-3.5 text-center text-zinc-900 text-2xl font-bold font-['Noto Sans JP'] leading-normal"
        >
            {{ $t('submitPage.heading') }}
        </h1>
        <p
            data-testid="submit-subheading"
            class="mb-10 w-[350px] text-center text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
        >
            {{ $t('submitPage.subheading') }}
        </p>
        <span
            class="mb-2 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
        >{{ $t('submitPage.googleMaps') }}</span>
        <p
            v-show="!isValidInput.googleMapsUrl.value"
            class="text-currentColor text-xs font-['Noto Sans JP']"
        >
            {{ $t('submitPage.googleMapsValidation') }}
        </p>
        <input
            v-model="submissionStore.location"
            data-testid="submit-input-googlemaps"
            type="text"
            required
            class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400
            text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
            :placeholder="$t('submitPage.location')"
            @blur="initialValidationCheck(submissionStore.location, 'googleMaps')"
        >
        <span
            class="mb-2 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
        >{{ $t('submitPage.healthcareProfessionalName') }}</span>
        <p class="flex text-currentColor text-xs font-['Noto Sans JP']">
            <span
                :class="[
                    !isValidInput.lastName.value ? 'visible' : 'invisible',
                    'w-44',
                    'mr-1',
                ]"
            >
                {{ $t('submitPage.lastNameValidation') }}
            </span>
            <span
                :class="[
                    !isValidInput.firstName.value ? 'visible' : 'invisible',
                    'w-44',
                ]"
            >
                {{ $t('submitPage.firstNameValidation') }}
            </span>
        </p>
        <div>
            <input
                v-model="submissionStore.lastName"
                data-testid="submit-input-lastname"
                class="mb-5 mr-2 px-3 py-3.5 w-[170px] h-[50px] bg-white rounded-lg border border-zinc-400
            text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
                type="text"
                required
                maxlength="30"
                :placeholder="$t('submitPage.lastName')"
                @blur="initialValidationCheck(submissionStore.lastName, 'lastName')"
            >
            <input
                v-model="submissionStore.firstName"
                data-testid="submit-input-firstname"
                class="mb-5 px-3 py-3.5 w-[170px] h-[50px] bg-white rounded-lg border border-zinc-400
            text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
                type="text"
                maxlength="30"
                :placeholder="$t('submitPage.firstName')"
                @blur="initialValidationCheck(submissionStore.firstName, 'firstName')"
            >
        </div>
        <span
            class="mb-2 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
        >{{ $t('submitPage.spokenLanguage1') }}</span>
        <p
            v-show="!isValidInput.primarySpokenLangauge.value"
            class="text-currentColor text-xs font-['Noto Sans JP']"
        >
            {{ $t('submitPage.spokenLanguageValidation') }}
        </p>
        <select
            v-model="submissionStore.selectLanguage1"
            data-testid="submit-select-language1"
            class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400 text-primary-text"
            :placeholder="$t('submitPage.selectLanguage1')"
            @change="initialValidationCheck(submissionStore.selectLanguage1, 'primaryLanguage')"
        >
            <option
                v-for="(locale, index) in localeStore.localeDisplayOptions"
                :key="index"
                selected
                :value="locale.code"
            >
                {{ locale.displayText }}
            </option>
        </select>
        <span
            class="mb-2 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
        >{{ $t('submitPage.spokenLanguage2') }}</span>
        <p
            v-show="!isValidInput.secondarySpokenLanguage.value"
            class="text-currentColor text-xs font-['Noto Sans JP']"
        >
            {{ $t('submitPage.invalidOption') }}
        </p>
        <select
            v-model="submissionStore.selectLanguage2"
            data-testid="submit-select-language2"
            class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400 text-primary-text"
            :placeholder="$t('submitPage.selectLanguage2')"
            @change="initialValidationCheck(submissionStore.selectLanguage1, 'secondaryLanguage')"
        >
            <option
                v-for="(locale, index) in localeStore.localeDisplayOptions"
                :key="index"
                selected
                :value="locale.code"
            >
                {{ locale.displayText }}
            </option>
        </select>
        <span
            class="mb-2 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
        >{{ $t('submitPage.otherNotes') }}({{ $t('submitPage.optional') }})</span>
        <textarea
            v-model="submissionStore.otherNotes"
            data-testid="submit-input-notes"
            class="mb-5 landscape:mb-[71px] px-3 py-3.5 w-[350px] h-[100px] bg-white rounded-lg border border-zinc-400"
            maxlength="300"
        />
        <button
            data-testid="submit-submitbutton"
            type="submit"
            class="px-20 py-3 mb-40 landscape:mb-0 rounded-full bg-currentColor w-[350px] text-center
          text-white text-base font-medium font-['Noto Sans JP']"
            @click="validateFields"
        >
            {{ $t('submitPage.submitButton') }}
        </button>
    </form>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import * as validations from '../utils/formValidations'
import { useSubmissionStore } from '~/stores/submissionStore'
import { useLocaleStore } from '~/stores/localeStore'

const submissionStore = useSubmissionStore()
const localeStore = useLocaleStore()

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

const validateFields = (e: Event) => {
    e.preventDefault()
    validationCheckedPreviously.googleMapsUrl.value = true
    isValidInput.googleMapsUrl.value = validations.validateGoogleMapsUrlInput(submissionStore.location)
    validationCheckedPreviously.lastName.value = true
    isValidInput.lastName.value = validations.validateUserSubmittedLastName(submissionStore.lastName)
    validationCheckedPreviously.firstName.value = true
    isValidInput.firstName.value = validations.validateUserSubmittedFirstName(submissionStore.firstName)
    validationCheckedPreviously.primarySpokenLangauge.value = true
    isValidInput.primarySpokenLangauge.value = validations.validateFirstSpokenLanguage(submissionStore.selectLanguage1)
    validationCheckedPreviously.secondarySpokenLanguage.value = true
    isValidInput.secondarySpokenLanguage.value
        = validations.validateUserSubmittedLastName(submissionStore.selectLanguage2)

    if (
        !isValidInput.googleMapsUrl.value
        || !isValidInput.lastName.value
        || !isValidInput.firstName.value
        || !isValidInput.primarySpokenLangauge.value
        || !isValidInput.secondarySpokenLanguage.value
    ) {
        e.preventDefault()
        return
    }
    submissionStore.submit()
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

watch(() => submissionStore.location, newValue => {
    if (validationCheckedPreviously.googleMapsUrl.value) {
        isValidInput.googleMapsUrl.value = validations.validateGoogleMapsUrlInput(newValue)
    }
})
watch(() => submissionStore.lastName, newValue => {
    if (validationCheckedPreviously.lastName.value) {
        isValidInput.lastName.value = validations.validateUserSubmittedLastName(newValue)
    }
})
watch(() => submissionStore.firstName, newValue => {
    if (validationCheckedPreviously.firstName.value) {
        isValidInput.firstName.value = validations.validateUserSubmittedFirstName(newValue)
    }
})
watch(() => submissionStore.selectLanguage1, newValue => {
    if (validationCheckedPreviously.primarySpokenLangauge.value) {
        isValidInput.primarySpokenLangauge.value = validations.validateFirstSpokenLanguage(newValue)
    }
})
watch(() => submissionStore.selectLanguage2, newValue => {
    if (validationCheckedPreviously.secondarySpokenLanguage.value) {
        isValidInput.secondarySpokenLanguage.value = validations.validateSecondSpokenLanguage(newValue)
    }
})
</script>
