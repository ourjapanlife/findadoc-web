import { professionalDocumentTitle, professionalPath } from '../../utils/doctorPath'
import { formatPageTitle } from '../../utils/site'
import type { HealthcareProfessional } from '../../typedefs/gqlTypes'
import { test, expect } from '@playwright/test'

type SeededProfessional = Pick<HealthcareProfessional, 'id' | 'names'>

const UNKNOWN_DOCTOR_PATH
    = '/doctor/missing--00000000-0000-4000-8000-000000000001'

test.describe('Professional pages', () => {
    test('an unknown id is a real HTTP 404, not an SPA 200', async ({ request }) => {
        const response = await request.get(UNKNOWN_DOCTOR_PATH)

        expect(response.status()).toBe(404)
    })

    test('renders a seeded professional when the local API is up', async ({ page, request }) => {
        let professional: SeededProfessional | undefined

        try {
            const response = await request.post('http://127.0.0.1:4000', {
                data: {
                    query: `query {
                        healthcareProfessionals(filters: { limit: 1 }) {
                            id
                            names { firstName lastName locale }
                        }
                    }`
                }
            })
            const json = await response.json() as {
                data?: { healthcareProfessionals?: SeededProfessional[] }
            }
            professional = json.data?.healthcareProfessionals?.[0]
        } catch {
            test.skip(true, 'local API is not running')
            return
        }

        if (!professional?.id) {
            test.skip(true, 'local API returned no professionals')
            return
        }

        const path = professionalPath(professional)

        await page.goto(path)

        await expect(page.getByTestId('doctor-page')).toBeVisible()
        const heading = page.getByRole('heading', { level: 1 })
        await expect(heading).toBeVisible()
        const headingText = (await heading.innerText()).trim()
        await expect(page).toHaveTitle(formatPageTitle(professionalDocumentTitle(headingText)))
        await expect(page.getByTestId('doctor-back-to-search')).toBeVisible()
    })
})
