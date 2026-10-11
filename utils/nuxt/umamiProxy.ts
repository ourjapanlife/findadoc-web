import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { SITE_ORIGIN } from '../site'

/**
 * First-party paths. EasyPrivacy blocks `/umami.js` and `umami.* /script.js`,
 * and the cloud hosts themselves. These names are the ones Umami's proxy guide
 * uses, and neither is on the general EasyPrivacy list.
 *
 * `data-host-url="/"` is deliberate. The tracker builds the collect URL as
 * `${host.replace(/\/$/, '')}/api/send`, so a single slash becomes the relative
 * path `/api/send` on whatever origin served the page.
 */
export const UMAMI_SCRIPT_PATH = '/stats.js'
export const UMAMI_COLLECT_PATH = '/api/send'
export const UMAMI_DATA_HOST_URL = '/'

const CLOUD_SCRIPT_HOST = 'cloud.umami.is'
const CLOUD_COLLECT_URL = 'https://gateway.umami.is/api/send'

export function cleanUmamiEnv(value?: string): string {
    return value?.replace(/^["']|["']$/g, '').trim() ?? ''
}

/**
 * Production hostnames the tracker is allowed to run on. Deploy previews share
 * this build, and their `/api/send` rewrite would otherwise record into the
 * production website.
 */
export function umamiDataDomains(origin = SITE_ORIGIN): string {
    const host = new URL(origin).hostname
    const apex = host.startsWith('www.') ? host.slice(4) : host
    return host === apex ? host : `${host},${apex}`
}

export type UmamiUpstreams = {
    script: string
    collect: string
}

/**
 * Cloud's script always posts to gateway.umami.is. A self-hosted script posts
 * to `/api/send` on the same origin as the script URL.
 */
export function umamiUpstreams(scriptUrl: string): UmamiUpstreams | null {
    let url: URL
    try {
        url = new URL(scriptUrl)
    } catch {
        return null
    }

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        return null
    }

    const collect = url.hostname === CLOUD_SCRIPT_HOST
        ? CLOUD_COLLECT_URL
        : new URL(UMAMI_COLLECT_PATH, url.origin).href

    return { script: url.href, collect }
}

const SCRIPT_RULE = /^\/stats\.js\s+\S+\s+200\s*$/
const COLLECT_RULE = /^\/api\/send\s+\S+\s+200\s*$/

/**
 * Point the committed proxy rules at the configured script. Netlify has no
 * runtime for `nuxi generate`, so the upstream has to be written into
 * `_redirects` at build time. Returns the original text when nothing changes.
 */
export function applyUmamiProxyRedirects(redirects: string, scriptUrl: string): string {
    const upstreams = umamiUpstreams(scriptUrl)
    if (!upstreams) {
        return redirects
    }

    const scriptLine = `${UMAMI_SCRIPT_PATH}    ${upstreams.script}    200`
    const collectLine = `${UMAMI_COLLECT_PATH}    ${upstreams.collect}    200`
    const lines = redirects.split(/\r?\n/)
    let sawScript = false
    let sawCollect = false

    const rewritten = lines.map(line => {
        if (SCRIPT_RULE.test(line)) {
            sawScript = true
            return scriptLine
        }
        if (COLLECT_RULE.test(line)) {
            sawCollect = true
            return collectLine
        }
        return line
    })

    const missing = [
        sawScript ? null : scriptLine,
        sawCollect ? null : collectLine
    ].filter((line): line is string => line !== null)

    return [...missing, ...rewritten].join('\n')
}

/**
 * Rewrite the generated publish dir, never `public/_redirects`. Dev shutdown
 * also fires Nitro's close hook, and writing the source file would dirty the tree.
 */
export async function writeUmamiProxyRedirects(publicDir: string): Promise<void> {
    const redirectsPath = resolve(publicDir, '_redirects')
    const sourcePath = resolve(process.cwd(), 'public', '_redirects')
    if (redirectsPath === sourcePath || !existsSync(redirectsPath)) {
        return
    }

    const scriptUrl = cleanUmamiEnv(process.env.NUXT_PUBLIC_UMAMI_URL)
    const siteId = cleanUmamiEnv(process.env.NUXT_PUBLIC_UMAMI_SITE_ID)
    if (!scriptUrl || !siteId || !umamiUpstreams(scriptUrl)) {
        return
    }

    const current = await readFile(redirectsPath, 'utf8')
    const next = applyUmamiProxyRedirects(current, scriptUrl)
    if (next !== current) {
        await writeFile(redirectsPath, next)
    }
}

export type UmamiProxyRequest = {
    pathname: string
    method: string
    scriptUrl: string
    body: string
    userAgent: string
    forwardedFor: string
}

export type UmamiProxyResult = {
    status: number
    contentType: string
    cacheControl?: string
    body: string
}

/**
 * Used by the Nitro server (dev, and `nuxi start` when the server bundle is
 * what is running). Production Netlify is static and uses the `_redirects`
 * proxy instead; this handler is not part of that publish.
 */
export async function proxyUmami(
    request: UmamiProxyRequest,
    fetchImpl: typeof fetch = fetch
): Promise<UmamiProxyResult | null> {
    const isScript = request.pathname === UMAMI_SCRIPT_PATH
    const isCollect = request.pathname === UMAMI_COLLECT_PATH
    if (!isScript && !isCollect) {
        return null
    }

    const upstreams = umamiUpstreams(request.scriptUrl)
    if (!upstreams) {
        return { status: 404, contentType: 'text/plain; charset=utf-8', body: '' }
    }

    if (isCollect && request.method !== 'POST') {
        return { status: 405, contentType: 'text/plain; charset=utf-8', body: '' }
    }

    if (isCollect && request.body.length > 16_000) {
        return { status: 413, contentType: 'text/plain; charset=utf-8', body: '' }
    }

    if (isScript && request.method !== 'GET') {
        return { status: 405, contentType: 'text/plain; charset=utf-8', body: '' }
    }

    try {
        const response = isScript
            ? await fetchImpl(upstreams.script)
            : await fetchImpl(upstreams.collect, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'user-agent': request.userAgent,
                    'x-forwarded-for': request.forwardedFor
                },
                body: request.body
            })

        const fallbackType = isScript
            ? 'application/javascript; charset=utf-8'
            : 'application/json; charset=utf-8'

        return {
            status: response.status,
            contentType: response.headers.get('content-type') ?? fallbackType,
            cacheControl: isScript && response.status === 200 ? 'public, max-age=3600' : 'no-store',
            body: await response.text()
        }
    } catch {
        return { status: 502, contentType: 'text/plain; charset=utf-8', body: '' }
    }
}
