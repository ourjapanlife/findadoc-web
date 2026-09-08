import { locationCitySlug, locationPrefectureSlug } from './clinicPath'
import {
    cityHubPathFromSlugs,
    isIndexableCityHub,
    prefectureHubPathFromSlug
} from './hubPath'
import type { FacilitySearchResult } from './searchDirectory'

export type HubLocationSource = {
    id: string
    nameEn?: string | null
    nameJa?: string | null
    updatedDate?: string | null
    contact?: {
        address?: {
            cityEn?: string | null
            cityJa?: string | null
            prefectureEn?: string | null
            prefectureJa?: string | null
        } | null
    } | null
}

export type HubCity = {
    prefectureSlug: string
    citySlug: string
    prefectureEn: string
    prefectureJa: string
    cityEn: string
    cityJa: string
    path: string
    facilities: FacilitySearchResult[]
    updatedDate?: string
}

export type HubPrefecture = {
    prefectureSlug: string
    prefectureEn: string
    prefectureJa: string
    path: string
    cities: HubCity[]
    facilities: FacilitySearchResult[]
    updatedDate?: string
}

type MutableCity = Omit<HubCity, 'facilities' | 'updatedDate'> & {
    facilities: FacilitySearchResult[]
    updatedDates: string[]
    prefectureEnLabels: string[]
    prefectureJaLabels: string[]
    cityEnLabels: string[]
    cityJaLabels: string[]
}

function majorityLabel(labels: readonly string[], fallback: string): string {
    const counts = new Map<string, number>()
    for (const label of labels) {
        const trimmed = label.trim()
        if (!trimmed) {
            continue
        }
        counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1)
    }

    let best = fallback
    let bestCount = 0
    for (const [label, count] of counts) {
        if (count > bestCount) {
            best = label
            bestCount = count
        }
    }

    return best
}

function latestTimestamp(values: readonly string[]): string | undefined {
    let best: string | undefined
    let bestMs = Number.NEGATIVE_INFINITY
    for (const value of values) {
        const milliseconds = Date.parse(value)
        if (!Number.isNaN(milliseconds) && milliseconds > bestMs) {
            best = value
            bestMs = milliseconds
        }
    }
    return best
}

function compareName(left: string, right: string): number {
    return left.localeCompare(right, 'en', { sensitivity: 'base' })
}

function asSearchResult(facility: HubLocationSource): FacilitySearchResult {
    if ('healthcareProfessionals' in facility) {
        return facility as FacilitySearchResult
    }

    // Sitemap rows only have address + id; the page loader passes full directory records.
    return { ...facility, healthcareProfessionals: [] } as unknown as FacilitySearchResult
}

function pushLabel(labels: string[], value: string | null | undefined) {
    if (value) {
        labels.push(value)
    }
}

function addFacilityToCity(cities: Map<string, MutableCity>, facility: HubLocationSource) {
    const address = facility.contact?.address
    const prefectureSlug = locationPrefectureSlug(address?.prefectureEn)
    const citySlug = locationCitySlug(address?.cityEn)
    const prefecturePath = prefectureHubPathFromSlug(prefectureSlug)
    const cityPath = cityHubPathFromSlugs(prefectureSlug, citySlug)
    if (!prefecturePath || !cityPath) {
        return
    }

    const key = `${prefectureSlug}/${citySlug}`
    const existing = cities.get(key)
    const result = asSearchResult(facility)

    if (existing) {
        existing.facilities.push(result)
        if (facility.updatedDate) {
            existing.updatedDates.push(facility.updatedDate)
        }
        pushLabel(existing.prefectureEnLabels, address?.prefectureEn)
        pushLabel(existing.prefectureJaLabels, address?.prefectureJa)
        pushLabel(existing.cityEnLabels, address?.cityEn)
        pushLabel(existing.cityJaLabels, address?.cityJa)
        return
    }

    cities.set(key, {
        prefectureSlug,
        citySlug,
        prefectureEn: address?.prefectureEn?.trim() || prefectureSlug,
        prefectureJa: address?.prefectureJa?.trim() || '',
        cityEn: address?.cityEn?.trim() || citySlug,
        cityJa: address?.cityJa?.trim() || '',
        path: cityPath,
        facilities: [result],
        updatedDates: facility.updatedDate ? [facility.updatedDate] : [],
        prefectureEnLabels: address?.prefectureEn ? [address.prefectureEn] : [],
        prefectureJaLabels: address?.prefectureJa ? [address.prefectureJa] : [],
        cityEnLabels: address?.cityEn ? [address.cityEn] : [],
        cityJaLabels: address?.cityJa ? [address.cityJa] : []
    })
}

