declare module '#clinic-directory' {
    import type { FacilitySearchResult } from './utils/searchDirectory'

    const directory: Record<string, FacilitySearchResult>
    export default directory
}

declare module '#doctor-directory' {
    import type { ProfessionalSearchResult } from './utils/clinicPrerender'

    const directory: Record<string, ProfessionalSearchResult>
    export default directory
}
