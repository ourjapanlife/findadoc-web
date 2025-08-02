<template>
    <Loader />
    <div v-if="isFacilitySectionInitialized">
        <div class="mod-facility-section">
            <h2 class="mb-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal">
                {{ t('modFacilitySection.facilityHeading') }}
            </h2>
            <div class="input-fields flex flex-col my-4">
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
                    :required="false"
                    :input-validation-check="validateWebsite"
                    :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityWebsite')"
                />

                <div
                    class="mod-facility-address-section"
                >
                    <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                        {{ t('modFacilitySection.addresses') }}
                    </span>
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
                    <div class="flex flex-col mt-4">
                        <label
                            for="mod-create-facility-section-prefecture-select-en"
                            class="mb-2 text-primary-text text-sm font-bold font-sans"
                        >
                            {{ t('modFacilitySection.labelFacilityPrefectureEn') }}
                        </label>
                        <select
                            id="mod-create-facility-section-prefecture-select-en"
                            v-model="facilityStore.createFacilityFields.contact.address.prefectureEn"
                            data-testid="mod-facility-section-prefectureEn"
                            name="prefecture-japan-en"
                            class="mb-5 px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                        >
                            <option
                                v-for="(prefecture, index) in listPrefectureJapanEn"
                                :key="index"
                            >
                                {{ prefecture }}
                            </option>
                        </select>
                    </div>
                    <ModInputField
                        v-model="facilityStore.createFacilityFields.contact.address.cityEn"
                        data-testid="mod-facility-section-cityEn"
                        :label="t('modFacilitySection.labelFacilityCityEn')"
                        type="text"
                        :placeholder="t('modFacilitySection.placeholderTextFacilityCityEn')"
                        :required="true"
                        :input-validation-check="validateCityEn"
                        :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityCityEn')"
                    />
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
                        v-model="facilityStore.createFacilityFields.contact.address.addressLine2En"
                        data-testid="mod-facility-section-addressLine2En"
                        :label="t('modFacilitySection.labelFacilityAddressLine2En')"
                        type="text"
                        :placeholder="t('modFacilitySection.placeholderTextFacilityAddressLine2En')"
                        :required="false"
                    />
                    <div class="flex flex-col mt-4">
                        <label
                            for="mod-create-facility-section-prefecture-select-ja"
                            class="mb-2 text-primary-text text-sm font-bold font-sans"
                        >
                            {{ t('modFacilitySection.labelFacilityPrefectureJa') }}
                        </label>
                        <select
                            id="mod-create-facility-section-prefecture-select-ja"
                            v-model="facilityStore.createFacilityFields.contact.address.prefectureJa"
                            data-testid="mod-facility-section-prefectureJa"
                            name="prefecture-japan-ja"
                            class="mb-5 px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                        >
                            <option
                                v-for="(prefecture, index) in listPrefectureJapanJa"
                                :key="index"
                            >
                                {{ prefecture }}
                            </option>
                        </select>
                    </div>
                    <ModInputField
                        v-model="facilityStore.createFacilityFields.contact.address.cityJa"
                        data-testid="mod-facility-section-cityJa"
                        :label="t('modFacilitySection.labelFacilityCityJa')"
                        type="text"
                        :placeholder="t('modFacilitySection.placeholderTextFacilityCityJa')"
                        :required="true"
                        :input-validation-check="validateCityJa"
                        :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityCityJa')"
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
                        v-model="facilityStore.createFacilityFields.contact.address.addressLine2Ja"
                        data-testid="mod-facility-section-addressLine2Ja"
                        :label="t('modFacilitySection.labelFacilityAddressLine2Ja')"
                        type="text"
                        :placeholder="t('modFacilitySection.placeholderTextFacilityAddressLine2Ja')"
                        :required="false"
                    />
                </div>
                <div
                    class="google-maps-section"
                >
                    <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                        {{ t('modFacilitySection.googleMapsInformation') }}
                    </span>
                    <ModInputField
                        v-model="facilityStore.createFacilityFields.contact.googleMapsUrl"
                        data-testid="mod-facility-section-google-maps"
                        :label="t('modFacilitySection.labelFacilityGoogleMapsUrl')"
                        type="url"
                        :placeholder="t('modFacilitySection.placeholderTextFacilityGoogleMapsUrl')"
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
                <div class="flex flex-col">
                    <span
                        v-if="moderationScreenStore.createFacilityScreenIsActive()"
                        class="mb-1 text-primary-text text-2xl font-bold font-sans leading-normal"
                    >
                        {{ t('modFacilitySection.addHealthcareProfessional') }}
                    </span>
                    <ModSearchBar
                        v-model="healthcareProfessionalsToAddToFacility"
                        data-testid="mod-facility-section-doctor-search"
                        :place-holder-text="t('modFacilitySection.placeholderTextHealthcareProfessionalSearchbar')"
                        :no-match-text="t('modFacilitySection.noHealthcareProfessionalFound')"
                        :fields-to-display-callback="healthcareProfessionalsToDisplayCallback"
                        :default-suggestions="defaultHealthcareProfessionalSuggestions"
                        @search-input-change="handleHealthcareProfessionalsInputChange"
                    />
                    <span
                        v-show="!healthcareProfessionalsToAddToFacility.length"
                        class="font-semibold my-3"
                    >- {{ t('modFacilitySection.noHPSelected') }}
                    </span>
                    <div
                        v-for="(healthcareProfessional, index) in healthcareProfessionalsToAddToFacility"
                        :key="`${healthcareProfessional.id}-${index}`"
                    >
                        <ModDashboardHealthProfessionalCard
                            :data-testid="`healthcare-professional-card-${index}`"
                            :healthcare-professional="healthcareProfessional"
                            :healthcare-professionals-related-to-facility="healthcareProfessionalsRelatedToFacility"
                            :show-trash-can="false"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, onBeforeMount, nextTick } from 'vue'
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
    validateCityEn,
    validateEmail,
    validateFloat,
    validatePostalCode,
    validateWebsite,
    validateCityJa
} from '~/utils/formValidations'
import type { HealthcareProfessional } from '~/typedefs/gqlTypes'
import { listPrefectureJapanEn, listPrefectureJapanJa } from '~/stores/locationsStore'

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
const healthcareProfessionalsToAddToFacility: Ref<HealthcareProfessional[]> = ref([])

