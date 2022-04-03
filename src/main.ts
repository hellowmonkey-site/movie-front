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
import { getVersion } from "@tauri-apps/api/app";
import { appWindow } from "@tauri-apps/api/window";

const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  try {
    await Promise.all([
      getCategoryList(),
      getPlayHistory(),
      getVersion()
        .then(version => {
          config.isTauri = true;
          config.version = version;
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {}),
    ]).then(() => {
      if (config.isTauri) {
        appWindow.isMaximized().then(isMaximized => {
          if (!isMaximized) {
            appWindow.toggleMaximize();
          }
        });
        appWindow.setFocus();
        appWindow.setResizable(true);
        appWindow.setDecorations(true);
      }
    });
  } finally {
    app.mount("#app");
  }
});

// 防盗
if (config.isProd) {
  initSecure();
}
