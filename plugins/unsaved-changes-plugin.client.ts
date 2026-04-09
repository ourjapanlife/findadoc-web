import { useModerationSubmissionUnsavedStore } from '~/stores/moderationSubmissionUnsavedStore'

export default defineNuxtPlugin({
    name: 'unsaved-changes',
    enforce: 'post',
    setup(nuxtApp) {
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

        let registeredRouterGuard = false
        const registerRouterGuardOnce = () => {
            if (registeredRouterGuard) return
            registeredRouterGuard = true

            const submissionUnsavedStore = useModerationSubmissionUnsavedStore(nuxtApp.$pinia)

            nuxtApp.$router.beforeEach(() => {
                if (!isGloballyDirty.value && !submissionUnsavedStore.isEditSubmissionFormDirty) return true

                return new Promise<boolean>(resolve => {
                    const message = nuxtApp.$i18n?.t('modEditFacilityOrHPTopbar.hasUnsavedChanges')
                      ?? 'You have unsaved changes'
                    const confirm = nuxtApp.$withConfirmation
                    if (typeof confirm !== 'function') {
                        resolve(true)
                        return
                    }
                    confirm(() => resolve(true), {
                        mode: confirmationMode.value,
                        onCancel: () => resolve(false),
                        message
                    })
                })
            })
        }

        nuxtApp.hook('app:mounted', registerRouterGuardOnce)
        queueMicrotask(registerRouterGuardOnce)

        return {
            provide: {
                unsavedChangesRegistry: {
                    register: (id: symbol, mode: 'create' | 'update') => activeDirtyIds.set(id, mode),
                    unregister: (id: symbol) => activeDirtyIds.delete(id)
                }
            }
        }
    }
})
