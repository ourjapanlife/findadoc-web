<template>
    <Loader v-if="moderationScreenStore.editFacilityScreenIsActive()" />
    <div v-if="isFacilitySectionInitialized">
        <div class="mod-facility-section mb-6 rounded-lg border border-accent-bg bg-primary-bg p-4 md:p-5">
            <h1
                v-if="moderationScreenStore.editFacilityScreenIsActive()"
                class="section-heading mb-4 text-start"
            >
                {{ t('modFacilitySection.facilityHeading') }}
            </h1>
            <h3 class="section-heading mb-4 text-start">
                {{ t('modFacilitySection.contactInformation') }}
            </h3>
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
        <div class="mod-facility-address-section mb-6 rounded-lg border border-accent-bg bg-primary-bg p-4 md:p-5">
            <h3 class="section-heading mb-4 text-start">
                {{ t('modFacilitySection.addresses') }}
            </h3>
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
            <p
                v-if="!checkPrefectureNameMatch({
                    prefectureEn: facilityStore.facilitySectionFields.prefectureEn,
                    prefectureJa: facilityStore.facilitySectionFields.prefectureJa,
                })"
                class="mb-2 font-sans text-xs text-error"
            >
                {{ t('modFacilitySection.inputErrorMessagePrefectureMismatch') }}
            </p>
            <div class="grid gap-4 landscape:grid-cols-2">
                <div class="min-w-0">
                    <label
                        for="mod-edit-facility-section-prefecture-select-en"
                        class="field-label"
                    >
                        {{ t('modFacilitySection.labelFacilityPrefectureEn') }}
                    </label>
                    <select
                        id="mod-edit-facility-section-prefecture-select-en"
                        v-model="facilityStore.facilitySectionFields.prefectureEn"
                        data-testid="mod-facility-section-prefectureEn"
                        name="prefecture-japan-en"
                        class="field"
                        @change="onEditPrefectureEn"
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
                        for="mod-edit-facility-section-prefecture-select-ja"
                        class="field-label"
                    >
                        {{ t('modFacilitySection.labelFacilityPrefectureJa') }}
                    </label>
                    <select
                        id="mod-edit-facility-section-prefecture-select-ja"
                        v-model="facilityStore.facilitySectionFields.prefectureJa"
                        data-testid="mod-facility-section-prefectureJa"
                        name="prefecture-japan-ja"
                        class="field"
                        @change="onEditPrefectureJa"
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
            <div class="mt-4 grid items-end gap-4 landscape:grid-cols-2">
                <div class="min-w-0">
                    <ModCityPicker
                        id="mod-edit-facility-section-city"
                        :label="t('modFacilitySection.labelFacilityCityEn')"
                        :prefecture-en="facilityStore.facilitySectionFields.prefectureEn"
                        :city-id="facilityStore.facilitySectionFields.cityId"
                        test-id="mod-facility-section-cityEn"
                        @select="applyEditCity"
                    />
                    <p
                        v-if="!facilityStore.facilitySectionFields.cityId && facilityStore.facilitySectionFields.cityEn"
                        class="mt-1.5 font-sans text-xs text-primary-text-muted"
                    >
                        {{ facilityStore.facilitySectionFields.cityEn }} / {{ facilityStore.facilitySectionFields.cityJa }}
                    </p>
                </div>
                <div
                    v-if="facilityStore.facilitySectionFields.cityJa"
                    class="min-w-0"
                >
                    <span class="field-label">
                        {{ t('modFacilitySection.labelFacilityCityJa') }}
                    </span>
                    <p
                        data-testid="mod-facility-section-cityJa"
                        class="chip"
                    >
                        {{ facilityStore.facilitySectionFields.cityJa }}
                    </p>
                </div>
            </div>
            <div class="grid landscape:grid-cols-2 landscape:gap-x-4">
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
                    v-model="facilityStore.facilitySectionFields.addressLine2En"
                    data-testid="mod-facility-section-addressLine2En"
                    :label="t('modFacilitySection.labelFacilityAddressLine2En')"
                    type="text"
                    :placeholder="t('modFacilitySection.placeholderTextFacilityAddressLine2En')"
                    :required="false"
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
        </div>
        <div class="google-maps-section mb-6 rounded-lg border border-accent-bg bg-primary-bg p-4 md:p-5">
            <h3 class="section-heading mb-4 text-start">
                {{ t('modFacilitySection.googleMapsInformation') }}
            </h3>
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
            class="mb-6 flex flex-col rounded-lg border border-accent-bg bg-primary-bg p-4 md:p-5"
        >
            <h3 class="section-heading mb-4 text-start">
                {{ t('modFacilitySection.addHealthcareProfessional') }}
            </h3>
            <ModSearchBar
                v-model="selectedHealthcareProfessionalsModel"
                data-testid="mod-facility-section-doctor-search"
                :place-holder-text="t('modFacilitySection.placeholderTextHealthcareProfessionalSearchbar')"
                :no-match-text="t('modFacilitySection.noHealthcareProfessionalFound')"
                :fields-to-display-callback="healthcareProfessionalsToDisplayCallback"
                :default-suggestions="defaultHealthcareProfessionalSuggestions"
                @search-input-change="handleHealthcareProfessionalsInputChange"
            />
            <span
                v-show="!selectedHealthcareProfessionals.length"
                class="font-semibold my-3"
            >- {{ t('modFacilitySection.noHPSelected') }}
            </span>
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
        </div>
    </div>
    <div
        v-if="moderationScreenStore.editFacilityScreenIsActive()"
    >
        <h3 class="section-heading mb-4 text-start">
            {{ t('modFacilitySection.existingHPHeading') }}
        </h3>
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
import { type Ref, ref, computed, onBeforeMount, onUnmounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppToast } from '~/composables/useAppToast'
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
    validateEmail,
    validateFloat,
    validatePostalCode,
    validateWebsite } from '~/utils/formValidations'
