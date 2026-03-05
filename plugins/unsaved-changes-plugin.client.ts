export default defineNuxtPlugin(() => {
    const activeDirtyIds = reactive(new Map<symbol, 'create' | 'update'>())

    const isGloballyDirty = computed(() => activeDirtyIds.size > 0)

    // "create" takes priority: losing everything vs losing changes to existing data
    const confirmationMode = computed<'create' | 'update'>(() =>
        [...activeDirtyIds.values()].includes('create') ? 'create' : 'update')

    window.addEventListener('beforeunload', e => {
        if (isGloballyDirty.value) {
            e.preventDefault()
            e.returnValue = '' // required by some browsers to show the native dialog
        }
    })

    const router = useRouter()
    router.beforeEach(() => {
        if (!isGloballyDirty.value) return true

        return new Promise<boolean>(resolve => {
            useNuxtApp().$withConfirmation(() => resolve(true), {
                mode: confirmationMode.value,
                onCancel: () => resolve(false)
            })
        })
    })

    return {
        provide: {
            unsavedChangesRegistry: {
                register: (id: symbol, mode: 'create' | 'update') => activeDirtyIds.set(id, mode),
                unregister: (id: symbol) => activeDirtyIds.delete(id)
            }
        }
    }
})
