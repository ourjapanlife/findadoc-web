import { faker } from '@faker-js/faker'
import utils from './utils'
import type { CreateSubmissionInput, CreateSubmissionMutationVariables } from '~/typedefs/client/graphql'

const generate = {
    CreateSubmissionInput: (): CreateSubmissionMutationVariables => {
        const submissionInput: CreateSubmissionInput = {
            googleMapsUrl: faker.internet.url(),
            healthcareProfessionalName: faker.person.fullName(),
            notes: faker.lorem.paragraph(),
            spokenLanguages: utils.getLocales()
        }
        return { input: submissionInput }
    }
}

export default {
    generate
}
