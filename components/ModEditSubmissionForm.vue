<template>
    <div
        v-show="modalStore.isOpen"
        class="fixed top-0 left-0 flex items-center justify-center h-full w-full z-10 bg-secondary bg-opacity-40"
    >
        <Modal
            data-testid="submission-form-modal"
        >
            <div
                v-if="moderationSubmissionStore.approvingSubmissionFromTopBar"
                class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
            >
                <span class="font-bold text-3xl">
                    {{ $t('modSubmissionForm.submissionConfirmationMessage') }}
                </span>
                <button
                    type="button"
                    class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                    @click="submitCompletedForm"
                >
                    {{ $t('modSubmissionForm.submissionConfirmationAcceptanceButton') }}
                </button>
            </div>
            <div
                v-else
                class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
            >
                <span class="font-bold text-3xl">{{ $t('modSubmissionForm.hasUnsavedChanges') }}</span>
                <button
                    type="button"
                    data-testid="submission-form-modal-confirmation-btn"
                    class="bg-secondary p-4 rounded-full my-8 font-semibold text-xl hover:bg-primary"
                    @click="handleNavigateToModerationScreen"
                >
                    {{ $t('modSubmissionForm.confirmationButton') }}
                </button>
            </div>
        </Modal>
    </div>
    <form
        class="p-4 h-full overflow-y-auto"
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
                :input-validation-check="validateNameEn"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityNameEn')"
            />
            <ModInputField
                v-model="submissionFormFields.nameJa.value"
                data-testid="submission-form-nameJa"
                :label="$t('modSubmissionForm.labelFacilityNameJa')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityNameJa')"
                :required="true"
                :input-validation-check="validateNameJa"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityNameJa')"
            />
            <ModInputField
                v-model="submissionFormFields.phone.value"
                data-testid="submission-form-phone"
                :label="$t('modSubmissionForm.labelFacilityPhoneNumber')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityPhoneNumber')"
                :required="true"
                :input-validation-check="validatePhoneNumber"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityPhoneNumber')"
            />
            <ModInputField
                v-model="submissionFormFields.email.value"
                data-testid="submission-form-email"
                :label="$t('modSubmissionForm.labelFacilityEmail')"
                type="email"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityEmail')"
                :required="false"
                :input-validation-check="validateEmail"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityEmail')"
            />
            <ModInputField
                v-model="submissionFormFields.website.value"
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
                v-model="submissionFormFields.postalCode.value"
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
                :input-validation-check="validateCityEn"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityCityEn')"
            />
            <ModInputField
                v-model="submissionFormFields.addressLine1En.value"
                data-testid="submission-form-addressLine1En"
                :label="$t('modSubmissionForm.labelFacilityAddressLine1En')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine1En')"
                :required="true"
                :input-validation-check="validateAddressLineEn"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine1En')"
            />
            <ModInputField
                v-model="submissionFormFields.addressLine2En.value"
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
                :input-validation-check="validateCityJa"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityCityJa')"
            />
            <ModInputField
                v-model="submissionFormFields.addressLine1Ja.value"
                data-testid="submission-form-addressLine1Ja"
                :label="$t('modSubmissionForm.labelFacilityAddressLine1Ja')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine1Ja')"
                :required="true"
                :input-validation-check="validateAddressLineJa"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine1Ja')"
            />
            <ModInputField
                v-model="submissionFormFields.addressLine2Ja.value"
                data-testid="submission-form-addressLine2Ja"
                :label="$t('modSubmissionForm.labelFacilityAddressLine2Ja')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine2Ja')"
                :required="true"
                :input-validation-check="validateAddressLineJa"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine2Ja')"
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
                v-model="submissionFormFields.googlemapsURL.value"
                data-testid="submission-form-google-maps"
                :label="$t('modSubmissionForm.labelFacilityGoogleMapsUrl')"
                type="url"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityGoogleMapsUrl')"
                :required="true"
                :input-validation-check="validateWebsite"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityGoogleMapsUrl')"
                :autofill-value="submissionFormFields.googlemapsURL.value"
            />
            <ModInputField
                v-model="submissionFormFields.mapLatitude.value"
                data-testid="submission-form-mapLatitude"
                :label="$t('modSubmissionForm.labelFacilityMapLatitude')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityMapLatitude')"
                :required="true"
                :input-validation-check="validateFloat"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityMapLatitude')"
            />
            <ModInputField
                v-model="submissionFormFields.mapLongitude.value"
                data-testid="submission-form-mapLongitude"
                :label="$t('modSubmissionForm.labelFacilityMapLongitude')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityMapLongitude')"
                :required="true"
                :input-validation-check="validateFloat"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityMapLongitude')"
            />
        </div>
        <ModHealthcareProfessionalSearchbar data-testid="submission-form-doctor-search" />
        <h2
            :id="ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalName"
            class="submission-form-section mb-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
        >
            {{ $t('modSubmissionForm.healthcareProfessionalNameHeading') }}
        </h2>
        <div class="flex flex-col my-4">
            <ModInputField
                v-model="submissionFormFields.localizedLastName.value"
                data-testid="submission-form-last-name"
                :label="$t('modSubmissionForm.labelHealthcareProfessionalLastName')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextHealthcareProfessionalLastName')"
                :required="false"
            />
            <ModInputField
                v-model="submissionFormFields.localizedFirstName.value"
                data-testid="submission-form-first-name"
                :label="$t('modSubmissionForm.labelHealthcareProfessionalFirstName')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextHealthcareProfessionalFirstName')"
                :required="false"
            />
            <ModInputField
                v-model="submissionFormFields.localizedMiddleName.value"
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
                v-model="submissionFormFields.nameLocale.value"
                data-testid="submission-form-locale"
                name="Name Locales"
                class="mb-5 px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(locale, index) in formattedLanguages"
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
            <div
                v-if="submissionFormFields.healthCareProfessionalNameArray.value.length"
                class="flex flex-wrap"
            >
                <div
                    v-for="(healthcareProfessionalName, index) in submissionFormFields.healthCareProfessionalNameArray.value"
                    :key="`${healthcareProfessionalName.firstName}-${index}`"
                    class="flex basis-1/3 justify-start items-center"
                >
                    <div
                        class="flex justify-center items-center rounded-lg p-3 border-2 border-primary"
                        :data-testid="`mod-submission-list-item-${index + 1}`"
                    >
                        <div>
                            <div class="flex font-bold">
                                <SVGProfileIcon
                                    role="img"
                                    alt="profile icon"
                                    title="profile icon"
                                    class="profile-icon w-6 h-6 stroke-primary stroke-1 inline mx-1"
                                />
                                <span>{{ healthcareProfessionalName.lastName }}</span>
                                <span class="mx-2">{{ healthcareProfessionalName.firstName }}</span>
                                <span v-show="healthcareProfessionalName.middleName">
                                    {{ healthcareProfessionalName.middleName }}
                                </span>
                            </div>
                            <div
                                class="w-fit px-2 py-[1px] my-2 border border-primary/40 rounded-full
                                shadow text-sm text-center hover:bg-primary/20 transition-all"
                            >
                                {{ localeStore.formatLanguages(
                                    [healthcareProfessionalName.locale], localeStore.localeDisplayOptions)[0] }}
                            </div>
                        </div>
                        <span
                            class="flex items-center justify-center
                            cursor-pointer font-bold text-secondary text-sm"
                            @click="() => handleRemoveHealthcareProfessionalName(index)"
                        >
                            <SVGTrashCan class="flex items-center justify-center w-6 h-6" /> {{
                                $t('modSubmissionForm.delete') }}
                        </span>
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
                v-model="submissionFormFields.healthcareProfessionalAcceptedInsurances.value"
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
                v-model="submissionFormFields.healthcareProfessionalDegrees.value"
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
                v-model="submissionFormFields.healthcareProfessionalSpecialties.value"
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
                v-model="submissionFormFields.healthcareProfessionalLocales.value"
                data-testid="submission-form-locales"
                name="Locales"
                multiple
                class="mb-5 px-3 py-3.5 w-96 h-32 bg-secondary-bg rounded-lg border border-primary-text-muted
                        text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            >
                <option
                    v-for="(locale, index) in formattedLanguages"
                    :key="`${locale}-${index}`"
                    :value="locale"
                >
                    {{ locale }}
                </option>
            </select>
        </div>
        <button
            type="submit"
            class="bg-currentColor text-white font-bold py-2 px-4 my-2 rounded w-56"
            @click="submitUpdatedSubmission"
        >
            {{ $t('modSubmissionForm.updateButtonText') }}
        </button>
    </form>
