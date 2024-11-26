import { faker } from '@faker-js/faker'
import { Locale, Degree, Insurance, Specialty } from '~/typedefs/client/graphql'

export type Quantity = number | { min: number, max: number } | undefined

export interface Options {
    count?: Quantity
}

const getLocales = (quantity: Quantity = { min: 1, max: 2 }): Locale[] => {
    const locales = Object.values(Locale)
    return faker.helpers.arrayElements(locales, quantity)
}

const getDegrees = (quantity: Quantity = { min: 1, max: 3 }): Degree[] => {
    const degrees = Object.values(Degree)
    return faker.helpers.arrayElements(degrees, quantity)
}

const getInsurances = (quantity: Quantity = { min: 1, max: 3 }): Insurance[] => {
    const insurances = Object.values(Insurance)
    return faker.helpers.arrayElements(insurances, quantity)
}

const getSpecialties = (quantity: Quantity = { min: 1, max: 3 }): Specialty[] => {
    const specialties = Object.values(Specialty)
    return faker.helpers.arrayElements(specialties, quantity)
}

const generateId = () => faker.string.ulid()

export default {
    getLocales,
    getDegrees,
    getInsurances,
    getSpecialties,
    generateId
}
