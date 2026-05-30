import { describe, it, expect } from 'vitest'
import { shouldPruneKey } from './cleanUnusedLocaleKeys.js'

describe('Translation Cleanup Script - Key Pruning Logic', () => {
    // ... leave the rest of the test cases exactly as they are ...
    it('should prune a key if it is not used in the codebase', () => {
        const mockUsedKeys = new Set(['nav.home', 'buttons.save'])
        const result = shouldPruneKey('abandoned.feature.title', mockUsedKeys)
        expect(result).toBe(true)
    })

    it('should NOT prune a standard key if it is explicitly used in the codebase', () => {
        const mockUsedKeys = new Set(['nav.home', 'buttons.save'])
        const result = shouldPruneKey('nav.home', mockUsedKeys)
        expect(result).toBe(false)
    })

    it('should protect dynamic unsavedChanges keys even if they are missing from the static checklist', () => {
        const mockUsedKeys = new Set(['nav.home'])

        const testKeys = [
            'unsavedChanges.create.title',
            'unsavedChanges.create.message',
            'unsavedChanges.update.title',
            'unsavedChanges.update.message'
        ]

        testKeys.forEach(key => {
            const result = shouldPruneKey(key, mockUsedKeys)
            expect(result).toBe(false)
        })
    })
})