</template>

<script lang="ts" setup>
import { type Ref, ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast, type ToastInterface } from 'vue-toastification'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import { Locale,
    type Submission,
    type MutationUpdateSubmissionArgs,
    type LocalizedNameInput,
    Insurance,
    Degree,
    Specialty } from '~/typedefs/gqlTypes'
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
import { ModSubmissionLeftNavbarSectionIDs, useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import { onBeforeRouteLeave } from '#app'
import { useI18n } from '#imports'
import { multiSelectWithoutKeyboard } from '~/utils/multiSelectWithoutKeyboard'
import { useModalStore } from '~/stores/modalStore'
import SVGTrashCan from '~/assets/icons/trash-can.svg'
import SVGProfileIcon from '~/assets/icons/profile-icon.svg'
import { triggerFormValidationErrorMessages } from '~/utils/triggerFormValidationErrorMessages'
import { useLocaleStore } from '~/stores/localeStore'
/**
This initalizes the variable that needs to be set on mount.
If this is set as a const the build will fail since the plugin
for vue-toastification is only available onMounted of the component
through Nuxt
 */
let toast: ToastInterface

const { t } = useI18n()
const router = useRouter()

const moderationSubmissionStore = useModerationSubmissionsStore()
const modalStore = useModalStore()
const screenStore = useModerationScreenStore()
const localeStore = useLocaleStore()

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
    mapLongitude: ref('') as Ref<string>,
    //healthcareProfessionalFields
    healthCareProfessionalNameArray: ref([]) as Ref<Array<LocalizedNameInput>>,
    localizedFirstName: ref('') as Ref<string>,
    localizedLastName: ref('') as Ref<string>,
    localizedMiddleName: ref('') as Ref<string>,
    nameLocale: ref(Locale.EnUs) as Ref<Locale>,
    healthcareProfessionalAcceptedInsurances: ref([]) as Ref<Array<Insurance>>,
    healthcareProfessionalDegrees: ref([]) as Ref<Array<Degree>>,
    healthcareProfessionalSpecialties: ref([]) as Ref<Array<Specialty>>,
    healthcareProfessionalLocales: ref([]) as Ref<Array<Locale>>,
    isApproved: ref(false) as Ref<boolean>,
    isUnderReview: ref(false) as Ref<boolean>
} as { [key: string]: Ref }

