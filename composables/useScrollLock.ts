import { onScopeDispose, watch, type Ref } from 'vue'

/*
 * Reference-counted so overlapping overlays cannot unlock each other. Two things lock the
 * page today (the search details panel and the hamburger sheet); with a plain boolean, closing
 * either one released the lock while the other was still up. The count also survives a
 * component unmounting while still open — a route change with the panel open used to leave
 * `overflow: hidden` on the document and the whole site unscrollable until a reload.
 */
let lockCount = 0
let restoreOverflow = ''

function lock() {
    if (!import.meta.client) return

    if (lockCount === 0) {
        restoreOverflow = document.documentElement.style.overflow
        document.documentElement.style.overflow = 'hidden'
    }
    lockCount++
}

function unlock() {
    if (!import.meta.client || lockCount === 0) return

    lockCount--
    if (lockCount === 0) {
        document.documentElement.style.overflow = restoreOverflow
    }
}

/**
 * Holds a page scroll lock for as long as `isLocked` is true, releasing it when the value
 * goes false or the owning component's scope is disposed.
 */
export function useScrollLock(isLocked: Ref<boolean>) {
    let holding = false

    const apply = (shouldLock: boolean) => {
        if (shouldLock === holding) return

        if (shouldLock) {
            lock()
        } else {
            unlock()
        }
        holding = shouldLock
    }

    watch(isLocked, apply, { immediate: true })

    onScopeDispose(() => apply(false))
}
