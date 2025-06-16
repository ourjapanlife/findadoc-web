<template>
    <Loader v-if="moderationScreenStore.editHealthcareProfessionalScreenIsActive()" />
    <div v-if="isHealthcareProfessionalInitialized">
        <div
            :id="ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalName"
            class="mod-healthcare-professional-section"
        >
            <h2 class="mb-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal">
                {{ t('modHealthcareProfessionalSection.healthcareProfessionalNameHeading') }}
            </h2>
            <div class="input-fields flex flex-col my-4">
                <Transition
                    enter-active-class="transition-all ease-in-out duration-300"
                    leave-active-class="transition-all ease-in-out duration-300"
                    enter-from-class="opacity-0 max-h-0"
                    enter-to-class="opacity-100 max-h-[500px]"
                    leave-from-class="opacity-100 max-h-[500px]"
                    leave-to-class="opacity-0 max-h-0"
                >
                    <div
                        v-show="addingLocaleName || editingLocaleName"
                        :class="[
                            'name-locale-input-fields rounded-lg border-2 border-primary flex flex-col px-2 w-fit',
                            editingLocaleName ? 'rounded-b-none border-b-0 pb-5' : 'rounded-lg border-2 border-primary',
                        ]"
                    >
                        <ModInputField
                            v-model="nameLocaleInputs.lastName"
                            data-testid="mod-healthcare-professional-section-lastName"
                            :label="t('modHealthcareProfessionalSection.labelHealthcareProfessionalLastName')"
                            type="text"
                            :placeholder="t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalLastName')"
                            :required="true"
                        />
                        <ModInputField
                            v-model="nameLocaleInputs.firstName"
                            data-testid="mod-healthcare-professional-section-firstName"
                            :label="t('modHealthcareProfessionalSection.labelHealthcareProfessionalFirstName')"
                            type="text"
                            :placeholder="t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalFirstName')"
                            :required="true"
                        />
                        <ModInputField
                            v-model="nameLocaleInputs.middleName as string"
                            data-testid="mod-healthcare-professional-section-middleName"
                            :label="t('modHealthcareProfessionalSection.labelHealthcareProfessionalMiddleName')"
                            type="text"
                            :placeholder="t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalMiddleName')"
                            :required="false"
                        />
                        <label
                            for="mod-edit-healthcare-professional-section-select-name-locales"
                            class="my-2 text-primary-text text-sm font-bold font-sans"
                        >
                            {{ t('modHealthcareProfessionalSection.labelHealthcareProfessionalNameLocale') }}
                        </label>
                        <select
                            id="mod-edit-healthcare-professional-section-select-name-locales"
                            v-model="nameLocaleInputs.locale"
                            data-testid="mod-healthcare-professional-section-name-locale"
                            name="name-locales"
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
                        <div
                            v-show="addingLocaleName"
                            class="flex justify-between w-96"
                        >
                            <button
                                class="bg-primary text-primary-text-inverted font-bold py-2 px-4 my-2 rounded w-36"
                                type="button"
                                @click="handleAddLocalizedName"
                            >
                                {{ t('modHealthcareProfessionalSection.save') }}
                            </button>
                            <button
                                class="bg-error text-primary-text-inverted font-bold py-2 px-4 my-2 rounded w-36"
                                type="button"
                                @click="handleCloseAddingNewLocalizedName"
                            >
                                {{ t('modHealthcareProfessionalSection.exit') }}
                            </button>
                        </div>
                        <div
                            v-show="editingLocaleName"
                            class="flex justify-between w-96"
                        >
                            <button
                                class="bg-primary text-primary-text-inverted font-bold py-2 px-4 my-2 rounded w-36"
                                type="button"
                                @click="handleUpdateExistingName"
                            >
                                {{ t('modHealthcareProfessionalSection.update') }}
                            </button>
                            <button
                                class="bg-error text-primary-text-inverted font-bold py-2 px-4 my-2 rounded w-36"
                                type="button"
                                @click="handleDeleteExistingName"
                            >
                                {{ t('modHealthcareProfessionalSection.delete') }}
                            </button>
                        </div>
                    </div>
                </Transition>
                <div
                    v-if="healthcareProfessionalsStore.healthcareProfessionalSectionFields.names"
                    class="flex flex-col"
                >
                    <div
                        v-for="(nameLocale, index) in healthcareProfessionalsStore.healthcareProfessionalSectionFields.names"
                        :key="`${nameLocale.firstName}-${nameLocale.lastName}-${index}`"
                        @click="() => setChosenLocaleNameInput(index)"
                    >
                        <ModDashboardHealthProfessionalCard
                            :healthcare-professional="healthcareProfessionalsStore.healthcareProfessionalSectionFields"
                            :healthcare-professional-name-by-locale="nameLocale"
                            :chosen-locale-index="index"
                            :is-editable="editingLocaleName"
                            :set-is-editable-function="setEditingLocaleName"
                        />
                    </div>
                </div>
                <button
                    type="button"
                    data-testid="mod-healthcare-add-name-button"
                    class="bg-accent text-primary-text-inverted font-bold py-2 px-4 my-2 rounded w-44"
                    @click="handleOpenAddNewNameWithReset"
                >
                    {{ t('modHealthcareProfessionalSection.addHealthCareProfessionalLocaleName') }}
                </button>
                <h2
                    :id="ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalMedicalInfo"
                    class="mod-healthcare-professional-section
                     my-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
                >
                    {{ t('modHealthcareProfessionalSection.healthcareProfessionalMedicalInfoHeading') }}
                </h2>
                <label
                    for="accepted-insurances"
                    class="my-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ t("modHealthcareProfessionalSection.selectInsurances") }}
                </label>
                <ModSearchBar
                    v-model="healthcareProfessionalAcceptedInsurancesArray"
                    data-test-id="mod-healthcare-professional-section-accepted-insurances"
                    :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextAcceptedInsurances')"
                    :no-match-text="t('modHealthcareProfessionalSection.noInsurancesWereFound')"
                    :fields-to-display-callback="insurancesToDisplayCallback"
                    :default-suggestions="Object.values(Insurance)"
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
                    {{ t("modHealthcareProfessionalSection.selectDegrees") }}
                </label>
                <ModSearchBar
                    v-model="healthcareProfessionalDegreesArray"
                    data-test-id="mod-healthcare-professional-section-degrees"
                    :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextDegrees')"
                    :no-match-text="t('modHealthcareProfessionalSection.noDegreesWereFound')"
                    :fields-to-display-callback="degreesToDisplayCallback"
                    :default-suggestions="Object.values(Degree)"
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
                    {{ t("modHealthcareProfessionalSection.selectSpecialties") }}
                </label>
                <ModSearchBar
                    v-model="healthcareProfessionalSpecialtiesArray"
                    data-test-id="mod-healthcare-professional-section-specialties"
                    :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextSpecialties')"
                    :no-match-text="t('modHealthcareProfessionalSection.noSpecialtiesWereFound')"
                    :fields-to-display-callback="specialtiesToDisplayCallback"
                    :default-suggestions="Object.values(Specialty)"
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
                    {{ t("modHealthcareProfessionalSection.selectLocales") }}
                </label>
                <ModSearchBar
                    v-model="healthcareProfessionalSpokenLanguages"
                    data-test-id="mod-healthcare-professional-section-spoken-locales"
                    :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextLocales')"
                    :no-match-text="t('modHealthcareProfessionalSection.noLocalesWereFound')"
                    :fields-to-display-callback="localesToDisplayCallback"
                    :default-suggestions="Object.values(Locale)"
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
            <div v-if="moderationScreenStore.editHealthcareProfessionalScreenIsActive()">
                <h2
                    :id="ModHealthcareProfessionalsLeftNavbarSections.HealthcareProfessionalFacilities"
                    class="mod-healthcare-professional-section
                 my-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
                >
                    {{ t("modHealthcareProfessionalSection.facilities") }}
                </h2>
                <ModSearchBar
                    v-model="selectedFacilities"
                    :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextFacilitySearchBar')"
                    :no-match-text="t('modHealthcareProfessionalSection.noFacilitiesWereFound')"
                    :fields-to-display-callback="facilitiesFieldsToDisplayCallback"
                    :default-suggestions="currentFacilities"
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
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeMount, reactive, type Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type ToastInterface, useToast } from 'vue-toastification'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'
import { useLocaleStore } from '~/stores/localeStore'
import { Insurance, Locale, Degree, Specialty, type LocalizedNameInput, type Facility } from '~/typedefs/gqlTypes'
import { useI18n } from '#imports'
import { validateNameLocaleMatchesLanguage } from '~/utils/formValidations'

