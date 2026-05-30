import { readonly } from 'vue'

export enum ModerationSubmissionActionType {
    Update = 'UPDATE',
    UpdateAndExit = 'UPDATE_AND_EXIT',
    Approve = 'APPROVE',
    Reject = 'REJECT'
}

type ModerationSubmissionAction = {
    id: number
    type: ModerationSubmissionActionType
}

export function useModerationSubmissionActions() {
    const lastAction = useState<ModerationSubmissionAction | null>(
        'moderation-submission-last-action',
        () => null
    )
    const actionSequence = useState<number>(
        'moderation-submission-action-sequence',
        () => 0
    )

    const emitModerationSubmissionAction = (type: ModerationSubmissionActionType) => {
        actionSequence.value += 1
        lastAction.value = {
            id: actionSequence.value,
            type
        }
    }

    return {
        moderationSubmissionAction: readonly(lastAction),
        emitModerationSubmissionAction
    }
}
