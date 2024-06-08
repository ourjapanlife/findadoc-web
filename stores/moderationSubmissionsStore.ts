import { gql } from "graphql-request";
import { defineStore } from "pinia";
import { Locale, Submission } from "~/typedefs/gqlTypes.js";
import { gqlClient } from "../utils/graphql.js";
import { Ref, ref } from "vue";

export const useModerationSubmissionsStore = defineStore(
    "submissionsStore",
    () => {
        const submissionsData: Ref<Submission[]> = ref([]);

        async function getSubmissions() {
            const submissionsSearchResults = await querySubmissions();
            submissionsData.value = submissionsSearchResults;
        }

        return { getSubmissions, submissionsData };
    }
);

async function querySubmissions() {
    try {
        const submissionsFilters = {
            filters: {
                id: undefined,
            },
        };

        const result = await gqlClient.request<{ submissions: Submission[] }>(
            getSubmissions,
            submissionsFilters
        );
        return result?.submissions ?? [];
    } catch (error) {
        console.log(`Error querying the submissions: ${JSON.stringify(error)}`);
        return [];
    }
}

const getSubmissions = gql`
    query Submissions($filters: SubmissionSearchFilters!) {
        submissions(filters: $filters) {
            createdDate
            id
            isApproved
            isRejected
            isUnderReview
            updatedDate
            healthcareProfessionalName
            facility {
                nameEn
            }
        }
    }
`;
