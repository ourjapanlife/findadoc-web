import { gql, useQuery } from '@apollo/client'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { FacilitySearchFilters } from '~/typedefs/gqlTypes.js'
import { useModalStore } from './modalStore'
import { gqlMutation } from '~/utils/gqlTool.js'

type searchResult = {
    id: string
    type: string
    names: {
        lastName: string
        firstName: string
        middleName: string
        locale: string
    }[]
    facilityName: string
    address: string
    city: string
    hours: string
    website: string
    phone: string
    degrees: string[]
    spokenLanguages: string[]
    specialties: specialty[]
    acceptedInsuranceOptions: string[]
    position: {
        lat: number
        lng: number
    }
}

type specialty = {
    id: string
    names: name[]
}

type name = {
    name: string
    locale: string
}

const fakeSearchResultsList: searchResult[] = [
    {
        id: '1',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Gonzalez',
                firstName: 'Enrique',
                middleName: 'Meechale',
                locale: 'en'
            },
            {
                lastName: 'ゴンザレス',
                firstName: 'エンリケ',
                middleName: 'ミーチャル',
                locale: 'ja'
            }
        ],
        facilityName: 'Tokyo Midtown Clinic',
        address: 'Minato City, Akasaka, 9 7-1 6F Midtown Tower',
        city: 'Tokyo',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OF_REINCARNATION'],
        spokenLanguages: ['JAPANESE', 'ENGLISH'],
        specialties: [
            {
                id: '1',
                names: [{ name: 'General Practice', locale: 'en' }, { name: '一般診療', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.6487025, lng: 139.7075948 }
    },
    {
        id: '2',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Kellingham',
                firstName: 'Bettay',
                middleName: '',
                locale: 'en'
            },
            {
                lastName: 'ケリンガム',
                firstName: 'ベタイ',
                middleName: '',
                locale: 'ja'
            }
        ],
        facilityName: 'Tokyo Home Clinic',
        address: 'Monvert Yotsuya, 102 2 12-2 Wakaba, Shinjuku',
        city: 'Tokyo',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OF_REVITALIZATION'],
        spokenLanguages: ['JAPANESE'],
        specialties: [
            {
                id: '2',
                names: [{ name: 'Internal Medicine', locale: 'en' }, { name: '内科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.6838408, lng: 139.687008 }
    },
    {
        id: '3',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Toyota',
                firstName: 'Kimiko',
                middleName: '',
                locale: 'en'
            },
            {
                lastName: '豊田',
                firstName: 'キミコ',
                middleName: '',
                locale: 'ja'
            }
        ],
        facilityName: 'BEAUTY CLINIC the GINZA',
        address: 'Chuo City, Ginza, 5 10-2 MISS PARIS 11F',
        city: 'Tokyo',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OF_NECROMANCY'],
        spokenLanguages: ['ENGLISH'],
        specialties: [
            {
                id: '3',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.6839852, lng: 139.6249928 }
    },
    {
        id: '4',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Tamada',
                firstName: 'Noriko',
                middleName: 'The',
                locale: 'en'
            },
            {
                lastName: '玉田',
                firstName: 'ノリコ',
                middleName: 'ザ',
                locale: 'ja'
            }
        ],
        facilityName: 'Roppongi Hills clinic',
        address: 'Minato City, Roppongi, 6 10-1, Roppongi Hills Mori Tower',
        city: 'Tokyo',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OF_WIZARDRY'],
        spokenLanguages: ['ENGLISH', 'JAPANESE'],
        specialties: [
            {
                id: '4',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.6554702, lng: 139.7015603 }
    },
    {
        id: '5',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Connor',
                firstName: 'Sarah',
                middleName: 'The',
                locale: 'en'
            },
            {
                lastName: 'コナー',
                firstName: 'サラ',
                middleName: 'ザ',
                locale: 'ja'
            }
        ],
        facilityName: 'Kouhoku Medical Clinic',
        address: '3001-8 Odanacho, Tsuzuki Ward 224-0027',
        city: 'Yokohama',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OF_HOSPITALITY'],
        spokenLanguages: ['ENGLISH', 'JAPANESE', 'SPANISH'],
        specialties: [
            {
                id: '4',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.5217198, lng: 139.5466484 }
    },
    {
        id: '6',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Frongstringen',
                firstName: 'Alexandra',
                middleName: '',
                locale: 'en'
            },
            {
                lastName: 'フロングストリンゲン',
                firstName: 'アレクサンドラ',
                middleName: '',
                locale: 'ja'
            }
        ],
        facilityName: 'Tsunashima Clinic',
        address: '2 Chome-3-2 Tsunashimanishi, Kohoku Ward, 223-0053',
        city: 'Yokohama',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OMG'],
        spokenLanguages: ['ENGLISH', 'FRENCH'],
        specialties: [
            {
                id: '4',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.5357873, lng: 139.6306399 }
    },
    {
        id: '7',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Nguyen',
                firstName: 'Dao',
                middleName: '',
                locale: 'en'
            },
            {
                lastName: 'ウィン',
                firstName: 'ダオ',
                middleName: '',
                locale: 'ja'
            }
        ],
        address: '26-26 Chigasakichuo, Tsuzuki Ward,224-0032',
        facilityName: 'Chikakane Dermatology',
        city: 'Yokohama',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OF_MEDICINE'],
        spokenLanguages: ['ENGLISH'],
        specialties: [
            {
                id: '4',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.5425184, lng: 139.5330629 }
    },
    {
        id: '8',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Anderson',
                firstName: 'Bob',
                middleName: 'The',
                locale: 'en'
            },
            {
                lastName: 'アンダーソン',
                firstName: 'ボブ',
                middleName: 'ザ',
                locale: 'ja'
            }
        ],
        address: '1 Chome-9-3 Kitayamata, Tsuzuki Ward, 224-0021',
        facilityName: 'Aozora Dermatology Clinic',
        city: 'Yokohama',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OF_MEDICINE'],
        spokenLanguages: ['ENGLISH'],
        specialties: [
            {
                id: '4',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.5615985, lng: 139.5544418 }
    },
    {
        id: '9',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Parker',
                firstName: 'Richard',
                middleName: '',
                locale: 'en'
            },
            {
                lastName: 'パーカー',
                firstName: 'リチャード',
                middleName: 'ザ',
                locale: 'ja'
            }
        ],
        address: '3 Chome-11-18 Kitayamata, Tsuzuki Ward, 224-0021',
        facilityName: 'Yoshie Dental Clinic',
        city: 'Yokohama',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OF_MEDICINE'],
        spokenLanguages: ['ENGLISH'],
        specialties: [
            {
                id: '4',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.5616648, lng: 139.5543559 }
    },
    {
        id: '10',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Jackson',
                firstName: 'Herman',
                middleName: '',
                locale: 'en'
            },
            {
                lastName: 'ジャクソン',
                firstName: 'ハーマン',
                middleName: 'ザ',
                locale: 'ja'
            }
        ],
        address: '1168-1 Ichigaocho, Aoba Ward, 225-0024',
        facilityName: 'Umenoki Eye Clinic',
        city: 'Yokohama',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OF_MEDICINE'],
        spokenLanguages: ['ENGLISH'],
        specialties: [
            {
                id: '4',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.549666, lng: 139.5019132 }
    },
    {
        id: '11',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Nakamura',
                firstName: 'Ayaka',
                middleName: '',
                locale: 'en'
            },
            {
                lastName: '中村',
                firstName: 'アヤカ',
                middleName: '',
                locale: 'ja'
            }
        ],
        address: 'Nishi Ward, Central, 1 27-13 2F, 220-0051',
        facilityName: 'Yoshimura Ear, Nose and Throat Clinic',
        city: 'Yokohama',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '03-5413-7377',
        degrees: ['DOCTOR_OF_MEDICINE'],
        spokenLanguages: ['ENGLISH'],
        specialties: [
            {
                id: '4',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            },
            {
                id: '5',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            },
            {
                id: '6',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.5169205, lng: 139.5455899 }
    },
    {
        id: '12',
        type: 'healthcareprofessional',
        names: [
            {
                lastName: 'Yamamoto',
                firstName: 'Kirito',
                middleName: '',
                locale: 'en'
            },
            {
                lastName: '山本',
                firstName: 'キリト',
                middleName: '',
                locale: 'ja'
            }
        ],
        address: 'Naka Ward, Onoecho, 5-76, 231-0015 ',
        facilityName: 'Amemiya Clinic',
        city: 'Yokohama',
        hours: 'Mon-Fri 9:00-17:00',
        website: 'https://www.tokyo-midtown.com/jp/medical/',
        phone: '222-222-2222',
        degrees: ['DOCTOR_OF_MEDICINE'],
        spokenLanguages: ['ENGLISH'],
        specialties: [
            {
                id: '4',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            },
            {
                id: '5',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            },
            {
                id: '6',
                names: [{ name: 'Pediatrics', locale: 'en' }, { name: '小児科', locale: 'ja' }]
            }
        ],
        acceptedInsuranceOptions: [
            'NATIONAL_HEALTH_INSURANCE'
        ],
        position: { lat: 35.4378991, lng: 139.5564294 }
    }
]