import { RelationshipAction, type HealthcareProfessional } from '~/typedefs/gqlTypes'
import type { CityOption } from '~/utils/cityOptions'
import { listPrefectureJapanEn, listPrefectureJapanJa, pairedPrefectureEn, pairedPrefectureJa } from '~/stores/locationsStore'
import { checkPrefectureNameMatch } from '~/utils/facilitiesUtils'
import { stableStringify } from '~/utils/stableStringify'
import { matchesHealthcareProfessionalSearch } from '~/utils/moderationSearchUtils'
import { formatFirstLocalizedFullName } from '~/utils/nameUtils'
import { useModerationSubmissionUnsavedStore } from '~/stores/moderationSubmissionUnsavedStore'

const toast = useAppToast()
const route = useRoute()
const { t } = useI18n()
const loadingStore = useLoadingStore()
const moderationScreenStore = useModerationScreenStore()
const facilityStore = useFacilitiesStore()
const { facilitySectionFields } = storeToRefs(facilityStore)
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const isFacilitySectionInitialized: Ref<boolean> = ref(false)

const facilityFormState = computed(() =>
    JSON.parse(stableStringify(facilitySectionFields.value)))
const moderationSubmissionUnsavedStore = useModerationSubmissionUnsavedStore()
const { makeNonDirty: makeFacilityFormNonDirty, tryLeave: tryLeaveFacilityForm } = useUnsavedChanges({
    data: { source: facilityFormState },
    mode: 'update'
})

watch(
    () => facilityStore.unsavedChangesResetTick,
    () => {
        makeFacilityFormNonDirty()
    },
    { flush: 'sync' }
)

const healthcareProfessionalsRelatedToFacility = computed(() => facilitySectionFields.value.healthcareProfessionalIds)
const healthcareProfessionalRelatedToFacilityFiltered = computed<HealthcareProfessional[]>(() =>
    healthcareProfessionalsRelatedToFacility.value.flatMap(
        healthcareProfessionalId =>
            healthcareProfessionalsStore.healthcareProfessionalsData.find(
                healthcareProfessional => healthcareProfessional.id === healthcareProfessionalId
            ) || []
    ))
