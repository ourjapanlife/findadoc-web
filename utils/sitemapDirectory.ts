import { gql, GraphQLClient } from 'graphql-request'
import type { FacilitySearchFilters, HealthcareProfessionalSearchFilters } from '~/typedefs/gqlTypes'

/**
 * Same cap the directory store uses. The API silently truncates or errors above this
 * (see `FACILITY_PAGE_SIZE` in `stores/searchResultsStore.ts`).
 */
export const SITEMAP_DIRECTORY_PAGE_SIZE = 100

/**
 * Entity URL prefixes. `undefined` until the matching page tree ships:
 * facility #1789, professional #1790. The sitemap fetch is skipped while every
 * prefix is unset so `nuxi generate` does not advertise URLs that 404.
 *
 * Hub and facet pages (#1791, #1792) add their own prefixes here the same way.
 */
export const DIRECTORY_SITEMAP_PATHS = {
    facility: undefined as string | undefined,
    professional: undefined as string | undefined
}

export type SitemapDirectoryKind = keyof typeof DIRECTORY_SITEMAP_PATHS

export type SitemapDirectoryEntry = {
    kind: SitemapDirectoryKind
    id: string
    updatedDate?: string | null
}

export type SitemapDirectoryUrl = {
    loc: string
    lastmod?: string
}

type DirectoryPage<T> = {
    rows: T[]
    totalCount: number
}

export function directorySitemapLoc(
    kind: SitemapDirectoryKind,
    id: string,
    paths: typeof DIRECTORY_SITEMAP_PATHS = DIRECTORY_SITEMAP_PATHS
): string | undefined {
    const prefix = paths[kind]
    if (!prefix) {
        return undefined
    }
    return `${prefix}/${id}`
}

export function sitemapUrlFromEntry(
    entry: SitemapDirectoryEntry,
    paths: typeof DIRECTORY_SITEMAP_PATHS = DIRECTORY_SITEMAP_PATHS
): SitemapDirectoryUrl | undefined {
    const loc = directorySitemapLoc(entry.kind, entry.id, paths)
    if (!loc) {
        return undefined
    }

    const lastmod = entry.updatedDate?.trim()
    return lastmod ? { loc, lastmod } : { loc }
}

/**
 * First page reports the total; further pages use the size the server actually
 * returned so a lower cap still finishes instead of truncating.
 */
export async function collectPagedRows<T>(
    requestPage: (offset: number) => Promise<DirectoryPage<T>>
): Promise<T[]> {
    const first = await requestPage(0)
    const pageSize = first.rows.length

    if (!pageSize || first.totalCount <= pageSize) {
        return first.rows
    }

    const rows = [...first.rows]
    for (let offset = pageSize; offset < first.totalCount; offset += pageSize) {
        const page = await requestPage(offset)
        rows.push(...page.rows)
    }
    return rows
}

export function directoryKindsToFetch(
    paths: typeof DIRECTORY_SITEMAP_PATHS = DIRECTORY_SITEMAP_PATHS
): SitemapDirectoryKind[] {
    return (Object.keys(paths) as SitemapDirectoryKind[])
        .filter(kind => Boolean(paths[kind]))
}

const sitemapFacilitiesQuery = gql`
    query SitemapFacilities($filters: FacilitySearchFilters!, $countFilters: FacilitySearchFilters!) {
        facilities(filters: $filters) {
            id
            updatedDate
        }
        facilitiesTotalCount(filters: $countFilters)
    }
`

const sitemapProfessionalsQuery = gql`
    query SitemapProfessionals(
        $filters: HealthcareProfessionalSearchFilters!
        $countFilters: HealthcareProfessionalSearchFilters!
    ) {
        healthcareProfessionals(filters: $filters) {
            id
            updatedDate
        }
        healthcareProfessionalsTotalCount(filters: $countFilters)
    }
`

function directoryApiUrl(): string {
    return process.env.NUXT_USE_LOCAL_API ? 'http://127.0.0.1:4000' : 'https://api.findadoc.jp'
}

type DirectoryFetcher = {
    fetchFacilities: (offset: number) => Promise<DirectoryPage<{ id: string, updatedDate?: string | null }>>
    fetchProfessionals: (offset: number) => Promise<DirectoryPage<{ id: string, updatedDate?: string | null }>>
}

function graphqlDirectoryFetcher(apiUrl = directoryApiUrl()): DirectoryFetcher {
    const client = new GraphQLClient(apiUrl)

    return {
        async fetchFacilities(offset) {
            const filters = {
                limit: SITEMAP_DIRECTORY_PAGE_SIZE,
                offset
            } satisfies FacilitySearchFilters

            const data = await client.request<{
                facilities: Array<{ id: string, updatedDate?: string | null }>
                facilitiesTotalCount: number
            }>(sitemapFacilitiesQuery, {
                filters,
                countFilters: {} satisfies FacilitySearchFilters
            })

            return {
                rows: data.facilities ?? [],
                totalCount: data.facilitiesTotalCount ?? data.facilities?.length ?? 0
            }
        },
        async fetchProfessionals(offset) {
            const filters = {
                limit: SITEMAP_DIRECTORY_PAGE_SIZE,
                offset
            } satisfies HealthcareProfessionalSearchFilters

            const data = await client.request<{
                healthcareProfessionals: Array<{ id: string, updatedDate?: string | null }>
                healthcareProfessionalsTotalCount: number
            }>(sitemapProfessionalsQuery, {
                filters,
                countFilters: {} satisfies HealthcareProfessionalSearchFilters
            })

            return {
                rows: data.healthcareProfessionals ?? [],
                totalCount: data.healthcareProfessionalsTotalCount ?? data.healthcareProfessionals?.length ?? 0
            }
        }
    }
}

export async function loadDirectorySitemapUrls(
    fetcher: DirectoryFetcher = graphqlDirectoryFetcher(),
    paths: typeof DIRECTORY_SITEMAP_PATHS = DIRECTORY_SITEMAP_PATHS
): Promise<SitemapDirectoryUrl[]> {
    const kinds = directoryKindsToFetch(paths)
    if (kinds.length === 0) {
        return []
    }

    const entries: SitemapDirectoryEntry[] = []

    if (kinds.includes('facility')) {
        const facilities = await collectPagedRows(offset => fetcher.fetchFacilities(offset))
        entries.push(...facilities.map(row => ({
            kind: 'facility' as const,
            id: row.id,
            updatedDate: row.updatedDate
        })))
    }

    if (kinds.includes('professional')) {
        const professionals = await collectPagedRows(offset => fetcher.fetchProfessionals(offset))
        entries.push(...professionals.map(row => ({
            kind: 'professional' as const,
            id: row.id,
            updatedDate: row.updatedDate
        })))
    }

    return entries.flatMap(entry => {
        const url = sitemapUrlFromEntry(entry, paths)
        return url ? [url] : []
    })
}
