import type { Nuxt } from '@nuxt/schema'
import type { NitroConfig } from 'nitropack'
import { buildClinicPrerenderDirectory, isNuxtGenerateCommand } from '../clinicPrerender'

type EntityDirectoryBuild = Awaited<ReturnType<typeof buildClinicPrerenderDirectory>>

let entityDirectoryBuild: EntityDirectoryBuild | undefined
let entityDirectoryBuildPromise: Promise<EntityDirectoryBuild> | undefined

/**
 * One directory fetch for `nuxi generate`. Vite plugins and Nitro hooks share this
 * so clinic and doctor HTML is filled from memory instead of `facility(id)` /
 * `healthcareProfessional(id)` per page.
 */
export async function entityDirectoryForGenerate(): Promise<EntityDirectoryBuild> {
    if (!isNuxtGenerateCommand()) {
        return null
    }

    entityDirectoryBuildPromise ??= buildClinicPrerenderDirectory().then(built => {
        entityDirectoryBuild = built
        return built
    })

    return entityDirectoryBuildPromise
}

function directoryVitePlugin(
    moduleId: '#clinic-directory' | '#doctor-directory',
    directoryOf: (built: NonNullable<EntityDirectoryBuild>) => unknown
) {
    const resolvedId = `\0${moduleId.slice(1)}`

    return {
        name: moduleId.slice(1),
        resolveId(id: string) {
            if (id === moduleId) {
                return resolvedId
            }
        },
        load(this: { environment?: { name?: string } }, id: string) {
            if (id !== resolvedId) {
                return
            }

            if (this.environment?.name === 'client') {
                return 'export default {}'
            }

            const directory = entityDirectoryBuild ? directoryOf(entityDirectoryBuild) : {}
            return `export default ${JSON.stringify(directory)}`
        }
    }
}

export function entityDirectoryVitePlugins() {
    return [
        directoryVitePlugin('#clinic-directory', built => built.directory),
        directoryVitePlugin('#doctor-directory', built => built.professionalDirectory)
    ]
}

export async function applyEntityDirectoryToNuxt(nuxt: Nuxt) {
    const built = await entityDirectoryForGenerate()
    if (!built) {
        return
    }

    nuxt.options.runtimeConfig.clinicPrerenderDirectory = built.directory
    nuxt.options.runtimeConfig.doctorPrerenderDirectory = built.professionalDirectory
}

export async function applyEntityDirectoryToNitro(nitroConfig: NitroConfig) {
    const built = await entityDirectoryForGenerate()
    if (!built || nitroConfig.dev) {
        return
    }

    console.warn(`[clinic prerender] ${built.paths.length} clinic pages, ${built.professionalPaths.length} doctor pages from directory payload`)
    nitroConfig.runtimeConfig ??= {}
    nitroConfig.runtimeConfig.clinicPrerenderDirectory = built.directory
    nitroConfig.runtimeConfig.doctorPrerenderDirectory = built.professionalDirectory
    nitroConfig.virtual = {
        ...nitroConfig.virtual,
        '#clinic-directory': `export default ${JSON.stringify(built.directory)}`,
        '#doctor-directory': `export default ${JSON.stringify(built.professionalDirectory)}`
    }
    nitroConfig.prerender ??= {}
    const existing = nitroConfig.prerender.routes
    const entityPaths = [...built.paths, ...built.professionalPaths]
    nitroConfig.prerender.routes = Array.isArray(existing)
        ? [...existing, ...entityPaths]
        : entityPaths
}
