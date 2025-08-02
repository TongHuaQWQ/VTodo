<script setup lang="ts">
import TaskCard from "./TaskCard.vue";
import { ref, onMounted, watch, provide } from "vue";
import {
  db,
  loadTasksByCategory,
  loadTodayTasks,
  type Task,
} from "../utils/dexieDB";

const categories = ref<string[]>([]);
const selectedCategory = ref<string | null>(null);
const tasks = ref<Task[]>([]);
provide("getCurrentCategoryTasks", () => tasks.value);

// 组件挂载时加载分类
onMounted(async () => {
  categories.value = await loadCategories();

  // 监听分类列表更新事件
  window.addEventListener("category-updated", async () => {
    categories.value = await loadCategories();
  });

  // 监听任务更新事件
  window.addEventListener("task-updated", async () => {
    // 重新加载当前分类的任务
    if (selectedCategory.value === "所有任务") {
      tasks.value = await loadAllTasks();
    } else if (selectedCategory.value === "今日任务") {
      tasks.value = await loadTodayTasks();
    } else if (selectedCategory.value) {
      tasks.value = await loadTasksByCategory(selectedCategory.value);
    }
  });
});

// 监听选中的分类变化
watch(
  selectedCategory,
  async (newCategory) => {
    if (newCategory === "所有任务") {
      tasks.value = await loadAllTasks();
    } else if (newCategory === "今日任务") {
      tasks.value = await loadTodayTasks();
    } else if (newCategory) {
      tasks.value = await loadTasksByCategory(newCategory);
    } else {
      tasks.value = await loadAllTasks();
    }
  },
  { immediate: true }
);

// 加载所有分类
async function loadCategories(): Promise<string[]> {
  const categories = await db.categories.toArray();
  return categories.map((category) => category.name);
}

async function loadAllTasks(): Promise<Task[]> {
  return await db.tasks.filter((task) => !task.completed).toArray();
}
</script>

<template>
  <div class="filter">
    <input
      class="btn filter-reset"
      type="radio"
      name="metaframeworks"
      aria-label="All"
      @change="selectedCategory = '今日任务'"
    />
    <input
      class="btn"
      type="radio"
      name="metaframeworks"
      aria-label="今日任务"
      @change="selectedCategory = '今日任务'"
    />
    <input
      class="btn"
      type="radio"
      name="metaframeworks"
      aria-label="所有任务"
      @change="selectedCategory = '所有任务'"
    />
    <input
      v-for="category in categories"
      :key="category"
      class="btn"
      type="radio"
      name="metaframeworks"
      :aria-label="category"
      @change="selectedCategory = category"
    />
  </div>

  <div class="flex flex-col gap-4">
    <div v-for="task in tasks" :key="task.id">
      <TaskCard :task="task" />
    </div>
  </div>
</template>

<style scoped>
input {
  scale: none;
}
</style>
