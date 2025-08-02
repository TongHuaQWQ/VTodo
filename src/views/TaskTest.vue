<template>
  <div>
    <h1>Task Test</h1>
    <form @submit.prevent="addTask">
      <input v-model="newTask.title" placeholder="Title" required />
      <input v-model="newTask.note" placeholder="Note" />
      <input v-model="newTask.dueDate" type="date" placeholder="Due Date" />
      <input v-model="newTask.dueTime" type="time" placeholder="Due Time" />
      <select v-model="newTask.priority">
        <option :value="1">1级 (绿色)</option>
        <option :value="2">2级 (黄色)</option>
        <option :value="3">3级 (橙色)</option>
        <option :value="4">4级 (红色)</option>
      </select>
      <select v-model="newTask.repeatType">
        <option value="none">None</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <input v-model="newTask.repeatValue" placeholder="Repeat Value" />
      <input v-model="newTask.archived" type="checkbox" />
      <select v-model="newTask.group">
        <option
          v-for="category in categories"
          :key="category.name"
          :value="category.name"
        >
          {{ category.name }}
        </option>
      </select>
      <button type="submit">Add Task</button>
    </form>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <div class="badge" :class="getPriorityClass(task.priority)">
          {{ task.priority || 1 }}
        </div>
        {{ task.title }} - {{ task.note }}
        <button @click="task.id !== undefined && deleteTask(task.id)">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  db,
  loadTasksByCategory,
  saveTasks,
  type Task,
  type Category,
  loadCategories,
} from "../utils/dexieDB";

const newTask = ref<Task>({ title: "", note: "" });
const tasks = ref<Task[]>([]);

const categories = ref<Category[]>([]);

onMounted(async () => {
  tasks.value = await loadTasks();
  categories.value = await loadCategories();
});

onMounted(async () => {
  tasks.value = await loadTasks();
});

async function addTask() {
  console.log("Adding task:", newTask.value);
  const taskToSave = { ...newTask.value };
  await saveTasks([taskToSave]);
  if (newTask.value.group !== undefined) {
    console.log("Loading tasks for group:", newTask.value.group);
    tasks.value = await loadTasksByCategory(newTask.value.group);
  } else {
    console.log("Loading all tasks");
    tasks.value = await loadTasks();
  }
  newTask.value = {
    title: "",
    note: "",
    dueDate: "",
    dueTime: "",
    repeatType: "none",
    repeatValue: "",
    archived: false,
    group: "",
  };
  console.log("Task added successfully");
}

async function deleteTask(id: number) {
  await db.tasks.delete(id);
  await db.todayTasks.where("taskId").equals(id).delete();
  await db.allTasks.where("id").equals(id).delete();
  tasks.value = await loadTasks();
}

async function loadTasks(): Promise<Task[]> {
  return await db.tasks.toArray();
}

function getPriorityClass(priority: number | undefined): string {
  switch (priority) {
    case 1:
      return "priority-1";
    case 2:
      return "priority-2";
    case 3:
      return "priority-3";
    case 4:
      return "priority-4";
    default:
      return "priority-1";
  }
}
</script>

<style scoped>
.badge {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  font-weight: bold;
  color: white;
  margin-right: 8px;
  font-size: 12px;
}

.priority-1 {
  background-color: #4caf50; /* 绿色 */
}

.priority-2 {
  background-color: #ffc107; /* 黄色 */
}

.priority-3 {
  background-color: #ff9800; /* 橙色 */
}

.priority-4 {
  background-color: #f44336; /* 红色 */
}

li {
  display: flex;
  align-items: center;
  margin: 8px 0;
}
</style>
