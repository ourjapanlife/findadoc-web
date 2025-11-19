import globals from 'globals'
import eslintJsPlugin from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import pluginCypress from 'eslint-plugin-cypress/flat'
import pluginVitest from '@vitest/eslint-plugin'
import pluginVue from 'eslint-plugin-vue'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    {
        // GLOBAL configuration
        ignores: [
            'dist/*',
            '.output/*',
            '.nuxt/*',
            'coverage/*',
            '.yarn/*',
            'typedefs/gqlTypes.ts'
        ]
    },
    // TypeScript files linting
    {
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                project: true,
                globals: {
                    ...globals.node,
                    ...globals.es6
                }
            }
        },
        files: ['**/*.{ts,js}'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            '@stylistic': stylistic
        },
        ignores: ['typeDefs/gqlTypes.ts', 'typesgeneratorconfig.ts', 'i18n/checkLocaleKeys.js'],
        rules: {
            // Current eslintRecommended rules (https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended-raw.ts)
            // More information about the plugin (https://typescript-eslint.io/users/configs#eslint-recommended)
            ...tseslint.configs.eslintRecommended.rules,

            // TS specific rules
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unused-vars': 'error',

            // JS specific rules
            ...eslintJsPlugin.configs.recommended.rules,
            // HACK: this eslint core rule is turned off so that the typescript-eslint version can be used instead
            'no-unused-vars': 'off',
            'block-scoped-var': 'error',
            complexity: ['error', { max: 40 }],
            'dot-location': ['error', 'property'],
            'dot-notation': ['error', { allowPattern: '^[a-z]+(_[a-z]+)+$' }],
            'no-alert': 'error',
            'no-multi-spaces': 'error',
            'no-redeclare': 'error',
            'no-unused-expressions': [
                'error',
                { allowShortCircuit: true, allowTernary: true }
            ],
            'vars-on-top': 'off',
            yoda: ['error', 'never', { exceptRange: true }],
            // Change to a logger in the future
            'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
            // Vue specific rules

            // Stylistic Issues and Opinions
            /**
             * These stylistic rules are separated from the ESLint Stylistic plugin
             * because we needed to override the ESLint Stylistic plugin for our Nuxt config.
            */
            'arrow-body-style': 'error',
            camelcase: ['error', { allow: ['639_3'] }],
            // be friendly to laptops
            'require-atomic-updates': 'warn',
            'no-constant-condition': 'error',
            'no-dupe-class-members': 'error',
            'no-lonely-if': 'error',
            'no-underscore-dangle': 'error',
            'no-var': 'error',
            'object-shorthand': ['error', 'methods'],
            'prefer-arrow-callback': 'error',
            'prefer-const': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'error'
        }
    },
    // Vue rules
    {
        ...pluginVue.configs['flat/vue3-recommended'],
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/html-indent': ['error', 4]
        }
    },
    // Linting for Cypress (https://www.npmjs.com/package/eslint-plugin-cypress)
    {
        files: ['tests/cypress/**/*'],
        ...pluginCypress.configs.recommended,
        rules: {
            'cypress/no-unnecessary-waiting': 'off'
        }
    },
    // Linting for Vitest (https://github.com/vitest-dev/eslint-plugin-vitest)
    {
        files: ['tests/vitest/**/*'],
        ...pluginVitest.configs.recommended,
        ...pluginVitest.configs.env,
        rules: {
            '@typescript-eslint/no-unused-expressions': 'off',
            'no-unused-expressions': 'off'
        }
    }
)
    .override('nuxt/stylistic', {
        ignores: ['./i18n/index.ts'],
        rules: {
            // Stylistic Issues and Opinions
            'arrow-body-style': 'error',
            '@stylistic/array-bracket-spacing': ['error', 'never'],
            '@stylistic/arrow-parens': ['error', 'as-needed'],
            '@stylistic/arrow-spacing': 'error',
            '@stylistic/block-spacing': ['error', 'always'],
            '@stylistic/brace-style': [
                'error',
                '1tbs',
                { allowSingleLine: true }
            ],
            camelcase: ['error', { allow: ['639_3'] }],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/comma-spacing': [
                'error',
                { before: false, after: true }
            ],
            '@stylistic/comma-style': 'error',
            '@stylistic/computed-property-spacing': ['error', 'never'],
            '@stylistic/function-paren-newline': ['error', 'consistent'],
            '@stylistic/indent': [
                'error',
                4,
                {
                    MemberExpression: 1,
                    SwitchCase: 1,
                    ArrayExpression: 'first',
                    ObjectExpression: 1,
                    FunctionDeclaration: { parameters: 'off' },
                    VariableDeclarator: { var: 2, let: 2, const: 3 },
                    CallExpression: { arguments: 'first' }
                }
            ],
            '@stylistic/key-spacing': [
                'error',
                { beforeColon: false, afterColon: true }
            ],
            '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
            '@stylistic/linebreak-style': ['error', 'unix'], // no carriage returns
            '@stylistic/max-len': [
                'error',
                {
                    code: 130,
                    comments: 130,
                    ignoreTrailingComments: true,
                    ignoreUrls: true,
                    ignoreStrings: false,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true
                }
            ],
            '@stylistic/max-statements-per-line': 'off',
            // be friendly to laptops
            '@stylistic/padding-line-between-statements': 'off', //we can choose newlines after variable declarations
            '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
            '@stylistic/object-curly-newline': ['error', { consistent: true }],
            '@stylistic/object-property-newline': [
                'error',
                { allowAllPropertiesOnSameLine: true }
            ],
            'object-shorthand': ['error', 'methods'],
            '@stylistic/operator-linebreak': ['error', 'before'],
            '@stylistic/padded-blocks': ['error', 'never'],
            '@stylistic/quote-props': ['error', 'as-needed'],
            '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
            '@stylistic/semi': ['error', 'never'],
            '@stylistic/semi-spacing': 'error',
            '@stylistic/space-before-blocks': 'error',
            '@stylistic/space-before-function-paren': [
                'error',
                { anonymous: 'never', named: 'never', asyncArrow: 'always' }
            ],
            '@stylistic/space-in-parens': 'error',
            '@stylistic/space-infix-ops': 'error',
            '@stylistic/spaced-comment': 'off'
        }
    })
