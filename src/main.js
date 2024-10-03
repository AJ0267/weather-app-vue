import "./assets/tailwind.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import SiteNavigation from "./components/SiteNavigation.vue";

const app = createApp(App);

app.use(router);

// app.component('site-navigation', SiteNavigation)

app.mount("#app");
