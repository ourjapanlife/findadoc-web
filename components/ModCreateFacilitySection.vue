<template>
    <div class="mod-facility-section">
        <h2 class="mb-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal">
            {{ $t('modFacilitySection.facilityHeading') }}
        </h2>
        <div class="input-fields flex flex-col my-4">
            <ModInputField
                v-model="facilityStore.facilitySectionFields.nameEn"
                data-testid="mod-facility-section-nameEn"
                :label="$t('modFacilitySection.labelFacilityNameEn')"
                type="text"
                :placeholder="$t('modFacilitySection.placeholderTextFacilityNameEn')"
                :required="true"
                :input-validation-check="validateNameEn"
                :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityNameEn')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.nameJa"
                data-testid="mod-facility-section-nameJa"
                :label="$t('modFacilitySection.labelFacilityNameJa')"
                type="text"
                :placeholder="$t('modFacilitySection.placeholderTextFacilityNameJa')"
                :required="true"
                :input-validation-check="validateNameJa"
                :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityNameJa')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.phone"
                data-testid="mod-facility-section-phone"
                :label="$t('modFacilitySection.labelFacilityPhoneNumber')"
                type="text"
                :placeholder="$t('modFacilitySection.placeholderTextFacilityPhoneNumber')"
                :required="true"
                :input-validation-check="validatePhoneNumber"
                :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityPhoneNumber')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.email"
                data-testid="mod-facility-section-email"
                :label="$t('modFacilitySection.labelFacilityEmail')"
                type="email"
                :placeholder="$t('modFacilitySection.placeholderTextFacilityEmail')"
                :required="false"
                :input-validation-check="validateEmail"
                :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityEmail')"
            />
            <ModInputField
                v-model="facilityStore.facilitySectionFields.website"
                data-testid="mod-facility-section-website"
                :label="$t('modFacilitySection.labelFacilityWebsite')"
                type="url"
                :placeholder="$t('modFacilitySection.placeholderTextFacilityWebsite')"
                :required="false"
                :input-validation-check="validateWebsite"
                :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityWebsite')"
            />

            <div
                class="mod-facility-address-section"
            >
                <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                    {{ $t('modFacilitySection.addresses') }}
                </span>
                <ModInputField
                    v-model="facilityStore.facilitySectionFields.postalCode"
                    data-testid="mod-facility-section-postalCode"
                    :label="$t('modFacilitySection.labelFacilityPostalCode')"
                    type="text"
                    :placeholder="$t('modFacilitySection.placeholderTextFacilityPostalCode')"
                    :required="true"
                    :input-validation-check="validatePostalCode"
                    :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityPostalCode')"
                />
                <div class="flex flex-col mt-4">
                    <label
                        for="Prefecture Japan"
                        class="mb-2 text-primary-text text-sm font-bold font-sans"
                    >
                        {{ $t('modFacilitySection.labelFacilityPrefectureEn') }}
                    </label>
                    <select
                        id="1"
                        v-model="facilityStore.facilitySectionFields.prefectureEn"
                        data-testid="mod-facility-section-prefectureEn"
                        name="Prefecture Japan"
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
                    :label="$t('modFacilitySection.labelFacilityCityEn')"
                    type="text"
                    :placeholder="$t('modFacilitySection.placeholderTextFacilityCityEn')"
                    :required="true"
                    :input-validation-check="validateCityEn"
                    :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityCityEn')"
                />
                <ModInputField
                    v-model="facilityStore.facilitySectionFields.addressLine1En"
                    data-testid="mod-facility-section-addressLine1En"
                    :label="$t('modFacilitySection.labelFacilityAddressLine1En')"
                    type="text"
                    :placeholder="$t('modFacilitySection.placeholderTextFacilityAddressLine1En')"
                    :required="true"
                    :input-validation-check="validateAddressLineEn"
                    :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityAddressLine1En')"
                />
                <ModInputField
                    v-model="facilityStore.facilitySectionFields.addressLine2En"
                    data-testid="mod-facility-section-addressLine2En"
                    :label="$t('modFacilitySection.labelFacilityAddressLine2En')"
                    type="text"
                    :placeholder="$t('modFacilitySection.placeholderTextFacilityAddressLine2En')"
                    :required="true"
                    :input-validation-check="validateAddressLineEn"
                    :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityAddressLine2En')"
                />
                <div class="flex flex-col mt-4">
                    <label
                        for="Prefecture Japan"
                        class="mb-2 text-primary-text text-sm font-bold font-sans"
                    >
                        {{ $t('modFacilitySection.labelFacilityPrefectureJa') }}
                    </label>
                    <select
                        id="1"
                        v-model="facilityStore.facilitySectionFields.prefectureJa"
                        data-testid="mod-facility-section-prefectureJa"
                        name="Prefecture Japan"
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
                    :label="$t('modFacilitySection.labelFacilityCityJa')"
                    type="text"
                    :placeholder="$t('modFacilitySection.placeholderTextFacilityCityJa')"
                    :required="true"
                    :input-validation-check="validateCityJa"
                    :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityCityJa')"
                />
                <ModInputField
                    v-model="facilityStore.facilitySectionFields.addressLine1Ja"
                    data-testid="mod-facility-section-addressLine1Ja"
                    :label="$t('modFacilitySection.labelFacilityAddressLine1Ja')"
                    type="text"
                    :placeholder="$t('modFacilitySection.placeholderTextFacilityAddressLine1Ja')"
                    :required="true"
                    :input-validation-check="validateAddressLineJa"
                    :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityAddressLine1Ja')"
                />
                <ModInputField
                    v-model="facilityStore.facilitySectionFields.addressLine2Ja"
                    data-testid="mod-facility-section-addressLine2Ja"
                    :label="$t('modFacilitySection.labelFacilityAddressLine2Ja')"
                    type="text"
                    :placeholder="$t('modFacilitySection.placeholderTextFacilityAddressLine2Ja')"
                    :required="true"
                    :input-validation-check="validateAddressLineJa"
                    :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityAddressLine2Ja')"
                />
            </div>
            <div
                class="google-maps-section"
            >
                <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                    {{ $t('modFacilitySection.googleMapsInformation') }}
                </span>
                <ModInputField
                    v-model="facilityStore.facilitySectionFields.googlemapsURL"
                    data-testid="mod-facility-section-google-maps"
                    :label="$t('modFacilitySection.labelFacilityGoogleMapsUrl')"
                    type="url"
                    :placeholder="$t('modFacilitySection.placeholderTextFacilityGoogleMapsUrl')"
                    :required="true"
                    :input-validation-check="validateWebsite"
                    :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityGoogleMapsUrl')"
                    :autofill="facilityStore.facilitySectionFields.googlemapsURL"
                />
                <ModInputField
                    v-model="facilityStore.facilitySectionFields.mapLatitude"
                    data-testid="mod-facility-section-mapLatitude"
                    :label="$t('modFacilitySection.labelFacilityMapLatitude')"
                    type="text"
                    :placeholder="$t('modFacilitySection.placeholderTextFacilityMapLatitude')"
                    :required="true"
                    :input-validation-check="validateFloat"
                    :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityMapLatitude')"
                />
                <ModInputField
                    v-model="facilityStore.facilitySectionFields.mapLongitude"
                    data-testid="mod-facility-section-mapLongitude"
                    :label="$t('modFacilitySection.labelFacilityMapLongitude')"
                    type="text"
                    :placeholder="$t('modFacilitySection.placeholderTextFacilityMapLongitude')"
                    :required="true"
                    :input-validation-check="validateFloat"
                    :invalid-input-error-message="$t('modFacilitySection.inputErrorMessageFacilityMapLongitude')"
                />
            </div>
            <ModHealthcareProfessionalSearchbar data-testid="mod-facility-section-doctor-search" />
            <div class="flex flex-col">
                <span
                    v-if="moderationScreenStore.createFacilityScreenIsActive()"
                    class="mb-1 text-primary-text text-2xl font-bold font-sans leading-normal"
                >
                    {{ $t('modFacilitySection.healthcareProfessionalToAdd') }}
                </span>
                <span
                    v-show="!facilityStore.healthProfessionalsRelationsForDisplay.length"
                    class="font-semibold"
                >- {{ $t('modFacilitySection.noHPSelected') }}
                </span>
                <span v-show="facilityStore.healthProfessionalsRelationsForDisplay.length">
                    <div
                        v-for="(healthcareProfessional) in facilityStore.healthProfessionalsRelationsForDisplay"
                        :key="`${healthcareProfessional.id}-${healthcareProfessional.names[0].firstName}`"
                    >
                        <ModDashboardHealthProfessionalCard
                            :healthcare-professional="healthcareProfessional"
                        />
                    </div>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, onBeforeMount, onMounted, nextTick, watch, watchEffect } from 'vue'
