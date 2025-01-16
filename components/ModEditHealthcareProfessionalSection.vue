<template>
    <div v-if="isHealthcareProfessionalInitialized">
        <div class="mod-healthcare-professional-section">
            <h2 class="mb-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal">
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
                    type="button"
                    class="bg-tertiary text-primary-text font-bold py-2 px-4 my-2 rounded w-56"
                    @click="handleLocalizedName"
                >
                    {{ $t('modHealthcareProfessionalSection.addHealthCareProfessionalLocaleName') }}
                </button>
                <div
                    v-if="healthcareProfessionalsStore.healthcareProfessionalSectionFields.names"
                    class="flex flex-col"
                >
                    <div
                        v-for="(nameLocale, index) in healthcareProfessionalsStore.healthcareProfessionalSectionFields.names"
                        :key="`${nameLocale.firstName}-${nameLocale.lastName}-${index}`"
                    >
                        <ModDashboardHealthProfessionalCard
                            :healthcare-professional="healthcareProfessionalsStore.healthcareProfessionalSectionFields"
                            :healthcare-professional-name-by-locale="nameLocale"
                            :set-on-click="healthcareProfessionalsStore.setSelectedNameLocaleToUpdate"
                            :update-on-click="healthcareProfessionalsStore.updateHealthcareProfessionalNameValues"
                        />
                    </div>
                </div>
                <div
                    v-if="healthcareProfessionalsStore.removedHealthcareProfessionalNames"
                    class="flex flex-col"
                >
                    <div
                        v-for="(nameLocale) in healthcareProfessionalsStore.removedHealthcareProfessionalNames"
                        :key="`${nameLocale.firstName}-${nameLocale.lastName}-removed`"
                    >
                        <ModDashboardHealthProfessionalCard
                            :healthcare-professional="healthcareProfessionalsStore.healthcareProfessionalSectionFields"
                            :healthcare-professional-name-by-locale="nameLocale"
                        />
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
                <ModSearchbar
                    v-model="healthcareProfessionalAcceptedInsurancesArray"
                    :place-holder-text="$t('modHealthcareProfessionalSection.placeholderTextFacilitySearchBar')"
                    :no-match-text="$t('modHealthcareProfessionalSection.noFacilitiesWereFound')"
                    :fields-to-display-callback="insurancesToDisplayCallback"
                    @search-input-change="handleInsuranceInputChange"
                />
                <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2">
                    <li
                        v-for="insurance in currentAcceptedInsurances"
                        :key="`accepted-${insurance}`"
                        class="py-1"
                    >
                        {{ insurance }}
                    </li>
                </ol>
                <label
                    for="degrees"
                    class="my-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ $t("modHealthcareProfessionalSection.selectDegrees") }}
                </label>
                <ModSearchbar
                    v-model="healthcareProfessionalDegreesArray"
                    :place-holder-text="$t('modHealthcareProfessionalSection.placeholderTextFacilitySearchBar')"
                    :no-match-text="$t('modHealthcareProfessionalSection.noFacilitiesWereFound')"
                    :fields-to-display-callback="degreesToDisplayCallback"
                    @search-input-change="handleDegreeInputChange"
                />
                <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2">
                    <li
                        v-for="degree in currentDegrees"
                        :key="`current-${degree}`"
                        class="py-1"
                    >
                        {{ degree }}
                    </li>
                </ol>
                <label
                    for="specialties"
                    class="my-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ $t("modHealthcareProfessionalSection.selectSpecialties") }}
                </label>
                <ModSearchbar
                    v-model="healthcareProfessionalSpecialtiesArray"
                    :place-holder-text="$t('modHealthcareProfessionalSection.placeholderTextFacilitySearchBar')"
                    :no-match-text="$t('modHealthcareProfessionalSection.noFacilitiesWereFound')"
                    :fields-to-display-callback="specialtiesToDisplayCallback"
                    @search-input-change="handleSpecialtyInputChange"
                />
                <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2">
                    <li
                        v-for="specialty in currentSpecialties"
                        :key="`current-${specialty}`"
                        class="py-1"
                    >
                        {{ specialty }}
                    </li>
                </ol>
                <label
                    for="locales"
                    class="my-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ $t("modHealthcareProfessionalSection.selectLocales") }}
                </label>
                <ModSearchbar
                    v-model="healthcareProfessionalSpokenLanguages"
                    :place-holder-text="$t('modHealthcareProfessionalSection.placeholderTextFacilitySearchBar')"
                    :no-match-text="$t('modHealthcareProfessionalSection.noFacilitiesWereFound')"
                    :fields-to-display-callback="localesToDisplayCallback"
                    @search-input-change="handleLocaleInputChange"
                />
                <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2">
                    <li
                        v-for="locale in currentLanguagesSpoken"
                        :key="`spoken-${locale}`"
                        class="py-1"
                    >
                        {{ localesStore.formatLanguageCodeToSimpleText(locale) }}
                    </li>
                </ol>
            </div>
            <h2
                class="mod-healthcare-professional-section
                 my-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
            >
                {{ $t("modHealthcareProfessionalSection.facilities") }}
            </h2>
            <ModSearchbar
                v-model="selectedFacilities"
                :place-holder-text="$t('modHealthcareProfessionalSection.placeholderTextFacilitySearchBar')"
                :no-match-text="$t('modHealthcareProfessionalSection.noFacilitiesWereFound')"
                :fields-to-display-callback="facilitiesFieldsToDisplayCallback"
                @search-input-change="handleFacilitySearchInputChange"
            />
            <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2 ">
                <li
                    v-for="facility in currentFacilityRelations"
                    :key="facility.id"
                    class="py-1"
                >
                    {{ `${facility.id} / ${facility.nameEn} / ${facility.nameJa}` }}
                </li>
            </ol>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeMount, type Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type ToastInterface, useToast } from 'vue-toastification'