function resolveCity(city: MutableCity): HubCity {
    city.facilities.sort((left, right) => compareName(left.nameEn ?? '', right.nameEn ?? ''))
    return {
        prefectureSlug: city.prefectureSlug,
        citySlug: city.citySlug,
        prefectureEn: majorityLabel(city.prefectureEnLabels, city.prefectureEn),
        prefectureJa: majorityLabel(city.prefectureJaLabels, city.prefectureJa),
        cityEn: majorityLabel(city.cityEnLabels, city.cityEn),
        cityJa: majorityLabel(city.cityJaLabels, city.cityJa),
        path: city.path,
        facilities: city.facilities,
        updatedDate: latestTimestamp(city.updatedDates)
    }
}

function addCityToPrefecture(byPrefecture: Map<string, HubPrefecture>, city: HubCity) {
    const existing = byPrefecture.get(city.prefectureSlug)
    if (existing) {
        existing.cities.push(city)
        existing.facilities.push(...city.facilities)
        return
    }

    const path = prefectureHubPathFromSlug(city.prefectureSlug)
    if (!path) {
        return
    }

    byPrefecture.set(city.prefectureSlug, {
        prefectureSlug: city.prefectureSlug,
        prefectureEn: city.prefectureEn,
        prefectureJa: city.prefectureJa,
        path,
        cities: [city],
        facilities: [...city.facilities]
    })
}

function finishPrefecture(prefecture: HubPrefecture): HubPrefecture {
    prefecture.cities.sort((left, right) => compareName(left.cityEn, right.cityEn))
    prefecture.facilities.sort((left, right) => compareName(left.nameEn ?? '', right.nameEn ?? ''))
    prefecture.prefectureEn = majorityLabel(
        prefecture.cities.map(city => city.prefectureEn),
        prefecture.prefectureEn
    )
    prefecture.prefectureJa = majorityLabel(
        prefecture.cities.map(city => city.prefectureJa),
        prefecture.prefectureJa
    )
    prefecture.updatedDate = latestTimestamp(
        prefecture.cities.map(city => city.updatedDate).filter((value): value is string => !!value)
    )
    return prefecture
}

export function buildHubIndex(
    facilities: readonly HubLocationSource[]
): { prefectures: HubPrefecture[], byPrefecture: Record<string, HubPrefecture> } {
    const cities = new Map<string, MutableCity>()
    for (const facility of facilities) {
        addFacilityToCity(cities, facility)
    }

    const byPrefecture = new Map<string, HubPrefecture>()
    for (const city of cities.values()) {
        addCityToPrefecture(byPrefecture, resolveCity(city))
    }

    const prefectures = [...byPrefecture.values()]
        .map(finishPrefecture)
        .sort((left, right) => compareName(left.prefectureEn, right.prefectureEn))

    return {
        prefectures,
        byPrefecture: Object.fromEntries(prefectures.map(prefecture => [prefecture.prefectureSlug, prefecture]))
    }
}

export function hubPathsFromFacilities(facilities: readonly HubLocationSource[]): string[] {
    const { prefectures } = buildHubIndex(facilities)
    return prefectures.flatMap(prefecture => [prefecture.path, ...prefecture.cities.map(city => city.path)])
}

export function hubSitemapUrls(facilities: readonly HubLocationSource[]): Array<{ loc: string, lastmod?: string }> {
    const { prefectures } = buildHubIndex(facilities)
    const urls: Array<{ loc: string, lastmod?: string }> = []

    for (const prefecture of prefectures) {
        urls.push(prefecture.updatedDate
            ? { loc: prefecture.path, lastmod: prefecture.updatedDate }
            : { loc: prefecture.path })

        for (const city of prefecture.cities) {
            if (!isIndexableCityHub(city.facilities.length)) {
                continue
            }
            urls.push(city.updatedDate
                ? { loc: city.path, lastmod: city.updatedDate }
                : { loc: city.path })
        }
    }

    return urls
}
