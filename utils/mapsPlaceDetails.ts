import { gql } from 'graphql-request'
import { gqlClient, graphQLClientRequestWithRetry } from './graphql'

export type MapsPlaceDetails = {
    placeId: string | null
    name: string | null
    address: string | null
    category: string | null
}

const mapsPlacePreviewQuery = gql`
    query MapsPlacePreview($url: String!, $languageCode: String) {
        mapsPlacePreview(url: $url, languageCode: $languageCode) {
            placeId
            name
            address
            category
        }
    }
`

type MapsPlacePreviewResponse = {
    mapsPlacePreview?: {
        placeId?: string | null
        name?: string | null
        address?: string | null
        category?: string | null
    } | null
}

/** One Places read for a Maps URL. A failure is not retried. Nothing returned here is saved. */
export async function fetchMapsPlaceDetails(
    url: string,
    languageCode: 'ja' | 'en'
): Promise<MapsPlaceDetails | null> {
    const response = await graphQLClientRequestWithRetry<MapsPlacePreviewResponse>(
        gqlClient.request.bind(gqlClient),
        mapsPlacePreviewQuery,
        { url, languageCode },
        { skipAuth: true, retryAmount: 0, abortAfterMs: 8000 }
    )

    const place = response.data?.mapsPlacePreview
    if (response.hasErrors || !place) return null

    return {
        placeId: place.placeId ?? null,
        name: place.name ?? null,
        address: place.address ?? null,
        category: place.category ?? null
    }
}
