<template>
    <div class="mod-healthcare-professional-section">
        <h2
            class="mb-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
        >
            {{ $t('modHealthcareProfessionalSection.healthcareProfessionalNameHeading') }}
        </h2>
        <div class="input-fields flex flex-col my-4">
            <ModInputField
                v-model="healthcareProfessionalsStore.healthcareProfessionalSectionFields.localizedLastName"
                data-testid="mod-healthcare-professional-section-lastName"
                :label="$t('modHealthcareProfessionalSection.labelHealthcareProfessionalLastName')"
                type="text"
                :placeholder="$t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalLastName')"
                :required="true"
            />
            <ModInputField
                v-model="healthcareProfessionalsStore.healthcareProfessionalSectionFields.localizedFirstName"
                data-testid="mod-healthcare-professional-section-firstName"
                :label="$t('modHealthcareProfessionalSection.labelHealthcareProfessionalFirstName')"
                type="text"
                :placeholder="$t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalFirstName')"
                :required="true"
            />
            <ModInputField
                v-model="healthcareProfessionalsStore.healthcareProfessionalSectionFields.localizedMiddleName"
                data-testid="mod-healthcare-professional-section-middleName"
                :label="$t('modHealthcareProfessionalSection.labelHealthcareProfessionalMiddleName')"
                type="text"
                :placeholder="$t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalMiddleName')"
                :required="false"
            />
            <label
                for="name_locales"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t('modHealthcareProfessionalSection.labelHealthcareProfessionalNameLocale') }}
            </label>
            <select
                id="name_locales"
                v-model="healthcareProfessionalsStore.healthcareProfessionalSectionFields.nameLocale"
                data-testid="mod-healthcare-professional-section-name-locale"
                name="Name Locales"
                class="mb-5 px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                            text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(locale, index) in Locale"
                    :key="`${locale}-${index}`"
                >
                    {{ locale }}
                </option>
            </select>
            <button
                v-show="isEditSubmissionScreen"
                type="button"
                class="bg-tertiary text-white font-bold py-2 px-4 my-2 rounded w-56"
                @click="handleLocalizedName"
            >
                {{ $t('modHealthcareProfessionalSection.addHealthCareProfessionalLocaleName') }}
            </button>
            <div
                v-if="professionalNameArray.length"
                class="flex flex-wrap"
            >
                <div
                    v-for="(healthcareProfessionalName, index) in professionalNameArray"
                    :key="`${healthcareProfessionalName.firstName}-${index}`"
                    class="flex basis-1/3 justify-start items-center p-2"
                >
                    <div
                        class="flex justify-center items-center rounded-lg p-3  border-2 border-primary"
                        :data-testid="`mod-submission-list-item-${index + 1}`"
                    >
                        <div>
                            <div class="flex font-bold">
                                <SVGProfileIcon
                                    role="img"
                                    alt="profile icon"
                                    title="profile icon"
                                    class="profile-icon w-6 h-6 stroke-primary stroke-1 inline mx-1"
                                />
                                <span>{{ healthcareProfessionalName.lastName }}</span>
                                <span class="mx-2">{{ healthcareProfessionalName.firstName }}</span>
                                <span v-show="healthcareProfessionalName.middleName">
                                    {{ healthcareProfessionalName.middleName }}
                                </span>
                            </div>
                            <div
                                class="w-fit px-2 py-[1px] my-2 border border-primary/40 rounded-full
                                    shadow text-sm text-center hover:bg-primary/20 transition-all"
                            >
                                {{ healthcareProfessionalName.locale }}
                            </div>
                        </div>
                        <span
                            class="flex items-center justify-center
                                cursor-pointer font-bold text-secondary text-sm"
                            @click="() => handleRemoveHealthcareProfessionalName(index)"
                        >
                            <SVGTrashCan class="flex items-center justify-center w-6 h-6" /> {{
                                $t('modHealthcareProfessionalSection.delete') }}
                        </span>
                    </div>
                </div>
            </div>
            <h2
                class="mod-healthcare-professional-section
                 my-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
            >
                {{ $t('modHealthcareProfessionalSection.healthcareProfessionalMedicalInfoHeading') }}
            </h2>
            <label
                for="Accepted Insurances"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t("modHealthcareProfessionalSection.selectInsurances") }}
            </label>
            <select
                id="accepted-insurances"
                v-model="sectionFields.healthcareProfessionalAcceptedInsurances"
                data-testid="mod-healthcare-professional-section-accepted-insurances"
                name="Accepted Insurances"
                multiple
                class="mb-5 px-3 py-3.5 w-96 h-32 bg-secondary-bg rounded-lg border border-primary-text-muted
                            text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(insuranceType, index) in insuranceList"
                    :key="`${insuranceType}-${index}`"
                    :value="insuranceType"
                >
                    {{ insuranceType }}
                </option>
            </select>
            <label
                for="degrees"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t("modHealthcareProfessionalSection.selectDegrees") }}
            </label>
            <select
                id="degrees"
                v-model="sectionFields.healthcareProfessionalDegrees"
                data-testid="mod-healthcare-professional-section-degrees"
                name="Degrees"
                multiple
                class="mb-5 px-3 py-3.5 w-96 h-32 bg-secondary-bg rounded-lg border border-primary-text-muted
                            text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(degree, index) in degreeList"
                    :key="`${degree}-${index}`"
                    :value="degree"
                >
                    {{ degree }}
                </option>
            </select>
            <label
                for="specialties"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t("modHealthcareProfessionalSection.selectSpecialties") }}
            </label>
            <select
                id="specialties"
                v-model="sectionFields.healthcareProfessionalSpecialties"
                data-testid="mod-healthcare-professional-section-specialties"
                name="Specialties"
                multiple
                class="mb-5 px-3 py-3.5 w-96 h-32 bg-secondary-bg rounded-lg border border-primary-text-muted
                            text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(specialty, index) in specialtyList"
                    :key="`${specialty}-${index}`"
                    :value="specialty"
                >
                    {{ specialty }}
                </option>
            </select>
            <label
                for="locales"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t("modHealthcareProfessionalSection.selectLocales") }}
            </label>
            <select
                id="locales"
                v-model="sectionFields.healthcareProfessionalLocales"
                data-testid="mod-healthcare-professional-section-spoken-locales"
                name="Locales"
                multiple
                class="mb-5 px-3 py-3.5 w-96 h-32 bg-secondary-bg rounded-lg border border-primary-text-muted
                            text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(locale, index) in localeList"
                    :key="`${locale}-${index}`"
                    :value="locale"
                >
                    {{ locale }}
                </option>
            </select>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { ModerationScreen, useModerationScreenStore } from '~/stores/moderationScreenStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { Locale, type LocalizedNameInput, Insurance, Degree, Specialty } from '~/typedefs/gqlTypes'
