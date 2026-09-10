import type { Locale, Specialty } from '../typedefs/gqlTypes'
import type { FacetPage } from './facetIndex'
import { locationPrefectureSlug } from './clinicPath'
import { prefectureHubPath, cityHubPath } from './hubPath'

/**
 * Cross-links and breadcrumb trails for directory pages (#1794).
 *
 * Templates should call these helpers rather than assembling relationships inline:
 * nearby prefectures, sibling specialties, and professional → facet links all come
 * from the same facet index that gates `/tokyo/dentistry`.
 */

export const RELATED_LINK_LIMIT = 8

export type BreadcrumbItem = {
    label: string
    /** Omitted on the current page so it is not a link. */
    to?: string
}

export type RelatedFacetLink = {
    path: string
    label: string
    labelJa: string
}

export type FacetIndexByPrefecture = Record<string, {
    specialties: readonly FacetPage[]
    languages: readonly FacetPage[]
}>

export type ProfessionalFacetLink = {
    path: string
    label: string
    kind: 'specialty' | 'language'
    specialty?: Specialty
    locale?: Locale
}

function compareLabel(left: string, right: string): number {
    return left.localeCompare(right, 'en', { sensitivity: 'base' })
}

export function facilityCrumbs(input: {
    homeLabel: string
    prefectureLabel: string
    prefecturePath?: string
    cityLabel: string
    cityPath?: string
    facilityLabel: string
}): BreadcrumbItem[] {
    const crumbs: BreadcrumbItem[] = [{ label: input.homeLabel, to: '/' }]

    if (input.prefectureLabel && input.prefecturePath) {
        crumbs.push({ label: input.prefectureLabel, to: input.prefecturePath })
    }
    if (input.cityLabel && input.cityPath) {
        crumbs.push({ label: input.cityLabel, to: input.cityPath })
    }

    crumbs.push({ label: input.facilityLabel })
    return crumbs
}

export function prefectureHubCrumbs(input: {
    homeLabel: string
    prefectureLabel: string
}): BreadcrumbItem[] {
    return [
        { label: input.homeLabel, to: '/' },
        { label: input.prefectureLabel }
    ]
}

export function cityHubCrumbs(input: {
    homeLabel: string
    prefectureLabel: string
    prefecturePath?: string
    cityLabel: string
}): BreadcrumbItem[] {
    const crumbs: BreadcrumbItem[] = [{ label: input.homeLabel, to: '/' }]
    if (input.prefectureLabel && input.prefecturePath) {
        crumbs.push({ label: input.prefectureLabel, to: input.prefecturePath })
    }
    crumbs.push({ label: input.cityLabel })
    return crumbs
}

export function facetCrumbs(input: {
    homeLabel: string
    prefectureLabel: string
    prefecturePath?: string
    facetLabel: string
}): BreadcrumbItem[] {
    return cityHubCrumbs({
        homeLabel: input.homeLabel,
        prefectureLabel: input.prefectureLabel,
        prefecturePath: input.prefecturePath,
        cityLabel: input.facetLabel
    })
}

export function professionalCrumbs(input: {
    homeLabel: string
    prefectureLabel?: string
    prefecturePath?: string
    professionalLabel: string
}): BreadcrumbItem[] {
    const crumbs: BreadcrumbItem[] = [{ label: input.homeLabel, to: '/' }]
    if (input.prefectureLabel && input.prefecturePath) {
        crumbs.push({ label: input.prefectureLabel, to: input.prefecturePath })
    }
    crumbs.push({ label: input.professionalLabel })
    return crumbs
}

export function facilityHubPaths(address: {
    prefectureEn?: string | null
    cityEn?: string | null
} | null | undefined): { prefecturePath?: string, cityPath?: string } {
    return {
        prefecturePath: prefectureHubPath(address?.prefectureEn),
        cityPath: cityHubPath(address?.prefectureEn, address?.cityEn)
    }
}

