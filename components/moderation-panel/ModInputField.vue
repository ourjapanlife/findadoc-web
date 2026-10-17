<template>
    <div class="flex flex-col">
        <label class="field-label">
            {{ label }}
            <span
                v-if="!required"
                class="text-primary-text-muted ml-1 font-normal"
            >
                ({{ t('modInputField.optional') }})
            </span>
        </label>
        <input
            v-model="model"
            :type="type"
            :placeholder="placeholder"
            :required="required"
            :readonly="!isEditing"
            :tabindex="isEditing ? undefined : -1"
            class="mod-input-field field"
            @blur="initialValidationCheck"
        >
        <p
            v-if="invalidInputErrorMessage"
            class="field-error min-h-5"
            :class="isTheInputValueValid ? 'invisible' : ''"
            :role="isTheInputValueValid ? undefined : 'alert'"
        >
            {{ invalidInputErrorMessage }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, watch, nextTick } from 'vue'
import { useI18n } from '#imports'
import { useModerationFormEditing } from '~/composables/useModerationFormMode'

const { t } = useI18n()
const isEditing = useModerationFormEditing()

const isTheInputValueValid: Ref<boolean> = ref(true)
const validationCheckedPreviously: Ref<boolean> = ref(false)

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
    inputValidationCheck: Function
})

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
    }
)
</script>
