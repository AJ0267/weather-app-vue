import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CityView from "@/views/CityView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "Home",
      },
    },
    {
      path: "/weather/:location",
      name: "CityView",
      component: CityView,
      meta: {
        title: "Weather",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name === 'home') {
    document.title = `Qlimate | Home`;
  } else if (to.name === 'CityView') {
    document.title = `Weather | ${to.params.location}`;
  } else {
    document.title = `${to.meta.title} | Qlimate`; 
  }
  next();
});

export default router;
