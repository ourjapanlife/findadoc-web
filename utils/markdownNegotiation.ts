/**
 * Static generate cannot vary a response on Accept. Netlify's edge function
 * uses this map: a request that prefers text/markdown is rewritten to the
 * sibling file, and a 404 is replaced with /404.md. Dev and the preview
 * server serve the .md URLs directly.
 */
const MARKDOWN_PAGES: Record<string, string> = {
    '/': '/index.md',
    '/about': '/about.md',
    '/contact': '/contact.md',
    '/privacypolicy': '/privacypolicy.md',
    '/npo': '/npo.md'
}

export const MARKDOWN_NOT_FOUND_PATH = '/404.md'

type AcceptPart = { type: string, q: number }

function acceptParts(header: string): AcceptPart[] {
    return header.split(',').flatMap(part => {
        const [rawType, ...params] = part.split(';').map(piece => piece.trim())
        if (!rawType) {
            return []
        }
        const qParam = params.find(param => param.toLowerCase().startsWith('q='))
        const q = qParam ? Number(qParam.slice(2)) : 1
        return [{ type: rawType.toLowerCase(), q: Number.isFinite(q) ? q : 0 }]
    })
}

/** True when text/markdown is present and ranked at least as high as text/html. */
export function prefersMarkdown(accept: string | null | undefined): boolean {
    if (!accept) {
        return false
    }
    const parts = acceptParts(accept)
    const markdown = parts.find(part => part.type === 'text/markdown')
    if (!markdown || markdown.q <= 0) {
        return false
    }
    const html = parts.find(part => part.type === 'text/html')
    return !html || markdown.q >= html.q
}

export function markdownPathFor(pathname: string): string | undefined {
    const trimmed = pathname.length > 1 && pathname.endsWith('/')
        ? pathname.slice(0, -1)
        : pathname || '/'
    return MARKDOWN_PAGES[trimmed]
}

/** File-like paths (assets, the markdown files themselves) are not negotiated. */
export function canNegotiateMarkdown(pathname: string): boolean {
    const last = pathname.split('/').pop() ?? ''
    return !last.includes('.')
}

export function withAcceptVary(existing: string | null): string {
    const parts = (existing ?? '').split(',').map(part => part.trim()).filter(Boolean)
    if (!parts.some(part => part.toLowerCase() === 'accept')) {
        parts.push('Accept')
    }
    return parts.join(', ')
}
