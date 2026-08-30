import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export type ServeRewrite = { source: string, destination: string }

export type ServeJson = { rewrites?: ServeRewrite[] }

function publicPath(filename: string): string {
    return join(process.cwd(), 'public', filename)
}

/** Netlify publish-dir redirects (ignored by `nuxi start` / `serve`). */
export function readRedirects(): string {
    return readFileSync(publicPath('_redirects'), 'utf8')
}

/** vercel/serve config used by `nuxi start` after generate (Playwright CI). */
export function readServeJson(): ServeJson {
    return JSON.parse(readFileSync(publicPath('serve.json'), 'utf8')) as ServeJson
}

export function redirectRuleIndex(redirects: string, pattern: RegExp): number {
    return pattern.exec(redirects)?.index ?? -1
}
