<script setup lang="ts">

</script>

<template>
    <div class="">
        <ul class=" menu rounded-box bg-base-200 w-full">
            <li class="mb-2">
                <router-link to="/home" class="rounded-xl" active-class="bg-primary text-primary-content">
                    主页
                </router-link>
            </li>
            <li class="mb-2 menu-disabled">
                <router-link to="/Calendar" class="rounded-xl" active-class="bg-primary text-primary-content">
                    日历
                </router-link>
            </li>
            <li class="mb-2 menu-disabled">
                <router-link to="/Board" class="rounded-xl" active-class="bg-primary text-primary-content">
                    看板
                </router-link>
            </li>
            <li class="mb-2 menu-disabled">
                <router-link to="/Settings" class="rounded-xl" active-class="bg-primary text-primary-content"> 
                    设置
                </router-link>
            </li>
        </ul>
    </div>
    
</template>

<style scoped>

</style>