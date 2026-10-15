import { defineEventHandler, getRequestHeader } from 'h3'
import { isSearchCrawler } from '~/utils/crawler'

const LOCALE_COOKIE = 'i18n_redirected'

/**
 * i18n reads the cookie and Accept-Language inside `render:before`. Clearing
 * both on the request, before that hook, keeps `/` from 302ing a crawler.
 * A URL that already has a locale prefix is unaffected: detection only runs
 * on `/` (`redirectOn: 'root'`).
 */
export default defineEventHandler(event => {
    const userAgent = getRequestHeader(event, 'user-agent')
    if (!isSearchCrawler(userAgent)) {
        return
    }

    const headers = event.node.req.headers
    headers['accept-language'] = ''

    const cookie = headers.cookie
    if (!cookie || !cookie.includes(LOCALE_COOKIE)) {
        return
    }

    const next = cookie
        .split(';')
        .map(part => part.trim())
        .filter(part => part.length > 0 && !part.startsWith(`${LOCALE_COOKIE}=`))
        .join('; ')

    if (next) {
        headers.cookie = next
    } else {
        delete headers.cookie
    }
})
