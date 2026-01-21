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
export const prefecturesEnum: Prefecture[] = [
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

export const prefectureDisplayName: Record<Prefecture, { en: string, ja: string }> = {
    [Prefecture.Hokkaido]: { en: 'Hokkaido', ja: '北海道' },
    [Prefecture.Aomori]: { en: 'Aomori', ja: '青森県' },
    [Prefecture.Iwate]: { en: 'Iwate', ja: '岩手県' },
    [Prefecture.Miyagi]: { en: 'Miyagi', ja: '宮城県' },
    [Prefecture.Akita]: { en: 'Akita', ja: '秋田県' },
    [Prefecture.Yamagata]: { en: 'Yamagata', ja: '山形県' },
    [Prefecture.Fukushima]: { en: 'Fukushima', ja: '福島県' },
    [Prefecture.Ibaraki]: { en: 'Ibaraki', ja: '茨城県' },
    [Prefecture.Tochigi]: { en: 'Tochigi', ja: '栃木県' },
    [Prefecture.Gunma]: { en: 'Gunma', ja: '群馬県' },
    [Prefecture.Saitama]: { en: 'Saitama', ja: '埼玉県' },
    [Prefecture.Chiba]: { en: 'Chiba', ja: '千葉県' },
    [Prefecture.Tokyo]: { en: 'Tokyo', ja: '東京都' },
    [Prefecture.Kanagawa]: { en: 'Kanagawa', ja: '神奈川県' },
    [Prefecture.Niigata]: { en: 'Niigata', ja: '新潟県' },
    [Prefecture.Toyama]: { en: 'Toyama', ja: '富山県' },
    [Prefecture.Ishikawa]: { en: 'Ishikawa', ja: '石川県' },
    [Prefecture.Fukui]: { en: 'Fukui', ja: '福井県' },
    [Prefecture.Yamanashi]: { en: 'Yamanashi', ja: '山梨県' },
    [Prefecture.Nagano]: { en: 'Nagano', ja: '長野県' },
    [Prefecture.Gifu]: { en: 'Gifu', ja: '岐阜県' },
    [Prefecture.Shizuoka]: { en: 'Shizuoka', ja: '静岡県' },
    [Prefecture.Aichi]: { en: 'Aichi', ja: '愛知県' },
    [Prefecture.Mie]: { en: 'Mie', ja: '三重県' },
    [Prefecture.Shiga]: { en: 'Shiga', ja: '滋賀県' },
    [Prefecture.Kyoto]: { en: 'Kyoto', ja: '京都府' },
    [Prefecture.Osaka]: { en: 'Osaka', ja: '大阪府' },
    [Prefecture.Hyogo]: { en: 'Hyogo', ja: '兵庫県' },
    [Prefecture.Nara]: { en: 'Nara', ja: '奈良県' },
    [Prefecture.Wakayama]: { en: 'Wakayama', ja: '和歌山県' },
    [Prefecture.Tottori]: { en: 'Tottori', ja: '鳥取県' },
    [Prefecture.Shimane]: { en: 'Shimane', ja: '島根県' },
    [Prefecture.Okayama]: { en: 'Okayama', ja: '岡山県' },
    [Prefecture.Hiroshima]: { en: 'Hiroshima', ja: '広島県' },
    [Prefecture.Yamaguchi]: { en: 'Yamaguchi', ja: '山口県' },
    [Prefecture.Tokushima]: { en: 'Tokushima', ja: '徳島県' },
    [Prefecture.Kagawa]: { en: 'Kagawa', ja: '香川県' },
    [Prefecture.Ehime]: { en: 'Ehime', ja: '愛媛県' },
    [Prefecture.Kochi]: { en: 'Kochi', ja: '高知県' },
    [Prefecture.Fukuoka]: { en: 'Fukuoka', ja: '福岡県' },
    [Prefecture.Saga]: { en: 'Saga', ja: '佐賀県' },
    [Prefecture.Nagasaki]: { en: 'Nagasaki', ja: '長崎県' },
    [Prefecture.Kumamoto]: { en: 'Kumamoto', ja: '熊本県' },
    [Prefecture.Oita]: { en: 'Oita', ja: '大分県' },
    [Prefecture.Miyazaki]: { en: 'Miyazaki', ja: '宮崎県' },
    [Prefecture.Kagoshima]: { en: 'Kagoshima', ja: '鹿児島県' },
    [Prefecture.Okinawa]: { en: 'Okinawa', ja: '沖縄県' }
}
