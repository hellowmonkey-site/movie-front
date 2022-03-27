import { createApp } from "vue";
import App from "./layout/App";
import router from "@/router";
import "@/static/style/app.scss";

import "@/extend";
import "@/plugin/ajax";
import { getCategoryList } from "./service/category";

const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  await getCategoryList();
  app.mount("#app");
});
