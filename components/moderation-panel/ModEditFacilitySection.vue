<template>
    <Loader v-if="moderationScreenStore.editFacilityScreenIsActive()" />
    <div v-if="isFacilitySectionInitialized">
        <div
            class="mod-facility-section"
        >
            <h1
                v-if="moderationScreenStore.editFacilityScreenIsActive()"
                class="mb-3.5 text-start text-primary-text text-3xl font-bold font-sans leading-normal"
            >
                {{ t('modFacilitySection.facilityHeading') }}
            </h1>
            <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                {{ t('modFacilitySection.contactInformation') }}
            </span>
            <ModInputField
                v-model="facilityStore.facilitySectionFields.nameEn"
                data-testid="mod-facility-section-nameEn"
                :label="t('modFacilitySection.labelFacilityNameEn')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityNameEn')"
                :required="true"
                :input-validation-check="validateNameEn"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityNameEn')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.nameJa"
                data-testid="mod-facility-section-nameJa"
                :label="t('modFacilitySection.labelFacilityNameJa')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityNameJa')"
                :required="true"
                :input-validation-check="validateNameJa"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityNameJa')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.phone"
                data-testid="mod-facility-section-phone"
                :label="t('modFacilitySection.labelFacilityPhoneNumber')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityPhoneNumber')"
                :required="true"
                :input-validation-check="validatePhoneNumber"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityPhoneNumber')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.email"
                data-testid="mod-facility-section-email"
                :label="t('modFacilitySection.labelFacilityEmail')"
                type="email"
                :placeholder="t('modFacilitySection.placeholderTextFacilityEmail')"
                :required="false"
                :input-validation-check="validateEmail"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityEmail')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.website"
                data-testid="mod-facility-section-website"
                :label="t('modFacilitySection.labelFacilityWebsite')"
                type="url"
                :placeholder="t('modFacilitySection.placeholderTextFacilityWebsite')"
                :required="false"
                :input-validation-check="validateWebsite"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityWebsite')"
            />
        </div>
        <div
            class="mod-facility-address-section"
        >
            <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                {{ t('modFacilitySection.addresses') }}
            </span>
            <ModInputField
                v-model="facilityStore.facilitySectionFields.postalCode"
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
                    for="mod-edit-facility-section-prefecture-select-en"
                    class="mb-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ t('modFacilitySection.labelFacilityPrefectureEn') }}
                </label>
                <select
                    id="mod-edit-facility-section-prefecture-select-en"
                    v-model="facilityStore.facilitySectionFields.prefectureEn"
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
                v-model="facilityStore.facilitySectionFields.cityEn"
                data-testid="mod-facility-section-cityEn"
                :label="t('modFacilitySection.labelFacilityCityEn')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityCityEn')"
                :required="true"
                :input-validation-check="validateCityEn"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityCityEn')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.addressLine1En"
                data-testid="mod-facility-section-addressLine1En"
                :label="t('modFacilitySection.labelFacilityAddressLine1En')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityAddressLine1En')"
                :required="true"
                :input-validation-check="validateAddressLineEn"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityAddressLine1En')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.addressLine2En"
                data-testid="mod-facility-section-addressLine2En"
                :label="t('modFacilitySection.labelFacilityAddressLine2En')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityAddressLine2En')"
                :required="false"
            />
            <div class="flex flex-col mt-4">
                <label
                    for="mod-edit-facility-section-prefecture-select-ja"
                    class="mb-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ t('modFacilitySection.labelFacilityPrefectureJa') }}
                </label>
                <select
                    id="mod-edit-facility-section-prefecture-select-ja"
                    v-model="facilityStore.facilitySectionFields.prefectureJa"
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
                v-model="facilityStore.facilitySectionFields.cityJa"
                data-testid="mod-facility-section-cityJa"
                :label="t('modFacilitySection.labelFacilityCityJa')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityCityJa')"
                :required="true"
                :input-validation-check="validateCityJa"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityCityJa')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.addressLine1Ja"
                data-testid="mod-facility-section-addressLine1Ja"
                :label="t('modFacilitySection.labelFacilityAddressLine1Ja')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityAddressLine1Ja')"
                :required="true"
                :input-validation-check="validateAddressLineJa"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityAddressLine1Ja')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.addressLine2Ja"
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
                v-model="facilityStore.facilitySectionFields.googlemapsURL"
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
                v-model="facilityStore.facilitySectionFields.mapLatitude"
                data-testid="mod-facility-section-mapLatitude"
                :label="t('modFacilitySection.labelFacilityMapLatitude')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityMapLatitude')"
                :required="true"
                :input-validation-check="validateFloat"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityMapLatitude')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.mapLongitude"
                data-testid="mod-facility-section-mapLongitude"
                :label="t('modFacilitySection.labelFacilityMapLongitude')"
                type="text"
                :placeholder="t('modFacilitySection.placeholderTextFacilityMapLongitude')"
                :required="true"
                :input-validation-check="validateFloat"
                :invalid-input-error-message="t('modFacilitySection.inputErrorMessageFacilityMapLongitude')"
            />
        </div>
        <div
            v-if="moderationScreenStore.editFacilityScreenIsActive()"
            class="flex flex-col"
        >
            <span
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
    <div
        v-if="moderationScreenStore.editFacilityScreenIsActive()"
    >
        <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
            {{ t('modFacilitySection.existingHPHeading') }}
        </span>
        <div
            v-for="(healthcareProfessional, index) in healthcareProfessionalRelatedToFacilityFiltered"
            :key="`${healthcareProfessional.id}-${index}`"
        >
            <ModDashboardHealthProfessionalCard
                :healthcare-professional="healthcareProfessional"
                :healthcare-professionals-related-to-facility="healthcareProfessionalsRelatedToFacility"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, onBeforeMount, nextTick, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute } from 'vue-router'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useI18n } from '#imports'
