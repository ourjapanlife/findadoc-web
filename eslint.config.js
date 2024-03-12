import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default [
    {
        // GLOBAL configuration
        ignores: [
            'dist/*',
            '.output/*',
            '.nuxt/*',
            'coverage/*',
            'cypress/videos/*',
            '.yarn/*',
            'typedefs/gqlTypes.ts'
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['./typeDefs/gqlTypes.ts', './typesgeneratorconfig.ts'],
        files: ['test**/*.ts', './**/*.{js,ts,vue}'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            '@stylistic': stylistic,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
              project: true,
            },
          },
        rules: {
            // TS specific rules
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unused-vars': 'error',

            // JS specific rules

            // HACK: this eslint core rule is turned off so that the typescript-eslint version can be used instead
            'no-unused-vars': 'off',
            'block-scoped-var': 'error',
            complexity: ['error', { max: 40 }],
            'consistent-return': 'error',
            curly: 'error',
            'dot-location': ['error', 'property'],
            'dot-notation': ['error', { allowPattern: '^[a-z]+(_[a-z]+)+$' }],
            'no-alert': 'error',
            'no-multi-spaces': 'error',
            'no-redeclare': 'error',
            'no-unused-expressions': [
                'error',
                { allowShortCircuit: true, allowTernary: true },
            ],
            'vars-on-top': 'off',
            yoda: ['error', 'never', { exceptRange: true }],
            'no-console': 'error', // we should use the logger instead

            // Stylistic Issues and Opinions
            'arrow-body-style': 'error',
            '@stylistic/array-bracket-spacing': ['error', 'never'],
            '@stylistic/arrow-parens': ['error', 'as-needed'],
            '@stylistic/arrow-spacing': 'error',
            '@stylistic/block-spacing': ['error', 'always'],
            '@stylistic/brace-style': [
                'error',
                '1tbs',
                { allowSingleLine: true },
            ],
            camelcase: ['error', { allow: ['639_3'] }],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/comma-spacing': [
                'error',
                { before: false, after: true },
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
                    CallExpression: { arguments: 'first' },
                },
            ],
            '@stylistic/key-spacing': [
                'error',
                { beforeColon: false, afterColon: true },
            ],
            '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
            '@stylistic/linebreak-style': ['error', 'unix'], // no carriage returns
            '@stylistic/max-len': [
                'error',
                {
                    code: 130,
                    ignoreComments: true,
                    ignoreTrailingComments: true,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                },
            ], // be friendly to laptops
            '@stylistic/padding-line-between-statements': 'off', //we can choose newlines after variable declarations
            'require-atomic-updates': 'warn',
            'no-constant-condition': 'error',
            'no-dupe-class-members': 'error',
            'no-lonely-if': 'error',
            '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
            'no-underscore-dangle': 'error',
            'no-var': 'error',
            '@stylistic/object-curly-newline': ['error', { consistent: true }],
            '@stylistic/object-property-newline': [
                'error',
                { allowAllPropertiesOnSameLine: true },
            ],
            'object-shorthand': ['error', 'methods'],
            '@stylistic/operator-linebreak': [0, 'before'],
            '@stylistic/padded-blocks': ['error', 'never'],
            'prefer-arrow-callback': 'error',
            'prefer-const': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'error',
            '@stylistic/quote-props': ['error', 'as-needed'],
            '@stylistic/quotes': ['error', 'single', { "avoidEscape": true } ],
            '@stylistic/semi': ['error', 'never'],
            '@stylistic/semi-spacing': 'error',
            '@stylistic/space-before-blocks': 'error',
            '@stylistic/space-before-function-paren': [
                'error',
                { anonymous: 'never', named: 'never', asyncArrow: 'always' },
            ],
            '@stylistic/space-in-parens': 'error',
            '@stylistic/space-infix-ops': 'error',
        },
    }
]