const submissionBeforeChanges: { [key: string]: (string | []) } = {}

// Creating the necessary parts for the multi-select
const insuranceOptions = Object.values(Insurance) as Insurance[]
const extractInsuranceOptions = (option: HTMLOptionElement): Insurance => option.value as Insurance
const degreeOptions = Object.values(Degree) as Degree[]
const extractDegreeOptions = (option: HTMLOptionElement): Degree => option.value as Degree
const specialtyOptions = Object.values(Specialty) as Specialty[]
const extractSpecialtyOptions = (option: HTMLOptionElement): Specialty => option.value as Specialty
const localeOptions = Object.values(Locale) as Locale[]
const extractLocaleOptions = (option: HTMLOptionElement): Locale => option.value as Locale

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

const formSubmissionId = moderationSubmissionStore.selectedSubmissionId

moderationSubmissionStore.filterSelectedSubmission(formSubmissionId)
const formSubmissionData = moderationSubmissionStore.selectedSubmissionData
initializeSubmissionFormValues(formSubmissionData)

const handleLocalizedNameToSubmission = () => {
    const localizedNameToAdd: LocalizedNameInput = {
        firstName: submissionFormFields.localizedFirstName.value,
        lastName: submissionFormFields.localizedLastName.value,
        locale: submissionFormFields.nameLocale.value || Locale.EnUs,
        middleName: submissionFormFields.localizedMiddleName.value
    }

    if (localizedNameToAdd.firstName && localizedNameToAdd.lastName) {
        submissionFormFields.healthCareProfessionalNameArray.value.push(localizedNameToAdd)
        submissionFormFields.localizedFirstName.value = ''
        submissionFormFields.localizedLastName.value = ''
        submissionFormFields.localizedMiddleName.value = ''
        submissionFormFields.nameLocale.value = Locale.EnUs
    }
}

const handleRemoveHealthcareProfessionalName = (index: number) => {
    submissionFormFields.healthCareProfessionalNameArray.value.splice(index, 1)
}

