<template>
    <div class="mod-sheet">
        <ModFormKind
            kind="healthcare"
            :label="t('modDashboardLeftNav.healthcareProfessionals')"
        />
        <ModAccordion
            tone="healthcare"
            class="mod-healthcare-professional-section"
            :title="t('modHealthcareProfessionalSection.healthcareProfessionalNameHeading')"
        >
            <div class="input-fields flex flex-col gap-3">
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
                            'name-locale-input-fields mod-form-grid rounded-lg border border-accent-bg bg-secondary-bg p-4',
                            editingLocaleName ? 'rounded-b-none border-b-0' : '',
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
                        <div class="mod-span-2">
                            <label
                                for="mod-create-healthcare-professional-section-name-locales"
                                class="field-label"
                            >
                                {{ t('modHealthcareProfessionalSection.labelHealthcareProfessionalNameLocale') }}
                            </label>
                            <select
                                id="mod-create-healthcare-professional-section-name-locales"
                                v-model="nameLocaleInputs.locale"
                                data-testid="mod-healthcare-professional-section-name-locale"
                                name="name-locales"
                                class="field"
                            >
                                <option
                                    v-for="(locale, index) in Locale"
                                    :key="`${locale}-${index}`"
                                    :value="locale"
                                >
                                    {{ localesStore.formatLanguageCodeToSimpleText(locale) }}
                                </option>
                            </select>
                            <div
                                v-show="addingLocaleName"
                                class="flex gap-2"
                            >
                                <button
                                    class="btn btn-primary btn-sm"
                                    data-testid="mod-healthcare-professional-section-save-name"
                                    type="button"
                                    @click="handleAddLocalizedName"
                                >
                                    {{ t('modHealthcareProfessionalSection.save') }}
                                </button>
                                <button
                                    class="btn btn-sm bg-error text-primary-text-inverted"
                                    data-testid="mod-healthcare-professional-section-close-name-section"
                                    type="button"
                                    @click="handleCloseAddingNewLocalizedName"
                                >
                                    {{ t('modHealthcareProfessionalSection.exit') }}
                                </button>
                            </div>
                            <div
                                v-show="editingLocaleName"
                                class="flex gap-2"
                            >
                                <button
                                    class="btn btn-primary btn-sm"
                                    type="button"
                                    @click="handleUpdateExistingName"
                                >
                                    {{ t('modHealthcareProfessionalSection.update') }}
                                </button>
                                <button
                                    class="btn btn-sm bg-error text-primary-text-inverted"
                                    type="button"
                                    @click="handleDeleteExistingName"
                                >
                                    {{ t('modHealthcareProfessionalSection.delete') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>
                <div
                    v-if="healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.names"
                    class="grid gap-3"
                >
                    <div
                        v-for="(nameLocale, index) in healthcareProfessionalsStore
                            .createHealthcareProfessionalSectionFields.names"
                        :key="`${nameLocale.firstName}-${nameLocale.lastName}-${index}`"
                        role="button"
                        tabindex="0"
                        @click="() => setChosenLocaleNameInput(index)"
                        @keydown.enter="() => setChosenLocaleNameInput(index)"
                        @keydown.space.prevent="() => setChosenLocaleNameInput(index)"
                    >
                        <ModDashboardHealthProfessionalCard
                            :healthcare-professional="{} as HealthcareProfessional"
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
                    class="btn btn-primary btn-sm"
                    @click="handleOpenAddNewNameWithReset"
                >
                    {{ t('modHealthcareProfessionalSection.addHealthCareProfessionalLocaleName') }}
                </button>
            </div>
        </ModAccordion>
        <ModAccordion
            tone="healthcare"
            :title="t('modHealthcareProfessionalSection.healthcareProfessionalMedicalInfoHeading')"
        >
            <div class="mod-form-grid">
                <div class="mod-picker">
                    <label
                        for="accepted-insurances"
                        class="field-label"
                    >
                        {{ t("modHealthcareProfessionalSection.selectInsurances") }}
                    </label>
                    <ModSearchBar
                        v-if="createHealthcareProfessionalSectionFields.acceptedInsurance"
                        v-model="createHealthcareProfessionalSectionFields.acceptedInsurance"
                        data-testid="mod-healthcare-professional-section-accepted-insurances"
                        :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextAcceptedInsurances')"
                        :no-match-text="t('modHealthcareProfessionalSection.noInsurancesWereFound')"
                        :fields-to-display-callback="insurancesToDisplayCallback"
                        :default-suggestions="Object.values(Insurance)"
                        @search-input-change="handleInsuranceInputChange"
                    />
                    <ModTokenList :labels="tokenLabels(createHealthcareProfessionalSectionFields.acceptedInsurance)" />
                </div>
                <div class="mod-picker">
                    <label
                        for="degrees"
                        class="field-label"
                    >
                        {{ t("modHealthcareProfessionalSection.selectDegrees") }}
                    </label>
                    <ModSearchBar
                        v-if="createHealthcareProfessionalSectionFields.degrees"
                        v-model="createHealthcareProfessionalSectionFields.degrees"
                        data-testid="mod-healthcare-professional-section-degrees"
                        :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextDegrees')"
                        :no-match-text="t('modHealthcareProfessionalSection.noDegreesWereFound')"
                        :fields-to-display-callback="degreesToDisplayCallback"
                        :default-suggestions="Object.values(Degree)"
                        @search-input-change="handleDegreeInputChange"
                    />
                    <ModTokenList :labels="tokenLabels(createHealthcareProfessionalSectionFields.degrees)" />
                </div>
                <div class="mod-picker">
                    <label
                        for="specialties"
                        class="field-label"
                    >
                        {{ t("modHealthcareProfessionalSection.selectSpecialties") }}
                    </label>
                    <ModSearchBar
                        v-if="createHealthcareProfessionalSectionFields.specialties"
                        v-model="createHealthcareProfessionalSectionFields.specialties"
                        data-testid="mod-healthcare-professional-section-specialties"
                        :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextSpecialties')"
                        :no-match-text="t('modHealthcareProfessionalSection.noSpecialtiesWereFound')"
                        :fields-to-display-callback="specialtiesToDisplayCallback"
                        :default-suggestions="Object.values(Specialty)"
                        @search-input-change="handleSpecialtyInputChange"
                    />
                    <ModTokenList :labels="tokenLabels(createHealthcareProfessionalSectionFields.specialties)" />
                </div>
                <div class="mod-picker">
                    <label
                        for="locales"
                        class="field-label"
                    >
                        {{ t("modHealthcareProfessionalSection.selectLocales") }}
                    </label>
                    <ModSearchBar
                        v-if="createHealthcareProfessionalSectionFields.spokenLanguages"
                        v-model="createHealthcareProfessionalSectionFields.spokenLanguages"
                        data-testid="mod-healthcare-professional-section-spoken-locales"
                        :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextLocales')"
                        :no-match-text="t('modHealthcareProfessionalSection.noLocalesWereFound')"
                        :fields-to-display-callback="localesToDisplayCallback"
                        :default-suggestions="Object.values(Locale)"
                        @search-input-change="handleLocaleInputChange"
                    />
                    <ModTokenList :labels="spokenLanguageLabels" />
                </div>
                <NoteInputField
                    v-model="createHealthcareProfessionalSectionFields.additionalInfoForPatients!"
                    class="mod-span-2"
                    :label="t('modHealthcareProfessionalSection.labelAdditionalNotesForPatients')"
                    :placeholder="t('modHealthcareProfessionalSection.placeholderAdditionalNotesForPatients')"
                    :required="false"
                />
            </div>
        </ModAccordion>
        <ModAccordion
            tone="healthcare"
            :title="t('modHealthcareProfessionalSection.facilities')"
        >
            <ModSearchBar
                v-model="selectedFacilitiesModel"
                data-testid="mod-healthcare-professional-section-facilities"
                :place-holder-text="t('modHealthcareProfessionalSection.placeholderTextFacilitySearchBar')"
                :no-match-text="t('modHealthcareProfessionalSection.noFacilitiesWereFound')"
                :fields-to-display-callback="facilitiesFieldsToDisplayCallback"
                :default-suggestions="currentFacilities"
                @search-input-change="handleFacilitySearchInputChange"
            />
            <ModTokenList :labels="selectedFacilityLabels" />
        </ModAccordion>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, type Ref, ref } from 'vue'
import { useAppToast } from '~/composables/useAppToast'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useLocaleStore } from '~/stores/localeStore'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'
import { Insurance,
    Locale,
    Degree,
    Specialty,
    type LocalizedNameInput,
    type Facility,
    type HealthcareProfessional } from '~/typedefs/gqlTypes'
