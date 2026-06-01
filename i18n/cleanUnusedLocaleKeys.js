/* eslint-disable no-console */
/**
 * @file cleanUnusedLocaleKeys.js
 * @description Automated localization optimization utility for the findadoc-web repository.
 * Recursively analyzes Vue, TypeScript, and JavaScript source files using AST and regex engines,
 * aggregates translation keys, cross-references them against localized JSON dictionaries,
 * protects dynamically-injected namespaces, and prunes orphaned keys.
 * * @version 1.0.0
 * @author Aaditya Kakad
 */

import fs from 'fs'
import path from 'path'
import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'

/**
 * Parses a single file, segregating and evaluating script and template nodes
 * to extract hardcoded and dynamic i18n localization keys.
 * * @param {string} filePath - Absolute or relative path to the source file.
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
        scriptContent = (descriptor.script || descriptor.scriptSetup)?.content || ''
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
 * * @param {string[]} foldersToScan - Target repository directories.
 * @param {Set<string>} [allStaticKeys=new Set()] - Retained static keys.
 * @param {Set<string>} [allDynamicMatches=new Set()] - Retained dynamic expressions.
 * @returns {Object} Compiled collection of distinct static keys and dynamic matches.
 */
function scanDirectories(foldersToScan, allStaticKeys = new Set(), allDynamicMatches = new Set()) {
    for (const folder of foldersToScan) {
        if (!fs.existsSync(folder)) continue // Gracefully bypass directories missing locally

        const walk = dir => {
            const files = fs.readdirSync(dir)
            for (const file of files) {
                const fullPath = path.join(dir, file)
                const stat = fs.statSync(fullPath)

                if (stat.isDirectory()) {
                    walk(fullPath) // Recursive Depth-First Search (DFS)
                } else {
                    const ext = path.extname(fullPath)
                    // Filter down to valid compiler target extensions
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
 * * @param {Object} obj - Nested JSON translation schema.
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

// ============================================================================
// AUTOMATION RUNTIME EXECUTION PIPELINE
// ============================================================================
try {
    console.log('🚀 Step 1: Initiating structural repository file sweep...')

    // Define relevant directories for macro frontend coverage
    // Define relevant directories for macro frontend coverage
    const targetFolders = ['./components', './pages', './layouts', './stores', './composables'];
    const codeInventory = scanDirectories(targetFolders)

    console.log(`✅ Code analysis complete. Discovered ${codeInventory.staticKeys.size} active identifiers in scope.`)

    // Establish link to verified location of localized dictionary trees
    const localeFilePath = './i18n/locales/en.json'

    if (!fs.existsSync(localeFilePath)) {
        throw new Error(`Target localization dictionary absent at route: ${localeFilePath}`)
    }

    console.log(`\n📖 Step 2: Extracting active dictionary blueprint from ${localeFilePath}...`)
    const rawLocaleData = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'))
    const flatLocaleMap = flattenJsonObj(rawLocaleData)
    const totalDictionaryKeys = Object.keys(flatLocaleMap)

    console.log(`✅ Locale matrix generated. Total keys defined: ${totalDictionaryKeys.length}`)

    console.log('\n⚖️ Step 3: Computing semantic translation key delta matrices...')
    const unusedKeys = []

    /**
     * Architectural Safeguards / Whitelist:
     * Defines object namespaces that are resolved dynamically by runtime queries,
     * API integration streams, or data structures, protecting them from static erasure.
     */
    const protectedPrefixes = ['specialties.', 'specialtyCategories.']

    for (const dictionaryKey of totalDictionaryKeys) {
        let isUsed = codeInventory.staticKeys.has(dictionaryKey)

        // Code Evaluation Check: Evaluate matches against code AST dynamic structures
        if (!isUsed) {
            for (const dynamicMatch of codeInventory.dynamicMatches) {
                if (dynamicMatch.includes('unsavedChanges') && dictionaryKey.startsWith('unsavedChanges.')) {
                    isUsed = true
                    break
                }
            }
        }

        // Database/API Safeguard Check: Shield remote properties mapped at runtime
        if (!isUsed) {
            const isProtected = protectedPrefixes.some(prefix => dictionaryKey.startsWith(prefix))
            if (isProtected) {
                isUsed = true
            }
        }

        // Flag isolated records for removal if both evaluation passes turn up empty
        if (!isUsed) {
            unusedKeys.push(dictionaryKey)
        }
    }

    // Output delta summary tracking metrics
    console.log('\n📊 PRUNING DIAGNOSTIC SUMMARY:')
    console.log('------------------------------------------------')
    console.log(`Total Object Keys Evaluated     : ${totalDictionaryKeys.length}`)
    console.log(`Active Graph Nodes Preserved    : ${totalDictionaryKeys.length - unusedKeys.length}`)
    console.log(`Orphaned String Leaf Elements   : ${unusedKeys.length}`)
    console.log('------------------------------------------------')

    // 4. Mutation Layer: Destructure properties and write clean tree back to disk
    if (unusedKeys.length > 0) {
        console.log('\n🪓 Step 4: Purging dead nodes & optimizing localized trees...')

        /**
         * Recursively clean structural layout references inside the native JSON object tree.
         */
        function removeKeysFromObj(obj, currentPrefix = '') {
            for (const key in obj) {
                const propName = currentPrefix ? `${currentPrefix}.${key}` : key

                if (unusedKeys.includes(propName)) {
                    delete obj[key]
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    removeKeysFromObj(obj[key], propName)

                    // Prune empty nested parent nodes to keep JSON hierarchy structurally clean
                    if (Object.keys(obj[key]).length === 0) {
                        delete obj[key]
                    }
                }
            }
        }

        removeKeysFromObj(rawLocaleData)

        // Commit modifications back to disk storage with uniform indent configuration
        fs.writeFileSync(localeFilePath, JSON.stringify(rawLocaleData, null, 2), 'utf-8')
        console.log(`✨ System Optimization Complete. ${unusedKeys.length} dead properties successfully removed.`)
    } else {
        console.log('\n✨ Analysis complete: Dictionary graph is fully optimal with zero dead weight.')
    }
} catch (error) {
    console.error('\n❌ Automation Pipeline Execution Interrupted:', error.message)
}