const defaultHealthcareProfessionalSuggestions: Ref<HealthcareProfessional[]> = ref([])

const handleHealthcareProfessionalsInputChange = (filteredItems: Ref<HealthcareProfessional[]>, inputValue: string) => {
    const input = inputValue.toLowerCase().trim()

    filteredItems.value = healthcareProfessionalsStore.healthcareProfessionalsData.filter(
        (healthcareProfessional: HealthcareProfessional) => {
            const idMatches = healthcareProfessional.id.toLowerCase().startsWith(input)
            const nameMatches = healthcareProfessional.names.some(name => {
                const firstNameMatch = name.firstName.toLowerCase().includes(input)
                const middleNameMatch = name.middleName?.toLowerCase().includes(input)
                const lastNameMatch = name.lastName.toLowerCase().includes(input)
                return firstNameMatch || middleNameMatch || lastNameMatch
            })
            return idMatches || nameMatches
        }
    )
}
const healthcareProfessionalsToDisplayCallback = (healthcareProfessional: HealthcareProfessional) =>
    [healthcareProfessional.names[0].firstName + ' ' + healthcareProfessional.names[0].lastName]

onBeforeMount(async () => {
    isFacilitySectionInitialized.value = false

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

// This makes sure a chosen healthcare professional gets added to the facility if the facility entry is created
watch(healthcareProfessionalsToAddToFacility.value, newValue => {
    if (newValue) {
        facilityStore.createFacilityFields.healthcareProfessionalIds
        = healthcareProfessionalsToAddToFacility.value.map(healthcareProfessional => healthcareProfessional.id)
    }
}, { deep: true })
</script>
