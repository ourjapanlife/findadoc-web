<!-- eslint-disable vue/no-spaces-around-equal-signs-in-attribute -->
<template>
    <Loader />
    <div>
        <Modal
            data-testid="submission-form-modal"
            @modal-closed="resetModalRefs"
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
                v-if="moderationSubmissionStore.showRejectSubmissionConfirmation"
                data-testid="reject-confirmation"
                class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
            >
                <span class="font-bold text-3xl">
                    {{ $t('modSubmissionForm.rejectSubmissionConfirmationMessage') }}
                </span>
                <button
                    data-testid="reject-submission-confirmation-btn"
                    type="button"
                    class="bg-primary p-4 rounded-full my-8 font-semibold text-xl"
                    @click="rejectSubmission"
                >
                    {{ $t('modSubmissionForm.rejectSubmissionConfirmationButton') }}
                </button>
            </div>
            <div
                v-if="formHasUnsavedChanges"
                class="flex flex-col aspect-square h-96 items-center justify-around bg-primary-inverted p-10 rounded"
            >
                <span class="font-bold text-3xl">{{ $t('modSubmissionForm.hasUnsavedChanges') }}</span>
                <button
                    type="button"
                    data-testid="submission-unsaved-confirmation-btn"
                    class="bg-secondary p-4 rounded-full my-8 font-semibold text-xl hover:bg-primary"
                    @click="handleNavigateToModerationScreen"
                >
                    {{ $t('modSubmissionForm.confirmationButton') }}
                </button>
            </div>
        </Modal>
    </div>
    <form
        v-if="!loadingStore.isLoading"
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
                v-model="submissionFormFields.nameEn"
                data-testid="submission-form-nameEn"
                :label="$t('modSubmissionForm.labelFacilityNameEn')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityNameEn')"
                :required="true"
                :input-validation-check="validateNameEn"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityNameEn')"
            />
            <ModInputField
                v-model="submissionFormFields.nameJa"
                data-testid="submission-form-nameJa"
                :label="$t('modSubmissionForm.labelFacilityNameJa')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityNameJa')"
                :required="true"
                :input-validation-check="validateNameJa"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityNameJa')"
            />
            <ModInputField
                v-model="submissionFormFields.phone"
                data-testid="submission-form-phone"
                :label="$t('modSubmissionForm.labelFacilityPhoneNumber')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityPhoneNumber')"
                :required="true"
                :input-validation-check="validatePhoneNumber"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityPhoneNumber')"
            />
            <ModInputField
                v-model="submissionFormFields.email"
                data-testid="submission-form-email"
                :label="$t('modSubmissionForm.labelFacilityEmail')"
                type="email"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityEmail')"
                :required="false"
                :input-validation-check="validateEmail"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityEmail')"
            />
            <ModInputField
                v-model="submissionFormFields.website"
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
                v-model="submissionFormFields.postalCode"
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
                    for="mod-edit-submission-form-prefecture-select-en"
                    class="mb-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ $t('modSubmissionForm.labelFacilityPrefectureEn') }}
                </label>
                <select
                    id="mod-edit-submission-form-prefecture-select-en"
                    v-model="submissionFormFields.prefectureEn"
                    data-testid="submission-form-prefectureEn"
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
                v-model="submissionFormFields.cityEn"
                data-testid="submission-form-cityEn"
                :label="$t('modSubmissionForm.labelFacilityCityEn')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityCityEn')"
                :required="true"
                :input-validation-check="validateCityEn"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityCityEn')"
            />
            <ModInputField
                v-model="submissionFormFields.addressLine1En"
                data-testid="submission-form-addressLine1En"
                :label="$t('modSubmissionForm.labelFacilityAddressLine1En')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine1En')"
                :required="true"
                :input-validation-check="validateAddressLineEn"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine1En')"
            />
            <ModInputField
                v-model="submissionFormFields.addressLine2En"
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
                    for="mod-edit-submission-form-prefecture-select-ja"
                    class="mb-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ $t('modSubmissionForm.labelFacilityPrefectureJa') }}
                </label>
                <select
                    id="mod-edit-submission-form-prefecture-select-ja"
                    v-model="submissionFormFields.prefectureJa"
                    data-testid="submission-form-prefectureJa"
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
                v-model="submissionFormFields.cityJa"
                data-testid="submission-form-cityJa"
                :label="$t('modSubmissionForm.labelFacilityCityJa')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityCityJa')"
                :required="true"
                :input-validation-check="validateCityJa"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityCityJa')"
            />
            <ModInputField
                v-model="submissionFormFields.addressLine1Ja"
                data-testid="submission-form-addressLine1Ja"
                :label="$t('modSubmissionForm.labelFacilityAddressLine1Ja')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine1Ja')"
                :required="true"
                :input-validation-check="validateAddressLineJa"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine1Ja')"
            />
            <ModInputField
                v-model="submissionFormFields.addressLine2Ja"
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
                v-model="submissionFormFields.googlemapsURL"
                data-testid="submission-form-google-maps"
                :label="$t('modSubmissionForm.labelFacilityGoogleMapsUrl')"
                type="url"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityGoogleMapsUrl')"
                :required="true"
                :input-validation-check="validateGoogleMapsUrlInput"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityGoogleMapsUrl')"
                :autofill-value="submissionFormFields.googlemapsURL"
            />
            <ModInputField
                v-model="submissionFormFields.mapLatitude"
                data-testid="submission-form-mapLatitude"
                :label="$t('modSubmissionForm.labelFacilityMapLatitude')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityMapLatitude')"
                :required="true"
                :input-validation-check="validateFloat"
                :invalid-input-error-message="$t('modSubmissionForm.inputErrorMessageFacilityMapLatitude')"
            />
            <ModInputField
                v-model="submissionFormFields.mapLongitude"
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
            <div class="input-fields flex flex-col my-4">
                <Transition
                    enter-active-class="transition-all ease-in-out duration-300"
                    leave-active-class="transition-all ease-in-out duration-300"
                    enter-from-class="opacity-0 max-h-0"
                    enter-to-class="opacity-100 max-h-[500px]"
                    leave-from-class="opacity-100 max-h-[500px]"
                    leave-to-class="opacity-0 max-h-0"
                >
                    <div
                        v-show="addingNewNameLocaleForHealthcareProfessional
                            || editingExistingNameLocaleForHealthcareProfessional"
                        :class="[
                            'name-locale-input-fields rounded-lg border-2 border-primary flex flex-col px-2 w-fit',
                            editingExistingNameLocaleForHealthcareProfessional
                                ? 'rounded-b-none border-b-0 pb-5' : 'rounded-lg border-2 border-primary',
                        ]"
                    >
                        <ModInputField
                            v-model="nameLocaleInputsToAddOrUpdate.lastName"
                            data-testid="mod-healthcare-professional-section-lastName"
                            :label="$t('modHealthcareProfessionalSection.labelHealthcareProfessionalLastName')"
                            type="text"
                            :placeholder=
                                "$t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalLastName')"
                            :required="true"
                        />
                        <ModInputField
                            v-model="nameLocaleInputsToAddOrUpdate.firstName"
                            data-testid="mod-healthcare-professional-section-firstName"
                            :label="$t('modHealthcareProfessionalSection.labelHealthcareProfessionalFirstName')"
                            type="text"
                            :placeholder=
                                "$t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalFirstName')"
                            :required="true"
                        />
                        <ModInputField
                            v-model="nameLocaleInputsToAddOrUpdate.middleName as string"
                            data-testid="mod-healthcare-professional-section-middleName"
                            :label="$t('modHealthcareProfessionalSection.labelHealthcareProfessionalMiddleName')"
                            type="text"
                            :placeholder=
                                "$t('modHealthcareProfessionalSection.placeholderTextHealthcareProfessionalMiddleName')"
                            :required="false"
                        />
                        <label
                            for="mod-edit-submission-form-name-locales"
                            class="my-2 text-primary-text text-sm font-bold font-sans"
                        >
                            {{ $t('modHealthcareProfessionalSection.labelHealthcareProfessionalNameLocale') }}
                        </label>
                        <select
                            id="mod-edit-submission-form-name-locales"
                            v-model="nameLocaleInputsToAddOrUpdate.locale"
                            data-testid="mod-healthcare-professional-section-name-locale"
                            name="name-locales"
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
                        <div
                            v-show="addingNewNameLocaleForHealthcareProfessional"
                            class="flex justify-between w-96"
                        >
                            <button
                                class="bg-primary text-primary-text-inverted font-bold py-2 px-4 my-2 rounded w-36"
                                type="button"
                                @click="handleAddLocalizedName"
                            >
                                {{ $t('modHealthcareProfessionalSection.save') }}
                            </button>
                            <button
                                class="bg-error text-primary-text-inverted font-bold py-2 px-4 my-2 rounded w-36"
                                type="button"
                                @click="handleCloseAddingNewLocalizedName"
                            >
                                {{ $t('modHealthcareProfessionalSection.exit') }}
                            </button>
                        </div>
                        <div
                            v-show="editingExistingNameLocaleForHealthcareProfessional"
                            class="flex justify-between w-96"
                        >
                            <button
                                class="bg-primary text-primary-text-inverted font-bold py-2 px-4 my-2 rounded w-36"
                                type="button"
                                @click="handleUpdateExistingName"
                            >
                                {{ $t('modHealthcareProfessionalSection.update') }}
                            </button>
                            <button
                                class="bg-error text-primary-text-inverted font-bold py-2 px-4 my-2 rounded w-36"
                                type="button"
                                @click="handleDeleteExistingName"
                            >
                                {{ $t('modHealthcareProfessionalSection.delete') }}
                            </button>
                        </div>
                    </div>
                </Transition>
                <div
                    v-if="submissionFormFields.healthCareProfessionalNameArray"
                    class="flex flex-col"
                >
                    <div
                        v-for="(nameLocale, index) in submissionFormFields.healthCareProfessionalNameArray"
                        :key="`${nameLocale.firstName}-${nameLocale.lastName}-${index}`"
                        @click="() => setChosenLocaleNameInput(index)"
                    >
                        <ModDashboardHealthProfessionalCard
                            :healthcare-professional-name-by-locale="nameLocale"
                            :chosen-locale-index="index"
                            :is-editable="editingExistingNameLocaleForHealthcareProfessional"
                            :set-is-editable-function="setEditingLocaleName"
                        />
                    </div>
                </div>
                <button
                    type="button"
                    data-testid="mod-healthcare-add-name-button"
                    class="bg-tertiary text-primary-text-inverted font-bold py-2 px-4 my-2 rounded w-44"
                    @click="handleOpenAddNewNameWithReset"
                >
                    {{ $t('modHealthcareProfessionalSection.addHealthCareProfessionalLocaleName') }}
                </button>
            </div>
            <div class="flex flex-col">
                <h2
                    :id="ModSubmissionLeftNavbarSectionIDs.HealthcareProfessionalMedicalInfo"
                    class="submission-form-section
                    my-3.5 text-start text-primary-text text-2xl font-bold font-sans leading-normal"
                >
                    {{ $t('modSubmissionForm.healthcareProfessionalMedicalInfoHeading') }}
                </h2>
                <label
                    for="accepted-insurances"
                    class="my-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ $t("modSubmissionForm.selectInsurances") }}
                </label>
                <ModSearchBar
                    v-model="submissionFormFields.healthcareProfessionalAcceptedInsurances"
                    data-testid="submission-form-accepted-insurances"
                    :place-holder-text="$t('modSubmissionForm.placeholderTextAcceptedInsurances')"
                    :no-match-text="$t('modSubmissionForm.noInsurancesWereFound')"
                    :fields-to-display-callback="insurancesToDisplayCallback"
                    :default-suggestions="Object.values(Insurance)"
                    @search-input-change="handleInsuranceInputChange"
                />
                <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2">
                    <li
                        v-for="insurance in submissionFormFields.healthcareProfessionalAcceptedInsurances"
                        :key="`accepted-${insurance}`"
                        class="py-1"
                    >
                        {{ insurance }}
                    </li>
                </ol>
                <label
                    for="degrees"
                    class="my-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ $t("modSubmissionForm.selectDegrees") }}
                </label>
                <ModSearchBar
                    v-model="submissionFormFields.healthcareProfessionalDegrees"
                    data-testid="submission-form-degrees"
                    :place-holder-text="$t('modSubmissionForm.placeholderTextDegrees')"
                    :no-match-text="$t('modSubmissionForm.noDegreesWereFound')"
                    :fields-to-display-callback="degreesToDisplayCallback"
                    :default-suggestions="Object.values(Degree)"
                    @search-input-change="handleDegreeInputChange"
                />
                <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2">
                    <li
                        v-for="degree in submissionFormFields.healthcareProfessionalDegrees"
                        :key="`current-${degree}`"
                        class="py-1"
                    >
                        {{ degree }}
                    </li>
                </ol>
                <label
                    for="specialties"
                    class="my-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ $t("modSubmissionForm.selectSpecialties") }}
                </label>
                <ModSearchBar
                    v-model="submissionFormFields.healthcareProfessionalSpecialties"
                    data-testid="submission-form-specialties"
                    :place-holder-text="$t('modSubmissionForm.placeholderTextSpecialties')"
                    :no-match-text="$t('modSubmissionForm.noSpecialtiesWereFound')"
                    :fields-to-display-callback="specialtiesToDisplayCallback"
                    :default-suggestions="Object.values(Specialty)"
                    @search-input-change="handleSpecialtyInputChange"
                />
                <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2">
                    <li
                        v-for="specialty in submissionFormFields.healthcareProfessionalSpecialties"
                        :key="`current-${specialty}`"
                        class="py-1"
                    >
                        {{ specialty }}
                    </li>
                </ol>
                <label
                    for="locales"
                    class="my-2 text-primary-text text-sm font-bold font-sans"
                >
                    {{ $t("modSubmissionForm.selectLocales") }}
                </label>
                <ModSearchBar
                    v-model="submissionFormFields.healthcareProfessionalLocales"
                    data-testid="submission-form-locales"
                    :place-holder-text="$t('modSubmissionForm.placeholderTextLocales')"
                    :no-match-text="$t('modSubmissionForm.noLocalesWereFound')"
                    :fields-to-display-callback="localesToDisplayCallback"
                    :default-suggestions="Object.values(Locale)"
                    @search-input-change="handleLocaleInputChange"
                />
                <ol class="list-disc text-primary-text/60 font-semibold my-2 px-2">
                    <li
                        v-for="locale in submissionFormFields.healthcareProfessionalLocales"
                        :key="`spoken-${locale}`"
                        class="py-1"
                    >
                        {{ localeStore.formatLanguageCodeToSimpleText(locale) }}
                    </li>
                </ol>
            </div>
            <button
                type="button"
                class="bg-currentColor text-white font-bold py-2 px-4 my-2 rounded w-56"
                @click="submitUpdatedSubmission"
            >
                {{ $t('modSubmissionForm.updateButtonText') }}
            </button>
        </div>
    </form>