let toast: ToastInterface

const route = useRoute()

const { t } = useI18n()

const loadingStore = useLoadingStore()

const moderationScreenStore = useModerationScreenStore()
const localesStore = useLocaleStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()
await facilitiesStore.getFacilities() // Fix a bug where facilities disappear after the user refreshes the page
const currentFacilities = facilitiesStore.facilityData

const isHealthcareProfessionalInitialized: Ref<boolean> = ref(false)
const selectedFacilities: Ref<Facility[]> = ref([])
//Keeps track of if the search bar inputs have been autofilled with existing facilities
const currentFacilityRelations: Ref<Facility[]> = ref([])
const currentLanguagesSpoken: Ref<Locale[]> = ref([])
const currentAcceptedInsurances: Ref<Insurance[]> = ref([])
const currentDegrees: Ref<Degree[]> = ref([])
const currentSpecialties: Ref<Specialty[]> = ref([])

// These are component refs to enable the multi select to work properly
const healthcareProfessionalAcceptedInsurancesArray: Ref<Insurance[]> = ref([])
const healthcareProfessionalDegreesArray: Ref<Degree[]> = ref([])
const healthcareProfessionalSpecialtiesArray: Ref<Specialty[]> = ref([])
const healthcareProfessionalSpokenLanguages: Ref<Locale[]> = ref([])

