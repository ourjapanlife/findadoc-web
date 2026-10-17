import { computed, inject, provide, ref, type InjectionKey, type Ref } from 'vue'

const moderationFormEditingKey: InjectionKey<Ref<boolean>> = Symbol('moderationFormEditing')

/** Forms that already have saved data start in preview. Create forms stay editable. */
export function provideModerationFormEditing(initial = false): Ref<boolean> {
    const editing = ref(initial)
    provide(moderationFormEditingKey, editing)
    return editing
}

export function useModerationFormEditingSource(): Ref<boolean> | null {
    return inject(moderationFormEditingKey, null)
}

/** True when the moderator can type. Missing provider means a create form. */
export function useModerationFormEditing() {
    const editing = useModerationFormEditingSource()
    return computed(() => editing?.value ?? true)
}