/**
 * Sibling facets in the same prefecture, and the same specialty/language in other
 * prefectures. Nearby is volume-ordered (professional count) because the index has
 * no adjacency graph.
 */
export function relatedFacetLinks(
    current: Pick<FacetPage, 'kind' | 'path' | 'prefectureSlug' | 'specialty' | 'locale'>,
    byPrefecture: FacetIndexByPrefecture,
    limit = RELATED_LINK_LIMIT
): { samePlace: RelatedFacetLink[], nearbySame: RelatedFacetLink[] } {
    const bucket = byPrefecture[current.prefectureSlug]
    const sameKindHere = current.kind === 'specialty'
        ? (bucket?.specialties ?? [])
        : (bucket?.languages ?? [])

    const samePlace = sameKindHere
        .filter(facet => facet.path !== current.path)
        .slice()
        .sort((left, right) => compareLabel(left.label, right.label))
        .slice(0, limit)
        .map(facet => ({
            path: facet.path,
            label: facet.label,
            labelJa: facet.label
        }))

    const nearby: FacetPage[] = []
    for (const [prefectureSlug, entry] of Object.entries(byPrefecture)) {
        if (prefectureSlug === current.prefectureSlug) {
            continue
        }
        const list = current.kind === 'specialty' ? entry.specialties : entry.languages
        const match = current.kind === 'specialty'
            ? list.find(facet => facet.specialty === current.specialty)
            : list.find(facet => facet.locale === current.locale)
        if (match) {
            nearby.push(match)
        }
    }

    const nearbySame = nearby
        .sort((left, right) => (
            (right.professionalCount - left.professionalCount)
            || compareLabel(left.prefectureEn, right.prefectureEn)
        ))
        .slice(0, limit)
        .map(facet => ({
            path: facet.path,
            label: facet.prefectureEn,
            labelJa: facet.prefectureJa || facet.prefectureEn
        }))

    return { samePlace, nearbySame }
}

function uniquePrefectureSlugs(
    facilities: readonly { contact?: { address?: { prefectureEn?: string | null } | null } | null }[]
): string[] {
    const slugs: string[] = []
    const seen = new Set<string>()
    for (const facility of facilities) {
        const slug = locationPrefectureSlug(facility.contact?.address?.prefectureEn)
        if (!slug || seen.has(slug)) {
            continue
        }
        seen.add(slug)
        slugs.push(slug)
    }
    return slugs
}

/**
 * Facet pages a professional actually qualifies for: each specialty and language, in
 * each prefecture they practise, only when that combination cleared the facet threshold.
 */
export function professionalFacetLinks(
    professional: {
        specialties?: Specialty[] | null
        spokenLanguages?: Locale[] | null
    },
    facilities: readonly { contact?: { address?: { prefectureEn?: string | null } | null } | null }[],
    byPrefecture: FacetIndexByPrefecture
): ProfessionalFacetLink[] {
    const links: ProfessionalFacetLink[] = []
    const seen = new Set<string>()

    for (const prefectureSlug of uniquePrefectureSlugs(facilities)) {
        const bucket = byPrefecture[prefectureSlug]
        if (!bucket) {
            continue
        }

        for (const specialty of professional.specialties ?? []) {
            const facet = bucket.specialties.find(entry => entry.specialty === specialty)
            if (!facet || seen.has(facet.path)) {
                continue
            }
            seen.add(facet.path)
            links.push({
                path: facet.path,
                label: facet.label,
                kind: 'specialty',
                specialty: facet.specialty
            })
        }

        for (const locale of professional.spokenLanguages ?? []) {
            const facet = bucket.languages.find(entry => entry.locale === locale)
            if (!facet || seen.has(facet.path)) {
                continue
            }
            seen.add(facet.path)
            links.push({
                path: facet.path,
                label: facet.label,
                kind: 'language',
                locale: facet.locale
            })
        }
    }

    return links
}
