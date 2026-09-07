import { facilityPath } from './clinicPath'
import { graphqlEndpoint } from './graphqlEndpoint'

const FACILITY_PAGE_SIZE = 100

const LIST_QUERY = `
    query ClinicPrerenderPage($filters: FacilitySearchFilters!, $countFilters: FacilitySearchFilters!) {
        facilities(filters: $filters) {
            id
            nameEn
            contact {
                address {
                    cityEn
                    prefectureEn
                }
            }
        }
        facilitiesTotalCount(filters: $countFilters)
    }
`

type PrerenderFacility = {
    id: string
    nameEn: string
    contact?: {
        address?: {
            cityEn?: string | null
            prefectureEn?: string | null
        } | null
    } | null
}

type ListResponse = {
    data?: {
        facilities?: PrerenderFacility[]
        facilitiesTotalCount?: number
    }
    errors?: unknown[]
}

async function requestPage(offset: number): Promise<{ rows: PrerenderFacility[], totalCount: number } | null> {
    try {
        const response = await fetch(graphqlEndpoint(), {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                query: LIST_QUERY,
                variables: {
                    filters: { limit: FACILITY_PAGE_SIZE, offset },
                    countFilters: {}
                }
            })
        })

        if (!response.ok) {
            return null
        }

        const json = await response.json() as ListResponse
        if (json.errors?.length) {
            return null
        }

        return {
            rows: json.data?.facilities ?? [],
            totalCount: json.data?.facilitiesTotalCount ?? json.data?.facilities?.length ?? 0
        }
    } catch {
        return null
    }
}

/**
 * Concrete `/clinic/...` paths for `nuxi generate`. Unknown IDs must stay a real
 * HTTP 404, so these are listed explicitly rather than given an SPA rewrite.
 *
 * If the API is unreachable the generate still succeeds — it just ships no clinic
 * HTML, and those URLs 404 until the next build that can see the directory.
 */
export async function listClinicPrerenderPaths(): Promise<string[]> {
    const first = await requestPage(0)
    if (!first) {
        console.warn('[clinic prerender] directory API unavailable; skipping clinic routes')
        return []
    }

    const rows = [...first.rows]
    const totalCount = first.totalCount

    for (let offset = FACILITY_PAGE_SIZE; offset < totalCount; offset += FACILITY_PAGE_SIZE) {
        const page = await requestPage(offset)
        if (!page) {
            console.warn(`[clinic prerender] stopped paging at offset ${offset}`)
            break
        }
        rows.push(...page.rows)
    }

    return rows.map(facility => facilityPath(facility))
}

export function isNuxtGenerateCommand(argv: readonly string[] = process.argv): boolean {
    return argv.includes('generate') && !argv.some(arg => arg.includes('typesgeneratorconfig'))
}
