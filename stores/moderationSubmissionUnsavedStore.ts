import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

/**
 * Router unsaved-changes guard reads this in addition to useUnsavedChanges' registry
 * so submission-edit dirty state is always visible during navigation.
 *
 * Submission back uses tryClose (not router.push alone): the moderation UI stays on `/moderation`
 * and duplicate navigations never run beforeEach, so the topbar calls the registered tryClose.
 */
export const useModerationSubmissionUnsavedStore = defineStore('moderationSubmissionUnsaved', () => {
    const isEditSubmissionFormDirty: Ref<boolean> = ref(false)
    const editSubmissionTryClose: Ref<(() => void) | null> = ref(null)

    function setEditSubmissionFormDirty(value: boolean) {
        isEditSubmissionFormDirty.value = value
    }

    function registerEditSubmissionTryClose(fn: (() => void) | null) {
        editSubmissionTryClose.value = fn
    }

    function runEditSubmissionBackOr(fallback: () => void | Promise<void>) {
        const fn = editSubmissionTryClose.value
        if (fn) {
            fn()
            return
        }
        void fallback()
    }

    return {
        isEditSubmissionFormDirty,
        setEditSubmissionFormDirty,
        registerEditSubmissionTryClose,
        runEditSubmissionBackOr
    }
})
