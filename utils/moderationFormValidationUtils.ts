import {
    validateAddressLineEn,
    validateAddressLineJa,
    validateCityEn,
    validateCityJa,
    validateEmail,
    validateFloat,
    validateNameEn,
    validateNameJa,
    validatePhoneNumber,
    validatePostalCode,
    validateWebsite
} from '~/utils/formValidations'
import { triggerFormValidationErrorMessages } from '~/utils/triggerFormValidationErrorMessages'

type FacilityValidationFields = {
    nameEn: string
    nameJa: string
    mapLatitude: string
    mapLongitude: string
    contact?: {
        phone: string
        email?: string
        website?: string
        address: {
            addressLine1En: string
            addressLine1Ja: string
            addressLine2En?: string
            addressLine2Ja?: string
            cityEn: string
            cityJa: string
            postalCode: string
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

function normalizeFacilityValidationFields(
    fields: FacilityValidationFields
): NormalizedFacilityValidationFields {
    return {
        nameEn: fields.nameEn,
        nameJa: fields.nameJa,
        mapLatitude: fields.mapLatitude,
        mapLongitude: fields.mapLongitude,
        phone: fields.contact?.phone ?? fields.phone ?? '',
        email: fields.contact?.email ?? fields.email ?? '',
        website: fields.contact?.website ?? fields.website ?? '',
        addressLine1En: fields.contact?.address?.addressLine1En ?? fields.addressLine1En ?? '',
        addressLine1Ja: fields.contact?.address?.addressLine1Ja ?? fields.addressLine1Ja ?? '',
        addressLine2En: fields.contact?.address?.addressLine2En ?? fields.addressLine2En ?? '',
        addressLine2Ja: fields.contact?.address?.addressLine2Ja ?? fields.addressLine2Ja ?? '',
        cityEn: fields.contact?.address?.cityEn ?? fields.cityEn ?? '',
        cityJa: fields.contact?.address?.cityJa ?? fields.cityJa ?? '',
        postalCode: fields.contact?.address?.postalCode ?? fields.postalCode ?? ''
    }
}

function getFacilityValidationResults(fields: NormalizedFacilityValidationFields): boolean[] {
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
