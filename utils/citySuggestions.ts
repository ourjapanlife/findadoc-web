import { gql } from 'graphql-request'
import { gqlClient, graphQLClientRequestWithRetry, initializeGqlClient } from './graphql'
import type { CityOption } from './cityOptions'

/** A live Places suggestion. `label` is shown on this screen and is not stored. */
export type CitySuggestion = {
    placeId: string
    label: string
    city: (CityOption & { prefectureJa: string }) | null
}

type SuggestionCity = {
    id: string
    nameEn: string
    nameJa: string
    slug: string
    prefecture?: { nameEn?: string | null, nameJa?: string | null } | null
}

type SuggestResponse = {
    suggestCities: Array<{
        placeId: string
        label: string
        city?: SuggestionCity | null
    }>
}

const SUGGEST_CITIES = gql`
    query SuggestCities($input: String!) {
        suggestCities(input: $input) {
            placeId
            label
            city {
                id
                nameEn
                nameJa
                slug
                prefecture { nameEn nameJa }
            }
        }
    }
`

const RECORD_CITY_PLACE_ID = gql`
    mutation RecordCityPlaceId($cityId: ID!, $placeId: String!) {
        recordCityPlaceId(cityId: $cityId, placeId: $placeId) {
            id
        }
    }
`

export async function fetchCitySuggestions(input: string): Promise<CitySuggestion[]> {
    initializeGqlClient()
    const response = await graphQLClientRequestWithRetry<SuggestResponse>(
        gqlClient.request.bind(gqlClient),
        SUGGEST_CITIES,
        { input }
    )

    if (response.hasErrors || !response.data?.suggestCities) {
        throw new Error('City suggestions are unavailable')
    }

    return response.data.suggestCities.map(suggestion => ({
        placeId: suggestion.placeId,
        label: suggestion.label,
        city: suggestion.city
            ? {
                id: suggestion.city.id,
                nameEn: suggestion.city.nameEn,
                nameJa: suggestion.city.nameJa,
                slug: suggestion.city.slug,
                prefectureEn: suggestion.city.prefecture?.nameEn ?? '',
                prefectureJa: suggestion.city.prefecture?.nameJa ?? ''
            }
            : null
    }))
}

/** Stores the city place id only. The suggestion label is not sent back. */
export async function recordCityPlaceId(cityId: string, placeId: string): Promise<void> {
    initializeGqlClient()
    const response = await graphQLClientRequestWithRetry<{ recordCityPlaceId: { id: string } }>(
        gqlClient.request.bind(gqlClient),
        RECORD_CITY_PLACE_ID,
        { cityId, placeId }
    )

    if (response.hasErrors) {
        throw new Error('City place id was not saved')
    }
}
