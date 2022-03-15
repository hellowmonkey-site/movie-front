import { createApp } from "vue";
import App from "./layout/App";
import router from "@/router";
import "@/static/style/antd.less";
import "@/static/style/app.scss";

import "@/extend";
import "@/plugin/ajax";
import { getUserInfo, userToken } from "./service/user";

const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  if (userToken.value) {
    await getUserInfo();
  }
  app.mount("#app");
});
