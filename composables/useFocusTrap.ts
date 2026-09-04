import { nextTick, onScopeDispose, watch, type Ref } from 'vue'

/*
 * Keeps keyboard focus inside an open dialog.
 *
 * Both overlays here declare role="dialog" and aria-modal="true", which promises the rest of
 * the page is inert. Without a trap that promise is false: they render with v-show or v-if but
 * nothing removes the background from the tab order, so Tab walks straight out of the dialog
 * into content behind it. Binding Escape to the panel element made it worse — once focus left,
 * the key stopped closing the dialog at all, so a keyboard user could be stranded behind an
 * overlay with no way back.
 *
 * Escape is therefore handled on the document, not the panel.
 */

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(',')

function focusableWithin(container: HTMLElement): HTMLElement[] {
    return [...container.querySelectorAll<HTMLElement>(FOCUSABLE)]
        // offsetParent is null for anything display:none, which v-show sets on a closed panel.
        .filter(el => el.offsetParent !== null || el === document.activeElement)
}

export interface FocusTrapOptions {
    /** Called when Escape is pressed while the trap is active. */
    onEscape?: () => void
    /** Focused when the trap activates. Defaults to the first focusable element. */
    initialFocus?: Ref<HTMLElement | null | undefined>
}

export function useFocusTrap(
    container: Ref<HTMLElement | null | undefined>,
    isActive: Ref<boolean>,
    options: FocusTrapOptions = {}
) {
    let previouslyFocused: HTMLElement | null = null
    let listening = false

    function onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            options.onEscape?.()
            return
        }

        if (event.key !== 'Tab' || !container.value) return

        const focusable = focusableWithin(container.value)
        if (!focusable.length) return

        const first = focusable[0]!
        const last = focusable[focusable.length - 1]!
        const active = document.activeElement as HTMLElement | null

        // Wrap at both ends, and pull focus back in if it has already escaped.
        if (event.shiftKey && (active === first || !container.value.contains(active))) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && (active === last || !container.value.contains(active))) {
            event.preventDefault()
            first.focus()
        }
    }

    function stop() {
        if (!listening) return

        document.removeEventListener('keydown', onKeydown, true)
        listening = false
        previouslyFocused?.focus?.()
        previouslyFocused = null
    }

    watch(isActive, async active => {
        if (!import.meta.client) return

        if (!active) {
            stop()
            return
        }

        previouslyFocused = document.activeElement as HTMLElement | null
        document.addEventListener('keydown', onKeydown, true)
        listening = true

        await nextTick()
        const target = options.initialFocus?.value
          ?? (container.value ? focusableWithin(container.value)[0] : null)
        target?.focus()
    }, { immediate: true })

    // A route change can unmount an open dialog; the listener must not outlive it.
    onScopeDispose(stop)
}
