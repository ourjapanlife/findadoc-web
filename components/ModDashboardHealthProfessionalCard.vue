<template>
    <div class="relative w-96 my-1">
        <div
            class="flex justify-start h-36 items-center rounded-lg p-1 border-2 border-primary"
        >
            <span class="h-24 w-16">
                <SVGProfileIcon
                    role="img"
                    alt="profile icon"
                    title="profile icon"
                    class="profile-icon stroke-primary w-16 h-16 stroke-1 inline mx-1 self-start"
                />
            </span>
            <div v-if="moderationScreenStore.activeScreen === ModerationScreen.EditFacility">
                <div class="flex flex-col h-24 w-64 pl-1 mb-1">
                    <div class="flex font-bold pt-2">
                        <span>{{ healthcareProfessional.names[0].lastName }}</span>
                        <span class="mx-2">{{ healthcareProfessional.names[0].firstName }}</span>
                        <span v-show="healthcareProfessional.names[0].middleName">
                            {{ healthcareProfessional.names[0].middleName }}
                        </span>
                    </div>
                    <span class="text-primary-text-muted">
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
                                class="w-24 px-2 py-[1px] mr-1 mb-1 bg-primary-text-muted text-nowrap rounded-full
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
            <div v-if="moderationScreenStore.activeScreen === ModerationScreen.EditSubmission">
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
            <span
                class="flex items-center justify-center
                    cursor-pointer font-bold text-secondary text-sm absolute top-3 right-3"
                @click="() => removeHealthcareProfessional(healthcareProfessional.id)"
            >
                <SVGTrashCan
                    class="flex items-center justify-center w-6 h-6"
                />
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import SVGTrashCan from '~/assets/icons/trash-can.svg'
import SVGProfileIcon from '~/assets/icons/profile-icon.svg'
import { useLocaleStore } from '~/stores/localeStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { ModerationScreen, useModerationScreenStore } from '~/stores/moderationScreenStore'
import { RelationshipAction, type HealthcareProfessional, type Relationship } from '~/typedefs/gqlTypes'

const localeStore = useLocaleStore()
const facilitiesStore = useFacilitiesStore()
const moderationScreenStore = useModerationScreenStore()

const removeHealthcareProfessional = (id: string) => {
    switch (moderationScreenStore.activeScreen) {
        case ModerationScreen.EditFacility:
            if (props.healthcareProfessionalsRelatedToFacility && props.healthcareProfessionalsRelatedToFacility.includes(id)) {
                facilitiesStore.facilitySectionFields.healthProfessionalsRelations.value
                    .push({ id: id, action: RelationshipAction.Delete })
                return
            }
            facilitiesStore.facilitySectionFields.healthProfessionalsRelations.value
                .filter((healthcareProfessionalRelation: Relationship) => healthcareProfessionalRelation.otherEntityId !== id)
    }
}

const props = defineProps<{
    healthcareProfessional: HealthcareProfessional
    healthcareProfessionalsRelatedToFacility?: string[]
}>()
</script>
