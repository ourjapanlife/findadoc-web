<template>
    <div class="border-2 border-primary rounded-lg px-2 my-3 w-fit">
        <div class="w-96">
            <div
                class="flex justify-between items-center p-1"
            >
                <div class="w-16 self-start">
                    <SVGProfileIcon
                        role="img"
                        alt="profile icon"
                        title="profile icon"
                        class="profile-icon stroke-primary w-16 h-16 stroke-1 inline mx-1 self-start"
                    />
                </div>
                <div
                    v-if="healthcareProfessionalsRelatedToFacility"
                    class="min-w-44"
                >
                    <div class="flex flex-col h-full w-64 pl-1 mb-1">
                        <div class="flex font-bold pt-2">
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
                            ID:  {{ healthcareProfessional.id }}
                        </span>
                        <div>
                            <div
                                class="flex flex-wrap justify-start items-start self-end pt-2"
                            >
                                <div
                                    v-for="(spokenLanguage, indexOfLocale)
                                        in healthcareProfessional.spokenLanguages"
                                    :key="`${spokenLanguage}-${indexOfLocale}`"
                                    class="w-24 px-2 py-[1px] mr-1 mb-1 bg-primary-text-muted/30 text-nowrap rounded-full
                                 text-sm text-center"
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
                <div
                    v-if="healthcareProfessionalNameByLocale"
                    class="flex flex-col justify-center items-center min-w-44"
                >
                    <div class="flex font-bold pt-2">
                        <span>{{ healthcareProfessionalNameByLocale.lastName }}</span>
                        <span class="mx-2">{{ healthcareProfessionalNameByLocale.firstName
                        }}</span>
                        <span v-show="healthcareProfessionalNameByLocale.middleName">
                            {{ healthcareProfessionalNameByLocale.middleName }}
                        </span>
                    </div>
                    <span
                        class="w-24 px-2 py-[1px] mr-1 mb-1 bg-primary-text-muted text-nowrap rounded-full
                    text-sm text-center"
                    >
                        {{ localeStore.formatLanguageCodeToSimpleText(
                            healthcareProfessionalNameByLocale.locale) }}
                    </span>
                </div>
                <div
                    v-if="!isHealthcareProfessionalReadyForRemoval(healthcareProfessional.id)
                        && moderationScreenStore.activeScreen === ModerationScreen.EditSubmission"
                    class="flex w-8 items-center justify-center
                    cursor-pointer font-bold text-secondary text-sm self-start p-1"
                    @click="() => removeHealthcareProfessional(healthcareProfessional.id)"
                >
                    <SVGTrashCan
                        class="flex items-center justify-center w-6 h-6"
                    />
                </div>
                <div
                    v-if="isHealthcareProfessionalReadyForRemoval(healthcareProfessional.id)
                        || moderationScreenStore.activeScreen === ModerationScreen.EditSubmission"
                    class="flex w-8 items-center justify-center
                    cursor-pointer font-bold text-secondary text-sm self-start p-1"
                    @click="() => undoRemovalOfHealthcareProfessional(healthcareProfessional.id)"
                >
                    <SVGUndoIcon
                        class="flex items-center justify-center w-6 h-6"
                    />
                </div>
                <div
                    v-if="moderationScreenStore.activeScreen === ModerationScreen.EditHealthcareProfessional"
                    class="flex w-8 items-center justify-center
                cursor-pointer font-bold text-secondary text-sm self-start p-1"
                >
                    <div>
                        <button
                            v-if="!isEditable || chosenLocaleIndex !== 0"
                            type="button"
                            class="flex items-center justify-center w-6 h-6"
                            @click="() => setChangeToEditable()"
                        >
                            <SVGPencilIcon />
                        </button>
                        <button
                            v-if="isEditable && chosenLocaleIndex === 0"
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
import { ModerationScreen, useModerationScreenStore } from '~/stores/moderationScreenStore'
import { RelationshipAction,
    type HealthcareProfessional,
    type LocalizedNameInput,
    type Relationship } from '~/typedefs/gqlTypes'

const localeStore = useLocaleStore()
const facilitiesStore = useFacilitiesStore()
const moderationScreenStore = useModerationScreenStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()

// This checks whether an existing healthcare professional has been added for removal
const isHealthcareProfessionalReadyForRemoval = (id: string) =>
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

const undoRemovalOfHealthcareProfessional = (id: string) => {
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

const props = defineProps<{
    healthcareProfessional: HealthcareProfessional
    healthcareProfessionalsRelatedToFacility?: string[]
    healthcareProfessionalNameByLocale: LocalizedNameInput
    chosenLocaleIndex?: number
    isEditable?: boolean
    setIsEditableFunction?: (param: boolean) => void
}>()
</script>
