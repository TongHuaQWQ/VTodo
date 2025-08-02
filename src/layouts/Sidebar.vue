<script setup lang="ts">
import { ref } from "vue";
import Categories from "../components/Categories.vue";
import MainMenu from "../components/Main-Menu.vue";
import Footer from "../components/Footer.vue";
import AddTaskModal from "../components/AddTaskModal.vue";

const addTaskModal = ref();
</script>

<template>
  <div class="flex flex-col h-full">
    <MainMenu />
    <div class="flex-1 overflow-y-auto mt-4">
      <button
        class="btn btn-block btn-neutral mb-4 mx-3"
        @click="addTaskModal.openModal()"
      >
        添加任务
      </button>
      <Categories />
    </div>
    <Footer />
    <AddTaskModal ref="addTaskModal" />
  </div>
</template>
