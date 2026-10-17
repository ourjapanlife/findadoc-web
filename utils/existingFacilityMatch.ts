import type { ExistingFacilityMatch } from '~/utils/existingFacility'

/** A match of the clinic already open for editing is not a second clinic. */
export function facilityMatchToShow(
    match: ExistingFacilityMatch | null,
    ignoreId?: string | null
): ExistingFacilityMatch | null {
    if (!match) return null
    const ignored = ignoreId?.trim()
    if (ignored && match.id === ignored) return null
    return match
}
