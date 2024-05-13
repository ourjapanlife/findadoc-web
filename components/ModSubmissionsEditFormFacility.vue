<template>
    <form @submit="validateFields" class="p-4 h-full overflow-y-auto">
        <div>
            <span class="mb-3.5 text-center text-zinc-900 text-2xl font-bold font-['Noto Sans JP'] leading-normal">
                {{ $t('moderateSubmissionForm.contactInformation')}}
            </span>
            <ModInputField  
                data-testid="submission-form-nameEn"
                label="Name En"
                type="text"
                placeholder="e.g. Tachikawa Central Hospital"
                :required="true"
                :inputValidationCheck="validateNameEn"
                invalidInputErrorMessage="Invalid English Name"
            />
            <ModInputField
                data-testid="submission-form-nameJp"  
                label="Name Jp"
                type="text"
                placeholder="e.g. 立川中央病院"
                :required="true"
                :inputValidationCheck="validateNameJp"
                invalidInputErrorMessage="Invalid Japanese Name"
            />
            <ModInputField  
                data-testid="submission-form-phone"
                label="Phone"
                type="text"
                placeholder="e.g. 08xxxxxxxxx"
                :required="true"
                :inputValidationCheck="validatePhoneNumber"
                invalidInputErrorMessage="Invalid Phone Number"
            />
            <ModInputField
                data-testid="submission-form-email"  
                label="Email"
                type="email"
                placeholder="e.g example@mail.com"
                :required="false"
                :inputValidationCheck="validateEmail"
                invalidInputErrorMessage="Invalid Email Address"
            />
            <ModInputField
                data-testid="submission-form-website"  
                label="Website"
                type="url"
                placeholder="e.g. http://www.example.com/"
                :required="false"
                :inputValidationCheck="validateWebsite"
                invalidInputErrorMessage="Invalid Website URL"
            />
        </div>

        <div>
            <span class="mb-3.5 text-center text-zinc-900 text-2xl font-bold font-['Noto Sans JP'] leading-normal">
                {{ $t('moderateSubmissionForm.addresses') }}
            </span>
            <ModInputField
                data-testid="submission-form-postalCode"  
                label="Postal Code"
                type="text"
                placeholder="e.g. 186-0000"
                :required="true"
                :inputValidationCheck="validatePostalCode"
                invalidInputErrorMessage="Invalid Zip Code"
            />
            <div class="flex flex-col mt-4">
                <label for="Prefecture Japan" class="mb-2 text-zinc-900 text-sm font-bold font-['Noto Sans JP']">Prefecture En</label>
                <select 
                data-testid="submission-form-prefectureEn"
                name="Prefecture Japan" id="1" class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400 text-neutral-600 text-sm font-normal font-['Noto Sans JP'] placeholder-gray-300"
                v-model="store.prefectureEn"
                >
                    <option v-for="(prefecture, index) in store.listPrefectureJapanEn" :key="index">{{ prefecture }}</option>
                </select>
            </div>
            <ModInputField
                data-testid="submission-form-cityEn"  
                label="City En"
                type="text"
                placeholder="e.g. Shibuya"
                :required="true"
                :inputValidationCheck="validateCityEn"
                invalidInputErrorMessage="Invalid English City Name"
            />
            <ModInputField
                data-testid="submission-form-addressLine1En"  
                label="Address Line 1 En"
                type="text"
                placeholder="Street address"
                :required="true"
                :inputValidationCheck="validateAddressLineEn"
                invalidInputErrorMessage="Invalid English Address"
            />
            <ModInputField
                data-testid="submission-form-addressLine2En"  
                label="Address Line 2 En"
                type="text"
                placeholder="Apartment, building, room..."
                :required="true"
                :inputValidationCheck="validateAddressLineEn"
                invalidInputErrorMessage="Invalid English Address"
            />
            <div class="flex flex-col mt-4">
                <label for="Prefecture Japan" class="mb-2 text-zinc-900 text-sm font-bold font-['Noto Sans JP']">Prefecture Jp</label>
                <select 
                data-testid="submission-form-prefectureJp"
                name="Prefecture Japan" id="1" class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400 text-neutral-600 text-sm font-normal font-['Noto Sans JP'] placeholder-gray-300"
                v-model="store.prefectureJp"
                >
                    <option 
                    v-for="(prefecture, index) in store.listPrefectureJapanJp" 
                    :key="index"
                    >
                    {{ prefecture }}
                    </option>
                </select>
            </div>
            <ModInputField  
                data-testid="submission-form-cityJp"
                label="City Jp"
                type="text"
                placeholder="e.g. 渋谷区"
                :required="true"
                :inputValidationCheck="validateCityJp"
                invalidInputErrorMessage="Invalid Japanese City Name"
            />
            <ModInputField  
                data-testid="submission-form-addressLine1Jp"
                label="Address Line 1 Jp"
                type="text"
                placeholder="Street address"
                :required="true"
                :inputValidationCheck="validateAddressLineJp"
                invalidInputErrorMessage="Invalid Japanese Address"
            />
            <ModInputField  
                data-testid="submission-form-addressLine2Jp"
                label="Address Line 2 Jp"
                type="text"
                placeholder="Apartment, building, room..."
                :required="true"
                :inputValidationCheck="validateAddressLineJp"
                invalidInputErrorMessage="Invalid Japanese Address"
            />
        </div>
        
        <div>
            <span class="mb-3.5 text-center text-zinc-900 text-2xl font-bold font-['Noto Sans JP'] leading-normal">
                {{ $t('moderateSubmissionForm.googleMapsInformation') }}
            </span>
            <ModInputField
                data-testid="submission-form-google-maps"  
                label="Google maps URL"
                type="url"
                placeholder="e.g. https://www.google.co.jp/maps/"
                :required="true"
                :inputValidationCheck="validateWebsite"
                invalidInputErrorMessage="Invalid Google Maps URL"
            />
            <ModInputField  
                data-testid="submission-form-mapLatitude"
                label="Map latitude"
                type="text"
                placeholder="e.g. 5.76137"
                :required="true"
                :inputValidationCheck="validateFloat"
                invalidInputErrorMessage="Invalid Latitude"
            />
            <ModInputField  
                data-testid="submission-form-mapLongitude"
                label="Map longitude"
                type="text"
                placeholder="e.g 178.45229"
                :required="true"
                :inputValidationCheck="validateFloat"
                invalidInputErrorMessage="Invalid Longitude"
            />
        </div>
        <div>
            <span class="mb-3.5 text-center text-zinc-900 text-2xl font-bold font-['Noto Sans JP'] leading-normal">
                {{ $t('moderateSubmissionForm.healthcareProfessionalId') }}
            </span>
            <div class="flex flex-col mt-4">
                <div class="justify-start items-start flex">
                    <input 
                        data-testid="submission-form-doctor-search"
                        type='text'
                        placeholder='Search by name or ID to add a doctor'
                        class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400 text-neutral-600 text-sm font-normal font-['Noto Sans JP'] placeholder-gray-300"
                    />
                    <SVGLookingGlass role="img" title="searching icon" class="relative right-8 top-3 w-6 h-6"/>
                </div>
            </div>
        </div>
        <!-- This button is pure for testing -->
        <button type="submit" class="bg-currentColor text-white font-bold py-2 px-4 rounded">submit</button>
    </form>