const validateFacilityFields = () => {
    const isNameEnValid: boolean = validateNameEn(submissionFormFields.nameEn.value)
    const isNameJaValid: boolean = validateNameJa(submissionFormFields.nameJa.value)
    const isPhoneValid: boolean = validatePhoneNumber(submissionFormFields.phone.value)
    const isEmailValid: boolean = validateEmail(submissionFormFields.email.value)
    const isWebsiteValid: boolean = validateWebsite(submissionFormFields.website.value)
    const isAddressLine1EnValid: boolean = validateAddressLineEn(submissionFormFields.addressLine1En.value)
    const isAddressLine2EnValid: boolean = validateAddressLineEn(submissionFormFields.addressLine2En.value)
    const isAddressLine1JaValid: boolean = validateAddressLineJa(submissionFormFields.addressLine1Ja.value)
    const isAddressLine2JaValid: boolean = validateAddressLineJa(submissionFormFields.addressLine2Ja.value)
    const isCityEnValid: boolean = validateCityEn(submissionFormFields.cityEn.value)
    const isCityJaValid: boolean = validateCityJa(submissionFormFields.cityJa.value)
    const isPostalCodeValid: boolean = validatePostalCode(submissionFormFields.postalCode.value)
    const isLatitudeValid: boolean = validateFloat(submissionFormFields.mapLatitude.value)
    const isLongitudeValid: boolean = validateFloat(submissionFormFields.mapLongitude.value)

    //this will populate error messages if a field is not valid
    triggerFormValidationErrorMessages('mod-input-field')

    //This checks to make sure all the facility fields are valid.
    // If they are we can return true and manipulate other parts of the code based on this value
    const areAllTheFacilityFieldsValid = isNameEnValid && isNameJaValid && isPhoneValid && isEmailValid && isWebsiteValid
      && isAddressLine1EnValid && isAddressLine2EnValid && isAddressLine1JaValid && isAddressLine2JaValid && isCityEnValid
      && isCityJaValid && isPostalCodeValid && isLatitudeValid && isLongitudeValid
        ? true
        : false

    return areAllTheFacilityFieldsValid
}

const validateHealthcareProfessionalFields = () => {
    const areNamesSelectedToFacility: boolean
        = submissionFormFields.healthCareProfessionalNameArray.value.length > 0
        || submissionFormFields.healthcareProfessionalIDs.value.length > 0
    const areInsurancesSelected: boolean = submissionFormFields.healthcareProfessionalAcceptedInsurances.value.length > 0
    const areDegreesSelected: boolean = submissionFormFields.healthcareProfessionalDegrees.value.length > 0
    const areSpecialtiesSelected: boolean = submissionFormFields.healthcareProfessionalSpecialties.value.length > 0
    const areLocalesSelected: boolean = submissionFormFields.healthcareProfessionalLocales.value.length > 0

    const areAllFieldsValid = areNamesSelectedToFacility
      && areInsurancesSelected && areDegreesSelected
      && areSpecialtiesSelected && areLocalesSelected

    return areAllFieldsValid
}

