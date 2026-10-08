<template>
    <Loader />
    <div
        v-if="isFacilitySectionInitialized"
        class="mod-sheet"
    >
        <ModFormKind
            kind="facility"
            :label="t('modFacilitySection.facilityHeading')"
        />
        <ModAccordion
            tone="facility"
            class="mod-facility-section"
            :title="t('modFacilitySection.contactInformation')"
        >
            <div class="mod-form-grid">
                <ModInputField
                    v-model="facilityStore.createFacilityFields.nameEn"
                    data-testid="mod-facility-section-nameEn"
                    :label="t('modFacilitySection.labelFacilityNameEn')"
                    type="text"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityNameEn')"
                    :required="true"
                    :input-validation-check="validateNameEn"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityNameEn')"
                />
                <ModInputField
                    v-model="facilityStore.createFacilityFields.nameJa"
                    data-testid="mod-facility-section-nameJa"
                    :label="t('modFacilitySection.labelFacilityNameJa')"
                    type="text"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityNameJa')"
                    :required="true"
                    :input-validation-check="validateNameJa"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityNameJa')"
                />
                <ModInputField
                    v-model="facilityStore.createFacilityFields.contact.phone"
                    data-testid="mod-facility-section-phone"
                    :label="t('modFacilitySection.labelFacilityPhoneNumber')"
                    type="text"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityPhoneNumber')"
                    :required="true"
                    :input-validation-check="validatePhoneNumber"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityPhoneNumber')"
                />
                <ModInputField
                    v-model="facilityStore.createFacilityFields.contact.email"
                    data-testid="mod-facility-section-email"
                    :label="t('modFacilitySection.labelFacilityEmail')"
                    type="email"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityEmail')"
                    :required="false"
                    :input-validation-check="validateEmail"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityEmail')"
                />
                <ModInputField
                    v-model="facilityStore.createFacilityFields.contact.website"
                    data-testid="mod-facility-section-website"
                    :label="t('modFacilitySection.labelFacilityWebsite')"
                    type="url"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityWebsite')"
                    class="mod-span-2"
                    :required="false"
                    :input-validation-check="validateWebsite"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityWebsite')"
                />
            </div>
        </ModAccordion>
        <ModAccordion
            tone="facility"
            class="mod-facility-address-section"
            :title="t('modFacilitySection.addresses')"
        >
            <ModInputField
                v-model="facilityStore.createFacilityFields.contact.address.postalCode"
                data-testid="mod-facility-section-postalCode"
                :label="t('modFacilitySection.labelFacilityPostalCode')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityPostalCode')"
                :required="true"
                :input-validation-check="validatePostalCode"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityPostalCode')"
            />
            <p
                v-if="isPrefectureNameMismatch"
                class="mb-2 font-sans text-xs text-error"
            >
                {{ t('modFacilitySection.inputErrorMessagePrefectureMismatch') }}
            </p>
            <div class="mod-form-grid">
                <div class="min-w-0">
                    <label
                        for="mod-create-facility-section-prefecture-select-en"
                        class="field-label"
                    >
                        {{ t('modFacilitySection.labelFacilityPrefectureEn') }}
                    </label>
                    <select
                        id="mod-create-facility-section-prefecture-select-en"
                        v-model="facilityStore.createFacilityFields.contact.address.prefectureEn"
                        data-testid="mod-facility-section-prefectureEn"
                        name="prefecture-japan-en"
                        class="field"
                        @change="onCreatePrefectureEn"
                    >
                        <option
                            v-for="(prefecture, index) in listPrefectureJapanEn"
                            :key="index"
                        >
                            {{ prefecture }}
                        </option>
                    </select>
                </div>
                <div class="min-w-0">
                    <label
                        for="mod-create-facility-section-prefecture-select-ja"
                        class="field-label"
                    >
                        {{ t('modFacilitySection.labelFacilityPrefectureJa') }}
                    </label>
                    <select
                        id="mod-create-facility-section-prefecture-select-ja"
                        v-model="facilityStore.createFacilityFields.contact.address.prefectureJa"
                        data-testid="mod-facility-section-prefectureJa"
                        name="prefecture-japan-ja"
                        class="field"
                        @change="onCreatePrefectureJa"
                    >
                        <option
                            v-for="(prefecture, index) in listPrefectureJapanJa"
                            :key="index"
                        >
                            {{ prefecture }}
                        </option>
                    </select>
                </div>
            </div>
            <ModCitySuggest
                id="mod-create-facility-city-suggest"
                class="mt-4"
                test-id="mod-facility-city-suggest"
                @select="applySuggestedCreateCity"
            />
            <div class="mod-form-grid mt-4 items-end">
                <ModCityPicker
                    id="mod-create-facility-section-city"
                    :label="t('modFacilitySection.labelFacilityCityEn')"
                    :prefecture-en="facilityStore.createFacilityFields.contact.address.prefectureEn"
                    :city-id="facilityStore.createFacilityFields.cityId"
                    test-id="mod-facility-section-cityEn"
                    required
                    @select="applyCreateCity"
                />
                <div
                    v-if="facilityStore.createFacilityFields.contact.address.cityJa"
                    class="min-w-0"
                >
                    <span class="field-label">
                        {{ t('modFacilitySection.labelFacilityCityJa') }}
                    </span>
                    <p
                        data-testid="mod-facility-section-cityJa"
                        class="chip"
                    >
                        {{ facilityStore.createFacilityFields.contact.address.cityJa }}
                    </p>
                </div>
            </div>
            <div class="mod-form-grid">
                <ModInputField
                    v-model="facilityStore.createFacilityFields.contact.address.addressLine1En"
                    data-testid="mod-facility-section-addressLine1En"
                    :label="t('modFacilitySection.labelFacilityAddressLine1En')"
                    type="text"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityAddressLine1En')"
                    :required="true"
                    :input-validation-check="validateAddressLineEn"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityAddressLine1En')"
                />
                <ModInputField
                    v-model="facilityStore.createFacilityFields.contact.address.addressLine1Ja"
                    data-testid="mod-facility-section-addressLine1Ja"
                    :label="t('modFacilitySection.labelFacilityAddressLine1Ja')"
                    type="text"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityAddressLine1Ja')"
                    :required="true"
                    :input-validation-check="validateAddressLineJa"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityAddressLine1Ja')"
                />
                <ModInputField
                    v-model="facilityStore.createFacilityFields.contact.address.addressLine2En"
                    data-testid="mod-facility-section-addressLine2En"
                    :label="t('modFacilitySection.labelFacilityAddressLine2En')"
                    type="text"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityAddressLine2En')"
                    :required="false"
                />
                <ModInputField
                    v-model="facilityStore.createFacilityFields.contact.address.addressLine2Ja"
                    data-testid="mod-facility-section-addressLine2Ja"
                    :label="t('modFacilitySection.labelFacilityAddressLine2Ja')"
                    type="text"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityAddressLine2Ja')"
                    :required="false"
                />
            </div>
        </ModAccordion>
        <ModAccordion
            tone="facility"
            class="google-maps-section"
            :title="t('modFacilitySection.googleMapsInformation')"
        >
            <div class="mod-form-grid">
                <ModInputField
                    v-model="facilityStore.createFacilityFields.contact.googleMapsUrl"
                    data-testid="mod-facility-section-google-maps"
                    :label="t('modFacilitySection.labelFacilityGoogleMapsUrl')"
                    type="url"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityGoogleMapsUrl')"
                    class="mod-span-2"
                    :required="true"
                    :input-validation-check="validateGoogleMapsUrlInput"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityGoogleMapsUrl')"
                    :autofill="facilityStore.facilitySectionFields.googlemapsURL"
                />
                <ModInputField
                    v-model="facilityStore.createFacilityFields.mapLatitude"
                    data-testid="mod-facility-section-mapLatitude"
                    :label="t('modFacilitySection.labelFacilityMapLatitude')"
                    type="text"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityMapLatitude')"
                    :required="true"
                    :input-validation-check="validateFloat"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityMapLatitude')"
                />
                <ModInputField
                    v-model="facilityStore.createFacilityFields.mapLongitude"
                    data-testid="mod-facility-section-mapLongitude"
                    :label="t('modFacilitySection.labelFacilityMapLongitude')"
                    type="text"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityMapLongitude')"
                    :required="true"
                    :input-validation-check="validateFloat"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityMapLongitude')"
                />
            </div>
        </ModAccordion>
        <ModAccordion
            v-if="moderationScreenStore.createFacilityScreenIsActive()"
            tone="facility"
            :title="t('modFacilitySection.addHealthcareProfessional')"
        >
            <ModSearchBar
                v-model="selectedHealthcareProfessionalsModel"
                data-testid="mod-facility-section-doctor-search"
                :place-holder-text="t('modFacilitySection.placeholderTextHealthcareProfessionalSearchbar')"
                :no-match-text="t('modFacilitySection.noHealthcareProfessionalFound')"
                :fields-to-display-callback="healthcareProfessionalsToDisplayCallback"
                :default-suggestions="defaultHealthcareProfessionalSuggestions"
                @search-input-change="handleHealthcareProfessionalsInputChange"
            />
            <p
                v-show="!selectedHealthcareProfessionals.length"
                class="mt-3 text-sm text-primary-text-muted"
            >
                {{ t('modFacilitySection.noHPSelected') }}
            </p>
            <div
                v-for="(healthcareProfessional, index) in selectedHealthcareProfessionals"
                :key="`${healthcareProfessional.id}-${index}`"
            >
                <ModDashboardHealthProfessionalCard
                    :data-testid="`healthcare-professional-card-${index}`"
                    :healthcare-professional="healthcareProfessional"
                    :healthcare-professionals-related-to-facility="healthcareProfessionalsRelatedToFacility"
                    :show-trash-can="false"
                />
            </div>
        </ModAccordion>
    </div>
