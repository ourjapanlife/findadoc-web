import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLoadingStore } from './loadingStore.js'
import { fetchCities } from '~/utils/cityOptions'

export const useLocationsStore = defineStore('locationsStore', () => {
    const allCitiesEnglishList = ref<string[]>([])
    const allCitiesJapaneseList = ref<string[]>([])

    async function fetchLocations() {
        const loadingStore = useLoadingStore()
        loadingStore.setIsLoading(true)

        try {
            const cities = await fetchCities()
            allCitiesEnglishList.value = cities.map(city => city.nameEn)
            allCitiesJapaneseList.value = cities.map(city => city.nameJa)
        } catch (error) {
            console.error('Loading cities failed', error)
            allCitiesEnglishList.value = []
            allCitiesJapaneseList.value = []
        } finally {
            loadingStore.setIsLoading(false)
        }
    }

    return { allCitiesEnglishList, allCitiesJapaneseList, fetchLocations }
})

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
    hokkaido: '北海道',
    aomori: '青森県',
    iwate: '岩手県',
    miyagi: '宮城県',
    akita: '秋田県',
    yamagata: '山形県',
    fukushima: '福島県',
    ibaraki: '茨城県',
    tochigi: '栃木県',
    gunma: '群馬県',
    saitama: '埼玉県',
    chiba: '千葉県',
    tokyo: '東京都',
    kanagawa: '神奈川県',
    niigata: '新潟県',
    toyama: '富山県',
    ishikawa: '石川県',
    fukui: '福井県',
    yamanashi: '山梨県',
    nagano: '長野県',
    gifu: '岐阜県',
    shizuoka: '静岡県',
    aichi: '愛知県',
    mie: '三重県',
    shiga: '滋賀県',
    kyoto: '京都府',
    osaka: '大阪府',
    hyogo: '兵庫県',
    nara: '奈良県',
    wakayama: '和歌山県',
    tottori: '鳥取県',
    shimane: '島根県',
    okayama: '岡山県',
    hiroshima: '広島県',
    yamaguchi: '山口県',
    tokushima: '徳島県',
    kagawa: '香川県',
    ehime: '愛媛県',
    kochi: '高知県',
    fukuoka: '福岡県',
    saga: '佐賀県',
    nagasaki: '長崎県',
    kumamoto: '熊本県',
    oita: '大分県',
    miyazaki: '宮崎県',
    kagoshima: '鹿児島県',
    okinawa: '沖縄県'
}

export function pairedPrefectureJa(prefectureEn: string): string {
    return prefectureLanguageMatch[prefectureEn.trim().toLowerCase()] ?? ''
}

export function pairedPrefectureEn(prefectureJa: string): string {
    const englishKey = Object.entries(prefectureLanguageMatch)
        .find(([, nameJa]) => nameJa === prefectureJa.trim())?.[0]
    if (!englishKey) return ''
    return listPrefectureJapanEn.find(name => name.toLowerCase() === englishKey) ?? ''
}
