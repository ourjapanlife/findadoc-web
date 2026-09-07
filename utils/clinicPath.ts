import type { Facility } from '~/typedefs/gqlTypes'
import { SITE_TITLE } from './site'

/**
 * IDs are UUIDs (they already contain `-`). A single hyphen between slug and id
 * cannot be parsed, so the route is `/clinic/{prefecture}/{city}/{slug}--{id}`.
 * Issue #1789 wrote `[slug]-[id]`; `--` is the unambiguous form of that suffix.
 */
export const FACILITY_ID_SEPARATOR = '--'

const FALLBACK_SLUG = 'clinic'

export function slugifySegment(value: string | null | undefined): string {
    const slug = (value ?? '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/--+/g, '-')
        .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
        .replace(/^-+|-+$/g, '')

    return slug
}

function segmentOrFallback(value: string | null | undefined, fallback: string): string {
    return slugifySegment(value) || fallback
}

export function facilityIdFromSlugParam(slugParam: string | null | undefined): string | undefined {
    const value = slugParam ?? ''
    const separatorIndex = value.lastIndexOf(FACILITY_ID_SEPARATOR)
    if (separatorIndex < 0) {
        return undefined
    }

    const id = value.slice(separatorIndex + FACILITY_ID_SEPARATOR.length).trim()
    return id || undefined
}

export function facilityPath(facility: Pick<Facility, 'id' | 'nameEn'> & {
    contact?: {
        address?: {
            cityEn?: string | null
            prefectureEn?: string | null
        } | null
    } | null
}): string {
    const prefecture = segmentOrFallback(facility.contact?.address?.prefectureEn, 'japan')
    const city = segmentOrFallback(facility.contact?.address?.cityEn, 'unknown')
    const slug = segmentOrFallback(facility.nameEn, FALLBACK_SLUG)

    return `/clinic/${prefecture}/${city}/${slug}${FACILITY_ID_SEPARATOR}${facility.id}`
}

/**
 * Document title *before* `formatPageTitle` adds the brand suffix, so the
 * branded result stays within 60 characters.
 */
export function facilityDocumentTitle(name: string): string {
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
