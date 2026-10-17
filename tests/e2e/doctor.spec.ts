import { professionalDocumentTitle, professionalPath } from '../../utils/doctorPath'
import { formatPageTitle } from '../../utils/site'
import type { HealthcareProfessional } from '../../typedefs/gqlTypes'
import { test, expect } from '@playwright/test'
import { jsonLdBlocks } from './jsonLd'
import { assertLocalApiOk, requireLocalRows, skipIfLocalApiIsDown } from './localApi'

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
                    // middleName is part of the public slug. Omitting it requests a path that was never generated.
                    query: `query {
                        healthcareProfessionals(filters: { limit: 1 }) {
                            id
                            names { firstName middleName lastName locale }
                        }
                    }`
                }
            })
            const json = await response.json() as {
                data?: { healthcareProfessionals?: SeededProfessional[] }
                errors?: unknown[]
            }
            assertLocalApiOk(json)
            professional = requireLocalRows(
                json.data?.healthcareProfessionals,
                'local API returned no professionals'
            )[0]
        } catch (error) {
            skipIfLocalApiIsDown(error)
            return
        }

        expect(professional?.id).toBeTruthy()
        if (!professional?.id) {
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
        await expect(page.getByTestId('breadcrumbs')).toBeVisible()

        const blocks = await jsonLdBlocks(page)
        const physician = blocks.find(block => {
            const type = block['@type']
            return type === 'Physician' || (Array.isArray(type) && type.includes('Physician'))
        })
        expect(physician?.name).toBe(headingText)
        const crumbs = blocks.find(block => block['@type'] === 'BreadcrumbList')
        expect(Array.isArray(crumbs?.itemListElement)).toBe(true)
    })
})
