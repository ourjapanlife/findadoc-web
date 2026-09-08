import { facilityDocumentTitle, slugifySegment } from './clinicPath'
import { isReservedHubSegment, prefectureHubPathFromSlug } from './hubPath'
import { Locale, Specialty } from '../typedefs/gqlTypes'

/** Combinations below this professional count 404 and stay out of the sitemap. */
export const INDEXABLE_FACET_MIN_RESULTS = 3

export const LANGUAGE_FACET_SUFFIX = '-speaking'

const SPECIALTY_VALUES = Object.values(Specialty) as Specialty[]
const LOCALE_VALUES = Object.values(Locale) as Locale[]

const specialtyToSlug = new Map<Specialty, string>()
const slugToSpecialty = new Map<string, Specialty>()

for (const specialty of SPECIALTY_VALUES) {
    const slug = slugifySegment(specialty.replaceAll('_', ' '))
    if (!slug) {
        continue
    }
    specialtyToSlug.set(specialty, slug)
    slugToSpecialty.set(slug, specialty)
}

const languageToSlug = new Map<Locale, string>()
const slugToLanguage = new Map<string, Locale>()

const languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

function englishLanguageName(languageTag: string): string {
    try {
        return languageNames.of(languageTag.replace('-', '')) ?? languageTag
    } catch {
        return languageTag
    }
}

const tentativeLanguageSlugs = new Map<Locale, string>()
const languageSlugCounts = new Map<string, number>()

for (const locale of LOCALE_VALUES) {
    const languageTag = locale.split('_')[0] ?? locale
    const slug = `${slugifySegment(englishLanguageName(languageTag))}${LANGUAGE_FACET_SUFFIX}`
    tentativeLanguageSlugs.set(locale, slug)
    languageSlugCounts.set(slug, (languageSlugCounts.get(slug) ?? 0) + 1)
}

for (const locale of LOCALE_VALUES) {
    const tentative = tentativeLanguageSlugs.get(locale)
    if (!tentative) {
        continue
    }
    const region = locale.split('_')[1]?.toLowerCase()
    const slug = (languageSlugCounts.get(tentative) ?? 0) > 1 && region
        ? `${tentative.slice(0, -LANGUAGE_FACET_SUFFIX.length)}-${region}${LANGUAGE_FACET_SUFFIX}`
        : tentative
    languageToSlug.set(locale, slug)
    slugToLanguage.set(slug, locale)
}

export function isIndexableFacet(professionalCount: number): boolean {
    return professionalCount >= INDEXABLE_FACET_MIN_RESULTS
}

export function specialtyFacetSlug(specialty: Specialty): string | undefined {
    return specialtyToSlug.get(specialty)
}

export function specialtyFromFacetSlug(slug: string): Specialty | undefined {
    return slugToSpecialty.get(slug)
}

export function languageFacetSlug(locale: Locale): string | undefined {
    return languageToSlug.get(locale)
}

export function languageFromFacetSlug(slug: string): Locale | undefined {
    return slugToLanguage.get(slug)
}

export function languageFacetDisplayName(locale: Locale): string {
    const languageTag = locale.split('_')[0] ?? locale
    return englishLanguageName(languageTag)
}

export function specialtyFacetDisplayName(specialty: Specialty): string {
    return specialty
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, letter => letter.toUpperCase())
}

export function isFacetSecondSegment(slug: string): boolean {
    return Boolean(specialtyFromFacetSlug(slug) || languageFromFacetSlug(slug))
}

export type PrefectureSecondSegment =
    | { kind: 'language', locale: Locale, slug: string }
    | { kind: 'specialty', specialty: Specialty, slug: string }
    | { kind: 'city', slug: string }

export function parsePrefectureSecondSegment(slug: string): PrefectureSecondSegment | undefined {
    if (!slug) {
        return undefined
    }

    const locale = languageFromFacetSlug(slug)
    if (locale) {
        return { kind: 'language', locale, slug }
    }

    const specialty = specialtyFromFacetSlug(slug)
    if (specialty) {
        return { kind: 'specialty', specialty, slug }
    }

    return { kind: 'city', slug }
}

export function specialtyFacetPathFromSlugs(
    prefectureSlug: string,
    specialty: Specialty
): string | undefined {
    const specialtySlug = specialtyFacetSlug(specialty)
    const prefecturePath = prefectureHubPathFromSlug(prefectureSlug)
    if (!specialtySlug || !prefecturePath) {
        return undefined
    }
    return `${prefecturePath}/${specialtySlug}`
}

export function languageFacetPathFromSlugs(
    prefectureSlug: string,
    locale: Locale
): string | undefined {
    const languageSlug = languageFacetSlug(locale)
    const prefecturePath = prefectureHubPathFromSlug(prefectureSlug)
    if (!languageSlug || !prefecturePath || isReservedHubSegment(prefectureSlug)) {
        return undefined
    }
    return `${prefecturePath}/${languageSlug}`
}

export function facetSpecialtyDocumentTitle(specialty: string, prefecture: string): string {
    return facilityDocumentTitle(`${specialty} in ${prefecture}`)
}

export function facetLanguageDocumentTitle(language: string, prefecture: string): string {
    return facilityDocumentTitle(`${language}-speaking care in ${prefecture}`)
}
