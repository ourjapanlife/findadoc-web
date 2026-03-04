import { useI18n } from 'vue-i18n'

export const useUnsavedChangesConfirmationOptions = (mode: 'create' | 'update') => {
    const { t } = useI18n()

    return {
        mode,
        title: t(`unsavedChanges.${mode}.title`),
        message: t(`unsavedChanges.${mode}.message`),
        textConfirm: t(`unsavedChanges.${mode}.confirm`),
        textCancel: t(`unsavedChanges.${mode}.cancel`)
    }
}
