<template>
        <div class="flex flex-col mt-4">
            <label class="mb-2 text-primary-text text-sm font-bold font-sans">
                {{ label }}
            </label>
            <p v-if="!isTheInputValueValid" class="text-currentColor text-xs font-sans">{{ invalidInputErrorMessage }}</p>
            <input
                @blur="() => checkValidationOfInputField(inputValue)"
                :type='type'
                :placeholder='placeholder'
                :required='required'
                :value="inputValue"
                @input="handleInput"
                class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400 text-neutral-600 text-sm font-normal font-['Noto Sans JP'] placeholder-gray-300"
            />
        </div>
</template>


<script setup lang="ts">
import { defineProps, ref, type Ref } from 'vue'
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

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;
  store.setInputField(props.label, inputValue.value);
};

</script>