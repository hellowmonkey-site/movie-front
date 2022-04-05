import { createApp } from "vue";
import App from "./layout/App";
import router from "@/router";
import "@/static/style/app.scss";

import "@/extend";
import "@/plugin/ajax";
import "@/plugin/service-worker";
import config from "./config";
import { initSecure } from "./helper/secure";
import { appWindow } from "@tauri-apps/api/window";
import { plusReady } from "./helper/plus";
import { getUserInfo } from "./service/user";

const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  try {
    await Promise.all([
      plusReady()
        .then(() => {
          config.isApp = true;
          config.isWeb = false;
          router.replace("/");
          setTimeout(() => {
            plus.navigator.closeSplashscreen();
          }, 350);
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {}),
      appWindow
        .isMaximized()
        .then(isMaximized => {
          config.isMsi = true;
          config.isWeb = false;
          if (!isMaximized) {
            appWindow.toggleMaximize();
          }
          appWindow.setFocus();
          appWindow.setResizable(true);
          appWindow.setDecorations(true);
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {}),
    ]);
    getUserInfo();
  } finally {
    app.mount("#app");
  }
});

// 防盗
if (config.isProd) {
  initSecure();
}
