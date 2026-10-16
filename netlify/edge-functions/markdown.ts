import {
    canNegotiateMarkdown,
    markdownPathFor,
    MARKDOWN_NOT_FOUND_PATH,
    prefersMarkdown,
    withAcceptVary
} from '../../utils/markdownNegotiation.ts'

type EdgeContext = {
    next: () => Promise<Response>
    rewrite: (path: string) => Promise<Response>
}

function vary(response: Response, status = response.status): Response {
    const headers = new Headers(response.headers)
    headers.set('vary', withAcceptVary(headers.get('vary')))
    return new Response(response.body, { status, headers })
}

function asMarkdown(response: Response, status: number): Response {
    const headers = new Headers(response.headers)
    headers.set('content-type', 'text/markdown; charset=utf-8')
    headers.set('vary', withAcceptVary(headers.get('vary')))
    return new Response(response.body, { status, headers })
}

/**
 * `Accept: text/markdown` on a page that has a sibling .md file. Unknown
 * paths that 404 get /404.md instead of the HTML error shell. Everything
 * else is unchanged apart from `Vary: Accept`.
 */
export default async function markdown(request: Request, context: EdgeContext): Promise<Response> {
    const { pathname } = new URL(request.url)
    const wantsMarkdown = prefersMarkdown(request.headers.get('accept'))
      && canNegotiateMarkdown(pathname)
    const markdownPath = wantsMarkdown ? markdownPathFor(pathname) : undefined

    if (markdownPath) {
        return asMarkdown(await context.rewrite(markdownPath), 200)
    }

    const response = await context.next()
    if (wantsMarkdown && response.status === 404) {
        return asMarkdown(await context.rewrite(MARKDOWN_NOT_FOUND_PATH), 404)
    }
    return vary(response)
}
