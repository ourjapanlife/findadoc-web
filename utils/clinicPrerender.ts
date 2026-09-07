import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { facilityPath } from './clinicPath'
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
 * Concrete `/clinic/...` paths for `nuxi generate`. Unknown IDs must stay a real
 * HTTP 404, so these are listed explicitly rather than given an SPA rewrite.
 *
 * The full directory is fetched in a handful of paged requests and written to
 * disk so each clinic page does not hit `facility(id)` during prerender — that
 * path 429'd production (~900 requests) and failed Netlify / snapshot generate.
 *
 * If the API is unreachable the generate still succeeds — it just ships no clinic
 * HTML, and those URLs 404 until the next build that can see the directory.
 */
export async function listClinicPrerenderPaths(): Promise<string[]> {
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
        return []
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
    writeClinicPrerenderCache(directory)

    return Object.values(directory).map(facility => facilityPath(facility))
}

export function isNuxtGenerateCommand(argv: readonly string[] = process.argv): boolean {
    return argv.includes('generate') && !argv.some(arg => arg.includes('typesgeneratorconfig'))
}
