<template>
    <div>
        <span class="mb-3.5 text-center text-primary-text text-2xl font-bold font-sans leading-normal">
            {{ $t('modSubmissionForm.healthcareProfessionalId') }}
        </span>
        <div class="flex flex-col mt-4">
            <div class="justify-start items-start flex">
                <input
                    v-model="searchValue"
                    type="text"
                    :placeholder="$t('modSubmissionForm.placeholderTextHealthcareProfessionalSearchbar')"
                    class="px-3 py-3.5 w-96 h-12 bg-secondary-bg rounded-lg border border-primary-text-muted
                    text-primary-text text-sm font-normal font-sans placeholder-primary-text-muted"
                    @input="searchHealthcareProfessionalByIdOrName"
                >
                <SVGLookingGlass
                    role="img"
                    title="searching icon"
                    class="relative right-8 top-3 w-6 h-6"
                />
            </div>
            <div class="relative">
                <div
                    v-show="healthcareProfessionalByIdOrName.length"
                    class="absolute z-30"
                >
                    <div
                        v-for="(healthcareProfessional, index) in healthcareProfessionalByIdOrName"
                        :key="`${healthcareProfessional.id}-${healthcareProfessional.createdDate}-${index}`"
                        :class="[
                            'w-96 border-b border-primary-gray-bg p-4',
                            index === healthcareProfessionalByIdOrName.length - 1 ? 'rounded-b-lg' : '',
                        ]"
                        class="bg-white shadow-md  hover:bg-currentColor"
                    >
                        <div
                            class="cursor-pointer"
                            @click="() => addHealthcareProfessional(healthcareProfessional.id)"
                        >
                            <div class="font-bold">
                                <span
                                    class="mr-1"
                                >
                                    {{ healthcareProfessionalsStore
                                        .displayChosenLocaleForHealthcareProfessional(healthcareProfessional).lastName }}
                                </span>
                                <span
                                    v-show="healthcareProfessionalsStore
                                        .displayChosenLocaleForHealthcareProfessional(healthcareProfessional).middleName"
                                    class="mr-1"
                                >
                                    {{ healthcareProfessionalsStore
                                        .displayChosenLocaleForHealthcareProfessional(healthcareProfessional).middleName }}
                                </span>
                                <span>
                                    {{ healthcareProfessionalsStore
                                        .displayChosenLocaleForHealthcareProfessional(healthcareProfessional).firstName }}
                                </span>
                            </div>
                            <span>
                                ID: {{ healthcareProfessional.id }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, type Ref } from 'vue'
import SVGLookingGlass from '~/assets/icons/looking-glass.svg'
import { RelationshipAction, type HealthcareProfessional } from '~/typedefs/gqlTypes'
import { useHealthcareProfessionalsStore } from '~/stores/healthcareProfessionalsStore'
import { useFacilitiesStore } from '~/stores/facilitiesStore'
import { useModerationScreenStore } from '~/stores/moderationScreenStore'

const healthcareProfessionalsStore = useHealthcareProfessionalsStore()
const moderationScreenStore = useModerationScreenStore()
const facilitiesStore = useFacilitiesStore()

const searchValue: Ref<string> = ref('')
// `healthcareProfessionalById` will be used in the UI component in an upcoming PR
const healthcareProfessionalByIdOrName: Ref<HealthcareProfessional[] | []> = ref([])

const addHealthcareProfessional = (id: string) => {
    if (moderationScreenStore.editFacilityScreenIsActive()
      || moderationScreenStore.createFacilityScreenIsActive()) {
        //Check if the healthcareProfessional has already been added
        const foundProfessionalAlreadyPartOfFacility
        = facilitiesStore.facilitySectionFields.healthProfessionalsRelations
            .find(relation => relation.otherEntityId === id)
            || facilitiesStore.facilitySectionFields.healthcareProfessionalIds.includes(id)

        // Return out of the function if already added
        if (foundProfessionalAlreadyPartOfFacility) return

        // Add a relationship to the facility with selected healthcare professional
        facilitiesStore.facilitySectionFields.healthProfessionalsRelations.push({
            action: RelationshipAction.Create,
            otherEntityId: id
        })

        // Find the healthcare professional by ID
        const foundProfessional = healthcareProfessionalsStore.healthcareProfessionalsData
            .find(healthcareProfessional => healthcareProfessional.id === id)

        // Only push to healthProfessionalsRelationsForDisplay if the professional exists
        if (foundProfessional) {
            facilitiesStore.healthProfessionalsRelationsForDisplay.push(foundProfessional)
            searchValue.value = ''
            healthcareProfessionalByIdOrName.value = []
        }
    }
}

function searchHealthcareProfessionalByIdOrName() {
    if (!searchValue.value || searchValue.value.trim().length < 1) {
        return healthcareProfessionalByIdOrName.value = []
    }

    //Search for Ids or names of existing Healthcare professional
    const healthcareProfessionalByIdOrNamesFound = healthcareProfessionalsStore.healthcareProfessionalsData
        .filter(healthcareProfessional => {
            const caseInsensitiveIdMatch = healthcareProfessional.id
                .toLowerCase()
                .startsWith(searchValue.value.toLowerCase().trim())

            const nameMatches = healthcareProfessional.names.some(name => {
                const firstNameMatch = name.firstName
                    .toLowerCase()
                    .includes(searchValue.value.toLowerCase())
                const middleNameMatch = name.middleName
                  && name.middleName
                      .toLowerCase()
                      .includes(searchValue.value.toLowerCase())
                const lastNameMatch = name.lastName
                    .toLowerCase()
                    .includes(searchValue.value.toLowerCase())
                return firstNameMatch || middleNameMatch || lastNameMatch
            })

            return caseInsensitiveIdMatch || nameMatches
        })

    // Filter out IDs already included in `selectedFacilityData.healthcareProfessionalIds`
    const selectedIds = facilitiesStore.selectedFacilityData?.healthcareProfessionalIds || []
    const filteredHealthcareProfessionalIds = healthcareProfessionalByIdOrNamesFound
        .filter(healthcareProfessional => !selectedIds.includes(healthcareProfessional.id))

    healthcareProfessionalByIdOrName.value = filteredHealthcareProfessionalIds
}

watch(() => facilitiesStore.facilitySectionFields.healthcareProfessionalIds, newValue => {
    if (newValue) {
        facilitiesStore.healthProfessionalsRelationsForDisplay = []
    }
})
</script>
