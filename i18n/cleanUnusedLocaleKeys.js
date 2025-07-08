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

function removeKeysFromJson(obj, keysToRemove) {
    // Recursive helper function to remove a nested key specified by an array of keys (keyParts)
    const removeKeyAtPath = (currentObj, keyParts) => {
        if (keyParts.length === 1) {
            // Base case: remove the last key from the current object and return a new object without that key
            const keyToRemove = keyParts[0]
            // Use object destructuring with computed property name to extract the property named by 'keyToRemove'
            // And ignore it (_), while collecting the rest of the properties into a new object called 'rest'.
            // This effectively creates a new object 'rest' without the property 'keyToRemove'.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [keyToRemove]: _unused, ...rest } = currentObj
            return rest
        }
        const [firstKey, ...remainingKeys] = keyParts
        // If the first key exists and is an object, recursively remove the nested key
        if (currentObj[firstKey] && typeof currentObj[firstKey] === 'object' && currentObj[firstKey] !== null) {
            return {
                // Return a new object copying all properties from `currentObj`,
                // But replace the property at `firstKey` with the result of
                // Recursively removing the key from the nested object at that path.
                ...currentObj,
                [firstKey]: removeKeyAtPath(currentObj[firstKey], remainingKeys)
            }
        }

        // If the key path does not exist or is not an object, return the object unchanged
        return currentObj
    }

    // For each key path to remove, split it into parts and call the recursive function to remove it
    return keysToRemove.reduce((updatedObj, keyPath) => {
        const keyParts = keyPath.split('.')
        return removeKeyAtPath(updatedObj, keyParts)
    }, obj)
}

const run = async () => {
    const usedKeys = await extractUsedTranslationKeys()

    const unusedKeysByLocale = translationFilePaths.reduce((acc, filePath) => {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const allKeys = extractAllKeysFromJson(content)
        const unusedKeys = allKeys.filter(key => !usedKeys.has(key))

        if (unusedKeys.length > 0) {
            // Clean JSON
            const cleanedContent = removeKeysFromJson(content, unusedKeys)
            // Rewrite file
            fs.writeFileSync(filePath, JSON.stringify(cleanedContent, null, 2), 'utf-8')
            acc[path.basename(filePath)] = unusedKeys
        }
        return acc
    }, {})

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

    fs.writeFileSync('potentially_unused_locales_keys.txt', output, 'utf-8')
    console.info('\n📝 Report saved to: potentially_unused_keys.txt\n')
}

run()

