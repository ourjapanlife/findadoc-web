import {
    validateAddressLineEn,
    validateAddressLineJa,
    validateCityEn,
    validateCityJa,
    validateEmail,
    validateFloat,
    validateGoogleMapsUrlInput,
    validateNameEn,
    validateNameJa,
    validatePhoneNumber,
    validatePostalCode,
    validateWebsite
} from '~/utils/formValidations'
import { checkPrefectureNameMatch } from '~/utils/facilitiesUtils'
import { triggerFormValidationErrorMessages } from '~/utils/triggerFormValidationErrorMessages'

type FacilityValidationFields = {
    nameEn: string
    nameJa: string
    mapLatitude: string
    mapLongitude: string
    /** Moderation facility section uses `googlemapsURL`; nested contact may use `googleMapsUrl`. */
    googleMapsUrl?: string
    googlemapsURL?: string
    prefectureEn?: string
    prefectureJa?: string
    contact?: {
        phone: string
        email?: string
        website?: string
        googleMapsUrl?: string
        address: {
            addressLine1En: string
            addressLine1Ja: string
            addressLine2En?: string
            addressLine2Ja?: string
            cityEn: string
            cityJa: string
            postalCode: string
            prefectureEn?: string
            prefectureJa?: string
        }
    }
    phone?: string
    email?: string
    website?: string
    addressLine1En?: string
    addressLine1Ja?: string
    addressLine2En?: string
    addressLine2Ja?: string
    cityEn?: string
    cityJa?: string
    postalCode?: string
}

type HealthcareProfessionalValidationFields = {
    acceptedInsurance: string[]
    degrees: string[]
    spokenLanguages: string[]
}

type NormalizedFacilityValidationFields = {
    nameEn: string
    nameJa: string
    mapLatitude: string
    mapLongitude: string
    googleMapsUrl: string
    prefectureEn: string
    prefectureJa: string
    phone: string
    email: string
    website: string
    addressLine1En: string
    addressLine1Ja: string
    addressLine2En: string
    addressLine2Ja: string
    cityEn: string
    cityJa: string
    postalCode: string
}

/** First defined value (nullish coalescing), without chaining ?? for eslint complexity. */
function pickStr(...candidates: (string | undefined)[]): string {
    for (const value of candidates) {
        if (value !== undefined && value !== null) {
            return value
        }
    }
    return ''
}

function pickStrTrim(...candidates: (string | undefined)[]): string {
    return pickStr(...candidates).trim()
}

function normalizeFacilityValidationFields(
    fields: FacilityValidationFields
): NormalizedFacilityValidationFields {
    const { contact } = fields
    const address = contact?.address

    return {
        nameEn: fields.nameEn,
        nameJa: fields.nameJa,
        mapLatitude: fields.mapLatitude,
        mapLongitude: fields.mapLongitude,
        googleMapsUrl: pickStrTrim(
            contact?.googleMapsUrl,
            fields.googleMapsUrl,
            fields.googlemapsURL
        ),
        prefectureEn: pickStrTrim(address?.prefectureEn, fields.prefectureEn),
        prefectureJa: pickStrTrim(address?.prefectureJa, fields.prefectureJa),
        phone: pickStr(contact?.phone, fields.phone),
        email: pickStr(contact?.email, fields.email),
        website: pickStr(contact?.website, fields.website),
        addressLine1En: pickStr(address?.addressLine1En, fields.addressLine1En),
        addressLine1Ja: pickStr(address?.addressLine1Ja, fields.addressLine1Ja),
        addressLine2En: pickStr(address?.addressLine2En, fields.addressLine2En),
        addressLine2Ja: pickStr(address?.addressLine2Ja, fields.addressLine2Ja),
        cityEn: pickStr(address?.cityEn, fields.cityEn),
        cityJa: pickStr(address?.cityJa, fields.cityJa),
        postalCode: pickStr(address?.postalCode, fields.postalCode)
    }
}

function getFacilityValidationResults(fields: NormalizedFacilityValidationFields): boolean[] {
    const prefecturesPresent
        = fields.prefectureEn.length > 0
          && fields.prefectureJa.length > 0
    const prefecturesConsistent = checkPrefectureNameMatch({
        prefectureEn: fields.prefectureEn,
        prefectureJa: fields.prefectureJa
    })

    return [
        validateNameEn(fields.nameEn),
        validateNameJa(fields.nameJa),
        validatePhoneNumber(fields.phone),
        validateAddressLineEn(fields.addressLine1En),
        validateAddressLineJa(fields.addressLine1Ja),
        validateCityEn(fields.cityEn),
        validateCityJa(fields.cityJa),
        validatePostalCode(fields.postalCode),
        validateFloat(fields.mapLatitude),
        validateFloat(fields.mapLongitude),
        validateGoogleMapsUrlInput(fields.googleMapsUrl),
        prefecturesPresent && prefecturesConsistent,
        !fields.email || validateEmail(fields.email),
        !fields.website || validateWebsite(fields.website),
        !fields.addressLine2En || validateAddressLineEn(fields.addressLine2En),
        !fields.addressLine2Ja || validateAddressLineJa(fields.addressLine2Ja)
    ]
}

export function validateModerationFacilityFields(fields: FacilityValidationFields): boolean {
    triggerFormValidationErrorMessages('mod-input-field')

    const normalizedFields = normalizeFacilityValidationFields(fields)
    const validationResults = getFacilityValidationResults(normalizedFields)
    return validationResults.every(Boolean)
}

export function hasRequiredHealthcareProfessionalSelections(
    fields: HealthcareProfessionalValidationFields
): boolean {
    return fields.acceptedInsurance.length > 0
      && fields.degrees.length > 0
      && fields.spokenLanguages.length > 0
}
