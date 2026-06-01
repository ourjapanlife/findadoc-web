/* eslint-disable no-console */
/**
 * @file cleanUnusedLocaleKeys.js
 * @description Automated localization optimization utility for the findadoc-web repository.
 * Recursively analyzes Vue, TypeScript, and JavaScript source files using AST and regex engines,
 * aggregates translation keys, cross-references them against localized JSON dictionaries,
 * protects dynamically-injected namespaces, and prunes orphaned keys.
 *
 * @version 1.1.0
 * @author Aaditya Kakad
 */

import fs from 'fs'
import path from 'path'
import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'
import { fileURLToPath } from 'url'

/**
 * Parses a single file, segregating and evaluating script and template nodes
 * to extract hardcoded and dynamic i18n localization keys.
 *
 * @param {string} filePath - Absolute or relative path to the source file.
 * @returns {Object} Static keys array and dynamic template match string array.
 */
function extractKeysFromFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const ext = path.extname(filePath)

    let scriptContent = ''
    let templateContent = ''

    const usedKeys = new Set()
    const dynamicPrefixes = new Set()

    // 1. Single File Component (SFC) Parsing: Isolate logic and template blocks
    if (ext === '.vue') {
        const { descriptor } = parse(fileContent)
        scriptContent = [descriptor.script?.content, descriptor.scriptSetup?.content].filter(Boolean).join('\n') || ''
        templateContent = descriptor.template?.content || ''
    } else if (ext === '.ts' || ext === '.js') {
        scriptContent = fileContent
    }

    // 2. Abstract Syntax Tree (AST) Analysis: Evaluate logical code blocks safely
    if (scriptContent.trim()) {
        const sourceFile = ts.createSourceFile(filePath, scriptContent, ts.ScriptTarget.Latest, true)

        /**
         * Depth-first traversal walker across the generated compiler AST nodes.
         * Target: CallExpressions representing the i18n execution function `t()`.
         */
        function walkAst(node) {
            if (ts.isCallExpression(node)) {
                const functionName = node.expression.getText(sourceFile)

                // Identify target signature: t('localization.key')
                if (functionName === 't' && node.arguments.length > 0) {
                    const firstArg = node.arguments[0]

                    if (ts.isStringLiteral(firstArg)) {
                        usedKeys.add(firstArg.text)
                    } else if (ts.isTemplateExpression(firstArg) || ts.isIdentifier(firstArg)) {
                        // Isolate dynamic variables/expressions to pass to downstream safeguards
                        dynamicPrefixes.add(firstArg.getText(sourceFile))
                    }
                }
            }
            ts.forEachChild(node, walkAst)
        }
        walkAst(sourceFile)
    }

    // 3. Template Tokenization: Regex execution across visual layout scopes
    if (templateContent.trim()) {
        // Matches global template patterns for $t('key') or t('key') across various quote bindings
        const templateRegex = /(?:\$t|t)\(\s*['"`]([^'"`]+)['"`]\s*\)/g
        let match

        while ((match = templateRegex.exec(templateContent)) !== null) {
            const key = match[1]
            // Discard inline runtime expressions evaluated within template interpolation tags
            if (!key.includes('$')) {
                usedKeys.add(key)
            }
        }
    }

    return {
        staticKeys: Array.from(usedKeys),
        dynamicMatches: Array.from(dynamicPrefixes)
    }
}

/**
 * Recursively walks specified project folders to build an aggregate map of
 * active localization keys.
 *
 * @param {string[]} foldersToScan - Target repository directories.
 * @param {Set<string>} [allStaticKeys=new Set()] - Retained static keys.
 * @param {Set<string>} [allDynamicMatches=new Set()] - Retained dynamic expressions.
 * @returns {Object} Compiled collection of distinct static keys and dynamic matches.
 */
function scanDirectories(foldersToScan, allStaticKeys = new Set(), allDynamicMatches = new Set()) {
    for (const folder of foldersToScan) {
        if (!fs.existsSync(folder)) continue

        const walk = dir => {
            const files = fs.readdirSync(dir)
            for (const file of files) {
                const fullPath = path.join(dir, file)
                const stat = fs.statSync(fullPath)

                if (stat.isDirectory()) {
                    walk(fullPath)
                } else {
                    const ext = path.extname(fullPath)
                    if (ext === '.vue' || ext === '.ts' || ext === '.js') {
                        const { staticKeys, dynamicMatches } = extractKeysFromFile(fullPath)
                        staticKeys.forEach(key => allStaticKeys.add(key))
                        dynamicMatches.forEach(match => allDynamicMatches.add(match))
                    }
                }
            }
        }
        walk(folder)
    }

    return {
        staticKeys: allStaticKeys,
        dynamicMatches: allDynamicMatches
    }
}

/**
 * Flattens a deeply nested JSON dictionary structure into a flat key-value map
 * utilizing unified dot-notation pathways.
 *
 * @param {Object} obj - Nested JSON translation schema.
 * @param {string} [prefix=''] - Ongoing namespace prefix state accumulator.
 * @param {Object} [res={}] - Aggregated output key-value store map.
 * @returns {Object} Transformed flat dictionary map.
 */
function flattenJsonObj(obj, prefix = '', res = {}) {
    for (const key in obj) {
        const propName = prefix ? `${prefix}.${key}` : key
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            flattenJsonObj(obj[key], propName, res)
        } else {
            res[propName] = obj[key]
        }
    }
    return res
}

/**
 * Pure predicate evaluator to determine whether a given translation key should be pruned.
 * Exported specifically to feed the Vitest test infrastructure safely without I/O side effects.
 */
export function shouldPruneKey(
    dictionaryKey,
    codeInventory,
    protectedPrefixes = ['specialties.', 'specialtyCategories.', 'localeErrors', 'moderation.']
) {
    let isUsed = codeInventory.staticKeys.has(dictionaryKey)

    // Code Evaluation Check: Evaluate matches against code AST dynamic structures
    if (!isUsed && codeInventory.dynamicMatches) {
        for (const dynamicMatch of codeInventory.dynamicMatches) {
            if (dynamicMatch.includes('unsavedChanges') && dictionaryKey.startsWith('unsavedChanges.')) {
                isUsed = true
                break
            }
        }
    }

    // Database/API Safeguard Check: Shield remote properties mapped at runtime
    // Database/API Safeguard Check: Shield remote properties mapped at runtime
    if (!isUsed) {
        const isProtected = protectedPrefixes.some(prefix => dictionaryKey.startsWith(prefix))
        // Explicit hardcoded shield fallback for store dependencies
        if (isProtected || dictionaryKey.startsWith('localeErrors')) {
            isUsed = true
        }
    }

    return !isUsed
}

/**
 * Core Orchestrator execution pipeline. Loops globally across all local language definitions.
 */
export function runPrune() {
    try {
        console.log('🚀 Step 1: Initiating structural repository file sweep...')

        const targetFolders = ['./components', './pages', './layouts', './stores', './composables', './plugins']
        const codeInventory = scanDirectories(targetFolders)

        console.log(`✅ Code analysis complete. Discovered ${codeInventory.staticKeys.size} active identifiers in scope.`)

        const localesDir = './i18n/locales'
        if (!fs.existsSync(localesDir)) {
            throw new Error(`Target localization directory missing at: ${localesDir}`)
        }

        const localeFiles = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'))
        console.log(`\n📖 Step 2: Processing ${localeFiles.length} language dictionaries globally...`)

        for (const file of localeFiles) {
            const localeFilePath = path.join(localesDir, file)
            const rawLocaleData = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'))
            const flatLocaleMap = flattenJsonObj(rawLocaleData)
            const totalDictionaryKeys = Object.keys(flatLocaleMap)

            const unusedKeys = []
            for (const dictionaryKey of totalDictionaryKeys) {
                if (shouldPruneKey(dictionaryKey, codeInventory)) {
                    unusedKeys.push(dictionaryKey)
                }
            }

            if (unusedKeys.length > 0) {
                function removeKeysFromObj(obj, currentPrefix = '') {
                    for (const key in obj) {
                        const propName = currentPrefix ? `${currentPrefix}.${key}` : key

                        // 🛡️ Explicitly block pruning of any unsavedChanges keys or children
                        if (unusedKeys.includes(propName) && !propName.startsWith('unsavedChanges')) {
                            delete obj[key]
                        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                            removeKeysFromObj(obj[key], propName)

                            // 🛡️ Block emptying out parent containers for unsavedChanges
                            if (Object.keys(obj[key]).length === 0 && !propName.startsWith('unsavedChanges')) {
                                delete obj[key]
                            }
                        }
                    }
                }

                removeKeysFromObj(rawLocaleData)
                fs.writeFileSync(localeFilePath, JSON.stringify(rawLocaleData, null, 2), 'utf-8')
                console.log(`✨ [${file}] Optimization Complete. Removed ${unusedKeys.length} dead properties.`)
            } else {
                console.log(`✨ [${file}] is already fully optimal.`)
            }
        }
        console.log('\n✅ Global dictionary optimization successfully completed across all regions!')
    } catch (error) {
        console.error('\n❌ Automation Pipeline Execution Interrupted:', error.message)
        process.exitCode = 1
    }
}

// CLI Execution Guard
const currentFilePath = fileURLToPath(import.meta.url)
if (process.argv[1] && (process.argv[1] === currentFilePath || path.basename(process.argv[1]) === 'cleanUnusedLocaleKeys.js')) {
    runPrune()
}
