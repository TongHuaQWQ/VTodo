<script setup lang="ts">
import { ref, onMounted } from "vue";
import { db } from "../utils/dexieDB";

const categories = ref<string[]>([]);
const newCategory = ref<string>("");

// 组件挂载时加载分类
onMounted(async () => {
  categories.value = await loadCategories();
});

// 添加新分类
async function addCategory() {
  await addCategoryToDB();
}

// 将新分类保存到数据库
async function addCategoryToDB() {
  if (newCategory.value.trim()) {
    await db.categories.add({ name: newCategory.value });
    categories.value = await loadCategories();
    newCategory.value = "";

    // 手动触发 TodayTasks.vue 组件的分类列表更新
    const event = new CustomEvent("category-updated");
    window.dispatchEvent(event);
  }
}

// 从数据库加载分类
async function loadCategories(): Promise<string[]> {
  const categories = await db.categories.toArray();
  return categories.map((category) => category.name);
}
</script>

<template>
  <div class="flex flex-col">
    <!-- 类别区域 - 固定高度 -->
    <ul class="menu bg-base-200 rounded-box w-full mb-4 flex-shrink-0">
      <li>
        <h2 class="menu-title flex justify-between">
          分类
          <button class="btn btn-xs btn-square">+</button>
        </h2>
        <!-- <div class="grid grid-cols-5 gap-0">
                    <input type="text" placeholder="名称" class="input !input-ms col-span-4 !rounded-r-none" />
                    <button class="btn btn-primary col-span-1 !rounded-l-none">添加</button>
                </div> -->
        <div class="grid grid-cols-5 gap-0">
          <input
            v-model="newCategory"
            type="text"
            placeholder="名称"
            class="input !input-ms col-span-4 !rounded-r-none"
          />
          <button @click="addCategory">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 18 24"
            >
              <g fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="#170000"
                  fill-opacity="0.25"
                />
                <path
                  stroke="#170000"
                  stroke-linecap="square"
                  stroke-linejoin="round"
                  stroke-width="1.2"
                  d="M12 8v8m4-4H8"
                />
              </g>
            </svg>
          </button>
        </div>
        <!-- 渲染分类列表 -->
        <!-- <ul class="overflow-y-auto" style="max-height: 20vh">
                    <li v-for="category in categories" :key="category"><a>{{ category }}</a></li>
                </ul> -->
        <ul class="overflow-y-auto" style="max-height: 20vh">
          <li v-for="category in categories" :key="category">
            <router-link :to="`/category/${category}`">{{
              category
            }}</router-link>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 归档区域 - 占据剩余空间并可滚动 -->
    <div>
      <ul class="menu bg-base-200 rounded-box w-full h-full">
        <li>
          <details open>
            <summary>归档</summary>
            <!-- 归档列表 - 关键：这里添加滚动 -->
            <div class="md:overflow-y-auto" style="max-height: 20vh">
              <!-- <ul>
                                <li v-for=""></li>
                            </ul> -->
            </div>
          </details>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