function initializeSubmissionFormValues(submissionData: Submission | undefined) {
    const submittedHealthcareProfessionalName = submissionData?.healthcareProfessionalName?.split(' ')

    for (const key in submissionData) {
        if (submissionData[key as keyof Submission]) {
            switch (key) {
                case 'facility':
                    submissionFormFields.nameEn.value = submissionData['facility']?.nameEn || ''
                    submissionFormFields.nameJa.value = submissionData['facility']?.nameJa || ''
                    submissionFormFields.phone.value = submissionData['facility']?.contact?.phone || ''
                    submissionFormFields.email.value = submissionData['facility']?.contact?.email || ''
                    submissionFormFields.website.value = submissionData['facility']?.contact?.website || ''
                    submissionFormFields.postalCode.value = submissionData['facility']?.contact?.address.postalCode || ''
                    submissionFormFields.prefectureEn.value = submissionData['facility']?.contact?.address.prefectureEn || ''
                    submissionFormFields.cityEn.value = submissionData['facility']?.contact?.address.cityEn || ''
                    submissionFormFields.addressLine1En.value = submissionData['facility']?.contact?.address.addressLine1En || ''
                    submissionFormFields.addressLine2En.value = submissionData['facility']?.contact?.address.addressLine2En || ''
                    submissionFormFields.prefectureJa.value = submissionData['facility']?.contact?.address.prefectureJa || ''
                    submissionFormFields.cityJa.value = submissionData['facility']?.contact?.address.cityJa || ''
                    submissionFormFields.addressLine1Ja.value = submissionData['facility']?.contact?.address.addressLine1Ja || ''
                    submissionFormFields.addressLine2Ja.value = submissionData['facility']?.contact?.address.addressLine2Ja || ''
                    submissionFormFields.mapLatitude.value = submissionData['facility']?.mapLatitude?.toString() || ''
                    submissionFormFields.mapLongitude.value = submissionData['facility']?.mapLongitude?.toString() || ''
                    break
                case 'googleMapsUrl':
                    submissionFormFields.googlemapsURL.value
                    = submissionData['facility']?.contact?.googleMapsUrl || submissionData['googleMapsUrl']
                    break
                case 'healthcareProfessionals':
                    if (submittedHealthcareProfessionalName && submittedHealthcareProfessionalName.length === 2) {
                        submissionFormFields.healthCareProfessionalNameArray.value
                            = submissionData?.healthcareProfessionals?.[0]?.names ?? [{
                                firstName: submittedHealthcareProfessionalName[0] || '',
                                lastName: submittedHealthcareProfessionalName[1] || '',
                                locale: Locale.Und
                            }]
                    }
                    if (submittedHealthcareProfessionalName && submittedHealthcareProfessionalName.length === 3) {
                        submissionFormFields.healthCareProfessionalNameArray.value
                        = submissionData?.healthcareProfessionals?.[0]?.names ?? [{
                                firstName: submittedHealthcareProfessionalName[0] || '',
                                middleName: submittedHealthcareProfessionalName[1] || '',
                                lastName: submittedHealthcareProfessionalName[2] || '',
                                locale: Locale.Und
                            }]
                    }
                    submissionFormFields.healthcareProfessionalAcceptedInsurances.value
                        = submissionData?.healthcareProfessionals?.[0]?.acceptedInsurance
                        ?? []
                    submissionFormFields.healthcareProfessionalDegrees.value
                        = submissionData?.healthcareProfessionals?.[0]?.degrees
                        ?? []
                    submissionFormFields.healthcareProfessionalSpecialties.value
                        = submissionData?.healthcareProfessionals?.[0]?.specialties
                        ?? []
                    submissionFormFields.healthcareProfessionalLocales.value
                        = submissionData?.healthcareProfessionals?.[0]?.spokenLanguages
                        ?? []
                    break
                case 'healthcareProfessionalIDs':
                    submissionFormFields.healthcareProfessionalIDs.value
                    = submissionData.facility?.healthcareProfessionalIds ?? []
                    break
                case 'isApproved':
                    submissionFormFields.isApproved.value = submissionData.isApproved
                    break
                case 'isUnderReview':
                    submissionFormFields.isUnderReview.value = submissionData.isUnderReview
            }
        }
    }
    for (const key in submissionFormFields) {
        submissionBeforeChanges[key] = submissionFormFields[key].value
    }
}

const submissionHasUnsavedChanges = () => {
    for (const key in submissionFormFields) {
        if (submissionBeforeChanges[key] !== submissionFormFields[key].value) {
            return true
        }
    }
    return false
}

async function submitUpdatedSubmission(e: Event) {
    // Prevent form submission before validation is completed.
    e.preventDefault()

    const id = formSubmissionId || ''

    if (!id) {
        toast.error(t('modSubmissionForm.errorMessageFacilityId'))
        console.error(t('modSubmissionForm.errorMessageFacilityId'))
        return
    }

    const submissionInputVariables: MutationUpdateSubmissionArgs = {
        id: formSubmissionId,
        input: {
            isUnderReview: true,
            facility: {
                nameEn: submissionFormFields.nameEn.value,
                nameJa: submissionFormFields.nameJa.value,
                contact: {
                    googleMapsUrl: submissionFormFields.googlemapsURL.value,
                    email: submissionFormFields.email.value,
                    phone: submissionFormFields.phone.value,
                    website: submissionFormFields.website.value,
                    address: {
                        postalCode: submissionFormFields.postalCode.value,
                        prefectureEn: submissionFormFields.prefectureEn.value,
                        cityEn: submissionFormFields.cityEn.value,
                        addressLine1En: submissionFormFields.addressLine1En.value,
                        addressLine2En: submissionFormFields.addressLine2En.value,
                        prefectureJa: submissionFormFields.prefectureJa.value,
                        cityJa: submissionFormFields.cityJa.value,
                        addressLine1Ja: submissionFormFields.addressLine1Ja.value,
                        addressLine2Ja: submissionFormFields.addressLine2Ja.value
                    }
                },
                healthcareProfessionalIds: [],
                mapLatitude: parseFloat(submissionFormFields.mapLatitude.value) || 0,
                mapLongitude: parseFloat(submissionFormFields.mapLongitude.value) || 0
            },
            healthcareProfessionals: [
                {
                    acceptedInsurance: submissionFormFields.healthcareProfessionalAcceptedInsurances.value,
                    degrees: submissionFormFields.healthcareProfessionalDegrees.value,
                    specialties: submissionFormFields.healthcareProfessionalSpecialties.value,
                    spokenLanguages: submissionFormFields.healthcareProfessionalLocales.value,
                    names: submissionFormFields.healthCareProfessionalNameArray.value,
                    facilityIds: []
                }
            ]
        }
    }
    try {
        const result = await moderationSubmissionStore.updateSubmission(submissionInputVariables)
        const submissionResult = result as { updateSubmission: Submission }
        // This updates the submission in the form with the values stored in the db on success
        initializeSubmissionFormValues(submissionResult.updateSubmission as Submission)
        toast.success(t('modSubmissionForm.successMessageUpdated'))
        if (moderationSubmissionStore.updatingSubmissionFromTopBar) {
            router.push('/moderation')
            moderationSubmissionStore.setUpdatingSubmissionFromTopBar(false)
        }
    } catch {
        toast.error(t('modSubmissionForm.errorMessageUpdated'))
    }
}

