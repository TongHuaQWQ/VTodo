<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { formatDateTime } from "../utils/timeFormatter";

const currentTime = ref(formatDateTime(new Date()));
let timer: number | null = null;

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = formatDateTime(new Date());
  }, 1000); // 每秒更新一次
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <header class="flex justify-between">
    <h1 class="text-3xl font-bold">{{ props.message }}</h1>
    <div class="flex gap-[10px] flex-col">
      <time class="text-3xl font-bold" datetime=""
        >{{ currentTime.date }}, {{ currentTime.week }}
      </time>
      <time
        class="flex justify-end text-2xl font-black text-gray-600"
        datetime=""
        >{{ currentTime.time }}</time
      >
    </div>
  </header>
</template>

<style scoped></style>
