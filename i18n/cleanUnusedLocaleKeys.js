import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename)

const localesDir = path.join(__dirname, '/locales')
const sourceCodeDir = path.join(__dirname, '..')

const translationFilePaths = fs.readdirSync(localesDir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(localesDir, file))

function getFilesRecursively(dir, exts = [], ignoreDirectories = []) {
    // Read the contents of the directory 'dir' and get an array of Dirent objects
    const list = fs.readdirSync(dir, { withFileTypes: true })
    return list.reduce((results, dirent) => {
        // Accumulate matching file paths in the 'results' array, starting from an empty array []
        const fullPath = path.join(dir, dirent.name)

        if (dirent.isDirectory()) {
            if (!ignoreDirectories.includes(dirent.name)) {
                // Recursively call getFilesRecursively on this directory,
                // Then concatenate the returned array of file paths with 'results'
                return results.concat(getFilesRecursively(fullPath, exts, ignoreDirectories))
            }
            return results
        }
        // Check if the current item is a file and its name ends with one of the extensions we're interested in
        if (dirent.isFile() && exts.some(ext => dirent.name.endsWith(ext))) {
            return results.concat(fullPath)
        }

        return results
    }, [])
}

// 🔍 Extract used translation keys from code
const extractUsedTranslationKeys = async () => {
    const files = getFilesRecursively(sourceCodeDir, ['.ts', '.vue'], ['node_modules', 'dist'])

    const keyRegex = /(?:\$t|t)\(\s*['"`]([^'"`]+)['"`]\s*\)/g

    return new Set(
        files
            .map(file => fs.readFileSync(file, 'utf8').matchAll(keyRegex))
            .flatMap(matches => Array.from(matches))
            .map(match => match[1])
    )
}

// 🔄 Recursively extract all keys from JSON (flattened)
const extractAllKeysFromJson = (obj, prefix = '') =>
    Object.entries(obj).flatMap(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key
        return typeof value === 'object' && value !== null
            ? extractAllKeysFromJson(value, fullKey)
            : [fullKey]
    })

const run = async () => {
    const usedKeys = await extractUsedTranslationKeys()

    const unusedKeysByLocale = Object.fromEntries(
        translationFilePaths
            .map(filePath => {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
                const allKeys = extractAllKeysFromJson(content)
                const unusedKeys = allKeys.filter(key => !usedKeys.has(key))
                return [path.basename(filePath), unusedKeys]
            })
            .filter(([, unusedKeys]) => unusedKeys.length > 0)
    )

    if (Object.keys(unusedKeysByLocale).length === 0) {
        console.info('✅ No unused translation keys found.')
        return
    }

    const output = Object.entries(unusedKeysByLocale)
        .map(([file, keys]) => {
            console.info(`📂 ${file}:`)
            keys.forEach(key => console.info(`  - ${key}`))
            return `${file}:\n${keys.map(k => `- ${k}`).join('\n')}\n`
        })
        .join('\n')

    fs.writeFileSync('potentially_unused_keys.txt', output, 'utf-8')
    console.info('\n📝 Report saved to: potentially_unused_keys.txt\n')
}

run()