import { multiSelectWithoutKeyboard } from '~/utils/multiSelectWithoutKeyboard'
import SVGTrashCan from '~/assets/icons/trash-can.svg'
import SVGProfileIcon from '~/assets/icons/profile-icon.svg'

const moderationScreenStore = useModerationScreenStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const sectionFields = healthcareProfessionalsStore.healthcareProfessionalSectionFields
const professionalNameArray = sectionFields.healthcareProfessionalNameArray
const isEditSubmissionScreen = moderationScreenStore.activeScreen === ModerationScreen.EditSubmission

console.log()

const insuranceList = Object.values(Insurance) as Insurance[]
const selectedInsurance = (option: HTMLOptionElement): Insurance => option.value as Insurance
const degreeList = Object.values(Degree) as Degree[]
const selectedDegree = (option: HTMLOptionElement): Degree => option.value as Degree
const specialtyList = Object.values(Specialty) as Specialty[]
const selectedSpecialty = (option: HTMLOptionElement): Specialty => option.value as Specialty
const localeList = Object.values(Locale) as Locale[]
const selectedLocale = (option: HTMLOptionElement): Locale => option.value as Locale

const handleLocalizedName = () => {
    const localizedNameToAdd: LocalizedNameInput = {
        firstName: sectionFields.localizedFirstName,
        lastName: sectionFields.localizedLastName,
        locale: sectionFields.nameLocale || Locale.EnUs,
        middleName: sectionFields.localizedMiddleName
    }

    if (localizedNameToAdd.firstName
      && localizedNameToAdd.lastName
      && localizedNameToAdd.firstName.length > 1
      && localizedNameToAdd.lastName.length > 1) {
        professionalNameArray.push(localizedNameToAdd)
        sectionFields.localizedFirstName = ''
        sectionFields.localizedLastName = ''
        sectionFields.localizedMiddleName = ''
        sectionFields.nameLocale = Locale.EnUs
    }
}

const handleRemoveHealthcareProfessionalName = (index: number) => {
    professionalNameArray.splice(index, 1)
}

onMounted(() => {
    multiSelectWithoutKeyboard(
        '#healthcare-professional-accepted-insurances',
        sectionFields.healthcareProfessionalAcceptedInsurances,
        selectedInsurance
    )

    multiSelectWithoutKeyboard(
        '#healthcare-professional-degrees',
        sectionFields.healthcareProfessionalDegrees,
        selectedDegree
    )

    multiSelectWithoutKeyboard(
        '#healthcare-professional-specialties',
        sectionFields.healthcareProfessionalSpecialties,
        selectedSpecialty
    )

    multiSelectWithoutKeyboard(
        '#healthcare-professional-locales',
        sectionFields.healthcareProfessionalLocales,
        selectedLocale
    )
})
</script>