</template>

<script lang="ts" setup>
import { type Ref, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast, type ToastInterface } from 'vue-toastification'
import ModSearchBar from './ModSearchBar.vue'
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
import { useModalStore } from '~/stores/modalStore'
import { triggerFormValidationErrorMessages } from '~/utils/triggerFormValidationErrorMessages'
import { arraysAreEqual } from '~/utils/arrayUtils'
import { useLocaleStore } from '~/stores/localeStore'
import { handleServerErrorMessaging } from '~/utils/handleServerErrorMessaging'
import { listPrefectureJapanEn, listPrefectureJapanJa } from '~/stores/locationsStore'

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
const loadingStore = useLoadingStore()

const isEditSubmissionFormInitialized: Ref<boolean> = ref(false)
loadingStore.setIsLoading(true, 3000)

const submissionFormFields = reactive({
    // contactFields
    nameEn: '' as string,
    nameJa: '' as string,
    phone: '' as string,
    website: '' as string,
    email: '' as string,
    // addressesFields
    postalCode: '' as string,
    prefectureEn: '' as string,
    cityEn: '' as string,
    addressLine1En: '' as string,
    addressLine2En: '' as string,
    prefectureJa: '' as string,
    cityJa: '' as string,
    addressLine1Ja: '' as string,
    addressLine2Ja: '' as string,
    // googleMapsFields
    googlemapsURL: '' as string,
    mapLatitude: '' as string,
    mapLongitude: '' as string,
    //healthcareProfessionalFields
    healthCareProfessionalNameArray: [] as LocalizedNameInput[],
    healthcareProfessionalIDs: [] as string[],
    localizedFirstName: '' as string,
    localizedLastName: '' as string,
    localizedMiddleName: '' as string,
    nameLocale: Locale.EnUs as Locale,
    healthcareProfessionalAcceptedInsurances: [] as Insurance[],
    healthcareProfessionalDegrees: [] as Degree[],
    healthcareProfessionalSpecialties: [] as Specialty[],
    healthcareProfessionalLocales: [] as Locale[],
    notes: '' as string,
    isApproved: false as boolean,
    isUnderReview: false as boolean
})