</template>

<script lang="ts" setup>
import { computed, type Ref, ref, onBeforeMount, nextTick } from 'vue'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useLoadingStore } from '~/stores/loadingStore'
import {
    validateAddressLineEn,
    validateAddressLineJa,
    validateNameEn,
    validateNameJa,
    validatePhoneNumber,
    validateEmail,
    validateFloat,
    validatePostalCode,
    validateWebsite
} from '~/utils/formValidations'
import type { HealthcareProfessional } from '~/typedefs/gqlTypes'
import type { CityOption } from '~/utils/cityOptions'
import { listPrefectureJapanEn, listPrefectureJapanJa, pairedPrefectureEn, pairedPrefectureJa } from '~/stores/locationsStore'
import { checkPrefectureNameMatch } from '~/utils/facilitiesUtils'
import { matchesHealthcareProfessionalSearch } from '~/utils/moderationSearchUtils'
import { formatFirstLocalizedFullName } from '~/utils/nameUtils'

const { t } = useI18n()

const loadingStore = useLoadingStore()
loadingStore.setIsLoading(true)

const moderationScreenStore = useModerationScreenStore()
const facilityStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()

const isFacilitySectionInitialized: Ref<boolean> = ref(false)
const healthcareProfessionalsRelatedToFacility: Ref<string[]>
    = ref([])

