export function hasSpecialCharacters(str: string) {
    // eslint-disable-next-line no-useless-escape
    return /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str)
}

export function hasJapaneseCharacters(name: string) {
    return /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g.test(name)
}

export function hasLatinCharacters(name: string) {
    return /[a-zA-Z]/g.test(name)
}

export function hasOnlyValidJapaneseAndLatinCharacters(name: string): boolean {
    // 1) Compatibility‐normalize (NFKC) folds full-width ↔ ASCII
    const compat = name.normalize('NFKC')
    // 2) Canonical‐normalize (NFC) composes any decomposed sequences
    const normalized = compat.normalize('NFC')

    /* This regex checks to make sure that the string after being normalized only contains
        1. Hiragana, Katakan, and Kanji for Japanese
        2. Romaji for English letters
        3. Hyphens of both double and single with since the hypen in Japanese is different than Romaji
        4. Spaces
        5. Digits
    */
    const validChars = /^[A-Za-z0-9 \-\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/
    return validChars.test(normalized)
}

export function isInvalidName(name: string) {
    // eslint-disable-next-line no-useless-escape
    return /[~!#$%&*+=[\]\\;/{}|:<>\?0-9]+/g.test(name)
}

export function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email)
}

export function isValidPhoneNumber(phoneNumber: string) {
    return /^[+]?[0-9]{0,3}[\s./]?[(]?[0-9]{1,4}[)]?[-\s./0-9x]{8,18}$/g.test(phoneNumber)
}

export function isValidWebsite(website: string) {
    return /^((https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9-]{2,}(\/[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?)?$/.test(website)
}

export function isFloat(float: string) {
    return /[0-9]+[.][0-9]+/g.test(float)
}

export function isValidPostalCode(postalCode: string) {
    return /^\d{3}-\d{4}$/.test(postalCode)
}

export function hasScriptTags(input: string) {
    const tagPattern = /<script.*?>.*?<\/script>/gi
    return tagPattern.test(input)
}

export function isValidUrl(url: string | URL) {
    try {
        url = new URL(url)
    } catch (e) {
        console.error(`Error: ${e}`)
        return false
    }
    return url.protocol === 'https:'
}

export function convertStringToSentenceCase(theme: string) {
    return !theme.length ? '' : theme.charAt(0).toUpperCase() + theme.slice(1).toLowerCase()
}

export function convertStringToTitleCase(stringToConvert: string) {
    if (!stringToConvert) {
        return ''
    }
    const normalizedString = stringToConvert.replace(/[^a-zA-Z0-9]+/g, ' ').trim()
    const splitStringArray = normalizedString.split(' ')
    const titleCasedWords = splitStringArray.map(word => convertStringToSentenceCase(word))
    const titleCaseString = titleCasedWords.join(' ')
    return titleCaseString
}
