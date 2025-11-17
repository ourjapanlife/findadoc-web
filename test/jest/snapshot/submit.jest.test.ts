import { jest } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createTestingPinia } from '@pinia/testing'
import Submit from '~/pages/submit.vue'

const mockSubmissionStore = {
    submissionCompleted: false,
    createNewSubmission: jest.fn()
}

jest.mock('~/stores/submissionStore', () => ({
    useSubmissionStore: () => mockSubmissionStore
}))

const NuxtLinkStub = {
    template: '<a><slot /></a>',
    props: ['to']
}

const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: { 'en-US': {} }
})

describe('submit.vue', () => {
    const pinia = createTestingPinia({
        createSpy: jest.fn
    })

    it('renders correctly', () => {
        const wrapper = mount(Submit, {
            global: {
                plugins: [i18n, pinia],
                stubs: {
                    SubmissionCompleted: true,
                    Loader: true,
                    NuxtLink: NuxtLinkStub
                }
            }
        })
        expect(wrapper.element).toMatchSnapshot()
    })
})
