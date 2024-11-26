import { graphql, http, HttpResponse, passthrough } from 'msw'
import view from './view'
import {
    GetAllSubmissionsDocument,
    CreateSubmissionDocument,
    type CreateSubmissionMutation
} from '~/typedefs/client/graphql'

/*
MSW documentation

GraphQL: https://mswjs.io/docs/api/graphql/
Example:
const handler = graphql.query(GraphQLDocument, ({ query, variables }) => HttpResponse.json({
    data: {
        // Data
    }
}))

HTTP: https://mswjs.io/docs/api/http
*/

const authHandler = http.post('https://findadoc.jp.auth0.com/*', async () => passthrough())

const findADocApiHandler = http.post('https://api.findadoc.jp/*', async () => HttpResponse.json({ message: 'blocked by MSW' }, { status: 422 }))

const getAllSubmissionsHandler = graphql.query(GetAllSubmissionsDocument, async ({ variables }) => {
    const out = await view.submission.search(variables)
    return HttpResponse.json({ data: out })
})

const createSubmission = graphql.mutation(CreateSubmissionDocument, async ({ variables }) => {
    const out: CreateSubmissionMutation = await view.submission.create(variables)
    return HttpResponse.json({ data: out })
})

export const handlers = [
    authHandler,
    getAllSubmissionsHandler,
    createSubmission,
    // findADocApiHandler should be last to avoid interfering with GraphQL queries
    findADocApiHandler
]
