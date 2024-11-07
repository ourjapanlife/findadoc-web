import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { gqlClient, graphQLClientRequestWithRetry } from '../utils/graphql.js'
import type { ServerResponse } from '~/typedefs/serverResponse.js'
import type { MutationCreateSubmissionArgs, Submission } from '~/typedefs/gqlTypes'

export const useSubmissionStore = defineStore('submissionStore', () => {
    const submissionCompleted: Ref = ref(false)

    async function createNewSubmission(newSubmission: MutationCreateSubmissionArgs):
    Promise<ServerResponse<Submission>> {
        let response: ServerResponse<Submission> = { data: {} as Submission, errors: [], hasErrors: false }

        response = await graphQLClientRequestWithRetry(
            gqlClient.request.bind(gqlClient),
            createSubmissionMutation,
            newSubmission
        ) as ServerResponse<Submission>

        return response
    }

    return { createNewSubmission,
        submissionCompleted }
})

const createSubmissionMutation = gql`mutation CreateSubmission($input: CreateSubmissionInput!) {
    createSubmission(input: $input) {
        id
    }
}`
