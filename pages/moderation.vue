<template>
    <div v-if="enableModerationPanel" class="flex flex-col h-full">
       <ModLeftNavbar />
       <ModTopbar />
       <ModMainContent />
    </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from "#imports"

const runtimeConfig = useRuntimeConfig();
const enableModerationPanel = runtimeConfig.public.ENABLE_MODERATION_PANEL || false

</script>
