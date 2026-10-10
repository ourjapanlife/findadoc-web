import { gql } from 'graphql-request'
import { gqlClient, graphQLClientRequestWithRetry } from './graphql'

export type FacilityPlaceCandidate = {
    placeId: string
    name: string | null
    address: string | null
    category: string | null
    confidence: 'HIGH' | 'LOW'
}

export type SuggestFacilityPlacesInput = {
    url?: string | null
    nameEn?: string | null
    nameJa?: string | null
    address?: string | null
    latitude?: number | null
    longitude?: number | null
    languageCode?: string | null
}

const suggestFacilityPlacesQuery = gql`
    query SuggestFacilityPlaces(
        $url: String
        $nameEn: String
        $nameJa: String
        $address: String
        $latitude: Float
        $longitude: Float
        $languageCode: String
    ) {
        suggestFacilityPlaces(
            url: $url
            nameEn: $nameEn
            nameJa: $nameJa
            address: $address
            latitude: $latitude
            longitude: $longitude
            languageCode: $languageCode
        ) {
            placeId
            name
            address
            category
            confidence
        }
    }
`

const confirmFacilityPlaceIdMutation = gql`
    mutation ConfirmFacilityPlaceId($facilityId: ID!, $placeId: String!) {
        confirmFacilityPlaceId(facilityId: $facilityId, placeId: $placeId) {
            id
            googlePlaceId
        }
    }
`

type SuggestResponse = {
    suggestFacilityPlaces?: Array<{
        placeId?: string | null
        name?: string | null
        address?: string | null
        category?: string | null
        confidence?: 'HIGH' | 'LOW' | null
    }> | null
}

type ConfirmResponse = {
    confirmFacilityPlaceId?: {
        id?: string | null
        googlePlaceId?: string | null
    } | null
}

/** Live candidates for the moderation screen. Nothing returned here is saved. */
export async function fetchFacilityPlaceCandidates(
    input: SuggestFacilityPlacesInput
): Promise<FacilityPlaceCandidate[]> {
    const response = await graphQLClientRequestWithRetry<SuggestResponse>(
        gqlClient.request.bind(gqlClient),
        suggestFacilityPlacesQuery,
        input,
        { retryAmount: 0, abortAfterMs: 8000 }
    )

    if (response.hasErrors || !response.data?.suggestFacilityPlaces) return []

    return response.data.suggestFacilityPlaces.flatMap(candidate => {
        if (!candidate.placeId) return []
        return [{
            placeId: candidate.placeId,
            name: candidate.name ?? null,
            address: candidate.address ?? null,
            category: candidate.category ?? null,
            confidence: candidate.confidence === 'HIGH' ? 'HIGH' : 'LOW'
        }]
    })
}

/** Save the place id a moderator picked. The clinic name and address stay as they are. */
export async function confirmFacilityPlace(
    facilityId: string,
    placeId: string
): Promise<string | null> {
    const response = await graphQLClientRequestWithRetry<ConfirmResponse>(
        gqlClient.request.bind(gqlClient),
        confirmFacilityPlaceIdMutation,
        { facilityId, placeId },
        { retryAmount: 0, abortAfterMs: 8000 }
    )

    return response.hasErrors ? null : response.data?.confirmFacilityPlaceId?.googlePlaceId ?? null
}