import { useI18n } from '#imports'
import { filterByCaseInsensitiveIncludes, matchesFacilitySearch } from '~/utils/moderationSearchUtils'

const toast = useAppToast()

const { t } = useI18n()

const loadingStore = useLoadingStore()
loadingStore.setIsLoading(true)

const moderationScreenStore = useModerationScreenStore()
const localesStore = useLocaleStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const facilitiesStore = useFacilitiesStore()
await facilitiesStore.getFacilities() // Fix a bug where facilities disappear after the user refreshes the page
const currentFacilities = facilitiesStore.facilityData

const selectedFacilities: Ref<Facility[]> = ref([])
const selectedFacilitiesModel = computed({
    get: () => selectedFacilities.value,
    set: (newValue: Facility[]) => {
        selectedFacilities.value = newValue
        createHealthcareProfessionalSectionFields.facilityIds = newValue.length
            ? newValue.map(facility => facility.id)
            : []
    }
})

const createHealthcareProfessionalSectionFields = healthcareProfessionalsStore.createHealthcareProfessionalSectionFields
const tokenLabels = (values: readonly unknown[] | null | undefined) =>
    (values ?? []).map(item => String(item))
const spokenLanguageLabels = computed(() =>
    (createHealthcareProfessionalSectionFields.spokenLanguages ?? [])
        .map(locale => localesStore.formatLanguageCodeToSimpleText(locale)))
