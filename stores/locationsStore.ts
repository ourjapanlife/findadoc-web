import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { gqlClient } from '../utils/graphql.js'
import { useLoadingStore } from './loadingStore.js'
import type { Facility, FacilitySearchFilters } from '~/typedefs/gqlTypes.js'
import { useTranslation } from '~/composables/useTranslation.js'
import { Region, Prefecture } from '~/typedefs/locationEnums.js'

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
        console.error(useTranslation('locationErrors.facilitiesDropdown'), ` ${JSON.stringify(error)}`)
        // eslint-disable-next-line no-alert
        alert(useTranslation('locationErrors.gettingData'))
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
export const listPrefectureJapanEn: Prefecture[] = [
    Prefecture.Hokkaido, Prefecture.Aomori, Prefecture.Iwate, Prefecture.Miyagi,
    Prefecture.Akita, Prefecture.Yamagata, Prefecture.Fukushima, Prefecture.Ibaraki,
    Prefecture.Tochigi, Prefecture.Gunma, Prefecture.Saitama, Prefecture.Chiba,
    Prefecture.Tokyo, Prefecture.Kanagawa, Prefecture.Niigata, Prefecture.Toyama,
    Prefecture.Ishikawa, Prefecture.Fukui, Prefecture.Yamanashi, Prefecture.Nagano,
    Prefecture.Gifu, Prefecture.Shizuoka, Prefecture.Aichi, Prefecture.Mie,
    Prefecture.Shiga, Prefecture.Kyoto, Prefecture.Osaka, Prefecture.Hyogo,
    Prefecture.Nara, Prefecture.Wakayama, Prefecture.Tottori, Prefecture.Shimane,
    Prefecture.Okayama, Prefecture.Hiroshima, Prefecture.Yamaguchi, Prefecture.Tokushima,
    Prefecture.Kagawa, Prefecture.Ehime, Prefecture.Kochi, Prefecture.Fukuoka,
    Prefecture.Saga, Prefecture.Nagasaki, Prefecture.Kumamoto, Prefecture.Oita,
    Prefecture.Miyazaki, Prefecture.Kagoshima, Prefecture.Okinawa
]

export const prefectureLanguageMatch: Record<Prefecture, { en: string, jp: string }> = {
    [Prefecture.Hokkaido]: { en: 'Hokkaido', jp: '北海道' },
    [Prefecture.Aomori]: { en: 'Aomori', jp: '青森県' },
    [Prefecture.Iwate]: { en: 'Iwate', jp: '岩手県' },
    [Prefecture.Miyagi]: { en: 'Miyagi', jp: '宮城県' },
    [Prefecture.Akita]: { en: 'Akita', jp: '秋田県' },
    [Prefecture.Yamagata]: { en: 'Yamagata', jp: '山形県' },
    [Prefecture.Fukushima]: { en: 'Fukushima', jp: '福島県' },
    [Prefecture.Ibaraki]: { en: 'Ibaraki', jp: '茨城県' },
    [Prefecture.Tochigi]: { en: 'Tochigi', jp: '栃木県' },
    [Prefecture.Gunma]: { en: 'Gunma', jp: '群馬県' },
    [Prefecture.Saitama]: { en: 'Saitama', jp: '埼玉県' },
    [Prefecture.Chiba]: { en: 'Chiba', jp: '千葉県' },
    [Prefecture.Tokyo]: { en: 'Tokyo', jp: '東京都' },
    [Prefecture.Kanagawa]: { en: 'Kanagawa', jp: '神奈川県' },
    [Prefecture.Niigata]: { en: 'Niigata', jp: '新潟県' },
    [Prefecture.Toyama]: { en: 'Toyama', jp: '富山県' },
    [Prefecture.Ishikawa]: { en: 'Ishikawa', jp: '石川県' },
    [Prefecture.Fukui]: { en: 'Fukui', jp: '福井県' },
    [Prefecture.Yamanashi]: { en: 'Yamanashi', jp: '山梨県' },
    [Prefecture.Nagano]: { en: 'Nagano', jp: '長野県' },
    [Prefecture.Gifu]: { en: 'Gifu', jp: '岐阜県' },
    [Prefecture.Shizuoka]: { en: 'Shizuoka', jp: '静岡県' },
    [Prefecture.Aichi]: { en: 'Aichi', jp: '愛知県' },
    [Prefecture.Mie]: { en: 'Mie', jp: '三重県' },
    [Prefecture.Shiga]: { en: 'Shiga', jp: '滋賀県' },
    [Prefecture.Kyoto]: { en: 'Kyoto', jp: '京都府' },
    [Prefecture.Osaka]: { en: 'Osaka', jp: '大阪府' },
    [Prefecture.Hyogo]: { en: 'Hyogo', jp: '兵庫県' },
    [Prefecture.Nara]: { en: 'Nara', jp: '奈良県' },
    [Prefecture.Wakayama]: { en: 'Wakayama', jp: '和歌山県' },
    [Prefecture.Tottori]: { en: 'Tottori', jp: '鳥取県' },
    [Prefecture.Shimane]: { en: 'Shimane', jp: '島根県' },
    [Prefecture.Okayama]: { en: 'Okayama', jp: '岡山県' },
    [Prefecture.Hiroshima]: { en: 'Hiroshima', jp: '広島県' },
    [Prefecture.Yamaguchi]: { en: 'Yamaguchi', jp: '山口県' },
    [Prefecture.Tokushima]: { en: 'Tokushima', jp: '徳島県' },
    [Prefecture.Kagawa]: { en: 'Kagawa', jp: '香川県' },
    [Prefecture.Ehime]: { en: 'Ehime', jp: '愛媛県' },
    [Prefecture.Kochi]: { en: 'Kochi', jp: '高知県' },
    [Prefecture.Fukuoka]: { en: 'Fukuoka', jp: '福岡県' },
    [Prefecture.Saga]: { en: 'Saga', jp: '佐賀県' },
    [Prefecture.Nagasaki]: { en: 'Nagasaki', jp: '長崎県' },
    [Prefecture.Kumamoto]: { en: 'Kumamoto', jp: '熊本県' },
    [Prefecture.Oita]: { en: 'Oita', jp: '大分県' },
    [Prefecture.Miyazaki]: { en: 'Miyazaki', jp: '宮崎県' },
    [Prefecture.Kagoshima]: { en: 'Kagoshima', jp: '鹿児島県' },
    [Prefecture.Okinawa]: { en: 'Okinawa', jp: '沖縄県' }
}
