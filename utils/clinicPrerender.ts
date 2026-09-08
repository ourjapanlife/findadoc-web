import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { facilityPath } from './clinicPath'
import { professionalPath } from './doctorPath'
import { graphqlEndpoint } from './graphqlEndpoint'
import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'
import type { FacilitySearchResult } from './searchDirectory'

const PAGE_SIZE = 100
export const CLINIC_PRERENDER_CACHE_ENV = 'NUXT_CLINIC_PRERENDER_CACHE'

const FACILITIES_QUERY = `
    query ClinicPrerenderFacilities($filters: FacilitySearchFilters!, $countFilters: FacilitySearchFilters!) {
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
        facilitiesTotalCount(filters: $countFilters)
    }
`

const PROFESSIONALS_QUERY = `
    query ClinicPrerenderProfessionals(
        $filters: HealthcareProfessionalSearchFilters!
        $countFilters: HealthcareProfessionalSearchFilters!
    ) {
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
        healthcareProfessionalsTotalCount(filters: $countFilters)
    }
`

type FacilitiesPage = {
    facilities?: Facility[]
    facilitiesTotalCount?: number
}

type ProfessionalsPage = {
    healthcareProfessionals?: HealthcareProfessional[]
    healthcareProfessionalsTotalCount?: number
}

async function graphqlPost<T>(query: string, variables: unknown): Promise<T | null> {
    try {
        const response = await fetch(graphqlEndpoint(), {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ query, variables })
        })

        if (!response.ok) {
            return null
        }

        const json = await response.json() as { data?: T, errors?: unknown[] }
        if (json.errors?.length) {
            return null
        }

        return json.data ?? null
    } catch {
        return null
    }
}

async function fetchAllPages<T>(
    requestPage: (offset: number) => Promise<{ rows: T[], totalCount: number } | null>
): Promise<T[] | null> {
    const first = await requestPage(0)
    if (!first) {
        return null
    }

    const rows = [...first.rows]
    for (let offset = PAGE_SIZE; offset < first.totalCount; offset += PAGE_SIZE) {
        const page = await requestPage(offset)
        if (!page) {
            console.warn(`[clinic prerender] stopped paging at offset ${offset}`)
            break
        }
        rows.push(...page.rows)
    }

    return rows
}

export type ProfessionalSearchResult = HealthcareProfessional & {
    facilities: Facility[]
}

export function joinDoctorDirectory(
    facilities: readonly Facility[],
    professionals: readonly HealthcareProfessional[]
): Record<string, ProfessionalSearchResult> {
    const byId = new Map(facilities.map(facility => [facility.id, facility]))
    const directory: Record<string, ProfessionalSearchResult> = {}

    for (const professional of professionals) {
        const affiliated = (professional.facilityIds ?? [])
            .map(id => byId.get(id))
            .filter((facility): facility is Facility => !!facility)

        directory[professional.id] = { ...professional, facilities: affiliated }
    }

    return directory
}

export function joinClinicDirectory(
    facilities: readonly Facility[],
    professionals: readonly HealthcareProfessional[]
): Record<string, FacilitySearchResult> {
    const byId = new Map(professionals.map(professional => [professional.id, professional]))
    const directory: Record<string, FacilitySearchResult> = {}

    for (const facility of facilities) {
        const healthcareProfessionals = (facility.healthcareProfessionalIds ?? [])
            .map(id => byId.get(id))
            .filter((professional): professional is HealthcareProfessional => !!professional)

        directory[facility.id] = { ...facility, healthcareProfessionals }
    }

    return directory
}

export function clinicFromPrerenderDirectory(
    directory: Record<string, FacilitySearchResult> | undefined | null,
    id: string
): FacilitySearchResult | null | undefined {
    if (!directory || Object.keys(directory).length === 0) {
        return undefined
    }

    return directory[id] ?? null
}

export function clinicPrerenderCachePath(cwd = process.cwd()): string {
    return process.env[CLINIC_PRERENDER_CACHE_ENV] || join(cwd, '.nuxt', 'clinic-prerender-cache.json')
}

export function writeClinicPrerenderCache(
    directory: Record<string, FacilitySearchResult>,
    cwd = process.cwd()
): string {
    const filePath = join(cwd, '.nuxt', 'clinic-prerender-cache.json')
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, JSON.stringify(directory))
    process.env[CLINIC_PRERENDER_CACHE_ENV] = filePath
    return filePath
}

export function readClinicPrerenderCache(id: string): FacilitySearchResult | null {
    try {
        const raw = readFileSync(clinicPrerenderCachePath(), 'utf8')
        const directory = JSON.parse(raw) as Record<string, FacilitySearchResult>
        return directory[id] ?? null
    } catch {
        return null
    }
}

/**
 * Concrete `/clinic/...` and `/doctor/...` paths for `nuxi generate`. Unknown
 * IDs must stay a real HTTP 404, so these are listed explicitly rather than
 * given an SPA rewrite.
 *
 * The directory is stored on private `runtimeConfig` so prerender workers can
 * fill each page without calling `facility(id)`. Disk cache + env were invisible
 * to those workers, which 429'd production and failed Netlify.
 *
 * If the API is unreachable the generate still succeeds — it just ships no clinic
 * or doctor HTML, and those URLs 404 until the next build that can see the directory.
 */
export async function buildClinicPrerenderDirectory(): Promise<{
    directory: Record<string, FacilitySearchResult>
    professionalDirectory: Record<string, ProfessionalSearchResult>
    paths: string[]
    professionalPaths: string[]
} | null> {
    const facilities = await fetchAllPages(async offset => {
        const data = await graphqlPost<FacilitiesPage>(FACILITIES_QUERY, {
            filters: { limit: PAGE_SIZE, offset },
            countFilters: {}
        })
        if (!data) return null
        return {
            rows: data.facilities ?? [],
            totalCount: data.facilitiesTotalCount ?? data.facilities?.length ?? 0
        }
    })

    if (!facilities) {
        console.warn('[clinic prerender] directory API unavailable; skipping clinic routes')
        return null
    }

    const professionals = await fetchAllPages(async offset => {
        const data = await graphqlPost<ProfessionalsPage>(PROFESSIONALS_QUERY, {
            filters: { limit: PAGE_SIZE, offset },
            countFilters: {}
        })
        if (!data) return null
        return {
            rows: data.healthcareProfessionals ?? [],
            totalCount: data.healthcareProfessionalsTotalCount ?? data.healthcareProfessionals?.length ?? 0
        }
    }) ?? []

    const directory = joinClinicDirectory(facilities, professionals)
    const professionalDirectory = joinDoctorDirectory(facilities, professionals)
    writeClinicPrerenderCache(directory)

    return {
        directory,
        professionalDirectory,
        paths: Object.values(directory).map(facility => facilityPath(facility)),
        professionalPaths: Object.values(professionalDirectory).map(professional => professionalPath(professional))
    }
}

export async function listClinicPrerenderPaths(): Promise<string[]> {
    return (await buildClinicPrerenderDirectory())?.paths ?? []
}

export function isNuxtGenerateCommand(argv: readonly string[] = process.argv): boolean {
    return argv.includes('generate') && !argv.some(arg => arg.includes('typesgeneratorconfig'))
}
