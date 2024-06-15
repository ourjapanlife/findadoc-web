import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { Submission } from '~/typedefs/gqlTypes'

type KeysInSubmission = 'createdDate' | 'facility' | 'googleMapsUrl' | 'healthcareProfessionalName' | 'healthcareProfessionals' | 'id'| 'isApproved' | 'isRejected' | 'isUnderReview' | 'notes' | 'spokenLanguages' | 'updatedDate'

export const useModerationFormInputStore = defineStore('moderationFormInputStore', () => {
    // contactFields
    const nameEn: Ref<string> = ref('')
    const nameJp: Ref<string> = ref('')
    const phone: Ref<string> = ref('')
    const website: Ref<string> = ref('')
    const email: Ref<string> = ref('')
    // addressesFields
    const postalCode: Ref<string> = ref('')
    const prefectureEn: Ref<string> = ref('')
    const cityEn: Ref<string> = ref('')
    const addressLine1En: Ref<string> = ref('')
    const addressLine2En: Ref<string> = ref('')
    const prefectureJp: Ref<string> = ref('')
    const cityJp: Ref<string> = ref('')
    const addressLine1Jp: Ref<string> = ref('')
    const addressLine2Jp: Ref<string> = ref('')
    // googleMapsFields
    const googlemapsURL: Ref<string> = ref('')
    const mapLatitude: Ref<string> = ref('')
    const mapLongitude: Ref<string> = ref('')

    const listPrefectureJapanEn: Ref<string[]> = ref(['Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima', 'Ibaraki', 'Tochigi', 'Gumma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa', 'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'])

    const listPrefectureJapanJp: Ref<string[]> = ref(['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'])

    function setInputField(fieldName: string, newValue: string) {
        switch (fieldName) {
            case 'Name En':
                nameEn.value = newValue
                break
            case 'Name Jp':
                nameJp.value = newValue
                break
            case 'Phone':
                phone.value = newValue
                break
            case 'Email':
                email.value = newValue
                break
            case 'Website':
                website.value = newValue
                break
            case 'Postal Code':
                postalCode.value = newValue
                break
            case 'Prefecture En':
                prefectureEn.value = newValue
                break
            case 'City En':
                cityEn.value = newValue
                break
            case 'Address Line 1 En':
                addressLine1En.value = newValue
                break
            case 'Address Line 2 En':
                addressLine2En.value = newValue
                break
            case 'Prefecture Jp':
                prefectureJp.value = newValue
                break
            case 'City Jp':
                cityJp.value = newValue
                break
            case 'Address Line 1 Jp':
                addressLine1Jp.value = newValue
                break
            case 'Address Line 2 Jp':
                addressLine2Jp.value = newValue
                break
            case 'Google maps URL':
                googlemapsURL.value = newValue
                break
            case 'Map latitude':
                mapLatitude.value = newValue
                break
            case 'Map longitude':
                mapLongitude.value = newValue
                break
            default:
                console.log('Could not set field:', fieldName)
        }
    }

    function autofillEditSubmissionForm(submissionData: Submission | undefined) {
        
        for(const key in submissionData) {
            
            if(submissionData.hasOwnProperty(key) && submissionData[key as KeysInSubmission]) {
                switch (key){
                    case 'facility':
                        nameEn.value = submissionData['facility']?.nameEn || ''
                        nameJp.value = submissionData['facility']?.nameJa || ''
                        phone.value = submissionData['facility']?.contact?.phone || ''
                        email.value = submissionData['facility']?.contact?.email || ''
                        website.value = submissionData['facility']?.contact?.website || ''
                        postalCode.value = submissionData['facility']?.contact?.address.postalCode || ''
                        prefectureEn.value = submissionData['facility']?.contact?.address.prefectureEn || ''
                        cityEn.value = submissionData['facility']?.contact?.address.cityEn || ''
                        addressLine1En.value = submissionData['facility']?.contact?.address.addressLine1En || ''
                        addressLine2En.value = submissionData['facility']?.contact?.address.addressLine2En || ''
                        prefectureJp.value = submissionData['facility']?.contact?.address.prefectureJa || ''
                        cityJp.value = submissionData['facility']?.contact?.address.cityJa || ''
                        addressLine1Jp.value = submissionData['facility']?.contact?.address.addressLine1Ja || ''
                        addressLine2Jp.value = submissionData['facility']?.contact?.address.addressLine2Ja || ''
                        break
                    case 'googleMapsUrl':
                        googlemapsURL.value = submissionData['facility']?.contact?.googleMapsUrl || submissionData['googleMapsUrl']
                }
            }
        }
    }


    function resetForm() {
        nameEn.value = ''
        nameJp.value = ''
        phone.value = ''
        website.value = ''
        email.value = ''
        postalCode.value = ''
        prefectureEn.value = ''
        cityEn.value = ''
        addressLine1En.value = ''
        addressLine2En.value = ''
        prefectureJp.value = ''
        cityJp.value = ''
        addressLine1Jp.value = ''
        addressLine2Jp.value = ''
        googlemapsURL.value = ''
        mapLatitude.value = ''
        mapLongitude.value = ''
    }

    return { 
    nameEn, 
    nameJp, 
    phone, 
    website, 
    email, 
    postalCode, 
    prefectureEn, 
    cityEn, 
    addressLine1En, 
    addressLine2En, 
    prefectureJp, 
    cityJp, 
    addressLine1Jp, 
    addressLine2Jp,
    googlemapsURL, 
    mapLatitude,
    mapLongitude,
    listPrefectureJapanEn, 
    listPrefectureJapanJp,
    autofillEditSubmissionForm,
    setInputField,
    resetForm
    }
})
