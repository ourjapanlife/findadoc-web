import { cityHubPath, prefectureHubPath } from '../../utils/hubPath'
import { test, expect } from '@playwright/test'

test.describe('Geography hub pages', () => {
    test('an unknown prefecture is a real HTTP 404, not an SPA 200', async ({ request }) => {
        const response = await request.get('/not-a-real-prefecture-xyz')

        expect(response.status()).toBe(404)
    })

    test('renders seeded prefecture and city hubs when the local API is up', async ({ page, request }) => {
        let facility: {
            id: string
            nameEn: string
            contact?: { address?: { cityEn?: string, prefectureEn?: string } }
        } | undefined

        try {
            const response = await request.post('http://127.0.0.1:4000', {
                data: {
                    query: `query {
                        facilities(filters: { limit: 50 }) {
                            id
                            nameEn
                            contact { address { cityEn prefectureEn } }
                        }
                    }`
                }
            })
            const json = await response.json() as {
                data?: { facilities?: typeof facility[] }
            }
            facility = json.data?.facilities?.find(row => (
                Boolean(row?.contact?.address?.prefectureEn)
                && Boolean(row?.contact?.address?.cityEn)
            ))
        } catch {
            test.skip(true, 'local API is not running')
            return
        }

        const prefectureEn = facility?.contact?.address?.prefectureEn
        const cityEn = facility?.contact?.address?.cityEn
        const prefecturePath = prefectureHubPath(prefectureEn)
        const cityPath = cityHubPath(prefectureEn, cityEn)

        if (!facility?.id || !prefecturePath || !cityPath) {
            test.skip(true, 'local API returned no located facilities')
            return
        }

        await page.goto(prefecturePath)
        await expect(page.getByTestId('hub-prefecture-page')).toBeVisible()
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await expect(page.getByTestId('breadcrumbs').getByRole('link').first()).toHaveAttribute('href', '/')
        await expect(page.getByTestId('hub-city-list').getByRole('link').first()).toBeVisible()
        await expect(page.getByTestId('search-result-card').filter({ hasText: facility.nameEn })).toBeVisible()

        await page.goto(cityPath)
        await expect(page.getByTestId('hub-city-page')).toBeVisible()
        await expect(page.getByTestId('breadcrumbs').locator(`a[href="${prefecturePath}"]`)).toBeVisible()
        await expect(page.getByTestId('search-result-card').filter({ hasText: facility.nameEn })).toBeVisible()
    })
})
