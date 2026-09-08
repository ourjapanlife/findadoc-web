import { gql } from 'graphql-request'
import { gqlClient, graphQLClientRequestWithRetry } from './graphql'
import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'
import type { ProfessionalSearchResult } from './clinicPrerender'
import { useRuntimeConfig } from '#imports'

const PUBLIC_REQUEST_OPTIONS = {
    skipAuth: true,
    retryAmount: 2,
    requestTimeoutInMilliseconds: 1500,
    abortAfterMs: 10000
}

const doctorProfessionalQuery = gql`
    query DoctorProfessional($id: ID!) {
        healthcareProfessional(id: $id) {
            id
            names {
                lastName
                firstName
                middleName
                locale
            }
            degrees
            specialties
            facilityIds
            spokenLanguages
            acceptedInsurance
            additionalInfoForPatients
            createdDate
            updatedDate
        }
    }
`

const doctorFacilitiesQuery = gql`
    query DoctorFacilities($filters: FacilitySearchFilters!) {
        facilities(filters: $filters) {
            id
            nameEn
            nameJa
            mapLatitude
            mapLongitude
            healthcareProfessionalIds
            contact {
                address {
                    addressLine1En
                    addressLine2En
                    addressLine1Ja
                    addressLine2Ja
                    cityJa
                    cityEn
                    prefectureJa
                    prefectureEn
                    postalCode
                }
                email
                googleMapsUrl
                phone
                website
            }
            createdDate
            updatedDate
        }
    }
`

function doctorFromPrerenderDirectory(
    directory: Record<string, ProfessionalSearchResult> | undefined | null,
    id: string
): ProfessionalSearchResult | null | undefined {
    if (!directory || Object.keys(directory).length === 0) {
        return undefined
    }

    return directory[id] ?? null
}

function doctorFromRuntimeConfig(id: string): ProfessionalSearchResult | null | undefined {
    const directory = useRuntimeConfig().doctorPrerenderDirectory as
        Record<string, ProfessionalSearchResult> | undefined

    return doctorFromPrerenderDirectory(directory, id)
}

async function doctorFromBundledDirectory(id: string): Promise<ProfessionalSearchResult | null | undefined> {
    try {
        const mod = await import('#doctor-directory')
        const directory = (mod.default ?? mod) as Record<string, ProfessionalSearchResult>
        return doctorFromPrerenderDirectory(directory, id)
    } catch {
        return undefined
    }
}

function facilitiesInListedOrder(
    professional: HealthcareProfessional,
    fetched: readonly Facility[]
): Facility[] {
    const byId = new Map(fetched.map(facility => [facility.id, facility]))
    const ordered = (professional.facilityIds ?? [])
        .map(id => byId.get(id))
        .filter((facility): facility is Facility => !!facility)

    if (ordered.length) {
        return ordered
    }

    return [...fetched]
}

export async function fetchDoctorById(id: string): Promise<ProfessionalSearchResult | null> {
    if (import.meta.server) {
        const fromConfig = doctorFromRuntimeConfig(id)
        if (fromConfig !== undefined) {
            return fromConfig
        }

        const fromBundle = await doctorFromBundledDirectory(id)
        if (fromBundle !== undefined) {
            return fromBundle
        }
    }

    const response = await graphQLClientRequestWithRetry<{
        healthcareProfessional?: HealthcareProfessional | null
    }>(
        gqlClient.request.bind(gqlClient),
        doctorProfessionalQuery,
        { id },
        PUBLIC_REQUEST_OPTIONS
    )

    const professional = response.data?.healthcareProfessional
    if (response.hasErrors || !professional) {
        return null
    }

    const facilitiesResponse = await graphQLClientRequestWithRetry<{ facilities?: Facility[] }>(
        gqlClient.request.bind(gqlClient),
        doctorFacilitiesQuery,
        { filters: { healthcareProfessionalIds: [id], limit: 100 } },
        PUBLIC_REQUEST_OPTIONS
    )

    const fetched = facilitiesResponse.hasErrors
        ? []
        : (facilitiesResponse.data?.facilities ?? [])

    return {
        ...professional,
        facilities: facilitiesInListedOrder(professional, fetched)
    }
}
