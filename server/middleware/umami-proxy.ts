import {
    defineEventHandler,
    getRequestHeader,
    getRequestIP,
    getRequestURL,
    readRawBody,
    setResponseHeader,
    setResponseStatus
} from 'h3'
import { cleanUmamiEnv, proxyUmami, UMAMI_COLLECT_PATH, UMAMI_SCRIPT_PATH } from '~/utils/nuxt/umamiProxy'

/**
 * Same-origin proxy for the Umami tracker while a Nitro server is actually
 * running (`nuxi dev`, and `nuxi start` when that server bundle handles
 * requests). The production site is `nuxi generate` on Netlify, which does not
 * deploy server routes, so the same two paths are also proxied from
 * `public/_redirects`.
 */
export default defineEventHandler(async event => {
    const pathname = getRequestURL(event).pathname
    if (pathname !== UMAMI_SCRIPT_PATH && pathname !== UMAMI_COLLECT_PATH) {
        return
    }

    const body = pathname === UMAMI_COLLECT_PATH
        ? await readRawBody(event, 'utf8') ?? ''
        : ''

    const result = await proxyUmami({
        pathname,
        method: event.method,
        scriptUrl: cleanUmamiEnv(process.env.NUXT_PUBLIC_UMAMI_URL),
        body,
        userAgent: getRequestHeader(event, 'user-agent') ?? '',
        forwardedFor: getRequestIP(event, { xForwardedFor: true }) ?? ''
    })

    if (!result) {
        return
    }

    setResponseStatus(event, result.status)
    setResponseHeader(event, 'content-type', result.contentType)
    if (result.cacheControl) {
        setResponseHeader(event, 'cache-control', result.cacheControl)
    }
    return result.body
})
