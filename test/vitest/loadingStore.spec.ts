import { setActivePinia, createPinia } from 'pinia'
import { expect } from 'chai'
import { vi } from 'vitest'
import { useLoadingStore } from '@/stores/loadingStore'

describe('LoadingStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should initialize with default values', () => {
        const loadingStore = useLoadingStore()
        expect(loadingStore.isLoading).to.be.false
    })

    it('should update isLoading with the boolean passed to setIsLoading', () => {
        const loadingStore = useLoadingStore()

        loadingStore.setIsLoading(true)
        expect(loadingStore.isLoading).to.be.true

        loadingStore.setIsLoading(false)
        expect(loadingStore.isLoading).to.be.false
    })

    it('should update isLoading to false after 2000ms', async () => {
        vi.useFakeTimers()
        const loadingStore = useLoadingStore()

        loadingStore.setIsLoading(true, 2000)
        expect(loadingStore.isLoading).to.be.true

        // This will fast-forwards fake timers by a specified amount of time
        await vi.advanceTimersByTimeAsync(2000)

        loadingStore.setIsLoading(false)
        expect(loadingStore.isLoading).to.be.false

        vi.useRealTimers()
    })
})