// This keeps track of the existing healthcare professionals we are adding to an existing facility
const selectedHealthcareProfessionals: Ref<HealthcareProfessional[]> = ref([])
const selectedHealthcareProfessionalsModel = computed({
    get: () => selectedHealthcareProfessionals.value,
    set: (newValue: HealthcareProfessional[]) => {
        selectedHealthcareProfessionals.value = newValue
        if (newValue.length) {
            const professionalsToAdd = newValue.filter(healthcareProfessional =>
                !facilityStore.facilitySectionFields.healthcareProfessionalIds.includes(healthcareProfessional.id))
            facilityStore.facilitySectionFields.healthProfessionalsRelations = professionalsToAdd.map(healthcareProfessional => ({
                action: RelationshipAction.Create,
                otherEntityId: healthcareProfessional.id
            }))
            selectedHealthcareProfessionals.value = []
        }
    }
})
const defaultHealthcareProfessionalSuggestions: Ref<HealthcareProfessional[]> = ref([])

const handleHealthcareProfessionalsInputChange = (filteredItems: Ref<HealthcareProfessional[]>, inputValue: string) => {
    filteredItems.value = healthcareProfessionalsStore.healthcareProfessionalsData
        .filter((healthcareProfessional: HealthcareProfessional) => {
            if (facilityStore.facilitySectionFields.healthcareProfessionalIds.includes(healthcareProfessional.id)) {
                return false
            }
            return matchesHealthcareProfessionalSearch(healthcareProfessional, inputValue)
        })
}

const healthcareProfessionalsToDisplayCallback = (healthcareProfessional: HealthcareProfessional) =>
    [formatFirstLocalizedFullName(healthcareProfessional.names)]

function onEditPrefectureEn() {
    const fields = facilityStore.facilitySectionFields
    const prefectureJa = pairedPrefectureJa(fields.prefectureEn)
    if (prefectureJa) fields.prefectureJa = prefectureJa
    clearEditCity()
}

function onEditPrefectureJa() {
    const fields = facilityStore.facilitySectionFields
    const prefectureEn = pairedPrefectureEn(fields.prefectureJa)
    if (prefectureEn) fields.prefectureEn = prefectureEn
    clearEditCity()
}

function clearEditCity() {
    if (!isFacilitySectionInitialized.value) return

    facilityStore.facilitySectionFields.cityId = ''
    facilityStore.facilitySectionFields.cityEn = ''
    facilityStore.facilitySectionFields.cityJa = ''
}

function applyEditCity(city: CityOption | null) {
    const fields = facilityStore.facilitySectionFields
    if (!city) {
        const saved = facilityStore.selectedFacilityData?.contact?.address
        const samePrefecture = fields.prefectureEn.trim().toLowerCase()
          === (saved?.prefectureEn ?? '').trim().toLowerCase()
          && fields.prefectureJa.trim() === (saved?.prefectureJa ?? '').trim()
        fields.cityId = ''
        fields.cityEn = samePrefecture ? (saved?.cityEn ?? '') : ''
        fields.cityJa = samePrefecture ? (saved?.cityJa ?? '') : ''
        return
    }

    fields.cityId = city.id
    fields.cityEn = city.nameEn
    fields.cityJa = city.nameJa
}

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
    isFacilitySectionInitialized.value = true
    makeFacilityFormNonDirty()
    moderationSubmissionUnsavedStore.registerEditFormTryLeave(tryLeaveFacilityForm)
    loadingStore.setIsLoading(false)
    // Ensure UI updates are reflected
    await nextTick()
})

onUnmounted(() => {
    moderationSubmissionUnsavedStore.registerEditFormTryLeave(null)
})
</script>
