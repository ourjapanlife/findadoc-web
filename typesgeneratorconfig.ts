/*import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: 'https://api.findadoc.jp',
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

export default config*/

import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: '../findadoc-server/src/typeDefs/schema.graphql',

    generates: {
        './typedefs/gqlTypes.ts': {
            plugins: ['typescript', 'typescript-operations'],
            config: {
                useTypeImports: true
            }
        }
    },
    debug: true
}

export default config