</template>

<script lang="ts" setup>
import { Result } from 'postcss';
import {ref, Ref} from 'vue'
import SVGLookingGlass from '~/assets/icons/looking-glass.svg'
import { useModerationFormInputStore } from '~/stores/moderationFormInputStore'
import { validateAddressLineEn, validateAddressLineJp, validateNameEn, validateNameJp, validatePhoneNumber, validateCityEn, validateEmail, validateFloat, validatePostalCode, validateWebsite, validateCityJp } from '~/utils/formValidations'

const store = useModerationFormInputStore()

const validateFields = (e: Event) => {
    e.preventDefault()
    
    const isNameEnValid: boolean = validateNameEn(store.nameEn)
    const isNameJpValid: boolean = validateNameJp(store.nameJp)
    const isPhoneValid: boolean = validatePhoneNumber(store.phone)
    const isEmailValid: boolean = validateEmail(store.email)
    const isWebsiteValid: boolean = validateWebsite(store.website)
    const isAddressLine1EnValid: boolean = validateAddressLineEn(store.addressLine1En)
    const isAddressLine2EnValid: boolean = validateAddressLineEn(store.addressLine2En)
    const isAddressLine1JpValid: boolean = validateAddressLineJp(store.addressLine1Jp)
    const isAddressLine2JpValid: boolean = validateAddressLineJp(store.addressLine2Jp)
    const isCityEnValid: boolean = validateCityEn(store.cityEn)
    const isCityJpValid: boolean = validateCityJp(store.cityJp)
    const isPostalCodeValid: boolean = validatePostalCode(store.postalCode)
    const isLatitudeValid: boolean = validateFloat(store.mapLatitude)
    const isLongitudeValid: boolean = validateFloat(store.mapLongitude)
    
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
    
    store.resetForm()
    console.log('Fetching data')
}

</script>
