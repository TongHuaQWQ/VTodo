<script setup lang="ts">
import Sidebar from './layouts/Sidebar.vue';


</script>

<template>
    <div class="flex min-h-screen bg-base-200 text-base-content">
        <aside class="w-64 bg-gray-100 p-3 shadow-xl min-w-[256px] max-w-[256px]">
            <Sidebar />
        </aside>
        <main class="p-6 pr-18 pl-10 grow bg-[rgba(255, 255, 255 ,0.5)]">
            <router-view />
        </main>
    </div>
</template>

<style scoped>

</style>