/* This is used as an exact copy and not updated. This is to allow for change checks in values.
We can then provide a better user experience based on if they change the values or not
This is necessary because setting a variable directly in vue to the same as a reactive object
may not always work as intended*/
const submissionFormFieldsBeforeChanges = reactive({
    // contactFields
    nameEn: '' as string,
    nameJa: '' as string,
    phone: '' as string,
    website: '' as string,
    email: '' as string,
    // addressesFields
    postalCode: '' as string,
    prefectureEn: '' as string,
    cityEn: '' as string,
    addressLine1En: '' as string,
    addressLine2En: '' as string,
    prefectureJa: '' as string,
    cityJa: '' as string,
    addressLine1Ja: '' as string,
    addressLine2Ja: '' as string,
    // googleMapsFields
    googlemapsURL: '' as string,
    mapLatitude: '' as string,
    mapLongitude: '' as string,
    //healthcareProfessionalFields
    healthCareProfessionalNameArray: [] as LocalizedNameInput[],
    healthcareProfessionalIDs: [] as string[],
    localizedFirstName: '' as string,
    localizedLastName: '' as string,
    localizedMiddleName: '' as string,
    nameLocale: Locale.EnUs as Locale,
    healthcareProfessionalAcceptedInsurances: [] as Insurance[],
    healthcareProfessionalDegrees: [] as Degree[],
    healthcareProfessionalSpecialties: [] as Specialty[],
    healthcareProfessionalLocales: [] as Locale[],
    notes: '' as string,
    isApproved: false as boolean,
    isUnderReview: false as boolean
})

