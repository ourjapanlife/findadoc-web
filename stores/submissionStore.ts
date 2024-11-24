import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { gqlClient, graphQLClientRequestWithRetry } from '../utils/graphql.js'
import { graphql } from '~/typedefs/client/'
import type { ServerResponse } from '~/typedefs/serverResponse.js'
import type { Mutation, MutationCreateSubmissionArgs } from '~/typedefs/gqlTypes'

export const useSubmissionStore = defineStore('submissionStore', () => {
    const submissionCompleted: Ref = ref(false)

    async function createNewSubmission(newSubmission: MutationCreateSubmissionArgs):
    Promise<ServerResponse<Mutation['createSubmission']>> {
        const response = await graphQLClientRequestWithRetry<Mutation['createSubmission']>(
            gqlClient.request.bind(gqlClient),
            createSubmissionMutation,
            newSubmission
        )

        return response
    }

    return { createNewSubmission,
        submissionCompleted }
})

const createSubmissionMutation = graphql(`
mutation CreateSubmission($input: CreateSubmissionInput!) {
    createSubmission(input: $input) {
        id
    }
}`)
