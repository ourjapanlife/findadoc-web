import type { Page } from '@playwright/test'

export async function jsonLdBlocks(page: Page): Promise<Record<string, unknown>[]> {
    const texts = await page.locator('script[type="application/ld+json"]').allTextContents()
    return texts.map(text => JSON.parse(text) as Record<string, unknown>)
}
