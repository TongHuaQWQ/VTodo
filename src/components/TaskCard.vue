<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import { toggleTaskComplete, type Task } from "../utils/dexieDB";

// 控制对话框显示的状态变量
const isModalOpen = ref(false);

// 打开对话框的方法
function openDateModal() {
  isModalOpen.value = true;
}

// 关闭对话框的方法
function closeModal() {
  isModalOpen.value = false;
}

// 在组件挂载后确保对话框初始化
onMounted(() => {
  console.log("Modal component mounted");
});

const tasks = ref<Task[]>([]);

const props = defineProps<{
  task: Task;
}>();

// 在组件挂载后获取任务数据
onMounted(async () => {
  const getCurrentCategoryTasks = inject<() => Task[]>(
    "getCurrentCategoryTasks"
  );
  if (getCurrentCategoryTasks) {
    tasks.value = getCurrentCategoryTasks();
  }
});

// 添加任务完成处理函数
async function handleTaskComplete() {
  if (props.task.id) {
    await toggleTaskComplete(props.task.id);
    // 更新本地props的completed状态以立即反映UI变化
    props.task.completed = !props.task.completed;
    // 触发父组件刷新任务列表
    window.dispatchEvent(new CustomEvent("task-updated"));
  }
}

// 获取优先级对应的样式类
function getPriorityClass(priority: number | undefined): string {
  switch (priority) {
    case 1:
      return "badge-success"; // 绿色
    case 2:
      return "badge-warning"; // 黄色
    case 3:
      return "badge-warning badge-outline"; // 橙色（可用outline变体）
    case 4:
      return "badge-error"; // 红色
    default:
      return "badge-success"; // 默认绿色
  }
}
</script>

<template>
  <div class="card px-4 bg-base-100 shadow-lg rounded-xl">
    <div class="card-title">
      <label class="grow">
        <input
          type="checkbox"
          class="checkbox checkbox-sm"
          :checked="props.task.completed || false"
          @change="handleTaskComplete"
        />
        {{ props.task.title }}
      </label>
      <!-- 日期 -->
      <div v-if="props.task.dueDate" class="badge badge-outline badge-accent">
        {{ props.task.dueDate }}
      </div>
      <div v-if="props.task.dueTime" class="badge badge-soft badge-info">
        {{ props.task.dueTime }}
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost m-1">...</div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
        >
          <li><a>编辑任务</a></li>
          <li><a>删除任务</a></li>
        </ul>
      </div>
    </div>
    <div class="flex flex-wrap pr-4 pb-2 pl-8 gap-2">
      <p v-if="props.task.note" class="w-full shrink-0 text-wrap">
        {{ props.task.note }}
      </p>
      <div v-if="props.task.group" class="badge badge-soft badge-primary">
        {{ props.task.group }}
      </div>
      <div class="grow"></div>
      <div class="flex items-center gap-2">
        <!-- 优先级 -->
        <div class="badge" :class="getPriorityClass(props.task.priority)">
          {{ props.task.priority || 1 }}
        </div>
        <!-- 收藏按钮 -->
        <label class="swap swap-rotate">
          <!-- this hidden checkbox controls the state -->
          <input type="checkbox" />

          <!-- 未收藏图标 -->
          <svg
            class="swap-off fill-current text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z M12,15.39L8,17.66V5H16V17.66L12,15.39Z"
            />
          </svg>

          <!-- 已收藏图标 -->
          <svg
            class="swap-on fill-current text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"
            />
          </svg>
        </label>

        <!-- 弹窗时间修改 -->
        <!-- 时间按钮，点击打开对话框 -->
        <button class="btn btn-ghost btn-circle btn-sm" @click="openDateModal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
        <!-- 时间修改对话框 -->
        <div
          id="my_modal_1"
          class="modal z-50"
          :class="{ 'modal-open': isModalOpen }"
        >
          <div class="modal-box">
            <h3 class="font-bold text-lg">修改任务时间</h3>
            <div class="py-4">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">选择日期</span>
                </div>
                <input type="date" class="input input-bordered w-full" />
              </label>

              <label class="form-control w-full mt-4">
                <div class="label">
                  <span class="label-text">选择时间（可选）</span>
                </div>
                <input type="time" class="input input-bordered w-full" />
              </label>
            </div>
            <div class="modal-action">
              <button class="btn btn-outline mr-2" @click="closeModal">
                取消
              </button>
              <button class="btn btn-primary">确认</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: static;
}
</style>
