<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import TaskCard from "./TaskCard.vue";
import {
  loadOverdueTasksFromDB,
  updateOverdueTasks,
  type Task,
} from "../utils/dexieDB";

const overdueTasks = ref<Task[]>([]);
// 提供获取当前分类任务的方法
provide("getCurrentCategoryTasks", () => overdueTasks.value);

// 加载过期任务
const loadTasks = async () => {
  await updateOverdueTasks(); // 更新过期任务表
  overdueTasks.value = await loadOverdueTasksFromDB(); // 从过期任务表加载任务
};

// 组件挂载时加载任务
onMounted(() => {
  loadTasks();
});

// 监听任务更新事件
window.addEventListener("task-updated", loadTasks);
</script>

<template>
  <!-- <div role="alert" class="alert alert-vertical sm:alert-horizontal">
    <svg class="stroke-info h-6 w-6 shrink-0"></svg>
    <span>您有未完成的待办任务</span>
    <div class="flex gap-[10px]">
      <button class="btn btn-sm">关闭</button>
      <button class="btn btn-sm btn-primary">显示</button>
    </div>
  </div> -->

  <div class="mb-4">
    <div class="collapse bg-base-100 border-base-300 border">
      <input type="checkbox" />
      <div class="collapse-title font-semibold flex items-center">
        <span class="text-error mr-2">●</span> 逾期
      </div>
      <div class="collapse-content text-sm relative">
        <!-- 使用相对定位，确保内容正确显示 -->
        <div class="space-y-3 overflow-visible">
          <TaskCard v-for="task in overdueTasks" :key="task.id" :task="task" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
