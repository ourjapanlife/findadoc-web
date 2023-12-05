<template>
    <div class="h-screen flex flex-col font-sans text-primary-text bg-primary-bg">
        <TopNav />
        <NuxtPage class="flex flex-1" />
        <Footer />
    </div>
</template>

<script lang="ts">
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client'

const client = new ApolloClient({
    uri: 'https://findadoc-api-9brq4.ondigitalocean.app/api',
    cache: new InMemoryCache()
});

</script>
