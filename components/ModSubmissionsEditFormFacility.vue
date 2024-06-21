<template>
    <form
        class="p-4 h-full overflow-y-auto"
        @submit="validateFields"
    >
        <div>
            <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                {{ $t('modSubmissionForm.contactInformation') }}
            </span>
            <ModInputField
                data-testid="submission-form-nameEn"
                :label="$t('modSubmissionForm.labelFacilityNameEn')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityNameEn')"
                :required="true"
                :inputValidationCheck="validateNameEn"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityNameEn')"
                :autofillValue="moderationInputStore.nameEn"
            />
            <ModInputField
                data-testid="submission-form-nameJp"
                :label="$t('modSubmissionForm.labelFacilityNameJp')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityNameJp')"
                :required="true"
                :inputValidationCheck="validateNameJp"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityNameJp')"
                :autofillValue="moderationInputStore.nameJp"
            />
            <ModInputField
                data-testid="submission-form-phone"
                :label="$t('modSubmissionForm.labelFacilityPhoneNumber')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityPhoneNumber')"
                :required="true"
                :inputValidationCheck="validatePhoneNumber"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityPhoneNumber')"
                :autofillValue="moderationInputStore.phone"
            />
            <ModInputField
                data-testid="submission-form-email"
                :label="$t('modSubmissionForm.labelFacilityEmail')"
                type="email"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityEmail')"
                :required="false"
                :inputValidationCheck="validateEmail"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityEmail')"
                :autofillValue="moderationInputStore.email"
            />
            <ModInputField
                data-testid="submission-form-website"
                :label="$t('modSubmissionForm.labelFacilityWebsite')"
                type="url"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityWebsite')"
                :required="false"
                :inputValidationCheck="validateWebsite"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityWebsite')"
                :autofillValue="moderationInputStore.website"
            />
        </div>

        <div>
            <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                {{ $t('modSubmissionForm.addresses') }}
            </span>
            <ModInputField
                data-testid="submission-form-postalCode"
                :label="$t('modSubmissionForm.labelFacilityPostalCode')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityPostalCode')"
                :required="true"
                :inputValidationCheck="validatePostalCode"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityPostalCode')"
                :autofillValue="moderationInputStore.postalCode"
            />
            <div class="flex flex-col mt-4">
                <label for="Prefecture Japan" class="mb-2 text-primary-text text-sm font-bold font-sans">
                    {{$t('modSubmissionForm.labelFacilityPrefectureEn')}}
                </label>
                <select
                    id="1"
                    v-model="moderationInputStore.prefectureEn"
                    data-testid="submission-form-prefectureEn"
                    name="Prefecture Japan"
                    class="mb-5 px-3 py-3.5 w-96 h-12 bg-white rounded-lg border border-primary-text-muted
                    text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                >
                    <option
                        v-for="(prefecture, index) in moderationInputStore.listPrefectureJapanEn"
                        :key="index"
                    >
                        {{ prefecture }}
                    </option>
                </select>
            </div>
            <ModInputField
                data-testid="submission-form-cityEn"
                :label="$t('modSubmissionForm.labelFacilityCityEn')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityCityEn')"
                :required="true"
                :inputValidationCheck="validateCityEn"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityCityEn')"
                :autofillValue="moderationInputStore.cityEn"
            />
            <ModInputField
                data-testid="submission-form-addressLine1En"
                :label="$t('modSubmissionForm.labelFacilityAddressLine1En')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine1En')"
                :required="true"
                :inputValidationCheck="validateAddressLineEn"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine1En')"
                :autofillValue="moderationInputStore.addressLine1En"
            />
            <ModInputField
                data-testid="submission-form-addressLine2En"
                :label="$t('modSubmissionForm.labelFacilityAddressLine2En')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine2En')"
                :required="true"
                :inputValidationCheck="validateAddressLineEn"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine2En')"
                :autofillValue="moderationInputStore.addressLine2En"
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
                    v-model="moderationInputStore.prefectureJp"
                    data-testid="submission-form-prefectureJp"
                    name="Prefecture Japan"
                    class="mb-5 px-3 py-3.5 w-96 h-12 bg-white rounded-lg border border-primary-text-muted
                    text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                >
                    <option
                        v-for="(prefecture, index) in moderationInputStore.listPrefectureJapanJp"
                        :key="index"
                    >
                        {{ prefecture }}
                    </option>
                </select>
            </div>
            <ModInputField
                data-testid="submission-form-cityJp"
                :label="$t('modSubmissionForm.labelFacilityCityJp')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityCityJp')"
                :required="true"
                :inputValidationCheck="validateCityJp"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityCityJp')"
                :autofillValue="moderationInputStore.cityJp"
            />
            <ModInputField
                data-testid="submission-form-addressLine1Jp"
                :label="$t('modSubmissionForm.labelFacilityAddressLine1Jp')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine1Jp')"
                :required="true"
                :inputValidationCheck="validateAddressLineJp"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine1Jp')"
                :autofillValue="moderationInputStore.addressLine1Jp"
            />
            <ModInputField
                data-testid="submission-form-addressLine2Jp"
                :label="$t('modSubmissionForm.labelFacilityAddressLine2Jp')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityAddressLine2Jp')"
                :required="true"
                :inputValidationCheck="validateAddressLineJp"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityAddressLine2Jp')"
                :autofillValue="moderationInputStore.addressLine2Jp"
            />
        </div>

        <div>
            <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
                {{ $t('modSubmissionForm.googleMapsInformation') }}
            </span>
            <ModInputField
                data-testid="submission-form-google-maps"
                :label="$t('modSubmissionForm.labelFacilityGoogleMapsUrl')"
                type="url"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityGoogleMapsUrl')"
                :required="true"
                :inputValidationCheck="validateWebsite"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityGoogleMapsUrl')"
                :autofillValue="moderationInputStore.googlemapsURL"
            />
            <ModInputField
                data-testid="submission-form-mapLatitude"
                :label="$t('modSubmissionForm.labelFacilityMapLatitude')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityMapLatitude')"
                :required="true"
                :inputValidationCheck="validateFloat"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityMapLatitude')"
                :autofillValue="moderationInputStore.mapLatitude"
            />
            <ModInputField
                data-testid="submission-form-mapLongitude"
                :label="$t('modSubmissionForm.labelFacilityMapLongitude')"
                type="text"
                :placeholder="$t('modSubmissionForm.placeholderTextFacilityMapLongitude')"
                :required="true"
                :inputValidationCheck="validateFloat"
                :invalidInputErrorMessage="$t('modSubmissionForm.inputErrorMessageFacilityMapLongitude')"
                :autofillValue="moderationInputStore.mapLongitude"
            />
        </div>
        <ModHealthcareProfessionalSearchbar
            data-testid="submission-form-doctor-search"
        />
        <!-- This button is pure for testing -->
        <button
            type="submit"
            class="bg-currentColor text-white font-bold py-2 px-4 rounded"
        >
            submit
        </button>
    </form>