import { validateAddressLineEn,
    validateAddressLineJa,
    validateNameEn,
    validateNameJa,
    validatePhoneNumber,
    validateCityEn,
    validateEmail,
    validateFloat,
    validatePostalCode,
    validateWebsite,
    validateCityJa } from '~/utils/formValidations'
import { RelationshipAction, type HealthcareProfessional } from '~/typedefs/gqlTypes'
import { listPrefectureJapanEn, listPrefectureJapanJa } from '~/stores/locationsStore'

const toast = useToast()
const route = useRoute()
const { t } = useI18n()
const loadingStore = useLoadingStore()
const moderationScreenStore = useModerationScreenStore()
const facilityStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const isFacilitySectionInitialized: Ref<boolean> = ref(false)

const healthcareProfessionalsRelatedToFacility: Ref<string[]>
= ref([])
const healthcareProfessionalRelatedToFacilityFiltered: Ref<HealthcareProfessional[]> = ref([])
// This keeps track of the existing healthcare professionals we are adding to an existing facility
const healthcareProfessionalsToAddToFacility: Ref<HealthcareProfessional[]> = ref([])
const defaultHealthcareProfessionalSuggestions: Ref<HealthcareProfessional[]> = ref([])

const syncHealthcareProfessionalsRelatedToFacility = () => {
    if (healthcareProfessionalsStore.healthcareProfessionalsData
      && !healthcareProfessionalRelatedToFacilityFiltered.value.length) {
        healthcareProfessionalRelatedToFacilityFiltered.value = healthcareProfessionalsRelatedToFacility.value.flatMap(
            healthcareProfessionalId =>
                healthcareProfessionalsStore.healthcareProfessionalsData.find(
                    healthcareProfessional => healthcareProfessional.id === healthcareProfessionalId
                ) || []
        )
    }
}

const handleHealthcareProfessionalsInputChange = (filteredItems: Ref<HealthcareProfessional[]>, inputValue: string) => {
    filteredItems.value = healthcareProfessionalsStore.healthcareProfessionalsData
        .filter((healthcareProfessional: HealthcareProfessional) => {
            if (facilityStore.facilitySectionFields.healthcareProfessionalIds.includes(healthcareProfessional.id)) {
                return false
            }

            const idMatches = healthcareProfessional.id
                .toLowerCase()
                .startsWith(inputValue.toLowerCase().trim())
            const nameMatches = healthcareProfessional.names.some(name => {
                const firstNameMatch = name.firstName
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                const middleNameMatch = name.middleName
                  && name.middleName
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                const lastNameMatch = name.lastName
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                return firstNameMatch || middleNameMatch || lastNameMatch
            })
            return idMatches || nameMatches
        })
}

