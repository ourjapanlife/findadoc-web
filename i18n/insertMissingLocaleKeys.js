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

// Import the key-checking function
const checkLocaleKeys = () => {
    const localeFiles = fs
        .readdirSync(localesI18nDirectory)
        .filter(file => file.endsWith('.json'))

    const enFile = 'en.json'
    const enFilePath = path.join(localesI18nDirectory, enFile)
    const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'))

    // Extract keys and find missing ones
    let missingKeys = {}
    localeFiles.forEach(file => {
        if (file !== enFile) {
            const filePath = path.join(localesI18nDirectory, file)
            const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

            // Extract all keys from the current JSON file
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
            const currentKeys = new Set(getKeys(jsonContent))

            // Find missing keys
            const referenceKeys = new Set(getKeys(enContent))
            const missing = [...referenceKeys].filter(
                key => !currentKeys.has(key)
            )
            if (missing.length > 0) {
                missingKeys[file] = missing
            }
        }
    })

    // Insert missing keys
    const insertMissingKeys = (jsonContent, missingKeys, enContent) => {
        missingKeys.forEach(key => {
            const value = key
                .split('.')
                .reduce((obj, k) => obj?.[k], enContent)
            if (value !== undefined) {
                key.split('.').reduce((obj, k, i, arr) => {
                    if (i === arr.length - 1) {
                        obj[k] = value
                    } else {
                        if (!obj[k]) obj[k] = {}
                    }
                    return obj[k]
                }, jsonContent)
            }
        })
    }

    Object.entries(missingKeys).forEach(([file, keys]) => {
        const filePath = path.join(localesI18nDirectory, file)
        const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

        insertMissingKeys(jsonContent, keys, enContent)

        fs.writeFileSync(
            filePath,
            JSON.stringify(jsonContent, null, 2),
            'utf-8'
        )
        console.log(`Inserted missing keys into ${file}`)
    })

    if (Object.keys(missingKeys).length === 0) {
        console.log('No missing keys to insert.')
    }
}

checkLocaleKeys()
