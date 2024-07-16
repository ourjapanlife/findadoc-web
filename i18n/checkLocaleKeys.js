import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the path to our i18n locales directory
const localesI18nDirectory = path.join(
    __dirname,
    '/locales'
)

// Read all JSON files from the locales directory
let localeFiles = fs
    .readdirSync(localesI18nDirectory)
    .filter(file => file.endsWith('.json'))

// Ensure en.json is the first file
const enFile = 'en.json'
if (!localeFiles.includes(enFile)) {
    console.error('en.json file not found in the locales directory')
    process.exit(1)
}
localeFiles = localeFiles.filter(file => file !== enFile)
localeFiles.unshift(enFile)

// This function extracts the keys from the JSON object
const getKeys = (obj, prefix = '') =>
    Object.keys(obj).reduce((keys, key) => {
        const fullKey = prefix ? `${prefix}.${key}` : key
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys.push(...getKeys(obj[key], fullKey))
        } else {
            keys.push(fullKey)
        }
        return keys
    }, [])

// This reads and parses the JSON files
const localeKeys = localeFiles.reduce((acc, file) => {
    const filePath = path.join(localesI18nDirectory, file)
    const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    acc[file] = getKeys(jsonContent)
    return acc
}, {})

// This gets all the keys from the first JSON file
const referenceKeys = new Set(localeKeys[enFile])

// This compares the keys from all other files
const missingKeys = localeFiles.slice(1).reduce((acc, file) => {
    const currentKeys = new Set(localeKeys[file])
    const missing = [...referenceKeys].filter(key => !currentKeys.has(key))
    if (missing.length > 0) {
        acc[file] = missing
    }
    return acc
}, {})

// Log the result and state which keys are missing
if (Object.keys(missingKeys).length > 0) {
    console.log('Key discrepancies found:\n')
    for (const [file, keys] of Object.entries(missingKeys)) {
        console.log(`\x1b[94mFile ${file} is missing keys:\x1b[0m\n${keys.join(', \n')}\n`)
    }
    console.log('\x1b[33mManually add keys and translations or automatically add missing keys to file by running:\x1b[0m\nyarn insert-missing-locale-keys\n')
    process.exit(1)
} else {
    console.log('All locale files have matching keys.')
    process.exit(0)
}
