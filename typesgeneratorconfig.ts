import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: 'https://api.findadoc.jp',
    generates: {
        './typedefs/gqlTypes.ts': {
            plugins: ['typescript', 'typescript-resolvers']
        }
    },
    debug: true
}

export default config
