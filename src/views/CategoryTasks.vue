<script setup lang="ts">
import { ref, onMounted, computed, watch, provide } from "vue";
import { useRoute } from "vue-router";
import { loadAllTasksByCategory, type Task } from "../utils/dexieDB";
import PageHeader from "../components/PageHeader.vue";
import TaskCard from "../components/TaskCard.vue";
import AddTaskModal from "../components/AddTaskModal.vue";

const route = useRoute();
const categoryName = computed(() => route.params.name as string);
const tasks = ref<Task[]>([]);
const addTaskModal = ref();

onMounted(async () => {
  tasks.value = await loadAllTasksByCategory(categoryName.value);
});

watch(
  () => route.params.name,
  async (newName) => {
    const name = Array.isArray(newName) ? newName[0] : newName;
    tasks.value = await loadAllTasksByCategory(name);
  }
);

const h1 = ref(categoryName);

function getCurrentCategoryTasks() {
  return tasks.value;
}

provide("getCurrentCategoryTasks", getCurrentCategoryTasks);

const incompleteTasks = computed(() =>
  tasks.value.filter((task) => !task.completed)
);
const completedTasks = computed(() =>
  tasks.value.filter((task) => task.completed)
);

// 监听任务更新事件
onMounted(() => {
  window.addEventListener("task-updated", async () => {
    tasks.value = await loadAllTasksByCategory(categoryName.value);
  });
});
</script>

<template>
  <div class="flex flex-col gap-[20px]">
    <PageHeader :message="h1" />
    <button
      class="btn btn-block btn-neutral btn-dash"
      @click="addTaskModal.openModal()"
    >
      添加任务
    </button>

    <AddTaskModal ref="addTaskModal" :default-category="categoryName" />

    <!-- 未完成的任务 -->
    <div v-for="task in incompleteTasks" :key="task.id">
      <TaskCard :task="task" />
    </div>

    <!-- 如果有已完成的任务，显示分隔线 -->
    <div v-if="completedTasks.length > 0" class="divider">已完成</div>

    <!-- 已完成的任务 -->
    <div v-for="task in completedTasks" :key="task.id">
      <TaskCard :task="task" />
    </div>
  </div>
</template>