export const useSearchResultsStore = defineStore('searchResultsStore', () => {
    const activeResultId: Ref<String | undefined> = ref()
    const activeResult: Ref<searchResult | undefined> = ref()
    const searchResultsList: Ref<searchResult[]> = ref(fakeSearchResultsList)

    function search(searchLocation: string, searchSpecialty: string, searchLanguage: string) {
        const searchFacilitiesRequest = {
            query: searchFacilitiesQuery,
            variables: {
                input: {
                    filters: {
                        limit: 10,
                        offset: 1
                    } satisfies FacilitySearchFilters
                }
            }
        }

        const { loading, error, data } = useQuery(searchFacilitiesRequest)

        if (loading) {
            return 'Loading...'
        };
        if (error) {
            return `Error! ${error.message}`
        }

        const healthcareProfessionalsOnly = fakeSearchResultsList.filter(resultItem => resultItem.type === 'healthcareprofessional')

        const filteredResults = healthcareProfessionalsOnly.filter(resultItem => {
            const searchLocationExistsAndMatches = (!searchLocation || resultItem.city === searchLocation)
            const searchSpecialtyExistsAndMatches = (!searchSpecialty || resultItem.specialties[0].names[0].name.includes(searchSpecialty))
            const searchLanguageExistsAndMatches = (!searchLanguage || resultItem.spokenLanguages.includes(searchLanguage.toUpperCase()))

            return searchLocationExistsAndMatches
                && searchSpecialtyExistsAndMatches
                && searchLanguageExistsAndMatches
        })

        searchResultsList.value = filteredResults
    }

    function setActiveSearchResult(selectedResultId: String) {
        const newResult = searchResultsList.value.find(resultItem => resultItem.id === selectedResultId)

        activeResult.value = newResult
        activeResultId.value = newResult?.id

        //show the search result details in a modal
        useModalStore().showModal()
    }

    function clearActiveSearchResult() {
        activeResultId.value = undefined
    }

    return { activeResultId, activeResult, searchResultsList, search, setActiveSearchResult, clearActiveSearchResult }
})


const searchFacilitiesQuery = gql`
    query QueryFacilities($filters: FacilitySearchFilters!) {
        facilities(filters: $filters) {
        id
        nameEn
        nameJa
        healthcareProfessionalIds
        contact {
            address {
            addressLine1En
            addressLine2En
            addressLine1Ja
            cityJa
            cityEn
            }
            email
            googleMapsUrl
            phone
            website
        }
        }
    }
`
