import { prefectureLanguageMatch } from '~/stores/locationsStore'
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

    const lowercasePrefectureEn = prefectureEn.trim().toLowerCase()
    return prefectureLanguageMatch[lowercasePrefectureEn] === prefectureJa
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
export function validateUpdateFacility(input: UpdateFacilityInput): FacilityValidationResult {
    return validateAddress(input.contact?.address)
}

/**
 * Validation specific to required fields (facility update).
 */
export function validateRequiredNotEmpty(
  fields: FacilitySectionFields
): FacilityValidationResult {
    const errors: string[] = []

    // List of required keys that must not be empty
    const requiredKeys: (keyof FacilitySectionFields)[] = [
        'nameEn', 'nameJa',
        'phone',
        'postalCode',
        'prefectureEn', 'cityEn', 'addressLine1En',
        'prefectureJa', 'cityJa', 'addressLine1Ja',
        'googlemapsURL',
        'mapLatitude', 'mapLongitude'
    ]

    for (const key of requiredKeys) {
        const value = fields[key]
        if (typeof value === 'string' && !value.trim()) {
            errors.push('Required fields cannot be empty.')
        }
    }

    return { valid: errors.length === 0, errors }
}
