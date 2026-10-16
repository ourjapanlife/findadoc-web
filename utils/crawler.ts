/**
 * Crawlers that must not be cookie- or Accept-Language-redirected off `/`.
 * A hit on `/ja-JP/...` is still served in that locale; only automatic
 * detection is skipped. Word-ish tokens, so a normal browser UA does not match.
 */
const CRAWLER_USER_AGENT = /bot|crawler|spider|slurp|facebookexternalhit|embedly|quora link preview|whatsapp|google-inspectiontool|mediapartners-google/i

export function isSearchCrawler(userAgent: string | null | undefined): boolean {
    return !!userAgent && CRAWLER_USER_AGENT.test(userAgent)
}