const formHasUnsavedChanges: Ref<boolean> = ref(false)

const formSubmissionId = moderationSubmissionStore.selectedSubmissionId
moderationSubmissionStore.filterSelectedSubmission(formSubmissionId)

const addingNewNameLocaleForHealthcareProfessional: Ref<boolean> = ref(false)
const editingExistingNameLocaleForHealthcareProfessional: Ref<boolean> = ref(false)
const chosenNameLocaleIndex: Ref<number | null> = ref(null)
const chosenHealthcareProfessionalNameLocaleToEdit: Ref<LocalizedNameInput | undefined> = ref()
const nameLocaleInputsToAddOrUpdate: LocalizedNameInput = reactive(
    { firstName: '',
        lastName: '',
        middleName: '',
        locale: Locale.Und }
)

// Sets the locale being edited name value
const setEditingLocaleName = (newValue: boolean) => {
    editingExistingNameLocaleForHealthcareProfessional.value = newValue
    // Makes sure both values cannot be true
    addingNewNameLocaleForHealthcareProfessional.value = false
}

// Closes the locale being added name inputs
const handleCloseAddingNewLocalizedName = () => {
    // Allows for the inputs to completely transition before resetting the fields
    setTimeout(() => resetNameLocaleInputs, 300)
    addingNewNameLocaleForHealthcareProfessional.value = false
    // Makes sure both values cannot be true
    editingExistingNameLocaleForHealthcareProfessional.value = false
}

// Opens the locale being added name inputs
const handleOpenAddNewNameWithReset = () => {
    resetNameLocaleInputs()
    addingNewNameLocaleForHealthcareProfessional.value = true
    // Makes sure both values cannot be true
    editingExistingNameLocaleForHealthcareProfessional.value = false
}

// This resets the fields
const resetNameLocaleInputs = () => {
    nameLocaleInputsToAddOrUpdate.firstName = ''
    nameLocaleInputsToAddOrUpdate.middleName = ''
    nameLocaleInputsToAddOrUpdate.lastName = ''
    nameLocaleInputsToAddOrUpdate.locale = Locale.Und
}

// This autofills the inputs if a name is being edited
const autofillNameLocaleInputWithChosenHealthcareProfessional = (localizedNameInput: LocalizedNameInput) => {
    nameLocaleInputsToAddOrUpdate.firstName = localizedNameInput.firstName
    nameLocaleInputsToAddOrUpdate.lastName = localizedNameInput.lastName
    nameLocaleInputsToAddOrUpdate.middleName = localizedNameInput.middleName || ''
    nameLocaleInputsToAddOrUpdate.locale = localizedNameInput.locale
}

// This will set the name that needs to be autofilled and move it to the zero index
const setChosenLocaleNameInput = (index: number) => {
    chosenNameLocaleIndex.value = index

    // This will keep track of the healthcare professional to not lose it but we can swap it later with the chosen one
    const tempToHoldZeroIndexedHealthcareProfessionalToSwap
    = submissionFormFields.healthCareProfessionalNameArray[0]

    // This finds the chosen healthcare professional to edit
    chosenHealthcareProfessionalNameLocaleToEdit.value
    = submissionFormFields.healthCareProfessionalNameArray.find((_, index) => index === chosenNameLocaleIndex.value)

    if (chosenHealthcareProfessionalNameLocaleToEdit.value) {
        // Set the chosen healthcare professional name to move it closer to the input
        submissionFormFields.healthCareProfessionalNameArray[0]
    = chosenHealthcareProfessionalNameLocaleToEdit.value
        // Put the temp one in the index where the old locale name was
        submissionFormFields.healthCareProfessionalNameArray[chosenNameLocaleIndex.value]
        = tempToHoldZeroIndexedHealthcareProfessionalToSwap
        // Autofill with the chosen healthcare professional locale name
        autofillNameLocaleInputWithChosenHealthcareProfessional(chosenHealthcareProfessionalNameLocaleToEdit.value)
        // Set the chosenNameLocaleIndex to 0 so the correct pencil is showing
        chosenNameLocaleIndex.value = 0
    }
}

