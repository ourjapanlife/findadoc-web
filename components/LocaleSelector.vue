<template>
    <div>
        <select v-model="selected">
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
