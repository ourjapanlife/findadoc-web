import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: 'https://seal-app-5oq9w.ondigitalocean.app/graphql',
    generates: {
        './typedefs/gqlTypes.ts': {
            plugins: ['typescript', 'typescript-resolvers']
        }
    },
    debug: true
}

export default config