// Tracks whether we want to display adding a new name
const addingLocaleName: Ref<boolean> = ref(false)
// Tracks how we want to display editing a Locale name
const editingLocaleName: Ref<boolean> = ref(false)
// Keeps track of which index of the name locale was clicked
const chosenLocaleIndex: Ref<number | null> = ref(null)
// Keeps track of the chosen healthcare professional to edit
const chosenHealthcareProfessionalToEdit: Ref<LocalizedNameInput | undefined> = ref()
// This keeps track of the name we are adding or updating
const nameLocaleInputs: LocalizedNameInput = reactive(
    { firstName: '',
        lastName: '',
        middleName: '',
        locale: Locale.Und }
)

// Sets the locale being edited name value
const setEditingLocaleName = (newValue: boolean) => {
    editingLocaleName.value = newValue
    // Makes sure both values cannot be true
    addingLocaleName.value = false
}

// Closes the locale being added name inputs
const handleCloseAddingNewLocalizedName = () => {
    // Allows for the inputs to completely transition before resetting the fields
    setTimeout(() => resetNameLocaleInputs, 300)
    addingLocaleName.value = false
    // Makes sure both values cannot be true
    editingLocaleName.value = false
}

// Opens the locale being added name inputs
const handleOpenAddNewNameWithReset = () => {
    // Allows for the inputs to completely transition before resetting the fields
    setTimeout(() => resetNameLocaleInputs, 300)
    addingLocaleName.value = true
    // Makes sure both values cannot be true
    editingLocaleName.value = false
}

// This resets the fields
const resetNameLocaleInputs = () => {
    nameLocaleInputs.firstName = ''
    nameLocaleInputs.middleName = ''
    nameLocaleInputs.lastName = ''
    nameLocaleInputs.locale = Locale.Und
}

// This autofills the inputs if a name is being edited
const autofillNameLocaleInputWithChosenHealthcareProfessional = (localizedNameInput: LocalizedNameInput) => {
    nameLocaleInputs.firstName = localizedNameInput.firstName
    nameLocaleInputs.lastName = localizedNameInput.lastName
    nameLocaleInputs.middleName = localizedNameInput.middleName || ''
    nameLocaleInputs.locale = localizedNameInput.locale
}

