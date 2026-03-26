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

export function validateModerationFacilityFields(fields: FacilityValidationFields): boolean {
    const phone = fields.contact?.phone ?? fields.phone ?? ''
    const email = fields.contact?.email ?? fields.email ?? ''
    const website = fields.contact?.website ?? fields.website ?? ''
    const addressLine1En = fields.contact?.address.addressLine1En ?? fields.addressLine1En ?? ''
    const addressLine1Ja = fields.contact?.address.addressLine1Ja ?? fields.addressLine1Ja ?? ''
    const addressLine2En = fields.contact?.address.addressLine2En ?? fields.addressLine2En ?? ''
    const addressLine2Ja = fields.contact?.address.addressLine2Ja ?? fields.addressLine2Ja ?? ''
    const cityEn = fields.contact?.address.cityEn ?? fields.cityEn ?? ''
    const cityJa = fields.contact?.address.cityJa ?? fields.cityJa ?? ''
    const postalCode = fields.contact?.address.postalCode ?? fields.postalCode ?? ''

    const isNameEnValid = validateNameEn(fields.nameEn)
    const isNameJaValid = validateNameJa(fields.nameJa)
    const isPhoneValid = validatePhoneNumber(phone)
    const isAddressLine1EnValid = validateAddressLineEn(addressLine1En)
    const isAddressLine1JaValid = validateAddressLineJa(addressLine1Ja)
    const isCityEnValid = validateCityEn(cityEn)
    const isCityJaValid = validateCityJa(cityJa)
    const isPostalCodeValid = validatePostalCode(postalCode)
    const isLatitudeValid = validateFloat(fields.mapLatitude)
    const isLongitudeValid = validateFloat(fields.mapLongitude)
    const isEmailValid = !email || validateEmail(email)
    const isWebsiteValid = !website || validateWebsite(website)
    const isAddressLine2EnValid = !addressLine2En || validateAddressLineEn(addressLine2En)
    const isAddressLine2JaValid = !addressLine2Ja || validateAddressLineJa(addressLine2Ja)

    triggerFormValidationErrorMessages('mod-input-field')

    return isNameEnValid
      && isNameJaValid
      && isPhoneValid
      && isAddressLine1EnValid
      && isAddressLine1JaValid
      && isCityEnValid
      && isCityJaValid
      && isPostalCodeValid
      && isLatitudeValid
      && isLongitudeValid
      && isEmailValid
      && isWebsiteValid
      && isAddressLine2EnValid
      && isAddressLine2JaValid
}

export function hasRequiredHealthcareProfessionalSelections(
    fields: HealthcareProfessionalValidationFields
): boolean {
    return fields.acceptedInsurance.length > 0
      && fields.degrees.length > 0
      && fields.spokenLanguages.length > 0
}