import { type ToastInterface, useToast } from 'vue-toastification'
import { useRoute } from 'vue-router'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useLoadingStore } from '~/stores/loadingStore'
import { useI18n } from '#imports'
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

let toast: ToastInterface
const route = useRoute()
const { t } = useI18n()

const loadingStore = useLoadingStore()
loadingStore.setIsLoading(true)

const moderationScreenStore = useModerationScreenStore()
const facilityStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()

const isFacilitySectionInitialized: Ref<boolean> = ref(false)
const isFacilitySectionRendered: Ref<boolean> = ref(false)
const healthcareProfessionalsRelatedToFacility: Ref<string[]> = ref([])
const healthcareProfessionalRelatedToFacilityFiltered: Ref<HealthcareProfessional[]> = ref([])

const syncHealthcareProfessionalsRelatedToFacility = () => {
    if (
        healthcareProfessionalsStore.healthcareProfessionalsData
        && !healthcareProfessionalRelatedToFacilityFiltered.value.length
    ) {
        healthcareProfessionalRelatedToFacilityFiltered.value
      = healthcareProfessionalsRelatedToFacility.value.flatMap(
                healthcareProfessionalId =>
                    healthcareProfessionalsStore.healthcareProfessionalsData.find(
                        healthcareProfessional =>
                            healthcareProfessional.id === healthcareProfessionalId
                    ) || []
            )
    }
}

