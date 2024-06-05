import { GraphQLClient } from "graphql-request";

export let gqlClient: GraphQLClient

export const initializeGqlClient = () => {
    if (gqlClient) {
        return gqlClient
    }

    let apiURL

    if (process.env.NUXT_USE_LOCAL_API === "development") {
        apiURL = "http://127.0.0.1:4000"

    } else {
        apiURL = "https://api.findadoc.jp"
    }

    const client = new GraphQLClient(apiURL)
    gqlClient = client
};

export interface gqlMutation<T> extends gqlRequest {
    variables: {
        input: T
    };
}

export interface gqlRequest {
    query: string;
    variables: unknown
}