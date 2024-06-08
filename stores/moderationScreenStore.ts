import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export enum ModerationScreen {
    dashboard = 'dashboard',
    editSubmission = 'editSubmission'
}

export const useModerationScreenStore = defineStore('moderationScreenStore', () => {
    const activeScreen: Ref<ModerationScreen> = ref(ModerationScreen.dashboard)
    const fakeData = [
        { "id": "13243214", "name": "Name 1", "status": "forReview", "modified": "Modified 1", "submitted": "Submitted 1" },
        { "id": "252ewwe", "name": "Name 2", "status": "accepted", "modified": "Modified 2", "submitted": "Submitted 2" },
        { "id": "3dfdanns", "name": "Name 3", "status": "rejected", "modified": "Modified 3", "submitted": "Submitted 3" }
    ]
    const selectedSubmissionId = ref('')

    function setActiveScreen(newValue: ModerationScreen) {
        activeScreen.value = newValue
    }

    return { activeScreen, fakeData, ModerationScreen, selectedSubmissionId, setActiveScreen }
})
