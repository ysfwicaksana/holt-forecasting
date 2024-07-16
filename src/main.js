import { createApp } from "vue";
import "./index.css";
import router from "./router";
import App from "./App.vue";
import VueApexCharts from "vue3-apexcharts";

createApp(App)
  .use(VueApexCharts)
  .component("apexchart", VueApexCharts)
  .use(router)
  .mount("#app");
