import { prefectureDisplayName } from '~/stores/locationsStore'
import type { CreateFacilityInput, UpdateFacilityInput, PhysicalAddressInput } from '~/typedefs/gqlTypes'

export interface FacilityValidationResult {
    valid: boolean
    errors: string[]
}

/**
 * Validates whether prefectureEn and prefectureJa are a matching pair.
 */
export function validatePrefectureMatch(prefectureEn?: string, prefectureJa?: string): boolean {
    if (!prefectureEn && !prefectureJa) return true
    if (!prefectureEn || !prefectureJa) return false

    const trimmedEn = prefectureEn.trim()
    const trimmedJa = prefectureEn.trim()

    for (const name of Object.values(prefectureDisplayName)) {
        if (name.en === trimmedEn && name.ja === trimmedJa) {
            return true
        }
    }
    return false
}

/**
 * Checks if a pair of prefecture values match, taking an object with the fields.
 */
export function checkPrefectureNameMatch(fields: { prefectureEn?: string, prefectureJa?: string }): boolean {
    return validatePrefectureMatch(fields.prefectureEn, fields.prefectureJa)
}

/**
 * Base validation for a facility address (only validates prefectures at the moment).
 */
function validateAddress(address?: PhysicalAddressInput): FacilityValidationResult {
    const errors: string[] = []
    if (!address) return { valid: true, errors }

    const { prefectureEn, prefectureJa } = address
    if (!validatePrefectureMatch(prefectureEn, prefectureJa)) {
        errors.push('Prefecture mismatch: English and Japanese names must match.')
    }

    return { valid: errors.length === 0, errors }
}

/**
 * Validation specific to facility creation (requires prefecture in both languages).
 */
export function validateCreateFacility(input: CreateFacilityInput): FacilityValidationResult {
    const errors: string[] = []

    const addressValidation = validateAddress(input.contact.address)
    errors.push(...addressValidation.errors)

    const { prefectureEn, prefectureJa } = input.contact.address
    if (!prefectureEn || !prefectureJa) {
        errors.push('Please add a prefecture for both Japanese and English.')
    }

    return { valid: errors.length === 0, errors }
}

/**
 * Validation specific to facility updates.
 */
export function validateUpdateFacility(
    fields: FacilitySectionFields,
    updatedInput: UpdateFacilityInput
): FacilityValidationResult {
    const errors: string[] = []
    const addressValidation = validateAddress(updatedInput.contact?.address)
    const addressValidationErrorPresent = !addressValidation.valid

    if (addressValidationErrorPresent) {
        errors.push(...addressValidation.errors)
    }

    // List of required keys that must not be empty
    const alwaysRequiredKeys: (keyof FacilitySectionFields)[] = [
        'nameEn', 'nameJa',
        'phone',
        'postalCode',
        'cityEn', 'addressLine1En',
        'cityJa', 'addressLine1Ja',
        'googlemapsURL',
        'mapLatitude', 'mapLongitude'
    ]

    const allRequiredKeys: (keyof FacilitySectionFields)[] = [
        ...alwaysRequiredKeys,
        'prefectureEn', 'prefectureJa'
    ]

    const keysToValidate = addressValidationErrorPresent
        ? alwaysRequiredKeys
        : allRequiredKeys

    for (const key of keysToValidate) {
        const value = fields[key]
        if (typeof value === 'string' && !value.trim()) {
            errors.push('Required fields cannot be empty.')
        }
    }
    return { valid: errors.length === 0, errors }
}
