import controller from './controller'
import { resolverHandler } from './utils'
import type {
    CreateSubmissionInput,
    CreateSubmissionMutation,
    Exact,
    GetAllSubmissionsQuery,
    MutationResolvers, QueryResolvers,
    SubmissionSearchFilters
} from '~/typedefs/client/graphql'

const queryResolvers: QueryResolvers = {
    submissions: (_, args) => controller.submission.search(args)
}

const mutationResolvers: MutationResolvers = {
    createSubmission: (_, args) => controller.submission.create(args),
    createFacility: () => null,
    createHealthcareProfessional: () => null,
    updateSubmission: () => null
}

const submission = {
    create: async (variables: Exact<{ input: CreateSubmissionInput }>): Promise<CreateSubmissionMutation> => {
        const resolver = mutationResolvers.createSubmission
        const submission = await resolverHandler(resolver, variables)
        const out: CreateSubmissionMutation = {
            __typename: 'Mutation',
            createSubmission: {
                __typename: 'Submission',
                id: submission?.id ?? ''
            }
        }
        return out
    },

    search: async (variables: Exact<{ filters: SubmissionSearchFilters }>): Promise<GetAllSubmissionsQuery> => {
        const resolver = queryResolvers.submissions
        const submissions = await resolverHandler(resolver, variables)
        return { submissions }
    }
}

export default {
    submission
}
