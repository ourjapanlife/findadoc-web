<template>
    <div class="flex justify-between w-full">
        <div>
            <button
                data-testid="mod-edit-facility-hp-topbar-copy-id"
                class="flex w-90 bg-neutral p-2 m-2 border-2 border-inverted rounded hover"
                @click="copyFacilityOrHPId"
            >
                ID: {{ selectedId }}
                <SVGSuccessCheckMark
                    v-if="showCopySuccessIcon"
                    role="img"
                    title="clipboard copy"
                    class="ml-2 w-6"
                />
                <SVGCopyContent
                    v-if="!showCopySuccessIcon"
                    role="img"
                    title="successful copy"
                    class="ml-2 w-6"
                />
            </button>
        </div>
        <div class="facility-hp-topbar-actions flex justify p-2 font-bold ">
            <button
                type="button"
                :disabled="!unsavedChanges"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="mod-edit-facility-hp-topbar-update"
                @click="updateFacilityOrHealthcareProfessional"
            >
                <span>
                    {{ $t('modEditFacilityOrHPTopbar.update') }}
                </span>
            </button>
            <button
                type="button"
                :disabled="!unsavedChanges"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="mod-edit-facility-hp-topbar-update"
                @click="updateFacilityOrHealthcareProfessionalAndExit"
            >
                <span>
                    {{ $t('modEditFacilityOrHPTopbar.updateAndExit') }}
                </span>
            </button>
            <button
                type="button"
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary border-2 w-28 text-sm mr-2 "
                data-testid="mod-edit-facility-hp-topbar-delete"
            >
                {{
                    $t('modEditFacilityOrHPTopbar.delete') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { type ToastInterface, useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useI18n } from '#imports'
import SVGCopyContent from '~/assets/icons/content-copy.svg'
import SVGSuccessCheckMark from '~/assets/icons/checkmark-square.svg'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import { handleServerErrorMessaging } from '~/utils/handleServerErrorMessaging'
import type { Facility } from '~/typedefs/gqlTypes'

const router = useRouter()

// Initialize the stores in use
const facilitiesStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const moderationScreenStore = useModerationScreenStore()

// Initialize the value of the selected Id based off of Moderation Screen
const selectedId: ComputedRef<string> = computed(() => setSelectedId())
const originalFacilityRefsValue: Ref<Facility | undefined> = ref()

// Disable the buttons if there are no changes
const unsavedChanges = computed(() => facilityHasUnsavedChanges())

// Initialize the variable that will be used to mount the toast library
let toast: ToastInterface

const { t } = useI18n()

const showCopySuccessIcon: Ref<boolean> = ref(false)

const copyFacilityOrHPId = async () => {
    try {
        await navigator.clipboard.writeText(selectedId.value)
        showCopySuccessIcon.value = true
        setTimeout(() => {
            showCopySuccessIcon.value = false
        }, 2000)
    } catch (err: unknown) {
        toast.error(`${t('modEditFacilityOrHPTopbar.copyFailure')} ${selectedId.value}: ${err}`)
        console.error(`Failed to copy ID ${selectedId.value}: ${err}`)
    }
}

function setSelectedId() {
    switch (moderationScreenStore.activeScreen) {
        case ModerationScreen.EditFacility:
            return facilitiesStore.selectedFacilityId
        case ModerationScreen.EditHealthcareProfessional:
            return healthcareProfessionalsStore.selectedHealthcareProfessionalId
        default:
            return ''
    }
}

const facilityHasUnsavedChanges = () => {
    if (!originalFacilityRefsValue.value) return false

    const facilityBeforeChange = originalFacilityRefsValue.value

    /** This needs to be converted because to access the values of this object we do not need value.
    But to keep their reactivity in the store we keep them as Refs **/
    const facilitySections = facilitiesStore.facilitySectionFields as unknown as {
        [key: string]: string
    }

    const areThereUnsavedChanges
        = facilityBeforeChange.nameEn !== facilitySections.nameEn
        || facilityBeforeChange.nameJa !== facilitySections.nameJa
        || facilityBeforeChange.contact.phone !== facilitySections.phone
        || facilityBeforeChange.contact.website !== facilitySections.website
        || facilityBeforeChange.contact.email !== facilitySections.email
        || facilityBeforeChange.contact.address.postalCode !== facilitySections.postalCode
        || facilityBeforeChange.contact.address.prefectureEn !== facilitySections.prefectureEn
        || facilityBeforeChange.contact.address.cityEn !== facilitySections.cityEn
        || facilityBeforeChange.contact.address.addressLine1En !== facilitySections.addressLine1En
        || facilityBeforeChange.contact.address.addressLine2En !== facilitySections.addressLine2En
        || facilityBeforeChange.contact.address.prefectureJa !== facilitySections.prefectureJa
        || facilityBeforeChange.contact.address.cityJa !== facilitySections.cityJa
        || facilityBeforeChange.contact.address.addressLine1Ja !== facilitySections.addressLine1Ja
        || facilityBeforeChange.contact.address.addressLine2Ja !== facilitySections.addressLine2Ja
        || facilityBeforeChange.contact.googleMapsUrl !== facilitySections.googlemapsURL
        || facilityBeforeChange.mapLatitude.toString() !== facilitySections.mapLatitude
        || facilityBeforeChange.mapLongitude.toString() !== facilitySections.mapLongitude
        || JSON.stringify(facilityBeforeChange.healthcareProfessionalIds)
        !== JSON.stringify(facilitySections.healthcareProfessionalIds)
        || facilitySections.healthProfessionalsRelations.length

    return areThereUnsavedChanges
}

const updateFacilityOrHealthcareProfessional = async () => {
    // This makes the on click update the facility if the screen is EditFacility
    if (moderationScreenStore.activeScreen === ModerationScreen.EditFacility) {
        const checkForUnsavedChanges = facilityHasUnsavedChanges()

        // This prevents us from sending a requested unnecessarily if the user has not made changes
        if (!checkForUnsavedChanges) return

        const response = await facilitiesStore.updateFacility()

        if (response.errors?.length) {
            handleServerErrorMessaging(response.errors, toast, t)
            return response
        }

        // This updates the facility section values with the data saved in our db
        facilitiesStore.initializeFacilitySectionValues(response.data as Facility)
        toast.success(t('modEditFacilityOrHPTopbar.facilityUpdatedSuccessfully'))
        return response
    }
}

const updateFacilityOrHealthcareProfessionalAndExit = async () => {
    const response = await updateFacilityOrHealthcareProfessional()

    if (response && response.errors?.length) {
        handleServerErrorMessaging(response.errors, toast, t)
        return response
    }

    router.push('/moderation')
    moderationScreenStore.setActiveScreen(ModerationScreen.Dashboard)
}

onMounted(() => {
    toast = useToast()
})

watch(() => facilitiesStore.selectedFacilityData, newValue => {
    originalFacilityRefsValue.value = newValue
})
</script>
