import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect } from 'chai'
import {
    canNegotiateMarkdown,
    markdownPathFor,
    prefersMarkdown,
    withAcceptVary
} from '@/utils/markdownNegotiation'
import { MCP_OPENAPI_URL, MCP_SERVER_URL, SITE_ORIGIN } from '@/utils/site'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../../..')

function readPublic(filename: string): string {
    return readFileSync(join(rootDir, 'public', filename), 'utf8')
}

describe('agent discovery files', () => {
    it('publishes an llms.txt guide that names the directory, the API, and the MCP server', () => {
        const guide = readPublic('llms.txt')

        expect(guide).to.include('# Find a Doc, Japan')
        expect(guide).to.include(`${SITE_ORIGIN}/contact.md`)
        expect(guide).to.include(`${SITE_ORIGIN}/sitemap.xml`)
        expect(guide).to.include(MCP_SERVER_URL)
        expect(guide).to.include(`${SITE_ORIGIN}/openapi.json`)
        expect(guide.length).to.be.at.least(500)
    })

    it('publishes MCP discovery and a GraphQL description', () => {
        const manifest = JSON.parse(readPublic('.well-known/mcp.json')) as { endpoint: string }
        const card = JSON.parse(readPublic('.well-known/mcp/server-card.json')) as {
            transport: { url: string }
        }
        const graphql = JSON.parse(readPublic('graphql.json')) as { endpoint: string, protocol: string }
        const openapi = JSON.parse(readPublic('openapi.json')) as { openapi: string, paths: Record<string, unknown> }

        expect(manifest.endpoint).to.equal(MCP_SERVER_URL)
        expect(card.transport.url).to.equal(MCP_SERVER_URL)
        expect(graphql).to.deep.include({ protocol: 'graphql', endpoint: 'https://api.findadoc.jp' })
        expect(openapi.openapi).to.equal('3.0.3')
        expect(openapi.paths).to.have.property('/llms.txt')
        expect(readPublic('llms.txt')).to.include(MCP_OPENAPI_URL)
    })

    it('keeps trust-anchor copy long enough for a reader who does not run JavaScript', () => {
        const en = JSON.parse(readFileSync(join(rootDir, 'i18n/locales/en.json'), 'utf8')) as {
            about: { storyParagraph1: string, storyParagraph2: string }
            privacyPage: Record<string, string>
            contactPage: Record<string, string>
        }
        const about = `${en.about.storyParagraph1} ${en.about.storyParagraph2}`
        const privacy = Object.values(en.privacyPage).join(' ')
        const contact = [
            en.contactPage.intro,
            en.contactPage.whatBody,
            en.contactPage.npoBody,
            en.contactPage.addressNote
        ].join(' ')

        expect(about.length).to.be.at.least(500)
        expect(privacy.length).to.be.at.least(500)
        expect(contact.length).to.be.at.least(500)
        expect(readPublic('404.md')).to.include(`${SITE_ORIGIN}/sitemap.xml`)
        expect(readPublic('404.md')).to.include(`${SITE_ORIGIN}/llms.txt`)
    })
})

describe('prefersMarkdown', () => {
    it('accepts a markdown request and leaves browsers on HTML', () => {
        expect(prefersMarkdown('text/markdown')).to.equal(true)
        expect(prefersMarkdown('text/markdown, text/html;q=0.9')).to.equal(true)
        expect(prefersMarkdown('text/html')).to.equal(false)
        expect(prefersMarkdown('text/html, text/markdown;q=0.8')).to.equal(false)
        expect(prefersMarkdown('*/*')).to.equal(false)
        expect(prefersMarkdown(null)).to.equal(false)
    })

    it('maps the trust pages onto sibling markdown files', () => {
        expect(markdownPathFor('/about')).to.equal('/about.md')
        expect(markdownPathFor('/')).to.equal('/index.md')
        expect(markdownPathFor('/ja-JP/about')).to.equal(undefined)
        expect(canNegotiateMarkdown('/about')).to.equal(true)
        expect(canNegotiateMarkdown('/about.md')).to.equal(false)
        expect(canNegotiateMarkdown('/findadoc-social.jpg')).to.equal(false)
        expect(withAcceptVary('Accept-Encoding')).to.equal('Accept-Encoding, Accept')
        expect(withAcceptVary('accept')).to.equal('accept')
    })
})
