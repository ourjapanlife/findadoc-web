<template>
    <form
        class="p-4 h-full overflow-y-auto"
        @submit="submitForm"
    >
        <div>
            <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                {{ $t('modSubmissionForm.contactInformation') }}
            </span>
            <ModInputField
                v-model="nameEn"
                data-testid="submission-form-nameEn"
                :label="$t('modSubmissionForm.labelFacilityNameEn')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityNameEn')"
                :required="true"
                :input-validation-check="validateNameEn"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityNameEn')"
            />
            <ModInputField
                v-model="nameJp"
                data-testid="submission-form-nameJp"
                :label="$t('modSubmissionForm.labelFacilityNameJp')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityNameJp')"
                :required="true"
                :input-validation-check="validateNameJp"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityNameJp')"
            />
            <ModInputField
                v-model="phone"
                data-testid="submission-form-phone"
                :label="$t('modSubmissionForm.labelFacilityPhoneNumber')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityPhoneNumber')"
                :required="true"
                :input-validation-check="validatePhoneNumber"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityPhoneNumber')"
            />
            <ModInputField
                v-model="email"
                data-testid="submission-form-email"
                :label="$t('modSubmissionForm.labelFacilityEmail')"
                type="email"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityEmail')"
                :required="false"
                :input-validation-check="validateEmail"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityEmail')"
            />
            <ModInputField
                v-model="website"
                data-testid="submission-form-website"
                :label="$t('modSubmissionForm.labelFacilityWebsite')"
                type="url"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityWebsite')"
                :required="false"
                :input-validation-check="validateWebsite"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityWebsite')"
            />
        </div>

        <div>
            <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                {{ $t('modSubmissionForm.addresses') }}
            </span>
            <ModInputField
                v-model="postalCode"
                data-testid="submission-form-postalCode"
                :label="$t('modSubmissionForm.labelFacilityPostalCode')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityPostalCode')"
                :required="true"
                :input-validation-check="validatePostalCode"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityPostalCode')"
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
                    v-model="prefectureEn"
                    data-testid="submission-form-prefectureEn"
                    name="Prefecture Japan"
                    class="mb-5 px-3 py-3.5 w-96 h-12 bg-white rounded-lg border border-primary-text-muted
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
                v-model="cityEn"
                data-testid="submission-form-cityEn"
                :label="$t('modSubmissionForm.labelFacilityCityEn')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityCityEn')"
                :required="true"
                :input-validation-check="validateCityEn"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityCityEn')"
            />
            <ModInputField
                v-model="addressLine1En"
                data-testid="submission-form-addressLine1En"
                :label="$t('modSubmissionForm.labelFacilityAddressLine1En')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine1En')"
                :required="true"
                :input-validation-check="validateAddressLineEn"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine1En')"
            />
            <ModInputField
                v-model="addressLine2En"
                data-testid="submission-form-addressLine2En"
                :label="$t('modSubmissionForm.labelFacilityAddressLine2En')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine2En')"
                :required="true"
                :input-validation-check="validateAddressLineEn"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine2En')"
            />
            <div class="flex flex-col mt-4">
                <label
                    for="Prefecture Japan"
                    class="mb-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ $t('modSubmissionForm.labelFacilityPrefectureJp') }}
                </label>
                <select
                    id="1"
                    v-model="prefectureJp"
                    data-testid="submission-form-prefectureJp"
                    name="Prefecture Japan"
                    class="mb-5 px-3 py-3.5 w-96 h-12 bg-white rounded-lg border border-primary-text-muted
                    text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                >
                    <option
                        v-for="(prefecture, index) in listPrefectureJapanJp"
                        :key="index"
                    >
                        {{ prefecture }}
                    </option>
                </select>
            </div>
            <ModInputField
                v-model="cityJp"
                data-testid="submission-form-cityJp"
                :label="$t('modSubmissionForm.labelFacilityCityJp')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityCityJp')"
                :required="true"
                :input-validation-check="validateCityJp"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityCityJp')"
            />
            <ModInputField
                v-model="addressLine1Jp"
                data-testid="submission-form-addressLine1Jp"
                :label="$t('modSubmissionForm.labelFacilityAddressLine1Jp')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine1Jp')"
                :required="true"
                :input-validation-check="validateAddressLineJp"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine1Jp')"
            />
            <ModInputField
                v-model="addressLine2Jp"
                data-testid="submission-form-addressLine2Jp"
                :label="$t('modSubmissionForm.labelFacilityAddressLine2Jp')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine2Jp')"
                :required="true"
                :input-validation-check="validateAddressLineJp"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine2Jp')"
            />
        </div>

        <div>
            <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                {{ $t('modSubmissionForm.googleMapsInformation') }}
            </span>
            <ModInputField
                v-model="googlemapsURL"
                data-testid="submission-form-google-maps"
                :label="$t('modSubmissionForm.labelFacilityGoogleMapsUrl')"
                type="url"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityGoogleMapsUrl')"
                :required="true"
                :input-validation-check="validateWebsite"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityGoogleMapsUrl')"
                :autofill-value="googlemapsURL"
            />
            <ModInputField
                v-model="mapLatitude"
                data-testid="submission-form-mapLatitude"
                :label="$t('modSubmissionForm.labelFacilityMapLatitude')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityMapLatitude')"
                :required="true"
                :input-validation-check="validateFloat"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityMapLatitude')"
            />
            <ModInputField
                v-model="mapLongitude"
                data-testid="submission-form-mapLongitude"
                :label="$t('modSubmissionForm.labelFacilityMapLongitude')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityMapLongitude')"
                :required="true"
                :input-validation-check="validateFloat"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityMapLongitude')"
            />
        </div>
        <ModHealthcareProfessionalSearchbar
            data-testid="submission-form-doctor-search"
        />
        <!-- This button is pure for testing -->
        <button
            type="submit"
            class="bg-currentColor text-white font-bold py-2 px-4 rounded"
            @click="submitForm"
        >
            submit
        </button>
    </form>
