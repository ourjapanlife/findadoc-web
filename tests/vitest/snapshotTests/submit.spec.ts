import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createTestingPinia } from '@pinia/testing'
import Submit from '~/pages/submit.vue'

const mockSubmissionStore = {
    submissionCompleted: false,
    createNewSubmission: vi.fn()
}

vi.mock('~/stores/submissionStore', () => ({
    useSubmissionStore: () => mockSubmissionStore
}))

const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: { 'en-US': {} }
})

describe('submit.vue (vitest snapshot)', () => {
    const pinia = createTestingPinia({
        createSpy: vi.fn
    })

    it('renders correctly', () => {
        const wrapper = shallowMount(Submit, {
            global: {
                plugins: [i18n, pinia]
            }
        })

        expect(wrapper.html()).toMatchSnapshot()
    })
})
