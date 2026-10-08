import { gql } from 'graphql-request'
import { gqlClient, graphQLClientRequestWithRetry } from './graphql'

export type MapsPlaceDetails = {
    placeId: string | null
    name: string | null
    address: string | null
    category: string | null
}

const mapsPlacePreviewQuery = gql`
    query MapsPlacePreview(
        $name: String
        $latitude: Float
        $longitude: Float
        $placeId: String
        $languageCode: String
    ) {
        mapsPlacePreview(
            name: $name
            latitude: $latitude
            longitude: $longitude
            placeId: $placeId
            languageCode: $languageCode
        ) {
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

/** Live name and address for a Maps link. Nothing returned here is saved with the submission. */
export async function fetchMapsPlaceDetails(input: {
    name: string | null
    latitude: number | null
    longitude: number | null
    placeId: string | null
    languageCode: 'ja' | 'en'
}): Promise<MapsPlaceDetails | null> {
    if (!input.name && !input.placeId) return null

    const response = await graphQLClientRequestWithRetry<MapsPlacePreviewResponse>(
        gqlClient.request.bind(gqlClient),
        mapsPlacePreviewQuery,
        {
            name: input.name,
            latitude: input.latitude,
            longitude: input.longitude,
            placeId: input.placeId,
            languageCode: input.languageCode
        },
        { skipAuth: true, retryAmount: 1, requestTimeoutInMilliseconds: 4000, abortAfterMs: 8000 }
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