const handleUpdateExistingName = () => {
    const localizedNameToAdd: LocalizedNameInput = {
        firstName: nameLocaleInputsToAddOrUpdate.firstName,
        lastName: nameLocaleInputsToAddOrUpdate.lastName,
        locale: nameLocaleInputsToAddOrUpdate.locale || Locale.Und,
        middleName: nameLocaleInputsToAddOrUpdate.middleName
    }

    // Checks to keep user from adding a name with same locale instead of editing
    const existingNameForLocale = submissionFormFields.healthCareProfessionalNameArray
        .find(name => name.locale === nameLocaleInputsToAddOrUpdate.locale)

    // Displays message if user is trying to add a locale for name that exists and they aren't editing a healthcare professional
    if (existingNameForLocale) {
        toast.error(t('modHealthcareProfessionalSection.nameForLocaleAlreadyExists'))
        return
    }

    // Displays message for user if they haven't chosen a locale
    if (!nameLocaleInputsToAddOrUpdate.locale || nameLocaleInputsToAddOrUpdate.locale === Locale.Und) {
        toast.error(t('modHealthcareProfessionalSection.missingLocale'))
        return
    }

    // This updates the array in the store with the new edited name since we already ordered the index to this when autofilling
    if (chosenHealthcareProfessionalNameLocaleToEdit.value) {
        submissionFormFields.healthCareProfessionalNameArray[0] = localizedNameToAdd
    }

    // This updates the array in the store with the new edited name since we already ordered the index to this when autofilling
    if (chosenHealthcareProfessionalNameLocaleToEdit.value) {
        submissionFormFields.healthCareProfessionalNameArray[0] = localizedNameToAdd
    }

    setEditingLocaleName(false)

    // Allows for the inputs to completely transition before resetting the fields
    setTimeout(() => {
        resetNameLocaleInputs()
        chosenHealthcareProfessionalNameLocaleToEdit.value = undefined
        chosenNameLocaleIndex.value = null
    }, 301)
}

const handleDeleteExistingName = () => {
    if (submissionFormFields.healthCareProfessionalNameArray.length <= 1) {
        toast.error(t('modHealthcareProfessionalSection.oneNameNecessary'))
        return
    }
    // Remove the first element safely since we reordered the one for deletion at 0
    submissionFormFields.healthCareProfessionalNameArray.shift()

    setEditingLocaleName(false)

    // Allows for the inputs to completely transition before resetting the fields
    setTimeout(() => {
        resetNameLocaleInputs()
        chosenHealthcareProfessionalNameLocaleToEdit.value = undefined
        chosenNameLocaleIndex.value = null
    }, 301)
}

const handleAddLocalizedName = () => {
    const localizedNameToAdd: LocalizedNameInput = {
        firstName: nameLocaleInputsToAddOrUpdate.firstName,
        lastName: nameLocaleInputsToAddOrUpdate.lastName,
        locale: nameLocaleInputsToAddOrUpdate.locale || Locale.Und,
        middleName: nameLocaleInputsToAddOrUpdate.middleName
    }
    // Checks to keep user from adding a name with same locale instead of editing
    const existingNameForLocale = submissionFormFields.healthCareProfessionalNameArray
        .find(name => name.locale === nameLocaleInputsToAddOrUpdate.locale)

    // Displays message if user is trying to add a locale for name that exists and they aren't editing a healthcare professional
    if (existingNameForLocale) {
        toast.error(t('modHealthcareProfessionalSection.nameForLocaleAlreadyExists'))
        return
    }

    // Displays message for user if they haven't entered a last name
    if (!nameLocaleInputsToAddOrUpdate.lastName) {
        toast.error(t('modHealthcareProfessionalSection.missingLastName'))
        return
    }

    // Displays message for user if they haven't entered a first name
    if (!nameLocaleInputsToAddOrUpdate.firstName) {
        toast.error(t('modHealthcareProfessionalSection.missingFirstName'))
        return
    }

    // Displays message for user if they haven't chosen a locale
    if (!nameLocaleInputsToAddOrUpdate.locale || nameLocaleInputsToAddOrUpdate.locale === Locale.Und) {
        toast.error(t('modHealthcareProfessionalSection.missingLocale'))
        return
    }

    if (nameLocaleInputsToAddOrUpdate.firstName
      && nameLocaleInputsToAddOrUpdate.lastName
      && nameLocaleInputsToAddOrUpdate.firstName.length
      && nameLocaleInputsToAddOrUpdate.lastName.length
      && submissionFormFields.healthCareProfessionalNameArray) {
        submissionFormFields.healthCareProfessionalNameArray.push(localizedNameToAdd)
    }

    // Sets the chosen healthcare professional to undefined to reset
    handleCloseAddingNewLocalizedName()
}

const handleInsuranceInputChange = (filteredItems: Ref<Insurance[]>, inputValue: string) => {
    const arrayOfInsurances = Object.values(Insurance) as Insurance[]

    if (!inputValue) {
        filteredItems.value = arrayOfInsurances
        return
    }

    filteredItems.value = arrayOfInsurances.filter(insurance => insurance.toLowerCase().includes(inputValue))
}

const handleDegreeInputChange = (filteredItems: Ref<Degree[]>, inputValue: string) => {
    const degree = Object.values(Degree) as Degree[]

    if (!inputValue) {
        filteredItems.value = degree
        return
    }

    filteredItems.value = degree.filter(degree => degree.toLowerCase().includes(inputValue))
}

const handleSpecialtyInputChange = (filteredItems: Ref<Specialty[]>, inputValue: string) => {
    const arrayOfSpecialties = Object.values(Specialty) as Specialty[]

    if (!inputValue) {
        filteredItems.value = arrayOfSpecialties
        return
    }

    filteredItems.value = arrayOfSpecialties.filter(specialty => specialty.toLowerCase().includes(inputValue))
}

const handleLocaleInputChange = (filteredItems: Ref<Locale[]>, inputValue: string) => {
    const arrayOfLocales = Object.values(Locale) as Locale[]

    if (!inputValue) {
        filteredItems.value = arrayOfLocales
        return
    }

    filteredItems.value = localeStore.getLocaleByNameInput(inputValue)
}

const specialtiesToDisplayCallback = (specialty: Specialty) => [specialty]
const degreesToDisplayCallback = (degree: Degree) => [degree]
const insurancesToDisplayCallback = (insurance: Insurance) => [insurance]
const localesToDisplayCallback = (locale: Locale) => [localeStore.formatLanguageCodeToSimpleText(locale)]

