import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

type searchResult = {
    id: string;
    type: string;
    names: {
        lastName: string;
        firstName: string;
        middleName: string;
        locale: string;
    }[];
    location: string;
    degrees: string[];
    spokenLanguages: string[];
    specialties: specialty[];
    acceptedInsuranceOptions: string[];
}

type specialty = {
    id: string;
    names: name[];
}

type name = {
    name: string;
    locale: string;
}

const fakeSearchResultsList : searchResult[] = [
    {
        id: '1',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Ermish',
                firstName: 'Philip',
                middleName: 'Michael',
                locale: 'en'
            },
            {
                lastName: 'アーミッシュ',
                firstName: 'フィリップ',
                middleName: 'マイケル',
                locale: 'ja'
            }
        ],
        location: 'tokyo',
        degrees: ['DOCTOR_OF_PHILOSOPHY'],
        spokenLanguages: ['JAPANESE', 'ENGLISH'],
        specialties: [
            {
                id: '1',
                names: [{ name: 'General Practice', locale: 'en' }, { name: '一般診療', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ]
    },
    {
        id: '2',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Kilzer',
                firstName: 'Ann',
                middleName: '',
                locale: 'en'
            },
            {
                lastName: 'キルザー',
                firstName: '杏',
                middleName: '',
                locale: 'ja'
            }
        ],
        location: 'saitama',
        degrees: ['DOCTOR_OF_PHILOSOPHY'],
        spokenLanguages: ['JAPANESE'],
        specialties: [
            {
                id: '2',
                names: [{ name: 'Internal Medicine', locale: 'en' }, { name: '内科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ]
    },
    {
        id: '3',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Toyoda',
                firstName: 'LaShawn',
                middleName: 'T',
                locale: 'en'
            },
            {
                lastName: '豊田',
                firstName: 'ラシァン',
                middleName: 'ティ',
                locale: 'ja'
            }
        ],
        location: 'tokyo',
        degrees: ['DOCTOR_OF_PHILOSOPHY'],
        spokenLanguages: ['ENGLISH'],
        specialties: [
            {
                id: '3',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ]
    }
]

export const useSearchResultsStore = defineStore('searchResultsStore', () => {
    const activeResultId: Ref<String | undefined> = ref()
    const searchResultsListState: Ref<searchResult[]> = ref(fakeSearchResultsList)

    function search(searchLocation: string, searchSpecialty: string, searchLanguage : string) {
        const healthcareProfessionalsOnly = searchResultsListState.value.filter(resultItem => resultItem.type === 'healthcareprofessional')

        const filteredResults = healthcareProfessionalsOnly.filter(resultItem => {
            const searchLocationExistsAndMatches = (!searchLocation || resultItem.location === searchLocation)
            const searchSpecialtyExistsAndMatches = (!searchSpecialty || resultItem.specialties[0].names[0].name.includes(searchSpecialty))
            const searchLanguageExistsAndMatches = (!searchLanguage || resultItem.spokenLanguages.includes(searchLanguage))

            return searchLocationExistsAndMatches
                && searchSpecialtyExistsAndMatches
                && searchLanguageExistsAndMatches
        })

        searchResultsListState.value = filteredResults
    }

    function setActiveSearchResult(selectedResultId: String) {
        activeResultId.value = searchResultsListState.value.find(resultItem => resultItem.id === selectedResultId)?.id
    }

    function clearActiveSearchResult() {
        activeResultId.value = undefined
    }

    return { search, setActiveSearchResult, clearActiveSearchResult }
})
