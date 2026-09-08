import type { HealthcareProfessional, LocalizedName } from '~/typedefs/gqlTypes'
import { FACILITY_ID_SEPARATOR, facilityIdFromSlugParam, slugifySegment } from './clinicPath'
import { SITE_TITLE } from './site'

/**
 * Same `--` join as clinic URLs: professional IDs are UUIDs, so a single hyphen
 * between slug and id cannot be parsed. Issue #1790 wrote `/doctor/[slug]-[id]`.
 */
export const DOCTOR_ID_SEPARATOR = FACILITY_ID_SEPARATOR

const FALLBACK_SLUG = 'doctor'

function segmentOrFallback(value: string | null | undefined, fallback: string): string {
    return slugifySegment(value) || fallback
}

export const professionalIdFromSlugParam = facilityIdFromSlugParam

/**
 * Slug source: English name when present, then Japanese, then the first locale.
 */
export function professionalSlugName(names: readonly LocalizedName[] | null | undefined): string {
    const english = names?.find(name => name.locale === 'en_US')
    const japanese = names?.find(name => name.locale === 'ja_JP')
    const first = names?.[0]

    const from = (name?: LocalizedName) => [name?.firstName, name?.middleName, name?.lastName]
        .map(part => part?.trim())
        .filter((part): part is string => !!part)
        .join(' ')

    return from(english) || from(japanese) || from(first) || ''
}

export function professionalPath(professional: Pick<HealthcareProfessional, 'id' | 'names'>): string {
    const slug = segmentOrFallback(professionalSlugName(professional.names), FALLBACK_SLUG)
    return `/doctor/${slug}${DOCTOR_ID_SEPARATOR}${professional.id}`
}

/**
 * Document title *before* `formatPageTitle` adds the brand suffix, so the
 * branded result stays within 60 characters.
 */
export function professionalDocumentTitle(name: string): string {
    const maxName = 60 - ` · ${SITE_TITLE}`.length
    const trimmed = name.trim()

    if (trimmed.length <= maxName) {
        return trimmed
    }

    if (maxName <= 1) {
        return '…'
    }

    return `${trimmed.slice(0, maxName - 1).trimEnd()}…`
}
