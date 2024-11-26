import model from './model'
import type {
    CreateSubmissionMutationVariables,
    GetAllSubmissionsQueryVariables,
    Submission
} from '~/typedefs/client/graphql'

const submission = {
    create: ({ input }: CreateSubmissionMutationVariables): Submission =>
        model.submission.insert(input),
    search: ({ filters }: GetAllSubmissionsQueryVariables): Submission[] => model.submission.select(filters)
}

export default {
    submission
}
