import type {
    Contact, ContactInput, Facility,
    MutationUpdateFacilityArgs, PhysicalAddress,
    PhysicalAddressInput
} from '~/typedefs/gqlTypes'
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
        phone: current.phone,
        googleMapsUrl: current.googlemapsURL,
        address: {} as PhysicalAddressInput
    }

    if (current.email !== originalContactInput.email) {
        updatedContact.email = current.email
    }

    if (current.website !== originalContactInput.website) {
        updatedContact.website = current.website
    }

    const requiredAddressKeys: (keyof PhysicalAddressInput)[] = [
        'postalCode', 'prefectureEn', 'cityEn', 'addressLine1En',
        'prefectureJa', 'cityJa', 'addressLine1Ja',
        'addressLine2En', 'addressLine2Ja'
    ]

    const updatedAddress: Partial<PhysicalAddressInput> = {}
    for (const key of requiredAddressKeys) {
        updatedAddress[key] = current[key] ?? ''
    }

    updatedContact.address = updatedAddress as PhysicalAddressInput

    const contactChanged
    = current.phone !== originalContactInput.phone
      || current.googlemapsURL !== originalContactInput.googleMapsUrl
      || current.email !== originalContactInput.email
      || current.website !== originalContactInput.website
      || requiredAddressKeys.some(
          key => updatedAddress[key] !== originalContactInput.address[key]
      )

    if (contactChanged) {
        updatedFields.contact = updatedContact
    }

    return updatedFields
}