</template>

<script lang="ts" setup>
import { useModerationFormInputStore } from '~/stores/moderationFormInputStore'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import type { Submission } from '~/typedefs/gqlTypes'
import { validateAddressLineEn, validateAddressLineJp, validateNameEn, validateNameJp, validatePhoneNumber, validateCityEn, validateEmail, validateFloat, validatePostalCode, validateWebsite, validateCityJp } from '~/utils/formValidations'

const moderationInputStore = useModerationFormInputStore()
const moderationSubmissionStore = useModerationSubmissionsStore()

const formSubmissionId = moderationSubmissionStore.selectedSubmissionId
moderationSubmissionStore.filterSelectedSubmission(formSubmissionId)

const formSubmissionData = moderationSubmissionStore.selectedSubmissionData

autofillEditSubmissionForm(formSubmissionData)

const validateFields = (e: Event) => {
    e.preventDefault()
    const isNameEnValid: boolean = validateNameEn(moderationInputStore.nameEn)
    const isNameJpValid: boolean = validateNameJp(moderationInputStore.nameJp)
    const isPhoneValid: boolean = validatePhoneNumber(moderationInputStore.phone)
    const isEmailValid: boolean = validateEmail(moderationInputStore.email)
    const isWebsiteValid: boolean = validateWebsite(moderationInputStore.website)
    const isAddressLine1EnValid: boolean = validateAddressLineEn(moderationInputStore.addressLine1En)
    const isAddressLine2EnValid: boolean = validateAddressLineEn(moderationInputStore.addressLine2En)
    const isAddressLine1JpValid: boolean = validateAddressLineJp(moderationInputStore.addressLine1Jp)
    const isAddressLine2JpValid: boolean = validateAddressLineJp(moderationInputStore.addressLine2Jp)
    const isCityEnValid: boolean = validateCityEn(moderationInputStore.cityEn)
    const isCityJpValid: boolean = validateCityJp(moderationInputStore.cityJp)
    const isPostalCodeValid: boolean = validatePostalCode(moderationInputStore.postalCode)
    const isLatitudeValid: boolean = validateFloat(moderationInputStore.mapLatitude)
    const isLongitudeValid: boolean = validateFloat(moderationInputStore.mapLongitude)
    if (
        !isNameEnValid ||
        !isNameJpValid ||
        !isPhoneValid ||
        !isEmailValid ||
        !isWebsiteValid ||
        !isAddressLine1EnValid ||
        !isAddressLine2EnValid ||
        !isAddressLine1JpValid ||
        !isAddressLine2JpValid ||
        !isCityEnValid ||
        !isCityJpValid ||
        !isPostalCodeValid ||
        !isLatitudeValid ||
        !isLongitudeValid
    ) {
        e.preventDefault()
        return
    }
    moderationInputStore.resetForm()
    console.log('Fetching data')
}