const validateFacilityFields = () => {
    const isNameEnValid: boolean = validateNameEn(submissionFormFields.nameEn)
    const isNameJaValid: boolean = validateNameJa(submissionFormFields.nameJa)
    const isPhoneValid: boolean = validatePhoneNumber(submissionFormFields.phone)
    const isEmailValid: boolean = validateEmail(submissionFormFields.email)
    const isWebsiteValid: boolean = validateWebsite(submissionFormFields.website)
    const isAddressLine1EnValid: boolean = validateAddressLineEn(submissionFormFields.addressLine1En)
    const isAddressLine2EnValid: boolean = validateAddressLineEn(submissionFormFields.addressLine2En)
    const isAddressLine1JaValid: boolean = validateAddressLineJa(submissionFormFields.addressLine1Ja)
    const isAddressLine2JaValid: boolean = validateAddressLineJa(submissionFormFields.addressLine2Ja)
    const isCityEnValid: boolean = validateCityEn(submissionFormFields.cityEn)
    const isCityJaValid: boolean = validateCityJa(submissionFormFields.cityJa)
    const isPostalCodeValid: boolean = validatePostalCode(submissionFormFields.postalCode)
    const isLatitudeValid: boolean = validateFloat(submissionFormFields.mapLatitude)
    const isLongitudeValid: boolean = validateFloat(submissionFormFields.mapLongitude)

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
        = submissionFormFields.healthCareProfessionalNameArray.length > 0
          || submissionFormFields.healthcareProfessionalIDs.length > 0
    const areInsurancesSelected: boolean = submissionFormFields.healthcareProfessionalAcceptedInsurances.length > 0
    const areDegreesSelected: boolean = submissionFormFields.healthcareProfessionalDegrees.length > 0
    const areSpecialtiesSelected: boolean = submissionFormFields.healthcareProfessionalSpecialties.length > 0
    const areLocalesSelected: boolean = submissionFormFields.healthcareProfessionalLocales.length > 0

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
                    // This sets the values of the v-model
                    submissionFormFields.nameEn = submissionData['facility']?.nameEn || ''
                    submissionFormFields.nameJa = submissionData['facility']?.nameJa || ''
                    submissionFormFields.phone = submissionData['facility']?.contact?.phone || ''
                    submissionFormFields.email = submissionData['facility']?.contact?.email || ''
                    submissionFormFields.website = submissionData['facility']?.contact?.website || ''
                    submissionFormFields.postalCode = submissionData['facility']?.contact?.address.postalCode || ''
                    submissionFormFields.prefectureEn = submissionData['facility']?.contact?.address.prefectureEn || ''
                    submissionFormFields.cityEn = submissionData['facility']?.contact?.address.cityEn || ''
                    submissionFormFields.addressLine1En = submissionData['facility']?.contact?.address.addressLine1En || ''
                    submissionFormFields.addressLine2En = submissionData['facility']?.contact?.address.addressLine2En || ''
                    submissionFormFields.prefectureJa = submissionData['facility']?.contact?.address.prefectureJa || ''
                    submissionFormFields.cityJa = submissionData['facility']?.contact?.address.cityJa || ''
                    submissionFormFields.addressLine1Ja = submissionData['facility']?.contact?.address.addressLine1Ja || ''
                    submissionFormFields.addressLine2Ja = submissionData['facility']?.contact?.address.addressLine2Ja || ''
                    submissionFormFields.mapLatitude = submissionData['facility']?.mapLatitude?.toString() || ''
                    submissionFormFields.mapLongitude = submissionData['facility']?.mapLongitude?.toString() || ''
                    // This sets the values for the check if the user has updated any values
                    submissionFormFieldsBeforeChanges.nameEn = submissionData['facility']?.nameEn || ''
                    submissionFormFieldsBeforeChanges.nameJa = submissionData['facility']?.nameJa || ''
                    submissionFormFieldsBeforeChanges.phone = submissionData['facility']?.contact?.phone || ''
                    submissionFormFieldsBeforeChanges.email = submissionData['facility']?.contact?.email || ''
                    submissionFormFieldsBeforeChanges.website = submissionData['facility']?.contact?.website || ''
                    submissionFormFieldsBeforeChanges.postalCode = submissionData['facility']?.contact?.address.postalCode || ''
                    submissionFormFieldsBeforeChanges.prefectureEn
                    = submissionData['facility']?.contact?.address.prefectureEn || ''
                    submissionFormFieldsBeforeChanges.cityEn = submissionData['facility']?.contact?.address.cityEn || ''
                    submissionFormFieldsBeforeChanges.addressLine1En
                    = submissionData['facility']?.contact?.address.addressLine1En || ''
                    submissionFormFieldsBeforeChanges.addressLine2En
                    = submissionData['facility']?.contact?.address.addressLine2En || ''
                    submissionFormFieldsBeforeChanges.prefectureJa
                    = submissionData['facility']?.contact?.address.prefectureJa || ''
                    submissionFormFieldsBeforeChanges.cityJa = submissionData['facility']?.contact?.address.cityJa || ''
                    submissionFormFieldsBeforeChanges.addressLine1Ja
                    = submissionData['facility']?.contact?.address.addressLine1Ja || ''
                    submissionFormFieldsBeforeChanges.addressLine2Ja
                    = submissionData['facility']?.contact?.address.addressLine2Ja || ''
                    submissionFormFieldsBeforeChanges.mapLatitude = submissionData['facility']?.mapLatitude?.toString() || ''
                    submissionFormFieldsBeforeChanges.mapLongitude = submissionData['facility']?.mapLongitude?.toString() || ''
                    break
                case 'googleMapsUrl':
                    submissionFormFields.googlemapsURL // For v-model
                    = submissionData['facility']?.contact?.googleMapsUrl || submissionData['googleMapsUrl']
                    submissionFormFieldsBeforeChanges.googlemapsURL // For change check
                    = submissionData['facility']?.contact?.googleMapsUrl || submissionData['googleMapsUrl']
                    break
                case 'healthcareProfessionals':
                    if (submittedHealthcareProfessionalName && submittedHealthcareProfessionalName.length === 2) {
                        submissionFormFields.healthCareProfessionalNameArray // For v-model
                            = submissionData?.healthcareProfessionals?.[0]?.names ?? [{
                                firstName: submittedHealthcareProfessionalName[0] || '',
                                lastName: submittedHealthcareProfessionalName[1] || '',
                                locale: submissionData.spokenLanguages[0] || Locale.Und
                            }]
                        submissionFormFieldsBeforeChanges.healthCareProfessionalNameArray // For change check
                            = submissionData?.healthcareProfessionals?.[0]?.names ?? [{
                                firstName: submittedHealthcareProfessionalName[0] || '',
                                lastName: submittedHealthcareProfessionalName[1] || '',
                                locale: submissionData.spokenLanguages[0] || Locale.Und
                            }]
                    }
                    if (submittedHealthcareProfessionalName && submittedHealthcareProfessionalName.length === 3) {
                        submissionFormFields.healthCareProfessionalNameArray // For v-model
                        = submissionData?.healthcareProfessionals?.[0]?.names ?? [{
                                firstName: submittedHealthcareProfessionalName[0] || '',
                                middleName: submittedHealthcareProfessionalName[1] || '',
                                lastName: submittedHealthcareProfessionalName[2] || '',
                                locale: submissionData.spokenLanguages[0] || Locale.Und
                            }]
                        submissionFormFieldsBeforeChanges.healthCareProfessionalNameArray // For change check
                        = submissionData?.healthcareProfessionals?.[0]?.names ?? [{
                                firstName: submittedHealthcareProfessionalName[0] || '',
                                middleName: submittedHealthcareProfessionalName[1] || '',
                                lastName: submittedHealthcareProfessionalName[2] || '',
                                locale: submissionData.spokenLanguages[0] || Locale.Und
                            }]
                    }
                    // For v-model
                    submissionFormFields.healthcareProfessionalAcceptedInsurances
                        = submissionData?.healthcareProfessionals?.[0]?.acceptedInsurance
                          ?? []
                    submissionFormFields.healthcareProfessionalDegrees
                        = submissionData?.healthcareProfessionals?.[0]?.degrees
                          ?? []
                    submissionFormFields.healthcareProfessionalSpecialties
                        = submissionData?.healthcareProfessionals?.[0]?.specialties
                          ?? []
                    submissionFormFields.healthcareProfessionalLocales
                        = submissionData.spokenLanguages
                    // For change check
                    submissionFormFieldsBeforeChanges.healthcareProfessionalAcceptedInsurances
                        = submissionData?.healthcareProfessionals?.[0]?.acceptedInsurance
                          ?? []
                    submissionFormFieldsBeforeChanges.healthcareProfessionalDegrees
                        = submissionData?.healthcareProfessionals?.[0]?.degrees
                          ?? []
                    submissionFormFieldsBeforeChanges.healthcareProfessionalSpecialties
                        = submissionData?.healthcareProfessionals?.[0]?.specialties
                          ?? []
                    submissionFormFieldsBeforeChanges.healthcareProfessionalLocales
                        = submissionData.spokenLanguages
                    break
                case 'healthcareProfessionalIDs':
                    // For v-model
                    submissionFormFields.healthcareProfessionalIDs
                    = submissionData.facility?.healthcareProfessionalIds ?? []
                    // For change check
                    submissionFormFieldsBeforeChanges.healthcareProfessionalIDs
                    = submissionData.facility?.healthcareProfessionalIds ?? []
                    break
                case 'isApproved':
                    submissionFormFields.isApproved = submissionData.isApproved
                    break
                case 'isUnderReview':
                    submissionFormFields.isUnderReview = submissionData.isUnderReview
            }
        }
    }
}

