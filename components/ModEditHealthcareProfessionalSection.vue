<template>
    <div v-if="isHealthcareProfessionalInitialized">
        <div class="mod-healthcare-professional-section">
            <h2
                class="mb-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
            >
                {{ $t('modHealthcareProfessionalSection.healthcareProfessionalNameHeading') }}
            </h2>
            <div class="input-fields flex flex-col my-4">
                <ModInputField
                    v-model="healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedLastName"
                    data-testid="mod-healthcare-professional-section-lastName"
                    :label="$t('modHealthcareProfessionalSection.labelHealthcareProfessionalLastName')"
                    type="text"
                    :placeholder="$t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalLastName')"
                    :required="true"
                />
                <ModInputField
                    v-model="healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedFirstName"
                    data-testid="mod-healthcare-professional-section-firstName"
                    :label="$t('modHealthcareProfessionalSection.labelHealthcareProfessionalFirstName')"
                    type="text"
                    :placeholder="$t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalFirstName')"
                    :required="true"
                />
                <ModInputField
                    v-model="healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedMiddleName"
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
                    v-model="healthcareProfessionalsStore.selectedNameLocaleToUpdate.nameLocale"
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
                    class="bg-tertiary text-primary-text font-bold py-2 px-4 my-2 rounded w-56"
                    @click="handleLocalizedName"
                >
                    {{ $t('modHealthcareProfessionalSection.addHealthCareProfessionalLocaleName') }}
                </button>
                <div
                    v-if="healthcareProfessionalsStore.healthcareProfessionalSectionFields.names"
                    class="flex flex-wrap"
                >
                    <ModDashboardHealthProfessionalCard
                        :healthcare-professional="healthcareProfessionalsStore.healthcareProfessionalSectionFields"
                        :set-on-click="healthcareProfessionalsStore.setSelectedNameLocaleToUpdate"
                        :update-on-click="healthcareProfessionalsStore.updateHealthcareProfessionalNameValues"
                    />
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
                    v-model="healthcareProfessionalsStore.healthcareProfessionalSectionFields.acceptedInsurance"
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
                    v-model="healthcareProfessionalsStore.healthcareProfessionalSectionFields.degrees"
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
                    v-model="healthcareProfessionalsStore.healthcareProfessionalSectionFields.specialties"
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
                    v-model="healthcareProfessionalsStore.healthcareProfessionalSectionFields.spokenLanguages"
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
            <h2
                class="mod-healthcare-professional-section
                 my-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
            >
                {{ $t("modHealthcareProfessionalSection.facilities") }}
            </h2>
            <!-- This is just an example how to use it -->
            <ModSearchbar
                v-model="selectedFacilities"
                :place-holder-text="$t('modHealthcareProfessionalSection.placeholderTextFacilitySearchBar')"
                :no-match-text="$t('modHealthcareProfessionalSection.noFacilitiesWereFound')"
                :fields-to-display-callback="fieldsToDisplayCallback"
                @search-input-change="handleSearchInputChange"
            />
            <ul>
                <li
                    v-for="facility in selectedFacilities"
                    :key="facility.id"
                >
                    {{ `${facility.id} / ${facility.nameEn} / ${facility.nameJa}` }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeMount, onUpdated, type Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type ToastInterface, useToast } from 'vue-toastification'
import ModSearchbar from './ModSearchBar.vue'
import { ModerationScreen, useModerationScreenStore } from '~/stores/moderationScreenStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { Locale, Insurance, Degree, Specialty, type LocalizedNameInput, type Facility } from '~/typedefs/gqlTypes'
import { multiSelectWithoutKeyboard } from '~/utils/multiSelectWithoutKeyboard'
import { useFacilitiesStore, useI18n } from '#imports'

let toast: ToastInterface

const route = useRoute()

const { t } = useI18n()

const selectedFacilities = ref(new Set<Facility>())
const facilitiesStore = useFacilitiesStore()
await facilitiesStore.getFacilities() // Fix a bug where facilities disappear after the user refreshes the page
const currentFacilities = facilitiesStore.facilityData

const moderationScreenStore = useModerationScreenStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const isEditSubmissionScreen = moderationScreenStore.activeScreen === ModerationScreen.EditSubmission

const insuranceList = Object.values(Insurance) as Insurance[]
const selectedInsurance = (option: HTMLOptionElement): Insurance => option.value as Insurance
const degreeList = Object.values(Degree) as Degree[]
const selectedDegree = (option: HTMLOptionElement): Degree => option.value as Degree
const specialtyList = Object.values(Specialty) as Specialty[]
const selectedSpecialty = (option: HTMLOptionElement): Specialty => option.value as Specialty
const localeList = Object.values(Locale) as Locale[]
const selectedLocale = (option: HTMLOptionElement): Locale => option.value as Locale
const isHealthcareProfessionalInitialized: Ref<boolean> = ref(false)

