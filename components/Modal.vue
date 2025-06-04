<template>
    <div
        v-if="store.isOpen && !isSideModal"
        data-testid="modal"
        class="fixed top-0 left-0 flex items-center justify-center h-full w-full z-10 bg-secondary bg-opacity-40"
    >
        <ModalContents>
            <slot />
        </ModalContents>
    </div>
    <ModalContents
        v-if="store.isOpen && isSideModal"
        :class="isSideModalMobileView ? 'h-full w-full' : 'h-[92%] m-3'"
    >
        <slot />
    </ModalContents>
</template>

<script lang="ts" setup>
import { useModalStore } from '~/stores/modalStore'

interface Props {
    isSideModal?: boolean
    isSideModalMobileView?: boolean
}

const { isSideModal = false, isSideModalMobileView = false } = defineProps<Props>()

const store = useModalStore()
</script>
