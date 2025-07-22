// eslint-rules/no-forbidden-color.js
// Importa l'oggetto AST da vue-eslint-parser se hai bisogno dei tipi
// import { AST } from "vue-eslint-parser"; // Se stai usando TypeScript per la regola stessa

export default {
    meta: {
        type: 'suggestion', // o 'problem' o 'layout'
        docs: {
            description: 'Disallow hardcoded colors in templates',
            category: 'Best Practices',
            recommended: false,
            url: 'your-docs-url-if-any'
        },
        fixable: null, // o 'code' se vuoi renderla auto-fixable
        schema: [
            {
                type: 'object',
                properties: {
                    forbiddenWords: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                },
                additionalProperties: false
            }
        ],
        messages: {
            forbiddenColor: 'Color "{{ color }}" is forbidden. Use design tokens or utility classes instead.'
        }
    },
    create(context) {
        const options = context.options[0] || {}
        const forbiddenWords = options.forbiddenWords || []

        if (!context.sourceCode.parserServices || !context.sourceCode.parserServices.defineTemplateBodyVisitor) {
            // Fallback for files not-Vue or parser not 'vue-eslint-parser'
            return {}
        }

        //use defineTemplateBodyVisitor per detecting template
        return context.sourceCode.parserServices.defineTemplateBodyVisitor(
            {
                // VAttribute is an AST template node that is and HTML attribute
                VAttribute(node) {
                    // (es. class, :style, style, v-bind:class, ecc.)
                    if (node.value && typeof node.value.value === 'string') {
                        const attributeValue = node.value.value

                        forbiddenWords.forEach(forbiddenColor => {
                            if (attributeValue.toLowerCase().includes(forbiddenColor.toLowerCase())) {
                                context.report({
                                    node: node,
                                    messageId: 'forbiddenColor',
                                    data: { color: forbiddenColor }
                                })
                            }
                        })
                    }
                }
            }
        )
    }
}

