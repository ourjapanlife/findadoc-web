import { prefectureLanguageMatch } from '~/stores/locationsStore'

export function validatePrefectureMatch(prefectureEn: string, prefectureJa: string): boolean {
    if (!prefectureEn && !prefectureJa) return true
    if (!prefectureEn || !prefectureJa) return false
    return prefectureLanguageMatch[prefectureEn] === prefectureJa
}

// Checks if a pair of prefecture values match, taking in an object with the fields.
export function checkPrefectureNameMatch(fields: { prefectureEn: string, prefectureJa: string }): boolean {
    return validatePrefectureMatch(fields.prefectureEn, fields.prefectureJa)
}
