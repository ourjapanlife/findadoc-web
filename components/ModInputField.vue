<template>
    <div class="flex flex-col mt-4">
        <label class="mb-2 text-primary-text text-sm font-bold font-sans">
            {{ label }}
        </label>
        <p
            v-if="!isTheInputValueValid"
            class="text-currentColor text-xs font-sans"
        >
            {{ invalidInputErrorMessage }}
        </p>
        <input
            :type="type"
            :placeholder="placeholder"
            :required="required"
            :value="inputValue"
            class="mb-5 px-3 py-3.5 w-96 h-12 bg-white rounded-lg border border-primary-text-muted
            text-primary-text text-sm font-normal font-sans placeholder-primar"
            @blur="() => checkValidationOfInputField(inputValue)"
            @input="handleInput"
        >
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useModerationFormInputStore } from '~/stores/moderationFormInputStore'

const inputValue: Ref<string> = ref('')
const isTheInputValueValid: Ref<boolean> = ref(true)
const props = defineProps<{
    label: string,
    type: string,
    placeholder: string,
    required: boolean,
    invalidInputErrorMessage:string ,
    inputValidationCheck: (inputValue:string) => boolean
    }>()

const store = useModerationFormInputStore()

const checkValidationOfInputField = (inputValue: string) => {
    isTheInputValueValid.value = props.inputValidationCheck(inputValue)
}

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    inputValue.value = target.value
    store.setInputField(props.label, inputValue.value)
}
</script>

</script>
