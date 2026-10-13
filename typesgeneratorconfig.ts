import type { CodegenConfig } from '@graphql-codegen/cli'

// typedefs/pending-moderation-schema.graphql fills license and search fields that
// https://api.findadoc.jp does not publish yet. Remove that file from this list
// once findadoc-server#1049 is deployed, or codegen will reject the duplicate types.
const config: CodegenConfig = {
    overwrite: true,
    schema: [
        'https://api.findadoc.jp',
        './typedefs/pending-moderation-schema.graphql'
    ],
    generates: {
        './typedefs/gqlTypes.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
            config: {
                useTypeImports: true
            }
        }
    },
    debug: true
}

export default config