onBeforeMount(async () => {
    isFacilitySectionInitialized.value = false
    toast = useToast()

    await nextTick()

    moderationScreenStore.setActiveScreen(ModerationScreen.CreateFacility)
    facilityStore.setSelectedFacilityData(facilityStore.selectedFacilityId)
    facilityStore.initializeFacilitySectionValues(facilityStore.selectedFacilityData)

    await nextTick()

    syncHealthcareProfessionalsRelatedToFacility()
    isFacilitySectionInitialized.value = true
    loadingStore.setIsLoading(false)
    await nextTick()
})

onMounted(() => {
    isFacilitySectionRendered.value = true
})

watch(
    () => facilityStore.facilitySectionFields.healthcareProfessionalIds,
    newValue => {
        healthcareProfessionalRelatedToFacilityFiltered.value = []
        healthcareProfessionalsRelatedToFacility.value = newValue
        syncHealthcareProfessionalsRelatedToFacility()
    }
)

watchEffect(() => {
    if (facilityStore.selectedFacilityId && !facilityStore.selectedFacilityData) {
        facilityStore.setSelectedFacilityData(facilityStore.selectedFacilityId)
        facilityStore.initializeFacilitySectionValues(facilityStore.selectedFacilityData)
    }
})

const listPrefectureJapanEn: Ref<string[]> = ref([
    'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita',
    'Yamagata', 'Fukushima', 'Ibaraki', 'Tochigi', 'Gumma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
    'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi',
    'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama', 'Tottori', 'Shimane', 'Okayama',
    'Hiroshima', 'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga',
    'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'])

const listPrefectureJapanJa: Ref<string[]> = ref([
    '北海道', '青森県', '岩手県', '宮城県', '秋田県',
    '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県',
    '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府',
    '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県',
    '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'])
</script>
