<template>
    <form
        class="p-4 h-full overflow-y-auto"
        @submit="submitForm"
    >
        <div
            :id="ModSubmissionLeftNavbarSectionIDs.ContactInformation"
            class="submission-form-section"
        >
            <h1
                class="mb-3.5 text-start text-primary-text text-3xl font-bold font-sans leading-normal"
            >
                {{ $t('modSubmissionForm.facilityHeading') }}
            </h1>
            <span
                class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal"
            >
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

        <div
            :id="ModSubmissionLeftNavbarSectionIDs.Addresses"
            class="submission-form-section"
        >
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
                    class="mb-5 px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
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

        <div
            :id="ModSubmissionLeftNavbarSectionIDs.GoogleMapsInformation"
            class="submission-form-section"
        >
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
        <h1
            class="mb-3.5 text-start text-primary-text text-3xl font-bold font-sans leading-normal"
        >
            {{ $t('modSubmissionForm.healthcareProfessionalHeading') }}
        </h1>
        <h2
            :id="ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalName"
            class="submission-form-section mb-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
        >
            {{ $t('modSubmissionForm.healthcareProfessionalNameHeading') }}
        </h2>
        <div class="flex flex-col my-4">
            <ModInputField
                v-model="localizedLastName"
                data-testid="submission-form-last-name"
                :label="$t('modSubmissionForm.labelHealthcareProfessionalLastName')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextHealthcareProfessionalLastName')"
                :required="true"
                :input-validation-check="validateUserSubmittedLastName"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageHealthcareProfessionalLastName')"
            />
            <ModInputField
                v-model="localizedFirstName"
                data-testid="submission-form-first-name"
                :label="$t('modSubmissionForm.labelHealthcareProfessionalFirstName')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextHealthcareProfessionalFirstName')"
                :required="true"
                :input-validation-check="validateUserSubmittedFirstName"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageHealthcareProfessionalFirstName')"
            />
            <ModInputField
                v-model="localizedMiddleName"
                data-testid="submission-form-middle-name"
                :label="$t('modSubmissionForm.labelHealthcareProfessionalMiddleName')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextHealthcareProfessionalMiddleName')"
                :required="false"
            />
            <label
                for="Name Locales"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t('modSubmissionForm.labelHealthcareProfessionalNameLocale') }}
            </label>
            <select
                v-model="nameLocale"
                data-testid="submission-form-locale"
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
                class="bg-tertiary text-white font-bold py-2 px-4 my-2 rounded w-56"
                @click="handleLocalizedNameToSubmission"
            >
                {{ $t('modSubmissionForm.addHealthCareProfessionalLocaleName') }}
            </button>
            <p
                v-show="healthCareProfessionalNameArray.length"
                class="mt-3.5 text-start text-nowrap text-xl font-bold font-sans leading-normal"
            >
                {{ $t("modSubmissionForm.clickToRemoveHealthCareProfessionalName") }}
            </p>
            <div
                v-show="healthCareProfessionalNameArray.length"
                :class="`grid grid-cols-4 p-2`"
            >
                <div class="font-bold text-left p-1">
                    {{ $t("modSubmissionForm.labelHealthcareProfessionalLastName") }}
                </div>
                <div class="font-bold text-left p-1">
                    {{ $t("modSubmissionForm.labelHealthcareProfessionalFirstName") }}
                </div>
                <div class="font-bold text-left p-1">
                    {{ $t("modSubmissionForm.labelHealthcareProfessionalMiddleName") }}
                </div>
                <div class="font-bold text-left p-1">
                    {{ $t("modSubmissionForm.labelHealthcareProfessionalNameLocale") }}
                </div>
                <div
                    v-if="healthCareProfessionalNameArray.length"
                    class="grid grid-cols-subgrid col-span-4"
                >
                    <div
                        v-for="(healthcareProfessionalName, index) in healthCareProfessionalNameArray"
                        :key="`${healthcareProfessionalName.firstName}-${index}`"
                        class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg"
                    >
                        <div
                            :data-testid="`mod-submission-list-item-${index + 1}`"
                            class="grid grid-cols-subgrid col-span-4 bg-tertiary-bg cursor-pointer hover:bg-primary"
                            @click="() => handleRemoveHealthcareProfessionalName(index)"
                        >
                            <span class="text-start">{{ healthcareProfessionalName.lastName }}</span>
                            <span class="text-start">{{ healthcareProfessionalName.firstName }}</span>
                            <span class="text-start">
                                {{ healthcareProfessionalName.middleName }}
                            </span>
                            <span class="text-start">{{ healthcareProfessionalName.locale }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <h2
                :id="ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalMedicalInfo"
                class="submission-form-section my-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
            >
                {{ $t('modSubmissionForm.healthcareProfessionalMedicalInfoHeading') }}
            </h2>
            <label
                for="Accepted Insurances"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t("modSubmissionForm.selectInsurances") }}
            </label>
            <select
                id="healthcare-professional-accepted-insurances"
                v-model="healthcareProfessionalAcceptedInsurances"
                data-testid="submission-form-accepted-insurances"
                name="Accepted Insurances"
                multiple
                class="mb-5 px-3 py-3.5 w-96 h-32 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(insuranceType, index) in insuranceOptions"
                    :key="`${insuranceType}-${index}`"
                    :value="insuranceType"
                >
                    {{ insuranceType }}
                </option>
            </select>
            <label
                for="Degrees"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t("modSubmissionForm.selectDegrees") }}
            </label>
            <select
                id="healthcare-professional-degrees"
                v-model="healthcareProfessionalDegrees"
                data-testid="submission-form-degrees"
                name="Degrees"
                multiple
                class="mb-5 px-3 py-3.5 w-96 h-32 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(degree, index) in degreeOptions"
                    :key="`${degree}-${index}`"
                    :value="degree"
                >
                    {{ degree }}
                </option>
            </select>
            <label
                for="Specialties"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t("modSubmissionForm.selectSpecialties") }}
            </label>
            <select
                id="healthcare-professional-specialties"
                v-model="healthcareProfessionalSpecialties"
                data-testid="submission-form-specialties"
                name="Specialties"
                multiple
                class="mb-5 px-3 py-3.5 w-96 h-32 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(specialty, index) in specialtyOptions"
                    :key="`${specialty}-${index}`"
                    :value="specialty"
                >
                    {{ specialty }}
                </option>
            </select>

            <label
                for="Locales"
                class="my-2 text-primary-text text-sm font-bold font-sans"
            >
                {{ $t("modSubmissionForm.selectLocales") }}
            </label>
            <select
                id="healthcare-professional-locales"
                v-model="healthcareProfessionalLocales"
                data-testid="submission-form-locales"
                name="Locales"
                multiple
                class="mb-5 px-3 py-3.5 w-96 h-32 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(locale, index) in localeOptions"
                    :key="`${locale}-${index}`"
                    :value="locale"
                >
                    {{ locale }}
                </option>
            </select>
            <button
                type="submit"
                class="bg-currentColor text-white font-bold py-2 px-4 my-2 rounded w-56"
                @click="submitForm"
            >
                {{ $t('modSubmissionForm.submitButtonText') }}
            </button>
        </div>
    </form>
