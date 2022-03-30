import { createApp } from "vue";
import App from "./layout/App";
import router from "@/router";
import "@/static/style/app.scss";

import "@/extend";
import "@/plugin/ajax";
import "@/plugin/service-worker";
import { getCategoryList } from "./service/category";
import { getPlayHistory } from "./service/history";
import config from "./config";
import { initSecure } from "./helper/secure";

const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  try {
    await getCategoryList();
    getPlayHistory();
  } finally {
    app.mount("#app");
  }
});

// 防盗
if (config.isProd) {
  initSecure();
}
