import { hasJapaneseCharacters,
    hasLatinCharacters,
    isValidEmail,
    isValidPhoneNumber,
    isValidWebsite,
    isFloat,
    isValidPostalCode } from './stringUtils'
import { Locale, type LocalizedNameInput } from '~/typedefs/gqlTypes'

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

export function validateNameJa(nameJa: string): boolean {
    if (nameJa.length < 1 || nameJa.length > 128) {
        return false
    }

    const containsLatinCharacters: boolean = hasLatinCharacters(nameJa)

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

    const containsJapaneseCharacters: boolean = hasJapaneseCharacters(addressLineEn)

    if (containsJapaneseCharacters) {
        return false
    }

    return true
}

export function validateAddressLineJa(addressLineJa: string): boolean {
    if (addressLineJa.length < 1 || addressLineJa.length > 128) {
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

export function validateCityJa(cityJa: string): boolean {
    if (cityJa.length < 1 || cityJa.length > 64) {
        return false
    }

    const containsLatinCharacters: boolean = hasLatinCharacters(cityJa)

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
    if (float.length < 1) {
        return false
    }

    const isFloatValid: boolean = isFloat(float)

    if (!isFloatValid) {
        return false
    }

    return true
}

export function validateUsername(name: string): boolean {
    if (name.length < 1)
        return false

    // Cannot have white space " "
    if (name.indexOf(' ') >= 0)
        return false

    if (name.length > 32)
        return false

    return true
}

export function validatePassword(password: string): boolean {
    if (password.length < 1)
        return false

    // Cannot have white space " "
    if (password.indexOf(' ') >= 0)
        return false

    // Password must be under 128 characters long
    if (password.length > 128)
        return false

    // Password must contain at a minimum of 12 characters, at least one letter, one number and one special character
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/g.test(password))
        return false

    return true
}

export function validateUserSubmittedLastName(name: string): boolean {
    // The last name cannot be an empty space like " "
    name = name.trim()

    if (name.length > 30 || name === '') {
        return false
    }
    return true
}

export function validateUserSubmittedFirstName(name: string): boolean {
    // The first name is optional and may be an empty string.
    name = name.trim()
    if (name.length > 30 || !name.length) {
        return false
    }
    return true
}

export function validateGoogleMapsUrlInput(url: string): boolean {
    url = url.trim()
    if (url.startsWith('https://www.google.com/maps') || url.startsWith('https://www.google.co.jp/maps')
      || url.startsWith('https://maps.google.com/')) {
        return true
    }
    return false
}

export function validateFirstSpokenLanguage(localeCode: string): boolean {
    if (Object.values<string>(Locale).includes(localeCode) && localeCode !== '') {
        return true
    }
    return false
}

export function validateSecondSpokenLanguage(localeCode: string): boolean {
    // The second spoken language is optional and may be an empty string.
    if (Object.values<string>(Locale).includes(localeCode) || localeCode === '') {
        return true
    }
    return false
}

export function validateNameLocaleMatchesLanguage(
  nameLocale: LocalizedNameInput
): boolean {
    const fullName = nameLocale.lastName
      + (nameLocale.middleName || '')
      + nameLocale.firstName

    switch (nameLocale.locale) {
        case Locale.JaJp:
            return hasJapaneseCharacters(fullName)

        case Locale.EnUs:
            return hasLatinCharacters(fullName)

        default:
            // This defaults to true for now as we need to add for other languages functions
            return true
    }
}
