import { gql } from 'graphql-request'
import { gqlClient, graphQLClientRequestWithRetry } from './graphql'
import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'
import type { FacilitySearchResult } from './searchDirectory'
import { useRuntimeConfig } from '#imports'

const PUBLIC_REQUEST_OPTIONS = {
    skipAuth: true,
    retryAmount: 2,
    requestTimeoutInMilliseconds: 1500,
    abortAfterMs: 10000
}

const PROFESSIONAL_PAGE_SIZE = 100

const clinicFacilityQuery = gql`
    query ClinicFacility($id: ID!) {
        facility(id: $id) {
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

const clinicProfessionalsQuery = gql`
    query ClinicProfessionals($filters: HealthcareProfessionalSearchFilters!) {
        healthcareProfessionals(filters: $filters) {
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

function chunkIds(ids: readonly string[], size: number): string[][] {
    const chunks: string[][] = []
    for (let index = 0; index < ids.length; index += size) {
        chunks.push([...ids.slice(index, index + size)])
    }
    return chunks
}

async function fetchProfessionalsByIds(ids: readonly string[]): Promise<HealthcareProfessional[]> {
    if (!ids.length) {
        return []
    }

    const professionals: HealthcareProfessional[] = []

    for (const idsChunk of chunkIds(ids, PROFESSIONAL_PAGE_SIZE)) {
        const response = await graphQLClientRequestWithRetry<{
            healthcareProfessionals: HealthcareProfessional[]
        }>(
            gqlClient.request.bind(gqlClient),
            clinicProfessionalsQuery,
            { filters: { ids: idsChunk, limit: PROFESSIONAL_PAGE_SIZE } },
            PUBLIC_REQUEST_OPTIONS
        )

        if (response.hasErrors) {
            continue
        }

        professionals.push(...(response.data.healthcareProfessionals ?? []))
    }

    const byId = new Map(professionals.map(professional => [professional.id, professional]))
    return ids
        .map(id => byId.get(id))
        .filter((professional): professional is HealthcareProfessional => !!professional)
}

function clinicFromRuntimeConfig(id: string): FacilitySearchResult | null | undefined {
    const directory = useRuntimeConfig().clinicPrerenderDirectory as
        Record<string, FacilitySearchResult> | undefined

    if (!directory || Object.keys(directory).length === 0) {
        return undefined
    }

    return directory[id] ?? null
}

async function clinicFromBundledDirectory(id: string): Promise<FacilitySearchResult | null | undefined> {
    try {
        const mod = await import('#clinic-directory')
        const directory = (mod.default ?? mod) as Record<string, FacilitySearchResult>
        if (!directory || Object.keys(directory).length === 0) {
            return undefined
        }
        return directory[id] ?? null
    } catch {
        return undefined
    }
}

export async function fetchClinicById(id: string): Promise<FacilitySearchResult | null> {
    if (import.meta.server) {
        const fromConfig = clinicFromRuntimeConfig(id)
        if (fromConfig !== undefined) {
            return fromConfig
        }

        const fromBundle = await clinicFromBundledDirectory(id)
        if (fromBundle !== undefined) {
            return fromBundle
        }
    }

    const response = await graphQLClientRequestWithRetry<{ facility?: Facility | null }>(
        gqlClient.request.bind(gqlClient),
        clinicFacilityQuery,
        { id },
        PUBLIC_REQUEST_OPTIONS
    )

    const facility = response.data?.facility
    if (response.hasErrors || !facility) {
        return null
    }

    const healthcareProfessionals = await fetchProfessionalsByIds(facility.healthcareProfessionalIds ?? [])

    return { ...facility, healthcareProfessionals }
}