// This keeps track of the existing healthcare professionals we are adding to the new facility
const selectedHealthcareProfessionals: Ref<HealthcareProfessional[]> = ref([])
const selectedHealthcareProfessionalsModel = computed({
    get: () => selectedHealthcareProfessionals.value,
    set: (newValue: HealthcareProfessional[]) => {
        selectedHealthcareProfessionals.value = newValue
        facilityStore.createFacilityFields.healthcareProfessionalIds
            = newValue.map(healthcareProfessional => healthcareProfessional.id)
    }
})

const defaultHealthcareProfessionalSuggestions: Ref<HealthcareProfessional[]> = ref([])

const handleHealthcareProfessionalsInputChange = (filteredItems: Ref<HealthcareProfessional[]>, inputValue: string) => {
    filteredItems.value = healthcareProfessionalsStore.healthcareProfessionalsData.filter(
        (healthcareProfessional: HealthcareProfessional) =>
            matchesHealthcareProfessionalSearch(healthcareProfessional, inputValue)
    )
}
const healthcareProfessionalsToDisplayCallback = (healthcareProfessional: HealthcareProfessional) =>
    [formatFirstLocalizedFullName(healthcareProfessional.names)]

const isPrefectureNameMismatch = computed(() => !checkPrefectureNameMatch({
    prefectureEn: facilityStore.createFacilityFields.contact.address.prefectureEn,
    prefectureJa: facilityStore.createFacilityFields.contact.address.prefectureJa
}))

const onCreatePrefectureEn = () => {
    const address = facilityStore.createFacilityFields.contact.address
    const prefectureJa = pairedPrefectureJa(address.prefectureEn)
    if (prefectureJa) address.prefectureJa = prefectureJa
    clearCreateCity()
}

const onCreatePrefectureJa = () => {
    const address = facilityStore.createFacilityFields.contact.address
    const prefectureEn = pairedPrefectureEn(address.prefectureJa)
    if (prefectureEn) address.prefectureEn = prefectureEn
    clearCreateCity()
}

function clearCreateCity() {
    if (!isFacilitySectionInitialized.value) return

    facilityStore.createFacilityFields.cityId = ''
    facilityStore.createFacilityFields.contact.address.cityEn = ''
    facilityStore.createFacilityFields.contact.address.cityJa = ''
}

function applySuggestedCreateCity(city: (CityOption & { prefectureJa: string }) | null) {
    const address = facilityStore.createFacilityFields.contact.address
    if (!city) {
        applyCreateCity(null)
        return
    }

    address.prefectureEn = city.prefectureEn
    address.prefectureJa = city.prefectureJa
    applyCreateCity(city)
}

function applyCreateCity(city: CityOption | null) {
    const fields = facilityStore.createFacilityFields
    fields.cityId = city?.id ?? ''
    if (!city) {
        fields.contact.address.cityEn = ''
        fields.contact.address.cityJa = ''
        return
    }

    fields.contact.address.cityEn = city.nameEn
    fields.contact.address.cityJa = city.nameJa
}

onBeforeMount(async () => {
    isFacilitySectionInitialized.value = false

    const address = facilityStore.createFacilityFields.contact.address
    const prefectureJa = pairedPrefectureJa(address.prefectureEn)
    if (prefectureJa) address.prefectureJa = prefectureJa

    // Wait for the route to be fully resolved
    await nextTick()

    // Set the active screen and ensure the UI state is consistent
    moderationScreenStore.setActiveScreen(ModerationScreen.CreateFacility)

    // Fetch data first if not loaded yet
    if (!healthcareProfessionalsStore.healthcareProfessionalsData) {
        await healthcareProfessionalsStore.getHealthcareProfessionals()
    }

    defaultHealthcareProfessionalSuggestions.value = healthcareProfessionalsStore.healthcareProfessionalsData

    // Ensure UI updates are reflected with the autofill values
    await nextTick()
    isFacilitySectionInitialized.value = true
    loadingStore.setIsLoading(false)

    // Ensure UI updates are reflected
    await nextTick()
})
</script>
