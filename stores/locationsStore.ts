import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { gqlClient } from '../utils/graphql.js'
import { useLoadingStore } from './loadingStore.js'
import type { Facility, FacilitySearchFilters } from '~/typedefs/gqlTypes.js'

export const useLocationsStore = defineStore('locationsStore', () => {
    const allCitiesEnglishList = ref<string[]>([])
    const allCitiesJapaneseList = ref<string[]>([])

    async function fetchLocations() {
        //set the loading visual state
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)

        const facilitiesSearchResults = await queryFacilities()

        allCitiesEnglishList.value = facilitiesSearchResults.map(facility => facility.contact?.address.cityEn)
        allCitiesJapaneseList.value = facilitiesSearchResults.map(facility => facility.contact?.address.cityJa)

        //set the loading visual state back to normal
        loadingStore.setIsLoading(false)
    }

    return { allCitiesEnglishList, allCitiesJapaneseList, fetchLocations }
})

async function queryFacilities(): Promise<Facility[]> {
    try {
        const searchFacilitiesData = {
            filters: {
                limit: 1000,
                offset: 0,
                contact: undefined,
                createdDate: undefined,
                healthcareProfessionalIds: undefined,
                healthcareProfessionalName: undefined,
                nameEn: undefined,
                nameJa: undefined,
                orderBy: undefined,
                updatedDate: undefined
            } satisfies FacilitySearchFilters
        }

        const result = await graphQLClientRequestWithRetry<{ facilities: Facility[] }>(
            gqlClient.request.bind(gqlClient),
            searchFacilitiesQuery,
            searchFacilitiesData
        )

        return result.data.facilities ?? []
    } catch (error) {
        console.error(`Error getting facilities for dropdown: ${JSON.stringify(error)}`)
        // eslint-disable-next-line no-alert
        alert('Error getting data! Please contact our support team by clicking the bottom right link on the page!')
        return []
    }
}

const searchFacilitiesQuery = gql`query QueryFacilities($filters: FacilitySearchFilters!) {
    facilities(filters: $filters) {
    id
    contact {
        address {
          cityJa
          cityEn
          }
        }
    }
}
`
export const listPrefectureJapanEn: string[] = [
    'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
    'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
    'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu',
    'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
    'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
    'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki',
    'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
]

export const listPrefectureJapanJa: string[] = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
]

export const prefectureLanguageMatch: Record<string, string> = {
    Hokkaido: '北海道',
    Aomori: '青森県',
    Iwate: '岩手県',
    Miyagi: '宮城県',
    Akita: '秋田県',
    Yamagata: '山形県',
    Fukushima: '福島県',
    Ibaraki: '茨城県',
    Tochigi: '栃木県',
    Gunma: '群馬県',
    Saitama: '埼玉県',
    Chiba: '千葉県',
    Tokyo: '東京都',
    Kanagawa: '神奈川県',
    Niigata: '新潟県',
    Toyama: '富山県',
    Ishikawa: '石川県',
    Fukui: '福井県',
    Yamanashi: '山梨県',
    Nagano: '長野県',
    Gifu: '岐阜県',
    Shizuoka: '静岡県',
    Aichi: '愛知県',
    Mie: '三重県',
    Shiga: '滋賀県',
    Kyoto: '京都府',
    Osaka: '大阪府',
    Hyogo: '兵庫県',
    Nara: '奈良県',
    Wakayama: '和歌山県',
    Tottori: '鳥取県',
    Shimane: '島根県',
    Okayama: '岡山県',
    Hiroshima: '広島県',
    Yamaguchi: '山口県',
    Tokushima: '徳島県',
    Kagawa: '香川県',
    Ehime: '愛媛県',
    Kochi: '高知県',
    Fukuoka: '福岡県',
    Saga: '佐賀県',
    Nagasaki: '長崎県',
    Kumamoto: '熊本県',
    Oita: '大分県',
    Miyazaki: '宮崎県',
    Kagoshima: '鹿児島県',
    Okinawa: '沖縄県'
}
