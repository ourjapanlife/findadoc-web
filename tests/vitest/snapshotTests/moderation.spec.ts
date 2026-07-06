import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import Moderation from '~/pages/moderation.vue'

const mockAuthStore = {
    isTestingMode: true,
    redirectIfUnauthenticatedUser: vi.fn()
}

vi.mock('~/stores/authStore', () => ({
    useAuthStore: () => mockAuthStore
}))

vi.mock('vue-router', () => ({
    useRoute: () => useRoute()
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
                plugins: [i18n]
            }
        })

        expect(wrapper.html()).toMatchSnapshot()
    })
})
