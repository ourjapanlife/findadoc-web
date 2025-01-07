<template>
    <div class="w-96 my-1">
        <div
            class="flex justify-between items-center rounded-lg p-1 border-2 border-primary"
        >
            <div class="w-16 self-start">
                <SVGProfileIcon
                    role="img"
                    alt="profile icon"
                    title="profile icon"
                    class="profile-icon stroke-primary w-16 h-16 stroke-1 inline mx-1 self-start"
                />
            </div>
            <div v-show="healthcareProfessionalsRelatedToFacility">
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
                v-show="!healthcareProfessionalsRelatedToFacility"
            >
                <div
                    v-for="(nameLocale, index) in healthcareProfessional.names"
                    :key="`${nameLocale.firstName}-${nameLocale.lastName}-${index}`"
                >
                    <div class="flex font-bold pt-2">
                        <span>{{ nameLocale.lastName }}</span>
                        <span class="mx-2">{{ nameLocale.firstName }}</span>
                        <span v-show="nameLocale.middleName">
                            {{ nameLocale.middleName }}
                        </span>
                    </div>
                    <span
                        class="w-24 px-2 py-[1px] mr-1 mb-1 bg-primary-text-muted text-nowrap rounded-full
                    text-sm text-center"
                    >
                        {{ localeStore.formatLanguageCodeToSimpleText(
                            nameLocale.locale) }}
                    </span>
                </div>
            </div>
            <div
                v-if="!isHealthcareProfessionalReadyForRemoval(healthcareProfessional.id)"
                class="flex w-8 items-center justify-center
                    cursor-pointer font-bold text-secondary text-sm self-start p-1"
                @click="() => removeHealthcareProfessional(healthcareProfessional.id)"
            >
                <SVGTrashCan
                    class="flex items-center justify-center w-6 h-6"
                />
            </div>
            <div
                v-if="isHealthcareProfessionalReadyForRemoval(healthcareProfessional.id)"
                class="flex w-8 items-center justify-center
                    cursor-pointer font-bold text-secondary text-sm self-start p-1"
                @click="() => undoRemovalOfHealthcareProfessional(healthcareProfessional.id)"
            >
                <SVGUndoIcon
                    class="flex items-center justify-center w-6 h-6"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SVGTrashCan from '~/assets/icons/trash-can.svg'
import SVGProfileIcon from '~/assets/icons/profile-icon.svg'
import SVGUndoIcon from '~/assets/icons/undo-icon.svg'
import { useLocaleStore } from '~/stores/localeStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { ModerationScreen, useModerationScreenStore } from '~/stores/moderationScreenStore'
import { RelationshipAction, type HealthcareProfessional, type Relationship } from '~/typedefs/gqlTypes'

const localeStore = useLocaleStore()
const facilitiesStore = useFacilitiesStore()
const moderationScreenStore = useModerationScreenStore()
const healthcareProfessionalsStore = useHealthcareProfessionalsStore()

// This checks whether an existing healthcare professional has been added for removal
const isHealthcareProfessionalReadyForRemoval = (id: string) =>
    facilitiesStore.facilitySectionFields.healthProfessionalsRelations
        .find(healthcareProfessionalRelation => healthcareProfessionalRelation.otherEntityId === id
        && healthcareProfessionalRelation.action === RelationshipAction.Delete)

const removeHealthcareProfessional = (id: string) => {
    switch (moderationScreenStore.activeScreen) {
        case ModerationScreen.EditFacility:
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
}

const undoRemovalOfHealthcareProfessional = (id: string) => {
    facilitiesStore.facilitySectionFields.healthProfessionalsRelations
        = facilitiesStore.facilitySectionFields.healthProfessionalsRelations
            .filter((healthcareProfessionalRelation: Relationship) => healthcareProfessionalRelation.otherEntityId !== id)
}

const props = defineProps<{
    healthcareProfessional: HealthcareProfessional
    healthcareProfessionalsRelatedToFacility?: string[]
}>()
</script>
