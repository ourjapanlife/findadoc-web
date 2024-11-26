import utils from '../faker/utils'
import database from './database'
import type {
    CreateSubmissionInput,
    Submission,
    SubmissionSearchFilters
} from '~/typedefs/client/graphql'

const submission = {
    insert: (input: CreateSubmissionInput): Submission => {
        const currentSubmissions = database.submissions.getValue
        const submission: Submission = {
            id: utils.generateId(),
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            isApproved: false,
            isRejected: false,
            isUnderReview: false,
            googleMapsUrl: input.googleMapsUrl ?? '',
            healthcareProfessionalName: input.healthcareProfessionalName ?? '',
            spokenLanguages: input.spokenLanguages ?? []
        }

        database.submissions.value = [submission, ...currentSubmissions]

        return submission
    },

    select: (filters: SubmissionSearchFilters): Submission[] => {
        const submissions = database.submissions.getValue
        return submissions?.slice(0, filters.limit ?? 100) ?? []
    }
}

export default {
    submission
}
