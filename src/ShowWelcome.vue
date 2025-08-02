<script setup lang="ts">
import { ref, onMounted } from "vue";

const showWelcomeModal = ref(false);
const currentVersion = "0.1.0-dev";
const lastVersion = ref<string | null>(null);

// 检查是否首次访问
const checkFirstVisit = () => {
  const hasVisited = localStorage.getItem("vtodo-first-visit");
  lastVersion.value = localStorage.getItem("vtodo-last-version");

  // 首次访问或版本更新时显示
  if (!hasVisited || lastVersion.value !== currentVersion) {
    showWelcomeModal.value = true;
  }
};

// 关闭弹窗并标记已访问
const closeWelcomeModal = () => {
  showWelcomeModal.value = false;
  localStorage.setItem("vtodo-first-visit", "true");
  localStorage.setItem("vtodo-last-version", currentVersion);
};

onMounted(() => {
  // 延迟显示，避免页面加载时闪烁
  setTimeout(checkFirstVisit, 500);
});
</script>

<template>
  <!-- 首次启动提示 Modal -->
  <div
    :class="['modal', { 'modal-open': showWelcomeModal }]"
    v-if="showWelcomeModal"
  >
    <div class="modal-box max-w-md">
      <!-- 标题 -->
      <h3 class="font-bold text-lg mb-4 text-center">🚧 VTodo 项目提示</h3>

      <!-- 警告信息 -->
      <div class="space-y-3">
        <!-- Alert Info -->
        <div class="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-current shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <div class="font-semibold">项目开发中</div>
            <div class="text-sm">本项目并未制作完成，还有很多问题和 bug</div>
          </div>
        </div>

        <!-- Alert Warning -->
        <div class="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <div class="font-semibold">功能未完善</div>
            <div class="text-sm">施工并未完成，请谨慎使用</div>
          </div>
        </div>
      </div>

      <!-- 版本信息 -->
      <!-- 在版本信息部分添加版本变更提示 -->
      <div class="mt-4 p-3 bg-base-200 rounded-lg">
        <div class="text-center">
          <span class="text-sm text-base-content/70">当前版本：</span>
          <span class="font-mono font-semibold">{{ currentVersion }}</span>
          <div class="badge badge-outline badge-sm mt-1">未完成</div>

          <!-- 版本变更提示 -->
          <div v-if="lastVersion !== currentVersion" class="mt-2">
            <div class="text-xs text-base-content/60">
              版本更新：{{ lastVersion || "首次启动" }} → {{ currentVersion }}
            </div>
          </div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="modal-action justify-center">
        <button class="btn btn-primary btn-wide" @click="closeWelcomeModal">
          我知道了
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 确保 modal 层级正确 */
.modal {
  z-index: 9999;
}
</style>