const submissionHasUnsavedChanges = () => {
    const checkForUnsavedChanges
    = submissionFormFieldsBeforeChanges.addressLine1En !== submissionFormFields.addressLine1En
      || submissionFormFieldsBeforeChanges.addressLine1Ja !== submissionFormFields.addressLine1Ja
      || submissionFormFieldsBeforeChanges.addressLine2En !== submissionFormFields.addressLine2En
      || submissionFormFieldsBeforeChanges.addressLine2Ja !== submissionFormFields.addressLine2Ja
      || submissionFormFieldsBeforeChanges.cityEn !== submissionFormFields.cityEn
      || submissionFormFieldsBeforeChanges.cityJa !== submissionFormFields.cityJa
      || submissionFormFieldsBeforeChanges.postalCode !== submissionFormFields.postalCode
      || submissionFormFieldsBeforeChanges.prefectureEn !== submissionFormFields.prefectureEn
      || submissionFormFieldsBeforeChanges.prefectureJa !== submissionFormFields.prefectureJa
      || submissionFormFieldsBeforeChanges.email !== submissionFormFields.email
      || submissionFormFieldsBeforeChanges.googlemapsURL !== submissionFormFields.googlemapsURL
      || submissionFormFieldsBeforeChanges.phone !== submissionFormFields.phone
      || submissionFormFieldsBeforeChanges.website !== submissionFormFields.website
      /* returns false if not equal so to make it be true we add the ! to follow
       the same logic as above */
      || !arraysAreEqual(
          submissionFormFieldsBeforeChanges.healthcareProfessionalIDs,
          submissionFormFields.healthcareProfessionalIDs
      )
      || submissionFormFieldsBeforeChanges.mapLatitude !== submissionFormFields.mapLatitude
      || submissionFormFieldsBeforeChanges.mapLongitude !== submissionFormFields.mapLongitude
      || submissionFormFieldsBeforeChanges.nameEn !== submissionFormFields.nameEn
      || submissionFormFieldsBeforeChanges.nameJa !== submissionFormFields.nameJa
      || submissionFormFieldsBeforeChanges.googlemapsURL !== submissionFormFields.googlemapsURL
      || submissionFormFieldsBeforeChanges.notes !== submissionFormFields.notes
      || !arraysAreEqual(
          submissionFormFieldsBeforeChanges.healthcareProfessionalLocales,
          submissionFormFields.healthcareProfessionalLocales
      )
      || !arraysAreEqual(
          submissionFormFieldsBeforeChanges.healthCareProfessionalNameArray,
          submissionFormFields.healthCareProfessionalNameArray
      )
      || !arraysAreEqual(
          submissionFormFieldsBeforeChanges.healthcareProfessionalAcceptedInsurances,
          submissionFormFields.healthcareProfessionalAcceptedInsurances
      )
      || !arraysAreEqual(
          submissionFormFieldsBeforeChanges.healthcareProfessionalDegrees,
          submissionFormFields.healthcareProfessionalDegrees
      )

    formHasUnsavedChanges.value = true
    return checkForUnsavedChanges
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
                nameEn: submissionFormFields.nameEn,
                nameJa: submissionFormFields.nameJa,
                contact: {
                    googleMapsUrl: submissionFormFields.googlemapsURL,
                    email: submissionFormFields.email,
                    phone: submissionFormFields.phone,
                    website: submissionFormFields.website,
                    address: {
                        postalCode: submissionFormFields.postalCode,
                        prefectureEn: submissionFormFields.prefectureEn,
                        cityEn: submissionFormFields.cityEn,
                        addressLine1En: submissionFormFields.addressLine1En,
                        addressLine2En: submissionFormFields.addressLine2En,
                        prefectureJa: submissionFormFields.prefectureJa,
                        cityJa: submissionFormFields.cityJa,
                        addressLine1Ja: submissionFormFields.addressLine1Ja,
                        addressLine2Ja: submissionFormFields.addressLine2Ja
                    }
                },
                healthcareProfessionalIds: [],
                mapLatitude: parseFloat(submissionFormFields.mapLatitude) || 0,
                mapLongitude: parseFloat(submissionFormFields.mapLongitude) || 0
            },
            healthcareProfessionals: [
                {
                    acceptedInsurance: submissionFormFields.healthcareProfessionalAcceptedInsurances,
                    degrees: submissionFormFields.healthcareProfessionalDegrees,
                    specialties: submissionFormFields.healthcareProfessionalSpecialties,
                    spokenLanguages: submissionFormFields.healthcareProfessionalLocales,
                    names: submissionFormFields.healthCareProfessionalNameArray,
                    facilityIds: []
                }
            ]
        }
    }

    const result = await moderationSubmissionStore.updateSubmission(submissionInputVariables)
    // This is used in the component and not graphQL call as it is user messaging and needs the mounted toast library
    if (result?.errors?.length) {
        handleServerErrorMessaging(result.errors, toast, t)
        return
    }

    const submissionResult = result.data

    // This updates the submission in the form with the values stored in the db on success
    if (submissionResult) initializeSubmissionFormValues(submissionResult)
    toast.success(t('modSubmissionForm.successMessageUpdated'))
    if (moderationSubmissionStore.updatingSubmissionFromTopBar) {
        router.push('/moderation')
        // reset all modal refs to prevent unintended side effects
        resetModalRefs()
    }
}

