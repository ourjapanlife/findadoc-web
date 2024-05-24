import { gql } from "graphql-request";
import { defineStore } from "pinia";
import { Locale, Submission } from "~/typedefs/gqlTypes.js";
import { gqlClient } from "../utils/graphql.js";

export const useModerationSubmissionsStore = defineStore(
    "submissionsStore",
    () => {
        let submissionsData;

        async function getSubmissions() {
            const submissionsSearchResults = await querySubmissions();

            submissionsData = submissionsSearchResults;
        }

        return { getSubmissions, submissionsData };
    }
);

async function querySubmissions() {
    try {
        const submissionsFilters = {
            filters: {
                createdDate: "",
                healthcareProfessionalName: "",
                id: "",
                isApproved: false,
                isRejected: false,
                isUnderReview: false,
                updatedDate: "",
                spokenLanguages: [],
                facility: {
                    nameEn: "",
                },
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
