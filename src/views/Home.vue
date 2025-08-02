<script setup lang="ts">
import { ref, onMounted } from "vue";
import OverdueTasks from "../components/OverdueTasks.vue";
import PageHeader from "../components/PageHeader.vue";
import TaskProgressOverview from "../components/TaskProgressOverview.vue";
import TodayTasks from "../components/TodayTasks .vue";
import {
  updateTodayTasks,
  saveTasks,
  loadTasks,
  updateOverdueTasks,
} from "../utils/dexieDB";

const h1 = ref("TODO");
onMounted(async () => {
  await updateTodayTasks(); // 在组件挂载时同步今日任务
  await updateOverdueTasks(); // 在组件挂载时同步逾期任务

  // 获取所有未完成的任务
  const tasks = await loadTasks();
  const uncompletedTasks = tasks.filter((task) => !task.completed);

  // 将未完成的任务添加到 allTasks 表中
  await saveTasks(uncompletedTasks);
});
</script>

<template>
  <div class="flex flex-col gap-[20px]">
    <!-- 头部 -->
    <PageHeader :message="h1" />

    <!-- 待办任务模块 -->
    <TaskProgressOverview />

    <!-- 逾期任务区域 -->
    <OverdueTasks />

    <!-- 今日待办区域 -->
    <TodayTasks />
  </div>
</template>