</template>

<script lang="ts" setup>
import { onMounted, type Ref, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { gql } from 'graphql-request'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql.js'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { Locale, type Submission, type MutationUpdateSubmissionArgs, type LocalizedNameInput, Insurance, Degree, Specialty } from '~/typedefs/gqlTypes'
import { validateAddressLineEn, validateAddressLineJp, validateNameEn, validateNameJp, validatePhoneNumber, validateCityEn, validateEmail, validateFloat, validatePostalCode, validateWebsite, validateCityJp, validateUserSubmittedFirstName, validateUserSubmittedLastName } from '~/utils/formValidations'
import { ModSubmissionLeftNavbarSectionIDs } from '~/stores/moderationScreenStore'
import { multiSelectWithoutKeyboard } from '~/utils/multiSelectWithoutKeyboard'

const router = useRouter()

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
//healthcareProfessionalFields
const healthCareProfessionalNameArray: Ref<Array<LocalizedNameInput>> = ref([])
const localizedFirstName: Ref<string> = ref('')
const localizedLastName: Ref<string> = ref('')
const localizedMiddleName: Ref<string> = ref('')
const nameLocale: Ref<Locale> = ref(Locale.EnUs)
const healthcareProfessionalAcceptedInsurances: Ref<Array<Insurance>> = ref([])
const healthcareProfessionalDegrees: Ref<Array<Degree>> = ref([])
const healthcareProfessionalSpecialties: Ref<Array<Specialty>> = ref([])
const healthcareProfessionalLocales: Ref<Array<Locale>> = ref([])

// Creating the necessary parts for the multi-select
const insuranceOptions = Object.values(Insurance) as Insurance[]
const extractInsuranceOptions = (option: HTMLOptionElement): Insurance => option.value as Insurance
const degreeOptions = Object.values(Degree) as Degree[]
const extractDegreeOptions = (option: HTMLOptionElement): Degree => option.value as Degree
const specialtyOptions = Object.values(Specialty) as Specialty[]
const extractSpecialtyOptions = (option: HTMLOptionElement): Specialty => option.value as Specialty
const localeOptions = Object.values(Locale) as Locale[]
const extractLocaleOptions = (option: HTMLOptionElement): Locale => option.value as Locale

const listPrefectureJapanEn: Ref<string[]> = ref(['Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima', 'Ibaraki', 'Tochigi', 'Gumma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa', 'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'])
const listPrefectureJapanJp: Ref<string[]> = ref(['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'])

const moderationSubmissionStore = useModerationSubmissionsStore()

const formSubmissionId = moderationSubmissionStore.selectedSubmissionId

moderationSubmissionStore.filterSelectedSubmission(formSubmissionId)
const formSubmissionData = moderationSubmissionStore.selectedSubmissionData
autofillEditSubmissionForm(formSubmissionData)

const handleLocalizedNameToSubmission = () => {
    const localizedNameToAdd: LocalizedNameInput = {
        firstName: localizedFirstName.value,
        lastName: localizedLastName.value,
        locale: nameLocale.value || Locale.EnUs,
        middleName: localizedMiddleName.value
    }

    if (localizedNameToAdd.firstName && localizedNameToAdd.lastName) {
        healthCareProfessionalNameArray.value.push(localizedNameToAdd)
        localizedFirstName.value = ''
        localizedLastName.value = ''
        localizedMiddleName.value = ''
        nameLocale.value = Locale.EnUs
    }
}

const handleRemoveHealthcareProfessionalName = (index: number) => {
    healthCareProfessionalNameArray.value.splice(index, 1)
}

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
                    break
            }
        }
    }
}

