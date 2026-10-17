import {
    INDEXABLE_FACET_MIN_RESULTS,
    languageFacetPathFromSlugs,
    specialtyFacetPathFromSlugs
} from '../../utils/facetPath'
import { prefectureHubPath } from '../../utils/hubPath'
import { test, expect } from '@playwright/test'
import { Locale, Specialty } from '../../typedefs/gqlTypes'
import { jsonLdBlocks } from './jsonLd'
import { assertLocalApiOk, requireLocalRows, skipIfLocalApiIsDown } from './localApi'

test.describe('Specialty and language facet pages', () => {
    test('an unknown specialty combination is a real HTTP 404', async ({ request }) => {
        const response = await request.get('/not-a-real-prefecture-xyz/dentistry')

        expect(response.status()).toBe(404)
    })

    /*
     * Facet HTML is emitted for combinations with INDEXABLE_FACET_MIN_RESULTS
     * professionals. The CI seed pins three Tokyo dentists so generate always
     * writes that page. Walk the live API the same way generate does.
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
                errors?: unknown[]
            }
            assertLocalApiOk(json)
            requireLocalRows(json.data?.healthcareProfessionals, 'local API returned no professionals')
            requireLocalRows(json.data?.facilities, 'local API returned no facilities')
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
        } catch (error) {
            skipIfLocalApiIsDown(error)
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

        expect(
            chosen,
            `no prerendered specialty facet (API had ${candidates.length} indexable combination(s))`
        ).toBeTruthy()
        if (!chosen) {
            return
        }

        const { prefecturePath, facetPath } = chosen

        await page.goto(prefecturePath)
        await expect(page.getByTestId('hub-prefecture-page')).toBeVisible()

        await page.goto(facetPath)
        await expect(page.getByTestId('hub-facet-page')).toBeVisible()
        await expect(page.getByTestId('breadcrumbs').locator(`a[href="${prefecturePath}"]`)).toBeVisible()
        const facetBlocks = await jsonLdBlocks(page)
        expect(facetBlocks.some(block => block['@type'] === 'BreadcrumbList')).toBe(true)
        await expect(page.getByTestId('search-result-card').first()).toBeVisible()
        expect(languageFacetPathFromSlugs(prefecturePath.slice(1), Locale.EnUs)).toMatch(/-speaking$/)
    })
})
