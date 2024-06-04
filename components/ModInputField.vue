<template>
        <div class="flex flex-col mt-4">
            <label class="mb-2 text-zinc-900 text-sm font-bold font-['Noto Sans JP']">
                {{ label }}
            </label>
            <p v-if="!isTheInputValueValid" class="text-currentColor text-xs font-['Noto Sans JP']">{{ invalidInputErrorMessage }}</p>
            <input
                @blur="() => checkValidationOfInputField(inputValue)"
                :type='type'
                :placeholder='placeholder'
                :required='required'
                :value="inputValue"
                @input="event => {
                    inputValue = event.target.value
                    store.setInputField(label, inputValue)
                }"
                class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400 text-neutral-600 text-sm font-normal font-['Noto Sans JP'] placeholder-gray-300"
            />
        </div>
</template>


<script setup lang="ts">
import { defineProps, ref, Ref } from 'vue'
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

const checkValidationOfInputField =(inputValue:string) => {
    isTheInputValueValid.value = props.inputValidationCheck(inputValue)
}

</script>