module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.json']
    },
    env: {
        node: true,
        es6: true,
        jest: true,
        'cypress/globals': true
    },
    plugins: ['@typescript-eslint', 'eslint-plugin-json', 'cypress'],
    extends: ['eslint:recommended', 'plugin:vue/vue3-strongly-recommended'],
    root: true,
    ignorePatterns: ['typedefs/gqlTypes.ts'],
    // 'off' or 0 - turn the rule off
    // 'warn' or 1 - turn the rule on as a warning (doesn’t affect exit code)
    // 'error' or 2 - turn the rule on as an error (exit code will be 1)
    rules: {
        // Best Practices
        'block-scoped-var': 'error',
        complexity: ['error', { max: 40 }],
        'consistent-return': 'error',
        curly: ['error', 'multi'],
        'dot-location': ['error', 'property'],
        'dot-notation': ['error', { allowPattern: '^[a-z]+(_[a-z]+)+$' }],
        eqeqeq: ['error', 'smart'],
        'no-alert': 'error',
        'no-multi-spaces': 'error',
        'no-param-reassign': 'off',
        'no-redeclare': 'error',
        'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
        'vars-on-top': 'off',
        yoda: ['error', 'never', { exceptRange: true }],
        'no-console': 'warn', // For debugging, but throw warnings so logs are not committed.
        'no-useless-escape': 'warn',
        // Stylistic Issues
        'arrow-body-style': 'error',
        'array-bracket-spacing': ['error', 'never'],
        'arrow-parens': ['error', 'as-needed'],
        'arrow-spacing': 'error',
        'block-spacing': ['error', 'always'],
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],
        camelcase: 'error',
        'comma-dangle': ['error', 'never'],
        'comma-spacing': ['error', { before: false, after: true }],
        'comma-style': ['error', 'last'],
        'computed-property-spacing': ['error', 'never'],
        'function-paren-newline': ['error', 'consistent'],
        indent: [
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
                ignoredNodes: ['JSXElement *']
            }
        ],
        'key-spacing': ['error', { beforeColon: false, afterColon: true }],
        'keyword-spacing': ['error', { before: true, after: true }],
        'linebreak-style': ['error', 'unix'], // no carriage returns
        'max-len': ['error', { code: 140 }], // be friendly to laptops
        'newline-after-var': 'error',
        'require-atomic-updates': 'off',
        'no-constant-condition': 'error',
        'no-dupe-class-members': 'error',
        'no-lonely-if': 'error',
        'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }], // let my people push enter!
        'no-prototype-builtins': 'error',
        'no-underscore-dangle': 'error',
        'no-var': 'error',
        'object-curly-spacing': ['error', 'always'],
        'object-curly-newline': ['error', { consistent: true }],
        'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        'object-shorthand': ['error', 'methods'],
        'operator-linebreak': ['off', 'before'],
        'padded-blocks': ['error', 'never'],
        // adds a lot of blank lines 🤔
        'padding-line-between-statements': [
            'error',
            { blankLine: 'any', prev: ['const', 'let', 'var'], next: '*' },
            { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
            { blankLine: 'always', prev: '*', next: 'return' }
        ],
        'prefer-arrow-callback': 'error',
        // 'prefer-const': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'quote-props': ['error', 'as-needed'],
        quotes: ['error', 'single', 'avoid-escape'],
        'semi-spacing': ['error', { before: false, after: true }],
        'space-before-blocks': 'error',
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always'
            }
        ],
        'space-in-parens': 'error',
        'space-infix-ops': 'error',
        semi: ['error', 'never'],

        // Strict Move
        strict: 'off',

        // Variables
        'no-shadow': 'error',

        // Vue
        'vue/multi-word-component-names': ['off', {
            ignores: ['index']
        }],
        'vue/html-indent': ['error', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: false,
            ignores: []
        }],
        'vue/max-attributes-per-line': ['error', {
            singleline: {
                max: 4
            },
            multiline: {
                max: 4
            }
        }],
        'vue/html-self-closing': ['error', { html: { normal: 'never', void: 'always' } }],
        'vue/html-closing-bracket-newline': ['error', {
            singleline: 'never',
            multiline: 'never'
        }],
        'vue/first-attribute-linebreak': ['error', {
            singleline: 'beside',
            multiline: 'beside'
        }],
        'vue/block-lang': ['error',
                           {
                               script: {
                                   lang: 'ts'
                               }
                           }
        ]

    }
}
