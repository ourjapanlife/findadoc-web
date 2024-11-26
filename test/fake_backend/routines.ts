import faker from '../faker'
import view from './view'

const submission = {
    populate: {
        underReview: (quantity: number) => {
            let counter = 0
            while (counter++ < quantity) {
                const submission = faker.submission.generate.CreateSubmissionInput()
                view.submission.create(submission)
            }
        }
    }
}

export default {
    submission
}
