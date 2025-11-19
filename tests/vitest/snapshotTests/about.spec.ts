import { beforeAll, describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import About from '~/pages/about.vue'

type MemberData = {
    avatarImg: string
    name: string
    title: string
    linkedInUrl: string | null
    githubUrl: string | null
    personalWebsite?: string
}

vi.mock('~/utils/arrayUtils', () => ({
    shuffleArray: (arr: MemberData[]) => [...arr]
}))

beforeAll(() => {
    class MockIntersectionObserver {
        constructor(
            public callback: IntersectionObserverCallback,
            public options?: IntersectionObserverInit
        ) {}

        observe(_target: Element) {}
        unobserve(_target: Element) {}
        disconnect() {}
    }

    global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
})

const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: { 'en-US': {} }
})

describe('about.vue (vitest snapshot)', () => {
    it('renders correctly', () => {
        const wrapper = shallowMount(About, {
            global: {
                plugins: [i18n]
            }
        })

        expect(wrapper.html()).toMatchSnapshot()
    })
})
