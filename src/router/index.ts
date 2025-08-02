import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Calendar from "../views/Calendar.vue";
import Board from "../views/Board.vue";
import Settings from "../views/Settings.vue";
import CategoryTasks from "../views/CategoryTasks.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/Calendar",
    name: "Calendar",
    component: Calendar,
  },
  {
    path: "/Board",
    name: "Board",
    component: Board,
  },
  {
    path: "/Settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/category/:name",
    name: "CategoryTasks",
    component: CategoryTasks,
  },
  {
    path: "/task-test",
    name: "TaskTest",
    component: () => import("../views/TaskTest.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
