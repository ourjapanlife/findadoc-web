import {
    isResolvableShortMapsUrl,
    parseMapsPlace,
    validateGoogleMapsUrlInput,
    type MapsPlacePreview
} from './formValidations'

const MAPS_HOSTS = new Set([
    'maps.app.goo.gl',
    'goo.gl',
    'www.google.com',
    'google.com',
    'www.google.co.jp',
    'google.co.jp',
    'maps.google.com',
    'maps.google.co.jp'
])

/**
 * Follow a Maps share link and read the place name and pin from the page it opens.
 * Hops that leave Google Maps are dropped. Nothing returned here is stored.
 */
export async function resolveMapsPlace(
    url: string,
    fetchImpl: typeof fetch = fetch
): Promise<MapsPlacePreview | null> {
    const direct = parseMapsPlace(url)
    if (!direct) return null
    if (!isResolvableShortMapsUrl(url)) return direct

    const expanded = await expandShortMapsUrl(url, fetchImpl)
    if (!expanded) return direct
    return parseMapsPlace(expanded) ?? direct
}

async function expandShortMapsUrl(url: string, fetchImpl: typeof fetch): Promise<string | null> {
    let current = url.trim()

    for (let hop = 0; hop < 5; hop++) {
        if (!isAllowedMapsUrl(current)) return null
        if (!isShortMapsHost(current)) return current

        const response = await fetchImpl(current, {
            method: 'GET',
            redirect: 'manual',
            signal: AbortSignal.timeout(4000)
        })
        const location = response.headers.get('location')
        if (!location) return current
        current = nextMapsHop(current, location)
    }

    return isAllowedMapsUrl(current) ? current : null
}

function nextMapsHop(current: string, location: string): string {
    const absolute = new URL(location, current)
    if ((absolute.hostname === 'www.google.com' || absolute.hostname === 'google.com')
      && absolute.pathname === '/url') {
        const target = absolute.searchParams.get('q') ?? absolute.searchParams.get('url')
        if (target && isAllowedMapsUrl(target)) return target
    }
    return absolute.toString()
}

function isShortMapsHost(url: string): boolean {
    const hostname = new URL(url).hostname
    return hostname === 'maps.app.goo.gl' || hostname === 'goo.gl'
}

function isAllowedMapsUrl(url: string): boolean {
    try {
        const parsed = new URL(url)
        return parsed.protocol === 'https:'
          && MAPS_HOSTS.has(parsed.hostname)
          && (isShortMapsHost(url) || validateGoogleMapsUrlInput(url) || parsed.pathname === '/url')
    } catch {
        return false
    }
}
