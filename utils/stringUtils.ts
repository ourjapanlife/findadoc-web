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
    return /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9-]+\.[a-zA-Z0-9-_#/]+$/g.test(website)
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
