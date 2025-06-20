import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as deepl from 'deepl-node'
import dotenv from 'dotenv'

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define the path to our i18n locales directory
const localesI18nDirectory = path.join(__dirname, '/locales')

// Load environment variables from .env file
dotenv.config()

// Define Deepl client and credentials
const deeplAuthKey = process.env.DEEPL
const deeplClient = new deepl.DeepLClient(deeplAuthKey)

const deeplTargetLanguages = {
    de: 'DE',
    en: 'EN-US',
    fr: 'FR',
    it: 'IT',
    ja: 'JA',
    pt: 'PT-BR',
    ru: 'RU',
    vi: 'VI',
    cn: 'ZH-HANS',
    tl: 'EN-US' // Deepl does not support Tagalog so this is added to fill the missing string in English

}
async function translateValueWithDeepl(targetLang, value) {
    const result = await deeplClient.translateText(value, 'EN', targetLang)
    return result
}

// Import the key-checking function
const checkLocaleKeys = () => {
    const localeFilesWithoutEnFileName = fs
        .readdirSync(localesI18nDirectory)
        .filter(localeFile => localeFile.endsWith('.json') && localeFile !== 'en.json')

    const enFileName = 'en.json'
    const enFilePath = path.join(localesI18nDirectory, enFileName)
    const enFileContent = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'))

    const referenceKeys = extractAllKeys(enFileContent)

    let missingKeysSummary = []

    // Check if in CI/CD and write the .txt file for the body of the message in GitHub
    if (process.env.NODE_ENV === 'production') {
        missingKeysSummary = runCICDChecksForLocaleFiles(localeFilesWithoutEnFileName, referenceKeys)
        writeErrorMessageForMissingKeysToDeveloper(missingKeysSummary)
    }

    // Insert in development
    findAndInsertMissingKeysAndValuesInNonEnFiles(
        localeFilesWithoutEnFileName, enFileContent, referenceKeys, insertMissingKeysAndValues
    )
}

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

// Function to create a full key path
const createFullKey = (prefix, key) => prefix ? `${prefix}.${key}` : key

// Function to check if value is an object
const isNestedObject = value => typeof value === 'object' && value !== null

// Function to insert a key-value pair into a nested object
const insertMissingKeysAndValues = (targetObject, keyPath, value) => {
    console.log('value =', value)
    const keyPathParts = keyPath.split('.')
    let currentLevel = targetObject
    keyPathParts.forEach((part, index) => {
        const lastIndexOfTheKeyPathParts = keyPathParts.length - 1
        if (index === lastIndexOfTheKeyPathParts) {
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

/**
The following function is used to combine the previous functions to insert keys value pairs from the English file if they are not
currently present in the other translation files. This will set the other files to have English translations unless
the translations are later updated into their native language by a contributor.
* @param {Array} localeFilesWithoutEnFileName - All the files that are not the english file
* @param {Record<string>} enFileContent - The content from the en.json file
* @param {string[]} referenceKeys - keys in the en.json file
* @param {() => void} insertMissingKeysAndValues  - function to insert a key-value pair into a nested object
*/
const findAndInsertMissingKeysAndValuesInNonEnFiles
= (localeFilesWithoutEnFileName, enFileContent, referenceKeys, insertMissingKeysAndValues) => {
    localeFilesWithoutEnFileName.forEach(file => {
        const localeFilePath = path.join(localesI18nDirectory, file)
        const jsonContent = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'))

        const existingKeys = new Set(extractAllKeys(jsonContent))
        const missingKeys = []

        referenceKeys.forEach(async key => {
            if (!existingKeys.has(key)) {
                const enValue = key.split('.').reduce((obj, part) => obj?.[part], enFileContent)

                if (enValue !== undefined) {
                    const localizedValue = await translateValueWithDeepl(deeplTargetLanguages[file.substring(0, 2)], enValue)
                    if (localizedValue.text) {
                        insertMissingKeysAndValues(jsonContent, key, localizedValue.text)
                        missingKeys.push(key)

                        fs.writeFileSync(localeFilePath, JSON.stringify(jsonContent, null, 2), 'utf-8')
                        console.log(`\x1b[35mInserted missing keys into ${file}\x1b[0m`)
                        console.log('\x1b[34mMissing keys:\x1b[0m')
                        missingKeys.forEach(key => console.log(`- ${key}`))
                    }
                }
            }
        })
    })
}

// To run in CI/CD just to report the keys
const findAndReportMissingKeysInNonEnFiles = (localeFilesWithoutEnFileName, referenceKeys) => {
    const missingKeysSummary = []

    localeFilesWithoutEnFileName.forEach(file => {
        const localeFilePath = path.join(localesI18nDirectory, file)
        const jsonContent = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'))

        const existingKeys = new Set(extractAllKeys(jsonContent))
        const missingKeys = []

        referenceKeys.forEach(key => {
            if (!existingKeys.has(key)) {
                missingKeys.push(key)
            }
        })

        if (missingKeys.length) {
            missingKeysSummary.push({ file, keys: missingKeys })
        }
    })

    return missingKeysSummary
}

const runCICDChecksForLocaleFiles = (localeFilesWithoutEnFileName, referenceKeys) => {
    const missingKeysSummary = findAndReportMissingKeysInNonEnFiles(
        localeFilesWithoutEnFileName, referenceKeys
    )
    if (missingKeysSummary.length) {
        console.error('\x1b[31mMissing keys found:\x1b[0m')
        missingKeysSummary.forEach(({ file, keys }) => {
            console.error(`\x1b[33m${file}:\x1b[0m`)
            keys.forEach(key => console.error(`- ${key}`))
        })

        return missingKeysSummary
    }

    return []
}

const writeErrorMessageForMissingKeysToDeveloper = missingKeysSummary => {
    if (missingKeysSummary.length) {
        fs.writeFileSync('missing_keys.txt', missingKeysSummary.map(({ file, keys }) => `${file}:\n${keys.join('\n')}`).join('\n\n'))
        console.error('❌ \x1b[31mLocale linting failed due to missing keys.\x1b[0m')
        process.exit(1)
    }
}

checkLocaleKeys()