async function submitCompletedForm(e: Event) {
    // stop the form submitting before we validate
    e.preventDefault()

    //This prevents submission of an already approved submission the backend does this but as an extra visual and check
    if (submissionFormFields.isApproved) {
        toast.info(t('modSubmissionForm.infoMessageAlreadyApproved'))
        return
    }

    if (!submissionFormFields.isUnderReview) {
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
        const result = await moderationSubmissionStore.approveSubmission()
        console.log(result)
        if (result?.errors?.length) {
            handleServerErrorMessaging(result.errors, toast, t)
            return
        }
        modalStore.hideModal()
        toast.success(t('modSubmissionForm.successMessageApproved'))
        // reset all modal refs to prevent unintended side effects
        resetModalRefs()
        router.push('/moderation')
    } catch {
        toast.error(t('modSubmissionForm.errorMessageCompletedForm'))
    }
}

const syntheticEvent = new Event('submit', { bubbles: false, cancelable: true })

const resetModalRefs = async () => {
    moderationSubmissionStore.setShowRejectSubmissionConfirmation(false)
    moderationSubmissionStore.setApprovingSubmissionFromTopBar(false)
    moderationSubmissionStore.setUpdatingSubmissionFromTopBar(false)
    formHasUnsavedChanges.value = false
}

const rejectSubmission = async () => {
    await moderationSubmissionStore.rejectSubmission()
    await resetModalRefs()
    toast.success(t('modSubmissionForm.facilitySuccessfullyRejected'))
    handleNavigateToModerationScreen()
}

watch(() => moderationSubmissionStore.updatingSubmissionFromTopBar, newValue => {
    //saves the submission by updating it and then going to the main
    if (newValue) {
        submitUpdatedSubmission(syntheticEvent)
    }
})

onMounted(async () => {
    isEditSubmissionFormInitialized.value = false

    if (!moderationSubmissionStore.submissionsData.length) {
        await moderationSubmissionStore.getSubmissions()
    }

    moderationSubmissionStore.filterSelectedSubmission(formSubmissionId)

    const loadedFromRefreshFormSubmissionData = moderationSubmissionStore.selectedSubmissionData
    initializeSubmissionFormValues(loadedFromRefreshFormSubmissionData)
    await nextTick()

    /**
    Set the variable to useToast when the compoenet mounts
    since vue-taostification is only available on the client.
    If not done this way the build fails
     */
    toast = useToast()

    isEditSubmissionFormInitialized.value = true
    loadingStore.setIsLoading(false)
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
</script>
