<template>
    <div
        class="submission-form-section"
    >
        <h1
            class="mb-3.5 text-start text-primary-text text-3xl font-bold font-sans leading-normal"
        >
            {{ $t('modSubmissionForm.facilityHeading') }}
        </h1>
        <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
            {{ $t('modSubmissionForm.contactInformation') }}
        </span>
        <ModInputField
            v-model="submissionFormFields.nameEn.value"
            data-testid="submission-form-nameEn"
            :label="$t('modSubmissionForm.labelFacilityNameEn')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityNameEn')"
            :required="true"
        />
        <ModInputField
            v-model="submissionFormFields.nameJa.value"
            data-testid="submission-form-nameJa"
            :label="$t('modSubmissionForm.labelFacilityNameJa')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityNameJa')"
            :required="true"
        />
        <ModInputField
            v-model="submissionFormFields.phone.value"
            data-testid="submission-form-phone"
            :label="$t('modSubmissionForm.labelFacilityPhoneNumber')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityPhoneNumber')"
            :required="true"
        />
        <ModInputField
            v-model="submissionFormFields.email.value"
            data-testid="submission-form-email"
            :label="$t('modSubmissionForm.labelFacilityEmail')"
            type="email"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityEmail')"
            :required="false"
        />
        <ModInputField
            v-model="submissionFormFields.website.value"
            data-testid="submission-form-website"
            :label="$t('modSubmissionForm.labelFacilityWebsite')"
            type="url"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityWebsite')"
            :required="false"
        />
    </div>

    <div
        class="submission-form-section"
    >
        <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
            {{ $t('modSubmissionForm.addresses') }}
        </span>
        <ModInputField
            v-model="submissionFormFields.postalCode.value"
            data-testid="submission-form-postalCode"
            :label="$t('modSubmissionForm.labelFacilityPostalCode')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityPostalCode')"
            :required="true"
        />
        <div class="flex flex-col mt-4">
            <label
                for="Prefecture Japan"
                class="mb-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t('modSubmissionForm.labelFacilityPrefectureEn') }}
            </label>
            <select
                id="1"
                v-model="submissionFormFields.prefectureEn.value"
                data-testid="submission-form-prefectureEn"
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
            v-model="submissionFormFields.cityEn.value"
            data-testid="submission-form-cityEn"
            :label="$t('modSubmissionForm.labelFacilityCityEn')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityCityEn')"
            :required="true"
        />
        <ModInputField
            v-model="submissionFormFields.addressLine1En.value"
            data-testid="submission-form-addressLine1En"
            :label="$t('modSubmissionForm.labelFacilityAddressLine1En')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine1En')"
            :required="true"
        />
        <ModInputField
            v-model="submissionFormFields.addressLine2En.value"
            data-testid="submission-form-addressLine2En"
            :label="$t('modSubmissionForm.labelFacilityAddressLine2En')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine2En')"
            :required="true"
        />
        <div class="flex flex-col mt-4">
            <label
                for="Prefecture Japan"
                class="mb-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t('modSubmissionForm.labelFacilityPrefectureJa') }}
            </label>
            <select
                id="1"
                v-model="submissionFormFields.prefectureJa.value"
                data-testid="submission-form-prefectureJa"
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
            v-model="submissionFormFields.cityJa.value"
            data-testid="submission-form-cityJa"
            :label="$t('modSubmissionForm.labelFacilityCityJa')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityCityJa')"
            :required="true"
        />
        <ModInputField
            v-model="submissionFormFields.addressLine1Ja.value"
            data-testid="submission-form-addressLine1Ja"
            :label="$t('modSubmissionForm.labelFacilityAddressLine1Ja')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine1Ja')"
            :required="true"
        />
        <ModInputField
            v-model="submissionFormFields.addressLine2Ja.value"
            data-testid="submission-form-addressLine2Ja"
            :label="$t('modSubmissionForm.labelFacilityAddressLine2Ja')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine2Ja')"
            :required="true"
        />
    </div>

    <div
        class="submission-form-section"
    >
        <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
            {{ $t('modSubmissionForm.googleMapsInformation') }}
        </span>
        <ModInputField
            v-model="submissionFormFields.googlemapsURL.value"
            data-testid="submission-form-google-maps"
            :label="$t('modSubmissionForm.labelFacilityGoogleMapsUrl')"
            type="url"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityGoogleMapsUrl')"
            :required="true"
            :autofill-value="submissionFormFields.googlemapsURL.value"
        />
        <ModInputField
            v-model="submissionFormFields.mapLatitude.value"
            data-testid="submission-form-mapLatitude"
            :label="$t('modSubmissionForm.labelFacilityMapLatitude')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityMapLatitude')"
            :required="true"
        />
        <ModInputField
            v-model="submissionFormFields.mapLongitude.value"
            data-testid="submission-form-mapLongitude"
            :label="$t('modSubmissionForm.labelFacilityMapLongitude')"
            type="text"
            :placeholder="$t('modSubmissionForm.placeholderTextFacilityMapLongitude')"
            :required="true"
        />
    </div>
    <ModHealthcareProfessionalSearchbar data-testid="submission-form-doctor-search" />
    <button
        v-show="screenStore.activeScreen === ModerationScreen.EditFacility"
        type="submit"
        class="bg-currentColor text-white font-bold py-2 px-4 my-2 rounded w-56"
    >
        {{ $t('modSubmissionForm.updateButtonText') }}
    </button>
</template>

<script lang="ts" setup>
import { type Ref, ref } from 'vue'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

const screenStore = useModerationScreenStore()

const submissionFormFields = {
    // contactFields
    nameEn: ref('') as Ref<string>,
    nameJa: ref('') as Ref<string>,
    phone: ref('') as Ref<string>,
    website: ref('') as Ref<string>,
    email: ref('') as Ref<string>,
    // addressesFields
    postalCode: ref('') as Ref<string>,
    prefectureEn: ref('') as Ref<string>,
    cityEn: ref('') as Ref<string>,
    addressLine1En: ref('') as Ref<string>,
    addressLine2En: ref('') as Ref<string>,
    prefectureJa: ref('') as Ref<string>,
    cityJa: ref('') as Ref<string>,
    addressLine1Ja: ref('') as Ref<string>,
    addressLine2Ja: ref('') as Ref<string>,
    // googleMapsFields
    googlemapsURL: ref('') as Ref<string>,
    mapLatitude: ref('') as Ref<string>,
    mapLongitude: ref('') as Ref<string>
} as { [key: string]: Ref }

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
