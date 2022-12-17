<template>
    <div>
        <select v-model="selected">
            <option>
                English
            </option>
            <option>
                日本語
            </option>
        </select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            selected: ''
        }
    }
})
</script>
