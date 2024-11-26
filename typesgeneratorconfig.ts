import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: 'https://api.findadoc.jp',
    // Add paths where GraphQL operations are
    documents: ['./components/*.vue', './stores/*.ts'],
    ignoreNoDocuments: true,
    generates: {
        './typedefs/gqlTypes.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
            config: {
                useTypeImports: true
            }
        },
        // Generate Graphql Schema from api.findadoc
        './typedefs/schema.graphql': {
            plugins: ['schema-ast']
        },
        // Generate GraphQL documents based on operations from the provided paths
        './typedefs/client/': {
            preset: 'client',
            plugins: ['typescript-resolvers'],
            config: {
                useTypeImports: true
            }
        }
    },
    debug: true
}

export default config