async function submitForm(e: Event) {
    // stop the form submitting before we validate
    e.preventDefault()

    const isValid = validateFields()
    if (!isValid) {
        return
    }

    const id = formSubmissionId || ''

    if (!id) {
        console.error('Facility ID is required for updating the facility')
        return
    }

    const submissionInputVariables: MutationUpdateSubmissionArgs = {
        id,
        input: {
            isUnderReview: true,
            facility: {
                nameEn: nameEn.value || '',
                nameJa: nameJp.value || '',
                contact: {
                    googleMapsUrl: googlemapsURL.value || '',
                    email: email.value || '',
                    phone: phone.value || '',
                    website: website.value || '',
                    address: {
                        postalCode: postalCode.value || '',
                        prefectureEn: prefectureEn.value || '',
                        cityEn: cityEn.value || '',
                        addressLine1En: addressLine1En.value || '',
                        addressLine2En: addressLine2En.value || '',
                        prefectureJa: prefectureJp.value || '',
                        cityJa: cityJp.value || '',
                        addressLine1Ja: addressLine1Jp.value || '',
                        addressLine2Ja: addressLine2Jp.value || ''
                    }
                },
                healthcareProfessionalIds: [],
                mapLatitude: parseFloat(mapLatitude.value) || 0,
                mapLongitude: parseFloat(mapLongitude.value) || 0
            }
        }
    }

    try {
        await graphQLClientRequestWithRetry(
            gqlClient.request.bind(gqlClient),
            updateFacilitySubmissionGqlMutation,
            submissionInputVariables
        )
        router.push('/moderation')
    } catch (error) {
        console.error('Failed to update submission:', error)
        moderationSubmissionStore.setDidMutationFail(true)
    }
}

const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true })

watch(moderationSubmissionStore, newValue => {
    if (newValue.updatingMutationFromTopBar) {
        submitForm(syntheticEvent)
    }
})

watch(moderationSubmissionStore, newValue => {
    moderationSubmissionStore.filterSelectedSubmission(newValue.selectedSubmissionId)
    autofillEditSubmissionForm(newValue.selectedSubmissionData)
})

onMounted(() => {
    multiSelectWithoutKeyboard(
        '#healthcare-professional-accepted-insurances',
        healthcareProfessionalAcceptedInsurances,
        extractInsuranceOptions
    )

    multiSelectWithoutKeyboard(
        '#healthcare-professional-degrees',
        healthcareProfessionalDegrees,
        extractDegreeOptions
    )

    multiSelectWithoutKeyboard(
        '#healthcare-professional-specialties',
        healthcareProfessionalSpecialties,
        extractSpecialtyOptions
    )

    multiSelectWithoutKeyboard(
        '#healthcare-professional-locales',
        healthcareProfessionalLocales,
        extractLocaleOptions
    )
})

const updateFacilitySubmissionGqlMutation = gql`
mutation Mutation($id: ID!, $input: UpdateSubmissionInput!) {
  updateSubmission(id: $id, input: $input) {
    isUnderReview
    facility {
      id
      nameEn
      nameJa
      contact {
        googleMapsUrl
        email
        phone
        website
        address {
          postalCode
          prefectureEn
          cityEn
          addressLine1En
          addressLine2En
          prefectureJa
          cityJa
          addressLine1Ja
          addressLine2Ja
        }
      }
      healthcareProfessionalIds
      mapLatitude
      mapLongitude
    }
  }
}`
</script>
