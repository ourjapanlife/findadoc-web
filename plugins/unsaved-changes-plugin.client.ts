import type { Pinia } from 'pinia'
import type { Router } from 'vue-router'
import { useModerationSubmissionUnsavedStore } from '~/stores/moderationSubmissionUnsavedStore'

// nuxtApp.$i18n isn't picked up as the full vue-i18n Composer type here, so
// this covers only the one method this plugin actually calls.
interface I18nLike {
    t: (key: string) => string
}

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

            const submissionUnsavedStore = useModerationSubmissionUnsavedStore(nuxtApp.$pinia as Pinia)

            const router = nuxtApp.$router as Router
            router.beforeEach(() => {
                if (!isGloballyDirty.value) return true

                return new Promise<boolean>(resolve => {
                    const i18n = nuxtApp.$i18n as I18nLike | undefined
                    const message = i18n?.t('modEditFacilityOrHPTopbar.hasUnsavedChanges')
                      ?? 'You have unsaved changes'
                    const confirm = nuxtApp.$withConfirmation
                    if (typeof confirm !== 'function') {
                        resolve(true)
                        return
                    }
                    confirm(() => {
                        activeDirtyIds.clear()
                        submissionUnsavedStore.setEditSubmissionFormDirty(false)
                        resolve(true)
                    }, {
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
                    unregister: (id: symbol) => activeDirtyIds.delete(id),
                    clearAll: () => activeDirtyIds.clear()
                }
            }
        }
    }
})
