import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { gqlClient } from '../utils/graphql.js'
import { useLoadingStore } from './loadingStore.js'
import { useLocaleStore } from './localeStore.js'
import { Locale, type Facility, type FacilitySearchFilters, type Query } from '~/typedefs/gqlTypes.js'

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

export const useLocationsStore = defineStore('locationsStore', () => {
    const citiesDisplayOptions: Ref<string[]> = ref([])

    async function fetchLocations() {
        //set the loading visual state
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)
        citiesDisplayOptions.value = ['Loading...']

        //this is the async callback that will be called when the query is done (no async/await)
        const facilitiesSearchResults = await queryFacilities()

        const allCitiesEnglishList = facilitiesSearchResults.map(facility => facility.contact?.address.cityEn)
        const allCitiesJapaneseList = facilitiesSearchResults.map(facility => facility.contact?.address.cityJa)

        const localeStore = useLocaleStore()
        //we want to have an empty display value for dropdowns, so we add an empty string to the list
        citiesDisplayOptions.value = localeStore.locale.code === Locale.EnUs
            ? ['----Any----', ...allCitiesEnglishList]
            : ['----Any----', ...allCitiesJapaneseList]

        //set the loading visual state back to normal
        loadingStore.setIsLoading(false)
    }

    return { citiesDisplayOptions, fetchLocations }
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

        const result = await graphQLClientRequestWithRetry<Query['facilities']>(
            gqlClient.request.bind(gqlClient),
            searchFacilitiesQuery,
            searchFacilitiesData
        )

        return result.data ?? []
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
