import { graphql, http, HttpResponse, passthrough } from 'msw'
import {
    GetAllFacilitiesDocument,
    GetAllSubmissionsDocument,
    GetAllHealthcareProfessionalsDocument
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

const findADocApiHandler = http.post('https://api.findadoc.jp/*', async () => HttpResponse.json({ message: 'blocked' }, { status: 422 }))

const getAllSubmissionsHandler = graphql.query(GetAllSubmissionsDocument, () => HttpResponse.json({
    data: {
        submissions: []
    }
}))

const getAllFacilities = graphql.query(GetAllFacilitiesDocument, () => HttpResponse.json({
    data: {
        facilities: []
    }
}))

const getAllHealthcareProfessionals = graphql.query(GetAllHealthcareProfessionalsDocument, () => HttpResponse.json({
    data: {
        healthcareProfessionals: []
    }
}))

export const handlers = [
    authHandler,
    getAllSubmissionsHandler,
    getAllFacilities,
    getAllHealthcareProfessionals,
    // findADocApiHandler should be last to avoid interfering with GraphQL queries
    findADocApiHandler
]
