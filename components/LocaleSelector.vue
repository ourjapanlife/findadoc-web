<template>
    <div>
        <select v-model="localeName" class="rounded-full w-full px-1 border-2 border-primary/80 drop-shadow-md text-primary-text
            bg-secondary-bg/5 hover:text-primary-hover transition-colors">
            <option v-for="(localeOption) in locales" :key="localeOption.code">
                {{ localeOption.name }}
            </option>
        </select>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            localeName: '',
            locales: []
        }
    },
    created() {
        const code = this.$i18n.locale

        this.locales = this.$i18n.locales
        console.log(this.locales)

        for (let i = 0; i < this.locales.length; i += 1)
            if (this.locales[i].code === code && code !== '') {
                this.localeName = this.locales[i].name
                break
            }
    },
    methods: {
        getLocaleCodeFromName(name: string) {
            for (let i = 0; i < this.locales.length; i += 1)
                if (this.locales[i].name === name)
                    return this.locales[i].code

            return ''
        }
    },
    watch: {
        localeName(newLocale: string, oldLocale: string) {
            console.log(`Updating locale to ${newLocale} from ${oldLocale}`)
            this.$i18n.locale = this.getLocaleCodeFromName(newLocale)
        }
    }
}
</script>