//This will set the name that needs to be autofilled and move it to the zero index
const setChosenLocaleNameInput = (index: number) => {
    chosenLocaleIndex.value = index

    //This will keep track of the healthcare professional to not lose it but we can swap it later with the chosen one
    const tempToHoldZeroIndexedHealthcareProfessionalToSwap
    = healthcareProfessionalsStore.healthcareProfessionalSectionFields.names[0]

    //This finds the chosen healthcare professional to edit
    chosenHealthcareProfessionalToEdit.value
    = healthcareProfessionalsStore.healthcareProfessionalSectionFields.names.find((_, index) => index === chosenLocaleIndex.value)

    if (chosenHealthcareProfessionalToEdit.value) {
        //Set the chosen healthcare professional name to move it closer to the input
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.names[0]
    = chosenHealthcareProfessionalToEdit.value
        // Put the temp one in the index where the old locale name was
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.names[chosenLocaleIndex.value]
        = tempToHoldZeroIndexedHealthcareProfessionalToSwap
        //Autofill with the chosen healthcare professional locale name
        autofillNameLocaleInputWithChosenHealthcareProfessional(chosenHealthcareProfessionalToEdit.value)
        // Set the chosenLocaleIndex to 0 so the correct pencil is showing
        chosenLocaleIndex.value = 0
    }
}

const handleUpdateExistingName = () => {
    const localizedNameToAdd: LocalizedNameInput = {
        firstName: nameLocaleInputs.firstName,
        lastName: nameLocaleInputs.lastName,
        locale: nameLocaleInputs.locale || Locale.Und,
        middleName: nameLocaleInputs.middleName
    }

    // Checks to keep user from adding a name with same locale instead of editing
    const existingNameForLocale = healthcareProfessionalsStore.healthcareProfessionalSectionFields.names
        .find(name => name.locale === nameLocaleInputs.locale)

    // Displays message if user is trying to add a locale for name that exists and they aren't editing a healthcare professional
    if (existingNameForLocale) {
        toast.error(t('modHealthcareProfessionalSection.nameForLocaleAlreadyExists'))
        return
    }

    // Displays message for user if they haven't chosen a locale
    if (!nameLocaleInputs.locale || nameLocaleInputs.locale === Locale.Und) {
        toast.error(t('modHealthcareProfessionalSection.missingLocale'))
        return
    }

    // This updates the array in the store with the new edited name since we already ordered the index to this when autofilling
    if (chosenHealthcareProfessionalToEdit.value) {
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.names[0] = localizedNameToAdd
    }

    // This updates the array in the store with the new edited name since we already ordered the index to this when autofilling
    if (chosenHealthcareProfessionalToEdit.value) {
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.names[0] = localizedNameToAdd
    }

    setEditingLocaleName(false)

    // Allows for the inputs to completely transition before resetting the fields
    setTimeout(() => {
        resetNameLocaleInputs()
        chosenHealthcareProfessionalToEdit.value = undefined
        chosenLocaleIndex.value = null
    }, 301)
}

const handleDeleteExistingName = () => {
    if (healthcareProfessionalsStore.healthcareProfessionalSectionFields.names.length <= 1) {
        toast.error(t('modHealthcareProfessionalSection.oneNameNecessary'))
        return
    }
    // Remove the first element safely since we reordered the one for deletion at 0
    healthcareProfessionalsStore.healthcareProfessionalSectionFields.names.shift()

    setEditingLocaleName(false)

    // Allows for the inputs to completely transition before resetting the fields
    setTimeout(() => {
        resetNameLocaleInputs()
        chosenHealthcareProfessionalToEdit.value = undefined
        chosenLocaleIndex.value = null
    }, 301)
}

