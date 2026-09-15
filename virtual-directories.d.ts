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

declare module '#generated-prefecture-hubs' {
    /** Prefecture hub paths for this generate, or `null` outside generate. */
    const hubs: string[] | null
    export default hubs
}

declare module '#generated-facet-paths' {
    /** Specialty/language facet paths for this generate, or `null` outside generate. */
    const paths: string[] | null
    export default paths
}
