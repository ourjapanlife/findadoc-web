import {hasJapaneseCharacters, hasLatinCharacters, isValidEmail, isValidPhoneNumber, isValidWebsite, isFloat, isValidPostalCode } from './stringUtils'

export function validateNameEn(nameEn: string): boolean {
    if (nameEn.length < 1 || nameEn.length > 128) {
        return false
    }

    const containsJapanseCharacters: boolean = hasJapaneseCharacters(nameEn)

    if (containsJapanseCharacters) {
        return false
    }

    return true
}

export function validateNameJp(nameJp: string): boolean {
    if (nameJp.length < 1 || nameJp.length > 128) {
        return false
    }

    const containsLatinCharacters: boolean = hasLatinCharacters(nameJp)

    if (containsLatinCharacters) {
        return false
    }

    return true
}

export function validatePhoneNumber(phoneNumber: string): boolean {
    if (phoneNumber.length < 1) {
        return false
    }

    const isPhoneNumberValid: boolean = isValidPhoneNumber(phoneNumber)

    if (!isPhoneNumberValid) {
        return false
    }

    return true
}

export function validateEmail(email: string): boolean {
    // This field can be empty
    if (email.length < 1) {
        return true
    }

    if (email.length > 128) {
        return false
    }

    const isEmailValid: boolean = isValidEmail(email)

    if (!isEmailValid) {
        return false
    }

    return true
}

export function validateWebsite(website: string): boolean {
    // This field can be empty
    if (website.length < 1) {
        return true
    }
    const isWebsiteValid: boolean = isValidWebsite(website)

    if (!isWebsiteValid) {
        return false
    }

    return true
}

export function validateAddressLineEn(addressLineEn: string): boolean {
    if (addressLineEn.length < 1 || addressLineEn.length > 128) {
        return false
    }

    const containsJapanseCharacters: boolean = hasJapaneseCharacters(addressLineEn)

    if (containsJapanseCharacters) {
        return false
    }

    return true
}

export function validateAddressLineJp(addressLineJp: string): boolean {
    if (addressLineJp.length < 1 || addressLineJp.length > 128) {
        return false
    }

    const containsLatinCharacters: boolean = hasLatinCharacters(addressLineJp)

    if (containsLatinCharacters) {
        return false
    }

    return true
}


export function validateCityEn(cityEn: string): boolean {
    if (cityEn.length < 1 || cityEn.length > 64) {
        return false
    }

    const containsJapanseCharacters: boolean = hasJapaneseCharacters(cityEn)

    if (containsJapanseCharacters) {
        return false
    }

    return true
}

export function validateCityJp(cityJp: string): boolean {
    if (cityJp.length < 1 || cityJp.length > 64) {
        return false
    }

    const containsLatinCharacters: boolean = hasLatinCharacters(cityJp)

    if (containsLatinCharacters) {
        return false
    }

    return true
}

export function validatePostalCode(postalCode: string): boolean {
    if (postalCode.length > 18) {
        return false
    }


    const isPostalCodeValid = isValidPostalCode(postalCode)

    if (!isPostalCodeValid) {
        return false
    }

    return true
}

export function validateFloat(float: string): boolean {
    if (float.length < 1 ) {
        return false
    }

    const isFloatValid: boolean = isFloat(float)

    if (!isFloatValid) {
        return false
    }

    return true
}