async function submitCompletedForm(e: Event) {
    // stop the form submitting before we validate
    e.preventDefault()

    //This prevents submission of an already approved submission the backend does this but as an extra visual and check
    if (submissionFormFields.isApproved.value) {
        toast.info(t('modSubmissionForm.infoMessageAlreadyApproved'))
        return
    }

    if (!submissionFormFields.isUnderReview.value) {
        toast.info(t('modSubmissionForm.infoMessageUpdateNeeded'))
        return
    }

    const isValidFacility = validateFacilityFields()
    const isValidHealthcareProfessional = validateHealthcareProfessionalFields()

    //This shows a toast and returns if the facility fields arent valid
    if (!isValidFacility) {
        toast.error(t('modSubmissionForm.errorMessageFacilityInputsInvalid'))
        return
    }

    if (!isValidHealthcareProfessional) {
        toast.error(t('modSubmissionForm.errorMessageHealthcareInputsInvalid'))
        return
    }

    try {
        await moderationSubmissionStore.approveSubmission()
        modalStore.hideModal()
        toast.success(t('modSubmissionForm.successMessageApproved'))
        router.push('/moderation')
    } catch {
        toast.error(t('modSubmissionForm.errorMessageCompletedForm'))
    }
}

const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true })

watch(moderationSubmissionStore, newValue => {
    //saves the submission by updating it and then going to the main
    if (newValue.updatingSubmissionFromTopBar) {
        submitUpdatedSubmission(syntheticEvent)
    }
})

watch(moderationSubmissionStore, newValue => {
    moderationSubmissionStore.filterSelectedSubmission(newValue.selectedSubmissionId)
    initializeSubmissionFormValues(newValue.selectedSubmissionData)
})

onMounted(() => {
    multiSelectWithoutKeyboard(
        '#healthcare-professional-accepted-insurances',
        submissionFormFields.healthcareProfessionalAcceptedInsurances,
        extractInsuranceOptions
    )

    multiSelectWithoutKeyboard(
        '#healthcare-professional-degrees',
        submissionFormFields.healthcareProfessionalDegrees,
        extractDegreeOptions
    )

    multiSelectWithoutKeyboard(
        '#healthcare-professional-specialties',
        submissionFormFields.healthcareProfessionalSpecialties,
        extractSpecialtyOptions
    )

    multiSelectWithoutKeyboard(
        '#healthcare-professional-locales',
        submissionFormFields.healthcareProfessionalLocales,
        extractLocaleOptions
    )

    /**
    Set the variable to useToast when the compoenet mounts
    since vue-taostification is only available on the client.
    If not done this way the build fails
     */
    toast = useToast()
})

const handleNavigateToModerationScreen = () => {
    modalStore.hideModal()
    screenStore.setActiveScreen(ModerationScreen.Dashboard)
    router.push('/moderation')
}

onBeforeRouteLeave(async (to, from, next) => {
    if (!moderationSubmissionStore.updatingSubmissionFromTopBar && submissionHasUnsavedChanges()) {
        modalStore.showModal()
        next(false)
        return
    }
    next()
})

const formattedLanguages = computed(() => localeStore.formatLanguages(localeOptions, localeStore.localeDisplayOptions))
</script>
