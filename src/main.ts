import { createApp } from "vue";
import App from "./layout/App";
import router from "@/router";
import "@/static/style/antd.less";
import "@/static/style/app.scss";

import "@/extend";
import "@/plugin/ajax";

const app = createApp(App);

app.use(router);

router.isReady().then(e => {
  app.mount("#app");
});
