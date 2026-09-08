import { professionalDocumentTitle, professionalPath } from '../../utils/doctorPath'
import { formatPageTitle } from '../../utils/site'
import { test, expect } from '@playwright/test'

const UNKNOWN_DOCTOR_PATH
    = '/doctor/missing--00000000-0000-4000-8000-000000000001'

test.describe('Professional pages', () => {
    test('an unknown id is a real HTTP 404, not an SPA 200', async ({ request }) => {
        const response = await request.get(UNKNOWN_DOCTOR_PATH)

        expect(response.status()).toBe(404)
    })

    test('renders a seeded professional when the local API is up', async ({ page, request }) => {
        let professional: {
            id: string
            names?: Array<{ firstName?: string, lastName?: string, locale?: string }>
        } | undefined

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
                data?: { healthcareProfessionals?: typeof professional[] }
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

        const path = professionalPath({
            id: professional.id,
            names: professional.names ?? []
        })
        const english = professional.names?.find(name => name.locale === 'en_US')
        const displayName = english
            ? `${english.firstName ?? ''} ${english.lastName ?? ''}`.trim()
            : `${professional.names?.[0]?.firstName ?? ''} ${professional.names?.[0]?.lastName ?? ''}`.trim()

        await page.goto(path)

        await expect(page.getByTestId('doctor-page')).toBeVisible()
        if (displayName) {
            await expect(page.getByRole('heading', { level: 1, name: displayName })).toBeVisible()
            await expect(page).toHaveTitle(formatPageTitle(professionalDocumentTitle(displayName)))
        }
        await expect(page.getByTestId('doctor-back-to-search')).toBeVisible()
    })
})
