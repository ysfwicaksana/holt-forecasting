import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("./pages/NotFound.vue"),
    },
    {
      path: "/",
      name: "Home",
      component: () => import("./pages/Homepage.vue"),
    },
    {
      path: "/dataset",
      name: "Dataset",
      component: () => import("./pages/Dataset.vue"),
    },
  ],
});

export default router;
