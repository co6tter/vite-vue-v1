import { createRouter, createWebHistory } from "vue-router";
import FormView from "@/views/FormView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: FormView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
