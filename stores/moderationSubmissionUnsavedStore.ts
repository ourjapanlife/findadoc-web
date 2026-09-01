import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

type TryLeaveFn = (onLeave: () => void | Promise<void>) => void

/**
 * Router unsaved-changes guard reads this in addition to useUnsavedChanges' registry
 * so submission-edit dirty state is always visible during navigation.
 *
 * Form back/home actions call runLeaveOr (not router.push alone): the active edit form
 * registers tryLeave so confirmations run before leaving.
 */
export const useModerationSubmissionUnsavedStore = defineStore('moderationSubmissionUnsaved', () => {
    const isEditSubmissionFormDirty: Ref<boolean> = ref(false)
    const editFormTryLeave: Ref<TryLeaveFn | null> = ref(null)

    function setEditSubmissionFormDirty(value: boolean) {
        isEditSubmissionFormDirty.value = value
    }

    function registerEditFormTryLeave(fn: TryLeaveFn | null) {
        editFormTryLeave.value = fn
    }

    /** @deprecated Use registerEditFormTryLeave */
    function registerEditSubmissionTryClose(fn: (() => void) | null) {
        if (!fn) {
            registerEditFormTryLeave(null)
            return
        }
        registerEditFormTryLeave(fn)
    }

    function runLeaveOr(onLeave: () => void | Promise<void>) {
        const fn = editFormTryLeave.value
        if (fn) {
            fn(onLeave)
            return
        }
        void onLeave()
    }

    function runEditSubmissionBackOr(fallback: () => void | Promise<void>) {
        runLeaveOr(fallback)
    }

    return {
        isEditSubmissionFormDirty,
        setEditSubmissionFormDirty,
        registerEditFormTryLeave,
        registerEditSubmissionTryClose,
        runLeaveOr,
        runEditSubmissionBackOr
    }
})
