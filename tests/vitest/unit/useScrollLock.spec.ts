import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { effectScope, ref } from 'vue'
import { useScrollLock } from '~/composables/useScrollLock'

/*
 * Two overlays can be up at once (the search details panel and the hamburger sheet). Before
 * this composable each set `document.documentElement.style.overflow` directly, so whichever
 * closed first unlocked the page under the other, and unmounting while still open left the
 * document permanently unscrollable.
 */
describe('useScrollLock', () => {
    /*
     * The lock count is module-level on purpose - there is one document to lock. Tests must
     * therefore dispose every scope they create, or a leftover holder leaks into the next test.
     */
    let scopes: ReturnType<typeof effectScope>[] = []

    beforeEach(() => {
        scopes = []
        document.documentElement.style.overflow = ''
    })

    afterEach(() => {
        scopes.forEach(scope => scope.stop())
        document.documentElement.style.overflow = ''
    })

    function mount(isLocked: ReturnType<typeof ref<boolean>>) {
        const scope = effectScope()
        scope.run(() => useScrollLock(isLocked as never))
        scopes.push(scope)
        return scope
    }

    it('locks while true and restores when false', async () => {
        const open = ref(false)
        mount(open)
        expect(document.documentElement.style.overflow).toBe('')

        open.value = true
        await Promise.resolve()
        expect(document.documentElement.style.overflow).toBe('hidden')

        open.value = false
        await Promise.resolve()
        expect(document.documentElement.style.overflow).toBe('')
    })

    it('locks immediately when it starts open', () => {
        const open = ref(true)
        mount(open)

        expect(document.documentElement.style.overflow).toBe('hidden')
    })

    it('keeps the page locked until the last holder releases', async () => {
        const panel = ref(true)
        const sheet = ref(true)
        mount(panel)
        mount(sheet)
        expect(document.documentElement.style.overflow).toBe('hidden')

        // Closing one overlay must not unlock the page while the other is still up.
        sheet.value = false
        await Promise.resolve()
        expect(document.documentElement.style.overflow).toBe('hidden')

        panel.value = false
        await Promise.resolve()
        expect(document.documentElement.style.overflow).toBe('')
    })

    it('releases the lock when the owning scope is disposed while still open', () => {
        const open = ref(true)
        const scope = mount(open)
        expect(document.documentElement.style.overflow).toBe('hidden')

        // Leaving the route with the panel open used to strand the document here.
        scope.stop()

        expect(document.documentElement.style.overflow).toBe('')
    })

    it('restores whatever overflow the page already had', () => {
        document.documentElement.style.overflow = 'scroll'
        const open = ref(true)
        const scope = mount(open)
        expect(document.documentElement.style.overflow).toBe('hidden')

        scope.stop()

        expect(document.documentElement.style.overflow).toBe('scroll')
    })
})
