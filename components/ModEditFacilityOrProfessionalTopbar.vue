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
                class="flex justify-center items-center rounded-full bg-secondary-bg border-primary-text-muted
                border-2 w-28 text-sm mr-2"
                data-testid="mod-edit-facility-hp-topbar-update"
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
import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'
import { type ToastInterface, useToast } from 'vue-toastification'
import { useI18n } from '#imports'
import SVGCopyContent from '~/assets/icons/content-copy.svg'
import SVGSuccessCheckMark from '~/assets/icons/checkmark-square.svg'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'

// Initialize the stores in use
const facilitiesStore = useFacilitiesStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const moderationScreenStore = useModerationScreenStore()

// Initialize the value of the selected Id based off of Moderation Screen
const selectedId: ComputedRef<string> = computed(() => setSelectedId())

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

onMounted(() => {
    toast = useToast()
})
</script>
