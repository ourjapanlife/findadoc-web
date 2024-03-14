import { GraphQLClient } from "graphql-request"

export let gqlClient: GraphQLClient;

export const initializeGqlClient = () => {
    if (gqlClient) {
        return gqlClient
    }

    const endpoint = "https://api.findadoc.jp"
    const client = new GraphQLClient(endpoint)
    gqlClient = client
};

export interface gqlMutation<T> extends gqlRequest {
    variables: {
        input: T
    }
}

export interface gqlRequest {
    query: string
    variables: unknown
}
