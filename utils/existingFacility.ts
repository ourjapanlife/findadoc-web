import { gql } from 'graphql-request'
import { gqlClient, graphQLClientRequestWithRetry } from './graphql'

export type ExistingFacilityMatch = {
    id: string
    nameEn: string
    nameJa: string
    prefectureEn: string
    cityEn: string
}

const facilityByGooglePlaceIdQuery = gql`
    query FacilityByGooglePlaceId($placeId: String!) {
        facilityByGooglePlaceId(placeId: $placeId) {
            id
            nameEn
            nameJa
            contact {
                address {
                    prefectureEn
                    cityEn
                }
            }
        }
    }
`

type FacilityByPlaceIdResponse = {
    facilityByGooglePlaceId?: {
        id: string
        nameEn: string
        nameJa: string
        contact?: {
            address?: {
                prefectureEn?: string | null
                cityEn?: string | null
            } | null
        } | null
    } | null
}

const facilityMatchingMapsUrlQuery = gql`
    query FacilityMatchingMapsUrl($url: String!) {
        facilityMatchingMapsUrl(url: $url) {
            id
            nameEn
            nameJa
            contact {
                address {
                    prefectureEn
                    cityEn
                }
            }
        }
    }
`

type FacilityMatchingMapsUrlResponse = {
    facilityMatchingMapsUrl?: FacilityByPlaceIdResponse['facilityByGooglePlaceId']
}

/** The clinic this Maps link already is, after the link is normalized. */
export async function fetchFacilityMatchingMapsUrl(url: string): Promise<ExistingFacilityMatch | null> {
    const response = await graphQLClientRequestWithRetry<FacilityMatchingMapsUrlResponse>(
        gqlClient.request.bind(gqlClient),
        facilityMatchingMapsUrlQuery,
        { url },
        { skipAuth: true, retryAmount: 1, requestTimeoutInMilliseconds: 8000, abortAfterMs: 12000 }
    )

    return matchFromFacility(response.hasErrors ? null : response.data?.facilityMatchingMapsUrl)
}

function matchFromFacility(
    facility: FacilityByPlaceIdResponse['facilityByGooglePlaceId'] | null | undefined
): ExistingFacilityMatch | null {
    if (!facility) return null
    return {
        id: facility.id,
        nameEn: facility.nameEn,
        nameJa: facility.nameJa,
        prefectureEn: facility.contact?.address?.prefectureEn ?? '',
        cityEn: facility.contact?.address?.cityEn ?? ''
    }
}

/** The published clinic that already stores this Google place id. */
export async function fetchFacilityByGooglePlaceId(placeId: string): Promise<ExistingFacilityMatch | null> {
    const response = await graphQLClientRequestWithRetry<FacilityByPlaceIdResponse>(
        gqlClient.request.bind(gqlClient),
        facilityByGooglePlaceIdQuery,
        { placeId },
        { skipAuth: true, retryAmount: 1, requestTimeoutInMilliseconds: 4000, abortAfterMs: 8000 }
    )

    return matchFromFacility(response.hasErrors ? null : response.data?.facilityByGooglePlaceId)
}