const selectedFacilityLabels = computed(() =>
    selectedFacilities.value.map(facility =>
        [facility.nameEn, facility.nameJa].filter(Boolean).join(' · ')))

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
// This keeps track of the original locale of the name being edited for validation
const originalNameLocale: Ref<Locale> = ref(Locale.Und)

// Sets the locale being edited name value
const setEditingLocaleName = async (newValue: boolean) => {
    // This allows the dom to change so the position of the name locale is correct before trying to edit
    await nextTick()
    editingLocaleName.value = newValue
    // Makes sure both values cannot be true
    addingLocaleName.value = false
}

// Closes the locale being added name inputs
const handleCloseAddingNewLocalizedName = () => {
    // Allows for the inputs to completely transition before resetting the fields
    setTimeout(resetNameLocaleInputs, 300)
    addingLocaleName.value = false
    // Makes sure both values cannot be true
    editingLocaleName.value = false
}

// Opens the locale being added name inputs
const handleOpenAddNewNameWithReset = () => {
    // Allows for the inputs to completely transition before resetting the fields
    resetNameLocaleInputs()
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
    originalNameLocale.value = localizedNameInput.locale
}

//This will set the name that needs to be autofilled and move it to the zero index
const setChosenLocaleNameInput = (index: number) => {
    chosenLocaleIndex.value = index

    const namesList = healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.names
    //This will keep track of the healthcare professional to not lose it but we can swap it later with the chosen one
    const tempToHoldZeroIndexedHealthcareProfessionalToSwap = namesList[0]

    //This finds the chosen healthcare professional to edit
    const foundName = namesList.find((_, idx) => idx === index)
    chosenHealthcareProfessionalToEdit.value = foundName

    if (foundName && tempToHoldZeroIndexedHealthcareProfessionalToSwap) {
        namesList[0] = foundName
        // Put the temp one in the index where the old locale name was
        namesList[index] = tempToHoldZeroIndexedHealthcareProfessionalToSwap

        //Autofill with the chosen healthcare professional locale name
        autofillNameLocaleInputWithChosenHealthcareProfessional(foundName)
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
    const existingNameForLocale = healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.names
        .filter(name => name.locale !== originalNameLocale.value)
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
        healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.names[0] = localizedNameToAdd
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
    // Remove the first element safely since we reordered the one for deletion at 0
    if (moderationScreenStore.createHealthcareProfessionalScreenIsActive()) {
        healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.names.shift()
    }
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
    const existingNameForLocale = checkIfHealthcareProfessionalHasAnExistingNameForLocale()

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

    const checkValidityOfNameInputs
        = nameLocaleInputs.firstName
          && nameLocaleInputs.lastName
          && nameLocaleInputs.firstName.length
          && nameLocaleInputs.lastName.length

    if (checkValidityOfNameInputs
      && healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.names
      && moderationScreenStore.createHealthcareProfessionalScreenIsActive()) {
        healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.names.push(localizedNameToAdd)
    }

    // Sets the chosen healthcare professional to undefined to reset
    handleCloseAddingNewLocalizedName()
}

function checkIfHealthcareProfessionalHasAnExistingNameForLocale() {
    return healthcareProfessionalsStore.createHealthcareProfessionalSectionFields.names
        .find(name => name.locale === nameLocaleInputs.locale)
}

const handleFacilitySearchInputChange = (filteredItems: Ref<Facility[]>, inputValue: string) => {
    filteredItems.value = currentFacilities.filter(facility => matchesFacilitySearch(facility, inputValue))
}

const handleInsuranceInputChange = (filteredItems: Ref<Insurance[]>, inputValue: string) => {
    const arrayOfInsurances = Object.values(Insurance) as Insurance[]
    filteredItems.value = filterByCaseInsensitiveIncludes(arrayOfInsurances, inputValue)
}

const handleDegreeInputChange = (filteredItems: Ref<Degree[]>, inputValue: string) => {
    const degree = Object.values(Degree) as Degree[]
    filteredItems.value = filterByCaseInsensitiveIncludes(degree, inputValue)
}

const handleSpecialtyInputChange = (filteredItems: Ref<Specialty[]>, inputValue: string) => {
    const arrayOfSpecialties = Object.values(Specialty) as Specialty[]
    filteredItems.value = filterByCaseInsensitiveIncludes(arrayOfSpecialties, inputValue)
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
</script>
