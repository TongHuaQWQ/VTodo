<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  saveTasks,
  loadCategories,
  type Task,
  type Category,
} from "../utils/dexieDB";

const props = defineProps<{
  defaultCategory?: string;
}>();

const isOpen = ref(false);
const categories = ref<Category[]>([]);

const newTask = ref<Task>({
  title: "",
  note: "",
  dueDate: "",
  dueTime: "",
  priority: 1,
  repeatType: "none",
  repeatValue: "",
  group: props.defaultCategory || "",
  archived: false,
  completed: false,
});

// 加载分类列表
onMounted(async () => {
  categories.value = await loadCategories();
});

// 打开模态框
const openModal = () => {
  isOpen.value = true;
};

// 关闭模态框
const closeModal = () => {
  isOpen.value = false;
  // 重置表单
  newTask.value = {
    title: "",
    note: "",
    dueDate: "",
    dueTime: "",
    priority: 1,
    repeatType: "none",
    repeatValue: "",
    group: props.defaultCategory || "",
    archived: false,
    completed: false,
  };
};

// 保存任务
const saveTask = async () => {
  if (!newTask.value.title.trim()) return;

  await saveTasks([newTask.value]);
  closeModal();
  // 触发任务更新事件
  window.dispatchEvent(new CustomEvent("task-updated"));
};

defineExpose({
  openModal,
});
</script>

<template>
  <div class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">添加新任务</h3>

      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">标题 *</span>
        </label>
        <input
          type="text"
          v-model="newTask.title"
          class="input input-bordered w-full"
          placeholder="输入任务标题"
          required
        />
      </div>

      <div class="form-control w-full mt-4">
        <label class="label">
          <span class="label-text">备注</span>
        </label>
        <textarea
          v-model="newTask.note"
          class="textarea textarea-bordered w-full"
          placeholder="添加备注（可选）"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">截止日期</span>
          </label>
          <input
            type="date"
            v-model="newTask.dueDate"
            class="input input-bordered w-full"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">截止时间</span>
          </label>
          <input
            type="time"
            v-model="newTask.dueTime"
            class="input input-bordered w-full"
          />
        </div>
      </div>

      <div class="form-control w-full mt-4">
        <label class="label">
          <span class="label-text">分类</span>
        </label>
        <select v-model="newTask.group" class="select select-bordered w-full">
          <option value="">无分类</option>
          <option
            v-for="category in categories"
            :key="category.name"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">优先级</span>
          </label>
          <select
            v-model="newTask.priority"
            class="select select-bordered w-full"
          >
            <option :value="1">1级 (绿色)</option>
            <option :value="2">2级 (黄色)</option>
            <option :value="3">3级 (橙色)</option>
            <option :value="4">4级 (红色)</option>
          </select>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">重复类型</span>
          </label>
          <select
            v-model="newTask.repeatType"
            class="select select-bordered w-full"
            disabled
          >
            <option value="none">不重复</option>
            <option value="daily">每日</option>
            <option value="weekly">每周</option>
            <option value="monthly">每月</option>
          </select>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="closeModal">取消</button>
        <button
          class="btn btn-primary"
          @click="saveTask"
          :disabled="!newTask.title.trim()"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>