</template>

<script lang="ts" setup>
import { type Ref, ref } from 'vue'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import type { Submission } from '~/typedefs/gqlTypes'
import { validateAddressLineEn, validateAddressLineJp, validateNameEn, validateNameJp, validatePhoneNumber, validateCityEn, validateEmail, validateFloat, validatePostalCode, validateWebsite, validateCityJp } from '~/utils/formValidations'

// contactFields
const nameEn: Ref<string> = ref('')
const nameJp: Ref<string> = ref('')
const phone: Ref<string> = ref('')
const website: Ref<string> = ref('')
const email: Ref<string> = ref('')
// addressesFields
const postalCode: Ref<string> = ref('')
const prefectureEn: Ref<string> = ref('')
const cityEn: Ref<string> = ref('')
const addressLine1En: Ref<string> = ref('')
const addressLine2En: Ref<string> = ref('')
const prefectureJp: Ref<string> = ref('')
const cityJp: Ref<string> = ref('')
const addressLine1Jp: Ref<string> = ref('')
const addressLine2Jp: Ref<string> = ref('')
// googleMapsFields
const googlemapsURL: Ref<string> = ref('')
const mapLatitude: Ref<string> = ref('')
const mapLongitude: Ref<string> = ref('')
const listPrefectureJapanEn: Ref<string[]> = ref(['Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima', 'Ibaraki', 'Tochigi', 'Gumma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa', 'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'])
const listPrefectureJapanJp: Ref<string[]> = ref(['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'])

const moderationSubmissionStore = useModerationSubmissionsStore()

const formSubmissionId = moderationSubmissionStore.selectedSubmissionId
moderationSubmissionStore.filterSelectedSubmission(formSubmissionId)

const formSubmissionData = moderationSubmissionStore.selectedSubmissionData

autofillEditSubmissionForm(formSubmissionData)

const validateFields = () => {
    const isNameEnValid: boolean = validateNameEn(nameEn.value)
    const isNameJpValid: boolean = validateNameJp(nameJp.value)
    const isPhoneValid: boolean = validatePhoneNumber(phone.value)
    const isEmailValid: boolean = validateEmail(email.value)
    const isWebsiteValid: boolean = validateWebsite(website.value)
    const isAddressLine1EnValid: boolean = validateAddressLineEn(addressLine1En.value)
    const isAddressLine2EnValid: boolean = validateAddressLineEn(addressLine2En.value)
    const isAddressLine1JpValid: boolean = validateAddressLineJp(addressLine1Jp.value)
    const isAddressLine2JpValid: boolean = validateAddressLineJp(addressLine2Jp.value)
    const isCityEnValid: boolean = validateCityEn(cityEn.value)
    const isCityJpValid: boolean = validateCityJp(cityJp.value)
    const isPostalCodeValid: boolean = validatePostalCode(postalCode.value)
    const isLatitudeValid: boolean = validateFloat(mapLatitude.value)
    const isLongitudeValid: boolean = validateFloat(mapLongitude.value)

    return (
        !isNameEnValid
        || !isNameJpValid
        || !isPhoneValid
        || !isEmailValid
        || !isWebsiteValid
        || !isAddressLine1EnValid
        || !isAddressLine2EnValid
        || !isAddressLine1JpValid
        || !isAddressLine2JpValid
        || !isCityEnValid
        || !isCityJpValid
        || !isPostalCodeValid
        || !isLatitudeValid
        || !isLongitudeValid
    )
}

function autofillEditSubmissionForm(submissionData: Submission | undefined) {
    for (const key in submissionData) {
        if (submissionData[key as keyof Submission]) {
            switch (key) {
                case 'facility':
                    nameEn.value = submissionData['facility']?.nameEn || ''
                    nameJp.value = submissionData['facility']?.nameJa || ''
                    phone.value = submissionData['facility']?.contact?.phone || ''
                    email.value = submissionData['facility']?.contact?.email || ''
                    website.value = submissionData['facility']?.contact?.website || ''
                    postalCode.value = submissionData['facility']?.contact?.address.postalCode || ''
                    prefectureEn.value = submissionData['facility']?.contact?.address.prefectureEn || ''
                    cityEn.value = submissionData['facility']?.contact?.address.cityEn || ''
                    addressLine1En.value = submissionData['facility']?.contact?.address.addressLine1En || ''
                    addressLine2En.value = submissionData['facility']?.contact?.address.addressLine2En || ''
                    prefectureJp.value = submissionData['facility']?.contact?.address.prefectureJa || ''
                    cityJp.value = submissionData['facility']?.contact?.address.cityJa || ''
                    addressLine1Jp.value = submissionData['facility']?.contact?.address.addressLine1Ja || ''
                    addressLine2Jp.value = submissionData['facility']?.contact?.address.addressLine2Ja || ''
                    mapLatitude.value = submissionData['facility']?.mapLatitude?.toString() || ''
                    mapLongitude.value = submissionData['facility']?.mapLongitude?.toString() || ''
                    break
                case 'googleMapsUrl':
                    googlemapsURL.value = submissionData['facility']?.contact?.googleMapsUrl || submissionData['googleMapsUrl']
            }
        }
    }
}

function submitForm(e: Event) {
    // stop the form submitting before we validate
    e.preventDefault()

    const isValid = validateFields()
    if (!isValid) {
        return
    }

    //submitthedatahere(googlemapsURL, mapLatitude, mapLongitude)
    console.log('Form submitted!!! woohoo')
}
</script>
