<template>
    <div class="flex flex-col mt-4">
        <label class="mb-2 text-primary-text text-sm font-bold font-sans">
            {{ label }}
            <span
                v-if="!required"
                class="text-primary-text-muted ml-1 font-normal"
            >
                ({{ t('modInputField.optional') }})
            </span>
        </label>
        <p
            v-if="!isTheInputValueValid"
            class="text-error text-xs font-sans"
        >
            {{ invalidInputErrorMessage }}
        </p>
        <input
            v-model="model"
            :type="type"
            :placeholder="placeholder"
            :required="required"
            class="mod-input-field mb-5 px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
            text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
            @blur="initialValidationCheck"
        >
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch, nextTick } from 'vue'
import { useI18n, useHealthcareProfessionalsStore } from '#imports'

const { t } = useI18n()

const hpNamesForUpdating = useHealthcareProfessionalsStore().healthcareProfessionalUpdatedNames

const isTheInputValueValid: Ref<boolean> = ref(true)
const validationCheckedPreviously: Ref<boolean> = ref(false)

const model = defineModel<string>()

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    fieldName: String,
    type: String,
    placeholder: String,
    required: Boolean,
    invalidInputErrorMessage: String,
    inputValidationCheck: Function
})

const name = props.fieldName

const labelsToOnlyValidateOnBlur = [
    t('modSubmissionForm.labelHealthcareProfessionalLastName'),
    t('modSubmissionForm.labelHealthcareProfessionalFirstName'),
    t('modSubmissionForm.labelHealthcareProfessionalMiddleName')]

const initialValidationCheck = async () => {
    if (!labelsToOnlyValidateOnBlur.includes(props.label)) {
        validationCheckedPreviously.value = true
    }
    await nextTick()
    if (props.inputValidationCheck) {
        isTheInputValueValid.value = props.inputValidationCheck(model.value)
    }
}

watch(
    () => model.value,
    () => {
        if (validationCheckedPreviously.value && props.inputValidationCheck) {
            isTheInputValueValid.value = props.inputValidationCheck(model.value)
        }
        if (!hpNamesForUpdating.includes(name)) {
            hpNamesForUpdating.push(name)
        }
        console.log("Names are here: ")
        console.log(hpNamesForUpdating)
    }
)
</script>
