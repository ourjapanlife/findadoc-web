import { useStateManager } from './utils'
import type { Submission } from '~/typedefs/client/graphql'

const useSubmissions = (submissions: Submission[]) => useStateManager(submissions)

const initialize = () => {
    const submissions = useSubmissions([])
    return {
        submissions
    }
}

export default initialize()
