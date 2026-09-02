import type { LocationQuery, LocationQueryRaw, LocationQueryValue } from 'vue-router'
import type { Locale, Specialty } from '~/typedefs/gqlTypes.js'

export type SearchFilterQueryValue = LocationQueryValue | LocationQueryValue[]

export type SearchFilterQuery = LocationQuery

export type SearchFilters = {
    city?: string
    specialty?: Specialty
    language?: Locale
}

type SearchFilterOptions = {
    specialtyCodes: Specialty[]
    languageCodes: Locale[]
}

const CITY_QUERY_KEY = 'city'
const SPECIALTY_QUERY_KEY = 'specialty'
const LANGUAGE_QUERY_KEY = 'language'

function getFirstQueryValue(value: SearchFilterQueryValue | undefined) {
    const firstValue = Array.isArray(value) ? value[0] : value
    return firstValue === null || firstValue === undefined ? '' : String(firstValue).trim()
}

function normalizeSpecialtyCode(code: string) {
    return code.toLowerCase().replaceAll('_', '-')
}

function normalizeLanguageCode(code: string) {
    return code.toLowerCase().replaceAll('_', '-')
}

export function specialtyToUrlValue(specialty: Specialty) {
    return normalizeSpecialtyCode(specialty)
}

export function languageToUrlValue(language: Locale) {
    return normalizeLanguageCode(language)
}

export function specialtyFromUrlValue(
    value: SearchFilterQueryValue | undefined,
    specialtyCodes: Specialty[]
) {
    const normalizedValue = normalizeSpecialtyCode(getFirstQueryValue(value))

    if (!normalizedValue) return undefined

    return specialtyCodes.find(specialtyCode =>
        normalizeSpecialtyCode(specialtyCode) === normalizedValue)
}

export function languageFromUrlValue(
    value: SearchFilterQueryValue | undefined,
    languageCodes: Locale[]
) {
    const normalizedValue = normalizeLanguageCode(getFirstQueryValue(value))

    if (!normalizedValue) return undefined

    const exactMatch = languageCodes.find(languageCode =>
        normalizeLanguageCode(languageCode) === normalizedValue)

    if (exactMatch) return exactMatch

    const languagePrefix = normalizedValue.split('-')[0]
    const matchesByPrefix = languageCodes.filter(languageCode =>
        normalizeLanguageCode(languageCode).split('-')[0] === languagePrefix)

    // Only expand a shorthand value such as "en" when it is unambiguous.
    return matchesByPrefix.length === 1 ? matchesByPrefix[0] : undefined
}

export function readSearchFiltersFromQuery(
    query: SearchFilterQuery,
    options: SearchFilterOptions
): SearchFilters {
    const city = getFirstQueryValue(query[CITY_QUERY_KEY])
    const specialty = specialtyFromUrlValue(query[SPECIALTY_QUERY_KEY], options.specialtyCodes)
    const language = languageFromUrlValue(query[LANGUAGE_QUERY_KEY], options.languageCodes)

    return {
        city: city || undefined,
        specialty,
        language
    }
}

export function buildSearchFilterQuery(
    currentQuery: SearchFilterQuery,
    filters: SearchFilters
): LocationQueryRaw {
    const nextQuery: LocationQueryRaw = { ...currentQuery }

    if (filters.city) {
        nextQuery[CITY_QUERY_KEY] = filters.city
    } else {
        nextQuery[CITY_QUERY_KEY] = undefined
    }

    if (filters.specialty) {
        nextQuery[SPECIALTY_QUERY_KEY] = specialtyToUrlValue(filters.specialty)
    } else {
        nextQuery[SPECIALTY_QUERY_KEY] = undefined
    }

    if (filters.language) {
        nextQuery[LANGUAGE_QUERY_KEY] = languageToUrlValue(filters.language)
    } else {
        nextQuery[LANGUAGE_QUERY_KEY] = undefined
    }

    return nextQuery
}

export function getSearchFiltersFromStore(
    selectedCity: string | undefined,
    selectedSpecialties: Specialty[] | undefined,
    selectedLanguages: Locale[] | undefined
): SearchFilters {
    return {
        city: selectedCity || undefined,
        specialty: selectedSpecialties?.[0],
        language: selectedLanguages?.[0]
    }
}

export function searchFiltersEqual(left: SearchFilters, right: SearchFilters) {
    return left.city === right.city
      && left.specialty === right.specialty
      && left.language === right.language
}