import ModSearchbar from './ModSearchBar.vue'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useLocaleStore } from '~/stores/localeStore'
import { Insurance, Locale, Degree, Specialty, type LocalizedNameInput, type Facility } from '~/typedefs/gqlTypes'
import { useI18n } from '#imports'

let toast: ToastInterface

const route = useRoute()

const { t } = useI18n()

const localesStore = useLocaleStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()
await facilitiesStore.getFacilities() // Fix a bug where facilities disappear after the user refreshes the page
const currentFacilities = facilitiesStore.facilityData

const isHealthcareProfessionalInitialized: Ref<boolean> = ref(false)
const selectedFacilities = ref(new Set<Facility>())
//Keeps track of if the search bar inputs have been autofilled with existing facilities
const currentFacilityRelations: Ref<Facility[]> = ref([])
const currentLanguagesSpoken: Ref<Locale[]> = ref([])
const currentAcceptedInsurances: Ref<Insurance[]> = ref([])
const currentDegrees: Ref<Degree[]> = ref([])
const currentSpecialties: Ref<Specialty[]> = ref([])

// These are component refs to enable the multi select to work properly
const healthcareProfessionalAcceptedInsurancesArray = ref(new Set<Insurance>())
const healthcareProfessionalDegreesArray = ref(new Set<Degree>())
const healthcareProfessionalSpecialtiesArray = ref(ref(new Set<Specialty>()))
const healthcareProfessionalSpokenLanguages = ref(new Set<Locale>())

