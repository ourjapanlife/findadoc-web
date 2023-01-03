<template>
    <div>
        <select v-model="selected" class="rounded-full w-full px-1
                    border-2 border-primary/80 drop-shadow-md text-primary-text bg-secondary-bg">
            <option selected>
                English
            </option>
            <option>
                日本語
            </option>
        </select>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const selected = ref('English')

</script>
