import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import Moderation from '~/pages/moderation.vue'

const mockAuthStore = {
    isTestingMode: true,
    isLoggedIn: true,
    isLoadingAuth: false,
    redirectIfUnauthenticatedUser: vi.fn()
}

vi.mock('~/stores/authStore', () => ({
    useAuthStore: () => mockAuthStore
}))

vi.mock('vue-router', () => ({
    useRoute: () => ({
        path: '/moderation',
        params: {},
        query: {
            view: 'submissions'
        }
    })
}))

const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: { 'en-US': {} }
})

describe('moderation.vue (vitest snapshot)', () => {
    it('renders correctly', async () => {
        const wrapper = mount(Moderation, {
            global: {
                plugins: [i18n],
                stubs: {
                    ModLeftNavbar: true
                }
            }
        })
        await flushPromises()
        expect(wrapper.html()).toMatchSnapshot()
    })
})
