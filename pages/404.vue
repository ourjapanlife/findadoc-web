<template>
    <!--
        Static 404.html for unknown URLs. error.vue still handles createError()
        during SSR; this page must return 200 at generate time so Nitro writes
        the file. Netlify `_redirects` and serve then attach status 404.
    -->
    <NuxtLayout name="error-layout" />
</template>
