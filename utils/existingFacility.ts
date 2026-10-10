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

/** The published clinic that already stores this Google place id. */
export async function fetchFacilityByGooglePlaceId(placeId: string): Promise<ExistingFacilityMatch | null> {
    const response = await graphQLClientRequestWithRetry<FacilityByPlaceIdResponse>(
        gqlClient.request.bind(gqlClient),
        facilityByGooglePlaceIdQuery,
        { placeId },
        { skipAuth: true, retryAmount: 1, requestTimeoutInMilliseconds: 4000, abortAfterMs: 8000 }
    )

    const facility = response.data?.facilityByGooglePlaceId
    if (response.hasErrors || !facility) {
        return null
    }

    return {
        id: facility.id,
        nameEn: facility.nameEn,
        nameJa: facility.nameJa,
        prefectureEn: facility.contact?.address?.prefectureEn ?? '',
        cityEn: facility.contact?.address?.cityEn ?? ''
    }
}