// These are component refs to enable the multi select to work properly
const healthcareProfessionalAcceptedInsurancesArray: Ref<Array<Insurance>> = ref([])
const healthcareProfessionalDegreesArray: Ref<Array<Degree>> = ref([])
const healthcareProfessionalSpecialtiesArray: Ref<Array<Specialty>> = ref([])
const healthcareProfessionalSpokenLanguages: Ref<Array<Locale>> = ref([])

const handleLocalizedName = () => {
    const localizedNameToAdd: LocalizedNameInput = {
        firstName: healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedFirstName,
        lastName: healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedLastName,
        locale: healthcareProfessionalsStore.selectedNameLocaleToUpdate.nameLocale || Locale.Und,
        middleName: healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedMiddleName
    }

    if (localizedNameToAdd.firstName
      && localizedNameToAdd.lastName
      && localizedNameToAdd.firstName.length > 1
      && localizedNameToAdd.lastName.length > 1
      && healthcareProfessionalsStore.healthcareProfessionalSectionFields.names) {
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.names.push(localizedNameToAdd)
        healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedFirstName = ''
        healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedMiddleName = ''
        healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedLastName = ''
        healthcareProfessionalsStore.selectedNameLocaleToUpdate.nameLocale = Locale.Und
    }
}

const handleSearchInputChange = (filteredItems: Ref<Facility[]>, inputValue: string) => {
    filteredItems.value = currentFacilities.filter(({ nameEn, nameJa, id }) => {
        const isMatch
            = nameEn.toLowerCase().includes(inputValue)
            || nameJa.toLowerCase().includes(inputValue)
            || id.toLowerCase() === inputValue
        return isMatch
    })
}

const fieldsToDisplayCallback = (item: Facility) => [item.nameEn, item.nameJa]

onBeforeMount(async () => {
    isHealthcareProfessionalInitialized.value = false

    /**
    Set the variable to useToast when the before the component mounts
    since vue-taostification is only available on the client.
    If not done this way the build fails
     */
    toast = useToast()

    // Wait for the route to be fully resolved
    await nextTick()
    // Ensure the route param `id` is available before proceeding
    const id = route.params.id

    if (!id) {
        console.error(t('modHealthcareProfessionalSection.errorMessageHealthcareProfessionalId'))
        toast.error(t('modHealthcareProfessionalSection.errorMessageHealthcareProfessionalId'))
        return
    }

    if (!healthcareProfessionalsStore.healthcareProfessionalsData.length) {
        await healthcareProfessionalsStore.getHealthcareProfessionals()
    }

    healthcareProfessionalsStore.setSelectedHealthcareProfessional(healthcareProfessionalsStore.selectedHealthcareProfessionalId)

    await nextTick()

    isHealthcareProfessionalInitialized.value = true

    await nextTick()
})

/* This runs the functions only when the DOM has fully loaded and been updated for
the multiselects to be initialized properly
*/
onUpdated(() => {
    multiSelectWithoutKeyboard(
        '#accepted-insurances',
        healthcareProfessionalAcceptedInsurancesArray,
        selectedInsurance
    )

    multiSelectWithoutKeyboard(
        '#degrees',
        healthcareProfessionalDegreesArray,
        selectedDegree
    )

    multiSelectWithoutKeyboard(
        '#specialties',
        healthcareProfessionalSpecialtiesArray,
        selectedSpecialty
    )

    multiSelectWithoutKeyboard(
        '#locales',
        healthcareProfessionalSpokenLanguages,
        selectedLocale
    )
})

/* This watch is necessary in order to update the reactive object
for the selected healthcareProfessional based on the multiselect values. The
multiselect functionality need their own refs within the component in order
to properly update with our custom multiselect functionality. From there the
healthcareProfessionalFields are updated within the store based on the chosen
options in the multiselect
*/
watch(
    () => [
        healthcareProfessionalAcceptedInsurancesArray.value,
        healthcareProfessionalDegreesArray.value,
        healthcareProfessionalSpecialtiesArray.value,
        healthcareProfessionalSpokenLanguages.value
    ] as [
        Insurance[],
        Degree[],
        Specialty[],
        Locale[]
    ],
    ([newInsurances, newDegrees, newSpecialties, newLocales]) => {
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.acceptedInsurance = newInsurances
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.degrees = newDegrees
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.specialties = newSpecialties
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.spokenLanguages = newLocales
    }
)
</script>
