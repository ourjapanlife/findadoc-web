import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the path to our i18n locales directory
const localesI18nDirectory = path.join(__dirname, '/locales')

// Import the key-checking function
const checkLocaleKeys = () => {
    const localeFilesWithoutEnFileName = fs
        .readdirSync(localesI18nDirectory)
        .filter(localeFile => localeFile.endsWith('.json') && localeFile !== 'en.json')

    const enFileName = 'en.json'
    const enFilePath = path.join(localesI18nDirectory, enFileName)
    const enFileContent = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'))

    // Function to create a full key path
    const createFullKey = (prefix, key) => prefix ? `${prefix}.${key}` : key

    // Function to check if value is an object
    const isNestedObject = value => typeof value === 'object' && value !== null

    // Extract all keys from a locale file
    const extractAllKeys = (jsonObject, prefix = '') => {
        const keys = []
        Object.keys(jsonObject).forEach(key => {
            const fullKey = createFullKey(prefix, key)
            if (isNestedObject(jsonObject[key])) {
                keys.push(...extractAllKeys(jsonObject[key], fullKey))
            } else {
                keys.push(fullKey)
            }
        })
        return keys
    }

    // Function to insert a key-value pair into a nested object
    const insertMissingKey = (targetObject, keyPath, value) => {
        const keyParts = keyPath.split('.')
        let currentLevel = targetObject
        keyParts.forEach((part, index) => {
            if (index === keyParts.length - 1) {
                // Last part: set the value
                currentLevel[part] = value
            } else {
                // Intermediate parts: ensure the object exists
                if (!currentLevel[part]) {
                    currentLevel[part] = {}
                }
                currentLevel = currentLevel[part]
            }
        })
    }

    const referenceKeys = extractAllKeys(enFileContent)

    localeFilesWithoutEnFileName.forEach(file => {
        const localeFilePath = path.join(localesI18nDirectory, file)
        const jsonContent = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'))

        const existingKeys = new Set(extractAllKeys(jsonContent))
        let fileUpdated = false
        const missingKeys = []

        referenceKeys.forEach(key => {
            if (!existingKeys.has(key)) {
                const value = key.split('.').reduce((obj, part) => obj?.[part], enFileContent)
                if (value !== undefined) {
                    insertMissingKey(jsonContent, key, value)
                    missingKeys.push(key)
                    fileUpdated = true
                }
            }
        })

        if (fileUpdated) {
            fs.writeFileSync(localeFilePath, JSON.stringify(jsonContent, null, 2), 'utf-8')
            console.log(`\x1b[35mInserted missing keys into ${file}\x1b[0m`)
            console.log('\x1b[34mMissing keys:\x1b[0m')
            missingKeys.forEach(key => console.log(`- ${key}`))
        }
    })
}

checkLocaleKeys()
