import { languageFacetPathFromSlugs, specialtyFacetPathFromSlugs } from '../../utils/facetPath'
import { prefectureHubPath } from '../../utils/hubPath'
import { test, expect } from '@playwright/test'
import { Locale, Specialty } from '../../typedefs/gqlTypes'

test.describe('Specialty and language facet pages', () => {
    test('an unknown specialty combination is a real HTTP 404', async ({ request }) => {
        const response = await request.get('/not-a-real-prefecture-xyz/dentistry')

        expect(response.status()).toBe(404)
    })

    test('renders a seeded specialty facet when the local API has enough professionals', async ({ page, request }) => {
        let prefectureEn: string | undefined

        try {
            const response = await request.post('http://127.0.0.1:4000', {
                data: {
                    query: `query {
                        healthcareProfessionals(filters: { specialties: [DENTISTRY], limit: 50 }) {
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
                    healthcareProfessionals?: Array<{ id: string, facilityIds?: string[] }>
                    facilities?: Array<{ id: string, contact?: { address?: { prefectureEn?: string } } }>
                }
            }
            const facilityPrefecture = new Map(
                (json.data?.facilities ?? []).map(facility => [
                    facility.id,
                    facility.contact?.address?.prefectureEn
                ])
            )
            const counts = new Map<string, number>()
            for (const professional of json.data?.healthcareProfessionals ?? []) {
                const prefectures = new Set(
                    (professional.facilityIds ?? [])
                        .map(id => facilityPrefecture.get(id))
                        .filter((value): value is string => Boolean(value))
                )
                for (const prefecture of prefectures) {
                    counts.set(prefecture, (counts.get(prefecture) ?? 0) + 1)
                }
            }
            prefectureEn = [...counts.entries()].find(([, count]) => count >= 3)?.[0]
        } catch {
            test.skip(true, 'local API is not running')
            return
        }

        const prefecturePath = prefectureHubPath(prefectureEn)
        const facetPath = prefecturePath
            ? specialtyFacetPathFromSlugs(prefecturePath.slice(1), Specialty.Dentistry)
            : undefined

        if (!prefecturePath || !facetPath) {
            test.skip(true, 'local API does not have three dentists in one prefecture')
            return
        }

        await page.goto(prefecturePath)
        await expect(page.getByTestId('hub-prefecture-page')).toBeVisible()

        await page.goto(facetPath)
        await expect(page.getByTestId('hub-facet-page')).toBeVisible()
        await expect(page.getByTestId('breadcrumbs').locator(`a[href="${prefecturePath}"]`)).toBeVisible()
        await expect(page.getByTestId('search-result-card').first()).toBeVisible()
        expect(languageFacetPathFromSlugs(prefecturePath.slice(1), Locale.EnUs)).toMatch(/-speaking$/)
    })
})
