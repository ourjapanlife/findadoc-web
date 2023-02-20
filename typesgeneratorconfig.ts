import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: './src/typeDefs/schema.graphql',
    generates: {
        'src/typeDefs/gqlTypes.ts': {
            plugins: ['typescript', 'typescript-resolvers']
        }
    },
    debug: true
}

export default config
