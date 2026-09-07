import { facilityDocumentTitle, facilityPath } from '../../utils/clinicPath'
import { formatPageTitle } from '../../utils/site'
import { test, expect } from '@playwright/test'

const UNKNOWN_CLINIC_PATH
    = '/clinic/tokyo/shibuya/missing--00000000-0000-4000-8000-000000000001'

test.describe('Facility pages', () => {
    test('an unknown id is a real HTTP 404, not an SPA 200', async ({ request }) => {
        const response = await request.get(UNKNOWN_CLINIC_PATH)

        expect(response.status()).toBe(404)
    })

    test('renders a seeded facility when the local API is up', async ({ page, request }) => {
        let facility: {
            id: string
            nameEn: string
            contact?: { address?: { cityEn?: string, prefectureEn?: string } }
        } | undefined

        try {
            const response = await request.post('http://127.0.0.1:4000', {
                data: {
                    query: `query {
                        facilities(filters: { limit: 1 }) {
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
            facility = json.data?.facilities?.[0]
        } catch {
            test.skip(true, 'local API is not running')
            return
        }

        if (!facility?.id || !facility.nameEn) {
            test.skip(true, 'local API returned no facilities')
            return
        }

        const path = facilityPath(facility)
        await page.goto(path)

        await expect(page.getByTestId('clinic-page')).toBeVisible()
        await expect(page.getByRole('heading', { level: 1, name: facility.nameEn })).toBeVisible()
        await expect(page).toHaveTitle(formatPageTitle(facilityDocumentTitle(facility.nameEn)))
        await expect(page.getByTestId('clinic-back-to-search')).toBeVisible()
    })
})
