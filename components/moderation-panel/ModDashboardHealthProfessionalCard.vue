<template>
    <div
        :class="[
            'mod-dashboard-healthcare-professional-card',
            'flex items-center justify-center',
            'border-2 border-primary',
            'rounded-lg p-2 h-32 w-fit',
            (isEditable && chosenLocaleIndex === 0)
                ? 'border-t-0 mt-0 rounded-t-none'
                : 'my-3',
        ]"
    >
        <div class="w-96">
            <div class="flex justify-between items-center p-1">
                <div class="w-16 self-start">
                    <SVGProfileIcon
                        role="img"
                        alt="profile icon"
                        title="profile icon"
                        class="profile-icon stroke-primary w-16 h-16 stroke-1 inline mx-1 self-start"
                    />
                </div>
                <div
                    v-if="healthcareProfessionalsRelatedToFacility && healthcareProfessional"
                    class="min-w-44"
                >
                    <div class="flex flex-col h-full w-64 pl-1 mb-1">
                        <div
                            id="healthcare-professional-related-to-facility-name-display-container"
                            class="flex font-bold pt-2"
                        >
                            <span>{{ healthcareProfessionalsStore
                                .displayChosenLocaleForHealthcareProfessional(healthcareProfessional).lastName }}</span>
                            <span class="mx-2">
                                {{ healthcareProfessionalsStore
                                    .displayChosenLocaleForHealthcareProfessional(healthcareProfessional).firstName }}
                            </span>
                            <span
                                v-show="healthcareProfessionalsStore
                                    .displayChosenLocaleForHealthcareProfessional(healthcareProfessional).middleName"
                            >
                                {{ healthcareProfessionalsStore
                                    .displayChosenLocaleForHealthcareProfessional(healthcareProfessional).middleName }}
                            </span>
                        </div>
                        <span>
                            ID: {{ healthcareProfessional.id }}
                        </span>
                        <div>
                            <div
                                id="healthcare-professional-related-to-facility-formatted-locale-spoken"
                                class="flex flex-wrap justify-start items-start self-end pt-2"
                            >
                                <div class="flex flex-col">
                                    <label class="font-semibold">
                                        {{ t('modDashboardHealthcareProfessionalCard.spokenLanguages') }}</label>
                                    <div class="flex">
                                        <div
                                            v-for="(spokenLanguage, indexOfLocale)
                                                in healthcareProfessional.spokenLanguages"
                                            :key="`${spokenLanguage}-${indexOfLocale}`"
                                            class="healthcare-professional-related-to-facility-formatted-spoken-language
                                    w-24 px-2 py-px mr-1 mb-1 bg-primary-text-muted/30
                                    text-nowrap rounded-full text-sm text-center"
                                        >
                                            <span>
                                                {{ localeStore.formatLanguageCodeToSimpleText(
                                                    spokenLanguage) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="healthcareProfessionalNameByLocale"
                    id="healthcare-professional-name-by-locale-container"
                    class="flex flex-col justify-center items-center min-w-44"
                >
                    <div
                        id="healthcare-professional-name-display-container"
                        class="flex pt-2"
                    >
                        <div class="flex flex-col mx-2">
                            <label class="font-semibold text-nowrap">
                                {{ t('modDashboardHealthcareProfessionalCard.lastName') }}</label>
                            <span
                                data-testid="healthcare-professional-card-last-name"
                            >
                                {{ healthcareProfessionalNameByLocale.lastName }}</span>
                        </div>
                        <div class="flex flex-col mr-2">
                            <label class="font-semibold text-nowrap">
                                {{ t('modDashboardHealthcareProfessionalCard.firstName') }}</label>
                            <span>{{ healthcareProfessionalNameByLocale.firstName
                            }}</span>
                        </div>
                        <div class="flex flex-col mr-2">
                            <label class="font-semibold text-nowrap">
                                {{ t('modDashboardHealthcareProfessionalCard.middleName') }}</label>
                            <span v-show="healthcareProfessionalNameByLocale.middleName">
                                {{ healthcareProfessionalNameByLocale.middleName }}
                            </span>
                        </div>
                    </div>
                    <div class="flex self-start mr-2 my-2">
                        <label class="font-semibold mx-2">{{ t('modDashboardHealthcareProfessionalCard.nameLocale') }}:</label>
                        <span
                            id="healthcare-professional-name-locale"
                            class="w-24"
                            data-testid="healthcare-professional-name-card-locale"
                        >
                            {{ localeStore.formatLanguageCodeToSimpleText(
                                healthcareProfessionalNameByLocale.locale) }}
                        </span>
                    </div>
                </div>
                <div
                    v-if="isEditOrCreateFacility
                        && !isHealthcareProfessionalReadyForRemoval(healthcareProfessional?.id)"
                    id="remove-related-healthcare-professional-to-facility"
                    class="flex w-8 items-center justify-center
                    cursor-pointer font-bold text-secondary text-sm self-start p-1"
                    @click="() => removeHealthcareProfessional(healthcareProfessional?.id)"
                >
                    <SVGTrashCan
                        v-show="showTrashCan"
                        class="flex items-center justify-center w-6 h-6"
                    />
                </div>
                <div
                    v-if="isEditOrCreateFacility
                        && isHealthcareProfessionalReadyForRemoval(healthcareProfessional?.id)"
                    id="undo-remove-related-healthcare-professional-to-facility"
                    class="flex w-8 items-center justify-center
                    cursor-pointer font-bold text-secondary text-sm self-start p-1"
                    @click="() => undoRemovalOfHealthcareProfessional(healthcareProfessional?.id)"
                >
                    <SVGUndoIcon class="flex items-center justify-center w-6 h-6" />
                </div>
                <div
                    v-if="isEditOrCreateHealthcareProfessional || isEditSubmission"
                    class="flex w-8 items-center justify-center
                cursor-pointer font-bold text-secondary text-sm self-start p-1"
                >
                    <div id="edit-healthcare-professional-button-container">
                        <!-- If the chosen index is not 0 we want them to be able to click the pencil to reorder
                         the locale names to edit that specific name  -->
                        <button
                            v-if="!isEditable || chosenLocaleIndex !== 0"
                            id="edit-healthcare-professional-professional-locale-name"
                            type="button"
                            class="flex items-center justify-center w-6 h-6"
                            @click="() => setChangeToEditable()"
                        >
                            <SVGPencilIcon />
                        </button>
                        <!-- If the chosen index is 0 that is the current locale name chosen being edited  -->
                        <button
                            v-if="isEditable && chosenLocaleIndex === 0"
                            id="close-edit-healthcare-professional-locale-name"
                            class="flex items-center justify-center w-6 h-6"
                            type="button"
                            @click="() => setToUneditable()"
                        >
                            <SVGXCloseIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SVGTrashCan from '~/assets/icons/trash-can.svg'
import SVGProfileIcon from '~/assets/icons/profile-icon.svg'
import SVGUndoIcon from '~/assets/icons/undo-icon.svg'
import SVGPencilIcon from '~/assets/icons/pencil-edit.svg'
import SVGXCloseIcon from '~/assets/icons/x-close-symbol.svg'
import { useLocaleStore } from '~/stores/localeStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'
import {
    RelationshipAction,
    type HealthcareProfessional,
    type LocalizedNameInput,
    type Relationship
} from '~/typedefs/gqlTypes'

const { t } = useI18n()

const localeStore = useLocaleStore()
const facilitiesStore = useFacilitiesStore()
const moderationScreenStore = useModerationScreenStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()

// This checks whether an existing healthcare professional has been added for removal
const isHealthcareProfessionalReadyForRemoval = (id: string = '0') =>
    facilitiesStore.facilitySectionFields.healthProfessionalsRelations
        .find(healthcareProfessionalRelation => healthcareProfessionalRelation.otherEntityId === id
          && healthcareProfessionalRelation.action === RelationshipAction.Delete)

const removeHealthcareProfessional = (id: string = '0') => {
    if (props.healthcareProfessionalsRelatedToFacility && props.healthcareProfessionalsRelatedToFacility.includes(id)) {
        facilitiesStore.facilitySectionFields.healthProfessionalsRelations
            .push({ otherEntityId: id, action: RelationshipAction.Delete })
        return
    }
    facilitiesStore.facilitySectionFields.healthProfessionalsRelations
        = facilitiesStore.facilitySectionFields.healthProfessionalsRelations
            .filter((healthcareProfessionalRelation: Relationship) => healthcareProfessionalRelation.otherEntityId !== id)
    facilitiesStore.healthProfessionalsRelationsForDisplay
        = facilitiesStore.healthProfessionalsRelationsForDisplay
            .filter(healthcareProfessional => healthcareProfessional.id !== id)
}

const undoRemovalOfHealthcareProfessional = (id: string = '0') => {
    facilitiesStore.facilitySectionFields.healthProfessionalsRelations
        = facilitiesStore.facilitySectionFields.healthProfessionalsRelations
            .filter((healthcareProfessionalRelation: Relationship) => healthcareProfessionalRelation.otherEntityId !== id)
}
// This changes the component details to editable with an optional parameter to use in the callback function
const setChangeToEditable = () => {
    if (props.setIsEditableFunction) props.setIsEditableFunction(true)
}

// This changes the component to not editable and does not save the changes
const setToUneditable = () => {
    if (props.setIsEditableFunction) props.setIsEditableFunction(false)
}

const props = withDefaults(defineProps<{
    // The healthcare professional is not created yet if modEditSubmissionForm
    healthcareProfessional?: HealthcareProfessional
    healthcareProfessionalsRelatedToFacility?: string[]
    healthcareProfessionalNameByLocale?: LocalizedNameInput
    /* chosenLocaleIndex checks where in the array the locale name is. If it is 0 it is the one being edited.
    If not it is not being edited we want to display the pencil so it can be changed to be the locale name
    being edited */
    chosenLocaleIndex?: number
    isEditable?: boolean
    setIsEditableFunction?: (param: boolean) => void
    // This is so you can hide the trash can icon in case you just want to display the information of the healthcare professional
    showTrashCan?: boolean
}>(),
                           {
                               showTrashCan: true // This defaults the trash can to being true
                           })

const isEditOrCreateHealthcareProfessional = computed(() => moderationScreenStore.editHealthcareProfessionalScreenIsActive()
  || moderationScreenStore.createHealthcareProfessionalScreenIsActive())
const isEditOrCreateFacility = computed(() => moderationScreenStore.editFacilityScreenIsActive()
  || moderationScreenStore.createFacilityScreenIsActive())
const isEditSubmission = computed(() => moderationScreenStore.editSubmissionScreenIsActive())
</script>
