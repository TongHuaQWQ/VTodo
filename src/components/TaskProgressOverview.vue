<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { db, loadAllTasksByCategory, type Task } from "../utils/dexieDB";

// 存储事件监听器引用
let categoryUpdateListener: (() => void) | null = null;
let taskUpdateListener: (() => void) | null = null;

// 所有任务
const categories = ref<string[]>([]);
// 今日所有任务
const todayTasks = ref<Task[]>([]);

const categoryTasksMap = ref<Record<string, Task[]>>({});

// 计算今日任务进度
const todayProgress = computed(() => {
  // 任务总数
  const total = todayTasks.value.length;
  // 已完成任务数
  const completed = todayTasks.value.filter((task) => task.completed).length;
  // 完成百分比
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
});

// 计算分类任务进度
const getCategoryProgress = (categoryName: string) => {
  const tasks = categoryTasksMap.value[categoryName] || [];
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
};

// 加载所有数据
const loadAllData = async () => {
  // 加载分类
  categories.value = await loadCategories();

  // 加载今日所有任务（包括已完成的）
  const allTodayTasks = await db.tasks
    .filter((task) => {
      const today = new Date().toISOString().split("T")[0];
      return task.dueDate === today;
    })
    .toArray();
  todayTasks.value = allTodayTasks;

  // 加载各分类所有任务（包括已完成的）
  for (const category of categories.value) {
    // 添加验证，确保 category 有效
    if (category && typeof category === "string") {
      try {
        const allCategoryTasks = await loadAllTasksByCategory(category);
        categoryTasksMap.value[category] = allCategoryTasks;
      } catch (error) {
        console.error(`加载分类 "${category}" 的任务失败:`, error);
        categoryTasksMap.value[category] = [];
      }
    }
  }
};

// 加载数据的包装函数，添加错误处理
const handleDataUpdate = async () => {
  try {
    await loadAllData();
  } catch (error) {
    console.error("数据更新失败:", error);
  }
};

onMounted(async () => {
  await loadAllData();

  // 创建事件监听器
  categoryUpdateListener = () => {
    handleDataUpdate();
  };

  taskUpdateListener = () => {
    handleDataUpdate();
  };

  // 添加事件监听器
  window.addEventListener("category-updated", categoryUpdateListener);
  window.addEventListener("task-updated", taskUpdateListener);
});

// 加载所有分类
async function loadCategories(): Promise<string[]> {
  const categories = await db.categories.toArray();
  return categories
    .map((category) => category.name)
    .filter((name): name is string =>
      Boolean(name && typeof name === "string")
    );
}
</script>

<template>
  <div class="flex flex-wrap gap-[20px] flex-row items-center">
    <!-- 进度区域 -->
    <div class="w-[250px] card bg-base-100 card-md shadow-sm">
      <div class="card-body">
        <h2 class="card-title">今日 待办任务</h2>
        <p>{{ todayProgress.completed }}/{{ todayProgress.total }} 已完成</p>
        <div class="card-actions">
          <progress
            class="progress progress-secondary w-56"
            :value="todayProgress.percentage"
            max="100"
          ></progress>
        </div>
      </div>
    </div>
    <div
      v-for="category in categories"
      :key="category"
      class="w-[250px] card bg-base-100 card-md shadow-sm"
    >
      <div class="card-body">
        <h2 class="card-title">{{ category }}</h2>
        <p>
          {{ getCategoryProgress(category).completed }}/{{
            getCategoryProgress(category).total
          }}
          已完成
        </p>
        <div class="card-actions">
          <progress
            class="progress progress-secondary w-56"
            :value="getCategoryProgress(category).percentage"
            max="100"
          ></progress>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
