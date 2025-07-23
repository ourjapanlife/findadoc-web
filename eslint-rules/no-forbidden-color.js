// eslint-rules/no-forbidden-color.js

// Export the ESLint rule definition.
export default {
    // --- Rule Meta Information ---
    // The 'meta' property provides metadata about the rule.
    meta: {
        // 'type' indicates the type of rule: 'problem' (potential errors),
        // 'suggestion' (possible improvements), or 'layout' (formatting issues).
        type: 'suggestion',

        // 'docs' provides documentation for the rule.
        docs: {
            // A brief description of what the rule does.
            // eslint-disable-next-line
            description: 'Disallow direct use of generic Tailwind color utility classes and hardcoded hex/rgb/hsl colors in templates.',
            // The category for the rule (e.g., 'Best Practices', 'Stylistic Issues').
            category: 'Best Practices',
            // Indicates if the rule is recommended in ESLint configurations.
            recommended: false,
            // A URL to more detailed documentation for the rule (optional).
            url: 'your-docs-url-if-any'
        },

        // 'fixable' indicates if ESLint can automatically fix issues reported by this rule.
        // 'null' means it's not auto-fixable. 'code' means it is.
        fixable: null,

        // 'schema' defines the options that can be passed to the rule in the ESLint configuration.
        // This rule accepts an array of strings as 'forbiddenWords'.
        schema: [
            {
                type: 'object',
                properties: {
                    // 'forbiddenWords' will be an array of basic color names (e.g., 'red', 'blue', 'slate').
                    // These are typically the generic Tailwind color names you want to avoid.
                    forbiddenWords: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                },
                // 'additionalProperties: false' prevents passing any other unrecognized options.
                additionalProperties: false
            }
        ],

        // 'messages' defines the error messages to be reported.
        // We use placeholders like '{{ color }}' which will be filled dynamically.
        messages: {
            forbiddenColor: 'Color "{{ color }}" is forbidden. Use design tokens or semantic utility classes instead.',
            forbiddenHardcodedHex: 'Hardcoded hex color "{{ color }}" in style attribute is forbidden. Use design tokens.',
            forbiddenHardcodedRgb: 'Hardcoded RGB color "{{ color }}" in style attribute is forbidden. Use design tokens.',
            forbiddenHardcodedHsl: 'Hardcoded HSL color "{{ color }}" in style attribute is forbidden. Use design tokens.'
        }
    },

    // --- Rule Creation Logic ---
    // The 'create' method returns an object of visitor functions for AST nodes.
    create(context) {
        // Get options passed in the .eslintrc.js configuration.
        const options = context.options[0] || {}
        const forbiddenWords = options.forbiddenWords || []

        // Check if `vue-eslint-parser` services are available.
        if (!context.sourceCode.parserServices || !context.sourceCode.parserServices.defineTemplateBodyVisitor) {
            // Meaning the rule won't run for this file.
            return {}
        }

        /* Regex for detecting forbidden Tailwind-like color classes.
        *  This regex looks for:
        *  - Optional variants (e.g., `hover:`, `md:`).
        *  - Common Tailwind color prefixes (e.g., `text-`, `bg-`, `border-`).
        *  - FOLLOWED BY a forbidden color name (captured in group 1).
        *  - Optional shade number (e.g., `-500`, `-900`).
        *  - OR directly a forbidden color name (captured in group 2) with optional shade.
        *  `\b` ensures whole word matches. `i` makes it case-insensitive.
        */
        const forbiddenColorRegex = new RegExp(
            `\\b(?:[a-z-]+:)?(?:text|bg|border|stroke|fill|ring|divide|shadow|accent)-(${forbiddenWords.join('|')})(?:-\\d{1,3})?\\b|\\b(${forbiddenWords.join('|')})(?:-\\d{1,3})?\\b`,
            'i'
        )

        /* Regex for detecting ANY hardcoded HEX color values
        *  (e.g., #RRGGBB, #RGB, #RRGGBBAA).
        *  We don't list specific forbidden HEX values; any direct HEX is forbidden here.
        */
        const hexColorPattern = '#[0-9a-fA-F]{3,8}'
        const hexColorRegex = new RegExp(hexColorPattern, 'g')

        // Any direct RGB/RGBA is forbidden.
        const rgbColorPattern = '(?:rgb|rgba)\\(\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*,\\s*\\d{1,3}(?:,\\s*(?:0?\\.\\d+|1)\\s*)?\\)'
        const rgbColorRegex = new RegExp(rgbColorPattern, 'g')

        // Any direct HSL/HSLA is forbidden.
        // eslint-disable-next-line
        const hslColorPattern = '(?:hsl|hsla)\\(\\s*(?:\\d{1,3}|\\d+\\.\\d+)(?:deg)?\\s*,\\s*(?:\\d{1,3}|\\d+\\.\\d+)%\\s*,\\s*(?:\\d{1,3}|\\d+\\.\\d+)%(?:,\\s*(?:0?\\.\\d+|1)\\s*)?\\)'
        const hslColorRegex = new RegExp(hslColorPattern, 'g')

        // `defineTemplateBodyVisitor` ensures we correctly traverse the Vue template structure.
        return context.sourceCode.parserServices.defineTemplateBodyVisitor(
            {
                // Visit 'VAttribute' nodes where the key is 'class' or is a bound 'class' (e.g., `:class`).
                'VAttribute[key.name="class"], VAttribute[key.name.name="class"]'(node) {
                    let classValue = ''

                    // Handle static 'class="... "' attributes.
                    if (node.value && node.value.type === 'VLiteral') {
                        classValue = node.value.value
                    } else if (node.value && node.value.type === 'VExpressionContainer' && node.value.expression) {
                        // This currently focuses on simple strings or easily extractable values.
                        classValue = context.getSourceCode().getText(node.value.expression)
                    }

                    if (classValue) {
                        // Split the class string into individual class names.
                        const classes = classValue.split(/\s+/).filter(Boolean)

                        // Iterate over each class name found.
                        classes.forEach(cls => {
                            // Test the class name against our forbidden Tailwind color regex.
                            const match = cls.match(forbiddenColorRegex)
                            if (match) {
                                // If a match is found, report the issue.
                                // The captured color name is either in group 1 (with prefix) or group 2 (without prefix).
                                const matchedColor = match[1] || match[2]
                                context.report({
                                    node: node,
                                    messageId: 'forbiddenColor', // Use the message defined in meta.messages.
                                    data: { color: matchedColor } // Pass data for the message placeholder.
                                })
                            }
                        })
                    }
                },
                // If we never use 'style' maybe we don't wanna have this check
                // Visit 'VAttribute' nodes where the key is 'style' or is a bound 'style' (e.g., `:style`).
                'VAttribute[key.name="style"], VAttribute[key.name.name="style"]'(node) {
                    let styleValue = ''
                    if (node.value && node.value.type === 'VLiteral') {
                        styleValue = node.value.value
                    } else if (node.value && node.value.type === 'VExpressionContainer' && node.value.expression) {
                        styleValue = context.getSourceCode().getText(node.value.expression)
                    }

                    if (styleValue) {
                        // Check for hardcoded HEX colors.
                        const hexMatches = styleValue.match(hexColorRegex)
                        if (hexMatches) {
                            hexMatches.forEach(hex => {
                                context.report({
                                    node: node,
                                    messageId: 'forbiddenHardcodedHex',
                                    data: { color: hex }
                                })
                            })
                        }

                        // Check for hardcoded RGB/RGBA colors.
                        const rgbMatches = styleValue.match(rgbColorRegex)
                        if (rgbMatches) {
                            rgbMatches.forEach(rgb => {
                                context.report({
                                    node: node,
                                    messageId: 'forbiddenHardcodedRgb',
                                    data: { color: rgb }
                                })
                            })
                        }

                        // Check for hardcoded HSL/HSLA colors.
                        const hslMatches = styleValue.match(hslColorRegex)
                        if (hslMatches) {
                            hslMatches.forEach(hsl => {
                                context.report({
                                    node: node,
                                    messageId: 'forbiddenHardcodedHsl',
                                    data: { color: hsl }
                                })
                            })
                        }
                    }
                }

                /* Note: Attributes like 'title' are NOT visited by this rule unless
                *  a specific 'VAttribute[key.name="title"]' visitor is added.
                *  This helps avoid false positives for non-color-related attributes.
                *  This is used to prevend 'Violet Theme' on HamburgerMenu.vue
                */
            }
        )
    }
}
