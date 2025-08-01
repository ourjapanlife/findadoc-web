import type {
    Contact, ContactInput, Facility,
    MutationUpdateFacilityArgs, PhysicalAddress,
    PhysicalAddressInput,
    Relationship
} from '~/typedefs/gqlTypes'

export type FacilitySectionFields = {
    // contactFields
    nameEn: string
    nameJa: string
    phone: string
    website?: string
    email?: string

    // addressFields
    postalCode: string
    prefectureEn: string
    cityEn: string
    addressLine1En: string
    addressLine2En: string
    prefectureJa: string
    cityJa: string
    addressLine1Ja: string
    addressLine2Ja: string

    // googleMapsFields
    googlemapsURL: string
    mapLatitude: string
    mapLongitude: string

    healthcareProfessionalIds: string[]
    healthProfessionalsRelations: Relationship[]
}

export function mapFacilityAddressToInput(address: PhysicalAddress): PhysicalAddressInput {
    return {
        postalCode: address.postalCode ?? '',
        prefectureEn: address.prefectureEn ?? '',
        cityEn: address.cityEn ?? '',
        addressLine1En: address.addressLine1En ?? '',
        addressLine2En: address.addressLine2En ?? '',
        prefectureJa: address.prefectureJa ?? '',
        cityJa: address.cityJa ?? '',
        addressLine1Ja: address.addressLine1Ja ?? '',
        addressLine2Ja: address.addressLine2Ja ?? ''
    }
}

export function mapFacilityContactToInput(contact: Contact): ContactInput {
    return {
        phone: contact.phone ?? '',
        email: contact.email ?? '',
        website: contact.website ?? '',
        googleMapsUrl: contact.googleMapsUrl ?? '',
        address: mapFacilityAddressToInput(contact.address ?? {} as PhysicalAddress)
    }
}

export function getChangedFacilityFieldsForUpdate(
  current: FacilitySectionFields,
  original: Facility
): MutationUpdateFacilityArgs['input'] {
    const updatedFields: MutationUpdateFacilityArgs['input'] = {}

    if (current.nameEn !== original.nameEn) updatedFields.nameEn = current.nameEn
    if (current.nameJa !== original.nameJa) updatedFields.nameJa = current.nameJa

    const currentLatitude = parseFloat(current.mapLatitude)
    if (!isNaN(currentLatitude) && currentLatitude !== original.mapLatitude) {
        updatedFields.mapLatitude = currentLatitude
    }

    const currentLongitude = parseFloat(current.mapLongitude)
    if (!isNaN(currentLongitude) && currentLongitude !== original.mapLongitude) {
        updatedFields.mapLongitude = currentLongitude
    }

    if (current.healthProfessionalsRelations?.length) {
        updatedFields.healthcareProfessionalIds = current.healthProfessionalsRelations
    }

    const originalContactInput = mapFacilityContactToInput(original.contact as Contact)

    const requiredAddressKeys: (keyof PhysicalAddressInput)[] = [
        'postalCode', 'prefectureEn', 'cityEn', 'addressLine1En',
        'prefectureJa', 'cityJa', 'addressLine1Ja',
        'addressLine2En', 'addressLine2Ja'
    ]

    const updatedAddress: Partial<PhysicalAddressInput> = {}
    for (const key of requiredAddressKeys) {
        updatedAddress[key] = current[key] ?? ''
    }

    /**
 * Checks if there is any contact or address information filled out.
 * Returns true if at least one of the contact fields or address fields is not empty.
 * This helps prevent sending an unnecessary Contact object in the update
 * when all fields are empty or unchanged.
 */
    function isContactInfoPresent(contact: FacilitySectionFields): boolean {
        return (contact.phone ?? '') !== ''
          || (contact.email ?? '') !== ''
          || (contact.website ?? '') !== ''
          || (contact.googlemapsURL ?? '') !== ''
          || requiredAddressKeys.some(key => (contact[key] ?? '') !== '')
    }

    const contactChanged
    = current.phone !== originalContactInput.phone
      || current.googlemapsURL !== originalContactInput.googleMapsUrl
      || current.email !== originalContactInput.email
      || current.website !== originalContactInput.website
      || requiredAddressKeys.some(
          key => updatedAddress[key] !== originalContactInput.address[key]
      )

    if (contactChanged && isContactInfoPresent(current)) {
        const updatedContact: ContactInput = {
            phone: current.phone,
            googleMapsUrl: current.googlemapsURL,
            address: updatedAddress as PhysicalAddressInput
        }

        if (current.email !== originalContactInput.email) {
            updatedContact.email = current.email
        }

        if (current.website !== originalContactInput.website) {
            updatedContact.website = current.website
        }

        updatedFields.contact = updatedContact
    }

    return updatedFields
}
