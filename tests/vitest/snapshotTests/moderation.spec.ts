import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import Moderation from '~/pages/moderation.vue'

const { mockAuthStore } = vi.hoisted(() => ({
    mockAuthStore: {
        isTestingMode: true,
        isLoggedIn: true,
        isLoadingAuth: false,
        redirectIfUnauthenticatedUser: vi.fn()
    }
}))

vi.mock('~/stores/authStore', () => ({
    useAuthStore: () => mockAuthStore
}))

const { mockRouter } = vi.hoisted(() => ({
    mockRouter: {
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn()
    }
}))

vi.mock('vue-router', () => ({
    useRoute: () => ({
        path: '/moderation',
        params: {},
        query: {
            view: 'submissions'
        }
    }),
    useRouter: () => mockRouter
}))

const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: { 'en-US': {} }
})

describe('moderation.vue (vitest snapshot)', () => {
    it('renders correctly', () => {
        const wrapper = mount(Moderation, {
            global: {
                plugins: [i18n],
                stubs: {
                    ModLeftNavbar: true
                }
            }
        })
        expect(wrapper.html()).toMatchSnapshot()
    })
})
