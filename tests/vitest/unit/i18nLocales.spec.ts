import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect } from 'chai'
import i18nLocales from '@/i18n'

const localesDir = join(dirname(fileURLToPath(import.meta.url)), '../../../i18n/locales')

function extractKeys(value: unknown, prefix = ''): string[] {
    if (typeof value !== 'object' || value === null) {
        return prefix ? [prefix] : []
    }

    return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) => {
        const path = prefix ? `${prefix}.${key}` : key
        return extractKeys(nested, path)
    })
}

describe('site UI locales', () => {
    it('lists English, then Japanese, then locales by foreign-resident population', () => {
        const codes = i18nLocales.map(locale => locale.code)

        expect(codes[0]).to.equal('en-US')
        expect(codes).to.deep.equal([
            'en-US',
            'ja-JP',
            'zh-CN',
            'vi-VN',
            'ko-KR',
            'tl-PH',
            'pt-BR',
            'fr-FR',
            'ru-RU',
            'de-DE',
            'it-IT'
        ])
        expect(i18nLocales.find(locale => locale.code === 'ko-KR')?.file).to.equal('ko.json')
    })

    it('keeps Korean translation keys in lockstep with English', () => {
        const en = JSON.parse(readFileSync(join(localesDir, 'en.json'), 'utf-8'))
        const ko = JSON.parse(readFileSync(join(localesDir, 'ko.json'), 'utf-8'))

        expect(extractKeys(ko).sort()).to.deep.equal(extractKeys(en).sort())
    })

    it('ships a JSON file for every registered site locale', () => {
        const files = new Set(readdirSync(localesDir).filter(name => name.endsWith('.json')))

        for (const locale of i18nLocales) {
            const configuredFile = locale.file
            if (configuredFile === undefined) {
                throw new Error(`Locale ${locale.code} has no file`)
            }

            const filename = typeof configuredFile === 'string' ? configuredFile : configuredFile.path
            expect(files.has(filename), filename).to.equal(true)
        }
    })
})
