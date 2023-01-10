import { defineStore } from 'pinia'

const defaultState = {
    activeResult: '',
    results: [
        {
            id: '1',
            type: 'healthcareprofessional',
            names: [
                {
                    lastName: 'Ermish',
                    firstName: 'Philip',
                    middleName: 'Michael',
                    locale: 'en',
                },
                {
                    lastName: 'アーミッシュ',
                    firstName: 'フィリップ',
                    middleName: 'マイケル',
                    locale: 'ja',
                },
            ],
            degrees: ['DOCTOR_OF_PHILOSOPHY'],
            spokenLanguages: ['JAPANESE', 'ENGLISH'],
            specialties: [
                {
                    id: '1',
                    names: [{ name: 'General Practice', locale: 'en' }, { name: '一般診療', locale: 'ja' }],
                },
            ],
            acceptedInsuranceOptions: [
                'NATIONAL_HEALTH_INSURANCE',
            ],
        },
        {
            id: '2',
            type: 'healthcareprofessional',
            names: [
                {
                    lastName: 'Kilzer',
                    firstName: 'Ann',
                    middleName: '',
                    locale: 'en',
                },
                {
                    lastName: 'キルザー',
                    firstName: '杏',
                    middleName: '',
                    locale: 'ja',
                },
            ],
            degrees: ['DOCTOR_OF_PHILOSOPHY'],
            spokenLanguages: ['JAPANESE'],
            specialties: [
                {
                    id: '2',
                    names: [{ name: 'Internal Medicine', locale: 'en' }, { name: '内科', locale: 'ja' }],
                },
            ],
            acceptedInsuranceOptions: [
                'NATIONAL_HEALTH_INSURANCE',
            ],
        },
        {
            id: '3',
            type: 'healthcareprofessional',
            names: [
                {
                    lastName: 'Toyoda',
                    firstName: 'LaShawn',
                    middleName: 'T',
                    locale: 'en',
                },
                {
                    lastName: '豊田',
                    firstName: 'ラシァン',
                    middleName: 'ティ',
                    locale: 'ja',
                },
            ],
            degrees: ['DOCTOR_OF_PHILOSOPHY'],
            spokenLanguages: ['ENGLISH'],
            specialties: [
                {
                    id: '3',
                    names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }],
                },
            ],
            acceptedInsuranceOptions: [
                'NATIONAL_HEALTH_INSURANCE',
            ],
        },
    ]
}

export const useResultsStore = defineStore('resultsStore', {
    state: () => Object.assign(defaultState),
    actions: {
        fetchResults() {
            const initialData = defaultState.results

            const filteredResultsByLocation = initialData.filter(location => this.results.location)

            return filteredResultsByLocation
        },
        setActiveResult() {
            this.activeResult = this.results.filter((id: Number) => this.results.id)

            return this.activeResult
        },
        clearActiveResult() {
            this.activeResult = ''
        }
    }
})