const handleLocalizedName = () => {
    const localizedNameToAdd: LocalizedNameInput = {
        firstName: healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedFirstName,
        lastName: healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedLastName,
        locale: healthcareProfessionalsStore.selectedNameLocaleToUpdate.nameLocale || Locale.Und,
        middleName: healthcareProfessionalsStore.selectedNameLocaleToUpdate.localizedMiddleName
    }

    const existingNameForLocale = healthcareProfessionalsStore.healthcareProfessionalSectionFields.names
        .find(name => name.locale === localizedNameToAdd.locale)

    if (existingNameForLocale) {
        toast.error(t('modHealthcareProfessionalSection.nameForLocaleAlreadyExists'))
        return
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

const handleFacilitySearchInputChange = (filteredItems: Ref<Facility[]>, inputValue: string) => {
    filteredItems.value = currentFacilities.filter(({ nameEn, nameJa, id }) => {
        const isMatch
            = nameEn.toLowerCase().includes(inputValue)
            || nameJa.toLowerCase().includes(inputValue)
            || id.toLowerCase().includes(inputValue)
        return isMatch
    })
}

const handleInsuranceInputChange = (filteredItems: Ref<Insurance[]>, inputValue: string) => {
    const arrayOfInsurances = Object.values(Insurance) as Insurance[]

    if (!inputValue) {
        filteredItems.value = arrayOfInsurances
        return
    }

    filteredItems.value = arrayOfInsurances.filter(insurance => insurance.toLowerCase().includes(inputValue))
}

const handleDegreeInputChange = (filteredItems: Ref<Degree[]>, inputValue: string) => {
    const degree = Object.values(Degree) as Degree[]

    if (!inputValue) {
        filteredItems.value = degree
        return
    }

    filteredItems.value = degree.filter(degree => degree.toLowerCase().includes(inputValue))
}

const handleSpecialtyInputChange = (filteredItems: Ref<Specialty[]>, inputValue: string) => {
    const arrayOfSpecialties = Object.values(Specialty) as Specialty[]

    if (!inputValue) {
        filteredItems.value = arrayOfSpecialties
        return
    }

    filteredItems.value = arrayOfSpecialties.filter(specialty => specialty.toLowerCase().includes(inputValue))
}

const handleLocaleInputChange = (filteredItems: Ref<Locale[]>, inputValue: string) => {
    const arrayOfLocales = Object.values(Locale) as Locale[]

    if (!inputValue) {
        filteredItems.value = arrayOfLocales
        return
    }

    filteredItems.value = arrayOfLocales.filter(locale => locale.toLowerCase().includes(inputValue))
}

const facilitiesFieldsToDisplayCallback = (item: Facility) => [item.nameEn, item.nameJa]
const specialtiesToDisplayCallback = (specialty: Specialty) => [specialty]
const degreesToDisplayCallback = (degree: Degree) => [degree]
const insurancesToDisplayCallback = (insurance: Insurance) => [insurance]
const localesToDisplayCallback = (locale: Locale) => [localesStore.formatLanguageCodeToSimpleText(locale)]

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

    await nextTick()

    healthcareProfessionalsStore.setSelectedHealthcareProfessional(healthcareProfessionalsStore.selectedHealthcareProfessionalId)

    await nextTick()

    currentFacilityRelations.value = facilitiesStore.facilityData
        .filter(facility => healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds
            .includes(facility.id))

    //Sets the original values from the store based on the selected healthcare professional
    healthcareProfessionalSpokenLanguages.value
        = new Set(healthcareProfessionalsStore.healthcareProfessionalSectionFields.spokenLanguages)
    healthcareProfessionalAcceptedInsurancesArray.value
        = new Set(healthcareProfessionalsStore.healthcareProfessionalSectionFields.acceptedInsurance)
    healthcareProfessionalSpecialtiesArray.value
        = new Set(healthcareProfessionalsStore.healthcareProfessionalSectionFields.specialties)
    healthcareProfessionalDegreesArray.value
        = new Set(healthcareProfessionalsStore.healthcareProfessionalSectionFields.degrees)

    isHealthcareProfessionalInitialized.value = true

    await nextTick()
})

//This autofills the selected facilities based on which ones already have relations
watch(() => [
    healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds,
    healthcareProfessionalsStore.healthcareProfessionalSectionFields.spokenLanguages,
    healthcareProfessionalsStore.healthcareProfessionalSectionFields.acceptedInsurance,
    healthcareProfessionalsStore.healthcareProfessionalSectionFields.degrees,
    healthcareProfessionalsStore.healthcareProfessionalSectionFields.specialties
] as [
    string[],
    Locale[],
    Insurance[],
    Degree[],
    Specialty[]
], ([
    facilityIds,
    spokenLanguages,
    acceptedInsurances,
    degrees,
    specialties]) => {
    if (facilityIds) {
        currentFacilityRelations.value = facilitiesStore.facilityData
            .filter(facility => healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds
                .includes(facility.id))
        selectedFacilities.value = new Set([])
    }
    if (spokenLanguages) {
        currentLanguagesSpoken.value = spokenLanguages
    }
    if (acceptedInsurances) {
        currentAcceptedInsurances.value = acceptedInsurances
    }
    if (degrees) {
        currentDegrees.value = degrees
    }
    if (specialties) {
        currentSpecialties.value = specialties
    }
})

// This updates the set in the store once the set is updated due to a facility clicked
watch(() => Array.from(selectedFacilities.value), newValue => {
    if (newValue) {
        healthcareProfessionalsStore.selectedFacilities = selectedFacilities.value
    }
})

/* This watch is necessary in order to update the reactive object
for the selected healthcareProfessional based on the input values. The
input functionality need their own refs since they are sets within the component in order
to properly update. From there the healthcareProfessionalFields are
updated within the store based the set being transformed into arrays
*/
watch(
    () => [
        Array.from(healthcareProfessionalAcceptedInsurancesArray.value),
        Array.from(healthcareProfessionalDegreesArray.value),
        Array.from(healthcareProfessionalSpecialtiesArray.value),
        Array.from(healthcareProfessionalSpokenLanguages.value)
    ] as [
        Insurance[],
        Degree[],
        Specialty[],
        Locale[]
    ],
    ([newInsurances, newDegrees, newSpecialties, newLocales]) => {
        const healthcareSectionFields = healthcareProfessionalsStore.healthcareProfessionalSectionFields
        healthcareSectionFields.acceptedInsurance = newInsurances
        healthcareSectionFields.degrees = newDegrees
        healthcareSectionFields.specialties = newSpecialties
        healthcareSectionFields.spokenLanguages = newLocales
    }
)
</script>
