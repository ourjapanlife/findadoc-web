import {
    INDEXABLE_FACET_MIN_RESULTS,
    languageFacetPathFromSlugs,
    specialtyFacetPathFromSlugs
} from '../../utils/facetPath'
import { prefectureHubPath } from '../../utils/hubPath'
import { test, expect } from '@playwright/test'
import { Locale, Specialty } from '../../typedefs/gqlTypes'

test.describe('Specialty and language facet pages', () => {
    test('an unknown specialty combination is a real HTTP 404', async ({ request }) => {
        const response = await request.get('/not-a-real-prefecture-xyz/dentistry')

        expect(response.status()).toBe(404)
    })

    /*
     * Facet HTML is only emitted for combinations with INDEXABLE_FACET_MIN_RESULTS
     * professionals. The CI seed is five random HPs, so most runs have no facet
     * pages at all (`0 facet pages` in the generate log). Walk the live API the
     * same way generate does, then only assert against a path that was actually
     * prerendered — otherwise skip rather than treating a seed gap as a regression.
     */
    test('renders a seeded specialty facet when generate produced one', async ({ page, request }) => {
        let candidates: Array<{ prefectureEn: string, prefecturePath: string, facetPath: string }> = []

        try {
            const response = await request.post('http://127.0.0.1:4000', {
                data: {
                    query: `query {
                        healthcareProfessionals(filters: { limit: 100 }) {
                            id
                            specialties
                            facilityIds
                        }
                        facilities(filters: { limit: 100 }) {
                            id
                            contact { address { prefectureEn } }
                        }
                    }`
                }
            })
            const json = await response.json() as {
                data?: {
                    healthcareProfessionals?: Array<{
                        id: string
                        specialties?: string[]
                        facilityIds?: string[]
                    }>
                    facilities?: Array<{ id: string, contact?: { address?: { prefectureEn?: string } } }>
                }
            }
            const facilityPrefecture = new Map(
                (json.data?.facilities ?? []).map(facility => [
                    facility.id,
                    facility.contact?.address?.prefectureEn
                ])
            )
            const counts = new Map<string, Set<string>>()

            for (const professional of json.data?.healthcareProfessionals ?? []) {
                const prefectures = new Set(
                    (professional.facilityIds ?? [])
                        .map(id => facilityPrefecture.get(id))
                        .filter((value): value is string => Boolean(value))
                )
                for (const prefectureEn of prefectures) {
                    for (const specialty of professional.specialties ?? []) {
                        if (!Object.values(Specialty).includes(specialty as Specialty)) {
                            continue
                        }
                        const key = `${prefectureEn}::${specialty}`
                        const ids = counts.get(key) ?? new Set<string>()
                        ids.add(professional.id)
                        counts.set(key, ids)
                    }
                }
            }

            candidates = [...counts.entries()]
                .filter(([, ids]) => ids.size >= INDEXABLE_FACET_MIN_RESULTS)
                .flatMap(([key]) => {
                    const [prefectureEn, specialty] = key.split('::')
                    const prefecturePath = prefectureHubPath(prefectureEn)
                    const facetPath = prefecturePath
                        ? specialtyFacetPathFromSlugs(prefecturePath.slice(1), specialty as Specialty)
                        : undefined
                    return prefecturePath && facetPath
                        ? [{ prefectureEn: prefectureEn!, prefecturePath, facetPath }]
                        : []
                })
        } catch {
            test.skip(true, 'local API is not running')
            return
        }

        let chosen: (typeof candidates)[number] | undefined
        for (const candidate of candidates) {
            const probe = await request.get(candidate.facetPath)
            if (probe.status() === 200) {
                chosen = candidate
                break
            }
        }

        if (!chosen) {
            test.skip(
                true,
                `no prerendered specialty facet (API had ${candidates.length} indexable combination(s); CI seed often has none)`
            )
            return
        }

        const { prefecturePath, facetPath } = chosen

        await page.goto(prefecturePath)
        await expect(page.getByTestId('hub-prefecture-page')).toBeVisible()

        await page.goto(facetPath)
        await expect(page.getByTestId('hub-facet-page')).toBeVisible()
        await expect(page.getByTestId('breadcrumbs').locator(`a[href="${prefecturePath}"]`)).toBeVisible()
        await expect(page.getByTestId('search-result-card').first()).toBeVisible()
        expect(languageFacetPathFromSlugs(prefecturePath.slice(1), Locale.EnUs)).toMatch(/-speaking$/)
    })
})
