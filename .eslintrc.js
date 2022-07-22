module.exports = {
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    env: {
        node: true,
        es6: true,
        jest: true
    },
    plugins: [],
    extends: ['eslint:recommended', 'plugin:vue/vue3-essential'],
    // 'off' or 0 - turn the rule off
    // 'warn' or 1 - turn the rule on as a warning (doesn’t affect exit code)
    // 'error' or 2 - turn the rule on as an error (exit code will be 1)
    rules: {
        // Best Practices
        'block-scoped-var': 2,
        complexity: [2, { max: 40 }],
        'consistent-return': 2,
        curly: 2,
        'dot-location': [2, 'property'],
        'dot-notation': [2, { allowPattern: '^[a-z]+(_[a-z]+)+$' }],
        eqeqeq: 0,
        'no-alert': 2,
        'no-multi-spaces': 2,
        'no-param-reassign': 0,
        'no-redeclare': 2,
        'no-unused-expressions': [2, { allowShortCircuit: true, allowTernary: true }],
        'vars-on-top': 0,
        yoda: [2, 'never', { exceptRange: true }],
        'no-console': 1, //For debugging, but throw warnings so logs are not commited.
        'no-useless-escape': 0,
        // Stylistic Issues
        'arrow-body-style': 2,
        'array-bracket-spacing': [2, 'never'],
        'arrow-parens': [2, 'as-needed'],
        'arrow-spacing': 2,
        'block-spacing': [2, 'always'],
        'brace-style': [2, '1tbs', { allowSingleLine: true }],
        camelcase: 2,
        'comma-spacing': [2, { before: false, after: true }],
        'comma-style': [2, 'last'],
        'computed-property-spacing': [2, 'never'],
        'function-paren-newline': ['error', 'consistent'],
        indent: [
            2,
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
        'key-spacing': [2, { beforeColon: false, afterColon: true }],
        'keyword-spacing': [2, { before: true, after: true }],
        'linebreak-style': 0,
        'max-len': [2, 200, 2, { ignoreUrls: true, ignoreRegExpLiterals: true }],
        'newline-after-var': 2,
        'require-atomic-updates': 0,
        'no-constant-condition': 2,
        'no-dupe-class-members': 2,
        'no-lonely-if': 2,
        'no-multiple-empty-lines': 2,
        'no-prototype-builtins': 0,
        'no-underscore-dangle': 2,
        'no-var': 2,
        'object-curly-spacing': [2, 'always'],
        'object-curly-newline': [2, { consistent: true }],
        'object-property-newline': [2, { allowAllPropertiesOnSameLine: true }],
        'object-shorthand': [2, 'methods'],
        'operator-linebreak': [0, 'before'],
        'padded-blocks': [2, 'never'],
        'padding-line-between-statements': [
            2,
            { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
            { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
            { blankLine: 'always', prev: '*', next: 'return' }
        ],
        'prefer-arrow-callback': 2,
        'prefer-const': 2,
        'prefer-spread': 2,
        'prefer-template': 2,
        'quote-props': [2, 'as-needed'],
        quotes: [2, 'single', 'avoid-escape'],
        'semi-spacing': [2, { before: false, after: true }],
        'space-before-blocks': 2,
        'space-before-function-paren': [
            2,
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always'
            }
        ],
        'space-in-parens': 2,
        'space-infix-ops': 2,
        semi: [2, 'never'],

        // Strict Move
        strict: 0,

        // Variables
        'no-shadow': 2,
    }
}