const healthcareProfessionalsToDisplayCallback = (healthcareProfessional: HealthcareProfessional) =>
    [healthcareProfessional.names[0].firstName + ' ' + healthcareProfessional.names[0].lastName]

onBeforeMount(async () => {
    // This onBeforeMount can be skipped on other screens since this logic is handled there when active
    if (moderationScreenStore.editSubmissionScreenIsActive()) {
        isFacilitySectionInitialized.value = true
        return
    }

    isFacilitySectionInitialized.value = false
    // Wait for the route to be fully resolved

    loadingStore.setIsLoading(true)
    await nextTick()
    // Ensure the route param `id` is available before proceeding
    const id = route.params.id
    if (!id) {
        console.error(t('modFacilitySection.errorMessageFacilityId'))
        toast.error(t('modFacilitySection.errorMessageFacilityId'))
        return
    }
    // This will fetch the facilities if sent here by link or a page is refreshed
    if (!facilityStore.facilityData.length) {
        await facilityStore.getFacilities()
    }
    // This will fetch the healthcare professionals if sent here by link or a page is refreshed
    if (!healthcareProfessionalsStore.healthcareProfessionalsData) {
        await healthcareProfessionalsStore.getHealthcareProfessionals()
    }
    facilityStore.selectedFacilityId = id as string

    facilityStore.setSelectedFacilityData(facilityStore.selectedFacilityId)
    facilityStore.initializeFacilitySectionValues(facilityStore.selectedFacilityData)

    defaultHealthcareProfessionalSuggestions.value = healthcareProfessionalsStore.healthcareProfessionalsData

    // Ensure UI updates are reflected with the autofill values
    await nextTick()
    syncHealthcareProfessionalsRelatedToFacility()
    isFacilitySectionInitialized.value = true
    loadingStore.setIsLoading(false)
    // Ensure UI updates are reflected
    await nextTick()
})

/** This is making sure all the data is loaded in the component before running the function to set
    the healthcare professionals related to the facility. This loads the data correctly whether sent the
    link or navigating from the moderator dashboard **/
watch(
    () => [
        healthcareProfessionalsStore.healthcareProfessionalsData,
        facilityStore.facilityData,
        facilityStore.selectedFacilityData
    ],
    ([healthcareData, relatedFacilityIds]) => {
        if (healthcareData && relatedFacilityIds) {
            syncHealthcareProfessionalsRelatedToFacility()
        }
        if (facilityStore.selectedFacilityData) {
            healthcareProfessionalsRelatedToFacility.value
                = facilityStore.facilitySectionFields.healthcareProfessionalIds
        }
    },
    { immediate: false }
)

watch(() => facilityStore.facilitySectionFields.healthcareProfessionalIds, newValue => {
    // Set the filtered related ones back to an empty array to sync upon update
    healthcareProfessionalRelatedToFacilityFiltered.value = []
    // Set the professionals related to the facility based on the updated value
    healthcareProfessionalsRelatedToFacility.value = newValue
    // Sync the list to the updated values
    syncHealthcareProfessionalsRelatedToFacility()

    healthcareProfessionalsToAddToFacility.value = []
})

// This watch adds the relations for updating a facility with an added healthcareProfessional
watch(() => healthcareProfessionalsToAddToFacility.value, newValue => {
    if (newValue.length) {
        // Filter out healthcare professionals not already included to prevent unintended side effects
        const professionalsToAdd = healthcareProfessionalsToAddToFacility.value.filter(healthcareProfessional =>
            !facilityStore.facilitySectionFields.healthcareProfessionalIds.includes(healthcareProfessional.id))
        // Map the filtered professionals into relationship objects
        const relationshipCreationArrayFromSelectedHealthcareProfessionalsToAdd
        = professionalsToAdd.map(healthcareProfessional => ({
            action: RelationshipAction.Create,
            otherEntityId: healthcareProfessional.id
        }))
        // Update the store field with the new relationships
        facilityStore.facilitySectionFields.healthProfessionalsRelations
        = relationshipCreationArrayFromSelectedHealthcareProfessionalsToAdd
    }
}, { deep: true })
</script>
