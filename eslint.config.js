import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'vue-eslint-parser';
import eslintJsPlugin from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

const gqlSchemaPath = '././typeDefs/schema.graphql';

export default [
    // GLOBAL configuration
    {
        ignores: [
            'dist/*',
            'output/*',
            '.nuxt/*',
            'coverage/*',
            'cypress/videos/*',
            '.yarn/*'
        ],
    },
    // Typescript and JS Linter combined (for all the main code files)
    {
        languageOptions: {
            parser: vuePlugin.parser,
            // parserOptions: {
            //     parser: tsParser
            // },
            globals: {
                ...globals.node,
                ...globals.es2021,
            }
        },
        files: ['__tests__/**/*.ts', './**/*.{js,ts,vue}'],
        plugins: {
            '@typescript-eslint': tsPlugin,
            tsPlugin,
            vuePlugin,
            '@stylistic': stylistic,
        },
        ignores: ['./typeDefs/gqlTypes.ts', './typesgeneratorconfig.ts'],
        // 'off' or 0 - turn the rule off
        // 'warn' or 1 - turn the rule on as a warning (doesn’t affect exit code)
        // 'error' or 2 - turn the rule on as an error (exit code will be 1)
        rules: {
            // TS specific rules
            ...tsPlugin.configs['eslint-recommended'].rules,
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-unused-vars': 'error',

            // JS specific rules
            ...eslintJsPlugin.configs.recommended.rules,
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
            '@stylistic/quotes': ['error', 'single', 'avoid-escape'],
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
    },
];
