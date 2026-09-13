import { relatedFacetLinks, type RelatedFacetLink } from '~/utils/directoryLinks'
import { loadFacetLinkCatalog, type loadPrefectureLeaf } from '~/utils/hubDirectory'
import { useAsyncData } from '#imports'

export type DirectoryRelatedLinks = {
    prefectureSpecialties: { path: string, label: string }[]
    prefectureLanguages: { path: string, label: string }[]
    samePlace: RelatedFacetLink[]
    nearbySame: RelatedFacetLink[]
}

type DirectoryLeaf = NonNullable<Awaited<ReturnType<typeof loadPrefectureLeaf>>>

/**
 * Related directory chips for city and facet pages. Matching rules live in
 * `directoryLinks` so templates do not hardcode nearby-prefecture or sibling-specialty logic.
 */
export async function useDirectoryRelatedLinks(leaf: DirectoryLeaf) {
    const key = leaf.type === 'city'
        ? `city-related:${leaf.city.path}`
        : `related-facets:${leaf.facet.path}`

    const { data } = await useAsyncData(key, async (): Promise<DirectoryRelatedLinks> => {
        const catalog = await loadFacetLinkCatalog()

        if (leaf.type === 'city') {
            const bucket = catalog?.[leaf.city.prefectureSlug]
            return {
                prefectureSpecialties: (bucket?.specialties ?? []).map(facet => ({
                    path: facet.path,
                    label: facet.label
                })),
                prefectureLanguages: (bucket?.languages ?? []).map(facet => ({
                    path: facet.path,
                    label: facet.label
                })),
                samePlace: [],
                nearbySame: []
            }
        }

        const related = relatedFacetLinks(leaf.facet, catalog ?? {})
        return {
            prefectureSpecialties: [],
            prefectureLanguages: [],
            ...related
        }
    })

    return data
}