function autofillEditSubmissionForm(submissionData: Submission | undefined) {
    for (const key in submissionData) {
        if (submissionData[key as keyof Submission]) {
            switch (key) {
                case 'facility':
                    moderationInputStore.nameEn = submissionData['facility']?.nameEn || ''
                    moderationInputStore.nameJp = submissionData['facility']?.nameJa || ''
                    moderationInputStore.phone = submissionData['facility']?.contact?.phone || ''
                    moderationInputStore.email = submissionData['facility']?.contact?.email || ''
                    moderationInputStore.website = submissionData['facility']?.contact?.website || ''
                    moderationInputStore.postalCode = submissionData['facility']?.contact?.address.postalCode || ''
                    moderationInputStore.prefectureEn = submissionData['facility']?.contact?.address.prefectureEn || ''
                    moderationInputStore.cityEn = submissionData['facility']?.contact?.address.cityEn || ''
                    moderationInputStore.addressLine1En = submissionData['facility']?.contact?.address.addressLine1En || ''
                    moderationInputStore.addressLine2En = submissionData['facility']?.contact?.address.addressLine2En || ''
                    moderationInputStore.prefectureJp = submissionData['facility']?.contact?.address.prefectureJa || ''
                    moderationInputStore.cityJp = submissionData['facility']?.contact?.address.cityJa || ''
                    moderationInputStore.addressLine1Jp = submissionData['facility']?.contact?.address.addressLine1Ja || ''
                    moderationInputStore.addressLine2Jp = submissionData['facility']?.contact?.address.addressLine2Ja || ''
                    moderationInputStore.mapLatitude = submissionData['facility']?.mapLatitude?.toString() || ''
                    moderationInputStore.mapLongitude = submissionData['facility']?.mapLongitude?.toString() || ''
                    break
                case 'googleMapsUrl':
                    moderationInputStore.googlemapsURL = submissionData['facility']?.contact?.googleMapsUrl || submissionData['googleMapsUrl']
            }
        }
    }
}
</script>
