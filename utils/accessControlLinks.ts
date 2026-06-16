import { SelectedModerationListView } from '~/stores/moderationSubmissionsStore'

export type AccessEntryKind = 'route' | 'info'

export interface AccessControlEntry {
    /** OAuth scope string — keep in sync with findadoc-server/src/auth.ts `Scope` */
    scope: string
    labelKey: string
    kind: AccessEntryKind
    /** In-app path when `kind` is `route` */
    route?: string
    /** When opening `/my-page`, select this list view */
    listView?: SelectedModerationListView
}

/**
 * Registry for every scope in the server enum, in stable display order.
 * @see findadoc-server/src/auth.ts
 */
export const ACCESS_CONTROL_ENTRIES: AccessControlEntry[] = [
    {
        scope: 'read:submissions',
        labelKey: 'accessPanel.scopes.read_submissions',
        kind: 'route',
        route: '/my-page',
        listView: SelectedModerationListView.Submissions
    },
    {
        scope: 'write:submissions',
        labelKey: 'accessPanel.scopes.write_submissions',
        kind: 'info'
    },
    {
        scope: 'delete:submissions',
        labelKey: 'accessPanel.scopes.delete_submissions',
        kind: 'info'
    },
    {
        scope: 'create:submissions',
        labelKey: 'accessPanel.scopes.create_submissions',
        kind: 'info'
    },
    {
        scope: 'read:facilities',
        labelKey: 'accessPanel.scopes.read_facilities',
        kind: 'route',
        route: '/my-page',
        listView: SelectedModerationListView.Facilities
    },
    {
        scope: 'write:facilities',
        labelKey: 'accessPanel.scopes.write_facilities',
        kind: 'route',
        route: '/my-page/create-facility'
    },
    {
        scope: 'delete:facilities',
        labelKey: 'accessPanel.scopes.delete_facilities',
        kind: 'info'
    },
    {
        scope: 'read:healthcareprofessionals',
        labelKey: 'accessPanel.scopes.read_healthcareprofessionals',
        kind: 'route',
        route: '/my-page',
        listView: SelectedModerationListView.HealthcareProfessionals
    },
    {
        scope: 'write:healthcareprofessionals',
        labelKey: 'accessPanel.scopes.write_healthcareprofessionals',
        kind: 'route',
        route: '/my-page/create-healthcare-professional'
    },
    {
        scope: 'delete:healthcareprofessionals',
        labelKey: 'accessPanel.scopes.delete_healthcareprofessionals',
        kind: 'info'
    },
    {
        scope: 'read:users',
        labelKey: 'accessPanel.scopes.read_users',
        kind: 'info'
    },
    {
        scope: 'write:users',
        labelKey: 'accessPanel.scopes.write_users',
        kind: 'info'
    },
    {
        scope: 'delete:users',
        labelKey: 'accessPanel.scopes.delete_users',
        kind: 'info'
    },
    {
        scope: 'read:logs',
        labelKey: 'accessPanel.scopes.read_logs',
        kind: 'info'
    },
    {
        scope: 'write:logs',
        labelKey: 'accessPanel.scopes.write_logs',
        kind: 'info'
    },
    {
        scope: 'read:profile',
        labelKey: 'accessPanel.scopes.read_profile',
        kind: 'info'
    },
    {
        scope: 'write:posts',
        labelKey: 'accessPanel.scopes.write_posts',
        kind: 'info'
    },
    {
        scope: 'read:reservations',
        labelKey: 'accessPanel.scopes.read_reservations',
        kind: 'info'
    },
    {
        scope: 'write:reservations',
        labelKey: 'accessPanel.scopes.write_reservations',
        kind: 'info'
    }
]

export function visibleAccessEntries(effectiveScopes: readonly string[]): AccessControlEntry[] {
    const set = new Set(effectiveScopes)
    const known = ACCESS_CONTROL_ENTRIES.filter(e => set.has(e.scope))
    const knownKeys = new Set(known.map(e => e.scope))
    const unknown: AccessControlEntry[] = effectiveScopes.filter(s => !knownKeys.has(s)).map(scope => ({
        scope,
        labelKey: 'accessPanel.scopes.unknown',
        kind: 'info'
    }))
    return [...known, ...unknown]
}
