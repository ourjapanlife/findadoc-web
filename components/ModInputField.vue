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
            v-model="model"
            :type="type"
            :placeholder="placeholder"
            :required="required"
            class="mb-5 px-3 py-3.5 w-96 h-12 bg-white rounded-lg border border-primary-text-muted
            text-primary-text text-sm font-normal font-sans placeholder-primar"
            @blur="() => checkValidationOfInputField(model as string)"
        >
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, defineModel } from 'vue'

const isTheInputValueValid: Ref<boolean> = ref(true)

const model = defineModel<string>()

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    type: String,
    placeholder: String,
    required: Boolean,
    invalidInputErrorMessage: String,
    inputValidationCheck: {
        type: Function,
        required: true
    }
})

const checkValidationOfInputField = (inputValue: string) => {
    isTheInputValueValid.value = props.inputValidationCheck(inputValue)
}
</script>
