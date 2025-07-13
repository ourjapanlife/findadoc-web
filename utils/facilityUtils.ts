import type { Contact, ContactInput, Facility, MutationUpdateFacilityArgs,
    PhysicalAddress, PhysicalAddressInput } from '~/typedefs/gqlTypes'
import type { useFacilitiesStore } from '~/stores/facilitiesStore'

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
  current: ReturnType<typeof useFacilitiesStore>['facilitySectionFields'],
  original: Facility
): MutationUpdateFacilityArgs['input'] {
    const updatedFields: MutationUpdateFacilityArgs['input'] = {}

    if (current.nameEn !== original.nameEn) updatedFields.nameEn = current.nameEn
    if (current.nameJa !== original.nameJa) updatedFields.nameJa = current.nameJa

    const currentLatitude = parseFloat(current.mapLatitude)
    if (currentLatitude !== original.mapLatitude) updatedFields.mapLatitude = currentLatitude

    const currentLongitude = parseFloat(current.mapLongitude)
    if (currentLongitude !== original.mapLongitude) updatedFields.mapLongitude = currentLongitude

    if (current.healthProfessionalsRelations?.length) {
        updatedFields.healthcareProfessionalIds = current.healthProfessionalsRelations
    }

    const originalContactInput = mapFacilityContactToInput(original.contact as Contact)

    const updatedContact: ContactInput = {
        phone: current.phone || originalContactInput.phone,
        email: current.email || originalContactInput.email,
        website: current.website || originalContactInput.website,
        googleMapsUrl: current.googlemapsURL || originalContactInput.googleMapsUrl,
        address: { ...originalContactInput.address }
    }

    const addressKeys: (keyof PhysicalAddressInput)[] = [
        'postalCode', 'prefectureEn', 'cityEn', 'addressLine1En', 'addressLine2En',
        'prefectureJa', 'cityJa', 'addressLine1Ja', 'addressLine2Ja'
    ]

    for (const key of addressKeys) {
        if (current[key] && current[key] !== originalContactInput.address[key]) {
            updatedContact.address[key] = current[key]
        }
    }

    const contactChanged = (
        updatedContact.phone !== originalContactInput.phone
        || updatedContact.email !== originalContactInput.email
        || updatedContact.website !== originalContactInput.website
        || updatedContact.googleMapsUrl !== originalContactInput.googleMapsUrl
        || addressKeys.some(key => updatedContact.address[key] !== originalContactInput.address[key])
    )

    if (contactChanged) {
        updatedFields.contact = updatedContact
    }

    return updatedFields
}
