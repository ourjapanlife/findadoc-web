import { locationCitySlug } from './clinicPath'
import { graphqlEndpoint } from './graphqlEndpoint'

/** One row from the city table. English names have no City or Ward suffix. */
export type CityOption = {
    id: string
    nameEn: string
    nameJa: string
    slug: string
    prefectureEn: string
}

const CITIES_QUERY = `
    query Cities($prefecture: String) {
        cities(prefecture: $prefecture) {
            id
            nameEn
            nameJa
            slug
            prefecture { nameEn }
        }
    }
`

type CitiesResponse = {
    data?: {
        cities?: Array<{
            id: string
            nameEn: string
            nameJa: string
            slug: string
            prefecture?: { nameEn?: string | null } | null
        }>
    }
    errors?: unknown[]
}

const cache = new Map<string, CityOption[]>()
const pending = new Map<string, Promise<CityOption[]>>()

/**
 * Cities for one prefecture, or every current municipality when prefecture is omitted.
 * The web does not invent spellings: options are this list.
 */
export async function fetchCities(prefecture?: string): Promise<CityOption[]> {
    const key = prefecture?.trim().toLowerCase() ?? ''
    const cached = cache.get(key)
    if (cached) {
        return cached
    }

    const inflight = pending.get(key)
    if (inflight) {
        return inflight
    }

    const request = loadCities(key).finally(() => {
        pending.delete(key)
    })
    pending.set(key, request)
    return request
}

async function loadCities(key: string): Promise<CityOption[]> {
    const response = await fetch(graphqlEndpoint(), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            query: CITIES_QUERY,
            variables: { prefecture: key || null }
        }),
        signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
        throw new Error('City list is unavailable')
    }

    const json = await response.json() as CitiesResponse
    if (json.errors?.length || !json.data?.cities) {
        throw new Error('City list is unavailable')
    }

    const cities = json.data.cities.map(city => ({
        id: city.id,
        nameEn: city.nameEn,
        nameJa: city.nameJa,
        slug: city.slug,
        prefectureEn: city.prefecture?.nameEn ?? ''
    }))
    cache.set(key, cities)
    return cities
}

/**
 * A stored facility city matches an official row when the Japanese name is the
 * same, or the English slug is already the official slug. "Minato City" does
 * not match Minato: a suffix is not enough, so Tokyo Chuo and a "Chuo City"
 * spelling stay apart until someone picks the city.
 */
export function matchOfficialCity(
    cities: readonly CityOption[],
    prefectureEn: string | null | undefined,
    cityEn: string | null | undefined,
    cityJa: string | null | undefined
): CityOption | undefined {
    const prefecture = prefectureEn?.trim().toLowerCase() ?? ''
    if (!prefecture) {
        return undefined
    }

    const inPrefecture = cities.filter(city => city.prefectureEn.trim().toLowerCase() === prefecture)
    const japaneseName = cityJa?.trim()
    if (japaneseName) {
        const byJapaneseName = inPrefecture.filter(city => city.nameJa === japaneseName)
        if (byJapaneseName.length === 1) {
            return byJapaneseName[0]
        }
    }

    const slug = locationCitySlug(cityEn)
    if (!slug || slug === 'unknown') {
        return undefined
    }

    return inPrefecture.find(city => city.slug === slug)
}