const handleAddLocalizedName = () => {
    const localizedNameToAdd: LocalizedNameInput = {
        firstName: nameLocaleInputs.firstName,
        lastName: nameLocaleInputs.lastName,
        locale: nameLocaleInputs.locale || Locale.Und,
        middleName: nameLocaleInputs.middleName
    }
    // Checks to keep user from adding a name with same locale instead of editing
    const existingNameForLocale = healthcareProfessionalsStore.healthcareProfessionalSectionFields.names
        .find(name => name.locale === nameLocaleInputs.locale)

    // Displays message if user is trying to add a locale for name that exists and they aren't editing a healthcare professional
    if (existingNameForLocale) {
        toast.error(t('modHealthcareProfessionalSection.nameForLocaleAlreadyExists'))
        return
    }

    // Displays message for user if they haven't entered a last name
    if (!nameLocaleInputs.lastName) {
        toast.error(t('modHealthcareProfessionalSection.missingLastName'))
        return
    }

    // Displays message for user if they haven't entered a first name
    if (!nameLocaleInputs.firstName) {
        toast.error(t('modHealthcareProfessionalSection.missingFirstName'))
        return
    }

    // Displays message for user if they haven't chosen a locale
    if (!nameLocaleInputs.locale || nameLocaleInputs.locale === Locale.Und) {
        toast.error(t('modHealthcareProfessionalSection.missingLocale'))
        return
    }

    // Check to make sure the input is valid for the Locale entered
    if (!validateNameLocaleMatchesLanguage(nameLocaleInputs)) {
        toast.error(t('modHealthcareProfessionalSection.charactersOfLanguageDoNotMatchNameLocale'))
        return
    }

    if (nameLocaleInputs.firstName
      && nameLocaleInputs.lastName
      && nameLocaleInputs.firstName.length
      && nameLocaleInputs.lastName.length
      && healthcareProfessionalsStore.healthcareProfessionalSectionFields.names) {
        healthcareProfessionalsStore.healthcareProfessionalSectionFields.names.push(localizedNameToAdd)
    }

    // Sets the chosen healthcare professional to undefined to reset
    handleCloseAddingNewLocalizedName()
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

    filteredItems.value = localesStore.getLocaleByNameInput(inputValue)
}

const facilitiesFieldsToDisplayCallback = (item: Facility) => [item.nameEn, item.nameJa]
const specialtiesToDisplayCallback = (specialty: Specialty) => [specialty]
const degreesToDisplayCallback = (degree: Degree) => [degree]
const insurancesToDisplayCallback = (insurance: Insurance) => [insurance]
const localesToDisplayCallback = (locale: Locale) => [localesStore.formatLanguageCodeToSimpleText(locale)]

onBeforeMount(async () => {
    if (!moderationScreenStore.editHealthcareProfessionalScreenIsActive()) {
        isHealthcareProfessionalInitialized.value = true
        return
    }
    loadingStore.setIsLoading(true)

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

    healthcareProfessionalsStore
        .setSelectedHealthcareProfessional(healthcareProfessionalsStore.selectedHealthcareProfessionalId)

    await nextTick()

    currentFacilityRelations.value = facilitiesStore.facilityData
        .filter(facility => healthcareProfessionalsStore.healthcareProfessionalSectionFields.facilityIds
            .includes(facility.id))
    //Sets the original values from the store based on the selected healthcare professional
    healthcareProfessionalSpokenLanguages.value
        = healthcareProfessionalsStore.healthcareProfessionalSectionFields.spokenLanguages
    healthcareProfessionalAcceptedInsurancesArray.value
        = healthcareProfessionalsStore.healthcareProfessionalSectionFields.acceptedInsurance
    healthcareProfessionalSpecialtiesArray.value
        = healthcareProfessionalsStore.healthcareProfessionalSectionFields.specialties
    healthcareProfessionalDegreesArray.value
        = healthcareProfessionalsStore.healthcareProfessionalSectionFields.degrees

    isHealthcareProfessionalInitialized.value = true

    loadingStore.setIsLoading(false)

    await nextTick()
})

//This autofills the selected fields based on our current healthcare data for the user
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
        selectedFacilities.value = []
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
}, { immediate: true, deep: true })

// This updates the array in the store once it is updated due to a facility clicked
watch(() => selectedFacilities.value, newValue => {
    if (newValue) {
        healthcareProfessionalsStore.selectedFacilities = selectedFacilities.value
    }
}, { immediate: true, deep: true })
</script>
