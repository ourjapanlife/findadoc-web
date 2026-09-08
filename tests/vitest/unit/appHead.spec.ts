/// <reference types="vitest/globals" />
import { expect } from 'chai'
import { COLOR_SCHEME_BOOTSTRAP, umamiScript } from '@/utils/nuxt/appHead'
import { entityDirectoryVitePlugins } from '@/utils/nuxt/entityDirectoryGenerate'

describe('umamiScript', () => {
    const previousUrl = process.env.NUXT_PUBLIC_UMAMI_URL
    const previousSiteId = process.env.NUXT_PUBLIC_UMAMI_SITE_ID
    const previousNodeEnv = process.env.NODE_ENV

    afterEach(() => {
        process.env.NODE_ENV = previousNodeEnv
        if (previousUrl === undefined) {
            delete process.env.NUXT_PUBLIC_UMAMI_URL
        } else {
            process.env.NUXT_PUBLIC_UMAMI_URL = previousUrl
        }
        if (previousSiteId === undefined) {
            delete process.env.NUXT_PUBLIC_UMAMI_SITE_ID
        } else {
            process.env.NUXT_PUBLIC_UMAMI_SITE_ID = previousSiteId
        }
    })

    it('emits nothing outside production, even when env vars look set', () => {
        process.env.NODE_ENV = 'test'
        process.env.NUXT_PUBLIC_UMAMI_URL = 'https://analytics.example/script.js'
        process.env.NUXT_PUBLIC_UMAMI_SITE_ID = 'abc'
        expect(umamiScript()).to.deep.equal([])
    })

    it('treats the literal quoted-empty deploy values as unset', () => {
        process.env.NODE_ENV = 'production'
        process.env.NUXT_PUBLIC_UMAMI_URL = '""'
        process.env.NUXT_PUBLIC_UMAMI_SITE_ID = '""'
        expect(umamiScript()).to.deep.equal([])
    })

    it('emits the tag when production has a real URL and site id', () => {
        process.env.NODE_ENV = 'production'
        process.env.NUXT_PUBLIC_UMAMI_URL = 'https://analytics.example/script.js'
        process.env.NUXT_PUBLIC_UMAMI_SITE_ID = 'site-1'
        expect(umamiScript()).to.deep.equal([{
            src: 'https://analytics.example/script.js',
            async: true,
            defer: true,
            'data-website-id': 'site-1'
        }])
    })
})

describe('COLOR_SCHEME_BOOTSTRAP', () => {
    it('is an inline IIFE that can run before hydration', () => {
        expect(COLOR_SCHEME_BOOTSTRAP).to.match(/^\(function \(\)/)
        expect(COLOR_SCHEME_BOOTSTRAP).to.include('localStorage.getItem(\'colorScheme\')')
    })
})

describe('entityDirectoryVitePlugins', () => {
    it('exposes the clinic and doctor virtual modules', () => {
        expect(entityDirectoryVitePlugins().map(plugin => plugin.name))
            .to.deep.equal(['clinic-directory', 'doctor-directory'])
    })
})
