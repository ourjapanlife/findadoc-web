<template>
    <div
        v-if="store.isOpen"
        data-testid="modal"
        :class="`fixed top-0 left-0 flex items-center justify-center h-full w-full
        z-10 ${stylingForSelectedHealthcareProfessionalMainPage}`"
    >
        <div
            ref="modal"
            v-close-on-outside-click="hideModalAndEmitClosedEvent"
            class="absolute z-10 bg-primary-bg rounded-xl overflow-hidden
            shadow-lg shadow-primary
            hover:shadow-inner hover:shadow-primary/90"
        >
            <button
                type="button"
                class="close-button absolute right-6 top-5 bg-primary-inverted rounded-lg px-2 py-.5
                    group hover:bg-primary-hover transition-all duration-200"
                @click="hideModalAndEmitClosedEvent"
            >
                <span class="close-icon">
                    <svg
                        class="stroke-primary group-hover:stroke-primary-inverted"
                        width="20"
                        heigh="20"
                        viewBox="4 0 15 25"
                    >
                        <path
                            stroke-width="3"
                            fill="none"
                            d="M6.25,6.25,17.75,17.75"
                        />
                        <path
                            stroke-width="3"
                            fill="none"
                            d="M6.25,17.75,17.75,6.25"
                        />
                    </svg>
                </span>
            </button>
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { vCloseOnOutsideClick } from '~/utils/closeOnOutsideClick'
import { useModalStore } from '~/stores/modalStore'

const modal = ref(null)
const store = useModalStore()
const route = useRoute()

const stylingForSelectedHealthcareProfessionalMainPage = computed(() => route.path === '/'
    ? ''
    : 'bg-secondary bg-opacity-40')

const emit = defineEmits(['modal-closed'])
const hideModalAndEmitClosedEvent = () => {
    emit('modal-closed')
    store.hideModal()
}
</script>
