import { stableStringify } from '~/utils/stableStringify'
import type { Ref } from 'vue'

type Equivalence<T> = (entityOne: T, entityTwo: T) => boolean

interface Config<T> {
    /** Component-owned form state. Composable syncs from this (initial + watch)
   * so the same logic is not repeated in every consumer. */
    data: {
        source: Ref<T>
        startDirty?: boolean
        equivalence?: Equivalence<T>
    }
    onClose?: () => void
    onCancel?: () => void
    mode: 'create' | 'update'
}

const defaultEquivalence = <T>(): Equivalence<T> =>
    (entityOne, entityTwo) => stableStringify(entityOne) === stableStringify(entityTwo)

// Deep-clone to produce an immutable baseline that won't share identity with reactive proxies.
const snapshot = <V>(val: V): V => JSON.parse(JSON.stringify(val ?? null))

export const useUnsavedChanges = <T>(config: Config<T>) => {
    const { $unsavedChangesRegistry } = useNuxtApp()
    const instanceId = Symbol('unsaved-changes-instance')

    const eq = config.data.equivalence ?? defaultEquivalence<T>()
    const initialValue = config.data.source.value

    // null === dirty (no committed baseline)
    const committedValue = ref<T | null>(
        (config.data.startDirty ?? false) ? null : snapshot(initialValue)
    ) as Ref<T | null>

    const makeDirty = () => {
        committedValue.value = null
    }

    const makeNonDirty = () => {
        committedValue.value = snapshot(config.data.source.value)
    }

    const isDirty = computed(() => {
        const committed = committedValue.value
        if (committed === null) return true
        return !eq(config.data.source.value, committed)
    })

    watch(isDirty, dirty => {
        if (dirty) {
            $unsavedChangesRegistry.register(instanceId, config.mode)
        } else {
            $unsavedChangesRegistry.unregister(instanceId)
        }
    }, { flush: 'sync', immediate: true })

    onUnmounted(() => {
        $unsavedChangesRegistry.unregister(instanceId)
    })

    const tryClose = () => {
        if (isDirty.value) {
            useNuxtApp().$withConfirmation(() => {
                $unsavedChangesRegistry.unregister(instanceId)
                config.onClose?.()
            }, {
                mode: config.mode,
                onCancel: config.onCancel
            })
        } else {
            config.onClose?.()
        }
    }

    return {
        tryClose,
        isDirty,
        makeDirty,
        makeNonDirty
    }
}
